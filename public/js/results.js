
// Results page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load the current prompt
    loadCurrentPrompt();
    
    // Setup comparison controls
    setupComparisonControls();
    
    // Setup new prompt functionality
    setupNewPromptSection();
    
    // Load sample AI responses (in a real app, these would come from API calls)
    loadSampleResponses();
});

function loadCurrentPrompt() {
    const displayPrompt = document.getElementById('displayPrompt');
    const currentPrompt = localStorage.getItem('currentPrompt');
    
    if (currentPrompt && displayPrompt) {
        displayPrompt.textContent = currentPrompt;
    } else if (displayPrompt) {
        displayPrompt.textContent = 'No prompt provided';
    }
}

function setupComparisonControls() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    const responsesGrid = document.getElementById('responsesGrid');
    const differencesContent = document.getElementById('differencesContent');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            compareButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get comparison type
            const compareType = this.dataset.compare;
            
            // Update display based on comparison type
            updateComparison(compareType, responsesGrid, differencesContent);
        });
    });
}

function updateComparison(compareType, responsesGrid, differencesContent) {
    const responseCards = responsesGrid.querySelectorAll('.response-card');
    
    // Reset all cards
    responseCards.forEach(card => {
        card.classList.remove('highlighted', 'dimmed');
    });
    
    // Update grid layout and highlight cards based on comparison type
    switch(compareType) {
        case '1-2':
            responsesGrid.className = 'responses-grid two-column';
            highlightCards([1, 2], responseCards);
            updateDifferences('1-2', differencesContent);
            break;
        case '1-3':
            responsesGrid.className = 'responses-grid two-column';
            highlightCards([1, 3], responseCards);
            updateDifferences('1-3', differencesContent);
            break;
        case '2-3':
            responsesGrid.className = 'responses-grid two-column';
            highlightCards([2, 3], responseCards);
            updateDifferences('2-3', differencesContent);
            break;
        case 'all':
        default:
            responsesGrid.className = 'responses-grid';
            highlightCards([1, 2, 3], responseCards);
            updateDifferences('all', differencesContent);
            break;
    }
}

function highlightCards(activeAIs, responseCards) {
    responseCards.forEach(card => {
        const aiNumber = parseInt(card.dataset.ai);
        if (activeAIs.includes(aiNumber)) {
            card.classList.add('highlighted');
        } else {
            card.classList.add('dimmed');
        }
    });
}

function updateDifferences(compareType, differencesContent) {
    const differences = {
        '1-2': [
            '<strong>Analysis Depth:</strong> GPT-4 provides more comprehensive analysis, while Claude focuses on structured reasoning.',
            '<strong>Response Style:</strong> GPT-4 uses detailed explanations, Claude emphasizes ethical considerations.',
            '<strong>Content Focus:</strong> GPT-4 covers broader aspects, Claude provides methodical approach.'
        ],
        '1-3': [
            '<strong>Detail Level:</strong> GPT-4 offers extensive detail, Gemini provides concise insights.',
            '<strong>Structure:</strong> GPT-4 uses comprehensive format, Gemini balances brevity with depth.',
            '<strong>Examples:</strong> GPT-4 includes multiple examples, Gemini uses specific targeted examples.'
        ],
        '2-3': [
            '<strong>Approach:</strong> Claude emphasizes structured analysis, Gemini focuses on key insights.',
            '<strong>Considerations:</strong> Claude includes ethical aspects, Gemini emphasizes practical applications.',
            '<strong>Presentation:</strong> Claude is methodical, Gemini is concise yet informative.'
        ],
        'all': [
            '<strong>Approach:</strong> GPT-4 focuses on comprehensive analysis, Claude emphasizes ethical considerations, while Gemini provides concise insights.',
            '<strong>Detail Level:</strong> GPT-4 offers extensive detail, Claude provides structured analysis, Gemini balances brevity with depth.',
            '<strong>Perspective:</strong> Each AI brings unique viewpoints to the same query, demonstrating diverse analytical approaches.'
        ]
    };
    
    if (differencesContent && differences[compareType]) {
        differencesContent.innerHTML = differences[compareType]
            .map(diff => `<div class="difference-item">${diff}</div>`)
            .join('');
    }
}

