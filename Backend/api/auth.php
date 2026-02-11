<?php
/**
 * Authentication API
 * Handles user login, registration, and session management
 */

require_once '../config/database.php';
require_once '../models/User.php';
require_once '../models/Validator.php';
require_once '../services/EmailService.php';

use EAgri\Services\EmailService;

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    sendJsonResponse(false, "Database connection failed", null, 500);
}

$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

// Verify CSRF token for state-changing requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($data->csrf_token) || !verifyCSRFToken($data->csrf_token)) {
        sendJsonResponse(false, "Invalid security token. Please refresh and try again.", null, 403);
    }
}

// Get the request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/**
 * REGISTER USER
 */
if ($method === 'POST' && $action === 'register') {
    $validator = new Validator();

    // Basic field validation
    $email = $data->email ?? '';
    $password = $data->password ?? '';
    $fullName = $data->full_name ?? '';
    $phone = $data->phone ?? '';
    $role = $data->role ?? '';

    $validator->required($email, 'email');
    $validator->email($email, 'email');
    $validator->required($password, 'password');
    $validator->password($password, 'password');
    $validator->required($fullName, 'full_name');
    $validator->phone($phone, 'phone');
    $validator->required($role, 'role');

    if ($validator->hasErrors()) {
        sendJsonResponse(false, $validator->getFirstError(), $validator->getErrors(), 400);
    }

    if (
        !empty($data->email) &&
        !empty($data->password) &&
        !empty($data->full_name) &&
        !empty($data->role)
    ) {
        $user->email = sanitizeInput($data->email);
        $user->password = $data->password;
        $user->full_name = sanitizeInput($data->full_name);
        $user->phone = sanitizeInput($data->phone ?? '');
        $user->role = sanitizeInput($data->role);
        $user->preferred_language = sanitizeInput($data->preferred_language ?? 'english');

        // Validate email
        if (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse(false, "Invalid email format", null, 400);
        }

        // Check if email already exists
        if ($user->emailExists()) {
            sendJsonResponse(false, "Email already exists", null, 400);
        }

        // Validate role
        $valid_roles = ['farmer', 'dealer'];
        if (!in_array($user->role, $valid_roles)) {
            sendJsonResponse(false, "Invalid role. Must be 'farmer' or 'dealer'", null, 400);
        }

        // Register user
        if ($user->register()) {
            $response_data = [
                'user_id' => $user->user_id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'role' => $user->role
            ];

            // Create role-specific profile
            if ($user->role === 'farmer') {
                // Create farmer profile
                $query = "INSERT INTO farmers (user_id, farm_location, district, state, pincode)
                          VALUES (:user_id, :farm_location, :district, :state, :pincode)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":user_id", $user->user_id);
                $farm_location = sanitizeInput($data->farm_location ?? '');
                $district = sanitizeInput($data->district ?? '');
                $state = sanitizeInput($data->state ?? '');
                $pincode = sanitizeInput($data->pincode ?? '');
                $stmt->bindParam(":farm_location", $farm_location);
                $stmt->bindParam(":district", $district);
                $stmt->bindParam(":state", $state);
                $stmt->bindParam(":pincode", $pincode);
                $stmt->execute();
                $response_data['farmer_id'] = $db->lastInsertId();
            } elseif ($user->role === 'dealer') {
                // Create dealer profile (pending verification)
                $query = "INSERT INTO dealers (user_id, business_name, business_license, gst_number, business_address, district, state)
                          VALUES (:user_id, :business_name, :business_license, :gst_number, :business_address, :district, :state)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":user_id", $user->user_id);
                $business_name = sanitizeInput($data->business_name ?? '');
                $business_license = sanitizeInput($data->business_license ?? '');
                $gst_number = sanitizeInput($data->gst_number ?? '');
                $business_address = sanitizeInput($data->business_address ?? '');
                $district = sanitizeInput($data->district ?? '');
                $state = sanitizeInput($data->state ?? '');
                $stmt->bindParam(":business_name", $business_name);
                $stmt->bindParam(":business_license", $business_license);
                $stmt->bindParam(":gst_number", $gst_number);
                $stmt->bindParam(":business_address", $business_address);
                $stmt->bindParam(":district", $district);
                $stmt->bindParam(":state", $state);
                $stmt->execute();
                $response_data['dealer_id'] = $db->lastInsertId();
                $response_data['verification_status'] = 'pending';
            }

            // Attempt to send welcome email (failure does not break registration)
            try {
                $emailService = new EmailService();
                $emailService->sendWelcomeEmail($user->email, $user->full_name, $user->role);
            } catch (\Exception $e) {
                error_log("E-AGRI welcome email failed: " . $e->getMessage());
            }

            // Log successful registration
            logAPIRequest('/api/auth.php?action=register', 'POST', (int) $user->user_id, 201);

            sendJsonResponse(true, "Registration successful", $response_data, 201);
        } else {
            sendJsonResponse(false, "Registration failed", null, 500);
        }
    } else {
        sendJsonResponse(false, "Incomplete data. Required: email, password, full_name, role", null, 400);
    }
}

