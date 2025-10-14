"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Headphones,
  CheckCircle,
} from "lucide-react";

export default function HelpAndSupportPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <header className="text-center mb-12 mt-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <HelpCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent mb-4">
              Help & Support
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you succeed in your learning journey
            </p>
          </header>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Live Chat */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-700">
                    Live Support
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 0 ? "scale-110" : ""
                  }`}
                >
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get instant help from our support team
                  </p>
                </div>
              </div>
              <p className="text-blue-600 font-semibold">Available 24/7</p>
            </div>

            {/* Phone Support */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-700">
                    Phone Support
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 1 ? "scale-110" : ""
                  }`}
                >
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Speak directly with our experts
                  </p>
                </div>
              </div>
              <p className="text-green-600 font-semibold">+1 (555) 123-4567</p>
            </div>

            {/* Email Support */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-purple-700">
                    Email Support
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 2 ? "scale-110" : ""
                  }`}
                >
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Email Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Send us detailed questions
                  </p>
                </div>
              </div>
              <p className="text-purple-600 font-semibold">
                support@lerniqo.com
              </p>
            </div>

            {/* Documentation */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-yellow-700">
                    Documentation
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 3 ? "scale-110" : ""
                  }`}
                >
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Documentation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browse our comprehensive guides
                  </p>
                </div>
              </div>
              <p className="text-yellow-600 font-semibold">Self-service help</p>
            </div>

            {/* Video Tutorials */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-red-700">
                    Video Tutorials
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 4 ? "scale-110" : ""
                  }`}
                >
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Video Tutorials
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Watch step-by-step guides
                  </p>
                </div>
              </div>
              <p className="text-red-600 font-semibold">Learn visually</p>
            </div>

            {/* FAQ */}
            <div
              className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(5)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-4 left-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-cyan-700">
                    FAQ
                  </span>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-4 mb-4">
                <div
                  className={`p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl transition-transform duration-300 ${
                    hoveredCard === 5 ? "scale-110" : ""
                  }`}
                >
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">FAQ</h3>
                  <p className="text-gray-600 text-sm">
                    Find answers to common questions
                  </p>
                </div>
              </div>
              <p className="text-cyan-600 font-semibold">Quick answers</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300 mb-8">
            <div className="absolute top-4 left-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-purple-700">
                  FAQ
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    How do I reset my password?
                  </h3>
                  <p className="text-gray-600">
                    You can reset your password by clicking on the "Forgot
                    Password" link on the login page and following the
                    instructions sent to your email.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    How do I track my learning progress?
                  </h3>
                  <p className="text-gray-600">
                    Your progress is automatically tracked and can be viewed in
                    your dashboard. You can also check your achievements page
                    for detailed milestones.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Can I access courses offline?
                  </h3>
                  <p className="text-gray-600">
                    Some course materials can be downloaded for offline access.
                    Look for the download icon next to eligible content.
                  </p>
                </div>
                <div className="pb-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    How do I contact my teacher?
                  </h3>
                  <p className="text-gray-600">
                    You can message your teachers directly through the
                    platform's messaging system or join virtual office hours as
                    scheduled.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="group relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
            <div className="absolute top-4 left-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-purple-700">
                  Contact Form
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send us a message
              </h2>

              {/* Loading Overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                  <div className="text-center">
                    {/* Main spinning circle */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin">
                        <div className="absolute inset-0 border-4 border-t-purple-500 border-r-violet-400 border-b-purple-300 border-l-violet-300 rounded-full animate-spin"></div>
                      </div>
                      {/* Inner pulsing dot */}
                      <div className="absolute inset-4 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full animate-pulse shadow-lg"></div>
                      {/* Outer spinning rings */}
                      <div
                        className="absolute -inset-2 border-2 border-transparent rounded-full animate-spin"
                        style={{
                          animationDuration: "2s",
                          animationDirection: "reverse",
                        }}
                      >
                        <div className="absolute inset-0 border-2 border-t-transparent border-r-purple-200 border-b-transparent border-l-violet-200 rounded-full"></div>
                      </div>
                    </div>

                    {/* Loading text */}
                    <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent animate-pulse mb-2">
                      Sending your message...
                    </p>
                    <div className="flex justify-center space-x-1">
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {isSubmitted && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/95 to-emerald-50/95 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                  <div className="text-center">
                    {/* Success Icon */}
                    <div className="relative mx-auto mb-6 flex items-center justify-center w-20 h-20">
                      {/* Success rings - positioned absolutely to center perfectly */}
                      <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute inset-0 w-20 h-20 border-2 border-emerald-300 rounded-full animate-pulse opacity-20"></div>

                      {/* Main success icon */}
                      <div className="relative z-10 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Success text */}
                    <div className="animate-fadeIn">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-lg text-gray-600 mb-1">
                        Your message has been submitted successfully
                      </p>
                      <p className="text-sm text-gray-500">
                        We'll get back to you quickly!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className={`transition-opacity duration-300 ${
                  isSubmitting || isSubmitted ? "opacity-50" : "opacity-100"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform hover:scale-[1.02] transition-transform duration-200">
                    <label className="block text-gray-700 font-medium text-sm mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting || isSubmitted}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300 disabled:opacity-50"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="transform hover:scale-[1.02] transition-transform duration-200">
                    <label className="block text-gray-700 font-medium text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting || isSubmitted}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="mt-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting || isSubmitted}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300 disabled:opacity-50"
                    placeholder="What can we help you with?"
                  />
                </div>
                <div className="mt-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <label className="block text-gray-700 font-medium text-sm mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting || isSubmitted}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300 disabled:opacity-50"
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
