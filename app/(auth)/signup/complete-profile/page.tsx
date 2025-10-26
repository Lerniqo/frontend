"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { userService } from "@/services/userService";
import { StudentProfileData, TeacherProfileData } from "@/types/auth.types";

function CompleteProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const role = searchParams.get("role") as "Student" | "Teacher" | null;
  const cardRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<
    Partial<StudentProfileData & TeacherProfileData>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Memoize bubble colors to prevent re-initialization on state changes
  const bubbleColors = useMemo(
    () => ["#ffffff", "#8b5cf6", "#a78bfa", "#ede9fe", "#f3e8ff"],
    []
  );

  // Redirect if no valid userId or role
  useEffect(() => {
    if (!userId || !role || !["Student", "Teacher"].includes(role)) {
      router.push("/signup");
    }
  }, [userId, role, router]);

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

    if (!formData.fullName || formData.fullName.trim().length === 0) {
      newErrors.fullName = "Full name is required";
    } else if (
      formData.fullName.trim().length < 2 ||
      formData.fullName.trim().length > 100
    ) {
      newErrors.fullName = "Full name must be between 2 and 100 characters";
    }

    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required";
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        const adjustedAge = age - 1;
        if (role === "Student" && (adjustedAge < 5 || adjustedAge > 25)) {
          newErrors.birthday = "Student age must be between 5 and 25 years";
        } else if (
          role === "Teacher" &&
          (adjustedAge < 21 || adjustedAge > 80)
        ) {
          newErrors.birthday = "Teacher age must be between 21 and 80 years";
        }
      } else {
        if (role === "Student" && (age < 5 || age > 25)) {
          newErrors.birthday = "Student age must be between 5 and 25 years";
        } else if (role === "Teacher" && (age < 21 || age > 80)) {
          newErrors.birthday = "Teacher age must be between 21 and 80 years";
        }
      }
    }

    if (role === "Student") {
      if (!formData.gradeLevel) {
        newErrors.gradeLevel = "Grade level is required";
      } else if (formData.gradeLevel < 1 || formData.gradeLevel > 12) {
        newErrors.gradeLevel = "Grade level must be between 1 and 12";
      }

      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }
    } else if (role === "Teacher") {
      if (!formData.address || formData.address.trim().length === 0) {
        newErrors.address = "Address is required";
      } else if (
        formData.address.trim().length < 10 ||
        formData.address.trim().length > 500
      ) {
        newErrors.address = "Address must be between 10 and 500 characters";
      }

      if (!formData.phoneNumber || formData.phoneNumber.trim().length === 0) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^09\d{8}$/.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber =
          "Please enter a valid phone number (09xxxxxxxxx)";
      }

      if (
        !formData.nationalIdPassport ||
        formData.nationalIdPassport.trim().length === 0
      ) {
        newErrors.nationalIdPassport = "National ID/Passport is required";
      } else if (
        formData.nationalIdPassport.trim().length < 5 ||
        formData.nationalIdPassport.trim().length > 50
      ) {
        newErrors.nationalIdPassport =
          "National ID/Passport must be between 5 and 50 characters";
      }

      if (
        formData.yearsOfExperience === undefined ||
        formData.yearsOfExperience === null
      ) {
        newErrors.yearsOfExperience = "Years of experience is required";
      } else if (
        formData.yearsOfExperience < 0 ||
        formData.yearsOfExperience > 50
      ) {
        newErrors.yearsOfExperience =
          "Years of experience must be between 0 and 50";
      }

      if (
        !formData.highestEducationLevel ||
        formData.highestEducationLevel.trim().length === 0
      ) {
        newErrors.highestEducationLevel = "Highest education level is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;

    // Convert gradeLevel and yearsOfExperience to numbers
    if ((name === "gradeLevel" || name === "yearsOfExperience") && value) {
      processedValue = Number(value);
      console.error(
        `Converting ${name}: "${value}" -> ${processedValue} (type: ${typeof processedValue})`
      );
    } else if (type === "number" && value) {
      processedValue = Number(value);
    } else if (!value && type === "number") {
      processedValue = undefined;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: processedValue };
      console.error(`Form state after ${name} change:`, updated);
      return updated;
    });
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
    if (!userId || !role) return;

    setIsLoading(true);

    try {
      // Clean up undefined values from formData
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      console.error("Original formData:", formData);
      console.error("Cleaned formData:", cleanedFormData);
      console.error(
        "gradeLevel type in cleaned:",
        typeof cleanedFormData.gradeLevel,
        "value:",
        cleanedFormData.gradeLevel
      );

      const response = await userService.completeProfile(
        cleanedFormData as unknown as StudentProfileData | TeacherProfileData,
        userId
      );

      if (response.success) {
        // Redirect to success page
        router.push("/signup/success");
      } else {
        setErrors({
          submit:
            response.message || "Failed to complete profile. Please try again.",
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

  if (!userId || !role) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] overflow-hidden text-gray-900">
      {/* Bubble Background */}
      <BubbleCanvas
        className="absolute inset-0 z-0"
        bubbleCount={36}
        colors={bubbleColors}
        minSize={18}
        maxSize={56}
        maxSpeed={0.6}
        blurPx={2}
      />

      {/* Left content (4/7 width) */}
      <div className="flex-[4] flex flex-col justify-center items-start text-white p-10 relative z-10">
        <div className="absolute top-8 left-10 flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-white/25 backdrop-blur-md text-[#6d28d9] text-2xl font-extrabold shadow-lg rounded-xl">
            L
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">
            Lerniqo
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl font-extrabold mb-4 text-white">
            Complete Your <span className="text-white">Profile</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            {role === "Student"
              ? "Let us know more about you! Fill in your profile information to personalize your learning experience and get started with Lerniqo."
              : "Help us get to know you better! Complete your profile to establish your teaching credentials and start making an impact on student learning."}
          </p>
        </div>
      </div>

      {/* Right content (3/7 width) */}
      <div
        ref={cardRef}
        className="flex-[3] relative flex flex-col z-20 h-screen bg-white/98 backdrop-blur-md shadow-2xl border-l border-white/40 overflow-hidden"
      >
        {/* Enhanced gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9]/4 via-[#7c3aed]/2 to-[#a78bfa]/3 pointer-events-none"></div>

        {/* Top decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#a78bfa]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Scrollable content area */}
        <div className="relative z-10 flex-1 overflow-y-auto px-12 pt-12 pb-8">
          {/* Header section */}
          <div className="mb-12">
            <h2 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent text-center leading-tight">
              Complete Profile
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] rounded-full mx-auto mb-6"></div>
            <p className="text-[#6b7280] text-center text-base font-medium">
              {role === "Student"
                ? "Tell us about yourself to personalize your learning experience"
                : "Share your professional details to establish your teaching profile"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="group">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 placeholder:text-[#d1d5db]"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.fullName}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div className="group">
              <label
                htmlFor="birthday"
                className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
              >
                Birthday <span className="text-red-500">*</span>
              </label>
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              />
              {errors.birthday && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.birthday}
                </p>
              )}
            </div>

            {/* Student-specific fields */}
            {role === "Student" && (
              <>
                {/* Grade Level */}
                <div className="group">
                  <label
                    htmlFor="gradeLevel"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236d28d9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: `right 0.75rem center`,
                      backgroundSize: `1.5em 1.5em`,
                    }}
                  >
                    <option value="">Select grade level</option>
                    {Array.from({ length: 6 }, (_, i) => i + 6).map((grade) => (
                      <option key={grade} value={String(grade)}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                  {errors.gradeLevel && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.gradeLevel}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="group">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236d28d9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: `right 0.75rem center`,
                      backgroundSize: `1.5em 1.5em`,
                    }}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.gender}
                    </p>
                  )}
                </div>

                {/* School (Optional) */}
                <div className="group">
                  <label
                    htmlFor="school"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    School
                  </label>
                  <input
                    id="school"
                    type="text"
                    name="school"
                    value={formData.school || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 placeholder:text-[#d1d5db]"
                    placeholder="Your school name (optional)"
                  />
                </div>

                {/* Learning Goals (Optional) */}
                <div className="group">
                  <label
                    htmlFor="learningGoals"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Learning Goals
                  </label>
                  <textarea
                    id="learningGoals"
                    name="learningGoals"
                    value={formData.learningGoals || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 placeholder:text-[#d1d5db] resize-none"
                    placeholder="What are your learning goals? (optional)"
                  />
                </div>

                {/* Parent/Guardian Name (Optional) */}
                <div>
                  <label
                    htmlFor="parentGuardianName"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Parent/Guardian Name
                  </label>
                  <input
                    id="parentGuardianName"
                    type="text"
                    name="parentGuardianName"
                    value={formData.parentGuardianName || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Parent/Guardian name (optional)"
                  />
                </div>

                {/* Relationship (Optional) */}
                <div>
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Relationship
                  </label>
                  <input
                    id="relationship"
                    type="text"
                    name="relationship"
                    value={formData.relationship || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Mother, Father (optional)"
                  />
                </div>

                {/* Parent Contact (Optional) */}
                <div>
                  <label
                    htmlFor="parentContact"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Parent Contact
                  </label>
                  <input
                    id="parentContact"
                    type="text"
                    name="parentContact"
                    value={formData.parentContact || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Email or phone (optional)"
                  />
                </div>

                {/* Address City (Optional) */}
                <div>
                  <label
                    htmlFor="addressCity"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    City
                  </label>
                  <input
                    id="addressCity"
                    type="text"
                    name="addressCity"
                    value={formData.addressCity || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your city (optional)"
                  />
                </div>
              </>
            )}

            {/* Teacher-specific fields */}
            {role === "Teacher" && (
              <>
                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="09XXXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* National ID/Passport */}
                <div>
                  <label
                    htmlFor="nationalIdPassport"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    National ID / Passport *
                  </label>
                  <input
                    id="nationalIdPassport"
                    type="text"
                    name="nationalIdPassport"
                    value={formData.nationalIdPassport || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="National ID or Passport number"
                  />
                  {errors.nationalIdPassport && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nationalIdPassport}
                    </p>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label
                    htmlFor="yearsOfExperience"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Years of Experience *
                  </label>
                  <input
                    id="yearsOfExperience"
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Years of teaching experience"
                  />
                  {errors.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>

                {/* Highest Education Level */}
                <div>
                  <label
                    htmlFor="highestEducationLevel"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Highest Education Level *
                  </label>
                  <input
                    id="highestEducationLevel"
                    type="text"
                    name="highestEducationLevel"
                    value={formData.highestEducationLevel || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Bachelor's Degree, Master's Degree"
                  />
                  {errors.highestEducationLevel && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.highestEducationLevel}
                    </p>
                  )}
                </div>

                {/* Qualifications (Optional) */}
                <div>
                  <label
                    htmlFor="qualifications"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Qualifications
                  </label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your qualifications and certifications (optional)"
                  />
                </div>

                {/* Short Bio (Optional) */}
                <div>
                  <label
                    htmlFor="shortBio"
                    className="block text-sm font-semibold text-[#1e1b4b] mb-3 group-focus-within:text-[#6d28d9] transition-colors"
                  >
                    Short Bio
                  </label>
                  <textarea
                    id="shortBio"
                    name="shortBio"
                    value={formData.shortBio || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-0 focus:border-[#6d28d9] focus:bg-[#f9f5ff] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tell students about yourself (optional)"
                  />
                </div>
              </>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mt-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❌</span>
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative mt-8 bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a78bfa] text-white font-semibold py-4 px-6 shadow-lg hover:shadow-2xl hover:shadow-purple-400/50 active:scale-95 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <span className="relative flex items-center justify-center transition-all duration-200">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <svg
                      className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>

            {/* Footer note */}
            <p className="text-center text-xs text-[#9ca3af] mt-6 pb-4">
              Your profile information is secure and will only be used to
              personalize your {role === "Student" ? "learning" : "teaching"}{" "}
              experience.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CompleteProfilePageContent />
    </Suspense>
  );
}

function BubbleCanvas({
  className,
  bubbleCount = 20,
  colors = ["#ffffff", "#a78bfa", "#c4b5fd", "#ddd6fe"],
  minSize = 16,
  maxSize = 48,
  maxSpeed = 0.6,
  blurPx = 0,
}: {
  className: string;
  bubbleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  maxSpeed?: number;
  blurPx?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const resize = () => {
      const { width, height } = (
        canvas.parentElement as HTMLElement
      ).getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const bubbles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
    }> = Array.from({ length: bubbleCount }).map(() => ({
      x: rnd(0, canvas.width / dpr),
      y: rnd(0, canvas.height / dpr),
      r: rnd(minSize, maxSize),
      vx: rnd(-maxSpeed, maxSpeed),
      vy: rnd(-maxSpeed, maxSpeed),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: rnd(0.35, 0.8),
    }));

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
      for (const b of bubbles) {
        if (!prefersReduced) {
          b.x += b.vx;
          b.y += b.vy;
        }
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        if (b.x - b.r > w) b.x = -b.r;
        if (b.x + b.r < 0) b.x = w + b.r;
        if (b.y - b.r > h) b.y = -b.r;
        if (b.y + b.r < 0) b.y = h + b.r;
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();
      }
      ctx.restore();
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReduced, blurPx, bubbleCount, colors, maxSize, maxSpeed, minSize]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
