import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedbackScreen() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    strengths: false,
    weaknesses: false,
    improvements: false
  });

  // Fetch AI-generated feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-feedback');
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleRetryInterview = () => {
    // Get the settings from localStorage or use default values
    const savedSettings = localStorage.getItem('interviewSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      navigate("/interview", { state: settings });
    } else {
      // Fallback to setup page if no settings found
      navigate("/setup");
    }
  };

  const handleChangeSettings = () => {
    navigate("/setup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-center items-center px-8 pt-8">
        <div className="flex flex-col items-center">
          <h1 
            onClick={handleLogoClick}
            className="text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
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
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(4rem,10vw,6rem)] lg:text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter">
              Your Performance Feedback
            </h2>
          </div>

          {/* Feedback Sections */}
          {isLoading ? (
            <div className="text-center space-y-4">
              <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                Analyzing Your Interview...
              </h3>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333333]"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <h3 className="text-red-500 font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                {error}
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#D5D5D5] text-[#333333] px-4 py-2 rounded-lg hover:bg-[#C5C5C5] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : feedback ? (
            <div className="space-y-16 w-full max-w-2xl mx-auto">
              {/* Overall Score */}
              {feedback.overall_score && (
                <div className="text-center space-y-4 py-6">
                  <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.3rem,3.5vw,2rem)]">
                    Overall Score
                  </h3>
                  <div className="text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333]">
                    {feedback.overall_score}/10
                  </div>
                </div>
              )}


              {/* Strengths */}
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="w-full max-w-md mx-auto">
                  <button
                    onClick={() => toggleSection('strengths')}
                    className={`flex items-center justify-between w-full text-left border-2 border-green-300 p-8 bg-green-100 hover:bg-green-200 transition-colors ${expandedSections.strengths ? 'rounded-t-xl' : 'rounded-xl'}`}
                  >
                    <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                      Strengths
                    </h3>
                    <span className="text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] font-bold">
                      {expandedSections.strengths ? '−' : '+'}
                    </span>
                  </button>
                  {expandedSections.strengths && (
                    <div className="space-y-4 w-full mt-0 bg-green-50 p-6 rounded-b-xl border-t-2 border-green-300">
                      {feedback.strengths.map((strength, index) => (
                        <div key={index} className="p-4 bg-green-100 rounded-lg w-full">
                          <h4 className="text-green-800 font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)] mb-3">
                            {strength.title}
                          </h4>
                          <p className="text-green-700 font-inter text-[clamp(1.1rem,2.8vw,1.6rem)] leading-relaxed">
                            {strength.description}
                          </p>
                          {strength.suggestion && (
                            <p className="text-green-600 font-inter text-[clamp(0.9rem,2.2vw,1.3rem)] mt-3 italic">
                              💡 {strength.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Weaknesses */}
              {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                <div className="w-full max-w-md mx-auto">
                  <button
                    onClick={() => toggleSection('weaknesses')}
                    className={`flex items-center justify-between w-full text-left border-2 border-orange-300 p-8 bg-orange-100 hover:bg-orange-200 transition-colors ${expandedSections.weaknesses ? 'rounded-t-xl' : 'rounded-xl'}`}
                  >
                    <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                      Areas for Improvement
                    </h3>
                    <span className="text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] font-bold">
                      {expandedSections.weaknesses ? '−' : '+'}
                    </span>
                  </button>
                  {expandedSections.weaknesses && (
                    <div className="space-y-4 w-full mt-0 bg-orange-50 p-6 rounded-b-xl border-t-2 border-orange-300">
                      {feedback.weaknesses.map((weakness, index) => (
                        <div key={index} className="p-4 bg-orange-100 rounded-lg w-full">
                          <h4 className="text-orange-800 font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)] mb-3">
                            {weakness.title}
                          </h4>
                          <p className="text-orange-700 font-inter text-[clamp(1.1rem,2.8vw,1.6rem)] leading-relaxed">
                            {weakness.description}
                          </p>
                          {weakness.suggestion && (
                            <p className="text-orange-600 font-inter text-[clamp(0.9rem,2.2vw,1.3rem)] mt-3 italic">
                              💡 {weakness.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements && feedback.improvements.length > 0 && (
                <div className="w-full max-w-md mx-auto">
                  <button
                    onClick={() => toggleSection('improvements')}
                    className={`flex items-center justify-between w-full text-left border-2 border-blue-300 p-8 bg-blue-100 hover:bg-blue-200 transition-colors ${expandedSections.improvements ? 'rounded-t-xl' : 'rounded-xl'}`}
                  >
                    <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                      Tips for Improvement
                    </h3>
                    <span className="text-[#333333] text-[clamp(1.1rem,2.8vw,1.6rem)] font-bold">
                      {expandedSections.improvements ? '−' : '+'}
                    </span>
                  </button>
                  {expandedSections.improvements && (
                    <div className="space-y-4 w-full mt-0 bg-blue-50 p-6 rounded-b-xl border-t-2 border-blue-300">
                      {feedback.improvements.map((improvement, index) => (
                        <div key={index} className="p-4 bg-blue-100 rounded-lg w-full">
                          <h4 className="text-blue-800 font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)] mb-3">
                            {improvement.title}
                          </h4>
                          <p className="text-blue-700 font-inter text-[clamp(1.1rem,2.8vw,1.6rem)] leading-relaxed">
                            {improvement.description}
                          </p>
                          {improvement.suggestion && (
                            <p className="text-blue-600 font-inter text-[clamp(0.9rem,2.2vw,1.3rem)] mt-3 italic">
                              💡 {improvement.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                No feedback available
              </h3>
              <p className="text-gray-500">
                Complete an interview to see your feedback here.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center" style={{ marginTop: '48px', gap: '48px' }}>
            <button
              onClick={handleRetryInterview}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl"
              className="px-6 py-3 text-[clamp(1.1rem,2.8vw,1.6rem)]"
            >
              Retry Interview
            </button>
            <button
              onClick={handleChangeSettings}
              className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl"
              className="px-6 py-3 text-[clamp(1.1rem,2.8vw,1.6rem)]"
            >
              Change Settings
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}