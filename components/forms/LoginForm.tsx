"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

// LoginForm component props interface
interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
  className?: string;
  showSignUpLink?: boolean;
  redirectPath?: string;
}

// Form validation state interface
interface ValidationState {
  email: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
  password: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
}

// Form field state interface
interface FormState {
  email: string;
  password: string;
}

export default function LoginForm({ 
  onSubmit, 
  isLoading = false, 
  className = "", 
  showSignUpLink = true,
  redirectPath = "/Dashboard"
}: LoginFormProps) {
  // State management
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: ""
  });

  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: "", touched: false },
    password: { isValid: false, message: "", touched: false }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Hooks
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const emailFieldRef = useRef<HTMLDivElement>(null);
  const passwordFieldRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const errorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  // Animation entrance effect
  useEffect(() => {
    if (formRef.current) {
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set([emailFieldRef.current, passwordFieldRef.current, submitButtonRef.current], {
        opacity: 0,
        y: 20
      });

      gsap.set(formRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95
      });

      // Animation sequence
      tl.to(formRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      .to([emailFieldRef.current, passwordFieldRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4")
      .to(submitButtonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    
    return { isValid: true, message: "" };
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (!password) {
      return { isValid: false, message: "Password is required" };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters" };
    }
    
    return { isValid: true, message: "" };
  };

  // Handle input changes with validation
  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate field
    let fieldValidation;
    if (field === "email") {
      fieldValidation = validateEmail(value);
    } else {
      fieldValidation = validatePassword(value);
    }
    
    setValidation(prev => ({
      ...prev,
      [field]: {
        ...fieldValidation,
        touched: prev[field].touched || value.length > 0
      }
    }));

    // Animate error message
    const errorRef = errorRefs.current[field];
    if (errorRef) {
      if (!fieldValidation.isValid && fieldValidation.message) {
        gsap.fromTo(errorRef, 
          { opacity: 0, y: -10 }, 
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(errorRef, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }
  };

  // Handle input blur
  const handleInputBlur = (field: keyof FormState) => {
    setValidation(prev => ({
      ...prev,
      [field]: { ...prev[field], touched: true }
    }));
  };

  // Check if form is valid
  const isFormValid = validation.email.isValid && validation.password.isValid;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      let result;
      
      if (onSubmit) {
        result = await onSubmit(formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        setSubmitSuccess(result.message || "Login successful!");
        
        // Animate success
        if (submitButtonRef.current) {
          gsap.to(submitButtonRef.current, {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }

        // Redirect after short delay
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      } else {
        setSubmitError(result.message || "Login failed");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get input field classes based on validation state
  const getInputClasses = (field: keyof FormState) => {
    const baseClasses = "w-full pl-10 sm:pl-12 md:pl-14 pr-4 py-2.5 sm:py-3 md:py-4 border-2 rounded-lg md:rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 placeholder-gray-500 md:placeholder-gray-400 text-sm sm:text-base md:text-lg font-medium";
    
    if (!validation[field].touched) {
      return `${baseClasses} border-white/30 focus:border-blue-400/60 focus:shadow-lg focus:shadow-blue-500/20`;
    }
    
    if (validation[field].isValid) {
      return `${baseClasses} border-green-400/60 shadow-lg shadow-green-500/20`;
    } else {
      return `${baseClasses} border-red-400/60 shadow-lg shadow-red-500/20`;
    }
  };

  return (
    <div className={`mx-auto ${className}`}>
      <div 
        ref={formRef}
        className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full backdrop-blur-xl border border-white/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.2) inset'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-50 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 sm:text-white/85 md:text-white/80 drop-shadow-md font-medium">
            Sign in to your account to continue learning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div ref={emailFieldRef} className="space-y-1.5 sm:space-y-2">
            <label htmlFor="email" className="block text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/95 sm:text-white/90 md:text-white/85 drop-shadow-md">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleInputBlur("email")}
                className={getInputClasses("email")}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={isSubmitting}
                aria-describedby={validation.email.message ? "email-error" : undefined}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              {validation.email.touched && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  {validation.email.isValid ? (
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {validation.email.message && validation.email.touched && (
              <div 
                ref={(el) => { errorRefs.current.email = el; }}
                id="email-error"
                className="text-red-200 md:text-red-100 text-xs sm:text-sm md:text-base font-medium flex items-center space-x-1 drop-shadow-md"
                role="alert"
              >
                <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span>{validation.email.message}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div ref={passwordFieldRef} className="space-y-1.5 sm:space-y-2">
            <label htmlFor="password" className="block text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white/95 sm:text-white/90 md:text-white/85 drop-shadow-md">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleInputBlur("password")}
                className={getInputClasses("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-describedby={validation.password.message ? "password-error" : undefined}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                {validation.password.touched && (
                  <>
                    {validation.password.isValid ? (
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                    ) : (
                      <ExclamationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500" />
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  )}
                </button>
              </div>
            </div>
            {validation.password.message && validation.password.touched && (
              <div 
                ref={(el) => { errorRefs.current.password = el; }}
                id="password-error"
                className="text-red-200 md:text-red-100 text-xs sm:text-sm md:text-base font-medium flex items-center space-x-1 drop-shadow-md"
                role="alert"
              >
                <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span>{validation.password.message}</span>
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-xs sm:text-sm md:text-base text-blue-200 hover:text-blue-100 md:hover:text-white font-medium transition-colors duration-300 hover:underline drop-shadow-md"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 sm:p-4 bg-red-500/20 border border-red-300/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <ExclamationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-300" />
                <p className="text-red-100 text-xs sm:text-sm md:text-base font-medium drop-shadow-sm">{submitError}</p>
              </div>
            </div>
          )}

          {/* Submit Success */}
          {submitSuccess && (
            <div className="p-3 sm:p-4 bg-green-500/20 border border-green-300/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-300" />
                <p className="text-green-100 text-xs sm:text-sm md:text-base font-medium drop-shadow-sm">{submitSuccess}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={!isFormValid || isSubmitting || isLoading}
            className="w-full py-2.5 sm:py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-lg"
          >
            {isSubmitting || isLoading ? (
              <>                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        {showSignUpLink && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
            <p className="text-center text-white/85 sm:text-white/80 md:text-white/75 text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md font-medium">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/SignUp")}
                className="text-blue-200 hover:text-blue-100 md:hover:text-white font-semibold transition-colors duration-300 hover:underline drop-shadow-md"
              >
                Sign up here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}