function setupNewPromptSection() {
    const submitBtn = document.getElementById('submitBtn');
    const promptInput = document.getElementById('promptInput');
    
    if (submitBtn && promptInput) {
        submitBtn.addEventListener('click', function() {
            const prompt = promptInput.value.trim();
            if (prompt) {
                // Store the new prompt
                localStorage.setItem('currentPrompt', prompt);
                
                // Add to history
                let history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
                if (!history.includes(prompt)) {
                    history.unshift(prompt);
                    if (history.length > 10) history = history.slice(0, 10);
                    localStorage.setItem('promptHistory', JSON.stringify(history));
                }
                
                // Reload the page to show new results
                window.location.reload();
            } else {
                alert('Please enter a prompt before submitting.');
            }
        });
    }
}

function loadSampleResponses() {
    // In a real application, this would make API calls to different AI services
    // For now, we'll use sample responses that vary based on the prompt
    
    const currentPrompt = localStorage.getItem('currentPrompt');
    if (!currentPrompt) return;
    
    // Simulate different responses based on prompt content
    const responses = generateSampleResponses(currentPrompt);
    
    // Update the response content
    document.getElementById('response1').innerHTML = `<p>${responses.gpt4}</p>`;
    document.getElementById('response2').innerHTML = `<p>${responses.claude}</p>`;
    document.getElementById('response3').innerHTML = `<p>${responses.gemini}</p>`;
}

function generateSampleResponses(prompt) {
    // Generate contextual sample responses based on the prompt
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('explain') || promptLower.includes('what')) {
        return {
            gpt4: `GPT-4's comprehensive explanation: This query requires a detailed analysis of the topic. The response should cover multiple perspectives, provide examples, and ensure accuracy. Key considerations include historical context, current applications, and future implications. The explanation should be accessible yet thorough.`,
            claude: `Claude's structured response: Approaching this systematically, I'll address the core question while considering ethical implications. The analysis should be methodical, covering essential points with appropriate caveats. It's important to present balanced information while acknowledging limitations and potential biases.`,
            gemini: `Gemini's concise insight: This topic can be understood through key principles and practical examples. The response balances comprehensive coverage with clarity, focusing on the most relevant aspects while providing actionable insights and clear explanations.`
        };
    } else if (promptLower.includes('how') || promptLower.includes('steps')) {
        return {
            gpt4: `GPT-4's detailed process: Here's a comprehensive step-by-step approach with detailed explanations for each phase. The methodology includes preparation, execution, and evaluation stages. Each step builds upon the previous one, with alternative approaches and troubleshooting guidance provided throughout.`,
            claude: `Claude's methodical guide: I'll outline a structured approach with clear stages and ethical considerations. The process emphasizes safety, effectiveness, and responsible implementation. Each step includes rationale and potential challenges to consider.`,
            gemini: `Gemini's practical steps: The process involves key stages with specific actions and measurable outcomes. This streamlined approach focuses on efficiency while maintaining quality, with clear milestones and success indicators at each phase.`
        };
    } else {
        return {
            gpt4: `GPT-4's thorough analysis: This topic requires comprehensive examination from multiple angles. The response addresses various facets of the question, providing detailed context, examples, and implications. The analysis considers both immediate and long-term perspectives.`,
            claude: `Claude's balanced perspective: Addressing this question requires careful consideration of different viewpoints and potential impacts. The response emphasizes accuracy, fairness, and responsible analysis while acknowledging areas of uncertainty or debate.`,
            gemini: `Gemini's focused response: This question can be addressed through direct analysis and relevant examples. The response provides clear insights while maintaining appropriate scope and depth, focusing on the most pertinent information.`
        };
    }
}

// Highlight differences in text (for future enhancement)
function highlightTextDifferences(text1, text2) {
    // This would implement actual text comparison algorithms
    // For now, it's a placeholder for future enhancement
    return {
        text1: text1,
        text2: text2,
        differences: []
    };
}
