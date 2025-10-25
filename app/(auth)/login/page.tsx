"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

function LoginPageContent() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const { login: contextLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileIncompleteMessage, setProfileIncompleteMessage] =
    useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await contextLogin(formData.email, formData.password);

      if (response.success) {
        // Login successful, redirect to dashboard
        // The AuthContext handles the redirect
      } else {
        const message = response.message.toLowerCase();

        // Handle email not verified
        if (message.includes("email not verified")) {
          // Redirect to verify email page
          router.push(
            `/signup/verify-email?email=${encodeURIComponent(
              formData.email
            )}&fromLogin=true`
          );
          return;
        }

        // Handle profile not completed
        if (message.includes("profile not completed")) {
          // The response already contains userId and role from the error response
          if (response.data?.user?.userId && response.data?.user?.role) {
            // Show message
            setProfileIncompleteMessage(true);
            setRedirectCountdown(3);

            console.log("📋 Profile not completed - Countdown starting...");
            console.log("User ID:", response.data.user.userId);
            console.log("Role:", response.data.user.role);

            // Start countdown and redirect
            const interval = setInterval(() => {
              setRedirectCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(interval);
                  // Redirect to complete profile
                  const redirectUrl = `/signup/complete-profile?userId=${encodeURIComponent(
                    response.data!.user.userId
                  )}&role=${encodeURIComponent(response.data!.user.role)}`;
                  console.log("🔄 Redirecting to:", redirectUrl);
                  router.push(redirectUrl);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            console.error("❌ Missing userId or role in response");
            setErrors({
              submit:
                "Unable to retrieve profile information. Please try again.",
            });
          }
          return;
        }

        // Generic login error
        setErrors({
          submit: response.message || "Invalid email or password",
        });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-blue-100">Sign in to your account</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Incomplete Message */}
            {profileIncompleteMessage && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  ⚠️ Please Complete Your Profile
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Your email has been verified. Now you need to complete your
                  profile to access your account.
                </p>
                <p className="text-sm text-yellow-600">
                  Redirecting in {redirectCountdown} seconds...
                </p>
              </div>
            )}
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading || profileIncompleteMessage}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading || profileIncompleteMessage}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  disabled={isLoading || profileIncompleteMessage}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
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
              disabled={isLoading || profileIncompleteMessage}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileIncompleteMessage
                ? "Redirecting..."
                : isLoading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline font-medium"
              disabled={isLoading || profileIncompleteMessage}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
