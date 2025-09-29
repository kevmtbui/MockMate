# InterviewLab - AI-Powered Mock Interview Platform

InterviewLab is a web-based AI-powered mock interview platform that simulates real interview experiences using voice interaction. It helps job seekers practice, get meaningful feedback, and improve their performance before real interviews.

## Features Implemented

### ✅ Core Features (MVP)
- **User Input**: Upload resume (PDF/DOCX → text extraction), enter job details, customize interview settings
- **AI-Powered Question Generation**: Custom questions tailored to resume, job description, and difficulty
- **Voice Interaction**: Text-to-Speech for questions, Speech-to-Text for answers
- **Real-time Transcription**: Live transcript display during voice responses
- **Mid-interview Tips**: AI suggests topics to cover during user hesitation
- **Comprehensive Feedback**: AI-generated feedback with strengths, weaknesses, and improvements

### 🎯 Interview Settings
- Question type (behavioral, technical, general, mixed)
- Difficulty (easy, moderate, hard)
- Interview length (3, 5, 7, or 10 questions)
- Answer length per question (short, medium, long)
- Mid-interview tips (enable/disable)
- Prep time per question

### 🎤 Voice Features
- Text-to-Speech for question reading
- Speech-to-Text for answer transcription
- Real-time transcript display
- Multiple voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)

### 🤖 AI-Powered Features
- Custom question generation based on job requirements
- Resume text extraction and analysis
- Comprehensive feedback with actionable suggestions
- Context-aware tips during interviews

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Web Audio API for voice interactions
- React Router for navigation

### Backend
- FastAPI (Python)
- OpenAI API (GPT-4, Whisper, TTS)
- PyPDF2 and python-docx for resume processing
- Pydantic for data validation

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your-openai-api-key-here" > .env
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Usage
1. Open your browser and go to `http://localhost:5173`
2. Upload your resume (PDF or DOCX)
3. Fill in job details (title, company, description)
4. Configure interview settings
5. Start your mock interview!
6. Use voice mode for realistic interview experience
7. Get AI-powered feedback after completion

## API Endpoints

### Interview Management
- `POST /generate-questions` - Generate AI-powered custom questions
- `POST /submit-answer` - Submit interview answers
- `GET /get-feedback` - Get AI-generated feedback
- `POST /start-new-session` - Start new interview session

### Voice Features
- `POST /text-to-speech` - Convert text to speech
- `POST /speech-to-text` - Convert speech to text
- `GET /available-voices` - Get available TTS voices

### Resume Processing
- `POST /upload-resume` - Upload and extract text from resume

## Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Set the `OPENAI_API_KEY` environment variable
3. Ensure you have sufficient credits for GPT-4, Whisper, and TTS usage

### Customization
- Modify question types in `backend/services/ai_service.py`
- Adjust voice settings in `frontend/src/services/voiceService.js`
- Customize UI themes in `frontend/src/index.css`

## Future Enhancements

### Planned Features
- Facial expression analysis via webcam
- Voice tone/emotion analysis
- Scoring system (numerical grading per answer)
- Progress tracking and session history
- Multiple interview templates
- Collaborative interview sessions

### Technical Improvements
- Database integration (PostgreSQL/Firebase)
- User authentication and profiles
- Session persistence
- Performance optimization
- Mobile responsiveness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This is an MVP implementation. For production use, additional security measures, error handling, and scalability improvements would be needed.
