Google Apps Script setup — Email form submissions as CSV

Overview
- This guide shows how to deploy a small Google Apps Script web app that accepts JSON POSTs from your site, appends submissions to a Google Sheet, and emails you a CSV attachment to your Gmail.

Steps
1. Create a new Google Sheet. Note its spreadsheet ID (in the URL: https://docs.google.com/spreadsheets/d/THIS_ID/edit).
2. In the sheet, open Extensions → Apps Script.
3. Replace the default code with the contents of `GAS_SCRIPT.gs` (below).
4. Update the constants in the script: set `SPREADSHEET_ID` to your sheet ID and `RECIPIENT_EMAIL` to your Gmail address.
5. Save, then Deploy → New deployment → select "Web app".
   - Who has access: Anyone (even anonymous) — choose this only if you accept public POSTs to the endpoint.
   - Deploy and copy the Web App URL.
6. In your site, open `contact.html` and set `window.GAS_ENDPOINT` to the Web App URL.
7. Test by submitting the contact form — you should receive an email with a CSV attachment and the sheet should get a new row.

Permissions
- The script requires permission to edit your Spreadsheet and to send email (MailApp). The first time you deploy you will authorize these scopes.

Security notes
- Making the web app public allows anyone to POST. To restrict access, you can add a simple token check (shared secret) in both the site POST and the script. See the `GAS_SCRIPT.gs` example for where to add this.

If you want, I can add a token check to the script and a sample `window.GAS_TOKEN` field to `contact.html` to improve security.
