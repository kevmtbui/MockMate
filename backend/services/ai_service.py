import os
from openai import OpenAI
from typing import List, Dict
from models.interview_settings import InterviewSettings, Question
from models.feedback import InterviewFeedback, FeedbackItem
import json

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-openai-api-key-here"))

class AIService:
    @staticmethod
    def generate_questions(settings: InterviewSettings, resume_text: str = None) -> List[Question]:
        """Generate custom interview questions based on settings and resume"""
        
        # Build context for question generation
        context = f"""
        Job Title: {settings.job_title}
        Company: {settings.company_name}
        Job Description: {settings.job_description}
        Interview Type: {settings.interview_type}
        Difficulty: {settings.difficulty}
        Number of Questions: {settings.number_of_questions}
        """
        
        if resume_text:
            context += f"\nResume Summary: {resume_text[:1000]}..."  # Limit resume text
        
        prompt = f"""
        You are an expert interviewer. Generate {settings.number_of_questions} interview questions based on the following context:
        
        {context}
        
        Requirements:
        - Questions should be appropriate for {settings.difficulty.lower()} difficulty level
        - Focus on {settings.interview_type.lower()} questions
        - Make questions specific to the job role and company
        - Include a mix of question types within the category
        - Questions should be realistic and commonly asked in interviews
        
        Return the questions as a JSON array with this format:
        [
            {{"id": 1, "question": "Question text here", "question_type": "{settings.interview_type}", "difficulty": "{settings.difficulty}"}},
            ...
        ]
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert interviewer who creates realistic, job-specific interview questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            # Parse the JSON response
            questions_data = json.loads(response.choices[0].message.content)
            
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
            
        except Exception as e:
            print(f"Error generating questions: {e}")
            # Fallback to static questions
            return AIService._get_fallback_questions(settings)
    
    @staticmethod
    def _get_fallback_questions(settings: InterviewSettings) -> List[Question]:
        """Fallback questions if AI generation fails"""
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
        """Generate comprehensive feedback based on interview responses"""
        
        # Build context for feedback generation
        context = f"""
        Job Position: {settings.job_title} at {settings.company_name}
        Interview Type: {settings.interview_type}
        Difficulty: {settings.difficulty}
        
        Interview Responses:
        """
        
        for i, qa in enumerate(questions_and_answers):
            context += f"\nQuestion {i+1}: {qa['question']}\nAnswer: {qa['answer']}\n"
        
        prompt = f"""
        You are an expert interview coach. Analyze the following interview responses and provide comprehensive feedback.
        
        {context}
        
        Provide feedback in the following JSON format:
        {{
            "overall_score": 8,
            "strengths": [
                {{"category": "strength", "title": "Strong Technical Knowledge", "description": "Demonstrated solid understanding of programming concepts", "suggestion": null}}
            ],
            "weaknesses": [
                {{"category": "weakness", "title": "Limited Experience with Specific Technology", "description": "Could benefit from more hands-on experience with React", "suggestion": "Consider building a side project using React to gain more experience"}}
            ],
            "improvements": [
                {{"category": "improvement", "title": "Use STAR Method", "description": "Structure behavioral responses better", "suggestion": "Practice using Situation, Task, Action, Result framework for behavioral questions"}}
            ],
            "summary": "Overall strong performance with room for improvement in specific areas..."
        }}
        
        Focus on:
        - Technical competency (for technical questions)
        - Communication skills
        - Problem-solving approach
        - Use of examples and frameworks (STAR method, etc.)
        - Areas for improvement
        - Specific, actionable suggestions
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert interview coach who provides constructive, actionable feedback."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse the JSON response
            feedback_data = json.loads(response.choices[0].message.content)
            
            # Convert to FeedbackItem objects
            strengths = [FeedbackItem(**item) for item in feedback_data["strengths"]]
            weaknesses = [FeedbackItem(**item) for item in feedback_data["weaknesses"]]
            improvements = [FeedbackItem(**item) for item in feedback_data["improvements"]]
            
            return InterviewFeedback(
                overall_score=feedback_data["overall_score"],
                strengths=strengths,
                weaknesses=weaknesses,
                improvements=improvements,
                summary=feedback_data["summary"]
            )
            
        except Exception as e:
            print(f"Error generating feedback: {e}")
            # Return fallback feedback
            return AIService._get_fallback_feedback()
    
    @staticmethod
    def _get_fallback_feedback() -> InterviewFeedback:
        """Fallback feedback if AI generation fails"""
        return InterviewFeedback(
            overall_score=7,
            strengths=[
                FeedbackItem(
                    category="strength",
                    title="Good Communication",
                    description="Clear and articulate responses",
                    suggestion=None
                )
            ],
            weaknesses=[
                FeedbackItem(
                    category="weakness",
                    title="Could Use More Examples",
                    description="Consider providing more specific examples in your responses",
                    suggestion="Practice with the STAR method (Situation, Task, Action, Result)"
                )
            ],
            improvements=[
                FeedbackItem(
                    category="improvement",
                    title="Practice More",
                    description="Continue practicing to build confidence",
                    suggestion="Try more mock interviews to improve"
                )
            ],
            summary="Good overall performance. Continue practicing and focus on providing more specific examples in your responses."
        )
