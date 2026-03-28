// CODE_GS.js — Deploy this as a Google Apps Script Web App
// See SETUP_GOOGLE_SHEETS.md for deployment instructions

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                          // Timestamp
      data.fearGreedValue || '',           // Fear & Greed value
      data.fearGreedLabel || '',           // Fear & Greed label
      data.screenWidth || '',              // Screen width
      data.screenHeight || '',             // Screen height
      data.userAgent || '',                // User agent
      data.selectedCoins || '',            // Selected coins (if any)
      data.referrer || ''                  // Referrer
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var data = sheet.getDataRange().getValues();
  var totalVisitors = data.length - 1; // Exclude header
  var todayVisitors = 0;

  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][0]);
    rowDate.setHours(0, 0, 0, 0);
    if (rowDate.getTime() === today.getTime()) {
      todayVisitors++;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      today: todayVisitors,
      total: totalVisitors
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
