"""User interview history routes"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database.config import get_db
from database.models import User, InterviewHistory, SavedResume
from auth.security import get_current_user
from middleware.rate_limiter import limiter

router = APIRouter(prefix="/api/user", tags=["user"])

# Request/Response models
class InterviewSaveRequest(BaseModel):
    job_title: Optional[str]
    company_name: Optional[str]
    job_level: Optional[str]
    interview_type: str
    difficulty: str
    questions: List[str]
    answers: List[str]
    overall_score: Optional[float]
    communication_score: Optional[float]
    technical_score: Optional[float]
    problem_solving_score: Optional[float]
    behavioral_score: Optional[float]
    feedback_summary: Optional[str]
    strengths: Optional[List[str]]
    improvements: Optional[List[str]]

@router.post("/save-interview")
@limiter.limit("20/hour")
async def save_interview(
    interview_data: InterviewSaveRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save completed interview to user history"""
    
    interview = InterviewHistory(
        user_id=current_user.id,
        job_title=interview_data.job_title,
        company_name=interview_data.company_name,
        job_level=interview_data.job_level,
        interview_type=interview_data.interview_type,
        difficulty=interview_data.difficulty,
        questions=interview_data.questions,
        answers=interview_data.answers,
        overall_score=interview_data.overall_score,
        communication_score=interview_data.communication_score,
        technical_score=interview_data.technical_score,
        problem_solving_score=interview_data.problem_solving_score,
        behavioral_score=interview_data.behavioral_score,
        feedback_summary=interview_data.feedback_summary,
        strengths=interview_data.strengths,
        improvements=interview_data.improvements,
        completed_at=datetime.utcnow()
    )
    
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return {
        "success": True,
        "interview_id": interview.id,
        "message": "Interview saved successfully"
    }

@router.get("/interviews")
@limiter.limit("30/minute")
async def get_user_interviews(
    request: Request,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's interview history"""
    
    interviews = db.query(InterviewHistory)\
        .filter(InterviewHistory.user_id == current_user.id)\
        .order_by(desc(InterviewHistory.created_at))\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return {
        "interviews": [{
            "id": i.id,
            "job_title": i.job_title,
            "company_name": i.company_name,
            "interview_type": i.interview_type,
            "difficulty": i.difficulty,
            "overall_score": i.overall_score,
            "created_at": i.created_at,
            "completed_at": i.completed_at,
            "question_count": len(i.questions) if i.questions else 0
        } for i in interviews],
        "total": db.query(InterviewHistory).filter(InterviewHistory.user_id == current_user.id).count()
    }

@router.get("/interview/{interview_id}")
@limiter.limit("30/minute")
async def get_interview_details(
    interview_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed interview results"""
    
    interview = db.query(InterviewHistory)\
        .filter(
            InterviewHistory.id == interview_id,
            InterviewHistory.user_id == current_user.id
        ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return {
        "id": interview.id,
        "job_title": interview.job_title,
        "company_name": interview.company_name,
        "job_level": interview.job_level,
        "interview_type": interview.interview_type,
        "difficulty": interview.difficulty,
        "questions": interview.questions,
        "answers": interview.answers,
        "overall_score": interview.overall_score,
        "communication_score": interview.communication_score,
        "technical_score": interview.technical_score,
        "problem_solving_score": interview.problem_solving_score,
        "behavioral_score": interview.behavioral_score,
        "feedback_summary": interview.feedback_summary,
        "strengths": interview.strengths,
        "improvements": interview.improvements,
        "created_at": interview.created_at,
        "completed_at": interview.completed_at
    }

@router.get("/stats")
@limiter.limit("30/minute")
async def get_user_stats(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user progress statistics"""
    
    interviews = db.query(InterviewHistory)\
        .filter(InterviewHistory.user_id == current_user.id)\
        .all()
    
    if not interviews:
        return {
            "total_interviews": 0,
            "average_score": 0,
            "best_score": 0,
            "recent_trend": "N/A",
            "interviews_by_type": {},
            "score_progression": []
        }
    
    # Calculate stats
    scores = [i.overall_score for i in interviews if i.overall_score]
    avg_score = sum(scores) / len(scores) if scores else 0
    best_score = max(scores) if scores else 0
    
    # Get recent trend (last 5 vs previous 5)
    recent_5 = scores[-5:] if len(scores) >= 5 else scores
    previous_5 = scores[-10:-5] if len(scores) >= 10 else []
    
    if recent_5 and previous_5:
        recent_avg = sum(recent_5) / len(recent_5)
        previous_avg = sum(previous_5) / len(previous_5)
        trend = "improving" if recent_avg > previous_avg else "declining" if recent_avg < previous_avg else "stable"
    else:
        trend = "insufficient data"
    
    # Interviews by type
    by_type = {}
    for interview in interviews:
        itype = interview.interview_type
        by_type[itype] = by_type.get(itype, 0) + 1
    
    # Score progression (last 10 interviews)
    score_progression = [{
        "date": i.created_at.isoformat(),
        "score": i.overall_score,
        "interview_type": i.interview_type
    } for i in interviews[-10:] if i.overall_score]
    
    return {
        "total_interviews": len(interviews),
        "average_score": round(avg_score, 1),
        "best_score": round(best_score, 1),
        "recent_trend": trend,
        "interviews_by_type": by_type,
        "score_progression": score_progression
    }

@router.delete("/interview/{interview_id}")
@limiter.limit("20/minute")
async def delete_interview(
    interview_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an interview from history"""
    
    interview = db.query(InterviewHistory)\
        .filter(
            InterviewHistory.id == interview_id,
            InterviewHistory.user_id == current_user.id
        ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    db.delete(interview)
    db.commit()
    
    return {"success": True, "message": "Interview deleted"}

class ResumeSaveRequest(BaseModel):
    resume_text: str
    ai_analysis: dict
    ai_summary: str
    filename: str

@router.post("/save-resume")
@limiter.limit("10/hour")
async def save_resume(
    resume_data: ResumeSaveRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save resume to user account"""
    
    # Mark all existing resumes as inactive
    db.query(SavedResume).filter(SavedResume.user_id == current_user.id).update({"is_active": 0})
    
    # Create new active resume
    resume = SavedResume(
        user_id=current_user.id,
        resume_text=resume_data.resume_text,
        ai_analysis=resume_data.ai_analysis,
        ai_summary=resume_data.ai_summary,
        filename=resume_data.filename,
        is_active=1
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return {
        "success": True,
        "resume_id": resume.id,
        "message": "Resume saved successfully"
    }

@router.get("/active-resume")
@limiter.limit("30/minute")
async def get_active_resume(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's active resume"""
    
    resume = db.query(SavedResume)\
        .filter(
            SavedResume.user_id == current_user.id,
            SavedResume.is_active == 1
        ).first()
    
    if not resume:
        return {"success": False, "message": "No active resume found"}
    
    return {
        "success": True,
        "resume_text": resume.resume_text,
        "ai_analysis": resume.ai_analysis,
        "ai_summary": resume.ai_summary,
        "filename": resume.filename,
        "created_at": resume.created_at
    }



