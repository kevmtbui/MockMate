import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [prepTime, setPrepTime] = useState(0);
  const [jobDescription, setJobDescription] = useState("");
  const [midInterviewTips, setMidInterviewTips] = useState(false);

  const isFormValid = () => {
    return jobTitle.trim() !== "" && jobDescription.trim() !== "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    navigate("/interview", { 
      state: { 
        prepTime: parseInt(prepTime),
        jobTitle: jobTitle,
        interviewType: interviewType,
        jobDescription: jobDescription,
        midInterviewTips: midInterviewTips
      }
    });
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
          {/* Page Title */}
          <div className="space-y-4 text-center">
            <h2 className="text-[4rem] md:text-[5rem] lg:text-[35px] font-bold text-[#333333] font-inter leading-tight">
              Interview Settings
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[25px] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                placeholder="Enter job title"
              />
            </div>

            {/* Question Type */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Question Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[25px] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Resume">Resume</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Question Prep Time */}
            <div className="space-y-3">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Question Prep Time
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-[#333333] font-inter text-[35px]">0</span>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="flex-1 h-4"
                />
                <span className="text-[#333333] font-inter text-[35px]">60</span>
              </div>
              <div className="text-center">
                <span className="text-[#333333] font-inter font-bold text-[35px]">{prepTime} Seconds</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-3 mb-12">
              <label className="block text-[#333333] font-inter font-bold text-[35px]">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-8 py-6 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[25px] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                rows="4"
                placeholder="Enter job description"
              />
            </div>

            {/* Mid Interview Tips */}
            <div className="flex items-center justify-between">
              <label className="text-[#333333] font-inter font-bold text-[35px]">
                Mid Interview Tips
              </label>
              <button
                type="button"
                onClick={() => setMidInterviewTips(!midInterviewTips)}
                className={`relative inline-flex items-center rounded-full transition-colors ${
                  midInterviewTips ? 'bg-[#333333]' : 'bg-[#D5D5D5]'
                }`}
                style={{ height: '40px', width: '40px' }}
              >
                <span
                  className={`inline-block rounded-full bg-white transition-transform ${
                    midInterviewTips ? 'translate-x-[66px]' : 'translate-x-1'
                  }`}
                  style={{ height: '64px', width: '64px' }}
                />
              </button>
            </div>
          </form>
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-center" style={{ marginTop: '106px' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`rounded-[2rem] font-inter font-bold transition-all duration-300 border-0 outline-none shadow-lg whitespace-nowrap pt-4 ${
              isFormValid() 
                ? 'bg-[#D5D5D5] text-[#333333] hover:bg-[#C5C5C5] hover:shadow-xl cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ padding: '10px 35px', fontSize: '32px' }}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}