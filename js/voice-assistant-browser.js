class VoiceAssistant {
    constructor() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported');
            return;
        }

        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        
        this.setupRecognition();
        this.addVoiceButton();
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateButtonState(true);
            console.log('Voice recognition started');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateButtonState(false);
            console.log('Voice recognition ended');
        };

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            console.log('Transcript:', transcript);

            // Process final results
            if (event.results[0].isFinal) {
                const searchQuery = transcript.toLowerCase().trim();
                console.log('Final search query:', searchQuery);
                
                // Find and update search input
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = searchQuery;
                    
                    // Trigger input event
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    // Try to find and trigger the search function
                    if (typeof window.performSearch === 'function') {
                        window.performSearch(searchQuery);
                    } else {
                        // If performSearch isn't available, try to click the search button
                        const searchBtn = document.querySelector('.search-btn');
                        if (searchBtn) {
                            searchBtn.click();
                        }
                    }
                    
                    this.speak(`Searching for ${searchQuery}`);
                }
            }

            // Update visual feedback
            const voiceBtn = document.querySelector('.voice-btn');
            if (voiceBtn) {
                const feedbackText = document.createElement('div');
                feedbackText.className = 'voice-feedback';
                feedbackText.textContent = transcript;
                
                // Remove any existing feedback
                const existingFeedback = document.querySelector('.voice-feedback');
                if (existingFeedback) {
                    existingFeedback.remove();
                }
                
                voiceBtn.appendChild(feedbackText);
                setTimeout(() => feedbackText.remove(), 3000);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.speak("Sorry, I didn't catch that. Please try again.");
            this.isListening = false;
            this.updateButtonState(false);
        };
    }

    addVoiceButton() {
        // Add styles if they don't exist
        if (!document.getElementById('voice-assistant-styles')) {
            const styles = document.createElement('style');
            styles.id = 'voice-assistant-styles';
            styles.textContent = `
                .voice-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #C68961;
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                .voice-btn i {
                    font-size: 24px;
                    transition: all 0.3s ease;
                }
                .voice-btn:hover {
                    background: #a06c46;
                    transform: scale(1.05);
                }
                .voice-btn.listening {
                    background: #4CAF50;
                    animation: pulse 1.5s infinite;
                }
                .voice-feedback {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    white-space: nowrap;
                    transform: translateX(-10%);
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    50% { transform: scale(1.05); box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
                    100% { transform: scale(1); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    updateButtonState(isListening) {
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            if (isListening) {
                voiceBtn.classList.add('listening');
            } else {
                voiceBtn.classList.remove('listening');
            }
        }
    }

    startListening() {
        if (!this.isListening) {
            try {
                this.recognition.start();
                this.speak("I'm listening");
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.recognition.stop();
            }
        }
    }

    stopListening() {
        if (this.isListening) {
            this.recognition.stop();
        }
    }

    speak(text) {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synthesis.speak(utterance);
    }
}

// Initialize voice assistant
document.addEventListener('DOMContentLoaded', () => {
    const voiceAssistant = new VoiceAssistant();
    
    // Add voice button if it doesn't exist
    if (!document.querySelector('.voice-btn')) {
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-btn';
        voiceBtn.title = 'Voice Assistant';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        document.body.appendChild(voiceBtn);
    }

    // Add click handler to voice button
    document.querySelector('.voice-btn').addEventListener('click', () => {
        if (!voiceAssistant.isListening) {
            voiceAssistant.startListening();
        } else {
            voiceAssistant.stopListening();
        }
    });
});
