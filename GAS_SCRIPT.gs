// Google Apps Script: receive JSON POST, append to sheet, email CSV attachment

const SPREADSHEET_ID = '1BSx5m0DTY1MfYKV38TUIEgafrtN4g4MRzjfFwm3nHsU'; // set your sheet ID
const SHEET_NAME = 'Submissions';
const RECIPIENT_EMAIL = 'your@gmail.com'; // set your receiving email
// Optional: set a simple shared secret token and also send it from the client
const SHARED_SECRET = ''; // set to non-empty string to enable token check

function ensureHeaders(sheet, headers){
  if(sheet.getLastRow() === 0){
    sheet.appendRow(headers);
  } else {
    const existing = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    if(existing.length < headers.length){
      sheet.insertColumnAfter(existing.length);
      sheet.getRange(1,1,1,headers.length).setValues([headers]);
    }
  }
}

function doPost(e){
  try{
    if(!e.postData || !e.postData.contents){
      return ContentService.createTextOutput(JSON.stringify({status:'error',message:'No post data'})).setMimeType(ContentService.MimeType.JSON);
    }
    const data = JSON.parse(e.postData.contents);

    // Optional token check
    if(SHARED_SECRET && (!data._secret || data._secret !== SHARED_SECRET)){
      return ContentService.createTextOutput(JSON.stringify({status:'error',message:'Invalid token'})).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    const headers = ['timestamp','source','name','email','phone','message'];
    ensureHeaders(sheet, headers);

    const row = headers.map(h => data[h] || '');
    sheet.appendRow(row);

    // Build CSV for this single row
    const csvRow = row.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',');
    const csv = headers.join(',') + '\n' + csvRow + '\n';
    const blob = Utilities.newBlob(csv,'text/csv','submission.csv');

    // Send email with CSV attachment
    const subject = 'New contact form submission';
    const body = 'New submission received. See attached CSV.';
    MailApp.sendEmail({to:RECIPIENT_EMAIL,subject:subject,body:body,attachments:[blob]});

    return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
