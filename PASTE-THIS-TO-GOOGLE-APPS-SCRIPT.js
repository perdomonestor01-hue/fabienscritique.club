// ============================================================================
// FABIEN'S CRITIQUE - EMAIL CAPTURE SCRIPT WITH AUTO-WELCOME EMAIL
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

    // Format timestamp as: MM/DD/YYYY HH:MM:SS
    const date = new Date(timestamp);
    const formattedTimestamp = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

    // Write data to columns A, B, and C starting from row 2
    // Column A: Timestamp (formatted as MM/DD/YYYY HH:MM:SS)
    // Column B: Email
    // Column C: Source
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[
      formattedTimestamp,
      email,
      source
    ]]);

    // Send welcome email immediately
    sendWelcomeEmail(email, source);

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

/**
 * Sends welcome email to new subscriber
 * @param {string} email - Subscriber's email address
 * @param {string} source - Where they found us (YouTube, Facebook, etc.)
 */
function sendWelcomeEmail(email, source) {
  try {
    // Email subject
    const subject = "Welcome to Fabien's Critique Club! 🎢";

    // Get source display name
    const sourceDisplay = getSourceDisplayName(source);

    // Email body (HTML)
    const htmlBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1a1a; color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #d97706; margin: 0 0 10px 0;">Welcome to Fabien's Critique Club!</h1>
            <p style="font-size: 18px; margin: 0; color: #e5e5e5;">Where people are interested in hearing and reading real reviews</p>
          </div>

          <div style="background: #f5f5f5; padding: 30px; border-radius: 8px; border-left: 4px solid #d97706;">
            <p style="margin-top: 0;">Hey there! 👋</p>

            <p>Thanks for joining us from <strong>${sourceDisplay}</strong>! You're now part of a community that values authentic experiences over sponsored BS.</p>

            <p>Here's what you can expect:</p>
            <ul style="padding-left: 20px;">
              <li><strong>Real reviews</strong> - No actors, just genuine reactions</li>
              <li><strong>Authentic videos</strong> - Rush of adrenaline, screams, and yes, some cursing here and there (sorry, guys!)</li>
              <li><strong>Honest opinions</strong> - Going 70-80 mph / 112-128 km/h on roller coasters brings out the truth!</li>
              <li><strong>No sponsorships</strong> - Just products and experiences that either work or don't</li>
            </ul>

            <p><strong>Make sure to check your inbox</strong> for updates on new reviews, blog posts, and exclusive content.</p>

            <div style="background: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">What's New?</h3>
              <p style="margin-bottom: 0;">
                🎢 Latest Six Flags Fright Fest Review<br>
                🥾 North Face Gear Testing<br>
                🚴 Budget vs Premium Cycling Tech<br>
                📝 New Blog: How Theme Parks Manipulate Your Experience
              </p>
            </div>

            <p>Visit <a href="https://fabienscritique.club" style="color: #d97706; text-decoration: none; font-weight: bold;">fabienscritique.club</a> anytime to check out the latest content.</p>

            <p style="margin-bottom: 0;">Welcome aboard! 🚀</p>
            <p style="margin-top: 5px;"><strong>- Fabien</strong></p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Fabien's Critique | Honest Reviews, No BS</p>
            <p style="margin: 5px 0;">
              <a href="https://fabienscritique.club" style="color: #d97706; text-decoration: none;">Website</a> •
              <a href="https://fabienscritique.club/blog" style="color: #d97706; text-decoration: none;">Blog</a> •
              <a href="https://fabienscritique.club/#reviews" style="color: #d97706; text-decoration: none;">Reviews</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // Plain text version (fallback)
    const plainBody = `
Welcome to Fabien's Critique Club!

Thanks for joining us from ${sourceDisplay}! You're now part of a community that values authentic experiences over sponsored BS.

Here's what you can expect:

• REAL REVIEWS - No actors, just genuine reactions
• AUTHENTIC VIDEOS - Rush of adrenaline, screams, and yes, some cursing here and there (sorry, guys!)
• HONEST OPINIONS - Going 70-80 mph / 112-128 km/h on roller coasters brings out the truth!
• NO SPONSORSHIPS - Just products and experiences that either work or don't

Make sure to check your inbox for updates on new reviews, blog posts, and exclusive content.

What's New?
🎢 Latest Six Flags Fright Fest Review
🥾 North Face Gear Testing
🚴 Budget vs Premium Cycling Tech
📝 New Blog: How Theme Parks Manipulate Your Experience

Visit https://fabienscritique.club anytime to check out the latest content.

Welcome aboard!
- Fabien

---
Fabien's Critique | Honest Reviews, No BS
fabienscritique.club
    `;

    // Send the email
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: "Fabien's Critique"
    });

    Logger.log('Welcome email sent to: ' + email);

  } catch (error) {
    Logger.log('Error sending welcome email: ' + error.toString());
    // Don't throw error - we still want the main function to succeed even if email fails
  }
}

/**
 * Convert source code to display name
 * @param {string} source - Source identifier
 * @return {string} - Human-readable source name
 */
function getSourceDisplayName(source) {
  const sourceMap = {
    'YouTube': 'YouTube',
    'Facebook': 'Facebook',
    'Instagram': 'Instagram',
    'X': 'X (Twitter)',
    'Reddit': 'Reddit',
    'Other': 'the web'
  };

  return sourceMap[source] || source;
}

function doGet(e) {
  // Handle GET requests (for testing the endpoint)
  return ContentService.createTextOutput(
    'Email capture endpoint is working! ✅\n\n' +
    'This endpoint accepts POST requests with:\n' +
    '- email\n' +
    '- timestamp\n' +
    '- source\n\n' +
    'Spreadsheet ID: 11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns\n\n' +
    'Auto-welcome emails: ENABLED ✉️'
  );
}

// Optional: Test function to verify script works
function testEmailCapture() {
  var testData = {
    parameter: {
      email: 'test@example.com',
      timestamp: new Date().toISOString(),
      source: 'YouTube'
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}

// Optional: Test welcome email only
function testWelcomeEmail() {
  sendWelcomeEmail('nfabianperdomo@gmail.com', 'YouTube');
  Logger.log('Test welcome email sent!');
}
