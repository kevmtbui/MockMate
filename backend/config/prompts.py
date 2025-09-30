"""
Centralized AI prompts configuration for MockMate
All AI prompts are defined here for easy editing and maintenance.
"""

class AIPrompts:
    """Centralized AI prompts for the MockMate application"""
    
    # Question Generation Prompts
    QUESTION_GENERATION_SYSTEM = "You are an expert interviewer who creates realistic, job-specific interview questions."
    
    QUESTION_GENERATION_USER = """
    You are an expert interviewer. Generate {number_of_questions} interview questions based on the following context:
    
    {context}
    
    Requirements:
    - Questions should be appropriate for {difficulty} difficulty level
    - Questions should match the {job_level} level position
    - Focus on {interview_type} questions
    - Make questions specific to the job role and company
    - Include a mix of question types within the category
    - Questions should be realistic and commonly asked in interviews
    - Adjust complexity based on job level (e.g., intern questions vs senior-level questions)
    
    IMPORTANT: For technical questions, focus on:
    - Knowledge and understanding of concepts, tools, and methodologies
    - Problem-solving approaches and decision-making processes
    - Industry best practices and standards
    - Troubleshooting and diagnostic thinking
    - Process and workflow understanding
    - Domain-specific knowledge that someone in this role should know
    
    DO NOT ask for:
    - Writing code or pseudocode
    - Programming exercises
    - Live coding challenges
    - Syntax-specific questions
    
    Instead ask about:
    - How you would approach a problem
    - What tools/technologies you would use and why
    - What considerations you would make
    - How you would troubleshoot issues
    - What processes you would follow
    - What you know about specific technologies/concepts
    
    Return ONLY a JSON array with this exact format (no other text):
    [
        {{"id": 1, "question": "Question text here", "question_type": "{interview_type}", "difficulty": "{difficulty}"}},
        {{"id": 2, "question": "Question text here", "question_type": "{interview_type}", "difficulty": "{difficulty}"}},
        ...
    ]
    """
    
    # Feedback Generation Prompts
    FEEDBACK_SYSTEM = "You are an expert interview coach who provides constructive, actionable feedback."
    
    FEEDBACK_USER_GENTLE = """
    You are an expert interview coach. Analyze the following interview responses and provide comprehensive feedback.
    
    {context}
    
    Provide feedback in the following JSON format:
    {{
        "overall_score": 8,
        "question_scores": [
            {{"question_index": 0, "score": 8, "feedback": "Strong response with good examples", "suggestions": ["Consider adding more technical detail"]}},
            {{"question_index": 1, "score": 6, "feedback": "Decent answer but lacks depth", "suggestions": ["Use STAR method for better structure"]}}
        ],
        "category_scores": {{
            "communication": 8,
            "technical": 6,
            "problem_solving": 7,
            "behavioral": 8
        }},
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
    
    FEEDBACK_USER_HARSH = """
    You are a TOUGH, DEMANDING interviewer with high standards who provides brutally honest feedback. Analyze these interview responses with a CRITICAL EYE and provide HARSH, CONSTRUCTIVE feedback that pushes the candidate to improve. Be direct, demanding, and uncompromising in your assessment.
    
    {context}
    
    Provide HARSH, REALISTIC feedback that challenges the candidate to step up their game. Be critical and demanding - don't sugarcoat weaknesses. Push them to recognize where they're falling short and demand better performance. Give tough love that will make them work harder.
    
    Provide feedback in the following JSON format (return ONLY the JSON, no other text):
    {{
        "overall_score": 7,
        "question_scores": [
            {{"question_index": 0, "score": 8, "feedback": "Strong response with good examples", "suggestions": ["Consider adding more technical detail"]}},
            {{"question_index": 1, "score": 6, "feedback": "Decent answer but lacks depth", "suggestions": ["Use STAR method for better structure"]}}
        ],
        "category_scores": {{
            "communication": 8,
            "technical": 6,
            "problem_solving": 7,
            "behavioral": 8
        }},
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
    
    Be EXTREMELY HARSH and DEMANDING in your evaluation. Use these STRICT scoring standards:
    - 8-10: EXCEPTIONAL answers with concrete examples, perfect STAR method, deep insights (VERY RARE - almost never give)
    - 6-7: SOLID answers with good examples and clear structure (still has noticeable gaps)
    - 4-5: WEAK answers lacking examples, depth, or clarity (most answers fall here)
    - 2-3: POOR answers that are incomplete, vague, or show lack of preparation (give these often for bad answers)
    - 1: COMPLETELY UNACCEPTABLE - nonsense, no effort, or gibberish
    
    CRITICAL RULES:
    - Incomplete sentences or thoughts: automatic 1-2 score
    - No concrete examples: maximum 3 score
    - Vague/generic responses: maximum 4 score
    - Short answers (under 30 words): maximum 3 score
    - Lacks structure: maximum 4 score
    
    Be RUTHLESS - if an answer is weak, incomplete, or vague, score it 1-3. Don't be generous!
    """
    
    # Resume Analysis Prompts
    RESUME_ANALYSIS = """
    Analyze this resume and extract key information in JSON format. Be thorough and accurate.
    
    Resume Text:
    {resume_text}
    
    Extract the following information and return ONLY a JSON object (no other text):
    {{
        "name": "Full name of the candidate",
        "email": "Email address if found",
        "phone": "Phone number if found",
        "location": "City, State/Country if found",
        "summary": "Professional summary or objective (2-3 sentences)",
        "experience_years": "Total years of professional experience (number)",
        "current_role": "Current or most recent job title",
        "current_company": "Current or most recent company",
        "education": "Highest degree and institution",
        "skills": ["list", "of", "key", "technical", "skills"],
        "technologies": ["list", "of", "programming", "languages", "and", "tools"],
        "industries": ["list", "of", "industries", "worked", "in"],
        "achievements": ["list", "of", "key", "achievements", "or", "accomplishments"],
        "certifications": ["list", "of", "certifications", "if", "any"],
        "languages": ["list", "of", "spoken", "languages", "if", "any"],
        "experience_level": "entry/mid/senior/executive based on years and roles",
        "key_strengths": ["list", "of", "main", "professional", "strengths"],
        "career_progression": "Brief description of career growth and progression"
    }}
    
    If information is not available, use null or empty arrays as appropriate.
    Be accurate and don't make up information that isn't clearly stated.
    """
    
    # Fallback Questions
    FALLBACK_QUESTIONS = {
        "Technical": [
            "Tell me about yourself and your technical background.",
            "What technologies and tools are you most comfortable working with?",
            "Describe a challenging technical problem you solved recently and how you approached it.",
            "How do you approach debugging and troubleshooting complex issues?",
            "What's your experience with version control and collaboration tools, and how do they fit into your workflow?"
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
    
    # Test/Error Feedback Messages
    TEST_FEEDBACK = {
        "overall_score": 1,
        "question_scores": [
            {"question_index": 0, "score": 1, "feedback": "Nonsensical response", "suggestions": ["Take interviews seriously"]},
            {"question_index": 1, "score": 1, "feedback": "Complete failure", "suggestions": ["Learn professionalism"]}
        ],
        "category_scores": {"communication": 1, "technical": 1, "problem_solving": 1, "behavioral": 1},
        "strengths": [
            {
                "category": "strength",
                "title": "Wasted Everyone's Time",
                "description": "You managed to waste both your time and the interviewer's time with completely nonsensical responses",
                "suggestion": None
            }
        ],
        "weaknesses": [
            {
                "category": "weakness",
                "title": "COMPLETE FAILURE: Nonsensical Responses",
                "description": "Your responses are completely unacceptable - random characters like 'asdasdasdasd' or test data. This shows zero respect for the interview process and would result in immediate termination of any real interview.",
                "suggestion": "This is completely unprofessional. If you can't take an interview seriously, don't waste people's time. This behavior would get you blacklisted from any reputable company."
            }
        ],
        "improvements": [
            {
                "category": "improvement",
                "title": "URGENT: Learn Basic Professionalism",
                "description": "You need to understand that interviews are serious professional interactions, not a joke. This level of disrespect is unacceptable.",
                "suggestion": "Grow up and learn to take professional opportunities seriously. This kind of behavior will destroy your career before it even starts."
            }
        ],
        "summary": "This is a COMPLETE WASTE OF TIME. Your nonsensical responses show zero professionalism and would result in immediate rejection and potential blacklisting. Learn to take interviews seriously or don't apply for jobs."
    }
    
    POOR_QUALITY_FEEDBACK = {
        "overall_score": 2,
        "question_scores": [
            {"question_index": 0, "score": 2, "feedback": "Incomplete and incoherent response", "suggestions": ["Complete your thoughts and use full sentences"]},
            {"question_index": 1, "score": 1, "feedback": "Fragment of an answer, no substance", "suggestions": ["Prepare properly and give complete responses"]}
        ],
        "category_scores": {"communication": 2, "technical": 1, "problem_solving": 2, "behavioral": 2},
        "strengths": [
            {
                "category": "strength",
                "title": "At Least You Tried to Start",
                "description": "You began to answer the question, which is slightly better than saying nothing at all",
                "suggestion": None
            }
        ],
        "weaknesses": [
            {
                "category": "weakness",
                "title": "CRITICAL FAILURE: Incomplete and Incoherent Responses",
                "description": "Your answers are fragments - incomplete sentences that trail off mid-thought. This is completely unacceptable in a professional interview. Responses like 'for example I have to look at all the...' show you either gave up, weren't prepared, or don't take this seriously.",
                "suggestion": "FINISH YOUR SENTENCES. Practice speaking in complete thoughts. Record yourself and listen back - if you can't understand what you're saying, neither can the interviewer. This level of response would get you immediately rejected."
            }
        ],
        "improvements": [
            {
                "category": "improvement",
                "title": "URGENT: Learn to Complete Your Thoughts",
                "description": "You need to practice speaking in full, coherent sentences. Your incomplete responses suggest poor preparation, nervousness, or lack of substance. In a real interview, this would be a disaster.",
                "suggestion": "Practice the STAR method (Situation, Task, Action, Result) and ALWAYS finish your sentences. Prepare concrete examples beforehand. If you can't complete a thought, you're not ready for interviews."
            }
        ],
        "summary": "UNACCEPTABLE PERFORMANCE. Your responses are incomplete fragments that would result in immediate rejection. Answers that trail off like 'for example I have to look at all the...' show you're completely unprepared. You need to learn basic communication skills - finish your sentences, provide complete thoughts, and prepare actual examples. This is not interview-ready by any standard."
    }
    
    FALLBACK_FEEDBACK = {
        "overall_score": 4,
        "question_scores": [
            {"question_index": 0, "score": 4, "feedback": "Mediocre response lacking depth", "suggestions": ["Provide specific examples"]},
            {"question_index": 1, "score": 3, "feedback": "Vague and generic answer", "suggestions": ["Use STAR method"]}
        ],
        "category_scores": {"communication": 5, "technical": 3, "problem_solving": 4, "behavioral": 4},
        "strengths": [
            {
                "category": "strength",
                "title": "Basic Communication",
                "description": "At least you can string sentences together coherently - that's the bare minimum",
                "suggestion": None
            }
        ],
        "weaknesses": [
            {
                "category": "weakness",
                "title": "LACKS SUBSTANCE: Vague and Generic Responses",
                "description": "Your answers are fluff with no concrete examples or specific details. This shows poor preparation and lack of real experience.",
                "suggestion": "Stop giving generic answers and start providing SPECIFIC examples. Use the STAR method or don't bother applying for jobs."
            }
        ],
        "improvements": [
            {
                "category": "improvement",
                "title": "URGENT: Develop Real Technical Depth",
                "description": "Your technical knowledge is surface-level at best. You need to study harder and gain actual experience before attempting interviews.",
                "suggestion": "Stop wasting time with shallow answers. Study the fundamentals, build real projects, and come back when you have something substantial to offer."
            }
        ],
        "summary": "MEDIOCRE performance that shows you're not ready for this level. Your responses lack depth, specificity, and real-world experience. You need to significantly improve your preparation and technical knowledge before attempting interviews at this level."
    }
