import requests
import json
from typing import List, Dict
from models.interview_settings import InterviewSettings, Question
from models.feedback import InterviewFeedback, FeedbackItem

class LocalAIService:
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url
        self.model = "llama3.1:8b"
    
    @staticmethod
    def generate_questions(settings: InterviewSettings, resume_text: str = None) -> List[Question]:
        """Generate custom interview questions using local Ollama LLM"""
        
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
        
        if resume_text:
            context += f"\nResume Summary: {resume_text[:1000]}..."
        
        prompt = f"""
        You are an expert interviewer. Generate {settings.number_of_questions} interview questions based on the following context:
        
        {context}
        
        Requirements:
        - Questions should be appropriate for {settings.difficulty.lower()} difficulty level
        - Questions should match the {settings.job_level.lower()} level position
        - Focus on {settings.interview_type.lower()} questions
        - Make questions specific to the job role and company
        - Include a mix of question types within the category
        - Questions should be realistic and commonly asked in interviews
        - Adjust complexity based on job level (e.g., intern questions vs senior-level questions)
        
        Return ONLY a JSON array with this exact format (no other text):
        [
            {{"id": 1, "question": "Question text here", "question_type": "{settings.interview_type}", "difficulty": "{settings.difficulty}"}},
            {{"id": 2, "question": "Question text here", "question_type": "{settings.interview_type}", "difficulty": "{settings.difficulty}"}},
            ...
        ]
        """
        
        try:
            response = requests.post(
                f"http://localhost:11434/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 1500
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '')
                
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
                    return LocalAIService._get_fallback_questions(settings)
            
            else:
                print(f"Ollama API error: {response.status_code}")
                return LocalAIService._get_fallback_questions(settings)
                
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            return LocalAIService._get_fallback_questions(settings)
    
    @staticmethod
    def _get_fallback_questions(settings: InterviewSettings) -> List[Question]:
        """Fallback questions if Ollama generation fails"""
        fallback_questions = {
            "Technical": [
                "Tell me about yourself and your technical background.",
                "What programming languages are you most comfortable with?",
                "Describe a challenging technical problem you solved recently.",
                "How do you approach debugging complex issues?",
                "What's your experience with version control and collaboration tools?"
            ],
            "Behavioral": [
                "Tell me about a time when you had to work under pressure.",
                "Describe a situation where you had to resolve a conflict with a team member.",
                "Give me an example of a time when you failed and what you learned from it.",
                "Tell me about a time when you had to learn something new quickly.",
                "Describe a situation where you had to persuade others to adopt your idea."
            ],
            "Resume": [
                "Walk me through your resume and highlight your most relevant experience.",
                "Tell me about a specific project mentioned on your resume and your role in it.",
                "What skills listed on your resume are you most proud of?",
                "Can you explain any gaps in your employment history?",
                "How does your educational background relate to this position?"
            ],
            "Mixed": [
                "Tell me about yourself.",
                "Why do you want this position?",
                "Describe a challenging problem you solved.",
                "How do you handle tight deadlines?",
                "What are your strengths and weaknesses?"
            ]
        }
        
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
        """Generate comprehensive feedback using local Ollama LLM"""
        
        # Check for nonsensical or test answers
        has_nonsensical_answers = False
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
        
        if has_nonsensical_answers:
            return LocalAIService._get_test_feedback()
        
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
        
        prompt = f"""
        You are an experienced interviewer providing honest, constructive feedback to help the candidate improve. Analyze these interview responses objectively and provide balanced feedback that is both critical and helpful.
        
        {context}
        
        Provide honest, realistic feedback that helps the candidate understand their strengths and areas for improvement. Be direct but fair in your assessment.
        
        Provide feedback in the following JSON format (return ONLY the JSON, no other text):
        {{
            "overall_score": 6,
            "strengths": [
                {{"category": "strength", "title": "Good Communication", "description": "Clear and articulate responses with good structure", "suggestion": null}}
            ],
            "weaknesses": [
                {{"category": "weakness", "title": "Needs More Specific Examples", "description": "While the response was clear, it lacked concrete examples to support your points", "suggestion": "Practice using the STAR method (Situation, Task, Action, Result) to provide more structured examples"}}
            ],
            "improvements": [
                {{"category": "improvement", "title": "Enhance Technical Depth", "description": "Consider providing more technical detail and demonstrating deeper understanding of concepts", "suggestion": "Study the fundamentals more thoroughly and practice explaining complex topics simply"}}
            ],
            "summary": "Overall decent performance with room for improvement. Focus on providing more specific examples and demonstrating deeper technical knowledge in future interviews."
        }}
        
        Focus on providing balanced feedback that covers:
        - Technical competency and knowledge depth
        - Communication skills and clarity
        - Use of examples and specific details
        - Problem-solving approach and methodology
        - Areas that need improvement
        - Constructive suggestions for growth
        - Realistic assessment of interview readiness
        
        Be honest but constructive in your evaluation.
        """
        
        try:
            response = requests.post(
                f"http://localhost:11434/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "max_tokens": 2000
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '')
                
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
                        
                        return InterviewFeedback(
                            overall_score=feedback_data.get("overall_score", 7),
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
                    return LocalAIService._get_fallback_feedback()
            
            else:
                print(f"Ollama API error: {response.status_code}")
                return LocalAIService._get_fallback_feedback()
                
        except Exception as e:
            print(f"Error calling Ollama for feedback: {e}")
            return LocalAIService._get_fallback_feedback()
    
    @staticmethod
    def _get_test_feedback() -> InterviewFeedback:
        """Feedback for test/nonsensical answers"""
        return InterviewFeedback(
            overall_score=1,
            strengths=[
                FeedbackItem(
                    category="strength",
                    title="Interview Participation",
                    description="You completed the interview process",
                    suggestion=None
                )
            ],
            weaknesses=[
                FeedbackItem(
                    category="weakness",
                    title="Invalid Test Responses",
                    description="The responses provided appear to be test data, nonsensical input (like 'asdasdasdasd'), or simply repeating the question back",
                    suggestion="Please provide real, thoughtful answers to interview questions to receive meaningful feedback"
                )
            ],
            improvements=[
                FeedbackItem(
                    category="improvement",
                    title="Provide Real Answers",
                    description="To get helpful feedback, answer interview questions with genuine, relevant responses",
                    suggestion="Practice answering questions with specific examples from your experience and knowledge"
                )
            ],
            summary="This appears to be a test run with invalid responses. To receive meaningful feedback, please answer the interview questions with real, thoughtful responses."
        )

    @staticmethod
    def _get_fallback_feedback() -> InterviewFeedback:
        """Fallback feedback if Ollama generation fails"""
        return InterviewFeedback(
            overall_score=6,
            strengths=[
                FeedbackItem(
                    category="strength",
                    title="Good Communication",
                    description="Clear and articulate responses with good structure",
                    suggestion=None
                )
            ],
            weaknesses=[
                FeedbackItem(
                    category="weakness",
                    title="Needs More Specific Examples",
                    description="While the response was clear, it lacked concrete examples to support your points",
                    suggestion="Practice using the STAR method (Situation, Task, Action, Result) to provide more structured examples"
                )
            ],
            improvements=[
                FeedbackItem(
                    category="improvement",
                    title="Enhance Technical Depth",
                    description="Consider providing more technical detail and demonstrating deeper understanding of concepts",
                    suggestion="Study the fundamentals more thoroughly and practice explaining complex topics simply"
                )
            ],
            summary="Overall decent performance with room for improvement. Focus on providing more specific examples and demonstrating deeper technical knowledge in future interviews."
        )
