import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VoiceService } from "../services/voiceService";

export default function InterviewQAScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = location.state || {};
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(parseInt(settings.prepTime) || 0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [voiceMode, setVoiceMode] = useState(location.state?.autoTTS || false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingSession, setRecordingSession] = useState(null);
  const [hasPlayedCurrentQuestion, setHasPlayedCurrentQuestion] = useState(false);
  const hasGeneratedQuestions = useRef(false);

  // Generate questions using AI API
  const generateQuestions = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);
    
    try {
      const requestData = {
        settings: {
          job_title: settings.jobTitle || "Software Engineer",
          company_name: settings.companyName || "Tech Company", 
          job_description: settings.jobDescription || "",
          job_level: settings.jobLevel || "Entry",
          interview_type: settings.interviewType || "Mixed",
          difficulty: settings.difficulty || "Moderate",
          number_of_questions: settings.numberOfQuestions || 5,
          answer_length: "Medium", // Fixed value
          prep_time: settings.prepTime || 0,
        },
        resume_text: settings.resumeText || null
      };

      const response = await fetch('http://localhost:8000/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const generatedQuestions = data.questions || [];
      setQuestions(generatedQuestions);
      setLoadingProgress(100);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to static questions
      const fallbackQuestions = getFallbackQuestions(settings.interviewType || "Mixed");
      setQuestions(fallbackQuestions);
      setLoadingProgress(100);
      
    } finally {
      clearInterval(progressInterval);
      // Small delay to show 100% completion
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 800);
    }
  };

  const getFallbackQuestions = (type) => {
    const questionSets = {
      "Technical": [
          "Tell me about yourself and your experience in software development.",
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
          "Tell me about yourself and your experience in software development.",
          "What is your greatest strength and how does it help you in your work?",
          "Describe a challenging project you worked on and how you overcame obstacles.",
          "Where do you see yourself in 5 years?",
          "Why do you want to work at our company?"
      ]
    };
    return questionSets[type] || questionSets["Mixed"];
  };

  const totalQuestions = questions.length;

  // Voice interaction functions
  const playQuestion = async (questionText) => {
    if (voiceMode && !hasPlayedCurrentQuestion) {
      try {
        await VoiceService.playQuestion(questionText);
        setHasPlayedCurrentQuestion(true);
      } catch (error) {
        console.error('Error playing question:', error);
      }
    }
  };

  const startRecording = async () => {
    if (!voiceMode) return;
    
    try {
      setIsRecording(true);
      // Use the new speech recognition directly
      const session = await VoiceService.speechToText();
      setRecordingSession({
        stop: async () => {
          setIsRecording(false);
          return session.final || session.interim || '';
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recordingSession) return;
    
    try {
      const result = await recordingSession.stop();
      const transcript = typeof result === 'string' ? result : (result.final || result.interim || '');
      setTranscript(transcript);
      setResponse(prev => prev + (prev ? " " : "") + transcript);
      setIsRecording(false);
      setRecordingSession(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      setRecordingSession(null);
    }
  };




  // Generate questions on component mount (only once)
  useEffect(() => {
    // Save settings to localStorage for retry functionality
    if (settings && Object.keys(settings).length > 0) {
      localStorage.setItem('interviewSettings', JSON.stringify(settings));
    }
    
    if (!hasGeneratedQuestions.current) {
      hasGeneratedQuestions.current = true;
      generateQuestions();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (isPrepTime) {
        setIsPrepTime(false);
        setTimeLeft(300); // 5 minutes for answering (fixed duration)
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, isPrepTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const formatPrepTime = (seconds) => {
    if (seconds === 0) {
      return "no prep time";
    } else if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (secs === 0) {
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
      } else {
        return `${mins} minute${mins !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
      }
    }
  };

  const startInterview = async () => {
    setIsInterviewStarted(true);
    setIsPrepTime(true);
    setIsTimerRunning(true);
    setTimeLeft(parseInt(settings.prepTime) || 0);
    setHasPlayedCurrentQuestion(false); // Reset for first question
    
    // Play first question if voice mode is enabled
    if (voiceMode && questions.length > 0) {
      await playQuestion(questions[0].question || questions[0]);
    }
  };

  const submitAnswer = async (questionText, answerText) => {
    try {
      const response = await fetch('http://localhost:8000/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          answer: answerText,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      console.log('Answer submitted:', data);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleSkipOrNext = async () => {
    if (isPrepTime) {
      // Skip prep time, go directly to answering
      setIsPrepTime(false);
      setIsTimerRunning(false);
      // Note: Question was already played when interview started, no need to play again
    } else {
      // Next question or go to feedback
      // Save current response and submit to backend
      const currentQ = questions[currentQuestionIndex];
      const currentResponse = transcript || response;
      
      if (currentResponse.trim()) {
        // Submit answer to backend
        await submitAnswer(currentQ.question || currentQ, currentResponse.trim());
        
        // Save current response locally for UI
        setResponses([...responses, { 
          question: currentQ.question || currentQ, 
          response: currentResponse.trim()
        }]);
      }
      
      setResponse("");
      setTranscript("");
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsPrepTime(true);
        setTimeLeft(parseInt(settings.prepTime) || 0);
        setIsTimerRunning(true);
        setHasPlayedCurrentQuestion(false); // Reset for next question
        
        // Play next question if voice mode is enabled
        if (voiceMode) {
          const nextQ = questions[currentQuestionIndex + 1];
          await playQuestion(nextQ.question || nextQ);
        }
      } else {
        // All questions done, go to feedback
        navigate("/feedback");
      }
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full m-0 p-0">
        <h1 
          onClick={() => navigate("/")}
          className="text-[80px] font-bold text-[#333333] font-inter text-center m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
        >
          MockMate
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {!isInterviewStarted ? (
            /* Pre-Interview State */
            <div className="text-center space-y-8">
              {isLoading ? (
                <div className="space-y-4">
                  <h2 className="text-[#333333] font-inter font-bold text-[35px]">
                    Generating Your Custom Interview...
                  </h2>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333333]"></div>
                  </div>
                </div>
              ) : (
                <>
              <h2 className="text-[#333333] font-inter font-bold text-[35px]">
                    {isLoading ? "Preparing Your Interview..." : "Ready to Start Your Interview?"}
              </h2>
                  {!isLoading && (
              <p className="text-[#333333] font-inter text-[25px]">
                      You will have {formatPrepTime(parseInt(settings.prepTime) || 0)} to prepare for each question.
                    </p>
                  )}
                  
                  {/* Loading Bar */}
                  {isLoading && (
                    <div className="w-full max-w-md mx-auto mt-8">
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-[#333333] h-full rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-[#333333] font-inter text-[18px] mt-4">
                        Generating {settings.numberOfQuestions || 5} custom questions... {Math.round(loadingProgress)}%
                      </p>
                    </div>
                  )}

                </>
              )}
            </div>
          ) : (
            <>
                  {/* Question Section */}
                  <div className="space-y-4">
                    <h2 className="text-[#333333] font-inter font-bold text-[35px] border-b-4 border-blue-500 pb-2 inline-block">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </h2>
                    <div className="border-2 border-[#333333] rounded-xl p-8 h-[200px] flex items-center justify-center" style={{ width: '800px' }}>
                      <p className="text-[#333333] font-inter text-[25px] text-center">
                        {questions[currentQuestionIndex]?.question || questions[currentQuestionIndex]}
                      </p>
                    </div>
                    
                    {/* Voice Controls */}
                    <div className="flex justify-center space-x-4">
                      {voiceMode && (
                        <button
                          onClick={async () => {
                            const currentQ = questions[currentQuestionIndex];
                            setHasPlayedCurrentQuestion(false); // Allow replay
                            await VoiceService.playQuestion(currentQ?.question || currentQ);
                            setHasPlayedCurrentQuestion(true);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          🔊 Play Question
                        </button>
                      )}
                    </div>
                  </div>


              {/* Response Section */}
              <div className="space-y-4 mt-8">
                <h2 className="text-[#333333] font-inter font-bold text-[35px]">
                  Response
                </h2>
                
                {/* Voice Recording Controls - Only show manual recording, not auto TTS */}
                {false && !isPrepTime && (
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <span>🎤</span>
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <span>⏹️</span>
                        <span>Stop Recording</span>
                      </button>
                    )}
                  </div>
                )}
                
                {/* Transcript Display */}
                {voiceMode && transcript && (
                  <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
                    <p className="text-green-800 font-inter text-[20px]">
                      <strong>Latest Transcript:</strong> {transcript}
                    </p>
                  </div>
                )}
                
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="border-2 border-[#333333] rounded-xl p-8 font-inter text-[#333333] text-[25px] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                  style={{ width: '800px', height: '300px' }}
                  placeholder={voiceMode ? "Your transcribed response will appear here, or type manually..." : "Type your response here..."}
                  disabled={isPrepTime}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-8" style={{ minHeight: '80px' }}>
                {isPrepTime ? (
                  <div className="flex items-center">
                    <span className="text-[#333333] font-inter font-bold text-[35px] text-left whitespace-nowrap" style={{ width: '220px', minWidth: '220px' }}>
                      Prep Time
                    </span>
                    <div className="text-[#333333] font-inter text-[35px] font-mono" style={{ marginLeft: '20px' }}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '220px', minWidth: '220px' }}></div>
                )}
                <div className={`w-16 h-16 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#333333]'} rounded-full flex items-center justify-center`}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Bottom Button */}
        <div className="w-full mt-16 flex justify-center">
          {!isInterviewStarted ? (
            isLoading ? (
              <button
                disabled
                className="bg-[#D5D5D5] text-[#999999] rounded-[2rem] font-inter font-bold cursor-not-allowed transition-all duration-300 border-0 outline-none shadow-lg whitespace-nowrap pt-4"
                style={{ padding: '10px 35px', fontSize: '32px' }}
              >
                Generating Questions...
              </button>
            ) : questions.length > 0 ? (
            <button
              onClick={startInterview}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap pt-4"
              style={{ padding: '10px 35px', fontSize: '32px' }}
            >
              Start Interview
            </button>
            ) : (
              <button
                disabled
                className="bg-[#D5D5D5] text-[#999999] rounded-[2rem] font-inter font-bold cursor-not-allowed transition-all duration-300 border-0 outline-none shadow-lg whitespace-nowrap pt-4"
                style={{ padding: '10px 35px', fontSize: '32px' }}
              >
                No Questions Available
              </button>
            )
          ) : (
            <button
              onClick={handleSkipOrNext}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap pt-4"
              style={{ padding: '10px 35px', fontSize: '32px', minWidth: '200px' }}
            >
              {isPrepTime 
                ? "Start Answering" 
                : currentQuestionIndex < totalQuestions - 1 
                  ? "Next Question" 
                  : "View Feedback"
              }
            </button>
          )}
        </div>
      </main>
    </div>
  );
}