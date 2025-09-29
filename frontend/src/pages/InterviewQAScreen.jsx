import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function InterviewQAScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = location.state || {};
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(parseInt(settings.prepTime) || 120); // Use settings prep time or default to 2 minutes
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [responses, setResponses] = useState([]);

  const getQuestionsByType = (type) => {
    switch (type) {
      case "Technical":
        return [
          "Tell me about yourself and your experience in software development.",
          "What programming languages are you most comfortable with?",
          "Describe a challenging technical problem you solved recently.",
          "How do you approach debugging complex issues?",
          "What's your experience with version control and collaboration tools?"
        ];
      case "Behavioral":
        return [
          "Tell me about a time when you had to work under pressure.",
          "Describe a situation where you had to resolve a conflict with a team member.",
          "Give me an example of a time when you failed and what you learned from it.",
          "Tell me about a time when you had to learn something new quickly.",
          "Describe a situation where you had to persuade others to adopt your idea."
        ];
      case "Resume":
        return [
          "Walk me through your resume and highlight your most relevant experience.",
          "Tell me about a specific project mentioned on your resume and your role in it.",
          "What skills listed on your resume are you most proud of?",
          "Can you explain any gaps in your employment history?",
          "How does your educational background relate to this position?"
        ];
      case "Mixed":
        return [
          "Tell me about yourself and your experience in software development.",
          "What is your greatest strength and how does it help you in your work?",
          "Describe a challenging project you worked on and how you overcame obstacles.",
          "Where do you see yourself in 5 years?",
          "Why do you want to work at our company?"
        ];
      default:
        return [
          "Tell me about yourself and your experience in software development.",
          "What is your greatest strength and how does it help you in your work?",
          "Describe a challenging project you worked on and how you overcame obstacles.",
          "Where do you see yourself in 5 years?",
          "Why do you want to work at our company?"
        ];
    }
  };

  const questions = getQuestionsByType(settings.interviewType);

  const totalQuestions = questions.length;

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

  const startInterview = () => {
    setIsInterviewStarted(true);
    setIsPrepTime(true);
    setIsTimerRunning(true);
    setTimeLeft(parseInt(settings.prepTime) || 120); // Use settings prep time or default to 2 minutes
  };

  const handleSkipOrNext = () => {
    if (isPrepTime) {
      // Skip prep time, go directly to answering
      setIsPrepTime(false);
      setIsTimerRunning(false); // Stop timer after prep time
    } else {
      // Next question or go to feedback
      // Save current response
      setResponses([...responses, { question: questions[currentQuestionIndex], response: response }]);
      setResponse("");
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsPrepTime(true);
        setTimeLeft(parseInt(settings.prepTime) || 120); // Reset prep time for next question using settings
        setIsTimerRunning(true);
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
              <h2 className="text-[#333333] font-inter font-bold text-[35px]">
                Ready to Start Your Interview?
              </h2>
              <p className="text-[#333333] font-inter text-[25px]">
                You will have {formatPrepTime(parseInt(settings.prepTime) || 120)} to prepare for each question.
              </p>
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
                        {questions[currentQuestionIndex]}
                      </p>
                    </div>
                  </div>

              {/* Response Section */}
              <div className="space-y-4">
                <h2 className="text-[#333333] font-inter font-bold text-[35px]">
                  Response
                </h2>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="border-2 border-[#333333] rounded-xl p-8 font-inter text-[#333333] text-[25px] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                  style={{ width: '800px', height: '300px' }}
                  placeholder="Type your response here..."
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
                <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center">
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
            <button
              onClick={startInterview}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap pt-4"
              style={{ padding: '10px 35px', fontSize: '32px' }}
            >
              Start Interview
            </button>
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