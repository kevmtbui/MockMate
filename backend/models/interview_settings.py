from pydantic import BaseModel
from typing import List, Optional

class InterviewSettings(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    job_level: str  # Intern, Entry, Mid, Senior, Lead, Executive
    interview_type: str  # Technical, Behavioral, Resume, Mixed
    difficulty: str  # Easy, Moderate, Hard
    number_of_questions: int
    answer_length: str  # Short, Medium, Long
    prep_time: int  # seconds

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
