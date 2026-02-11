/**
 * Registration Page JavaScript
 * Multi-step form handling and validation
 */

let currentStep = 1;
let selectedRole = '';

// Role selection
function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = event.currentTarget;
    selectedOption.classList.add('selected');
    
    if (role === 'farmer') {
        document.getElementById('roleFarmer').checked = true;
    } else {
        document.getElementById('roleDealer').checked = true;
    }
}

// Navigate to next step
function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep}Indicator`).classList.remove('active');
    document.getElementById(`step${currentStep}Indicator`).classList.add('completed');
    
    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`step${currentStep}Indicator`).classList.add('active');
    
    // Show role-specific fields in step 3
    if (currentStep === 3) {
        if (selectedRole === 'farmer') {
            document.getElementById('farmerFields').style.display = 'block';
            document.getElementById('dealerFields').style.display = 'none';
        } else {
            document.getElementById('farmerFields').style.display = 'none';
            document.getElementById('dealerFields').style.display = 'block';
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to previous step
function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep}Indicator`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`step${currentStep}Indicator`).classList.add('active');
    document.getElementById(`step${step}Indicator`).classList.remove('completed');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateStep(step) {
    if (step === 1) {
        // Check if role is selected
        if (!selectedRole) {
            showAlert('Please select your role', 'error');
            return false;
        }
        return true;
    }
    
    if (step === 2) {
        // Validate account information
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!fullName) {
            showAlert('Please enter your full name', 'error');
            return false;
        }
        
        if (!email || !eagri.validateEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!phone || !eagri.validatePhone(phone)) {
            showAlert('Please enter a valid 10-digit phone number', 'error');
            return false;
        }
        
        if (!password || password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return false;
        }
        
        return true;
    }
    
    return true;
}

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const iconId = fieldId === 'password' ? 'toggleIcon1' : 'toggleIcon2';
    const toggleIcon = document.getElementById(iconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    // Scroll to alert
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    // Check for role parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
        selectRole(roleParam);
    }
    
    // Form submission
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate terms agreement
        if (!document.getElementById('termsAgree').checked) {
            showAlert('Please agree to the Terms & Conditions', 'error');
            return;
        }
        
        const registerBtn = document.getElementById('registerBtn');
        const originalText = registerBtn.innerHTML;
        
        // Show loading state
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        // Prepare form data
        const formData = {
            csrf_token: document.getElementById('csrfToken').value,
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            full_name: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            role: selectedRole,
            preferred_language: document.getElementById('language').value
        };
        
        // Add role-specific data
        if (selectedRole === 'farmer') {
            formData.farm_location = document.getElementById('farmLocation').value.trim();
            formData.district = document.getElementById('district').value.trim();
            formData.state = document.getElementById('state').value;
            formData.farm_size_acres = document.getElementById('farmSize').value;
            formData.soil_type = document.getElementById('soilType').value;
            formData.primary_crop = document.getElementById('primaryCrop').value.trim();
            formData.pincode = document.getElementById('pincode').value.trim();
        } else if (selectedRole === 'dealer') {
            formData.business_name = document.getElementById('businessName').value.trim();
            formData.business_license = document.getElementById('businessLicense').value.trim();
            formData.gst_number = document.getElementById('gstNumber').value.trim();
            formData.business_address = document.getElementById('businessAddress').value.trim();
            formData.district = document.getElementById('dealerDistrict').value.trim();
            formData.state = document.getElementById('dealerState').value;
        }
        
        try {
            const response = await fetch('backend/api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Registration successful! Redirecting to login...', 'success');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showAlert(result.message || 'Registration failed. Please try again.', 'error');
                registerBtn.disabled = false;
                registerBtn.innerHTML = originalText;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('An error occurred. Please try again.', 'error');
            registerBtn.disabled = false;
            registerBtn.innerHTML = originalText;
        }
    });
});

// Add CSS for form-row
const style = document.createElement('style');
style.textContent = `
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    @media (max-width: 576px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
    
    .form-step-content {
        display: none;
    }
    
    .form-step-content.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .form-buttons .btn {
        flex: 1;
    }
    
    .role-option input[type="radio"] {
        display: none;
    }
`;
document.head.appendChild(style);
