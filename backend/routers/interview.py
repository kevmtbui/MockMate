from fastapi import APIRouter, Query, UploadFile, File, Form, Request
from typing import List
from pydantic import BaseModel
from models.answer import Answer
from models.interview_settings import QuestionGenerationRequest, InterviewSettings
from controllers.interview_controller import (
    generate_questions, submit_answer, get_feedback, 
    get_all_answers, get_current_session, start_new_session
)
from services.resume_service import ResumeService
from middleware.file_security import validate_upload_file
from middleware.rate_limiter import limiter

router = APIRouter(prefix="/api")

@router.post("/generate-questions")
@limiter.limit("10/minute")
async def route_generate_questions(
    question_request: QuestionGenerationRequest,
    request: Request
):
    """Generate AI-powered custom interview questions"""
    return {"questions": generate_questions(question_request)}

@router.post("/upload-resume")
@limiter.limit("5/minute")
async def route_upload_resume(
    request: Request,
    file: UploadFile = File(...)
):
    """Upload and analyze resume with AI"""
    try:
        print(f"Uploading file: {file.filename}, content type: {file.content_type}")
        
        # Validate file security
        file_content = await validate_upload_file(file)
        print(f"File size: {len(file_content)} bytes")
        
        resume_text = ResumeService.extract_text_from_upload(file_content, file.filename)
        print(f"Extracted text length: {len(resume_text) if resume_text else 0}")
        
        if resume_text:
            print("Starting AI analysis...")
            # Use AI to analyze the resume
            analysis = ResumeService.analyze_resume_with_ai(resume_text)
            print(f"Analysis completed. Keys: {list(analysis.keys()) if analysis else 'None'}")
            
            ai_summary = ResumeService.generate_resume_summary_for_ai(resume_text, analysis)
            print(f"AI summary length: {len(ai_summary)}")
            
            return {
                "success": True, 
                "resume_text": resume_text,
                "analysis": analysis,
                "ai_summary": ai_summary
            }
        else:
            print("Failed to extract text from file")
            return {"success": False, "error": "Could not extract text from file"}
    except Exception as e:
        print(f"Error in upload-resume: {e}")
        return {"success": False, "error": str(e)}

@router.post("/submit-answer")
@limiter.limit("20/minute")
async def route_submit_answer(answer: Answer, request: Request):
    return submit_answer(answer)

@router.get("/get-feedback")
@limiter.limit("10/minute")
async def route_get_feedback(request: Request):
    return get_feedback()

@router.get("/answers")
@limiter.limit("30/minute")
async def route_get_all_answers(request: Request):
    return {"user_answers": get_all_answers()}

@router.get("/current-session")
@limiter.limit("30/minute")
async def route_get_current_session(request: Request):
    return get_current_session()

@router.post("/start-new-session")
@limiter.limit("10/minute")
async def route_start_new_session(request: Request):
    return start_new_session()

@router.post("/delete-my-session")
@limiter.limit("10/minute")
async def route_delete_session(session_id: str, request: Request):
    """Allow users to delete their interview data"""
    from middleware.session_cleanup import session_manager
    if session_manager.delete_session(session_id):
        return {"success": True, "message": "Your data has been deleted"}
    return {"success": False, "message": "Session not found or already deleted"}

@router.get("/session-stats")
@limiter.limit("10/minute")
async def route_get_session_stats(request: Request):
    """Get session statistics (for monitoring)"""
    from middleware.session_cleanup import session_manager
    return session_manager.get_stats()


# Voice endpoints removed - now using browser APIs
# TTS and STT are handled client-side using Web Speech APIs

# Legacy endpoint for backward compatibility
@router.get("/generate-questions-legacy")
def route_generate_questions_legacy(interview_type: str = Query("Mixed", description="Type of interview questions")):
    from controllers.interview_controller import generate_questions_legacy
    return {"questions": generate_questions_legacy(interview_type)}
