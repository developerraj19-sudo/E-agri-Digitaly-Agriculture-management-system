<?php
/**
 * User Model
 * Handles user authentication, registration, and profile management
 */

class User {
    private $conn;
    private $table = "users";

    public $user_id;
    public $email;
    public $password;
    public $password_hash;
    public $full_name;
    public $phone;
    public $role;
    public $preferred_language;
    public $is_active;
    public $created_at;
    public $last_login;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Register new user
     */
    public function register() {
        $query = "INSERT INTO " . $this->table . "
                SET email = :email,
                    password_hash = :password_hash,
                    full_name = :full_name,
                    phone = :phone,
                    role = :role,
                    preferred_language = :preferred_language";

        $stmt = $this->conn->prepare($query);

        // Hash password
        $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);

        // Bind values
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password_hash", $hashed_password);
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":preferred_language", $this->preferred_language);

        if ($stmt->execute()) {
            $this->user_id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    /**
     * Login user
     */
    public function login() {
        $query = "SELECT user_id, email, password_hash, full_name, role, 
                         preferred_language, is_active
                  FROM " . $this->table . "
                  WHERE email = :email AND is_active = 1
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            
            // Verify password
            if (password_verify($this->password, $row['password_hash'])) {
                $this->user_id = $row['user_id'];
                $this->full_name = $row['full_name'];
                $this->role = $row['role'];
                $this->preferred_language = $row['preferred_language'];
                
                // Update last login
                $this->updateLastLogin();
                
                return true;
            }
        }
        return false;
    }

    /**
     * Update last login timestamp
     */
    private function updateLastLogin() {
        $query = "UPDATE " . $this->table . "
                  SET last_login = NOW()
                  WHERE user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->execute();
    }

    /**
     * Get user by ID
     */
    public function getUserById($user_id) {
        $query = "SELECT * FROM " . $this->table . "
                  WHERE user_id = :user_id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Check if email exists
     */
    public function emailExists() {
        $query = "SELECT user_id FROM " . $this->table . "
                  WHERE email = :email
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    /**
     * Update user profile
     */
    public function updateProfile() {
        $query = "UPDATE " . $this->table . "
                  SET full_name = :full_name,
                      phone = :phone,
                      preferred_language = :preferred_language
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":preferred_language", $this->preferred_language);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Get all users (Admin only)
     */
    public function getAllUsers() {
        $query = "SELECT u.user_id, u.email, u.full_name, u.role, 
                         u.is_active, u.created_at, u.last_login
                  FROM " . $this->table . " u
                  ORDER BY u.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Toggle user active status
     */
    public function toggleActiveStatus($user_id, $status) {
        $query = "UPDATE " . $this->table . "
                  SET is_active = :status
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":user_id", $user_id);

        return $stmt->execute();
    }
}
?>
