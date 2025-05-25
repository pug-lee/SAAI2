
// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        setupSignupForm();
    }
    
    if (loginForm) {
        setupLoginForm();
    }
});

function setupSignupForm() {
    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const acceptTerms = document.getElementById('acceptTerms');
    
    // Real-time validation
    username.addEventListener('blur', () => validateUsername());
    email.addEventListener('blur', () => validateEmail());
    password.addEventListener('blur', () => validatePassword());
    confirmPassword.addEventListener('blur', () => validateConfirmPassword());
    
    // Password confirmation on input
    confirmPassword.addEventListener('input', () => validateConfirmPassword());
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateSignupForm()) {
            processSignup();
        }
    });
}

function validateUsername() {
    const username = document.getElementById('username');
    const error = document.getElementById('usernameError');
    const value = username.value.trim();
    
    if (value.length < 3) {
        showError(username, error, 'Username must be at least 3 characters long');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        showError(username, error, 'Username can only contain letters, numbers, and underscores');
        return false;
    }
    
    clearError(username, error);
    return true;
}

function validateEmail() {
    const email = document.getElementById('email');
    const error = document.getElementById('emailError');
    const value = email.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showError(email, error, 'Please enter a valid email address');
        return false;
    }
    
    clearError(email, error);
    return true;
}

function validatePassword() {
    const password = document.getElementById('password');
    const error = document.getElementById('passwordError');
    const value = password.value;
    
    if (value.length < 8) {
        showError(password, error, 'Password must be at least 8 characters long');
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        showError(password, error, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
    }
    
    clearError(password, error);
    
    // Re-validate confirm password if it has a value
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword && confirmPassword.value) {
        validateConfirmPassword();
    }
    
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const error = document.getElementById('confirmPasswordError');
    
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, error, 'Passwords do not match');
        return false;
    }
    
    clearError(confirmPassword, error);
    return true;
}

function validateTerms() {
    const acceptTerms = document.getElementById('acceptTerms');
    const error = document.getElementById('termsError');
    
    if (!acceptTerms.checked) {
        showError(null, error, 'You must accept the Terms & Conditions');
        return false;
    }
    
    clearError(null, error);
    return true;
}

function validateSignupForm() {
    const usernameValid = validateUsername();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();
    const termsValid = validateTerms();
    
    return usernameValid && emailValid && passwordValid && confirmPasswordValid && termsValid;
}

function showError(input, errorElement, message) {
    if (input) {
        input.classList.add('error');
    }
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(input, errorElement) {
    if (input) {
        input.classList.remove('error');
    }
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

function processSignup() {
    const submitBtn = document.querySelector('.auth-submit-btn');
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    // Simulate API call
    setTimeout(() => {
        // Store user data (in a real app, this would be sent to a server)
        const userData = {
            username,
            email,
            password, // In real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Navigate to success page
        window.location.href = 'profile-success.html?action=signup';
    }, 2000);
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processLogin();
    });
}

function processLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = document.querySelector('.auth-submit-btn');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';
    
    // Simulate authentication
    setTimeout(() => {
        // In a real app, this would verify credentials with a server
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (storedUser.email === email && storedUser.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'profile.html';
        } else {
            // Show error
            showError(null, document.getElementById('loginError'), 'Invalid email or password');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }, 1500);
}

// Check authentication status
function isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Logout functionality
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Protect authenticated pages
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
