import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Intelligence",
      description: "Advanced AI generates realistic interview questions tailored to your specific role and industry, providing a truly personalized practice experience."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Instant Detailed Feedback",
      description: "Receive comprehensive feedback on your responses, communication style, and areas for improvement with actionable insights."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      title: "Voice Recognition",
      description: "Practice with advanced voice recognition technology for a realistic interview experience that prepares you for real scenarios."
    }
  ];


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
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <button 
              onClick={() => navigate("/contact")}
              className="btn btn-secondary"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="animate-fade-in">
            <h1 className="hero-title">
              Master Your
              <br />
              <span className="text-cyan-600">Interview Skills</span>
            </h1>
            <p className="hero-subtitle">
              Practice with AI-powered mock interviews, get personalized feedback, and boost your confidence for your next career opportunity.
            </p>
            
             <div className="flex justify-center items-center mt-12">
               <button 
                 onClick={() => navigate("/upload")}
                 className="btn btn-primary px-16 whitespace-nowrap"
                 style={{ fontSize: '25px', paddingTop: '20px', paddingBottom: '20px' }}
               >
                 Start Your<br />Mock Interview
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                 </svg>
               </button>
             </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-8 pb-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose MockMate?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven interview preparation methods to give you the competitive edge.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get started in just a few simple steps
            </p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: "1",
                title: "Upload Your Resume",
                description: "Upload your resume and provide job details to personalize your interview experience."
              },
              {
                step: "2",
                title: "Practice Interview",
                description: "Engage in realistic interview scenarios with our AI interviewer using voice recognition."
              },
              {
                step: "3",
                title: "Get Feedback",
                description: "Receive detailed feedback and actionable insights to improve your performance."
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates who used MockMate to land their dream jobs.
          </p>
          <button 
            onClick={() => navigate("/upload")}
            className="btn btn-secondary text-lg px-8 py-4 bg-white text-cyan-600 hover:bg-gray-100"
            style={{ marginBottom: '60px' }}
          >
            Get Started Today
          </button>
        </div>
      </section>

    </div>
  );
}