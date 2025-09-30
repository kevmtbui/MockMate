from fastapi import APIRouter, Query, UploadFile, File, Form
from typing import List
from pydantic import BaseModel
from models.answer import Answer
from models.interview_settings import QuestionGenerationRequest, InterviewSettings
from controllers.interview_controller import (
    generate_questions, submit_answer, get_feedback, 
    get_all_answers, get_current_session, start_new_session
)
from services.resume_service import ResumeService

router = APIRouter(prefix="/api")

@router.post("/generate-questions")
def route_generate_questions(request: QuestionGenerationRequest):
    """Generate AI-powered custom interview questions"""
    return {"questions": generate_questions(request)}

@router.post("/upload-resume")
async def route_upload_resume(file: UploadFile = File(...)):
    """Upload and analyze resume with AI"""
    try:
        print(f"Uploading file: {file.filename}, content type: {file.content_type}")
        file_content = await file.read()
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
def route_submit_answer(answer: Answer):
    return submit_answer(answer)

@router.get("/get-feedback")
def route_get_feedback():
    return get_feedback()

@router.get("/answers")
def route_get_all_answers():
    return {"user_answers": get_all_answers()}

@router.get("/current-session")
def route_get_current_session():
    return get_current_session()

@router.post("/start-new-session")
def route_start_new_session():
    return start_new_session()


# Voice endpoints removed - now using browser APIs
# TTS and STT are handled client-side using Web Speech APIs

# Legacy endpoint for backward compatibility
@router.get("/generate-questions-legacy")
def route_generate_questions_legacy(interview_type: str = Query("Mixed", description="Type of interview questions")):
    from controllers.interview_controller import generate_questions_legacy
    return {"questions": generate_questions_legacy(interview_type)}
