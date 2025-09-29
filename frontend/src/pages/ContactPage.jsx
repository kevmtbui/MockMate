import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full m-0 p-0">
          <h1 
            onClick={() => navigate("/")}
            className="text-[clamp(4rem,10vw,6rem)] font-bold text-[#333333] font-inter text-center m-0 p-0 cursor-pointer hover:text-[#555555] transition-colors"
          >
            MockMate
          </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center px-8 pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h2 className="text-[#333333] font-inter font-bold text-[clamp(1.5rem,4vw,2.5rem)]">
              Contact Us
            </h2>
            <p className="text-[#333333] font-inter text-[20px] max-w-2xl mx-auto">
              Have questions about MockMate? Need help with your interview preparation? 
              We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-xl p-8 border-2 border-[#333333]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[#333333] font-inter font-bold text-[18px] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-[#333333] rounded-lg p-4 font-inter text-[#333333] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-[#333333] font-inter font-bold text-[18px] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-[#333333] rounded-lg p-4 font-inter text-[#333333] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-[#333333] font-inter font-bold text-[18px] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-[#333333] rounded-lg p-4 font-inter text-[#333333] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[#333333] font-inter font-bold text-[18px] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full border-2 border-[#333333] rounded-lg p-4 font-inter text-[#333333] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#333333] resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-[#D5D5D5] text-[#333333] rounded-[2rem] font-inter font-bold transition-all duration-300 border-0 outline-none shadow-lg hover:shadow-xl whitespace-nowrap ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#C5C5C5]'
                  }`}
                  style={{ padding: '15px 40px', fontSize: '24px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="text-center p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                  <p className="text-green-800 font-inter text-[18px] font-bold">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="space-y-2">
              <h3 className="text-[#333333] font-inter font-bold text-[24px]">Email</h3>
              <p className="text-[#333333] font-inter text-[18px]">kevin.bui061@gmail.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
