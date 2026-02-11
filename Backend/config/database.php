<?php
/**
 * E-AGRI Database Configuration
 * Configuration file for database connection
 */

class Database {
    private $host = "localhost";
    private $db_name = "eagri_db";
    private $username = "root";
    private $password = "";
    private $conn;

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }
}

/**
 * CORS Headers for API
 */
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Generate CSRF Token
 */
function generateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF Token
 */
function verifyCSRFToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Check if IP/email is rate limited for login
 */
function checkRateLimit(PDO $db, string $ip, string $email) {
    // Check failed attempts in last 15 minutes
    $query = "SELECT COUNT(*) as attempts 
              FROM login_attempts 
              WHERE (ip_address = :ip OR email = :email)
              AND success = FALSE 
              AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':ip', $ip);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $result = $stmt->fetch();
    $attempts = $result['attempts'] ?? 0;

    // Max 5 attempts per 15 minutes
    if ($attempts >= 5) {
        return [
            'limited' => true,
            'message' => 'Too many failed login attempts. Please wait 15 minutes before trying again.'
        ];
    }

    return ['limited' => false];
}

/**
 * Log login attempt
 */
function logLoginAttempt(PDO $db, string $ip, ?string $email, bool $success): void {
    $query = "INSERT INTO login_attempts (ip_address, email, success) 
              VALUES (:ip, :email, :success)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':ip', $ip);
    $stmt->bindParam(':email', $email);
    $stmt->bindValue(':success', $success, PDO::PARAM_BOOL);
    $stmt->execute();
}

/**
 * JSON Response Helper
 */
function sendJsonResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

/**
 * Validate and Sanitize Input
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Log API request to a file
 */
function logAPIRequest(string $endpoint, string $method, ?int $userId = null, int $statusCode = 200): void {
    $logFile = __DIR__ . '/../../logs/api.log';
    $logDir = dirname($logFile);

    if (!file_exists($logDir)) {
        mkdir($logDir, 0777, true);
    }

    $logEntry = sprintf(
        "[%s] %s %s - User: %s - Status: %d - IP: %s\n",
        date('Y-m-d H:i:s'),
        strtoupper($method),
        $endpoint,
        $userId ?? 'guest',
        $statusCode,
        $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    );

    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

/**
 * JWT Token Configuration
 */
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION_TIME', 86400); // 24 hours

/**
 * Session Configuration
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Error Handling
 */
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-error.log');
?>
