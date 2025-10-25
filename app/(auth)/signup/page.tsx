"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function SignUpPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    "Student" | "Teacher" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial animation for the card
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleRoleSelect = (role: "Student" | "Teacher") => {
    setSelectedRole(role);
  };

  const handleSignUp = () => {
    if (!selectedRole) return;
    setIsLoading(true);
    router.push(`/signup/register?role=${selectedRole}`);
  };

  const handleSignIn = () => {
    setIsLoading(true);
    router.push("/login");
  };

  const roleOptions = [
    {
      id: "student",
      name: "Student",
      description: "Learn from expert teachers",
      icon: "🎓",
    },
    {
      id: "teacher",
      name: "Teacher",
      description: "Share your knowledge",
      icon: "👨‍🏫",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding with Animated Bubble Background */}
      <div
        ref={leftSideRef}
        className="hidden lg:flex lg:flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden"
        style={{ flex: "4" }}
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
          <div className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        </div>

        {/* Content */}
        <div className="max-w-lg relative z-10">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-6 animate-fade-in-up">
              Welcome to Lerniqo
            </h1>
            <p
              className="text-2xl text-blue-100 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Transform your learning journey with personalized education and
              expert guidance
            </p>
          </div>

          {/* Stats or Features */}
          <div
            className="grid grid-cols-3 gap-6 mt-16 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200 text-sm">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200 text-sm">Success Rate</div>
            </div>
          </div>

          {/* Floating badges */}
          <div
            className="mt-16 flex flex-wrap gap-3 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Interactive Learning
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Live Sessions
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              AI-Powered
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              Certificate Programs
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div
        className="w-full lg:flex-1 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 sm:p-8"
        style={{ flex: "3" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Lerniqo
            </h1>
            <p className="text-gray-600">Start your learning journey today</p>
          </div>

          {/* Role Selection Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Choose Your Path
            </h2>
            <p className="text-gray-500 mb-8 text-base">
              Select your role to personalize your experience
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleRoleSelect(option.name as "Student" | "Teacher")
                  }
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 text-left overflow-hidden ${
                    selectedRole === option.name
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 shadow-xl shadow-blue-200/50 scale-105"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-gray-200/50 hover:scale-105"
                  }`}
                >
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${
                      selectedRole === option.name
                        ? "opacity-100"
                        : "group-hover:opacity-50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
                  </div>

                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`text-5xl mb-3 transition-all duration-500 ${
                        selectedRole === option.name
                          ? "scale-110 rotate-12"
                          : "group-hover:scale-110 group-hover:rotate-6"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <h3
                      className={`text-xl font-bold mb-1.5 transition-all duration-300 ${
                        selectedRole === option.name
                          ? "text-blue-600"
                          : "text-gray-700 group-hover:text-blue-500"
                      }`}
                    >
                      {option.name}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        selectedRole === option.name
                          ? "text-blue-500 font-medium"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>

                  {/* Selection Indicator with Pulse */}
                  <div
                    className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedRole === option.name
                        ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-300/50"
                        : "border-gray-300 group-hover:border-blue-400 group-hover:bg-blue-50"
                    }`}
                  >
                    {selectedRole === option.name && (
                      <svg
                        className="w-3.5 h-3.5 text-white animate-scale-in"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Corner Accent */}
                  {selectedRole === option.name && (
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tl-2xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleSignUp}
              disabled={!selectedRole || isLoading}
              className="w-full group relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
            >
              {/* Animated Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Hover background pulse */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Button text with animation */}
              <span className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg
                      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 py-1 bg-gray-50 text-gray-500 font-semibold rounded-full border border-gray-200">
                  Already have an account?
                </span>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full group relative bg-white text-gray-700 font-bold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/50 overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Button text with animation */}
              <span className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span>Sign In</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-8">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
