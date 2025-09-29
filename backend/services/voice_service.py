import os
import base64
from openai import OpenAI
from typing import Optional

# Initialize OpenAI client for TTS
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-openai-api-key-here"))

class VoiceService:
    @staticmethod
    def text_to_speech(text: str, voice: str = "alloy") -> Optional[str]:
        """Convert text to speech using OpenAI TTS"""
        try:
            response = client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text,
                response_format="mp3"
            )
            
            # Convert audio to base64 for frontend
            audio_bytes = response.content
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            return audio_base64
            
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
            return None
    
    @staticmethod
    def speech_to_text(audio_base64: str) -> Optional[str]:
        """Convert speech to text using OpenAI Whisper"""
        try:
            # Decode base64 audio
            audio_bytes = base64.b64decode(audio_base64)
            
            # Create a temporary file-like object
            import io
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "audio.wav"
            
            # Transcribe using Whisper
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            
            return transcript
            
        except Exception as e:
            print(f"Error in speech-to-text: {e}")
            return None
    
    @staticmethod
    def get_available_voices():
        """Get list of available TTS voices"""
        return [
            {"id": "alloy", "name": "Alloy", "description": "Neutral, balanced voice"},
            {"id": "echo", "name": "Echo", "description": "Clear, professional voice"},
            {"id": "fable", "name": "Fable", "description": "Warm, engaging voice"},
            {"id": "onyx", "name": "Onyx", "description": "Deep, authoritative voice"},
            {"id": "nova", "name": "Nova", "description": "Bright, energetic voice"},
            {"id": "shimmer", "name": "Shimmer", "description": "Soft, gentle voice"}
        ]
