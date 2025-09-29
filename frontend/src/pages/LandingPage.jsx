import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

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
        <div className="max-w-md mx-auto space-y-8">
          {/* Hero Text */}
          <div className="space-y-4 text-left">
            <h2 className="text-[clamp(3rem,8vw,5rem)] md:text-[clamp(4rem,10vw,6rem)] lg:text-[clamp(5rem,12vw,7rem)] font-bold text-[#333333] font-inter leading-tight">
              Practice
              <br />
              Interview,
              <br />
              Boost
              <br />
              Confidence
            </h2>
          </div>
        </div>
        
        {/* CTA Button - Full width container */}
        <div className="w-full mt-0 flex justify-center">
          <button 
            onClick={() => navigate("/upload")}
            className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap px-8 py-4 text-[clamp(1.5rem,4vw,2.5rem)] cursor-pointer"
          >
            Start Mock Interview
          </button>
        </div>

      </main>
    </div>
  );
}