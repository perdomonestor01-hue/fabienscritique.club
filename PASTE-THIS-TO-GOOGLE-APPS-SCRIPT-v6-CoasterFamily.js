// ============================================================================
// RIDING TOGETHER (fabienscritique.club) — WELCOME EMAIL v6 · COASTER FAMILY
// ============================================================================
//
// WHAT THIS DOES
// - Receives the email from the site's video gate (POST: email, timestamp, source)
// - Logs it to your Google Sheet (columns: timestamp | email | source)
// - Automatically sends a warm, personal welcome email (light coaster theme,
//   Fabien's voice) FROM the Google account that owns this script
//   (should be fabienscritique@gmail.com).
//
// HOW TO INSTALL (replaces the old v5 "reviews club" email)
// 1. Open your Google Sheet:
//    https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Extensions -> Apps Script
// 3. Select ALL existing code and DELETE it
// 4. Paste EVERYTHING from this file
// 5. Save. Then Deploy -> Manage deployments -> (edit the existing Web App) ->
//    Version: "New version" -> Deploy. (Keeping the same deployment keeps your
//    existing /exec URL, so the website needs no change.)
// 6. Run once: select "testWelcomeEmail" in the function dropdown -> Run.
//    Approve the Gmail permission prompt. Check that the test email arrives.
//
// NOTE: The website posts source = "Video Gate".
// ============================================================================

var SHEET_ID = '11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns';
var SITE_URL = 'https://fabienscritique.club';
var YT_URL = 'https://www.youtube.com/@FabiensCritique';
var FROM_NAME = 'Fabien';

