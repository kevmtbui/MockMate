from fastapi import APIRouter
from typing import List
from models.answer import Answer
from controllers.interview_controller import generate_questions, submit_answer, get_feedback, get_all_answers

router = APIRouter()

@router.get("/generate-questions")
def route_generate_questions():
    return {"questions": generate_questions()}

@router.post("/submit-answer")
def route_submit_answer(answer: Answer):
    return submit_answer(answer)

@router.get("/get-feedback")
def route_get_feedback():
    return get_feedback()

@router.get("/answers")
def route_get_all_answers():
    return {"user_answers": get_all_answers()}
