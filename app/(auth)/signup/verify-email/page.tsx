"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { userService } from "@/services/userService";

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const cardRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!code) {
      newErrors.code = "Verification code is required";
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code = "Please enter a valid 6-digit code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (errors.code) {
      setErrors((prev) => ({
        ...prev,
        code: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await userService.verifyEmail(code, email);

      if (response.success) {
        // Store user data for later use (needed for profile not completed scenario)
        const userData = response.data;
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "userRegistrationData",
            JSON.stringify({
              userId: userData.userId,
              role: userData.role,
              email: email,
            })
          );
        }

        // Redirect to complete profile page
        router.push(
          `/signup/complete-profile?userId=${encodeURIComponent(
            userData.userId
          )}&role=${encodeURIComponent(userData.role)}`
        );
      } else {
        // Handle specific errors
        if (
          response.message
            ?.toLowerCase()
            .includes("verification code has expired")
        ) {
          setShowResend(true);
          setErrors({
            code: response.message,
          });
        } else if (
          response.message
            ?.toLowerCase()
            .includes("invalid email or verification code")
        ) {
          setErrors({
            code: "Invalid verification code. Please try again.",
          });
        } else {
          setErrors({
            submit:
              response.message || "Verification failed. Please try again.",
          });
        }
      }
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setResendLoading(true);
    setMessage("");

    try {
      const response = await userService.resendVerificationCode(email);

      if (response.success) {
        setMessage("A new verification code has been sent to your email.");
        setCode("");
        setShowResend(false);
        setErrors({});
      } else {
        setErrors({
          resend:
            response.message || "Failed to resend code. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        resend:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Verify Email</h1>
          <p className="text-blue-100 text-sm">
            We sent a 6-digit code to {email}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Verification Code Field */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            {showResend ? (
              <>
                <p className="text-gray-600 text-sm mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowResend(true)}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Didn't receive it?{" "}
                <span className="text-blue-600 hover:underline">Try again</span>
              </button>
            )}

            {errors.resend && (
              <p className="mt-2 text-sm text-red-600">{errors.resend}</p>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Wrong email?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Start over
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  );
}
