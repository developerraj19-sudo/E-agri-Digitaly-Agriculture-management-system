/**
 * Chatbot Widget for E-AGRI
 * AI-powered agriculture assistant
 */

// Chatbot state
let chatbotOpen = false;
let chatHistory = [];

// Initialize chatbot
function initChatbot() {
    const chatbotHTML = `
        <div id="chatbotWidget" class="chatbot-widget">
            <!-- Chatbot Button -->
            <button id="chatbotToggle" class="chatbot-toggle" onclick="toggleChatbot()">
                <i class="fas fa-comment-dots"></i>
                <span class="chatbot-badge">AI</span>
            </button>

            <!-- Chatbot Window -->
            <div id="chatbotWindow" class="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h4>E-AGRI Assistant</h4>
                            <p class="chatbot-status">Online</p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button onclick="minimizeChatbot()" class="chatbot-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button onclick="toggleChatbot()" class="chatbot-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-body" id="chatbotBody">
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hello! 👋 I'm your E-AGRI assistant. How can I help you today?</p>
                            <div class="quick-replies">
                                <button onclick="sendQuickReply('What is E-AGRI?')">What is E-AGRI?</button>
                                <button onclick="sendQuickReply('How to register?')">How to register?</button>
                                <button onclick="sendQuickReply('Crop recommendations')">Crop recommendations</button>
                                <button onclick="sendQuickReply('Market prices')">Market prices</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chatbot-footer">
                    <div class="chatbot-input-container">
                        <button class="chatbot-attach-btn" onclick="showAttachmentOptions()">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <input 
                            type="text" 
                            id="chatbotInput" 
                            class="chatbot-input" 
                            placeholder="Type your message..."
                            onkeypress="handleChatKeyPress(event)"
                        >
                        <button class="chatbot-voice-btn" onclick="startVoiceInput()">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button class="chatbot-send-btn" onclick="sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="chatbot-typing" id="chatbotTyping" style="display: none;">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add chatbot to page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Add welcome message to history
    chatHistory.push({
        type: 'bot',
        message: "Hello! 👋 I'm your E-AGRI assistant. How can I help you today?",
        timestamp: new Date()
    });
}

// Toggle chatbot window
function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');

    if (chatbotOpen) {
        chatbotWindow.classList.add('active');
        chatbotToggle.classList.add('active');
        document.getElementById('chatbotInput').focus();
    } else {
        chatbotWindow.classList.remove('active');
        chatbotToggle.classList.remove('active');
    }
}

// Minimize chatbot
function minimizeChatbot() {
    chatbotOpen = false;
    document.getElementById('chatbotWindow').classList.remove('active');
    document.getElementById('chatbotToggle').classList.remove('active');
}

// Handle keyboard input
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage('user', message);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    try {
        const response = await getBotResponse(message);
        hideTypingIndicator();
        addMessage('bot', response);
    } catch (error) {
        hideTypingIndicator();
        addMessage('bot', "I'm sorry, I'm having trouble responding right now. Please try again later.");
    }
}

// Send quick reply
function sendQuickReply(message) {
    document.getElementById('chatbotInput').value = message;
    sendMessage();
}

// Add message to chat
function addMessage(type, text) {
    const chatBody = document.getElementById('chatbotBody');
    const messageClass = type === 'user' ? 'user-message' : 'bot-message';

    const messageHTML = `
        <div class="chatbot-message ${messageClass}">
            ${type === 'bot' ? '<div class="message-avatar"><i class="fas fa-robot"></i></div>' : ''}
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
            ${type === 'user' ? '<div class="message-avatar"><i class="fas fa-user"></i></div>' : ''}
        </div>
    `;

    chatBody.insertAdjacentHTML('beforeend', messageHTML);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Add to history
    chatHistory.push({
        type: type,
        message: text,
        timestamp: new Date()
    });
}

// Get bot response
async function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Simple rule-based responses
    if (lowerMessage.includes('e-agri') || lowerMessage.includes('what is')) {
        return "E-AGRI is a digital agriculture management platform that connects farmers, dealers, and administrators. We provide real-time weather updates, market prices, AI-powered crop recommendations, and an online marketplace for agricultural products. 🌾";
    }
    
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
        return "To register on E-AGRI:\n\n1. Click the 'Register' button on the top right\n2. Choose your role (Farmer or Dealer)\n3. Fill in your details\n4. Farmers are approved instantly!\n5. Dealers need admin verification\n\nWould you like me to take you to the registration page? 📝";
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('recommend')) {
        return "Our AI provides personalized crop recommendations based on:\n\n✅ Your soil type\n✅ Current season\n✅ Local climate\n✅ Market demand\n\nRegister as a farmer to get customized recommendations for your farm! 🌱";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
        return "E-AGRI provides daily market prices (mandi rates) for various crops. You can:\n\n📊 View current prices\n📈 Compare across markets\n📅 Track price trends\n\nLogin as a farmer to access real-time market data! 💰";
    }
    
    if (lowerMessage.includes('weather')) {
        return "Get accurate weather forecasts for your farm location including:\n\n🌤️ Temperature & conditions\n💧 Rainfall predictions\n💨 Wind speed\n📅 7-day forecasts\n\nPerfect for planning your farming activities! ☁️";
    }
    
    if (lowerMessage.includes('dealer') || lowerMessage.includes('sell')) {
        return "As a dealer on E-AGRI, you can:\n\n✅ List your products online\n✅ Reach thousands of farmers\n✅ Manage inventory digitally\n✅ Track orders & sales\n\nRegister as a dealer to start selling today! 🏪";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return "I'm here to help! You can ask me about:\n\n• Platform features\n• Registration process\n• How to use E-AGRI\n• Crop recommendations\n• Market prices\n\nOr contact our support team at support@eagri.com 📞";
    }

    if (lowerMessage.includes('thank')) {
        return "You're welcome! 😊 Feel free to ask if you have any more questions. Happy farming! 🌾";
    }

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
        return "Hello! 👋 How can I assist you with E-AGRI today?";
    }

    // Default response
    return "I understand you're asking about '" + userMessage + "'. Here are some things I can help with:\n\n• Platform information\n• Registration help\n• Features overview\n• Crop recommendations\n• Market prices\n\nWhat would you like to know more about? 🤔";
}

// Typing indicator
function showTypingIndicator() {
    document.getElementById('chatbotTyping').style.display = 'flex';
    const chatBody = document.getElementById('chatbotBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('chatbotTyping').style.display = 'none';
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Voice input (placeholder)
function startVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatbotInput').value = transcript;
        };
        recognition.start();
    } else {
        alert('Voice input not supported in your browser. Please use Chrome.');
    }
}

// Attachment options (placeholder)
function showAttachmentOptions() {
    addMessage('bot', 'File attachments will be available soon! For now, please describe what you need help with. 📎');
}

// Initialize chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
