import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function InterviewQAScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [setupData, setSetupData] = useState(location.state || {});
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPrepTime, setIsPrepTime] = useState(true);
  const [isAnswerTime, setIsAnswerTime] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [response, setResponse] = useState("");
  const [questionsLoading, setQuestionsLoading] = useState(true);
  
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const [enableMicrophone, setEnableMicrophone] = useState(false);

  // Mock questions based on interview type
  const mockQuestions = {
    behavioral: [
      "Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?",
      "Describe a situation where you had to work under pressure to meet a deadline.",
      "Give me an example of a time when you showed leadership skills.",
      "Tell me about a time when you made a mistake at work. How did you handle it?",
      "Describe a situation where you had to adapt to significant changes at work.",
      "Tell me about a time when you had to work with someone you didn't get along with.",
      "Give me an example of a time when you had to solve a complex problem."
    ],
    technical: [
      "Explain the difference between an abstract class and an interface.",
      "How would you optimize a slow-running database query?",
      "Describe your experience with RESTful APIs and microservices architecture.",
      "What are the key differences between SQL and NoSQL databases?",
      "How do you ensure code quality and maintainability in your projects?",
      "Explain the concept of dependency injection and its benefits.",
      "What strategies do you use for handling errors and exceptions in production?"
    ],
    mixed: [
      "Tell me about your most challenging project and what you learned from it.",
      "How do you stay updated with the latest technologies in your field?",
      "Describe your approach to debugging a complex issue in production.",
      "Give me an example of how you've handled conflicting priorities.",
      "What's your experience with agile development methodologies?",
      "How do you approach learning a new technology or framework?",
      "Tell me about a time when you had to explain a technical concept to a non-technical stakeholder."
    ]
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/upload");
      return;
    }
    
    // Generate AI questions
    generateAQuestions();
    
    // Initialize with preparation time
    const prepTime = setupData.preparationTime || 0;
    if (prepTime > 0) {
      setTimeRemaining(prepTime);
      setIsPrepTime(true);
      setIsAnswerTime(false);
    } else {
      setTimeRemaining((setupData.answerTime || 3) * 60);
      setIsPrepTime(false);
      setIsAnswerTime(true);
    }
    setEnableMicrophone(setupData.voiceEnabled || false);
  }, [location.state, navigate, setupData.interviewType, setupData.questionCount, setupData.preparationTime, setupData.answerTime]);

  const generateAQuestions = async () => {
    setQuestionsLoading(true);
    try {
      // Map interview type from frontend format to backend format
      const interviewTypeMap = {
        'behavioral': 'Behavioral',
        'technical': 'Technical',
        'mixed': 'Mixed',
        'resume_tailored': 'Resume'
      };
      
      const interviewType = setupData.interviewType || 'behavioral';
      const mappedInterviewType = interviewTypeMap[interviewType.toLowerCase()] || 'Mixed';
      
      const requestData = {
        settings: {
          job_title: setupData.jobTitle || '',
          company_name: setupData.companyName || '',
          job_description: setupData.jobDescription || '',
          job_level: setupData.jobLevel || 'Mid-Level',
          interview_type: mappedInterviewType,
          difficulty: (setupData.difficulty || 'medium').charAt(0).toUpperCase() + (setupData.difficulty || 'medium').slice(1),
          number_of_questions: setupData.questionCount || 5,
          answer_length: 'Medium',
          prep_time: setupData.preparationTime || 30,
          ai_summary: setupData.aiSummary || ''
        },
        resume_text: setupData.resumeText || ''
      };
      
      console.log('Generating AI questions with data:', requestData);
      console.log('Setup data:', setupData);
      
      const response = await fetch('http://192.168.0.214:8000/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
      const data = await response.json();
        const aiQuestions = data.questions.map(q => q.question);
        setQuestions(aiQuestions);
        console.log('AI questions generated successfully:', aiQuestions.length);
      } else {
        console.error('Failed to generate AI questions, using fallback');
        const questionList = mockQuestions[setupData.interviewType] || mockQuestions.mixed;
        const selectedQuestions = questionList.slice(0, setupData.questionCount || 5);
        setQuestions(selectedQuestions);
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      const questionList = mockQuestions[setupData.interviewType] || mockQuestions.mixed;
      const selectedQuestions = questionList.slice(0, setupData.questionCount || 5);
      setQuestions(selectedQuestions);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Load the current answer when question index changes
  useEffect(() => {
    if (answers[currentQuestionIndex]) {
      setResponse(answers[currentQuestionIndex]);
    } else {
      setResponse("");
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (interviewStarted && timeRemaining > 0 && !interviewCompleted) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && interviewStarted) {
      if (isPrepTime) {
        // Prep time finished, start answer time
        setIsPrepTime(false);
        setIsAnswerTime(true);
        setTimeRemaining((setupData.answerTime || 3) * 60);
        // Auto-start voice if enabled
        if (enableMicrophone) {
          startRecording();
        }
      } else if (isAnswerTime) {
        // Answer time finished, go to next question
        handleNextQuestion();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [interviewStarted, timeRemaining, interviewCompleted, isPrepTime, isAnswerTime, enableMicrophone, setupData.answerTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = () => {
    if (questionsLoading || questions.length === 0) {
      console.log('Cannot start interview: questions not ready');
      return;
    }
    setInterviewStarted(true);
  };

  const startRecording = () => {
    if (!enableMicrophone) return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (interimTranscript) {
          setResponse(prev => {
            const baseText = prev.replace(/\s*\[interim:.*?\]\s*$/, '');
            return baseText + (baseText ? " " : "") + `[interim: ${interimTranscript}]`;
          });
        } else if (finalTranscript) {
          setResponse(prev => {
            const baseText = prev.replace(/\s*\[interim:.*?\]\s*$/, '');
            const newText = finalTranscript.trim();
            if (baseText.endsWith(newText)) {
              return baseText;
            }
            return baseText + (baseText ? " " : "") + finalTranscript;
          });
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const skipPrepTime = () => {
    setIsPrepTime(false);
    setIsAnswerTime(true);
    setTimeRemaining((setupData.answerTime || 3) * 60);
    if (enableMicrophone) {
      startRecording();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const prepTime = setupData.preparationTime || 0;
      if (prepTime > 0) {
        setTimeRemaining(prepTime);
        setIsPrepTime(true);
        setIsAnswerTime(false);
      } else {
        setTimeRemaining((setupData.answerTime || 3) * 60);
        setIsPrepTime(false);
        setIsAnswerTime(true);
        if (enableMicrophone) {
          startRecording();
        }
      }
      setIsRecording(false);
      // Load the answer for the next question if it exists
      setResponse(answers[nextIndex] || "");
    } else {
      setInterviewCompleted(true);
      // Submit all answers to backend for AI feedback
      submitAnswersForFeedback();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prepTime = setupData.preparationTime || 0;
      if (prepTime > 0) {
        setTimeRemaining(prepTime);
        setIsPrepTime(true);
        setIsAnswerTime(false);
      } else {
        setTimeRemaining((setupData.answerTime || 3) * 60);
        setIsPrepTime(false);
        setIsAnswerTime(true);
        if (enableMicrophone) {
          startRecording();
        }
      }
      setIsRecording(false);
      // Load the answer for the previous question if it exists
      setResponse(answers[prevIndex] || "");
    }
  };

  const handleAnswerChange = (answer) => {
    setResponse(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const submitAnswersForFeedback = async () => {
    try {
      console.log('Submitting answers for feedback...');
      console.log('Questions:', questions);
      console.log('Answers:', answers);
      
      // Submit each answer to backend
      for (let i = 0; i < questions.length; i++) {
        const answer = answers[i] || '';
        await fetch('http://192.168.0.214:8000/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question_id: i + 1,
            answer: answer,
            question: questions[i]
          })
        });
      }

      // Navigate to feedback page
      const feedbackData = { 
        ...setupData, 
        questions, 
        answers,
        interviewType: setupData.interviewType 
      };
      console.log('Navigating to feedback with data:', feedbackData);
      
      navigate("/feedback", { 
        state: feedbackData
      });
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Still navigate to feedback even if submission fails
      navigate("/feedback", { 
        state: { 
          ...setupData, 
          questions, 
          answers,
          interviewType: setupData.interviewType 
        } 
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (!interviewStarted) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <nav className="nav-container">
          <div className="nav-content">
            <a href="/" className="nav-logo">
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
          MockMate
            </a>
            <div className="nav-links">
                        <button
                onClick={() => navigate("/setup")}
                className="btn btn-secondary px-20 py-4 whitespace-nowrap"
                style={{ fontSize: '12px' }}
              >
                Back
                        </button>
                    </div>
                  </div>
        </nav>

        <main className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="card-body text-center">
                
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {questionsLoading ? 'Generating Your Interview Questions...' : 'Ready to Start Your Interview?'}
                </h1>
                
                <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-slate-900 mb-4">Interview Details:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium text-slate-900 capitalize">{setupData.interviewType}</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Questions:</span>
                      <span className="font-medium text-slate-900">{setupData.questionCount}</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Preparation time per question:</span>
                      <span className="font-medium text-slate-900">
                        {setupData.preparationTime === 0 ? 'No preparation time' : `${setupData.preparationTime} seconds`}
                    </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time to answer each question:</span>
                      <span className="font-medium text-slate-900">3 minutes</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Voice recognition:</span>
                      <span className="font-medium text-slate-900">{setupData.voiceEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
                
                {questionsLoading && (
                  <div className="flex justify-center items-center mb-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-slate-600">Generating personalized questions...</span>
                  </div>
                )}
                
                <div className="flex justify-center items-center mt-12 mb-16">
                      <button
                    onClick={handleStartInterview}
                    disabled={questionsLoading || questions.length === 0}
                    className={`btn px-16 py-4 ${(questionsLoading || questions.length === 0) ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    style={{ fontSize: '18px' }}
                  >
                    {questionsLoading ? 'Generating Questions...' : questions.length === 0 ? 'No Questions Available' : 'Start Interview'}
                    {!questionsLoading && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                      </button>
                  </div>
              </div>
            </div>
          </div>
        </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <a href="/" className="nav-logo">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            MockMate
          </a>
          <div className="nav-links">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1">
        <div 
          className="bg-cyan-600 h-1 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-body">
              {/* Question Number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-semibold ${isPrepTime ? 'text-yellow-800' : 'text-green-800'}`}>
                    {isPrepTime ? 'Prep: ' : 'Answer: '}{formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 leading-relaxed">
                  {questions[currentQuestionIndex]}
                </h2>
              </div>

              {/* Phase Indicator */}
              <div className="mb-6">
                {isPrepTime && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-800 font-medium">Preparation Time</span>
                      </div>
                      <button
                        onClick={skipPrepTime}
                        className="btn btn-secondary px-4 py-2 text-sm"
                      >
                        Skip Prep Time
                      </button>
                    </div>
                  </div>
                )}
                {isAnswerTime && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-800 font-medium">Answer Time</span>
                      </div>
                      {enableMicrophone ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={startRecording}
                            disabled={isRecording}
                            className="btn btn-primary px-4 py-2 text-sm disabled:opacity-50"
                          >
                            Start Voice
                          </button>
                          <button
                            onClick={stopRecording}
                            disabled={!isRecording}
                            className="btn btn-secondary px-4 py-2 text-sm disabled:opacity-50"
                          >
                            Stop Voice
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-green-700">
                          Voice mode disabled
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Section */}
              <div className="space-y-6">
                <div>
                  <label className="form-label">Your Answer</label>
                  <textarea
                    value={response}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder={enableMicrophone ? "Click 'Start Voice' to record your answer, or type manually..." : "Type your response here..."}
                    rows={8}
                    disabled={isPrepTime}
                    className={`form-input resize-none ${isPrepTime ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>

              </div>
        </div>

            {/* Navigation */}
            <div className="card-footer">
              <div className="flex justify-between items-center">
            <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isPrepTime}
                  className={`btn btn-ghost ${(currentQuestionIndex === 0 || isPrepTime) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
            </button>

                <div className="flex items-center space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentQuestionIndex
                          ? 'bg-cyan-600 w-8'
                          : index < currentQuestionIndex
                          ? 'bg-green-600'
                          : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

              <button
                  onClick={handleNextQuestion}
                  disabled={isPrepTime}
                  className={`btn btn-primary ${isPrepTime ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}