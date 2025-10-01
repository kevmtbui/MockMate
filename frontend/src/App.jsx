import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPromptPage from "./pages/AuthPromptPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadForm from "./pages/UploadForm";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewQAScreen from "./pages/InterviewQAScreen";
import FeedbackScreen from "./pages/FeedbackScreen";
import HistoryPage from "./pages/HistoryPage";
import ContactPage from "./pages/ContactPage";
import "./styles/ProfessionalDesign.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth-prompt" element={<AuthPromptPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewQAScreen />} />
          <Route path="/feedback" element={<FeedbackScreen />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}