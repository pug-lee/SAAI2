
// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const historyBtn = document.getElementById('historyBtn');
    const historyMenu = document.getElementById('historyMenu');
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('promptInput');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('show');
        });
    }

    // History dropdown
    if (historyBtn && historyMenu) {
        historyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            historyMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!historyBtn.contains(e.target) && !historyMenu.contains(e.target)) {
                historyMenu.classList.remove('show');
            }
        });

        // Handle history item clicks
        const historyItems = historyMenu.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', function() {
                promptInput.value = this.textContent;
                historyMenu.classList.remove('show');
            });
        });
    }

    // Submit button functionality
    if (submitBtn && promptInput) {
        submitBtn.addEventListener('click', function() {
            const prompt = promptInput.value.trim();
            if (prompt) {
                // Store the prompt in localStorage for the results page
                localStorage.setItem('currentPrompt', prompt);
                
                // Add to history
                let history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
                if (!history.includes(prompt)) {
                    history.unshift(prompt);
                    if (history.length > 10) history = history.slice(0, 10);
                    localStorage.setItem('promptHistory', JSON.stringify(history));
                }
                
                // Navigate to results page
                window.location.href = 'results.html';
            } else {
                alert('Please enter a prompt before submitting.');
            }
        });
    }

    // Load history from localStorage
    loadHistory();
});

function loadHistory() {
    const historyMenu = document.getElementById('historyMenu');
    if (!historyMenu) return;

    const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    
    if (history.length === 0) {
        historyMenu.innerHTML = '<div class="history-item">No previous prompts</div>';
        return;
    }

    historyMenu.innerHTML = '';
    history.forEach(prompt => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
        item.addEventListener('click', function() {
            document.getElementById('promptInput').value = prompt;
            historyMenu.classList.remove('show');
        });
        historyMenu.appendChild(item);
    });
}

// Utility function for smooth scrolling
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add loading state to submit button
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Compare AI Responses';
        }
    }
}
