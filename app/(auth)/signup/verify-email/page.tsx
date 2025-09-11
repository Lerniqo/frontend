"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import Loading from "@/components/CommonComponents/Loading";
import PublicRoute from "@/components/CommonComponents/PublicRoute";
import ValidateEmail from "@/components/SignUpPageComponents/SignUpSteps/ValidateEmail";
import { VerifyEmailSuccessData } from "@/types/auth.types";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const role = searchParams.get('role') || '';

  useEffect(() => {
    // Validate required parameters
    if (!email || !role || (role !== 'student' && role !== 'teacher')) {
      router.push('/signup');
      return;
    }

    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [email, role, router]);

  const handleEmailVerificationSuccess = (userData: VerifyEmailSuccessData) => {
    // Validate role consistency
    const normalizedVerifiedRole = userData.role.toLowerCase();
    const normalizedSelectedRole = role.toLowerCase();
    
    if (normalizedVerifiedRole !== normalizedSelectedRole) {
      console.warn(
        `Role mismatch: Selected '${role}' but verified as '${userData.role}'. Using verified role.`
      );
    }
    
    // Redirect to profile completion with user data
    router.push(`/signup/complete-profile?userId=${encodeURIComponent(userData.userId)}&role=${encodeURIComponent(userData.role)}`);
  };

  const handleBack = () => {
    router.push(`/signup/register?role=${encodeURIComponent(role)}`);
  };

  if (!email || !role) {
    return (
      <PublicRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Request</h1>
            <p className="text-gray-600 mb-6">Missing required parameters.</p>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Back to Signup
            </button>
          </div>
        </div>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white flex items-center justify-center p-4">
        {loading && <Loading />}
        <div
          ref={cardRef}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-600">
                We sent a verification code to <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <ValidateEmail
              email={email}
              onSuccess={handleEmailVerificationSuccess}
              setLoading={setLoading}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                ← Back
              </button>
              
              <div className="text-sm text-gray-500">
                Step 2 of 3
              </div>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
