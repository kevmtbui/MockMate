"""Text-to-Speech router using Google Cloud TTS with Chirp3-HD voice"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.google_cloud_tts_service import get_tts_service
from middleware.rate_limiter import limiter

router = APIRouter(prefix="/api/tts", tags=["tts"])

class TTSRequest(BaseModel):
    text: str
    language_code: str = "en-US"
    voice: str = "en-US-Chirp3-HD-Laomedeia"  # Premium Google Cloud TTS voice

@router.post("/synthesize")
@limiter.limit("100/minute")
async def synthesize_speech(request: Request, tts_request: TTSRequest):
    """
    Convert text to speech using Google Cloud TTS with Chirp3-HD voice
    Returns base64 encoded audio
    """
    try:
        tts_service = get_tts_service()
        audio_base64 = tts_service.text_to_speech_base64(
            text=tts_request.text,
            voice_name=tts_request.voice
        )
        
        if audio_base64:
            return {
                "success": True,
                "audio": audio_base64,
                "format": "mp3"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to synthesize speech")
            
    except Exception as e:
        print(f"TTS endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

