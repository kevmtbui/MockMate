import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function UploadForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  
  // Debug log for jobLevel changes
  React.useEffect(() => {
    console.log('Current jobLevel:', jobLevel);
  }, [jobLevel]);
  const [resumeText, setResumeText] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [aiSummary, setAISummary] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear previous analysis
      setResumeAnalysis(null);
      setAISummary("");
      setResumeText("");
      await extractResumeText(file);
    }
  };

  const extractResumeText = async (file) => {
    setIsExtracting(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      // Call AI resume analysis API
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://192.168.0.214:8000/api/upload-resume', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('AI Resume Analysis Response:', data);
        if (data.success) {
          setResumeText(data.resume_text);
          // Store AI analysis for later use
          setResumeAnalysis(data.analysis);
          setAISummary(data.ai_summary);
          console.log('AI Analysis stored:', data.analysis);
          console.log('AI Summary stored:', data.ai_summary);
        } else {
          throw new Error(data.error || 'Failed to analyze resume');
        }
      } else {
        throw new Error('Failed to upload resume');
      }
      
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsExtracting(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error extracting resume text:', error);
      setIsExtracting(false);
      setUploadProgress(0);
      // Fallback to mock text
      setResumeText(`Professional Summary: Experienced software developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.`);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const isFormValid = () => {
    return selectedFile && jobTitle.trim() !== "" && jobLevel;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    navigate("/setup", { 
      state: { 
        selectedFile: selectedFile,
        jobTitle: jobTitle,
        companyName: companyName,
        jobDescription: jobDescription,
        jobLevel: jobLevel,
        resumeText: resumeText,
        resumeAnalysis: resumeAnalysis,
        aiSummary: aiSummary
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setSelectedFile(pdfFile);
      // Clear previous analysis
      setResumeAnalysis(null);
      setAISummary("");
      setResumeText("");
      await extractResumeText(pdfFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const jobLevels = [
    { value: "Intern", label: "Internship", description: "Student or recent graduate" },
    { value: "Entry", label: "Entry Level", description: "0-2 years experience" },
    { value: "Mid", label: "Mid Level", description: "3-5 years experience" },
    { value: "Senior", label: "Senior Level", description: "5+ years experience" },
    { value: "Executive", label: "Executive", description: "Leadership roles" }
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
            <button 
              onClick={() => navigate("/")}
                className="btn btn-secondary px-20 py-4 whitespace-nowrap"
              style={{ fontSize: '12px' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Upload Your Resume
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Upload your resume and provide job details to get personalized interview questions tailored to your experience and target role.
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-slate-900">Resume Upload</h2>
                <p className="text-slate-600 mt-2">Upload your resume in PDF format to help us understand your background and experience.</p>
              </div>
              
              <div className="card-body">
                <div 
                  className={`border-2 border-dashed rounded-xl px-3 text-center transition-all duration-300 max-w-xs mx-auto cursor-pointer ${
                    isDragging 
                      ? 'border-cyan-500 bg-cyan-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ paddingTop: '120px', paddingBottom: '120px' }}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{selectedFile.name}</p>
                        <p className="text-slate-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      {isExtracting && (
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      {aiSummary && (
                        <div className="bg-slate-50 rounded-lg p-4 text-left">
                          <p className="text-sm font-medium text-slate-700 mb-2">AI Analysis Summary:</p>
                          <p className="text-sm text-slate-600">{aiSummary}</p>
                        </div>
                      )}
                      {resumeAnalysis && (
                        <div className="bg-blue-50 rounded-lg p-4 text-left mt-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Candidate Profile:</p>
                          <div className="text-sm text-slate-600 space-y-1">
                            <p><strong>Name:</strong> {resumeAnalysis.name || 'Not specified'}</p>
                            <p><strong>Experience:</strong> {resumeAnalysis.experience_years || 'Not specified'} years</p>
                            <p><strong>Current Role:</strong> {resumeAnalysis.current_role || 'Not specified'}</p>
                            <p><strong>Skills:</strong> {resumeAnalysis.skills?.join(', ') || 'Not specified'}</p>
                            <p><strong>Technologies:</strong> {resumeAnalysis.technologies?.join(', ') || 'Not specified'}</p>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setResumeAnalysis(null);
                          setAISummary("");
                          setResumeText("");
                        }}
                        className="btn btn-secondary"
                      >
                        Choose Different File
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          Drop your resume here or browse
                        </p>
                        <p className="text-slate-600">PDF files up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-slate-900">Job Details</h2>
                <p className="text-slate-600 mt-2">Tell us about the role you're preparing for to get personalized questions.</p>
              </div>

              <div className="card-body space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group -mt-8">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Google, Microsoft, etc."
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    onClick={(e) => {
                      // Prevent form from interfering with button clicks
                      e.stopPropagation();
                    }}
                  >
                    {jobLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Setting job level to:', level.value);
                          setJobLevel(level.value);
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer ${
                          jobLevel === level.value
                            ? 'border-cyan-500 bg-cyan-600 text-white'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className={`font-semibold ${jobLevel === level.value ? 'text-white' : 'text-slate-900'}`}>{level.label}</div>
                        <div className={`text-sm ${jobLevel === level.value ? 'text-cyan-100' : 'text-slate-600'}`}>{level.description}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Selected: {jobLevel ? jobLevels.find(level => level.value === jobLevel)?.label : 'None'}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="form-input resize-none"
                  />
                  <p className="text-sm text-slate-600 mt-2">
                    This helps us generate more relevant interview questions based on the specific requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center mt-12 mb-16">
              <button 
                type="submit"
                disabled={!isFormValid() || isExtracting}
                className={`btn btn-primary px-16 py-4 ${(!isFormValid() || isExtracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ fontSize: '18px' }}
              >
                {isExtracting ? 'Processing...' : 'Continue Setup'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}