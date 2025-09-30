from typing import List, Dict
from datetime import datetime
from models.answer import Answer
from models.interview_settings import InterviewSettings, QuestionGenerationRequest, Question
from models.feedback import InterviewFeedback, FeedbackItem
from services.gemini_ai_service import GeminiAIService
from services.resume_service import ResumeService

# Temporary storage
user_answers: List[dict] = []
interview_sessions: List[dict] = []
current_session: dict = {}

def generate_questions(request: QuestionGenerationRequest) -> List[Question]:
    """Generate AI-powered custom interview questions"""
    try:
        print(f"Generating questions with settings: {request.settings.dict()}")
        print(f"Resume text length: {len(request.resume_text) if request.resume_text else 0}")
        print(f"AI Summary: {request.settings.ai_summary[:100] if request.settings.ai_summary else 'None'}...")
        
        # If we have resume text but no AI summary, analyze the resume first
        if request.resume_text and not request.settings.ai_summary:
            print("No AI summary found, analyzing resume...")
            try:
                analysis = ResumeService.analyze_resume_with_ai(request.resume_text)
                ai_summary = ResumeService.generate_resume_summary_for_ai(request.resume_text, analysis)
                request.settings.ai_summary = ai_summary
                print(f"Resume analysis completed. AI Summary length: {len(ai_summary)}")
            except Exception as e:
                print(f"Error analyzing resume: {e}")
                # Continue without AI summary
        
        # Generate questions using Gemini AI service
        questions = GeminiAIService.generate_questions(request.settings, request.resume_text)
        
        # Store current session for later use
        global current_session
        current_session = {
            "settings": request.settings.dict(),
            "questions": [q.dict() for q in questions],
            "start_time": datetime.utcnow().isoformat(),
            "answers": []
        }
        
        return questions
    except Exception as e:
        print(f"Error in generate_questions: {e}")
        # Fallback to basic questions
        return GeminiAIService._get_fallback_questions(request.settings)

def submit_answer(answer: Answer):
    """Submit an answer and store it in the current session"""
    answer_data = answer.dict()
    answer_data["timestamp"] = datetime.utcnow().isoformat()
    
    # Add to global answers (legacy)
    user_answers.append(answer_data)
    
    # Add to current session
    global current_session
    if current_session:
        if "answers" not in current_session:
            current_session["answers"] = []
        current_session["answers"].append(answer_data)
    
    print(f"Answer submitted. Total answers in session: {len(current_session.get('answers', []))}")
    return {"message": "Answer submitted successfully.", "total_answers": len(user_answers)}

def get_feedback() -> InterviewFeedback:
    """Generate AI-powered feedback based on interview responses"""
    global current_session
    
    print(f"Getting feedback. Session exists: {bool(current_session)}")
    print(f"Session answers: {current_session.get('answers', []) if current_session else 'No session'}")
    print(f"Session questions count: {len(current_session.get('questions', [])) if current_session else 0}")
    
    if not current_session or not current_session.get("answers"):
        # Return a specific feedback for no answers provided
        return InterviewFeedback(
            overall_score=2,
            strengths=[
                FeedbackItem(
                    category="strength",
                    title="Interview Participation",
                    description="You completed the interview process, which shows commitment to the opportunity",
                    suggestion=None
                )
            ],
            weaknesses=[
                FeedbackItem(
                    category="weakness",
                    title="No Responses Provided",
                    description="You did not provide any answers to the interview questions, making it impossible to assess your qualifications",
                    suggestion="Practice answering interview questions and ensure you provide responses during the actual interview"
                )
            ],
            improvements=[
                FeedbackItem(
                    category="improvement",
                    title="Complete Interview Responses",
                    description="It's essential to answer all interview questions to demonstrate your knowledge and suitability for the role",
                    suggestion="Prepare answers in advance and practice responding to common interview questions in your field"
                )
            ],
            summary="No interview responses were provided, making it impossible to evaluate your qualifications. Please ensure you answer all questions in future interviews to give employers a chance to assess your fit for the role."
        )
    
    try:
        # Prepare questions and answers for feedback generation
        questions_and_answers = []
        questions = current_session.get("questions", [])
        answers = current_session.get("answers", [])
        
        for i, answer in enumerate(answers):
            question_text = questions[i]["question"] if i < len(questions) else "Unknown question"
            questions_and_answers.append({
                "question": question_text,
                "answer": answer["answer"]
            })
        
        # Create settings object for feedback generation
        settings_data = current_session.get("settings", {})
        settings = InterviewSettings(**settings_data)
        
        # Generate feedback using Gemini AI
        print(f"Generating feedback for {len(questions_and_answers)} questions")
        print(f"Settings: {settings.dict()}")
        feedback = GeminiAIService.generate_feedback(questions_and_answers, settings)
        
        # Store feedback in session
        current_session["feedback"] = feedback.dict()
        
        return feedback
        
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return GeminiAIService._get_fallback_feedback()

def get_all_answers():
    return user_answers

def get_current_session():
    """Get the current interview session data"""
    global current_session
    return current_session

def start_new_session():
    """Start a new interview session"""
    global current_session
    current_session = {}
    return {"message": "New session started"}

def generate_questions_legacy(interview_type: str = "Mixed"):
    """Legacy function for backward compatibility"""
    if interview_type == "Technical":
        questions = [
            {"id": 1, "question": "Tell me about yourself and your experience in software development."},
            {"id": 2, "question": "What programming languages are you most comfortable with?"},
            {"id": 3, "question": "Describe a challenging technical problem you solved recently."},
            {"id": 4, "question": "How do you approach debugging complex issues?"},
            {"id": 5, "question": "What's your experience with version control and collaboration tools?"}
        ]
    elif interview_type == "Behavioral":
        questions = [
            {"id": 1, "question": "Tell me about a time when you had to work under pressure."},
            {"id": 2, "question": "Describe a situation where you had to resolve a conflict with a team member."},
            {"id": 3, "question": "Give me an example of a time when you failed and what you learned from it."},
            {"id": 4, "question": "Tell me about a time when you had to learn something new quickly."},
            {"id": 5, "question": "Describe a situation where you had to persuade others to adopt your idea."}
        ]
    elif interview_type == "Resume":
        questions = [
            {"id": 1, "question": "Walk me through your resume and highlight your most relevant experience."},
            {"id": 2, "question": "Tell me about a specific project mentioned on your resume and your role in it."},
            {"id": 3, "question": "What skills listed on your resume are you most proud of?"},
            {"id": 4, "question": "Can you explain any gaps in your employment history?"},
            {"id": 5, "question": "How does your educational background relate to this position?"}
        ]
    else:  # Mixed or default
        questions = [
            {"id": 1, "question": "Tell me about yourself."},
            {"id": 2, "question": "Why do you want this position?"},
            {"id": 3, "question": "Describe a challenging problem you solved."},
            {"id": 4, "question": "How do you handle tight deadlines?"},
            {"id": 5, "question": "What are your strengths and weaknesses?"}
        ]
    return questions
