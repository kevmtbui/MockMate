from pydantic import BaseModel
from typing import List, Optional

class FeedbackItem(BaseModel):
    category: str  # "strength", "weakness", "improvement"
    title: str
    description: str
    suggestion: Optional[str] = None

class QuestionScore(BaseModel):
    question_index: int
    score: int  # 1-10
    feedback: str
    suggestions: List[str]

class CategoryScores(BaseModel):
    communication: int
    technical: int
    problem_solving: int
    behavioral: int

class InterviewFeedback(BaseModel):
    overall_score: int  # 1-10
    question_scores: List[QuestionScore]
    category_scores: CategoryScores
    strengths: List[FeedbackItem]
    weaknesses: List[FeedbackItem]
    improvements: List[FeedbackItem]
    summary: str
