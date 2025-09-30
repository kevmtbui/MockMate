import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state || {});
  
  const [interviewType, setInterviewType] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30); // Default to 30 seconds preparation time
  const [difficulty, setDifficulty] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Debug log for interviewType changes
  useEffect(() => {
    console.log('Current interviewType:', interviewType);
  }, [interviewType]);

  // Debug log for difficulty changes
  useEffect(() => {
    console.log('Current difficulty:', difficulty);
  }, [difficulty]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (!location.state) {
      navigate("/upload");
    } else {
      // Pre-populate form with data from feedback page
      if (location.state.preparationTime !== undefined) {
        setTimeLimit(location.state.preparationTime);
      }
      if (location.state.questionCount !== undefined) {
        setQuestionCount(location.state.questionCount);
      }
      if (location.state.interviewType !== undefined) {
        setInterviewType(location.state.interviewType);
      }
      if (location.state.difficulty !== undefined) {
        setDifficulty(location.state.difficulty);
      }
      if (location.state.voiceEnabled !== undefined) {
        setVoiceEnabled(location.state.voiceEnabled);
      }
    }
  }, [location.state, navigate]);

  const interviewTypes = [
    {
      value: "behavioral",
      label: "Behavioral Interview",
      description: "Focus on soft skills, teamwork, and problem-solving scenarios",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      value: "technical",
      label: "Technical Interview",
      description: "Technical questions specific to your role and technologies",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      value: "mixed",
      label: "Mixed Interview",
      description: "Combination of behavioral and technical questions",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      value: "resume_tailored",
      label: "Resume Tailored Questions",
      description: "Questions specifically based on your resume and experience",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const isFormValid = () => {
    return interviewType && questionCount >= 1 && timeLimit >= 0 && difficulty;
  };

  const handleStartInterview = () => {
    if (!isFormValid()) return;
    
    navigate("/interview", {
      state: {
        ...formData,
        interviewType,
        questionCount,
        preparationTime: timeLimit, // Time to prepare before each question
        answerTime: 3, // Fixed 3 minutes to answer each question
        difficulty,
        voiceEnabled
      }
    });
  };

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
            <button 
              onClick={() => navigate("/upload")}
              className="btn btn-secondary px-20 py-4 whitespace-nowrap"
              style={{ fontSize: '12px' }}
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Interview Setup
            </h1>
            <p className="text-xl text-slate-600">
              Customize your interview experience to match your preparation goals
            </p>
          </div>


          {/* Job Summary */}
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="text-xl font-bold text-slate-900">Interview Summary</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600">Position</p>
                  <p className="text-lg font-semibold text-slate-900">{formData.jobTitle || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Company</p>
                  <p className="text-lg font-semibold text-slate-900">{formData.companyName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Experience Level</p>
                  <p className="text-lg font-semibold text-slate-900">{formData.jobLevel || 'Not specified'}</p>
                </div>
              </div>
            </div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Interview Type */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold text-slate-900">Interview Type</h2>
            </div>
              <div className="card-body space-y-4">
                <div 
                  onClick={(e) => {
                    // Prevent form from interfering with button clicks
                    e.stopPropagation();
                  }}
                >
                  {interviewTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Setting interview type to:', type.value);
                      setInterviewType(type.value);
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer ${
                      interviewType === type.value
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        interviewType === type.value ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${interviewType === type.value ? 'text-white' : 'text-slate-900'}`}>{type.label}</h3>
                        <p className={`text-sm mt-1 ${interviewType === type.value ? 'text-cyan-100' : 'text-slate-600'}`}>{type.description}</p>
                      </div>
                    </div>
                </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Selected: {interviewType ? interviewTypes.find(type => type.value === interviewType)?.label : 'None'}
                </div>
              </div>
            </div>

            {/* Interview Settings */}
            <div className="space-y-6">
              {/* Question Count */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-slate-900">Number of Questions</h2>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold" style={{ fontSize: '24px' }}>Questions</span>
                    <div className="flex items-center space-x-8">
                      <button
                        type="button"
                        onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                        className="rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors duration-200 shadow-lg"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '30px', height: '30px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="font-bold text-slate-900 text-center" style={{ fontSize: '36px', width: '60px' }}>{questionCount}</span>
                      <button
                        type="button"
                        onClick={() => setQuestionCount(Math.min(10, questionCount + 1))}
                        className="rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors duration-200 shadow-lg"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '30px', height: '30px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-2 font-bold" style={{ fontSize: '18px' }}>Recommended: 5-7 questions for optimal preparation</p>
                </div>
              </div>

              {/* Preparation Time */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-slate-900">Preparation Time Per Question</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">0 seconds</span>
                      <span className="text-sm font-medium text-slate-600">120 seconds</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      step="5"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(timeLimit / 120) * 100}%, #e2e8f0 ${(timeLimit / 120) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <div className="text-center">
                      <span className="text-lg font-semibold text-slate-900">
                        {timeLimit === 0 ? 'No preparation time' : `${timeLimit} second${timeLimit !== 1 ? 's' : ''}`}
                      </span>
                      {timeLimit > 0 && (
                        <span className="text-sm text-slate-600 ml-2">
                          ({Math.floor(timeLimit / 60)}m {timeLimit % 60}s)
                        </span>
                      )}
                    </div>
                    <div className="text-center text-sm text-slate-600">
                      <p>Each question will have 3 minutes to answer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-slate-900">Difficulty Level</h2>
                </div>
                <div className="card-body space-y-4">
                  <div 
                    onClick={(e) => {
                      // Prevent form from interfering with button clicks
                      e.stopPropagation();
                    }}
                  >
                    {[
                      { 
                        value: "easy", 
                        label: "Easy", 
                        description: "Basic questions for initial preparation",
                        icon: (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )
                      },
                      { 
                        value: "medium", 
                        label: "Medium", 
                        description: "Standard interview difficulty",
                        icon: (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )
                      },
                      { 
                        value: "hard", 
                        label: "Hard", 
                        description: "Challenging questions for top companies",
                        icon: (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )
                      }
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Setting difficulty to:', level.value);
                          setDifficulty(level.value);
                        }}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer ${
                          difficulty === level.value
                            ? 'border-cyan-500 bg-cyan-600 text-white'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            difficulty === level.value ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {level.icon}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${difficulty === level.value ? 'text-white' : 'text-slate-900'}`}>{level.label}</h3>
                            <p className={`text-sm mt-1 ${difficulty === level.value ? 'text-cyan-100' : 'text-slate-600'}`}>{level.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Selected: {difficulty ? [
                      { value: "easy", label: "Easy" },
                      { value: "medium", label: "Medium" },
                      { value: "hard", label: "Hard" }
                    ].find(level => level.value === difficulty)?.label : 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="card mt-8">
            <div className="card-header">
              <h2 className="text-xl font-bold text-slate-900">Interview Settings</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Voice Recognition</h3>
                  <p className="text-sm text-slate-600">Enable voice input for a more realistic interview experience</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Voice toggle clicked, current state:', voiceEnabled);
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className={`relative inline-flex items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    voiceEnabled 
                      ? 'bg-slate-700 border-4 border-slate-800 shadow-xl shadow-slate-700/70' 
                      : 'bg-slate-300 border-2 border-slate-400 shadow-lg'
                  }`}
                  style={{ 
                    height: '40px', 
                    width: '80px',
                    backgroundColor: voiceEnabled ? '#374151' : '#cbd5e1',
                    border: voiceEnabled ? '4px solid #1f2937' : '2px solid #94a3b8'
                  }}
                >
                  <span
                    className={`inline-block transform rounded-full transition-all duration-200 ${
                      voiceEnabled ? 'bg-white shadow-xl' : 'bg-slate-500'
                    }`}
                    style={{
                      height: '32px',
                      width: '32px',
                      backgroundColor: voiceEnabled ? '#ffffff' : '#64748b',
                      transform: voiceEnabled ? 'translateX(44px)' : 'translateX(4px)'
                    }}
                  />
                </button>
              </div>
            </div>
        </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center mt-12 mb-16">
          <button
              onClick={handleStartInterview}
            disabled={!isFormValid()}
              className={`btn btn-primary px-16 py-4 ${(!isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ fontSize: '18px' }}
            >
              {!isFormValid() ? 'Complete Setup' : 'Start Interview'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
          </button>
          </div>
        </div>
      </main>
    </div>
  );
}