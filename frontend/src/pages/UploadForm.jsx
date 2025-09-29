
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/setup");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full m-0 p-0">
        <h1 
          onClick={() => navigate("/")}
          className="text-[80px] font-bold text-[#333333] font-inter text-center m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
        >
          MockMate
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-4 text-center">
            <h2 className="text-[4rem] md:text-[5rem] lg:text-[6rem] font-bold text-[#333333] font-inter leading-tight">
              Upload Your Resume
            </h2>
          </div>

          {/* Upload Area */}
          <div className="space-y-3 mb-24">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mx-auto border-2 border-dashed border-[#333333] rounded-xl text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col justify-center items-center"
              style={{ width: '550px', height: '550px', padding: '32px' }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-[#333333] font-inter text-[25px] py-4">
                Drag & Drop or Browse
              </p>
              {selectedFile && (
                <p className="text-[#333333] font-inter text-[25px] mt-2 py-20">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full flex justify-center" style={{ marginTop: '60px' }}>
          <button
            onClick={handleSubmit}
            className="bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold hover:bg-[#C5C5C5] transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ padding: '10px 35px', fontSize: '32px' }}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}