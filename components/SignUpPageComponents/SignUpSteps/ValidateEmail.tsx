"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { userService } from "../../../services/userService";

interface ValidateEmailProps {
  email: string;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function ValidateEmail({
  email,
  setLoading,
  onSuccess,
  onBack,
}: ValidateEmailProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Error message animation
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [error]);

  const handleCodeChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 6) {
      setCode(numericValue);
      // Clear error when user starts typing
      if (error) setError(null);
    }
  };

  const isValidCode = code.length === 6 && /^\d{6}$/.test(code);

  const handleVerifyCode = async () => {
    if (!isValidCode) {
      setError("Code must be exactly 6 digits");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setLoading(true);
      const result = await userService.verifyEmail(email, code);
      setLoading(false);
      if (result.success) {
        // Success animation
        if (successRef.current) {
          gsap.fromTo(
            successRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
        }

        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);

    try {
      const result = await userService.resendVerificationCode(email);

      if (result.success) {
        setResendTimer(30);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidCode && !isLoading) {
      handleVerifyCode();
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        ref={formRef}
        className="bg-white p-8 w-full max-w-md relative overflow-hidden"
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">We've sent a 6-digit code to</p>
            <p className="text-blue-600 font-semibold">{email}</p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Enter Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              maxLength={6}
              className={`w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                error
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              }`}
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              {code.length}/6 digits
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div ref={errorRef} className="mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          <div ref={successRef} className="mb-4 opacity-0">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700 text-sm">
                Email verified successfully!
              </span>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyCode}
            disabled={!isValidCode || isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              !isValidCode || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>

            {resendTimer > 0 ? (
              <p className="text-blue-600 text-sm">
                Resend available in{" "}
                <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          {/* Back Button */}
          {onBack && (
            <div className="mt-6 text-center">
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
              >
                ← Back to previous step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
