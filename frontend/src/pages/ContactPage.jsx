import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfessionalDesign.css";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      description: "kevin.bui061@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 pb-32">
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
      <main className="container py-12 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions about MockMate? We're here to help you succeed in your interview preparation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{info.title}</h3>
                      <p className="text-slate-700">{info.description}</p>
                      <p className="text-sm text-slate-600">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links - Removed to prevent routing errors */}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-slate-600 mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>
                
                <div className="card-body">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                      <p className="text-slate-600">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                          placeholder="How can we help you?"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="form-input resize-none"
                          placeholder="Tell us more about your question or feedback..."
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/")}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 mt-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-600">
                Find quick answers to common questions about MockMate
              </p>
            </div>

            <div className="space-y-6 mb-24">
              {[
                {
                  question: "How does MockMate work?",
                  answer: "MockMate uses advanced AI to generate personalized interview questions based on your resume and target job description. You can practice with voice recognition and receive detailed feedback on your responses."
                },
                {
                  question: "Can I practice for specific companies?",
                  answer: "Absolutely! You can specify the company you're interviewing with, and our AI will tailor questions based on that company's interview style and requirements."
                },
                {
                  question: "How accurate is the AI feedback?",
                  answer: "Our AI feedback is based on thousands of successful interview patterns and industry best practices. While it's not a substitute for human feedback, it provides valuable insights for improvement."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Spacer */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}