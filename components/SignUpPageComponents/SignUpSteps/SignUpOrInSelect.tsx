"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface SignUpOrInSelectProps {
  setCurrentStep: (step: number) => void;
}

export default function SignUpOrInSelect({
  setCurrentStep,
}: SignUpOrInSelectProps) {
  const signUpCardRef = useRef<HTMLDivElement>(null);
  const signInCardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Entrance animations
    const tl = gsap.timeline();

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      [signUpCardRef.current, signInCardRef.current],
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
      }
    );

    // Hover animations
    const setupHoverAnimations = (element: HTMLElement) => {
      if (!element) return;

      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.05,
          y: -8,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const cleanupSignUp = setupHoverAnimations(signUpCardRef.current!);
    const cleanupSignIn = setupHoverAnimations(signInCardRef.current!);

    return () => {
      cleanupSignUp?.();
      cleanupSignIn?.();
    };
  }, []);

  const handleSignUpClick = () => {
    gsap.to(signUpCardRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => setCurrentStep(1),
    });
  };

  const handleSignInClick = () => {
    gsap.to(signInCardRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => setCurrentStep(10),
    });
  };

  const handleGoToLandingPage = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* Back to Landing Page Button */}
      <div className="w-full max-w-4xl flex justify-start">
        <button
          onClick={handleGoToLandingPage}
          className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 border border-purple-200 hover:border-purple-300"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>
      {/* Main Heading */}
      <h2
        ref={headingRef}
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
      >
        Welcome! Do you want to create a new account or sign in?
      </h2>

      {/* Decorative element */}
      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

      {/* Action Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Sign Up Card */}
        <div
          ref={signUpCardRef}
          onClick={handleSignUpClick}
          className="group relative bg-white rounded-2xl shadow-xl border-2 border-gray-100 hover:border-purple-300 transition-colors duration-300 cursor-pointer overflow-hidden"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative p-8 flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <UserPlusIcon className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
              Sign Up
            </h3>

            {/* Description */}
            <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed">
              Create a new account to access your dashboard
            </p>

            {/* Button */}
            <button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:translate-y-0 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>
        </div>

        {/* Sign In Card */}
        <div
          ref={signInCardRef}
          onClick={handleSignInClick}
          className="group relative bg-white rounded-2xl shadow-xl border-2 border-gray-100 hover:border-purple-300 transition-colors duration-300 cursor-pointer overflow-hidden"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative p-8 flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <ArrowRightOnRectangleIcon className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
              Sign In
            </h3>

            {/* Description */}
            <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed">
              Already have an account? Log in here
            </p>

            {/* Button */}
            <button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:translate-y-0 shadow-lg hover:shadow-xl">
              Sign In Now
            </button>
          </div>
        </div>
      </div>

      {/* Optional helper text */}
      <p className="text-sm text-gray-500 text-center max-w-lg">
        Choose your preferred option to continue. You can always switch between
        sign up and sign in later.
      </p>
    </div>
  );
}
