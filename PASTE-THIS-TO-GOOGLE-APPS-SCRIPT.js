// ============================================================================
// FABIEN'S CRITIQUE - EMAIL CAPTURE SCRIPT
// ============================================================================
//
// INSTRUCTIONS:
// 1. Open your Google Sheet:
//    https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Click "Extensions" → "Apps Script"
// 3. DELETE everything in the editor
// 4. COPY everything below this line and PASTE it
// 5. Click "Deploy" → "New deployment"
// 6. Select type: "Web app"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone"
// 9. Click "Deploy"
// 10. Copy the deployment URL and update it in your HTML files
//
// ============================================================================

function doPost(e) {
  try {
    // Get the active spreadsheet using the ID
    const sheet = SpreadsheetApp.openById('11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns').getActiveSheet();

    // Get form data from the POST request
    const email = e.parameter.email || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'Other';

    // Find the next empty row
    let lastRow = sheet.getLastRow();

    // If sheet is completely empty or only has headers (row 1), start at row 2
    if (lastRow === 0 || lastRow === 1) {
      lastRow = 1;
    }

    // Write data to columns A, B, and C starting from row 2
    // Column A: Timestamp
    // Column B: Email
    // Column C: Source
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[
      new Date(timestamp),
      email,
      source
    ]]);

    // Log for debugging
    Logger.log('Email captured: ' + email + ' from ' + source);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'email': email,
        'source': source,
        'row': lastRow + 1
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing the endpoint)
  return ContentService.createTextOutput(
    'Email capture endpoint is working! ✅\n\n' +
    'This endpoint accepts POST requests with:\n' +
    '- email\n' +
    '- timestamp\n' +
    '- source\n\n' +
    'Spreadsheet ID: 11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns'
  );
}

// Optional: Test function to verify script works
function testEmailCapture() {
  var testData = {
    parameter: {
      email: 'test@example.com',
      timestamp: new Date().toISOString(),
      source: 'Test'
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
