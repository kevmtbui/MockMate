import React from "react";
import { useNavigate } from "react-router-dom";

export default function FeedbackScreen() {
  const navigate = useNavigate();

  const handleRetryInterview = () => {
    navigate("/interview");
  };

  const handleChangeSettings = () => {
    navigate("/setup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-center items-center px-8 pt-8 relative">
        <h1 
          onClick={handleLogoClick}
          className="text-[80px] font-bold text-[#333333] font-inter m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
        >
          MockMate
        </h1>
        <div className="absolute right-8 w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-[#333333] font-inter">
              Your Performance Feedback
            </h2>
          </div>

          {/* Feedback Sections */}
          <div className="space-y-4">
            
            {/* Strengths */}
            <div className="space-y-2">
              <h3 className="text-[#333333] font-inter font-bold text-[1.5rem]">
                Strengths
              </h3>
              <div className="border-2 border-[#333333] rounded-xl p-6 h-[100px]">
                <p className="text-[#333333] font-inter text-[1.25rem] text-gray-500">
                  Your strengths will be analyzed here...
                </p>
              </div>
            </div>

            {/* Weakness */}
            <div className="space-y-2">
              <h3 className="text-[#333333] font-inter font-bold text-[1.5rem]">
                Weakness
              </h3>
              <div className="border-2 border-[#333333] rounded-xl p-6 h-[100px]">
                <p className="text-[#333333] font-inter text-[1.25rem] text-gray-500">
                  Areas for improvement will be highlighted here...
                </p>
              </div>
            </div>

            {/* Tips For Improvement */}
            <div className="space-y-2">
              <h3 className="text-[#333333] font-inter font-bold text-[1.5rem]">
                Tips For Improvement
              </h3>
              <div className="border-2 border-[#333333] rounded-xl p-6 h-[100px]">
                <p className="text-[#333333] font-inter text-[1.25rem] text-gray-500">
                  Personalized tips will be provided here...
                </p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-center" style={{ marginTop: '48px', gap: '48px' }}>
            <button
              onClick={handleRetryInterview}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl"
              style={{ padding: '16px 32px', fontSize: '24px' }}
            >
              Retry Interview
            </button>
            <button
              onClick={handleChangeSettings}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl"
              style={{ padding: '16px 32px', fontSize: '24px' }}
            >
              Change Settings
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}