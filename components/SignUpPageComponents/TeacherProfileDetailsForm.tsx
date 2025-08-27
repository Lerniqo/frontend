"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaSpinner } from "react-icons/fa";
import { TeacherProfileData } from "@/types/auth.types";

interface TeacherProfileDetailsFormProps {
  onSubmit?: (data: TeacherProfileData) => void;
  isLoading?: boolean;
  initialData?: Partial<TeacherProfileData>;
}

export default function TeacherProfileDetailsForm({
  onSubmit,
  isLoading = false,
  initialData = {},
}: TeacherProfileDetailsFormProps) {
  // Form state
  const [formData, setFormData] = useState<TeacherProfileData>({
    fullName: initialData.fullName || "",
    birthday: initialData.birthday || "",
    address: initialData.address || "",
    phoneNumber: initialData.phoneNumber || "",
    nationalIdPassport: initialData.nationalIdPassport || "",
    yearsOfExperience: initialData.yearsOfExperience || 0,
    highestEducationLevel: initialData.highestEducationLevel || "",
    qualifications: initialData.qualifications || "",
    shortBio: initialData.shortBio || "",
  });

  // Error state
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherProfileData, string>>
  >({});

  // Refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Education level options
  const educationLevelOptions = [
    { value: "", label: "Select Education Level (Optional)" },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: "PhD in Chemistry", label: "PhD/Doctorate" },
    { value: "Other", label: "Other" },
  ];

  // Animation effects
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Input validation - only fullName is required
  const validateField = (
    name: keyof TeacherProfileData,
    value: TeacherProfileData[keyof TeacherProfileData]
  ): string => {
    switch (name) {
      case "fullName":
        return !(value as string)?.trim() ? "Full name is required" : "";
      case "phoneNumber":
        if (value && (value as string).trim()) {
          const phoneRegex =
            /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d]{3}[\)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/;
          if (!phoneRegex.test((value as string).replace(/[\s\-\(\)]/g, ""))) {
            return "Please enter a valid phone number";
          }
        }
        return "";
      case "shortBio":
        if (value && (value as string).trim() && (value as string).length > 300) {
          return "Bio must be 300 characters or less";
        }
        return "";
      default:
        return "";
    }
  };

  // Handle input changes
  const handleInputChange = (name: keyof TeacherProfileData, value: TeacherProfileData[keyof TeacherProfileData]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);

      // Animate error removal
      const errorElement = errorRefs.current[name];
      if (errorElement) {
        gsap.to(errorElement, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  // Show error with animation
  const showError = (field: keyof TeacherProfileData, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));

    // Animate error appearance
    setTimeout(() => {
      const errorElement = errorRefs.current[field];
      if (errorElement) {
        gsap.fromTo(
          errorElement,
          {
            opacity: 0,
            height: 0,
          },
          {
            opacity: 1,
            height: "auto",
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof TeacherProfileData, string>> = {};

    // Validate only required fields
    (Object.keys(formData) as (keyof TeacherProfileData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      // Show all errors with staggered animation
      Object.entries(newErrors).forEach(([field, message], index) => {
        setTimeout(() => {
          showError(field as keyof TeacherProfileData, message || "");
        }, index * 100);
      });
      return;
    }

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Button hover animation
  const handleButtonHover = (
    isEntering: boolean,
    element: HTMLButtonElement
  ) => {
    if (isEntering) {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div ref={formRef} className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Complete Your Teacher Profile
          </h2>
          <p className="text-gray-600">Tell us more about yourself to enhance your teaching profile</p>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <div
                  ref={(el) => {
                    errorRefs.current.fullName = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthday
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your address (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter phone number (optional)"
              />
              {errors.phoneNumber && (
                <div
                  ref={(el) => {
                    errorRefs.current.phoneNumber = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            {/* National ID / Passport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID / Passport Number
              </label>
              <input
                type="text"
                value={formData.nationalIdPassport}
                onChange={(e) =>
                  handleInputChange("nationalIdPassport", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter ID or passport number (optional)"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  handleInputChange(
                    "yearsOfExperience",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter years of experience (optional)"
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highest Education Level
              </label>
              <select
                value={formData.highestEducationLevel}
                onChange={(e) =>
                  handleInputChange("highestEducationLevel", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {educationLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qualifications */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            <textarea
              value={formData.qualifications}
              onChange={(e) =>
                handleInputChange("qualifications", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="List your qualifications, certifications, etc. (optional)"
            />
          </div>

          {/* Bio / Teaching Philosophy */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Bio / Teaching Philosophy (Max 300 characters)
            </label>
            <textarea
              value={formData.shortBio}
              onChange={(e) =>
                handleInputChange("shortBio", e.target.value)
              }
              maxLength={300}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Describe your teaching philosophy or background... (optional)"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {(formData.shortBio || "").length}/300
            </div>
            {errors.shortBio && (
              <div
                ref={(el) => {
                  errorRefs.current.shortBio = el;
                }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.shortBio}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onMouseEnter={(e) =>
            !isLoading && handleButtonHover(true, e.currentTarget)
          }
          onMouseLeave={(e) =>
            !isLoading && handleButtonHover(false, e.currentTarget)
          }
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Completing Profile...
            </>
          ) : (
            "Complete Profile"
          )}
        </button>
      </form>
    </div>
  );
}
