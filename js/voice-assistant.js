class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.synthesis = window.speechSynthesis;
        this.serverUrl = 'http://localhost:5000';
        
        this.addVoiceIndicator();
        this.setupAudioRecording();
    }

    setupAudioRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioChunks = [];
                    await this.processAudio(audioBlob);
                };
            })
            .catch(error => {
                console.error('Microphone access error:', error);
                this.showMicrophoneError();
            });
    }

    async processAudio(audioBlob) {
        try {
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            
            reader.onloadend = async () => {
                const base64Audio = reader.result;
                
                // Send to backend
                const response = await fetch(`${this.serverUrl}/api/process-voice`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ audio: base64Audio })
                });

                if (!response.ok) {
                    throw new Error('Server response was not ok');
                }

                const data = await response.json();
                
                if (data.success) {
                    // Play response audio
                    const audio = new Audio(data.audio);
                    audio.play();
                    
                    // Execute command
                    this.executeCommand(data.text, data.response);
                } else {
                    throw new Error(data.error || 'Unknown error occurred');
                }
            };
        } catch (error) {
            console.error('Error processing audio:', error);
            this.speak('Sorry, there was an error processing your command.');
        } finally {
            this.updateIndicatorStatus(false);
        }
    }

    executeCommand(text, response) {
        // Execute frontend actions based on the command
        if (text.includes('search for')) {
            const query = text.replace('search for', '').trim();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = query;
                if (typeof performSearch === 'function') {
                    performSearch(query);
                }
            }
        } else if (text.includes('go to')) {
            const pages = {
                'home': '/',
                'cart': '/cart.html',
                'subcategory': '/subcategory.html'
            };
            const page = text.replace('go to', '').trim();
            if (pages[page]) {
                window.location.href = pages[page];
            }
        } else if (text.includes('scroll')) {
            const amount = 300;
            if (text.includes('up')) {
                window.scrollBy(0, -amount);
            } else if (text.includes('down')) {
                window.scrollBy(0, amount);
            }
        } else if (text.includes('change theme')) {
            const html = document.querySelector('html');
            const newTheme = text.includes('dark') ? 'dark' : 'light';
            html.dataset.theme = newTheme;
        }
    }

    addVoiceIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'voice-indicator';
        indicator.innerHTML = `
            <div class="voice-icon">
                <i class="fas fa-microphone"></i>
            </div>
            <div class="voice-status">Click to Activate Voice Assistant</div>
        `;
        document.body.appendChild(indicator);
        
        const style = document.createElement('style');
        style.textContent = `
            .voice-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary-color, #c68961);
                color: white;
                padding: 15px 25px;
                border-radius: 30px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                font-size: 16px;
                font-weight: 500;
            }
            .voice-indicator:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            }
            .voice-indicator.listening {
                background: #28a745;
            }
            .voice-indicator.error {
                background: #dc3545;
                cursor: not-allowed;
            }
            .voice-icon {
                font-size: 20px;
            }
            .voice-status {
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
        
        indicator.addEventListener('click', () => {
            if (!this.isListening) {
                this.startListening();
            } else {
                this.stopListening();
            }
        });
    }

    updateIndicatorStatus(listening) {
        const indicator = document.querySelector('.voice-indicator');
        const statusText = document.querySelector('.voice-status');
        if (indicator && statusText) {
            if (listening) {
                indicator.classList.add('listening');
                statusText.textContent = 'Listening...';
            } else {
                indicator.classList.remove('listening');
                statusText.textContent = 'Click to Activate Voice Assistant';
            }
        }
    }

    showMicrophoneError() {
        const indicator = document.querySelector('.voice-indicator');
        if (indicator) {
            indicator.className = 'voice-indicator error';
            indicator.innerHTML = `
                <div class="voice-icon">
                    <i class="fas fa-microphone-slash"></i>
                </div>
                <div class="voice-status">Please enable microphone access</div>
            `;
        }
    }

    startListening() {
        if (this.isListening || !this.mediaRecorder) return;
        
        this.isListening = true;
        this.updateIndicatorStatus(true);
        this.audioChunks = [];
        this.mediaRecorder.start();
        
        // Stop recording after 5 seconds
        setTimeout(() => {
            if (this.isListening) {
                this.stopListening();
            }
        }, 5000);
    }

    stopListening() {
        if (!this.isListening || !this.mediaRecorder) return;
        
        this.isListening = false;
        this.mediaRecorder.stop();
        this.updateIndicatorStatus(false);
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        this.synthesis.speak(utterance);
    }
}

// Initialize voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new VoiceAssistant();
});
