/**
 * Interview Progress Autosave Utilities
 * Saves interview progress to localStorage to prevent data loss on refresh
 */

const STORAGE_KEYS = {
  INTERVIEW_DATA: 'mockmate_interview_data',
  CURRENT_QUESTION: 'mockmate_current_question',
  ANSWERS: 'mockmate_answers',
  SETUP_DATA: 'mockmate_setup_data',
  QUESTIONS: 'mockmate_questions',
  TIMESTAMP: 'mockmate_timestamp'
};

// Session expiry: 24 hours
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Save interview progress
 */
export const saveInterviewProgress = (data) => {
  try {
    const saveData = {
      ...data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_DATA, JSON.stringify(saveData));
    console.log('✅ Interview progress saved');
  } catch (error) {
    console.error('Failed to save interview progress:', error);
  }
};

/**
 * Save specific interview data
 */
export const saveInterviewField = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

/**
 * Load interview progress
 */
export const loadInterviewProgress = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.INTERVIEW_DATA);
    
    if (!savedData) {
      return null;
    }
    
    const data = JSON.parse(savedData);
    
    // Check if session expired (24 hours)
    if (data.timestamp && (Date.now() - data.timestamp > SESSION_EXPIRY_MS)) {
      console.log('⏰ Saved interview session expired, clearing...');
      clearInterviewProgress();
      return null;
    }
    
    console.log('✅ Interview progress loaded');
    return data;
  } catch (error) {
    console.error('Failed to load interview progress:', error);
    return null;
  }
};

/**
 * Clear interview progress
 */
export const clearInterviewProgress = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ Interview progress cleared');
  } catch (error) {
    console.error('Failed to clear interview progress:', error);
  }
};

/**
 * Check if there's saved progress
 */
export const hasSavedProgress = () => {
  const savedData = localStorage.getItem(STORAGE_KEYS.INTERVIEW_DATA);
  if (!savedData) return false;
  
  try {
    const data = JSON.parse(savedData);
    // Check if not expired
    return data.timestamp && (Date.now() - data.timestamp < SESSION_EXPIRY_MS);
  } catch {
    return false;
  }
};

/**
 * Get time since last save
 */
export const getTimeSinceLastSave = () => {
  const savedData = localStorage.getItem(STORAGE_KEYS.INTERVIEW_DATA);
  if (!savedData) return null;
  
  try {
    const data = JSON.parse(savedData);
    if (data.timestamp) {
      const minutesAgo = Math.floor((Date.now() - data.timestamp) / (60 * 1000));
      return minutesAgo;
    }
  } catch {
    return null;
  }
  return null;
};


