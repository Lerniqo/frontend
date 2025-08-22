"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ProgressBar from "@/components/SignUpPageComponents/ProgressBar";
import NavigationSection from "@/components/SignUpPageComponents/NavigationSection";
import Loading from "@/components/CommonComponents/Loading";

// Sign Up Steps Components
import SignUpOrInSelect from "@/components/SignUpPageComponents/SignUpSteps/SignUpOrInSelect";
import UserTypeSelector from "@/components/SignUpPageComponents/SignUpSteps/UserTypeSelector";
import RegisterEmail from "@/components/SignUpPageComponents/SignUpSteps/RegisterEmail";
import ValidateEmail from "@/components/SignUpPageComponents/SignUpSteps/ValidateEmail";
import ProfileDetailsForm from "@/components/SignUpPageComponents/SignUpSteps/ProfileDetailsForm";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("");
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
            onSuccess={() => setCurrentStep(4)}
            setLoading={setLoading}
          />
        );
      case 4:
        return (
          <ProfileDetailsForm
            setLoading={setLoading}
            setCurrentStep={setCurrentStep}
            userType={userType}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Review & Confirm
              </h2>
              <p className="text-gray-600 text-lg">
                Please review your information
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">Review & Confirmation Placeholder</p>
              {userType && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600">
                    Role: <span className="font-medium">{userType}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
          <ProgressBar currentStep={currentStep} />
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
  );
}
