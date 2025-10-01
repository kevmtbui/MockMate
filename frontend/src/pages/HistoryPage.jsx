import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfessionalDesign.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchInterviews();
  }, [isAuthenticated, navigate]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_INTERVIEW_HISTORY, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to fetch interview history`);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interview history');
      // Fallback to empty array
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (interviewId) => {
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.GET_INTERVIEW_DETAILS.replace('/api/user/interview/{interview_id}', '/api/user/interview')}/${interviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        // Remove the deleted interview from the local state
        setInterviews(prevInterviews => prevInterviews.filter(interview => interview.id !== interviewId));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to delete interview`);
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      setError('Failed to delete interview');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Your History</h2>
          <p className="text-slate-600">Fetching your interview history...</p>
        </div>
      </div>
    );
  }

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
            <button onClick={() => navigate("/upload")} className="btn btn-primary">
              New Interview
            </button>
            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Interview History
            </h1>
            <p className="text-xl text-slate-600">
              Track your progress and review past interview sessions
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {interviews.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Interviews Yet</h3>
              <p className="text-slate-600 mb-6">Start your first mock interview to track your progress</p>
              <button 
                onClick={() => navigate("/upload")}
                className="btn btn-primary"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview, index) => (
                <div key={interview.id || index} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {interview.job_title || 'Software Engineer'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {interview.company_name || 'Company'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreBgColor(interview.overall_score || 0)} ${getScoreColor(interview.overall_score || 0)}`}>
                        {interview.overall_score || 0}/100
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium text-slate-900 capitalize">
                          {interview.interview_type || 'Mixed'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Level:</span>
                        <span className="font-medium text-slate-900">
                          {interview.job_level || 'Mid-Level'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium text-slate-900">
                          {formatDate(interview.created_at || new Date())}
                        </span>
                      </div>
                    </div>

                    {interview.feedback_summary && (
                      <div className="bg-slate-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-700 line-clamp-3">
                          {interview.feedback_summary}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          try {
                            // Fetch full interview details
                            const response = await fetch(`${API_ENDPOINTS.GET_INTERVIEW_DETAILS.replace('{interview_id}', interview.id)}`, {
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                              }
                            });
                            
                            if (response.ok) {
                              const fullInterviewData = await response.json();
                              // Navigate to feedback view with complete historical data
                              navigate("/feedback", {
                                state: {
                                  ...fullInterviewData,
                                  isHistorical: true
                                }
                              });
                            } else {
                              console.error('Failed to fetch interview details');
                              // Fallback to basic data
                              navigate("/feedback", {
                                state: {
                                  ...interview,
                                  isHistorical: true
                                }
                              });
                            }
                          } catch (error) {
                            console.error('Error fetching interview details:', error);
                            // Fallback to basic data
                            navigate("/feedback", {
                              state: {
                                ...interview,
                                isHistorical: true
                              }
                            });
                          }
                        }}
                        className="btn btn-primary flex-1 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => deleteInterview(interview.id)}
                        className="btn btn-secondary flex-1 text-sm"
                        style={{ backgroundColor: '#ef4444', color: 'white', border: '1px solid #dc2626' }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}