// Guard against spreadsheet formula injection: a value starting with = + - @
// is treated as a live formula by Sheets, so prefix it with a single quote.
function sheetSafe(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var email = (e.parameter.email || '').trim();
    var source = (e.parameter.source || 'Other').toString().slice(0, 60);

    // The Web App is public — validate before touching the sheet or the mailer.
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Timestamp guard: a bad string must not abort the row append.
    var date = new Date(e.parameter.timestamp || '');
    if (isNaN(date.getTime())) date = new Date();
    var formatted = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

    // Dedup: only welcome first-timers (localStorage on the site only covers one browser).
    var lastRow = sheet.getLastRow();
    var existing = lastRow > 1 ? sheet.getRange(2, 2, lastRow - 1, 1).getValues() : [];
    var isDupe = existing.some(function (r) { return String(r[0]).trim().toLowerCase() === email.toLowerCase(); });

    // Always record the row (audit trail), even on a duplicate.
    sheet.getRange((lastRow < 1 ? 1 : lastRow) + 1, 1, 1, 3)
      .setValues([[formatted, sheetSafe(email), sheetSafe(source)]]);

    if (!isDupe) sendWelcomeEmail(email);

    Logger.log('Captured: ' + email + ' (' + source + ') dupe=' + isDupe);
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendWelcomeEmail(email) {
  try {
    if (MailApp.getRemainingDailyQuota() < 1) { Logger.log('MailApp quota exhausted; skipped welcome to ' + email); return; }
    var subject = "Welcome aboard 🎢 — glad you're riding with us";

    var htmlBody = ''
+ '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
+ '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
+ '<meta name="x-apple-disable-message-reformatting">'
+ '<style>@media only screen and (max-width:600px){.container{width:100%!important}.pad{padding:28px 22px!important}.h1{font-size:28px!important}}</style>'
+ '</head><body style="margin:0;padding:0;background:#fff2ea;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">'
+ '<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#fff2ea;opacity:0;">You\'re in — all 7 of our roller-coaster rides are unlocked. Hands up! 🎢</div>'
+ '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff2ea;padding:24px 0;"><tr><td align="center">'
+ '<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="max-width:600px;width:100%;background:#fffaf6;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px -18px rgba(36,26,46,.35);">'

// Header
+ '<tr><td class="pad" style="padding:44px 40px 26px;text-align:center;background:linear-gradient(135deg,#d6390f 0%,#ff7a3c 100%);">'
+ '<div style="font-size:44px;line-height:1;">🎢</div>'
+ '<h1 class="h1" style="margin:14px 0 6px;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-.5px;">Welcome aboard!</h1>'
+ '<p style="margin:0;font-size:16px;color:rgba(255,255,255,.95);">You just grabbed a front-row seat.</p>'
+ '</td></tr>'

// Letter
+ '<tr><td class="pad" style="padding:34px 40px 8px;">'
+ '<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:19px;line-height:1.5;color:#241a2e;">Hey — it\'s Fabien. 👋</p>'
+ '<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#4a4258;">Thanks for jumping in. Quick note so you know who you just signed up to ride with: I\'m a single dad, and roller coasters became the thing my little one and I do to get through the hard days. We ride, we film every single drop, and we watch it back on the couch later going, <em>"we actually did that."</em></p>'
+ '<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#4a4258;">Here\'s the part I really care about: she went from genuinely <strong style="color:#241a2e;">terrified</strong> of heights to <strong style="color:#241a2e;">(mostly!) loving it</strong> — and that took <strong style="color:#d6390f;">ten months, not two days</strong>. Real confidence is slow. Showing that honest process, one drop at a time, is the whole point of what we do.</p>'
+ '<p style="margin:0 0 8px;font-family:Georgia,serif;font-size:16px;line-height:1.75;color:#4a4258;">All of our rides are unlocked for you now. Grab a seat, hands up, and enjoy. 🙌</p>'
+ '</td></tr>'

// CTA buttons
+ '<tr><td class="pad" style="padding:18px 40px 8px;text-align:center;">'
+ '<a href="' + SITE_URL + '/#videos" style="display:inline-block;background:#d6390f;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:999px;font-size:15px;font-weight:800;letter-spacing:.02em;box-shadow:0 10px 22px -8px rgba(214,57,15,.7);">▶ Watch our rides</a>'
+ '</td></tr>'
+ '<tr><td style="padding:6px 40px 30px;text-align:center;">'
+ '<a href="' + YT_URL + '" style="display:inline-block;color:#0e8c82;text-decoration:none;font-size:14px;font-weight:700;">Or subscribe on YouTube →</a>'
+ '</td></tr>'

// Divider + sign-off
+ '<tr><td style="padding:0 40px;"><div style="border-top:1px solid #ffd0bb;height:1px;"></div></td></tr>'
+ '<tr><td class="pad" style="padding:24px 40px 30px;">'
+ '<p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:#241a2e;">— Fabien</p>'
+ '<p style="margin:2px 0 0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8189a6;">and my little co-pilot</p>'
+ '</td></tr>'

// Footer
+ '<tr><td style="padding:22px 40px 30px;background:#fff2ea;text-align:center;">'
+ '<p style="margin:0 0 10px;font-size:12px;color:#8189a6;line-height:1.6;">You\'re getting this because you unlocked our videos at <a href="' + SITE_URL + '" style="color:#d6390f;text-decoration:none;">fabienscritique.club</a>. No spam, ever.</p>'
+ '<a href="mailto:fabienscritique@gmail.com?subject=Unsubscribe" style="color:#8189a6;text-decoration:underline;font-size:12px;">Unsubscribe</a>'
+ '<p style="margin:14px 0 0;font-size:12px;color:#a99;">© 2026 Riding Together 🎢</p>'
+ '</td></tr>'

+ '</table></td></tr></table></body></html>';

    var plainBody = ''
+ "Welcome aboard! 🎢\n\n"
+ "Hey — it's Fabien.\n\n"
+ "Thanks for jumping in. I'm a single dad, and roller coasters became the thing my little one and I do to get through the hard days. We ride, we film every drop, and we watch it back later going 'we actually did that.'\n\n"
+ "She went from genuinely terrified of heights to (mostly!) loving it — and that took ten months, not two days. Real confidence is slow. Showing that honest process is the whole point of what we do.\n\n"
+ "All of our rides are unlocked for you now:\n" + SITE_URL + "/#videos\n\n"
+ "Subscribe on YouTube: " + YT_URL + "\n\n"
+ "— Fabien (and my little co-pilot)\n\n"
+ "You're getting this because you unlocked our videos at fabienscritique.club. Unsubscribe: fabienscritique@gmail.com\n"
+ "© 2026 Riding Together";

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: FROM_NAME
    });

    Logger.log('Welcome email sent to: ' + email);
  } catch (error) {
    Logger.log('Error sending welcome email: ' + error.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Riding Together — welcome endpoint ACTIVE ✅ (v6 coaster family)');
}

function testWelcomeEmail() {
  // Change this to your own address to preview the email in your inbox.
  sendWelcomeEmail('fabienscritique@gmail.com');
  Logger.log('Test welcome email sent.');
}
