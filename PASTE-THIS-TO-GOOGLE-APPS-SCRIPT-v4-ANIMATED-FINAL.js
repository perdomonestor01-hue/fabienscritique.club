// ============================================================================
// FABIEN'S CRITIQUE - ANIMATED WELCOME EMAIL (v4 FINAL)
// ============================================================================
//
// ✨ NEW IN V4: Premium animations, pulsing glows, floating icons, shimmer effects
//
// INSTRUCTIONS:
// 1. Open your Google Sheet:
//    https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit
// 2. Click "Extensions" → "Apps Script"
// 3. DELETE everything in the editor
// 4. COPY everything from this file and PASTE it
// 5. Click "Deploy" → "Manage deployments" → Edit → Deploy
// 6. Your stunning animated email is now LIVE! 🎨
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
    <style>
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4); }
            50% { box-shadow: 0 6px 24px rgba(217, 119, 6, 0.7), 0 0 40px rgba(217, 119, 6, 0.3); }
        }
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes floatIcon {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        @keyframes borderGlow {
            0%, 100% { border-color: #3a3a3a; box-shadow: 0 0 0 rgba(217, 119, 6, 0); }
            50% { border-color: #d97706; box-shadow: 0 0 20px rgba(217, 119, 6, 0.4); }
        }
        @keyframes socialPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
            50% { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); }
        }
        @keyframes sparkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%); background-size: 400% 400%; animation: gradientShift 20s ease infinite; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 0 60px rgba(217, 119, 6, 0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #262626 25%, #2c2c2c 50%, #262626 75%, #1a1a1a 100%); background-size: 400% 400%; animation: gradientShift 15s ease infinite;">
                            <table role="presentation" width="80" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 24px;">
                                <tr>
                                    <td style="background-color: #d97706; border-radius: 16px; text-align: center; padding: 16px; font-size: 40px; line-height: 1; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4), 0 0 30px rgba(217, 119, 6, 0.3); animation: pulseGlow 3s ease-in-out infinite;">
                                        <div style="animation: floatIcon 3s ease-in-out infinite; display: inline-block;">⭐</div>
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #ffffff 0%, #e6e6e6 50%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; line-height: 1.2; animation: shimmer 4s linear infinite;">
                                Welcome to<br>Fabien's Critique Club!
                            </h1>
                            <p style="margin: 0; font-size: 18px; color: #cccccc; line-height: 1.5;">
                                Where people are interested in hearing<br>and reading <span style="color: #d97706; font-weight: 600; animation: sparkle 2s ease-in-out infinite; display: inline-block;">real reviews</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #1a1a1a;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 24px; background: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 12px; border-left: 4px solid #d97706; animation: borderGlow 4s ease-in-out infinite;">
                                        <p style="margin: 0 0 16px; font-size: 16px; color: #e6e6e6; line-height: 1.7;">
                                            Hey there! <span style="display: inline-block; animation: floatIcon 2s ease-in-out infinite;">👋</span>
                                        </p>
                                        <p style="margin: 0 0 16px; font-size: 16px; color: #e6e6e6; line-height: 1.7;">
                                            Thanks for joining from <strong style="color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">${sourceDisplay}</strong>! You're part of a community that values honest feedback over paid promotions.
                                        </p>
                                        <p style="margin: 0; font-size: 16px; color: #e6e6e6; line-height: 1.7;">
                                            No fluff. No BS. Just real experiences from real people.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Value Props - MAXIMUM READABILITY -->
                    <tr>
                        <td style="padding: 0 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td width="50%" style="padding: 0 8px 16px 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 14px; padding: 28px; border-left: 5px solid #d97706; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(217, 119, 6, 0.2);">
                                                    <div style="font-size: 40px; margin-bottom: 14px; display: inline-block; animation: floatIcon 3s ease-in-out infinite;">✓</div>
                                                    <div style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; letter-spacing: -0.3px;">Real Reviews</div>
                                                    <div style="font-size: 16px; color: #333333; line-height: 1.7; font-weight: 500;">Authentic experiences, no filter</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" style="padding: 0 0 16px 8px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 14px; padding: 28px; border-left: 5px solid #d97706; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(217, 119, 6, 0.2);">
                                                    <div style="font-size: 40px; margin-bottom: 14px; display: inline-block; animation: floatIcon 3.2s ease-in-out infinite;">🎥</div>
                                                    <div style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; letter-spacing: -0.3px;">Authentic Videos</div>
                                                    <div style="font-size: 16px; color: #333333; line-height: 1.7; font-weight: 500;">Raw, unedited reactions</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" style="padding: 0 8px 0 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 14px; padding: 28px; border-left: 5px solid #d97706; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(217, 119, 6, 0.2);">
                                                    <div style="font-size: 40px; margin-bottom: 14px; display: inline-block; animation: floatIcon 3.5s ease-in-out infinite;">💬</div>
                                                    <div style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; letter-spacing: -0.3px;">Honest Opinions</div>
                                                    <div style="font-size: 16px; color: #333333; line-height: 1.7; font-weight: 500;">Good, bad, and ugly</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" style="padding: 0 0 0 8px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 14px; padding: 28px; border-left: 5px solid #d97706; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(217, 119, 6, 0.2);">
                                                    <div style="font-size: 40px; margin-bottom: 14px; display: inline-block; animation: floatIcon 3.8s ease-in-out infinite;">🚫</div>
                                                    <div style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; letter-spacing: -0.3px;">No Sponsorships</div>
                                                    <div style="font-size: 16px; color: #333333; line-height: 1.7; font-weight: 500;">100% independent</div>
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
                                    <td style="height: 2px; background: linear-gradient(90deg, transparent 0%, #d97706 50%, transparent 100%); background-size: 200% auto; animation: shimmer 4s linear infinite;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Social CTAs -->
                    <tr>
                        <td style="padding: 40px 40px 32px;">
                            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                Join the Conversation
                            </h2>
                            <p style="margin: 0 0 32px; font-size: 15px; color: #cccccc; text-align: center; line-height: 1.5;">
                                Connect with us on your favorite platform
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <!-- YouTube -->
                                    <td width="50%" style="padding: 0 6px 12px 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%); border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.2); animation: socialPulse 4s ease-in-out infinite;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 36px; margin-bottom: 12px; display: inline-block; animation: floatIcon 3s ease-in-out infinite;">▶️</div>
                                                                <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">YouTube</div>
                                                                <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4;">Watch honest video reviews</div>
                                                                <a href="https://youtube.com/@Fabienscritique" style="display: inline-block; background: #ffffff; color: #FF0000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                                    Subscribe
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Facebook -->
                                    <td width="50%" style="padding: 0 0 12px 6px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #1877F2 0%, #0C5EC7 100%); border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3), 0 0 30px rgba(24, 119, 242, 0.2); animation: socialPulse 4.2s ease-in-out infinite;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 36px; margin-bottom: 12px; display: inline-block; animation: floatIcon 3.2s ease-in-out infinite;">👍</div>
                                                                <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Facebook</div>
                                                                <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4;">Join community discussions</div>
                                                                <a href="https://facebook.com/fabienscritique" style="display: inline-block; background: #ffffff; color: #1877F2; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
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

                                <tr>
                                    <!-- Reddit -->
                                    <td width="50%" style="padding: 0 6px 0 0; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #FF4500 0%, #CC3700 100%); border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3), 0 0 30px rgba(255, 69, 0, 0.2); animation: socialPulse 4.4s ease-in-out infinite;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 36px; margin-bottom: 12px; display: inline-block; animation: floatIcon 3.5s ease-in-out infinite;">🔥</div>
                                                                <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Reddit</div>
                                                                <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4;">Deep dive discussions</div>
                                                                <a href="https://reddit.com/r/FabienscritiqueUTube" style="display: inline-block; background: #ffffff; color: #FF4500; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                                                                    Join
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>

                                    <!-- Twitter/X -->
                                    <td width="50%" style="padding: 0 0 0 6px; vertical-align: top;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #1DA1F2 0%, #0C85D0 100%); border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3), 0 0 30px rgba(29, 161, 242, 0.2); animation: socialPulse 4.6s ease-in-out infinite;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="font-size: 36px; margin-bottom: 12px; display: inline-block; animation: floatIcon 3.8s ease-in-out infinite;">𝕏</div>
                                                                <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Twitter / X</div>
                                                                <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4;">Quick updates & hot takes</div>
                                                                <a href="https://twitter.com/Fabienscritique" style="display: inline-block; background: #ffffff; color: #1DA1F2; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
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
                                    <td style="height: 2px; background: linear-gradient(90deg, transparent 0%, #d97706 50%, transparent 100%); background-size: 200% auto; animation: shimmer 4s linear infinite;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- What's New -->
                    <tr>
                        <td style="padding: 40px 40px 32px;">
                            <h2 style="margin: 0 0 24px; font-size: 24px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                What's New <span style="display: inline-block; animation: floatIcon 2.5s ease-in-out infinite;">🎯</span>
                            </h2>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; font-size: 28px; text-align: center; line-height: 60px; animation: pulseGlow 3s ease-in-out infinite;">🎢</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Latest: Six Flags Fright Fest Review</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">Honest look at the inaugural event - scares, crowds, and value analysis.</div>
                                                    <a href="https://fabienscritique.club/#reviews" style="color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">Read Review →</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; font-size: 28px; text-align: center; line-height: 60px; animation: pulseGlow 3.2s ease-in-out infinite;">🥾</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Testing: North Face Gear Durability</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">Real-world testing results on boots and jackets. The good, bad, and ugly.</div>
                                                    <a href="https://fabienscritique.club/#reviews" style="color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">See Results →</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #262626 0%, #2c2c2c 100%); border-radius: 10px; padding: 20px; border: 1px solid #3a3a3a;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td width="60" style="vertical-align: top; padding-right: 16px;">
                                                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 8px; font-size: 28px; text-align: center; line-height: 60px; animation: pulseGlow 3.5s ease-in-out infinite;">📝</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Blog: Why Most Reviews Are Garbage</div>
                                                    <div style="font-size: 14px; color: #cccccc; line-height: 1.5; margin-bottom: 12px;">How affiliate links and sponsorships destroyed honest product reviews.</div>
                                                    <a href="https://fabienscritique.club/blog" style="color: #d97706; text-decoration: none; font-size: 14px; font-weight: 600;">Read Article →</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%); text-align: center;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #e6e6e6; line-height: 1.6;">
                                <strong style="color: #ffffff;">P.S.</strong> Whitelist this email so you never miss updates.<br>
                                Each week I share exclusive insights that don't make it to social media!
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 32px 40px; background-color: #0d0d0d; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <a href="https://fabienscritique.club" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">Website</a>
                                        <span style="color: #4a4a4a;">|</span>
                                        <a href="https://fabienscritique.club/#about" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">About</a>
                                        <span style="color: #4a4a4a;">|</span>
                                        <a href="https://fabienscritique.club/#contact" style="color: #cccccc; text-decoration: none; font-size: 13px; margin: 0 12px;">Contact</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-bottom: 16px;">
                                        <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
                                            You're receiving this because you joined from ${sourceDisplay}.<br>
                                            We'll only send you the good stuff - no spam, ever.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="mailto:fabienscritique@gmail.com?subject=Unsubscribe" style="color: #d97706; text-decoration: underline; font-size: 12px;">Unsubscribe</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 24px;">
                                        <p style="margin: 0; font-size: 11px; color: #666666; line-height: 1.5;">
                                            © 2025 Fabien's Critique. All rights reserved.<br>
                                            Honest Reviews, No BS.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

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

𝕏 TWITTER/X - Quick updates & hot takes
https://twitter.com/Fabienscritique

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

    Logger.log('Animated welcome email sent to: ' + email);

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
    '✨ ANIMATED EMAIL CAPTURE v4 ✨\n\n' +
    'Features:\n' +
    '• Pulsing glow effects\n' +
    '• Floating icon animations\n' +
    '• Gradient shifts\n' +
    '• Shimmer effects\n' +
    '• Sparkle animations\n' +
    '• Social card pulses\n\n' +
    'Endpoint: ACTIVE ✅'
  );
}

function testWelcomeEmail() {
  sendWelcomeEmail('nfabianperdomo@gmail.com', 'YouTube');
  Logger.log('✨ Animated test email sent!');
}
