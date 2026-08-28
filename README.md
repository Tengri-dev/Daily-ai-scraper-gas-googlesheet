# Gemini-Powered Daily Web Scraper 🤖📊

An automated Google Apps Script that scrapes a target webpage daily, analyzes its content using the **Gemini 3.6 Flash API**, and logs a summarized output directly into Google Sheets. 

This project demonstrates how to bridge Google Workspace (Sheets, Apps Script) with modern Google AI capabilities, utilizing the generous free tier of Gemini 3.6 Flash for cost-effective automation. It serves as an excellent reference for integrating lightweight AI workflows into everyday developer tools.

## Features
* **Automated Daily Scraping:** Uses Apps Script Time-driven triggers to run without manual intervention.
* **Smart Context Extraction:** Strips heavy HTML tags and truncates content to optimize LLM token usage.
* **AI Summarization:** Leverages Gemini 3.6 Flash to understand webpage context and generate concise summaries.
* **Zero-Cost Architecture:** Designed to operate well within the free tier limits of Google AI Studio.

## Setup Instructions

1. **Get a Gemini API Key:**
   * Head over to [Google AI Studio](https://aistudio.google.com/).
   * Generate a new API key.
2. **Prepare Google Sheets:**
   * Create a new Google Sheet.
   * Go to **Extensions > Apps Script**.
3. **Add the Code:**
   * Delete any existing code in the editor and paste the contents of `scraper.js`.
   * Replace `"https://example.com"` with your target URL.
   * Replace `"YOUR_GEMINI_API_KEY"` with the key from step 1.
4. **Run and Authorize:**
   * Click the **Run** button to execute the script manually for the first time.
   * Grant the necessary permissions for Apps Script to access external services (`UrlFetchApp`) and your Google Sheet.
5. **Set Up Automation (Trigger):**
   * In the Apps Script editor, click the clock icon (**Triggers**) on the left sidebar.
   * Click **+ Add Trigger**.
   * Choose `scrapeAndAnalyzeDaily` to run.
   * Select **Time-driven** for the event source, choose **Day timer**, and pick your preferred time window.

## Token Economics 🪙
This script is optimized for token economics. By using regex to extract only the `<body>` content and stripping away HTML tags, the prompt size is significantly reduced. Combined with the high rate limits and free tier of **Gemini 1.5 Flash**, this scraper can run daily at scale without incurring API costs.

## License
MIT License
