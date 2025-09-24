from typing import List
from datetime import datetime
from models.answer import Answer

# Temporary storage
user_answers: List[dict] = []

def generate_questions():
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
