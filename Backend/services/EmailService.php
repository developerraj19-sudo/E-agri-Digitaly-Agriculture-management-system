<?php
/**
 * E-AGRI Email Service
 *
 * Uses PHPMailer when available to send emails.
 * If PHPMailer is not installed, email sending will fail silently
 * (logged to PHP error log) but will NOT break registration.
 */

namespace EAgri\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Try to load PHPMailer if present
$vendorBase = __DIR__ . '/../vendor/phpmailer/src/';
if (file_exists($vendorBase . 'PHPMailer.php')) {
    require_once $vendorBase . 'Exception.php';
    require_once $vendorBase . 'PHPMailer.php';
    require_once $vendorBase . 'SMTP.php';
}

class EmailService {
    private ?PHPMailer $mail = null;

    public function __construct() {
        // If PHPMailer is not available, leave $mail as null
        if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            error_log('E-AGRI: PHPMailer library not found. Emails will not be sent.');
            return;
        }

        $this->mail = new PHPMailer(true);

        // Basic SMTP configuration (adjust for your environment)
        $this->mail->isSMTP();
        $this->mail->Host = 'smtp.gmail.com';
        $this->mail->SMTPAuth = true;
        $this->mail->Username = 'your-email@gmail.com';      // TODO: change in production
        $this->mail->Password = 'your-app-password';         // TODO: use app password / env var
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port = 587;

        // Default sender
        $this->mail->setFrom('noreply@eagri.com', 'E-AGRI Platform');
    }

    /**
     * Send welcome email after registration.
     * Returns true on success, false on failure or when mailer is not configured.
     */
    public function sendWelcomeEmail(string $userEmail, string $userName, string $role): bool {
        if ($this->mail === null) {
            // Mailer not configured; log and skip
            error_log('E-AGRI: sendWelcomeEmail called but PHPMailer is not configured.');
            return false;
        }

        try {
            $this->mail->clearAddresses();
            $this->mail->addAddress($userEmail, $userName);

            $this->mail->isHTML(true);
            $this->mail->Subject = 'Welcome to E-AGRI!';
            $this->mail->Body = $this->getWelcomeEmailTemplate($userName, $role);

            return $this->mail->send();
        } catch (Exception $e) {
            error_log("E-AGRI Email error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Simple HTML welcome email template
     */
    private function getWelcomeEmailTemplate(string $name, string $role): string {
        $roleMessage = $role === 'farmer'
            ? 'Start exploring market prices, weather updates, and AI-powered recommendations!'
            : 'Your dealer account is pending verification. We will notify you once approved.';

        return "
        <html>
        <body style='font-family: Arial, sans-serif; background:#f8f9fa;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background:#ffffff;'>
                <h2 style='color: #2d5016;'>Welcome to E-AGRI, {$name}!</h2>
                <p>Thank you for registering as a <strong>{$role}</strong>.</p>
                <p>{$roleMessage}</p>
                <p style='margin:24px 0;'>
                    <a href='http://localhost/eagri-app/frontend/login.html'
                       style='background: #2d5016; color: white; padding: 10px 20px;
                              text-decoration: none; border-radius: 5px;'>
                        Login Now
                    </a>
                </p>
                <p style='color: #666; font-size: 12px; margin-top: 30px;'>
                    This is an automated email. Please do not reply.
                </p>
            </div>
        </body>
        </html>
        ";
    }
}
?>