/**
 * LOGIN USER
 */
elseif ($method === 'POST' && $action === 'login') {
    if (!empty($data->email) && !empty($data->password)) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

        // Rate limiting before authentication
        $rateCheck = checkRateLimit($db, $ip, $data->email);
        if ($rateCheck['limited']) {
            logAPIRequest('/api/auth.php?action=login', 'POST', null, 429);
            sendJsonResponse(false, $rateCheck['message'], null, 429);
        }

        $user->email = sanitizeInput($data->email);
        $user->password = $data->password;

        if ($user->login()) {
            // Get role-specific data
            $role_data = null;
            
            if ($user->role === 'farmer') {
                $query = "SELECT * FROM farmers WHERE user_id = :user_id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":user_id", $user->user_id);
                $stmt->execute();
                $role_data = $stmt->fetch();
            } elseif ($user->role === 'dealer') {
                $query = "SELECT * FROM dealers WHERE user_id = :user_id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":user_id", $user->user_id);
                $stmt->execute();
                $role_data = $stmt->fetch();
            }

            // Create session
            $_SESSION['user_id'] = $user->user_id;
            $_SESSION['email'] = $user->email;
            $_SESSION['role'] = $user->role;
            $_SESSION['full_name'] = $user->full_name;

            $response_data = [
                'user_id' => $user->user_id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'role' => $user->role,
                'preferred_language' => $user->preferred_language,
                'role_data' => $role_data,
                'session_id' => session_id()
            ];

            // Log successful login
            logLoginAttempt($db, $ip, $user->email, true);
            logAPIRequest('/api/auth.php?action=login', 'POST', (int) $user->user_id, 200);

            sendJsonResponse(true, "Login successful", $response_data, 200);
        } else {
            // Log failed attempt
            logLoginAttempt($db, $ip, $data->email, false);
            logAPIRequest('/api/auth.php?action=login', 'POST', null, 401);

            sendJsonResponse(false, "Invalid email or password", null, 401);
        }
    } else {
        sendJsonResponse(false, "Email and password required", null, 400);
    }
}

/**
 * LOGOUT USER
 */
elseif ($method === 'POST' && $action === 'logout') {
    session_destroy();
    sendJsonResponse(true, "Logout successful", null, 200);
}

/**
 * CHECK SESSION
 */
elseif ($method === 'GET' && $action === 'check-session') {
    if (isset($_SESSION['user_id'])) {
        sendJsonResponse(true, "Session active", [
            'user_id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'role' => $_SESSION['role'],
            'full_name' => $_SESSION['full_name']
        ], 200);
    } else {
        sendJsonResponse(false, "No active session", null, 401);
    }
}

/**
 * Invalid endpoint
 */
else {
    sendJsonResponse(false, "Invalid endpoint or method", null, 404);
}
?>
