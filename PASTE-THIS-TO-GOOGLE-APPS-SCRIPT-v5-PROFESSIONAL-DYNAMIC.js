// ============================================================================
// FABIEN'S CRITIQUE - PROFESSIONAL DYNAMIC WELCOME EMAIL (v5)
// ============================================================================
//
// ✨ NEW IN V5:
// - Sophisticated dark social media colors (professional)
// - Strategic animations (subtle, not overwhelming)
// - Better readability & contrast (WCAG AA compliant)
// - Email client optimized (works in Gmail, Outlook, Apple Mail)
// - Mobile responsive design
// - Preheader text for inbox preview
//
// INSTRUCTIONS:
// 1. Open your Google Sheet:
//    https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Click "Extensions" → "Apps Script"
// 3. DELETE everything in the editor
// 4. COPY everything from this file and PASTE it
// 5. Click "Deploy" → "Manage deployments" → Edit → Deploy
// 6. Your professional dynamic email is now LIVE! 🎨
//
// ============================================================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns').getActiveSheet();
    const email = e.parameter.email || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'Other';

    let lastRow = sheet.getLastRow();
    if (lastRow === 0 || lastRow === 1) {
      lastRow = 1;
    }

    const date = new Date(timestamp);
    const formattedTimestamp = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

    sheet.getRange(lastRow + 1, 1, 1, 3).setValues([[formattedTimestamp, email, source]]);

    sendWelcomeEmail(email, source);

    Logger.log('Email captured: ' + email + ' from ' + source);

    return ContentService.createTextOutput(JSON.stringify({
        'result': 'success',
        'email': email,
        'source': source,
        'row': lastRow + 1
      })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendWelcomeEmail(email, source) {
  try {
    const subject = "Welcome to Fabien's Critique Club! ⭐";
    const sourceDisplay = getSourceDisplayName(source);

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Email client reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

        /* Strategic animations - subtle and professional */
        @keyframes subtleGlow {
            0%, 100% { box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4); }
            50% { box-shadow: 0 6px 20px rgba(217, 119, 6, 0.6); }
        }

        @keyframes gentleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
        }

        @keyframes softPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Mobile responsive styles */
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .section-padding { padding: 24px 20px !important; }
            .header-padding { padding: 40px 24px 28px !important; }

            .social-card-cell {
                display: block !important;
                width: 100% !important;
                padding: 0 0 12px 0 !important;
            }

            .value-card-cell {
                display: block !important;
                width: 100% !important;
                padding: 0 0 12px 0 !important;
            }

            .main-heading { font-size: 28px !important; line-height: 1.2 !important; }
            .section-heading { font-size: 22px !important; }
            .card-title { font-size: 16px !important; }
            .button { padding: 14px 28px !important; font-size: 14px !important; min-width: 200px !important; }

            .footer-link { display: block !important; margin: 8px 0 !important; }
            .footer-separator { display: none !important; }

            .logo-container { width: 64px !important; }
            .logo-icon { font-size: 32px !important; padding: 12px !important; }
        }

        @media only screen and (max-width: 480px) {
            .main-heading { font-size: 24px !important; }
            .section-heading { font-size: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

    <!-- Preheader text (shows in inbox preview) -->
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #0d0d0d; opacity: 0;">
        Welcome to Fabien's Critique Club - honest reviews, no sponsorships, real experiences from real people
        ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌
    </div>

    <!-- Email Container -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0d0d0d; padding: 20px 0;">
        <tr>
            <td align="center">

                <!-- Main Content Wrapper -->
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8);">

                    <!-- Header Section -->
                    <tr>
                        <td class="header-padding" style="padding: 48px 40px 32px; text-align: center; background-color: #1a1a1a; background-image: linear-gradient(135deg, #1a1a1a 0%, #262626 50%, #1a1a1a 100%);">

                            <!-- Logo Icon with gentle animation -->
                            <table role="presentation" width="80" cellspacing="0" cellpadding="0" border="0" class="logo-container" style="margin: 0 auto 24px;">
                                <tr>
                                    <td class="logo-icon" style="background-color: #d97706; border-radius: 16px; text-align: center; padding: 16px; font-size: 40px; line-height: 1; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.5), 0 2px 4px rgba(217, 119, 6, 0.3); animation: subtleGlow 3s ease-in-out infinite;">
                                        <span role="img" aria-label="star" style="animation: gentleFloat 3s ease-in-out infinite; display: inline-block;">⭐</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Main Heading -->
                            <h1 class="main-heading" style="margin: 0 0 12px; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">
                                Welcome to<br>Fabien's Critique Club!
                            </h1>

                            <!-- Subtitle -->
                            <p style="margin: 0; font-size: 18px; color: #cccccc; line-height: 1.5; font-weight: 400;">
                                Where people are interested in hearing<br>and reading <span style="color: #d97706; font-weight: 600;">real reviews</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Welcome Message -->
                    <tr>
                        <td class="section-padding" style="padding: 32px 40px; background-color: #1a1a1a;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 24px; background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 12px; border-left: 4px solid #d97706; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                        <p style="margin: 0 0 16px; font-size: 16px; color: #e6e6e6; line-height: 1.8;">
                                            Hey there! <span role="img" aria-label="waving hand">👋</span>
                                        </p>
                                        <p style="margin: 0 0 16px; font-size: 16px; color: #e6e6e6; line-height: 1.8;">
                                            Thanks for joining from <strong style="color: #ffffff;">${sourceDisplay}</strong>! You're part of a community that values <strong style="color: #ffffff;">honest feedback</strong> over paid promotions.
                                        </p>
                                        <p style="margin: 0; font-size: 16px; color: #e6e6e6; line-height: 1.8;">
                                            No fluff. No BS. Just real experiences from real people.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Value Props (4 Cards in 2x2 Grid) -->
                    <tr>
                        <td class="section-padding" style="padding: 0 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <!-- Row 1 -->
                                <tr>
                                    <td width="50%" class="value-card-cell" style="padding: 0 6px 12px 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                    <div style="font-size: 28px; margin-bottom: 8px;"><span role="img" aria-label="checkmark">✓</span></div>
                                                    <div class="card-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">Real Reviews</div>
                                                    <div style="font-size: 13px; color: #cccccc; line-height: 1.4;">Authentic experiences, no filter</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" class="value-card-cell" style="padding: 0 0 12px 6px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                    <div style="font-size: 28px; margin-bottom: 8px;"><span role="img" aria-label="video camera">🎥</span></div>
                                                    <div class="card-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">Authentic Videos</div>
                                                    <div style="font-size: 13px; color: #cccccc; line-height: 1.4;">Raw, unedited reactions</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Row 2 -->
                                <tr>
                                    <td width="50%" class="value-card-cell" style="padding: 0 6px 0 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                    <div style="font-size: 28px; margin-bottom: 8px;"><span role="img" aria-label="speech bubble">💬</span></div>
                                                    <div class="card-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">Honest Opinions</div>
                                                    <div style="font-size: 13px; color: #cccccc; line-height: 1.4;">Good, bad, and ugly</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" class="value-card-cell" style="padding: 0 0 0 6px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                    <div style="font-size: 28px; margin-bottom: 8px;"><span role="img" aria-label="no entry">🚫</span></div>
                                                    <div class="card-title" style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">No Sponsorships</div>
                                                    <div style="font-size: 13px; color: #cccccc; line-height: 1.4;">100% independent</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="border-top: 2px solid #3a3a3a; height: 2px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Social CTAs Section - PROFESSIONAL DARK COLORS -->
                    <tr>
                        <td class="section-padding" style="padding: 40px 40px 32px;">
                            <h2 class="section-heading" style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.8px;">
                                Join the Conversation
                            </h2>
                            <p style="margin: 0 0 32px; font-size: 15px; color: #cccccc; text-align: center; line-height: 1.5;">
                                Connect with us on your favorite platform
                            </p>

                            <!-- Social Platform Cards - 2x2 Grid -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <!-- Row 1: YouTube & Facebook -->
                                <tr>
                                    <!-- YouTube Card - Dark Professional Red -->
                                    <td width="50%" class="social-card-cell" style="padding: 0 8px 16px 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #8B0000; background-image: linear-gradient(135deg, #8B0000 0%, #660000 100%); border-radius: 10px; padding: 20px; box-shadow: 0 6px 16px rgba(139, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 32px; margin-bottom: 10px; animation: softPulse 3s ease-in-out infinite; display: inline-block;"><span role="img" aria-label="play button">▶️</span></div>
                                                                <div style="font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);">YouTube</div>
                                                                <div style="font-size: 12px; color: rgba(255,255,255,0.85); margin-bottom: 14px; line-height: 1.4;">Watch honest video reviews</div>
                                                                <a href="https://youtube.com/@Fabienscritique" class="button" style="display: inline-block; background-color: #e8e8e8; background-image: linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%); color: #8B0000; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);">
                                                                    Subscribe
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Facebook Card - Dark Professional Blue -->
                                    <td width="50%" class="social-card-cell" style="padding: 0 0 16px 8px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #0C5EC7; background-image: linear-gradient(135deg, #0C5EC7 0%, #083D82 100%); border-radius: 10px; padding: 20px; box-shadow: 0 6px 16px rgba(12, 94, 199, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 32px; margin-bottom: 10px; animation: softPulse 3.2s ease-in-out infinite; display: inline-block;"><span role="img" aria-label="thumbs up">👍</span></div>
                                                                <div style="font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);">Facebook</div>
                                                                <div style="font-size: 12px; color: rgba(255,255,255,0.85); margin-bottom: 14px; line-height: 1.4;">Join community discussions</div>
                                                                <a href="https://facebook.com/fabienscritique" class="button" style="display: inline-block; background-color: #e8e8e8; background-image: linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%); color: #0C5EC7; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);">
                                                                    Follow
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Row 2: Reddit & Instagram -->
                                <tr>
                                    <!-- Reddit Card - Dark Professional Orange -->
                                    <td width="50%" class="social-card-cell" style="padding: 0 8px 0 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #CC3700; background-image: linear-gradient(135deg, #CC3700 0%, #992800 100%); border-radius: 10px; padding: 20px; box-shadow: 0 6px 16px rgba(204, 55, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 32px; margin-bottom: 10px; animation: softPulse 3.5s ease-in-out infinite; display: inline-block;"><span role="img" aria-label="fire">🔥</span></div>
                                                                <div style="font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);">Reddit</div>
                                                                <div style="font-size: 12px; color: rgba(255,255,255,0.85); margin-bottom: 14px; line-height: 1.4;">Deep dive discussions</div>
                                                                <a href="https://reddit.com/r/FabienscritiqueUTube" class="button" style="display: inline-block; background-color: #e8e8e8; background-image: linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%); color: #CC3700; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);">
                                                                    Join
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Instagram Card - Dark Professional Magenta/Purple -->
                                    <td width="50%" class="social-card-cell" style="padding: 0 0 0 8px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background-color: #8B2855; background-image: linear-gradient(135deg, #8B2855 0%, #4A1B6F 100%); border-radius: 10px; padding: 20px; box-shadow: 0 6px 16px rgba(139, 40, 85, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 32px; margin-bottom: 10px; animation: softPulse 3.8s ease-in-out infinite; display: inline-block;"><span role="img" aria-label="camera">📸</span></div>
                                                                <div style="font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);">Instagram</div>
                                                                <div style="font-size: 12px; color: rgba(255,255,255,0.85); margin-bottom: 14px; line-height: 1.4;">Behind-the-scenes content</div>
                                                                <a href="https://instagram.com/fabienscritique" class="button" style="display: inline-block; background-color: #e8e8e8; background-image: linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%); color: #8B2855; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);">
                                                                    Follow
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="border-top: 2px solid #3a3a3a; height: 2px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- What's New Section -->
                    <tr>
                        <td class="section-padding" style="padding: 40px 40px 32px;">
                            <h2 class="section-heading" style="margin: 0 0 24px; font-size: 26px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.8px;">
                                What's New <span role="img" aria-label="target">🎯</span>
                            </h2>

                            <!-- Content Item 1 -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <table role="presentation" width="60" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="width: 60px; height: 60px; background-color: #d97706; background-image: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; text-align: center; font-size: 28px; line-height: 60px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);">
                                                                <span role="img" aria-label="roller coaster">🎢</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Latest: Six Flags Fright Fest Review</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">Honest look at the inaugural event - scares, crowds, and value analysis.</div>
                                                    <a href="https://fabienscritique.club/#reviews" style="display: inline-block; color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">
                                                        Read Review →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Content Item 2 -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <table role="presentation" width="60" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="width: 60px; height: 60px; background-color: #d97706; background-image: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; text-align: center; font-size: 28px; line-height: 60px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);">
                                                                <span role="img" aria-label="hiking boot">🥾</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Testing: North Face Gear Durability</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">Real-world testing results on boots and jackets. The good, bad, and ugly.</div>
                                                    <a href="https://fabienscritique.club/#reviews" style="display: inline-block; color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">
                                                        See Results →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Content Item 3 -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background-color: #262626; background-image: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <table role="presentation" width="60" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="width: 60px; height: 60px; background-color: #d97706; background-image: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; text-align: center; font-size: 28px; line-height: 60px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);">
                                                                <span role="img" aria-label="memo">📝</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Blog: Why Most Reviews Are Garbage</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">How affiliate links and sponsorships destroyed honest product reviews.</div>
                                                    <a href="https://fabienscritique.club/blog" style="display: inline-block; color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">
                                                        Read Article →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer CTA -->
                    <tr>
                        <td class="section-padding" style="padding: 32px 40px; background-color: #1a1a1a; background-image: linear-gradient(135deg, #1a1a1a 0%, #262626 50%, #1a1a1a 100%); text-align: center;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #e6e6e6; line-height: 1.7;">
                                <strong style="color: #ffffff;">P.S.</strong> Whitelist this email so you never miss updates.<br>
                                Each week I share exclusive insights that don't make it to social media!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer Links -->
                    <tr>
                        <td class="section-padding" style="padding: 32px 40px; background-color: #0d0d0d; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <a href="https://fabienscritique.club" class="footer-link" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">Website</a>
                                        <span class="footer-separator" style="color: #4a4a4a;">|</span>
                                        <a href="https://fabienscritique.club/#about" class="footer-link" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">About</a>
                                        <span class="footer-separator" style="color: #4a4a4a;">|</span>
                                        <a href="https://fabienscritique.club/#contact" class="footer-link" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">Contact</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <p style="margin: 0; font-size: 13px; color: #b3b3b3; line-height: 1.7;">
                                            You're receiving this because you joined from ${sourceDisplay}.<br>
                                            We'll only send you the good stuff - no spam, ever.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="mailto:fabienscritique@gmail.com?subject=Unsubscribe" style="color: #d97706; text-decoration: underline; font-size: 12px;">
                                            Unsubscribe
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 24px;">
                                        <p style="margin: 0; font-size: 12px; color: #888888; line-height: 1.6;">
                                            © 2025 Fabien's Critique Club. All rights reserved.<br>
                                            Honest Reviews, No BS.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- End Main Content Wrapper -->

            </td>
        </tr>
    </table>
    <!-- End Email Container -->

</body>
</html>
    `;

    const plainBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WELCOME TO FABIEN'S CRITIQUE CLUB! ⭐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hey there! 👋

Thanks for joining from ${sourceDisplay}! You're part of a community that values honest feedback over paid promotions.

No fluff. No BS. Just real experiences from real people.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOIN THE CONVERSATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶️ YOUTUBE - Watch honest video reviews
https://youtube.com/@Fabienscritique

👍 FACEBOOK - Join community discussions
https://facebook.com/fabienscritique

🔥 REDDIT - Deep dive discussions
https://reddit.com/r/FabienscritiqueUTube

📸 INSTAGRAM - Behind-the-scenes content
https://instagram.com/fabienscritique

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

P.S. Whitelist this email so you never miss updates!

© 2025 Fabien's Critique. Honest Reviews, No BS.
fabienscritique.club
    `;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: "Fabien's Critique"
    });

    Logger.log('Professional dynamic email sent to: ' + email);

  } catch (error) {
    Logger.log('Error sending welcome email: ' + error.toString());
  }
}

function getSourceDisplayName(source) {
  const sourceMap = {
    'YouTube': 'YouTube',
    'Facebook': 'Facebook',
    'Instagram': 'Instagram',
    'X (Twitter)': 'X (Twitter)',
    'Reddit': 'Reddit',
    'Other': 'the web'
  };
  return sourceMap[source] || source;
}

function doGet(e) {
  return ContentService.createTextOutput(
    '✨ PROFESSIONAL DYNAMIC EMAIL v5 ✨\n\n' +
    'Features:\n' +
    '• Sophisticated dark social colors\n' +
    '• Strategic subtle animations\n' +
    '• High readability & contrast\n' +
    '• Email client optimized\n' +
    '• Mobile responsive\n' +
    '• Preheader text\n\n' +
    'Endpoint: ACTIVE ✅'
  );
}

function testWelcomeEmail() {
  sendWelcomeEmail('nfabianperdomo@gmail.com', 'YouTube');
  Logger.log('✨ Professional dynamic test email sent!');
}
