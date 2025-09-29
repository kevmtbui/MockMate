import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLevel, setJobLevel] = useState("Entry");
  const [resumeText, setResumeText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    if (file) {
      await extractResumeText(file);
    }
  };

  const extractResumeText = async (file) => {
    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setResumeText(data.resume_text);
      } else {
        console.error('Error extracting resume text:', data.error);
        setResumeText("");
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setResumeText("");
    } finally {
      setIsExtracting(false);
    }
  };

  const isFormValid = () => {
    return selectedFile && jobTitle.trim() !== "" && companyName.trim() !== "" && jobDescription.trim() !== "" && jobLevel;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    navigate("/setup", { 
      state: { 
        selectedFile: selectedFile,
        jobTitle: jobTitle,
        companyName: companyName,
        jobDescription: jobDescription,
        jobLevel: jobLevel,
        resumeText: resumeText
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      await extractResumeText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full m-0 p-0">
        <div className="flex flex-col items-center">
          <h1 
            onClick={() => navigate("/")}
            className="text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter text-center m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
          >
            MockMate
          </h1>
          <button 
            onClick={() => navigate("/contact")}
            className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap mt-4 px-6 py-2 text-[clamp(0.9rem,2.2vw,1.3rem)]"
          >
            Contact
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-4 text-center">
            <h2 className="text-[clamp(2.5rem,6vw,4rem)] md:text-[clamp(3rem,8vw,5rem)] lg:text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter leading-tight">
              Upload Your Resume
            </h2>
          </div>

          {/* Upload Area */}
          <div className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mx-auto border-2 border-dashed border-[#333333] rounded-xl text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col justify-center items-center"
              style={{ width: '550px', height: '300px', padding: '32px' }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-[#333333] font-inter text-[clamp(1.2rem,3vw,1.8rem)] py-4">
                Drag & Drop or Browse Resume
              </p>
              {isExtracting ? (
                <div className="space-y-2">
                  <p className="text-[#333333] font-inter text-[clamp(1rem,2.5vw,1.5rem)]">
                    Extracting text from resume...
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#333333]"></div>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="space-y-2">
                  <p className="text-[#333333] font-inter text-[clamp(1rem,2.5vw,1.5rem)]">
                    Selected: {selectedFile.name}
                  </p>
                  {resumeText && (
                    <div className="text-[#333333] font-inter text-[clamp(0.9rem,2.2vw,1.3rem)] bg-gray-100 p-3 rounded-lg max-h-32 overflow-y-auto">
                      <strong>Extracted text preview:</strong><br />
                      {resumeText.substring(0, 200)}...
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Job Information */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1rem,2.5vw,1.5rem)] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1rem,2.5vw,1.5rem)] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  placeholder="e.g., Google"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                  Job Level
                </label>
                <select
                  value={jobLevel}
                  onChange={(e) => setJobLevel(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1rem,2.5vw,1.5rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] bg-white"
                >
                  <option value="Intern">Intern</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Lead">Lead/Principal</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-[#333333] font-inter font-bold text-[clamp(1.1rem,2.8vw,1.6rem)]">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-[#333333] rounded-xl font-inter text-[#333333] text-[clamp(1rem,2.5vw,1.5rem)] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                  rows="4"
                  placeholder="Paste the job description here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-center" style={{ marginTop: '60px' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`rounded-[2rem] font-inter font-bold transition-all duration-300 border-0 outline-none shadow-lg whitespace-nowrap px-8 py-4 text-[clamp(1.5rem,4vw,2.5rem)] ${
              isFormValid() 
                ? 'bg-[#D5D5D5] text-[#333333] hover:bg-[#C5C5C5] hover:shadow-xl cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

      </main>
    </div>
  );
}