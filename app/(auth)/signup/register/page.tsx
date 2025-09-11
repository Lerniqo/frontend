"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import Loading from "@/components/CommonComponents/Loading";
import PublicRoute from "@/components/CommonComponents/PublicRoute";
import RegisterEmail from "@/components/SignUpPageComponents/SignUpSteps/RegisterEmail";
import { userService } from "@/services/userService";

export default function RegisterPage() {
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || '';

  useEffect(() => {
    // Validate role parameter
    if (!role || (role !== 'student' && role !== 'teacher')) {
      router.push('/signup');
      return;
    }

    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [role, router]);

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleDataChange = (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setFormData(data);
  };

  const handleRegister = async () => {
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const result = await userService.basicRegister({
        email: formData.email,
        password: formData.password,
        role: role as "Student" | "Teacher",
      });

      if (result.success) {
        // Redirect to email verification with email parameter
        router.push(`/signup/verify-email?email=${encodeURIComponent(formData.email)}&role=${encodeURIComponent(role)}`);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/signup');
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-white flex items-center justify-center p-4">
        {loading && <Loading />}
        <div
          ref={cardRef}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Register as a <span className="capitalize font-semibold text-blue-600">{role}</span>
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <RegisterEmail
              onValidationChange={handleValidationChange}
              onDataChange={handleDataChange}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                ← Back
              </button>
              
              <div className="text-sm text-gray-500">
                Step 1 of 3
              </div>
              
              <button
                onClick={handleRegister}
                disabled={!isValid || loading}
                className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 transform ${
                  isValid && !loading
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
