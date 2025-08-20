"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import React from "react";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface ProgressBarProps {
  currentStep?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep = 1 }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileProgressRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    { id: 1, label: "User Type", shortLabel: "Type" },
    { id: 2, label: "Account", shortLabel: "Account" },
    { id: 3, label: "Verify Email", shortLabel: "Verify" },
    { id: 4, label: "Profile Details", shortLabel: "Profile" },
    { id: 5, label: "Success", shortLabel: "Success" },
  ];

  // Initialize refs arrays
  useEffect(() => {
    circlesRef.current = circlesRef.current.slice(0, steps.length);
    linesRef.current = linesRef.current.slice(0, steps.length - 1);
    labelsRef.current = labelsRef.current.slice(0, steps.length);
  }, []);

  // GSAP animations when currentStep changes
  useEffect(() => {
    const tl = gsap.timeline();

    steps.forEach((step, index) => {
      const circle = circlesRef.current[index];
      const label = labelsRef.current[index];

      if (!circle || !label) return;

      if (step.id < currentStep) {
        // Completed steps - teal with checkmark
        tl.to(
          circle,
          {
            backgroundColor: "#0d9488", // bg-teal-600
            color: "#ffffff",
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out",
          },
          index * 0.1
        )
          .to(
            circle,
            {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            index * 0.1 + 0.3
          )
          .to(
            label,
            {
              color: "#0d9488",
              fontWeight: "600",
              duration: 0.3,
              ease: "power2.out",
            },
            index * 0.1
          );
      } else if (step.id === currentStep) {
        // Current step - cyan blue background
        tl.to(
          circle,
          {
            backgroundColor: "#0891b2", // bg-cyan-600
            color: "#ffffff",
            scale: 1.2,
            duration: 0.5,
            ease: "power2.out",
          },
          index * 0.1
        )
          .to(
            circle,
            {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            index * 0.1 + 0.5
          )
          .to(
            label,
            {
              color: "#0891b2",
              fontWeight: "700",
              duration: 0.3,
              ease: "power2.out",
            },
            index * 0.1
          );
      } else {
        // Upcoming steps - white with light blue-gray border
        tl.to(
          circle,
          {
            backgroundColor: "#ffffff",
            color: "#64748b", // slate-500
            borderColor: "#cbd5e1", // slate-300
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          index * 0.1
        ).to(
          label,
          {
            color: "#64748b",
            fontWeight: "400",
            duration: 0.3,
            ease: "power2.out",
          },
          index * 0.1
        );
      }
    });

    // Animate connecting lines
    linesRef.current.forEach((line, index) => {
      if (!line) return;

      if (index < currentStep - 1) {
        // Completed connections - teal
        tl.to(
          line,
          {
            backgroundColor: "#0d9488",
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          index * 0.1 + 0.2
        );
      } else {
        // Pending connections - light blue-gray
        tl.to(
          line,
          {
            backgroundColor: "#cbd5e1",
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          index * 0.1
        );
      }
    });

    // Mobile progress bar animation
    if (mobileProgressRef.current) {
      const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
      tl.to(
        mobileProgressRef.current,
        {
          width: `${progressPercentage}%`,
          duration: 0.8,
          ease: "power2.out",
        },
        0
      );
    }

    return () => {
      tl.kill();
    };
  }, [currentStep]);

  const getStepContent = (step: Step, index: number): React.ReactElement => {
    if (step.id < currentStep) {
      return <span className="text-sm font-bold">✓</span>;
    } else {
      return <span className="text-sm font-bold">{step.id}</span>;
    }
  };

  return (
    <div ref={progressBarRef} className="w-full">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  ref={(el) => {
                    circlesRef.current[index] = el;
                  }}
                  className="w-10 h-10 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center font-bold text-slate-500 transition-all duration-300"
                >
                  {getStepContent(step, index)}
                </div>

                {/* Label */}
                <div
                  ref={(el) => {
                    labelsRef.current[index] = el;
                  }}
                  className="text-sm mt-2 text-center text-slate-500 transition-all duration-300 min-w-[80px]"
                >
                  {step.label}
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-1 bg-slate-300 rounded-full">
                    <div
                      ref={(el) => {
                        linesRef.current[index] = el;
                      }}
                      className="h-full bg-slate-300 rounded-full origin-left transform scale-x-0"
                      style={{ transformOrigin: "left center" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden px-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Step {currentStep} of {steps.length}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {steps[currentStep - 1]?.label}
          </p>
        </div>

        <div className="relative">
          {/* Background progress bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            {/* Active progress bar */}
            <div
              ref={mobileProgressRef}
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: "0%" }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step.id < currentStep
                      ? "bg-teal-600 text-white"
                      : step.id === currentStep
                      ? "bg-cyan-600 text-white"
                      : "bg-white border-2 border-slate-300 text-slate-500"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </div>
                <span className="text-xs mt-1 text-slate-500 max-w-[50px] text-center truncate">
                  {step.shortLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 text-center">
        <div className="text-xs text-slate-500">
          {currentStep === steps.length ? (
            <span className="text-teal-600 font-semibold">
              🎉 All steps completed!
            </span>
          ) : (
            <>
              <span className="text-teal-600 font-medium">
                {currentStep - 1}
              </span>
              <span> of </span>
              <span className="font-medium">{steps.length}</span>
              <span> steps completed</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
