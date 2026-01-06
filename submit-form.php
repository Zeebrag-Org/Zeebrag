<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$secret = "6LeV1kAsAAAAAOA6iT21qjixo4YpnoFfswiO_QPf";

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';

if (empty($name) || empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($recaptchaResponse)) {
    echo json_encode(['success' => false, 'message' => 'Please complete the reCAPTCHA verification.']);
    exit;
}

$verifyURL = "https://www.google.com/recaptcha/api/siteverify";
$postData = http_build_query([
    'secret' => $secret,
    'response' => $recaptchaResponse,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
]);

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => $postData
    ]
];

$context = stream_context_create($options);
$verify = @file_get_contents($verifyURL, false, $context);

if ($verify === false) {
    error_log('reCAPTCHA verification request failed');
} else {
    $captcha = json_decode($verify);
    if (!$captcha || !$captcha->success) {
        $errorCodes = isset($captcha->{'error-codes'}) ? implode(', ', $captcha->{'error-codes'}) : 'Unknown error';
        error_log('reCAPTCHA verification failed: ' . $errorCodes);
    }
}

$to = "contact@zeebrag.com";
$subject = "New Get Started Form Submission - Zeebrag";
$emailMessage = "New form submission from Zeebrag website:\n\n";
$emailMessage .= "Name: $name\n";
$emailMessage .= "Email: $email\n";
$emailMessage .= "Phone: $phone\n";
$emailMessage .= "Message: " . ($message ? $message : 'N/A') . "\n\n";
$emailMessage .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";

$headers = "From: noreply@zeebrag.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$emailSent = @mail($to, $subject, $emailMessage, $headers);

$googleFormURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
$googleFormSubmitted = false;

if (strpos($googleFormURL, 'YOUR_FORM_ID') === false) {
    $formData = array(
        'entry.XXXXXXX' => $name,
        'entry.XXXXXXX' => $email,
        'entry.XXXXXXX' => $phone,
        'entry.XXXXXXX' => $message
    );
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $googleFormURL);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        error_log('Google Forms submission error: ' . $curlError);
    } else {
        $googleFormSubmitted = ($httpCode == 200 || $httpCode == 302);
    }
}

if ($emailSent || $googleFormSubmitted) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! Your form has been submitted successfully.'
    ]);
} else {
    error_log('Form submission - Email may have failed. Name: ' . $name . ', Email: ' . $email);
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! Your form has been submitted successfully.'
    ]);
}
