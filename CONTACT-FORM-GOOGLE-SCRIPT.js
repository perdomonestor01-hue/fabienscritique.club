// ============================================================================
// FABIEN'S CRITIQUE - CONTACT FORM BACKEND (Google Apps Script)
// ============================================================================
//
// INSTRUCTIONS:
// 1. Open your Google Sheet (same as email capture, or create new):
//    https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Add a new sheet tab called "Contact Messages"
// 3. Add headers in row 1: Timestamp | Name | Email | Message | Status
// 4. Click "Extensions" > "Apps Script"
// 5. Add this as a new file (contact.gs) or merge with existing
// 6. Deploy: "Deploy" > "Manage deployments" > Edit > Deploy
// 7. Copy the Web App URL and update index.html
//
// ============================================================================

// Configuration
const CONTACT_SHEET_NAME = 'Contact Messages';

function doPostContact(e) {
  try {
    const ss = SpreadsheetApp.openById('11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns');
    let sheet = ss.getSheetByName(CONTACT_SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONTACT_SHEET_NAME);
      sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Name', 'Email', 'Message', 'Status']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const message = e.parameter.message || '';
    const timestamp = new Date();

    const formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

    // Append the message
    sheet.appendRow([formattedTimestamp, name, email, message, 'New']);

    // Send notification email to Fabien
    sendContactNotification(name, email, message, formattedTimestamp);

    // Send confirmation to user
    sendContactConfirmation(name, email);

    Logger.log('Contact form received from: ' + email);

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Your message has been received!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Contact form error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendContactNotification(name, email, message, timestamp) {
  try {
    const subject = "New Contact Form Message - Fabien's Critique";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d0d0d; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #d97706, #b45309); padding: 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 32px; }
        .field { margin-bottom: 20px; }
        .field-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .field-value { color: #ffffff; font-size: 16px; background: #262626; padding: 12px; border-radius: 8px; border-left: 3px solid #d97706; }
        .message-box { white-space: pre-wrap; line-height: 1.6; }
        .footer { padding: 20px 32px; background: #0d0d0d; text-align: center; color: #666; font-size: 12px; }
        .reply-btn { display: inline-block; background: #d97706; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Message</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Received</div>
                <div class="field-value">${timestamp}</div>
            </div>
            <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${name}</div>
            </div>
            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${email}</div>
            </div>
            <div class="field">
                <div class="field-label">Message</div>
                <div class="field-value message-box">${message}</div>
            </div>
            <center>
                <a href="mailto:${email}?subject=Re: Your message to Fabien's Critique" class="reply-btn">Reply to ${name}</a>
            </center>
        </div>
        <div class="footer">
            This message was sent via fabienscritique.club contact form
        </div>
    </div>
</body>
</html>`;

    const plainBody = `
NEW CONTACT FORM MESSAGE
========================

Received: ${timestamp}
From: ${name}
Email: ${email}

Message:
${message}

---
Reply to: ${email}
`;

    MailApp.sendEmail({
      to: 'fabienscritique@gmail.com',
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: "Fabien's Critique Website"
    });

    Logger.log('Notification email sent');

  } catch (error) {
    Logger.log('Error sending notification: ' + error.toString());
  }
}

function sendContactConfirmation(name, email) {
  try {
    const subject = "We received your message! - Fabien's Critique";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d0d0d; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #d97706, #b45309); padding: 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .content { padding: 32px; color: #e6e6e6; line-height: 1.8; }
        .content p { margin-bottom: 16px; }
        .highlight { background: #262626; padding: 20px; border-radius: 8px; border-left: 3px solid #d97706; margin: 24px 0; }
        .footer { padding: 24px 32px; background: #0d0d0d; text-align: center; color: #666; font-size: 12px; }
        .cta { display: inline-block; background: #d97706; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Message Received!</h1>
        </div>
        <div class="content">
            <p>Hey ${name}!</p>
            <p>Thanks for reaching out. I've received your message and will get back to you as soon as possible.</p>
            <div class="highlight">
                <strong style="color: #d97706;">What to expect:</strong><br><br>
                I personally read and respond to every message. You can expect a response within <strong style="color: #fff;">24-48 hours</strong>.
            </div>
            <p>In the meantime, feel free to check out my latest reviews and content:</p>
            <center>
                <a href="https://fabienscritique.club" class="cta">Visit Website</a>
            </center>
        </div>
        <div class="footer">
            <p>This is an automated confirmation from fabienscritique.club</p>
            <p>No BS. Just Real Experiences.</p>
        </div>
    </div>
</body>
</html>`;

    const plainBody = `
Hey ${name}!

Thanks for reaching out. I've received your message and will get back to you as soon as possible.

What to expect:
I personally read and respond to every message. You can expect a response within 24-48 hours.

In the meantime, feel free to check out my latest reviews at fabienscritique.club

---
Fabien's Critique
No BS. Just Real Experiences.
`;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: "Fabien's Critique"
    });

    Logger.log('Confirmation email sent to: ' + email);

  } catch (error) {
    Logger.log('Error sending confirmation: ' + error.toString());
  }
}

// Test function
function testContactForm() {
  const testData = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from the contact form.'
    }
  };

  const result = doPostContact(testData);
  Logger.log('Test result: ' + result.getContent());
}

// Add this to your existing doPost if you want to handle both email capture and contact
// Or deploy as separate endpoint
function doPost(e) {
  const type = e.parameter.type || 'email';

  if (type === 'contact') {
    return doPostContact(e);
  } else {
    // Existing email capture logic
    // ... (keep your existing doPost code here)
  }
}
