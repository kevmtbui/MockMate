## Features Implemented

Core Features (MVP)
- **User Input**: Upload resume (PDF/DOCX → text extraction), enter job details, customize interview settings
- **AI-Powered Question Generation**: Custom questions tailored to resume, job description, and difficulty
- **Voice Interaction**: Text-to-Speech for questions (Google Cloud TTS), optional Speech-to-Text for answers
- **Real-time Transcription**: Live transcript display during voice responses
- **Comprehensive Feedback**: AI-generated feedback with strengths, weaknesses, and improvements

Account & Data
- **Account Login/Signup**: Email + password with session persistence
- **Resume Persistence**: Your uploaded resume is saved to your account and auto-loaded next time
- **Interview History**: View past interviews, open detailed question/answer/feedback, and delete entries

Interview Settings
- Question type (behavioral, technical, general, mixed)
- Difficulty (easy, moderate, hard)
- Interview length (3, 5, 7, or 10 questions)
- Answer length per question (short, medium, long)
- Prep time per question
- **Realistic Mode**: Prep ends automatically when TTS finishes; Voice + TTS are auto-enabled and prep controls are locked

AI-Powered Features
- Custom question generation based on job requirements
- Resume text extraction and analysis
- Comprehensive feedback with actionable suggestions
- Context-aware tips during interviews

