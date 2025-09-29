export class VoiceService {
  static async textToSpeech(text, voice = 'default') {
    try {
      // Stop any current speech
      speechSynthesis.cancel();
      
      // Wait for voices to load
      if (speechSynthesis.getVoices().length === 0) {
        await new Promise(resolve => {
          speechSynthesis.onvoiceschanged = resolve;
        });
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => v.default) || voices[0];
      
      if (voice !== 'default' && voices.length > 1) {
        selectedVoice = voices.find(v => 
          v.name.toLowerCase().includes(voice.toLowerCase()) ||
          v.lang.includes('en')
        ) || voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.8; // Slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      
      return new Promise((resolve, reject) => {
        utterance.onend = () => {
          resolve();
        };
        utterance.onerror = (error) => {
          console.error('TTS Error:', error);
          reject(error);
        };
        
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }

  static async speechToText() {
    try {
      // Use Web Speech Recognition API (browser-native, free)
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      return new Promise((resolve, reject) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        recognition.onresult = (event) => {
          finalTranscript = '';
          interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech' || event.error === 'audio-capture') {
            // These are common errors, don't reject
            resolve({ final: finalTranscript, interim: interimTranscript });
          } else {
            reject(new Error(`Speech recognition error: ${event.error}`));
          }
        };
        
        recognition.onend = () => {
          resolve({ final: finalTranscript, interim: interimTranscript });
        };
        
        recognition.start();
      });
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw error;
    }
  }

  static async getAvailableVoices() {
    try {
      // Use Web Speech Synthesis API voices (browser-native, free)
      const voices = speechSynthesis.getVoices();
      return voices.map(voice => ({
        id: voice.name,
        name: voice.name,
        lang: voice.lang,
        description: `${voice.name} (${voice.lang})`
      }));
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:audio/wav;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static async startRecording() {
    try {
      // Use Web Speech Recognition instead of MediaRecorder
      // This provides real-time transcription without needing to process audio files
      return await this.speechToText();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  static async playQuestion(questionText, voice = 'default') {
    try {
      await this.textToSpeech(questionText, voice);
    } catch (error) {
      console.error('Error playing question:', error);
      throw error;
    }
  }

  static async recordAnswer() {
    try {
      // Return a simple recording session that uses Web Speech Recognition
      return {
        stop: async () => {
          const result = await this.speechToText();
          return result.final || result.interim || '';
        }
      };
    } catch (error) {
      console.error('Error recording answer:', error);
      throw error;
    }
  }
}
