<?php
/**
 * E-AGRI Input Validator
 * Centralized validation for common fields
 */

class Validator {
    private array $errors = [];

    /**
     * Validate email format
     */
    public function email(string $email, string $field = 'email'): bool {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "Invalid email format";
            return false;
        }
        return true;
    }

    /**
     * Validate Indian phone number (10 digits, starts 6-9)
     */
    public function phone(string $phone, string $field = 'phone'): bool {
        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->errors[$field] = "Invalid phone number. Must be 10 digits starting with 6-9";
            return false;
        }
        return true;
    }

    /**
     * Validate password strength
     */
    public function password(string $password, string $field = 'password'): bool {
        if (strlen($password) < 8) {
            $this->errors[$field] = "Password must be at least 8 characters";
            return false;
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $this->errors[$field] = "Password must contain at least one uppercase letter";
            return false;
        }

        if (!preg_match('/[a-z]/', $password)) {
            $this->errors[$field] = "Password must contain at least one lowercase letter";
            return false;
        }

        if (!preg_match('/[0-9]/', $password)) {
            $this->errors[$field] = "Password must contain at least one number";
            return false;
        }

        return true;
    }

    /**
     * Validate required field
     */
    public function required(?string $value, string $field): bool {
        if ($value === null || trim($value) === '') {
            $this->errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " is required";
            return false;
        }
        return true;
    }

    /**
     * Return all errors
     */
    public function getErrors(): array {
        return $this->errors;
    }

    /**
     * Whether any errors exist
     */
    public function hasErrors(): bool {
        return count($this->errors) > 0;
    }

    /**
     * Get first error message
     */
    public function getFirstError(): ?string {
        return $this->hasErrors() ? reset($this->errors) : null;
    }
}
?>

