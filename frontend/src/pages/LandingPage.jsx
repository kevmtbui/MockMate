import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

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
        <div className="max-w-md mx-auto space-y-8">
          {/* Hero Text */}
          <div className="space-y-4 text-left">
            <h2 className="text-[5rem] md:text-[6rem] lg:text-[7rem] font-bold text-[#333333] font-inter leading-tight">
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
            className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ padding: '20px 50px', fontSize: '32px' }}
          >
            Start Mock Interview
          </button>
        </div>
      </main>
    </div>
  );
}