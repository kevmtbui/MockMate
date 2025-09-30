from pydantic import BaseModel
from typing import List, Optional

class InterviewSettings(BaseModel):
    job_title: str = ""
    company_name: str = ""
    job_description: str = ""
    job_level: str = "Mid-Level"  # Intern, Entry, Mid, Senior, Lead, Executive
    interview_type: str = "Mixed"  # Technical, Behavioral, Resume, Mixed
    difficulty: str = "Medium"  # Easy, Moderate, Hard
    number_of_questions: int = 5
    answer_length: str = "Medium"  # Short, Medium, Long
    prep_time: int = 30  # seconds
    ai_summary: Optional[str] = None  # Optional AI-generated resume summary

class QuestionGenerationRequest(BaseModel):
    settings: InterviewSettings
    resume_text: Optional[str] = None

class Question(BaseModel):
    id: int
    question: str
    question_type: str
    difficulty: str

class GeneratedQuestions(BaseModel):
    questions: List[Question]
