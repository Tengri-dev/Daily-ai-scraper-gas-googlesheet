# Gemini-Powered Daily Web Scraper 
# YC Launch Tracker & Market Intelligence with Apps Script + Gemini 🤖📊

An automated Google Apps Script pipeline that scrapes the official **Y Combinator Launches** directory daily, extracts structured company data via Google AI's Gemini API, and populates a tracking database directly into Google Sheets.

This repository demonstrates how to integrate Google Workspace tooling with generative AI models while maintaining strict security best practices and token efficiency.

---

> **Model Compatibility Note:**  
> AI model versions and endpoints evolve rapidly. If an older model string (such as `gemini-3.6-flash`) returns an error or is deprecated, update the `"model"` field in the payload or the endpoint URL to the most current version available in [Google AI Studio](https://aistudio.google.com/) at the time you run this code (e.g., `gemini-3.7-flash` or newer).

---

## Features

* **Zero-Infrastructure Automation:** Runs entirely within Google Apps Script on a daily time-driven trigger.
* **Token-Efficient Sanitization:** Strips heavy CSS/JS tags and markup before inference to optimize context window and eliminate token waste.
* **Structured JSON Output:** Forces Gemini to return clean JSON arrays with typed startup fields (`name`, `pitch`, `category`, `isAiNative`).
* **Secure Credential Handling:** Utilizes Apps Script `PropertiesService` to keep API keys encrypted and out of source control.

---

## Google Sheet Layout

Set up Row 1 of your target Google Sheet with these headers and freeze the row (**View > Freeze > 1 row**):

| Column A | Column B | Column C | Column D | Column E |
| :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | **Company Name** | **One-Sentence Pitch** | **Category** | **AI-Native?** |

---

## Setup Guide

### 1. Get a Gemini API Key
* Create or log in to your account at [Google AI Studio](https://aistudio.google.com/).
* Generate an API key.

### 2. Configure Google Sheets & Apps Script
1. Open your tracking Google Sheet.
2. Navigate to **Extensions > Apps Script**.
3. In the left sidebar, click the **Gear Icon (Project Settings)**.
4. Scroll to **Script Properties** and click **Add script property**.
5. Set the property name to `GEMINI_API_KEY` and paste your key into the value field.
6. Click **Save script properties**.

### 3. Deploy Code
1. Copy the contents of `scraper.js` into your Apps Script editor (`Code.gs`).
2. Click the **Save** icon.
3. Select `trackYCLaunchesDaily` from the function dropdown and click **Run** once to grant sheet read/write and network access permissions.

### 4. Enable Daily Trigger
1. Click the **Clock Icon (Triggers)** in the left sidebar.
2. Click **+ Add Trigger** (bottom right).
3. Set **Choose which function to run** to `trackYCLaunchesDaily`.
4. Set **Select event source** to `Time-driven`.
5. Set **Select type of time based trigger** to `Day timer`.
6. Select your preferred daily time window (e.g., 6:00 AM to 7:00 AM) and click **Save**.

---

## Token Economics & Optimization

Raw HTML feeds often contain tens of kilobytes of styling, scripts, and nested DOM wrappers. Passing uncleaned HTML to an LLM inflates prompt token overhead significantly.

This project implements a multi-step pre-filter in Apps Script:
1. Strips `<script>` and `<style>` blocks with regex.
2. Cleans remaining HTML tags and compresses excessive whitespace.
3. Bounds the extracted snippet size to retain maximum context while preserving prompt budget within the free API limits.

---
## Resources
Dev.to Article: https://dev.to/tengri_dev/track-yc-launches-on-autopilot-apps-script-gemini-36-flash-3fhj

Youtube tutorial https://www.youtube.com/watch?v=JQOSm3Xal8Q

## License

[MIT](LICENSE)
