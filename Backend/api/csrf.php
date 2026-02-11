
<?php
require_once '../config/database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$token = generateCSRFToken();

echo json_encode([
    'success' => true,
    'token' => $token
]);
?>