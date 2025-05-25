
// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadUserProfile();
    loadUserStats();
    loadUserActivity();
    loadPromptHistory();
    setupProfileActions();
});

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update profile information
    const usernameElement = document.getElementById('profileUsername');
    const emailElement = document.getElementById('profileEmail');
    const memberSinceElement = document.getElementById('memberSince');
    const avatarInitials = document.getElementById('avatarInitials');
    
    if (usernameElement && userData.username) {
        usernameElement.textContent = userData.username;
    }
    
    if (emailElement && userData.email) {
        emailElement.textContent = userData.email;
    }
    
    if (memberSinceElement && userData.createdAt) {
        const date = new Date(userData.createdAt);
        memberSinceElement.textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    }
    
    if (avatarInitials && userData.username) {
        avatarInitials.textContent = userData.username.charAt(0).toUpperCase();
    }
}

function loadUserStats() {
    // Get user statistics from localStorage
    const promptHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    
    // Calculate stats
    const totalPrompts = promptHistory.length;
    const totalComparisons = userStats.totalComparisons || totalPrompts * 3; // Simulate comparison count
    const favoriteAI = userStats.favoriteAI || 'GPT-4';
    
    // Update stat displays
    const totalPromptsElement = document.getElementById('totalPrompts');
    const totalComparisonsElement = document.getElementById('totalComparisons');
    const favoriteAIElement = document.getElementById('favoriteAI');
    
    if (totalPromptsElement) {
        totalPromptsElement.textContent = totalPrompts;
    }
    
    if (totalComparisonsElement) {
        totalComparisonsElement.textContent = totalComparisons;
    }
    
    if (favoriteAIElement) {
        favoriteAIElement.textContent = favoriteAI;
    }
}

function loadUserActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    // Get recent activity from localStorage
    const promptHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    const recentActivity = generateActivityFromHistory(promptHistory.slice(0, 5));
    
    if (recentActivity.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No recent activity. Start by submitting your first prompt!</p>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentActivity.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function generateActivityFromHistory(history) {
    return history.map((prompt, index) => {
        const hoursAgo = (index + 1) * 2;
        const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) > 1 ? 's' : ''} ago`;
        
        return {
            icon: index % 2 === 0 ? '🔍' : '📝',
            title: index % 2 === 0 ? 'Compared AI responses' : 'Submitted new prompt',
            description: prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt,
            time: timeText
        };
    });
}

function loadPromptHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const promptHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    const recentHistory = promptHistory.slice(0, 5);
    
    if (recentHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <p>No prompt history yet. Submit your first prompt to get started!</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = recentHistory.map((prompt, index) => {
        const daysAgo = index + 1;
        const dateText = daysAgo === 1 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        
        return `
            <div class="history-item" onclick="usePrompt('${prompt.replace(/'/g, "\\'")}')">
                <div class="history-prompt">${prompt}</div>
                <div class="history-date">${dateText}</div>
            </div>
        `;
    }).join('');
}

function usePrompt(prompt) {
    // Store the prompt and navigate to main page
    localStorage.setItem('selectedPrompt', prompt);
    window.location.href = 'index.html';
}

function setupProfileActions() {
    const logoutBtn = document.getElementById('logoutBtn');
    const viewAllHistoryBtn = document.getElementById('viewAllHistory');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                logout();
            }
        });
    }
    
    if (viewAllHistoryBtn) {
        viewAllHistoryBtn.addEventListener('click', function() {
            showAllHistory();
        });
    }
}

function showAllHistory() {
    const promptHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    
    if (promptHistory.length === 0) {
        alert('No prompt history available.');
        return;
    }
    
    // Create a modal or new page to show all history
    // For now, we'll show an alert with the count
    alert(`You have ${promptHistory.length} prompts in your history. Feature coming soon!`);
}

// Check for selected prompt on page load
function checkSelectedPrompt() {
    const selectedPrompt = localStorage.getItem('selectedPrompt');
    if (selectedPrompt) {
        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            promptInput.value = selectedPrompt;
            localStorage.removeItem('selectedPrompt');
        }
    }
}

// Call this function on the main page
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', checkSelectedPrompt);
}
