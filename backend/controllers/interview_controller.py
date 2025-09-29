from typing import List
from datetime import datetime
from models.answer import Answer

# Temporary storage
user_answers: List[dict] = []

def generate_questions(interview_type: str = "Mixed"):
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

def submit_answer(answer: Answer):
    answer_data = answer.dict()
    answer_data["timestamp"] = datetime.utcnow().isoformat()
    user_answers.append(answer_data)
    return {"message": "Answer submitted successfully.", "total_answers": len(user_answers)}

def get_feedback():
    return {"feedback": "Feedback functionality coming soon!"}

def get_all_answers():
    return user_answers
