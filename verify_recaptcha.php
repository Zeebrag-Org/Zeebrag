<?php
// verify_recaptcha.php (deprecated stub)
// Project no longer requires reCAPTCHA by default — this endpoint returns a neutral response.
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'reCAPTCHA verification skipped (stub).']);
exit;
?>