"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface RegisterEmailProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onNext?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type PasswordStrength = "weak" | "medium" | "strong";

export default function RegisterEmail({
  onValidationChange,
  onDataChange,
  onNext,
}: RegisterEmailProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>("weak");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs for GSAP animations
  const formRef = useRef<HTMLDivElement>(null);
  const errorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const strengthBarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (pwd: string): boolean => {
    return pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*]/.test(pwd);
  };

  const doPasswordsMatch = (pwd: string, confirm: string): boolean => {
    return pwd === confirm && pwd !== "";
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthWidth = (strength: PasswordStrength): string => {
    switch (strength) {
      case "weak":
        return "w-1/3";
      case "medium":
        return "w-2/3";
      case "strong":
        return "w-full";
      default:
        return "w-0";
    }
  };

  // Validation logic
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        return undefined;

      case "password":
        if (!value) return "Password is required";
        if (!isPasswordValid(value)) {
          return "Password must be at least 8 characters with 1 number and 1 special character";
        }
        return undefined;

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (!doPasswordsMatch(formData.password, value)) {
          return "Passwords do not match";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Calculate password strength for password field
    if (field === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);

      // Animate strength bar
      if (strengthBarRef.current) {
        gsap.to(strengthBarRef.current, {
          width:
            strength === "weak"
              ? "33%"
              : strength === "medium"
              ? "66%"
              : "100%",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    // Validate field and update errors
    const fieldError = validateField(field, value);
    const newErrors = { ...errors };

    if (fieldError) {
      newErrors[field as keyof FormErrors] = fieldError;
    } else {
      delete newErrors[field as keyof FormErrors];
    }

    // Special case for confirmPassword - also validate when password changes
    if (field === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      if (confirmError) {
        newErrors.confirmPassword = confirmError;
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);

    // Animate error messages
    const errorRef = errorRefs.current[field];
    if (errorRef) {
      if (fieldError) {
        gsap.fromTo(
          errorRef,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(errorRef, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }

    // Check overall form validity
    const formValid =
      isValidEmail(newFormData.email) &&
      isPasswordValid(newFormData.password) &&
      doPasswordsMatch(newFormData.password, newFormData.confirmPassword);

    setIsFormValid(formValid);

    // Notify parent components
    onValidationChange?.(formValid);
    onDataChange?.(newFormData);
  };

  // Component mount animation
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // Tooltip animations
  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);

    if (tooltipRef.current) {
      if (!showTooltip) {
        gsap.fromTo(
          tooltipRef.current,
          { opacity: 0, scale: 0.8, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(tooltipRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 10,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  };

  return (
    <div
      ref={formRef}
      className="max-w-md mx-auto p-8 bg-white rounded-2xl border border-blue-200"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600">Enter your credentials to get started</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-1 ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <div
              ref={(el) => {
                errorRefs.current.email = el;
              }}
              className="text-red-500 text-sm font-medium flex items-center space-x-1"
            >
              <span>⚠️</span>
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <button
              type="button"
              onClick={handleTooltipToggle}
              className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Password Requirements Tooltip */}
          {showTooltip && (
            <div
              ref={tooltipRef}
              className="bg-gray-800 text-white text-xs rounded-lg p-3 mb-2 shadow-lg"
            >
              <p className="font-semibold mb-1">Password Requirements:</p>
              <ul className="space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains at least 1 number</li>
                <li>• Contains at least 1 special character (!@#$%^&*)</li>
              </ul>
            </div>
          )}

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-1 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Password Strength:
                </span>
                <span
                  className={`text-xs font-bold capitalize ${
                    passwordStrength === "weak"
                      ? "text-red-500"
                      : passwordStrength === "medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  ref={strengthBarRef}
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                    passwordStrength
                  )} ${getStrengthWidth(passwordStrength)}`}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <div
              ref={(el) => {
                errorRefs.current.password = el;
              }}
              className="text-red-500 text-sm font-medium flex items-center space-x-1"
            >
              <span>⚠️</span>
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-1 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div
              ref={(el) => {
                errorRefs.current.confirmPassword = el;
              }}
              className="text-red-500 text-sm font-medium flex items-center space-x-1"
            >
              <span>⚠️</span>
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Form Status Indicator */}
        <div className="pt-4">
          {isFormValid && (
            <div className="text-green-600 text-sm font-medium flex items-center space-x-2">
              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
              <span>All fields are valid! Ready to continue.</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
