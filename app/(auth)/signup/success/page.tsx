"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import PublicRoute from "@/components/CommonComponents/PublicRoute";

export default function SignupSuccessPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const handleContinueToLogin = () => {
    router.push('/login');
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white flex items-center justify-center p-4">
        <div
          ref={cardRef}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Content Section */}
          <div className="p-10">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  🎉 Welcome to Your Learning Journey!
                </h2>
                <p className="text-gray-600 text-lg">
                  Your profile has been completed successfully. You can now access all the features of our platform.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg text-center border border-blue-200">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Registration Complete!
                  </h3>
                  
                  <p className="text-gray-700">
                    You&apos;re all set to start your learning adventure. Your account has been created and verified.
                  </p>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleContinueToLogin}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">What&apos;s Next?</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Login to your new account
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Explore our learning resources
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Connect with teachers and students
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Start your personalized learning journey
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
