// Google Apps Script to capture emails to Google Sheets
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Click "Extensions" → "Apps Script"
// 3. Delete any existing code
// 4. Copy and paste this entire script
// 5. Click "Deploy" → "New deployment"
// 6. Select type: "Web app"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone"
// 9. Click "Deploy"
// 10. Copy the deployment URL
// 11. Update the SCRIPT_URL in index.html with your deployment URL

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.openById('11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns').getActiveSheet();

    // Get form data
    const email = e.parameter.email || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'Other';

    // Find the next empty row starting from A2
    let lastRow = sheet.getLastRow();

    // If sheet is completely empty or only has headers, start at row 2
    if (lastRow === 0 || lastRow === 1) {
      lastRow = 1;
    }

    // Format timestamp as: MM/DD/YYYY HH:MM:SS
    const date = new Date(timestamp);
    const formattedTimestamp = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

    // Add new row with data in columns A, B, and C, starting from row 2
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[
      formattedTimestamp,
      email,
      source
    ]]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'email': email, 'source': source }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService.createTextOutput('Email capture endpoint is working! Use POST to submit emails.');
}
