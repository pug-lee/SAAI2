
// Edit profile functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadCurrentUserData();
    setupEditProfileForm();
});

function loadCurrentUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Populate form with current data
    const usernameInput = document.getElementById('editUsername');
    const emailInput = document.getElementById('editEmail');
    
    if (usernameInput && userData.username) {
        usernameInput.value = userData.username;
    }
    
    if (emailInput && userData.email) {
        emailInput.value = userData.email;
    }
}

function setupEditProfileForm() {
    const form = document.getElementById('editProfileForm');
    const username = document.getElementById('editUsername');
    const email = document.getElementById('editEmail');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    
    // Real-time validation
    username.addEventListener('blur', () => validateEditUsername());
    email.addEventListener('blur', () => validateEditEmail());
    currentPassword.addEventListener('blur', () => validateCurrentPassword());
    newPassword.addEventListener('blur', () => validateNewPassword());
    confirmNewPassword.addEventListener('input', () => validateConfirmNewPassword());
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateEditProfileForm()) {
            processProfileUpdate();
        }
    });
}

function validateEditUsername() {
    const username = document.getElementById('editUsername');
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

function validateEditEmail() {
    const email = document.getElementById('editEmail');
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

function validateCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword');
    const error = document.getElementById('currentPasswordError');
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentPassword.value !== userData.password) {
        showError(currentPassword, error, 'Current password is incorrect');
        return false;
    }
    
    clearError(currentPassword, error);
    return true;
}

function validateNewPassword() {
    const newPassword = document.getElementById('newPassword');
    const error = document.getElementById('newPasswordError');
    const value = newPassword.value;
    
    // If new password is empty, that's okay (user doesn't want to change password)
    if (value === '') {
        clearError(newPassword, error);
        return true;
    }
    
    if (value.length < 8) {
        showError(newPassword, error, 'New password must be at least 8 characters long');
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        showError(newPassword, error, 'New password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
    }
    
    clearError(newPassword, error);
    
    // Re-validate confirm password if it has a value
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    if (confirmNewPassword && confirmNewPassword.value) {
        validateConfirmNewPassword();
    }
    
    return true;
}

function validateConfirmNewPassword() {
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const error = document.getElementById('confirmNewPasswordError');
    
    // If new password is empty, confirm should also be empty
    if (newPassword.value === '') {
        if (confirmNewPassword.value !== '') {
            showError(confirmNewPassword, error, 'Confirm password should be empty if new password is empty');
            return false;
        }
        clearError(confirmNewPassword, error);
        return true;
    }
    
    if (newPassword.value !== confirmNewPassword.value) {
        showError(confirmNewPassword, error, 'New passwords do not match');
        return false;
    }
    
    clearError(confirmNewPassword, error);
    return true;
}

function validateEditProfileForm() {
    const usernameValid = validateEditUsername();
    const emailValid = validateEditEmail();
    const currentPasswordValid = validateCurrentPassword();
    const newPasswordValid = validateNewPassword();
    const confirmNewPasswordValid = validateConfirmNewPassword();
    
    return usernameValid && emailValid && currentPasswordValid && newPasswordValid && confirmNewPasswordValid;
}

function processProfileUpdate() {
    const submitBtn = document.querySelector('.auth-submit-btn');
    const username = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating Profile...';
    
    // Simulate API call
    setTimeout(() => {
        // Get current user data
        const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        // Update user data
        const updatedUserData = {
            ...currentUserData,
            username,
            email,
            password: newPassword || currentUserData.password, // Keep old password if new one is empty
            updatedAt: new Date().toISOString()
        };
        
        // Store updated user data
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        
        // Navigate to success page
        window.location.href = 'profile-success.html?action=update';
    }, 2000);
}

// Add CSS for cancel button
const style = document.createElement('style');
style.textContent = `
    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-direction: column;
    }
    
    .cancel-btn {
        background: transparent;
        border: 2px solid var(--copper);
        color: var(--copper);
        padding: 1rem;
        border-radius: 0.5rem;
        text-decoration: none;
        text-align: center;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: var(--font-inter);
    }
    
    .cancel-btn:hover {
        background: var(--copper);
        color: white;
        transform: translateY(-2px);
    }
    
    @media (min-width: 480px) {
        .form-actions {
            flex-direction: row;
        }
        
        .auth-submit-btn,
        .cancel-btn {
            flex: 1;
        }
    }
`;
document.head.appendChild(style);
