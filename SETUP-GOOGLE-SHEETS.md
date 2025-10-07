# Google Sheets Email Capture Setup

## Step-by-Step Instructions

### 1. Open Your Google Spreadsheet
Go to: https://docs.google.com/spreadsheets/d/11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns/edit

### 2. Open Apps Script Editor
- Click **Extensions** → **Apps Script**
- This will open the Google Apps Script editor in a new tab

### 3. Add the Script
- Delete any existing code in the editor
- Open the file `google-apps-script.js` in this folder
- Copy ALL the code
- Paste it into the Apps Script editor

### 4. Deploy as Web App
- Click the **Deploy** button (top right)
- Select **New deployment**
- Click the gear icon ⚙️ next to "Select type"
- Choose **Web app**

### 5. Configure Deployment Settings
- **Description**: Email Capture for Fabien's Critique
- **Execute as**: Me (your email)
- **Who has access**: Anyone

### 6. Authorize the Script
- Click **Deploy**
- You'll be asked to authorize the script
- Click **Authorize access**
- Choose your Google account
- Click **Advanced** → **Go to [project name] (unsafe)**
- Click **Allow**

### 7. Copy the Deployment URL
- After deployment, you'll see a **Web app URL** like:
  ```
  https://script.google.com/macros/s/AKfycby.../exec
  ```
- **Copy this entire URL**

### 8. Update Your Website
- Open `index.html`
- Find line ~1660 that says:
  ```javascript
  const SCRIPT_URL = `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`;
  ```
- Replace `YOUR_DEPLOYMENT_ID` with your actual deployment URL

### 9. Test It!
- Refresh your website (http://localhost:3000)
- Wait for the email popup
- Enter a test email
- Click "Join The Club"
- Check your Google Sheet - a new row should appear!

## What Gets Captured

Your spreadsheet will have these columns:
- **Timestamp**: When the email was submitted
- **Email**: The visitor's email address
- **Source**: Where they signed up from (fabienscritique.club)

## Troubleshooting

### Email not appearing in spreadsheet?
1. Check the browser console (F12) for errors
2. Make sure you deployed as "Anyone" can access
3. Verify the SCRIPT_URL is correct in index.html

### "Authorization required" error?
1. Re-deploy the script
2. Make sure you authorized access to your Google account

### Want to test the endpoint?
Visit your deployment URL in a browser - you should see:
```
Email capture endpoint is working! Use POST to submit emails.
```

## Security Note
This setup allows anyone to submit data to your spreadsheet, but only via the specific endpoint. The spreadsheet itself remains private to you.
