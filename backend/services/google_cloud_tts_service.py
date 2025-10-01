"""Google Cloud Text-to-Speech service with Chirp3-HD voice"""
import os
import base64
from google.cloud import texttospeech
from google.oauth2 import service_account

class GoogleCloudTTSService:
    """Service for converting text to speech using Google Cloud TTS with Chirp3-HD voice"""
    
    def __init__(self):
        # Set up credentials
        credentials_path = os.path.join(os.path.dirname(__file__), '..', 'google-cloud-credentials.json')
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        self.client = texttospeech.TextToSpeechClient(credentials=credentials)
    
    def text_to_speech(self, text: str, voice_name: str = "en-US-Chirp3-HD-Laomedeia") -> bytes:
        """
        Convert text to speech using Google Cloud TTS
        
        Args:
            text: Text to convert to speech
            voice_name: Voice to use (default: en-US-Chirp3-HD-Laomedeia - premium female voice)
        
        Returns:
            Audio content as bytes (MP3 format)
        """
        try:
            # Set the text input to be synthesized
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Build the voice request
            voice = texttospeech.VoiceSelectionParams(
                name=voice_name,
                language_code="en-US"
            )
            
            # Select the type of audio file
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=0.95,  # Slightly slower for clarity
                pitch=0.0,
                volume_gain_db=-4.0  # Reduce volume to prevent peaking
            )
            
            # Perform the text-to-speech request
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            return response.audio_content
            
        except Exception as e:
            print(f"Error in Google Cloud TTS: {e}")
            raise
    
    def text_to_speech_base64(self, text: str, voice_name: str = "en-US-Chirp3-HD-Laomedeia") -> str:
        """
        Convert text to speech and return as base64 string
        
        Args:
            text: Text to convert to speech
            voice_name: Voice to use
        
        Returns:
            Base64 encoded audio (MP3)
        """
        try:
            audio_content = self.text_to_speech(text, voice_name)
            return base64.b64encode(audio_content).decode('utf-8')
        except Exception as e:
            print(f"Error in Google Cloud TTS base64: {e}")
            raise

# Create a singleton instance
_tts_service = None

def get_tts_service():
    """Get or create the TTS service singleton"""
    global _tts_service
    if _tts_service is None:
        _tts_service = GoogleCloudTTSService()
    return _tts_service

