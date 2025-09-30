import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function FeedbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [interviewData, setInterviewData] = useState(location.state || {});
  const [activeTab, setActiveTab] = useState("overall");
  const [isLoading, setIsLoading] = useState(true);

  // Mock feedback data
  const [feedback, setFeedback] = useState({
    overall: {
      score: 85,
      summary: "Excellent performance! You demonstrated strong communication skills and provided well-structured responses. Your technical knowledge is solid, and you showed good problem-solving abilities.",
      strengths: [
        "Clear and concise communication",
        "Strong technical knowledge",
        "Good problem-solving approach",
        "Professional demeanor",
        "Well-structured responses"
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider adding more technical details",
        "Work on time management for responses"
      ]
    },
    questions: [],
    categories: {
      communication: { score: 90, label: "Communication" },
      technical: { score: 80, label: "Technical Skills" },
      problemSolving: { score: 85, label: "Problem Solving" },
      behavioral: { score: 88, label: "Behavioral Fit" }
    }
  });

  useEffect(() => {
    if (!location.state) {
      navigate("/upload");
      return;
    }

    // Generate AI feedback
    generateAIFeedback();
  }, [location.state, navigate, interviewData]);

  const generateAIFeedback = async () => {
    try {
      console.log('Fetching AI feedback...');
      console.log('Interview data:', interviewData);
      console.log('Questions:', interviewData.questions);
      console.log('Answers:', interviewData.answers);
      const response = await fetch('http://192.168.0.214:8000/api/get-feedback');
      
      if (response.ok) {
        const aiFeedback = await response.json();
        
        // Transform AI feedback to match UI structure
        const transformedFeedback = {
          overall: {
            score: Math.round((aiFeedback.overall_score - 1) * (100 - 1) / (10 - 1) + 1), // Convert 1-10 to 1-100 scale
            summary: aiFeedback.summary,
            strengths: aiFeedback.strengths.map(s => s.title),
            improvements: aiFeedback.improvements.map(i => i.title)
          },
          questions: (interviewData.questions || []).map((question, index) => {
            // Find AI feedback for this question
            const aiQuestionFeedback = aiFeedback.question_scores?.find(qs => qs.question_index === index);
            const answerText = (interviewData.answers && interviewData.answers[index]) ? interviewData.answers[index] : "No answer provided";
            return {
              question: question || "Question not available",
              answer: answerText,
              score: aiQuestionFeedback ? Math.round((aiQuestionFeedback.score - 1) * (100 - 1) / (10 - 1) + 1) : 50, // Convert 1-10 to 1-100 scale
              feedback: aiQuestionFeedback ? aiQuestionFeedback.feedback : generateQuestionFeedback(question, answerText),
              suggestions: aiQuestionFeedback ? aiQuestionFeedback.suggestions : generateSuggestions(question, answerText)
            };
          }),
          categories: {
            communication: { score: aiFeedback.category_scores?.communication ? Math.round((aiFeedback.category_scores.communication - 1) * (100 - 1) / (10 - 1) + 1) : 50, label: "Communication" },
            technical: { score: aiFeedback.category_scores?.technical ? Math.round((aiFeedback.category_scores.technical - 1) * (100 - 1) / (10 - 1) + 1) : 50, label: "Technical Skills" },
            problemSolving: { score: aiFeedback.category_scores?.problem_solving ? Math.round((aiFeedback.category_scores.problem_solving - 1) * (100 - 1) / (10 - 1) + 1) : 50, label: "Problem Solving" },
            behavioral: { score: aiFeedback.category_scores?.behavioral ? Math.round((aiFeedback.category_scores.behavioral - 1) * (100 - 1) / (10 - 1) + 1) : 50, label: "Behavioral Fit" }
          }
        };
        
        setFeedback(transformedFeedback);
      } else {
        console.error('Failed to get AI feedback, using fallback');
        // Use fallback feedback with AI structure
        const fallbackFeedback = {
          overall: {
            score: 44, // 4/10 converted to 1-100 scale
            summary: "MEDIOCRE performance that shows you're not ready for this level. Your responses lack depth, specificity, and real-world experience.",
            strengths: ["Basic Communication"],
            improvements: ["LACKS SUBSTANCE: Vague and Generic Responses", "URGENT: Develop Real Technical Depth"]
          },
          questions: (interviewData.questions || []).map((question, index) => ({
            question: question || "Question not available",
            answer: (interviewData.answers && interviewData.answers[index]) ? interviewData.answers[index] : "No answer provided",
            score: index === 0 ? 44 : 33, // 4/10 and 3/10 converted to 1-100 scale
            feedback: index === 0 ? "Mediocre response lacking depth" : "Vague and generic answer",
            suggestions: index === 0 ? ["Provide specific examples"] : ["Use STAR method"]
          })),
          categories: {
            communication: { score: 56, label: "Communication" }, // 5/10 converted
            technical: { score: 33, label: "Technical Skills" }, // 3/10 converted
            problemSolving: { score: 44, label: "Problem Solving" }, // 4/10 converted
            behavioral: { score: 44, label: "Behavioral Fit" } // 4/10 converted
          }
        };
        setFeedback(fallbackFeedback);
      }
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      // Use fallback feedback with AI structure
      const fallbackFeedback = {
        overall: {
          score: 44, // 4/10 converted to 1-100 scale
          summary: "MEDIOCRE performance that shows you're not ready for this level. Your responses lack depth, specificity, and real-world experience.",
          strengths: ["Basic Communication"],
          improvements: ["LACKS SUBSTANCE: Vague and Generic Responses", "URGENT: Develop Real Technical Depth"]
        },
        questions: (interviewData.questions || []).map((question, index) => ({
          question: question || "Question not available",
          answer: (interviewData.answers && interviewData.answers[index]) ? interviewData.answers[index] : "No answer provided",
          score: index === 0 ? 44 : 33, // 4/10 and 3/10 converted to 1-100 scale
          feedback: index === 0 ? "Mediocre response lacking depth" : "Vague and generic answer",
          suggestions: index === 0 ? ["Provide specific examples"] : ["Use STAR method"]
        })),
        categories: {
          communication: { score: 56, label: "Communication" }, // 5/10 converted
          technical: { score: 33, label: "Technical Skills" }, // 3/10 converted
          problemSolving: { score: 44, label: "Problem Solving" }, // 4/10 converted
          behavioral: { score: 44, label: "Behavioral Fit" } // 4/10 converted
        }
      };
      setFeedback(fallbackFeedback);
    }
    
    setIsLoading(false);
  };

  const generateQuestionFeedback = (question, answer) => {
    if (!answer.trim()) return "No answer was provided for this question.";
    
    const feedbacks = [
      "Good response with clear structure and relevant examples.",
      "Well-articulated answer that demonstrates good understanding.",
      "Strong response with appropriate level of detail.",
      "Good attempt, could benefit from more specific examples.",
      "Clear communication with logical flow in your response."
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const generateSuggestions = (question, answer) => {
    if (!answer.trim()) return ["Consider providing a structured response using the STAR method."];
    
    const suggestions = [
      ["Consider using the STAR method (Situation, Task, Action, Result) for better structure."],
      ["Try to include more specific examples from your experience."],
      ["Focus on quantifiable results when possible."],
      ["Consider mentioning what you learned from the experience."],
      ["Try to keep your response concise while covering all key points."]
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-yellow-100";
    if (score >= 70) return "bg-orange-100";
    return "bg-red-100";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Interview</h2>
          <p className="text-slate-600">Our AI is evaluating your responses and generating personalized feedback...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate("/")}
              className="btn btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Interview Feedback
            </h1>
            <p className="text-xl text-slate-600">
              Here's how you performed in your {interviewData.interviewType} interview
            </p>
          </div>

          {/* Overall Score */}
          <div className="card mb-8">
            <div className="card-body text-center">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreBgColor(feedback.overall.score)}`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(feedback.overall.score)}`}>
                      {feedback.overall.score}/100
                    </div>
                    <div className="text-sm text-slate-600">Overall Score</div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-slate-700 max-w-3xl mx-auto">
                {feedback.overall.summary}
              </p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(feedback.categories).map(([key, category]) => (
              <div key={key} className="card">
                <div className="card-body text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getScoreBgColor(category.score)}`}>
                    <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{category.label}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("overall")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "overall"
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Overall Analysis
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "questions"
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Question Details
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overall" && (
                <div className="space-y-8">
                  {/* Strengths */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Strengths
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feedback.overall.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Areas for Improvement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feedback.overall.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-slate-700">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "questions" && (
                <div className="space-y-6">
                  {feedback.questions.map((question, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">
                            Question {index + 1}
                          </h4>
                          <p className="text-slate-700 mb-3">{question.question}</p>
                          <div className="bg-slate-50 rounded-lg p-4 mb-3">
                            <p className="text-sm font-medium text-slate-700 mb-1">Your Answer:</p>
                            <p className="text-slate-600">{question.answer}</p>
                          </div>
                        </div>
                        <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(question.score)} ${getScoreColor(question.score)}`}>
                          {question.score}/100
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Feedback:</p>
                          <p className="text-slate-600">{question.feedback}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Suggestions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {question.suggestions.map((suggestion, sIndex) => (
                              <li key={sIndex} className="text-sm text-slate-600">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-16">
            <button
              onClick={() => navigate("/interview", { 
                state: {
                  ...interviewData,
                  // Retain all settings for retry
                  preparationTime: interviewData.preparationTime,
                  answerTime: interviewData.answerTime,
                  questionCount: interviewData.questionCount,
                  interviewType: interviewData.interviewType,
                  difficulty: interviewData.difficulty,
                  voiceEnabled: interviewData.voiceEnabled
                }
              })}
              className="btn btn-primary"
            >
              Retry Interview
            </button>
            <button
              onClick={() => navigate("/setup", { 
                state: {
                  // Retain resume data but allow settings changes
                  resumeText: interviewData.resumeText,
                  jobTitle: interviewData.jobTitle,
                  companyName: interviewData.companyName,
                  jobDescription: interviewData.jobDescription,
                  jobLevel: interviewData.jobLevel,
                  // Pre-populate current settings
                  preparationTime: interviewData.preparationTime,
                  answerTime: interviewData.answerTime,
                  questionCount: interviewData.questionCount,
                  interviewType: interviewData.interviewType,
                  difficulty: interviewData.difficulty,
                  voiceEnabled: interviewData.voiceEnabled
                }
              })}
              className="btn btn-secondary"
            >
              Change Settings
            </button>
          </div>
        </div>
      </main>
      
      {/* Bottom Spacer */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
}