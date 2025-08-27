"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ProgressBar from "@/components/SignUpPageComponents/ProgressBar";
import NavigationSection from "@/components/SignUpPageComponents/NavigationSection";
import Loading from "@/components/CommonComponents/Loading";
import PublicRoute from "@/components/CommonComponents/PublicRoute";
import { VerifyEmailSuccessData } from "@/types/auth.types";

// Sign Up Steps Components
import SignUpOrInSelect from "@/components/SignUpPageComponents/SignUpSteps/SignUpOrInSelect";
import UserTypeSelector from "@/components/SignUpPageComponents/SignUpSteps/UserTypeSelector";
import RegisterEmail from "@/components/SignUpPageComponents/SignUpSteps/RegisterEmail";
import ValidateEmail from "@/components/SignUpPageComponents/SignUpSteps/ValidateEmail";
import ProfileDetailsForm from "@/components/SignUpPageComponents/SignUpSteps/ProfileDetailsForm";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [verifiedUserId, setVerifiedUserId] = useState("");
  const [step2Valid, setStep2Valid] = useState(false);
  const [step2Data, setStep2Data] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  // Updated step descriptions for the new two-step flow
  const stepDescriptions = [
    "Welcome",           // Step 0: Welcome/Selection
    "Choose Role",       // Step 1: User type selection
    "Basic Info",        // Step 2: Email & password registration
    "Verify Email",      // Step 3: Email verification
    "Complete Profile",  // Step 4: Profile completion
    "Welcome!"           // Step 5: Success
  ];

  const totalSteps = 5;

  useEffect(() => {
    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Initialize progress bar as hidden if currentStep is 0
    if (currentStep === 0 && progressBarRef.current) {
      gsap.set(progressBarRef.current, {
        opacity: 0,
        height: 0,
        overflow: "hidden",
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
      });
    }

    // Initialize navigation as hidden if currentStep is 0 or 10
    if ((currentStep === 0 || currentStep === 10) && navigationRef.current) {
      gsap.set(navigationRef.current, {
        opacity: 0,
        height: 0,
        overflow: "hidden",
        paddingTop: 0,
        paddingBottom: 0,
      });
    }
  }, [currentStep]);

  // Handle progress bar visibility animation
  useEffect(() => {
    if (!progressBarRef.current) return;

    if (currentStep === 0) {
      // Hide progress bar
      gsap.to(progressBarRef.current, {
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { overflow: "hidden" });
          }
        },
      });
    } else if (currentStep === 1) {
      // Show progress bar
      gsap.set(progressBarRef.current, { overflow: "visible" });
      gsap.to(progressBarRef.current, {
        opacity: 1,
        height: "auto",
        paddingTop: "1.5rem", // p-6 equivalent
        paddingBottom: "1.5rem",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [currentStep]);

  // Handle navigation section visibility animation
  useEffect(() => {
    if (!navigationRef.current) return;

    if (currentStep === 0 || currentStep === 10) {
      // Hide navigation section
      gsap.to(navigationRef.current, {
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (navigationRef.current) {
            gsap.set(navigationRef.current, { overflow: "hidden" });
          }
        },
      });
    } else {
      // Show navigation section
      gsap.set(navigationRef.current, { overflow: "visible" });
      gsap.to(navigationRef.current, {
        opacity: 1,
        height: "auto",
        paddingTop: "1.5rem", // py-6 equivalent
        paddingBottom: "1.5rem",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [currentStep]);

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
    setUserType(selectedRole);
  };

  const handleStep2ValidationChange = (isValid: boolean) => {
    setStep2Valid(isValid);
  };

  const handleStep2DataChange = (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setStep2Data(data);
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
    
    // Proceed to profile completion step
    setCurrentStep(4);
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
      case 2:
        return (
          <RegisterEmail
            onValidationChange={handleStep2ValidationChange}
            onDataChange={handleStep2DataChange}
          />
        );
      case 3:
        return (
          <ValidateEmail
            email={step2Data.email}
            onSuccess={handleEmailVerificationSuccess}
            setLoading={setLoading}
          />
        );
      case 4:
        return (
          <ProfileDetailsForm
            setLoading={setLoading}
            setCurrentStep={setCurrentStep}
            userType={userType}
            userId={verifiedUserId || userId} // Use verifiedUserId with fallback
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🎉 Welcome to Your Learning Journey!
              </h2>
              <p className="text-gray-600 text-lg">
                Your profile has been completed successfully. You can now access all the features of our platform.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg text-center border border-green-200">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Registration Complete!
                </h3>
                <p className="text-green-700">
                  You&apos;re all set to start your learning adventure as a <span className="font-semibold capitalize">{userType}</span>.
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/Login'}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        {loading && <Loading />}
        <div
          ref={cardRef}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Progress Bar Section */}
          <div
            ref={progressBarRef}
            className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-100"
          >
            <ProgressBar 
              currentStep={currentStep} 
              stepDescriptions={stepDescriptions}
            />
          </div>

          {/* Content Section */}
          <div className="p-10">
            <div ref={contentRef} className="min-h-[400px]">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation Section */}
          <NavigationSection
            ref={navigationRef}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={totalSteps}
            animateStepTransition={animateStepTransition}
            isStep2Valid={step2Valid}
            setLoading={setLoading}
            step2Data={step2Data}
            userType={userType}
          />
        </div>
      </div>
    </PublicRoute>
  );
}
