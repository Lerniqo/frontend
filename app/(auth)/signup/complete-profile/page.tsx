"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import Loading from "@/components/CommonComponents/Loading";
import PublicRoute from "@/components/CommonComponents/PublicRoute";
import ProfileDetailsForm from "@/components/SignUpPageComponents/SignUpSteps/ProfileDetailsForm";

function CompleteProfilePageContent() {
  const [loading, setLoading] = useState(false);
  const [_currentStep, setCurrentStep] = useState(4); // For ProfileDetailsForm compatibility
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const role = searchParams.get('role') || '';

  useEffect(() => {
    // Validate required parameters
    if (!userId || !role || (role.toLowerCase() !== 'student' && role.toLowerCase() !== 'teacher')) {
      router.push('/signup');
      return;
    }

    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [userId, role, router]);

  const handleBack = () => {
    // Don't allow going back once email is verified
    // Instead, show a message or redirect to login
    alert("Your email has been verified. Please complete your profile to continue.");
  };

  const handleProfileComplete = () => {
    // This will be called when ProfileDetailsForm completes successfully
    // Redirect to success page
    router.push('/signup/success');
  };

  if (!userId || !role) {
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
          className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-gray-600">
                Tell us more about yourself as a <span className="capitalize font-semibold text-blue-600">{role}</span>
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <ProfileDetailsForm
              setLoading={setLoading}
              setCurrentStep={(step) => {
                if (step === 5) {
                  // Profile completion successful
                  handleProfileComplete();
                } else {
                  setCurrentStep(step);
                }
              }}
              userType={role}
              userId={userId}
            />
          </div>

          {/* Navigation Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-400 cursor-not-allowed font-medium rounded-lg"
                disabled
              >
                ← Back
              </button>
              
              <div className="text-sm text-gray-500">
                Step 3 of 3
              </div>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompleteProfilePageContent />
    </Suspense>
  );
}
