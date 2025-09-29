import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const uploadData = location.state || {};
  
  const [interviewType, setInterviewType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Moderate");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [prepTime, setPrepTime] = useState("30");
  const [autoTTS, setAutoTTS] = useState(false);
  const [enableMicrophone, setEnableMicrophone] = useState(false);

  const isFormValid = () => {
    return true; // Always valid since we removed required fields
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    navigate("/interview", { 
      state: { 
        selectedFile: uploadData.selectedFile,
        jobTitle: uploadData.jobTitle || "",
        companyName: uploadData.companyName || "",
        jobDescription: uploadData.jobDescription || "",
        jobLevel: uploadData.jobLevel || "Entry",
        resumeText: uploadData.resumeText || "",
        prepTime: parseInt(prepTime),
        interviewType: interviewType,
        difficulty: difficulty,
        numberOfQuestions: numberOfQuestions,
        autoTTS: autoTTS,
        enableMicrophone: enableMicrophone,
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full m-0 p-0">
        <div className="flex flex-col items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter text-center m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
          >
            MockMate
          </h1>
          <button 
            onClick={() => navigate("/contact")}
            className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap mt-4 px-6 py-2 text-[clamp(0.9rem,2.2vw,1.3rem)]"
          >
            Contact
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-4 text-center">
            <h2 className="text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(3rem,8vw,5rem)] lg:text-[clamp(3.5rem,9vw,6rem)] font-bold text-[#333333] font-inter leading-tight">
              Interview Settings
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Question Type */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Question Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Resume">Resume</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Number of Questions
              </label>
              <select
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={7}>7 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            {/* Question Prep Time */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Question Prep Time
              </label>
              <select
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
              >
                <option value="0">No prep time</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
              </select>
            </div>

            {/* Auto Question TTS Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#333333] font-inter font-bold text-[35px]">
                  Auto Question TTS
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setAutoTTS(!autoTTS);
                  }}
                  className={`relative inline-flex items-center rounded-full transition-colors ${
                    autoTTS ? 'bg-[#333333]' : 'bg-[#D5D5D5]'
                  }`}
                  style={{ height: '40px', width: '80px' }}
                >
                  <span
                    className={`inline-block rounded-full bg-white transition-transform ${
                      autoTTS ? 'translate-x-[44px]' : 'translate-x-1'
                    }`}
                    style={{ height: '32px', width: '32px' }}
                  />
                </button>
              </div>
            </div>

            {/* Enable Microphone Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#333333] font-inter font-bold text-[35px]">
                  Enable Microphone
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setEnableMicrophone(!enableMicrophone);
                  }}
                  className={`relative inline-flex items-center rounded-full transition-colors ${
                    enableMicrophone ? 'bg-[#333333]' : 'bg-[#D5D5D5]'
                  }`}
                  style={{ height: '40px', width: '80px' }}
                >
                  <span
                    className={`inline-block rounded-full bg-white transition-transform ${
                      enableMicrophone ? 'translate-x-[44px]' : 'translate-x-1'
                    }`}
                    style={{ height: '32px', width: '32px' }}
                  />
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-center" style={{ marginTop: '106px' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`rounded-[2rem] font-inter font-bold transition-all duration-300 border-0 outline-none shadow-lg whitespace-nowrap px-8 py-4 text-[clamp(1.5rem,4vw,2.5rem)] ${
              isFormValid() 
                ? 'bg-[#D5D5D5] text-[#333333] hover:bg-[#C5C5C5] hover:shadow-xl cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

      </main>
    </div>
  );
}