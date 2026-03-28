# Google Sheets Data Collection Setup

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "CryptoMood Dash Data"
3. Add these headers in Row 1:
   - A1: `Timestamp`
   - B1: `Fear & Greed Value`
   - C1: `Fear & Greed Label`
   - D1: `Screen Width`
   - E1: `Screen Height`
   - F1: `User Agent`
   - G1: `Selected Coins`
   - H1: `Referrer`

## Step 2: Create the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the entire contents of `CODE_GS.js` from this project
4. Click **Save** (Ctrl+S) and name the project "CryptoMood Webhook"

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set the following:
   - **Description**: "CryptoMood data collector"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. Authorize the app when prompted (click through the "unsafe" warning — it's your own script)
6. **Copy the Web App URL** — it will look like: `https://script.google.com/macros/s/XXXX/exec`

## Step 4: Add the URL to the Dashboard

1. Open `js/sheets.js` and replace `GOOGLE_SHEETS_WEBHOOK_URL` with your Web App URL
2. Open `js/counter.js` and replace `GOOGLE_SHEETS_WEBHOOK_URL` with your Web App URL
3. Save and redeploy

## Testing

- Open your dashboard and click "Check Sentiment"
- Check your Google Sheet — a new row should appear with the data
- The visitor counter will also update from the Sheet data

## Troubleshooting

- **403 error**: Make sure "Who has access" is set to "Anyone"
- **No data appearing**: Check the Apps Script execution log (View > Executions in Apps Script)
- **CORS issues**: The fetch uses `mode: 'no-cors'` which should work, but the response won't be readable. The doGet endpoint is used separately for reading counts.
