"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaSpinner } from "react-icons/fa";
import { StudentProfileData } from "@/types/auth.types";

interface StudentProfileDetailsFormProps {
  onSubmit?: (data: StudentProfileData) => void;
  isLoading?: boolean;
  initialData?: Partial<StudentProfileData>;
}

export default function StudentProfileDetailsForm({
  onSubmit,
  isLoading = false,
  initialData = {},
}: StudentProfileDetailsFormProps) {
  // Form state
  const [formData, setFormData] = useState<StudentProfileData>({
    fullName: initialData.fullName || "",
    school: initialData.school || "",
    birthday: initialData.birthday || "",
    gradeLevel: initialData.gradeLevel || undefined,
    gender: initialData.gender || "",
    parentGuardianName: initialData.parentGuardianName || "",
    relationship: initialData.relationship || "",
    parentContact: initialData.parentContact || "",
    addressCity: initialData.addressCity || "",
    learningGoals: initialData.learningGoals || "",
  });

  // Separate state for grade UI display
  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    // Initialize selectedGrade based on gradeLevel
    if (initialData.gradeLevel !== undefined) {
      const gradeOption = gradeOptions.find(option => option.numericValue === initialData.gradeLevel);
      return gradeOption?.value || "";
    }
    return "";
  });

  // Error state
  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentProfileData, string>>
  >({});

  // Refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Grade options with numeric mapping
  const gradeOptions = [
    { value: "", label: "Select Grade (Optional)", numericValue: undefined },
    { value: "kindergarten", label: "Kindergarten", numericValue: 0 },
    { value: "1", label: "1st Grade", numericValue: 1 },
    { value: "2", label: "2nd Grade", numericValue: 2 },
    { value: "3", label: "3rd Grade", numericValue: 3 },
    { value: "4", label: "4th Grade", numericValue: 4 },
    { value: "5", label: "5th Grade", numericValue: 5 },
    { value: "6", label: "6th Grade", numericValue: 6 },
    { value: "7", label: "7th Grade", numericValue: 7 },
    { value: "8", label: "8th Grade", numericValue: 8 },
    { value: "9", label: "9th Grade", numericValue: 9 },
    { value: "10", label: "10th Grade", numericValue: 10 },
    { value: "11", label: "11th Grade", numericValue: 11 },
    { value: "12", label: "12th Grade", numericValue: 12 },
  ];

  const genderOptions = [
    { value: "", label: "Select Gender (Optional)" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const relationshipOptions = [
    { value: "", label: "Select Relationship (Optional)" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Guardian", label: "Guardian" },
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
    name: keyof StudentProfileData,
    value: StudentProfileData[keyof StudentProfileData]
  ): string => {
    switch (name) {
      case "fullName":
        return !(value as string)?.trim() ? "Full name is required" : "";
      case "parentContact":
        if (value && (value as string).trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex =
            /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d]{3}[\)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/;
          if (
            !emailRegex.test(value as string) &&
            !phoneRegex.test((value as string).replace(/[\s\-\(\)]/g, ""))
          ) {
            return "Please enter a valid email or phone number";
          }
        }
        return "";
      default:
        return "";
    }
  };

  // Convert grade string to numeric gradeLevel
  const convertGradeToNumeric = (gradeString: string): number | undefined => {
    const gradeOption = gradeOptions.find(option => option.value === gradeString);
    return gradeOption?.numericValue;
  };

  // Handle input changes
  const handleInputChange = (name: keyof StudentProfileData, value: StudentProfileData[keyof StudentProfileData]) => {
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

  // Handle grade selection specifically
  const handleGradeChange = (gradeString: string) => {
    setSelectedGrade(gradeString);
    const numericGrade = convertGradeToNumeric(gradeString);
    setFormData((prev) => ({ ...prev, gradeLevel: numericGrade }));
  };

  // Show error with animation
  const showError = (field: keyof StudentProfileData, message: string) => {
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

    const newErrors: Partial<Record<keyof StudentProfileData, string>> = {};

    // Validate only required fields
    (Object.keys(formData) as (keyof StudentProfileData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      // Show all errors with staggered animation
      Object.entries(newErrors).forEach(([field, message], index) => {
        setTimeout(() => {
          showError(field as keyof StudentProfileData, message);
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
    <div ref={formRef}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Complete Your Student Profile
          </h2>
          <p className="text-gray-600">Tell us more about yourself to personalize your learning experience</p>
        </div>

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

        {/* School */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School
          </label>
          <input
            type="text"
            value={formData.school}
            onChange={(e) => handleInputChange("school", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter school name (optional)"
          />
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

        {/* Grade and Gender Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {gradeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Learning Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Goals
          </label>
          <textarea
            value={formData.learningGoals}
            onChange={(e) => handleInputChange("learningGoals", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="What are your learning goals? (optional)"
            rows={3}
          />
        </div>

        {/* Parent/Guardian Information */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Parent/Guardian Information (Optional)
          </h3>

          <div className="space-y-4">
            {/* Parent Name and Relationship Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.parentGuardianName}
                  onChange={(e) =>
                    handleInputChange("parentGuardianName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter parent/guardian name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) =>
                    handleInputChange(
                      "relationship",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Contact (Phone or Email)
              </label>
              <input
                type="text"
                value={formData.parentContact}
                onChange={(e) =>
                  handleInputChange("parentContact", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter phone number or email (optional)"
              />
              {errors.parentContact && (
                <div
                  ref={(el) => {
                    errorRefs.current.parentContact = el;
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.parentContact}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address/City
          </label>
          <input
            type="text"
            value={formData.addressCity}
            onChange={(e) => handleInputChange("addressCity", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter address or city (optional)"
          />
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
