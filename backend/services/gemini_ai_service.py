import os
import json
import google.generativeai as genai
from typing import List, Dict
from models.interview_settings import InterviewSettings, Question
from models.feedback import InterviewFeedback, FeedbackItem, QuestionScore, CategoryScores
from config.prompts import AIPrompts

class GeminiAIService:
    @staticmethod
    def _get_model():
        """Get configured Gemini model"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-2.0-flash')
    
    @staticmethod
    def generate_questions(settings: InterviewSettings, resume_text: str = None) -> List[Question]:
        """Generate custom interview questions using Gemini AI"""
        
        # Build context for question generation
        context = f"""
        Job Title: {settings.job_title}
        Company: {settings.company_name}
        Job Description: {settings.job_description}
        Job Level: {settings.job_level}
        Interview Type: {settings.interview_type}
        Difficulty: {settings.difficulty}
        Number of Questions: {settings.number_of_questions}
        """
        
        # Include resume information for context, but with different emphasis based on interview type
        if resume_text:
            # Use AI-generated resume summary if available, otherwise truncate
            if hasattr(settings, 'ai_summary') and settings.ai_summary:
                print(f"Using AI summary: {settings.ai_summary[:200]}...")
                resume_info = settings.ai_summary
            else:
                print(f"No AI summary found, using raw text: {resume_text[:200]}...")
                resume_info = f"{resume_text[:1000]}..."
            
            # Add resume with different context based on interview type
            if settings.interview_type.lower() == 'resume':
                context += f"\nCandidate Resume (PRIMARY FOCUS): {resume_info}"
                print("Resume interview - resume is PRIMARY focus")
            elif settings.interview_type.lower() == 'technical':
                context += f"\nCandidate Background (for context only, focus on job requirements): {resume_info}"
                print("Technical interview - resume for context, job role is PRIMARY focus")
            elif settings.interview_type.lower() == 'behavioral':
                context += f"\nCandidate Background (for context only): {resume_info}"
                print("Behavioral interview - resume for context, behavioral scenarios are PRIMARY focus")
            else:  # Mixed or other
                context += f"\nCandidate Resume: {resume_info}"
                print("Mixed interview - balanced focus on resume and job")
        
        prompt = AIPrompts.QUESTION_GENERATION_USER.format(
            number_of_questions=settings.number_of_questions,
            context=context,
            difficulty=settings.difficulty.lower(),
            job_level=settings.job_level.lower(),
            interview_type=settings.interview_type.lower()
        )
        
        try:
            model = GeminiAIService._get_model()
            print(f"Calling Gemini for question generation with prompt length: {len(prompt)}")
            
            response = model.generate_content(prompt)
            response_text = response.text
            
            print(f"Gemini response received, length: {len(response_text)}")
            
            # Try to extract JSON from response
            try:
                # Find JSON array in response
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_text = response_text[start_idx:end_idx]
                    questions_data = json.loads(json_text)
                    
                    # Convert to Question objects
                    questions = []
                    for i, q_data in enumerate(questions_data):
                        questions.append(Question(
                            id=q_data.get("id", i + 1),
                            question=q_data["question"],
                            question_type=q_data.get("question_type", settings.interview_type),
                            difficulty=q_data.get("difficulty", settings.difficulty)
                        ))
                    
                    return questions
                else:
                    raise ValueError("No JSON array found in response")
                    
            except (json.JSONDecodeError, ValueError) as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw response: {response_text}")
                return GeminiAIService._get_fallback_questions(settings)
        
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return GeminiAIService._get_fallback_questions(settings)
    
    @staticmethod
    def _get_fallback_questions(settings: InterviewSettings) -> List[Question]:
        """Fallback questions if Gemini generation fails"""
        fallback_questions = AIPrompts.FALLBACK_QUESTIONS
        
        questions_list = fallback_questions.get(settings.interview_type, fallback_questions["Mixed"])
        questions = []
        
        for i, question_text in enumerate(questions_list[:settings.number_of_questions]):
            questions.append(Question(
                id=i + 1,
                question=question_text,
                question_type=settings.interview_type,
                difficulty=settings.difficulty
            ))
        
        return questions
    
    @staticmethod
    def generate_feedback(questions_and_answers: List[Dict], settings: InterviewSettings) -> InterviewFeedback:
        """Generate comprehensive feedback using Gemini AI"""
        
        # Check for nonsensical or test answers
        has_nonsensical_answers = False
        has_poor_quality_answers = False
        
        for qa in questions_and_answers:
            answer = qa['answer'].lower().strip()
            question = qa['question'].lower().strip()
            
            # Check for various types of nonsensical answers
            if (answer in ['asdasdasdasd', 'test', 'testing', 'asdf', 'qwerty', '123', 'abc'] or 
                len(answer) < 3 or 
                answer.isdigit() or
                # Check if answer is very similar to question (repeating question back)
                (len(answer) > 10 and len(question) > 10 and 
                 len(set(answer.split()) & set(question.split())) > len(answer.split()) * 0.6)):
                has_nonsensical_answers = True
                break
            
            # Check for poor quality answers (incomplete, very short, no substance)
            if (len(answer.split()) < 5 or  # Very short answers (reduced from 15)
                (answer.count('.') == 0 and len(answer.split()) < 20) or  # No complete sentences only for very short answers
                answer in ['uh', 'um', 'yes', 'no', 'ok', 'sure'] or  # Single word responses
                (len(answer.split()) < 10 and answer.endswith('for example'))):  # Very short incomplete thoughts
                has_poor_quality_answers = True
        
        if has_nonsensical_answers:
            return GeminiAIService._get_test_feedback()
        
        if has_poor_quality_answers:
            return GeminiAIService._get_poor_quality_feedback()
        
        # Build context for feedback generation
        context = f"""
        Job Position: {settings.job_title} at {settings.company_name}
        Job Level: {settings.job_level}
        Interview Type: {settings.interview_type}
        Difficulty: {settings.difficulty}
        
        Interview Responses:
        """
        
        for i, qa in enumerate(questions_and_answers):
            context += f"\nQuestion {i+1}: {qa['question']}\nAnswer: {qa['answer']}\n"
        
        prompt = AIPrompts.FEEDBACK_USER_GENTLE.format(context=context)
        
        try:
            model = GeminiAIService._get_model()
            print(f"Calling Gemini for feedback generation with prompt length: {len(prompt)}")
            
            response = model.generate_content(prompt)
            response_text = response.text
            
            print(f"Gemini feedback response received, length: {len(response_text)}")
            
            # Try to extract JSON from response
            try:
                # Find JSON object in response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_text = response_text[start_idx:end_idx]
                    feedback_data = json.loads(json_text)
                    
                    # Convert to FeedbackItem objects
                    strengths = [FeedbackItem(**item) for item in feedback_data.get("strengths", [])]
                    weaknesses = [FeedbackItem(**item) for item in feedback_data.get("weaknesses", [])]
                    improvements = [FeedbackItem(**item) for item in feedback_data.get("improvements", [])]
                    
                    # Convert question scores
                    question_scores = []
                    for qs_data in feedback_data.get("question_scores", []):
                        question_scores.append(QuestionScore(**qs_data))
                    
                    # Convert category scores
                    category_scores_data = feedback_data.get("category_scores", {})
                    category_scores = CategoryScores(
                        communication=category_scores_data.get("communication", 5),
                        technical=category_scores_data.get("technical", 5),
                        problem_solving=category_scores_data.get("problem_solving", 5),
                        behavioral=category_scores_data.get("behavioral", 5)
                    )
                    
                    return InterviewFeedback(
                        overall_score=feedback_data.get("overall_score", 7),
                        question_scores=question_scores,
                        category_scores=category_scores,
                        strengths=strengths,
                        weaknesses=weaknesses,
                        improvements=improvements,
                        summary=feedback_data.get("summary", "Good overall performance.")
                    )
                else:
                    raise ValueError("No JSON object found in response")
                    
            except (json.JSONDecodeError, ValueError) as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw response: {response_text}")
                return GeminiAIService._get_fallback_feedback()
        
        except Exception as e:
            print(f"Error calling Gemini for feedback: {e}")
            return GeminiAIService._get_fallback_feedback()
    
    @staticmethod
    def _get_test_feedback() -> InterviewFeedback:
        """Feedback for test/nonsensical answers"""
        feedback_data = AIPrompts.TEST_FEEDBACK
        
        # Convert question scores
        question_scores = [QuestionScore(**qs) for qs in feedback_data["question_scores"]]
        
        # Convert category scores
        category_scores = CategoryScores(**feedback_data["category_scores"])
        
        # Convert feedback items
        strengths = [FeedbackItem(**item) for item in feedback_data["strengths"]]
        weaknesses = [FeedbackItem(**item) for item in feedback_data["weaknesses"]]
        improvements = [FeedbackItem(**item) for item in feedback_data["improvements"]]
        
        return InterviewFeedback(
            overall_score=feedback_data["overall_score"],
            question_scores=question_scores,
            category_scores=category_scores,
            strengths=strengths,
            weaknesses=weaknesses,
            improvements=improvements,
            summary=feedback_data["summary"]
        )

    @staticmethod
    def _get_poor_quality_feedback() -> InterviewFeedback:
        """Feedback for incomplete/poor quality answers"""
        feedback_data = AIPrompts.POOR_QUALITY_FEEDBACK
        
        # Convert question scores
        question_scores = [QuestionScore(**qs) for qs in feedback_data["question_scores"]]
        
        # Convert category scores
        category_scores = CategoryScores(**feedback_data["category_scores"])
        
        # Convert feedback items
        strengths = [FeedbackItem(**item) for item in feedback_data["strengths"]]
        weaknesses = [FeedbackItem(**item) for item in feedback_data["weaknesses"]]
        improvements = [FeedbackItem(**item) for item in feedback_data["improvements"]]
        
        return InterviewFeedback(
            overall_score=feedback_data["overall_score"],
            question_scores=question_scores,
            category_scores=category_scores,
            strengths=strengths,
            weaknesses=weaknesses,
            improvements=improvements,
            summary=feedback_data["summary"]
        )

    @staticmethod
    def _get_fallback_feedback() -> InterviewFeedback:
        """Fallback feedback if Gemini generation fails"""
        feedback_data = AIPrompts.FALLBACK_FEEDBACK
        
        # Convert question scores
        question_scores = [QuestionScore(**qs) for qs in feedback_data["question_scores"]]
        
        # Convert category scores
        category_scores = CategoryScores(**feedback_data["category_scores"])
        
        # Convert feedback items
        strengths = [FeedbackItem(**item) for item in feedback_data["strengths"]]
        weaknesses = [FeedbackItem(**item) for item in feedback_data["weaknesses"]]
        improvements = [FeedbackItem(**item) for item in feedback_data["improvements"]]
        
        return InterviewFeedback(
            overall_score=feedback_data["overall_score"],
            question_scores=question_scores,
            category_scores=category_scores,
            strengths=strengths,
            weaknesses=weaknesses,
            improvements=improvements,
            summary=feedback_data["summary"]
        )
