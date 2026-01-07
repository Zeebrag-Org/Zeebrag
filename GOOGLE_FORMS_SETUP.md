# Google Forms Integration Setup

## Steps to Connect Your Google Form

1. **Create a Google Form:**
   - Go to https://forms.google.com
   - Create a new form with fields: Name, Email, Phone, Message
   - Make sure the form is set to accept responses

2. **Get Your Form ID:**
   - Open your Google Form
   - Click "Send" button
   - Click the link icon to get the form URL
   - The URL will look like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`
   - Copy the `FORM_ID` part

3. **Get Field Entry IDs:**
   - Open your Google Form
   - Right-click on each field and select "Inspect" (or press F12)
   - Look for `name="entry.XXXXXXX"` in the HTML
   - Note down the entry IDs for each field:
     - Name field: `entry.XXXXXXX`
     - Email field: `entry.XXXXXXX`
     - Phone field: `entry.XXXXXXX`
     - Message field: `entry.XXXXXXX`

4. **Update submit-form.php:**
   - Open `submit-form.php`
   - Replace `YOUR_FORM_ID` with your actual form ID (line 46)
   - Replace all `entry.XXXXXXX` with your actual entry IDs (lines 51-54)

5. **Update Email Address:**
   - In `submit-form.php`, change `contact@zeebrag.com` to your actual email address (line 73)

## Example Configuration

```php
// Line 46 - Replace with your form ID
$googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXX/formResponse";

// Lines 51-54 - Replace with your entry IDs
$formData = array(
    'entry.123456789' => $name,      // Your Name field ID
    'entry.987654321' => $email,     // Your Email field ID
    'entry.111222333' => $phone,     // Your Phone field ID
    'entry.444555666' => $message    // Your Message field ID
);
```

## Testing

1. Make sure your server has PHP enabled
2. Test the form submission
3. Check your Google Form responses to verify data is being submitted
4. Check your email for notifications

## Notes

- The reCAPTCHA secret key is already configured in `submit-form.php`
- The reCAPTCHA site key is configured in all HTML files
- Make sure your server supports cURL for Google Forms submission
- The form will also send an email notification to the configured address

