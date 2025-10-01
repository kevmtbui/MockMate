"""Database models"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.config import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    resumes = relationship("SavedResume", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewHistory", back_populates="user", cascade="all, delete-orphan")

class SavedResume(Base):
    __tablename__ = "saved_resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_text = Column(Text, nullable=False)
    ai_analysis = Column(JSON, nullable=True)  # Store JSON analysis
    ai_summary = Column(Text, nullable=True)
    filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)  # Current active resume
    
    # Relationships
    user = relationship("User", back_populates="resumes")

class InterviewHistory(Base):
    __tablename__ = "interview_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Interview metadata
    job_title = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    job_level = Column(String, nullable=True)
    interview_type = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    
    # Questions and answers
    questions = Column(JSON, nullable=False)  # List of questions
    answers = Column(JSON, nullable=False)    # List of answers
    
    # Scores
    overall_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    problem_solving_score = Column(Float, nullable=True)
    behavioral_score = Column(Float, nullable=True)
    
    # Feedback
    feedback_summary = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)
    improvements = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="interviews")



