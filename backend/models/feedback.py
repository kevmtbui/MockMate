from pydantic import BaseModel
from typing import List, Optional

class FeedbackItem(BaseModel):
    category: str  # "strength", "weakness", "improvement"
    title: str
    description: str
    suggestion: Optional[str] = None

class InterviewFeedback(BaseModel):
    overall_score: int  # 1-10
    strengths: List[FeedbackItem]
    weaknesses: List[FeedbackItem]
    improvements: List[FeedbackItem]
    summary: str
