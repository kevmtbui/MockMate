// API Configuration for MockMate Frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  GET_CURRENT_USER: `${API_BASE_URL}/api/auth/me`,
  
  // Interview endpoints
  START_INTERVIEW: `${API_BASE_URL}/api/interview/start`,
  GENERATE_QUESTIONS: `${API_BASE_URL}/api/generate-questions`,
  SUBMIT_ANSWER: `${API_BASE_URL}/api/submit-answer`,
  END_INTERVIEW: `${API_BASE_URL}/api/interview/end`,
  GET_FEEDBACK: `${API_BASE_URL}/api/get-feedback`,
  
  // Resume endpoints
  UPLOAD_RESUME: `${API_BASE_URL}/api/upload-resume`,
  
  // Text-to-Speech endpoints
  TTS_SYNTHESIZE: `${API_BASE_URL}/api/tts/synthesize`,
  
  // User history endpoints
  GET_INTERVIEW_HISTORY: `${API_BASE_URL}/api/user/interviews`,
  GET_INTERVIEW_DETAILS: `${API_BASE_URL}/api/user/interview/{interview_id}`,
  GET_USER_STATS: `${API_BASE_URL}/api/user/stats`,
  SAVE_INTERVIEW: `${API_BASE_URL}/api/user/save-interview`,
  SAVE_RESUME: `${API_BASE_URL}/api/user/save-resume`,
  GET_ACTIVE_RESUME: `${API_BASE_URL}/api/user/active-resume`,
  
  // Health check
  HEALTH_CHECK: `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;
