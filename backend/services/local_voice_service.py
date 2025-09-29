from typing import Optional

class LocalVoiceService:
    """
    Local voice service using browser APIs instead of OpenAI
    This service provides instructions for frontend implementation
    """
    
    @staticmethod
    def get_voice_instructions():
        """
        Returns instructions for implementing voice features in the frontend
        using free browser APIs
        """
        return {
            "text_to_speech": {
                "description": "Use Web Speech Synthesis API (browser-native)",
                "implementation": """
// Frontend implementation
const speakText = (text, voice = 'default') => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name.includes(voice)) || voices[0];
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    return new Promise((resolve, reject) => {
        utterance.onend = resolve;
        utterance.onerror = reject;
        speechSynthesis.speak(utterance);
    });
};
                """,
                "features": [
                    "100% Free",
                    "No API calls needed",
                    "Multiple voice options",
                    "Adjustable rate, pitch, volume"
                ]
            },
            
            "speech_to_text": {
                "description": "Use Web Speech Recognition API (browser-native)",
                "implementation": """
// Frontend implementation
const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    return new Promise((resolve, reject) => {
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            resolve({
                final: finalTranscript,
                interim: interimTranscript
            });
        };
        
        recognition.onerror = (event) => {
            reject(new Error(`Speech recognition error: ${event.error}`));
        };
        
        recognition.onend = () => {
            // Auto-restart if needed
        };
        
        recognition.start();
    });
};
                """,
                "features": [
                    "100% Free",
                    "Real-time transcription",
                    "Interim results",
                    "Multiple languages supported"
                ]
            },
            
            "available_voices": {
                "description": "Get available TTS voices",
                "implementation": """
// Frontend implementation
const getAvailableVoices = () => {
    const voices = speechSynthesis.getVoices();
    return voices.map(voice => ({
        id: voice.name,
        name: voice.name,
        lang: voice.lang,
        description: `${voice.name} (${voice.lang})`
    }));
};
                """,
                "note": "Call after speechSynthesis.onvoiceschanged event"
            }
        }
    
    @staticmethod
    def get_voice_implementation_guide():
        """
        Returns a complete guide for implementing voice features
        """
        return {
            "setup_required": [
                "No backend setup needed",
                "Works in modern browsers (Chrome, Firefox, Safari, Edge)",
                "Requires HTTPS in production (localhost works for development)"
            ],
            
            "browser_support": {
                "speech_synthesis": "Chrome 33+, Firefox 49+, Safari 7+, Edge 14+",
                "speech_recognition": "Chrome 25+, Safari 14.1+, Edge 79+ (Firefox not supported)"
            },
            
            "limitations": [
                "Speech Recognition requires microphone permission",
                "Some browsers may have different voice qualities",
                "Offline functionality depends on browser implementation"
            ],
            
            "production_considerations": [
                "Use HTTPS for speech recognition",
                "Handle browser compatibility gracefully",
                "Provide fallback text input options",
                "Test across different browsers and devices"
            ]
        }
