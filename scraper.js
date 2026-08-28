/**
 * Gemini-Powered Daily Web Scraper
 * 
 * This script fetches a target webpage, extracts its text, and sends it to 
 * the Gemini 1.5 Flash API for summarization. The result is logged into the 
 * active Google Sheet.
 */

function scrapeAndAnalyzeDaily() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const url = "http://url.com/"; // Replace with your target URL
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
 
  try {
    // 1. Fetch the website content
    const response = UrlFetchApp.fetch(url);
    const html = response.getContentText();
 
    // Light cleanup to extract the body text for the prompt
    const bodyMatch = html.match(/<body[^>]*>([\w|\W]*)<\/body>/i);
    const rawText = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').substring(0, 3000) : html.substring(0, 3000);
 
    // 2. Call the Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
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
    
    // DEBUG: Print the raw API response to the Apps Script Execution Log
    Logger.log(JSON.stringify(data, null, 2));
    
    // Extract the AI response or the specific API error
    let summary = "Summary not found";
    
    if (data.error) {
      summary = "API Error: " + data.error.message; // Logs the exact issue to your sheet
    } else if (data.candidates && data.candidates.length > 0) {
      summary = data.candidates[0].content.parts[0].text.trim();
    } else if (data.promptFeedback) {
      summary = "Blocked by safety settings: " + data.promptFeedback.blockReason;
    }
 
    // 3. Log the timestamp, URL, and AI summary
    sheet.appendRow([new Date(), url, summary]);
  } catch (error) {
    sheet.appendRow([new Date(), url, "Error: " + error.message]);
  }
}
