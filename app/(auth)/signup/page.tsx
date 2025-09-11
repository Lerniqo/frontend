"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import Loading from "@/components/CommonComponents/Loading";
import PublicRoute from "@/components/CommonComponents/PublicRoute";

// Sign Up Steps Components
import SignUpOrInSelect from "@/components/SignUpPageComponents/SignUpSteps/SignUpOrInSelect";
import UserTypeSelector from "@/components/SignUpPageComponents/SignUpSteps/UserTypeSelector";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [loading, _setLoading] = useState(false);

  useEffect(() => {
    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const animateStepTransition = (direction: "forward" | "backward") => {
    if (!contentRef.current) return;

    const tl = gsap.timeline();

    // Fade out current content
    tl.to(contentRef.current, {
      opacity: 0,
      x: direction === "forward" ? -30 : 30,
      duration: 0.3,
      ease: "power2.in",
    });

    // Fade in new content
    tl.to(contentRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleSelectRole = (selectedRole: string) => {
    // Only allow student and teacher roles
    if (selectedRole.toLowerCase() !== 'student' && selectedRole.toLowerCase() !== 'teacher') {
      alert('Only students and teachers can register. Admin accounts are created by administrators.');
      return;
    }
    
    setUserType(selectedRole);
    // Redirect to registration page with role parameter
    router.push(`/signup/register?role=${encodeURIComponent(selectedRole.toLowerCase())}`);
  };

  const handleEmailVerificationSuccess = (userData: VerifyEmailSuccessData) => {
    // Store the verification data
    setVerifiedUserId(userData.userId);
    setUserId(userData.userId); // For backward compatibility
    
    // Validate role consistency
    const normalizedVerifiedRole = userData.role.toLowerCase();
    const normalizedSelectedRole = userType.toLowerCase();
    
    if (normalizedVerifiedRole !== normalizedSelectedRole) {
      console.warn(
        `Role mismatch: Selected '${userType}' but verified as '${userData.role}'. Using verified role.`
      );
      // Update userType to match verified role for consistency
      setUserType(userData.role);
    } else {
      console.warn(`Role verification successful: ${userData.role}`);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 1) {
      animateStepTransition("backward");
      setTimeout(() => {
        setCurrentStep(0);
      }, 300);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <SignUpOrInSelect setCurrentStep={setCurrentStep} />;
      case 1:
        return (
          <div className="space-y-6">
            <UserTypeSelector
              onSelectRole={handleSelectRole}
              initialSelection={userType}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    if (currentStep === 0) return null;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            ← Back
          </button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of 2
          </div>
          
          {userType && (
            <button
              onClick={() => handleSelectRole(userType)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white flex items-center justify-center p-4">
        {loading && <Loading />}
        <div
          ref={cardRef}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Content Section */}
          <div className="p-10">
            <div ref={contentRef} className="min-h-[400px]">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation Section */}
          {renderNavigation()}
        </div>
      </div>
    </PublicRoute>
  );
}
