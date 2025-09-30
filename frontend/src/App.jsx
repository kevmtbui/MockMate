import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadForm from "./pages/UploadForm";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewQAScreen from "./pages/InterviewQAScreen";
import FeedbackScreen from "./pages/FeedbackScreen";
import ContactPage from "./pages/ContactPage";
import "./styles/ProfessionalDesign.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/interview" element={<InterviewQAScreen />} />
        <Route path="/feedback" element={<FeedbackScreen />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}