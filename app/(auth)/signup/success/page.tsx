"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function SignupSuccessPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Animation
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown <= 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleContinueToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">🎉 Success!</h1>
          <p className="text-green-100 text-lg">
            Your profile has been completed successfully!
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          <div className="text-center space-y-6">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200">
              <div className="inline-block">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Profile Completed!
              </h2>
              <p className="text-gray-700 mb-4">
                Your account is now ready to use. You can log in and start your
                learning journey.
              </p>

              {/* Redirect Info */}
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to login in{" "}
                <span className="font-bold text-green-600">{countdown}</span>{" "}
                seconds...
              </p>

              <button
                onClick={handleContinueToLogin}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Go to Login Now
              </button>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
              <ul className="space-y-2 text-gray-700 text-left max-w-sm mx-auto">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Log in with your email and password</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <span>Complete your profile picture (optional)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span>Explore learning resources</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <span>Start your personalized learning journey</span>
                </li>
              </ul>
            </div>

            {/* Support Info */}
            <p className="text-gray-600 text-sm">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
