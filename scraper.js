/**
 * Gemini-Powered Daily Web Scraper
 * 
 * This script fetches a target webpage, extracts its text, and sends it to 
 * the Gemini 1.5 Flash API for summarization. The result is logged into the 
 * active Google Sheet.
 */

function scrapeAndAnalyzeDaily() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const url = "https://example.com"; // Replace with your target URL
  const apiKey = "YOUR_GEMINI_API_KEY"; // Get this from Google AI Studio
  
  try {
    // 1. Fetch the website content
    const response = UrlFetchApp.fetch(url);
    const html = response.getContentText();
    
    // Light cleanup to extract the body text for the prompt
    const bodyMatch = html.match(/<body[^>]*>([\w|\W]*)<\/body>/i);
    const rawText = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').substring(0, 3000) : html.substring(0, 3000);
    
    // 2. Call the Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      "contents": [{
        "parts": [{"text": `Summarize the core topic of this webpage in one short sentence: ${rawText}`}]
      }]
    };
    
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };
    
    const geminiResponse = UrlFetchApp.fetch(geminiUrl, options);
    const data = JSON.parse(geminiResponse.getContentText());
    
    // Extract the AI response
    let summary = "Summary not found";
    if (data.candidates && data.candidates.length > 0) {
      summary = data.candidates[0].content.parts[0].text.trim();
    }
    
    // 3. Log the timestamp, URL, and AI summary
    sheet.appendRow([new Date(), url, summary]);
  } catch (error) {
    sheet.appendRow([new Date(), url, "Error: " + error.message]);
  }
}
