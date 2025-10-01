import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfessionalDesign.css";

export default function AuthPromptPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to upload
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/upload");
    }
  }, [isAuthenticated, navigate]);

  const accountFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Save Your Progress",
      description: "Never lose your interview history. Access all your past sessions anytime."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Store Your Resume",
      description: "Upload once, use forever. Your resume is saved and ready for future interviews."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Track Your Progress",
      description: "View detailed analytics, score trends, and improvement insights over time."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Interview History",
      description: "Review all your past interviews, questions, and feedback whenever you need."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <button onClick={() => navigate("/")} className="nav-logo" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            MockMate
          </button>
          <div className="nav-links">
            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Create an Account to Unlock Features
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get the most out of MockMate with a free account. Save your progress, track improvements, and never lose your interview data.
            </p>
          </div>

          {/* Combined Features and CTA Section */}
          <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <div className="card-body p-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {accountFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">{feature.title}</h3>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-cyan-200 mb-8 mt-6"></div>

              {/* CTA Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Ready to Get Started?
                </h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto" style={{ marginBottom: '14px' }}>
                  Create a free account in seconds and start tracking your interview progress today.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => navigate("/signup")}
                    className="btn btn-primary"
                    style={{ fontSize: '18px', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '60px', paddingRight: '60px' }}
                  >
                    Create Free Account
                  </button>
                  
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-3 text-slate-600 hover:text-cyan-600 font-medium underline transition-colors"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    Already have an account?
                  </button>
                </div>

                {/* Continue Without Account */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate("/upload")}
                    className="btn btn-secondary px-6 py-2 text-sm"
                  >
                    Continue without an account
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    Note: Your interview data won't be saved if you continue without an account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

