/**
 * Daily YC Launch Tracker with Apps Script & Gemini
 * Scrapes Y Combinator's launch feed, extracts top recent launches,
 * and logs structured company intelligence directly into Google Sheets.
 */
function trackYCLaunchesDaily() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const url = "https://www.ycombinator.com/launches";
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in Script Properties.");
  }

  try {
    // 1. Fetch YC Launches HTML
    const response = UrlFetchApp.fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AppsScriptYCScraper/1.0)" }
    });
    const html = response.getContentText();

    // 2. Light cleanup to strip script/style tags and compress text for token efficiency
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');

    const pageSnippet = cleanHtml.substring(0, 8000);

    // 3. Call Gemini Interactions API with structured JSON output request
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`;
    const prompt = `Analyze this raw text from Y Combinator's launches page. Extract the latest 3 to 5 featured startup launches from the past 30 days.
Return ONLY a valid JSON array of objects with the following keys:
- "name": Company name
- "pitch": One-sentence value proposition
- "category": Target domain/industry (e.g., Developer Tools, Fintech, Healthcare, B2B SaaS)
- "isAiNative": "Yes" or "No"

Raw Text:
${pageSnippet}`;

    const payload = {
      "model": "gemini-3.7-flash",
      "input": prompt,
      "response_mime_type": "application/json"
    };

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    const geminiResponse = UrlFetchApp.fetch(geminiUrl, options);
    const data = JSON.parse(geminiResponse.getContentText());

    if (data.error) {
      sheet.appendRow([new Date(), "API Error", data.error.message, "", ""]);
      return;
    }

    const outputText = data.output_text || (data.candidates && data.candidates[0]?.content?.parts[0]?.text);
    if (!outputText) {
      sheet.appendRow([new Date(), "Parse Error", "No output returned from Gemini", "", ""]);
      return;
    }

    // 4. Parse the AI-generated JSON and append each company as a row
    const cleanJson = outputText.replace(/```json|```/g, '').trim();
    const startups = JSON.parse(cleanJson);

    const timestamp = new Date();
    startups.forEach(startup => {
      sheet.appendRow([
        timestamp,
        startup.name || "N/A",
        startup.pitch || "N/A",
        startup.category || "N/A",
        startup.isAiNative || "N/A"
      ]);
    });

  } catch (error) {
    sheet.appendRow([new Date(), "Execution Error", error.message, "", ""]);
  }
}
