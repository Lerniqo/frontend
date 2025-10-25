"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : undefined) : value,
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
    if (!userId || !role) return;

    setIsLoading(true);

    try {
      const response = await userService.completeProfile(formData, userId);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">
            Complete Your Profile
          </h1>
          <p className="text-blue-100">
            {role === "Student" ? "Student" : "Teacher"} Profile Information
          </p>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Birthday *
              </label>
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday || ""}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.birthday && (
                <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>
              )}
            </div>

            {/* Student-specific fields */}
            {role === "Student" && (
              <>
                {/* Grade Level */}
                <div>
                  <label
                    htmlFor="gradeLevel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Grade Level *
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select grade level</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      )
                    )}
                  </select>
                  {errors.gradeLevel && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.gradeLevel}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* School (Optional) */}
                <div>
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your school name (optional)"
                  />
                </div>

                {/* Learning Goals (Optional) */}
                <div>
                  <label
                    htmlFor="learningGoals"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="What are your learning goals? (optional)"
                  />
                </div>

                {/* Parent/Guardian Name (Optional) */}
                <div>
                  <label
                    htmlFor="parentGuardianName"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Parent/Guardian name (optional)"
                  />
                </div>

                {/* Relationship (Optional) */}
                <div>
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Mother, Father (optional)"
                  />
                </div>

                {/* Parent Contact (Optional) */}
                <div>
                  <label
                    htmlFor="parentContact"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Email or phone (optional)"
                  />
                </div>

                {/* Address City (Optional) */}
                <div>
                  <label
                    htmlFor="addressCity"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your qualifications and certifications (optional)"
                  />
                </div>

                {/* Short Bio (Optional) */}
                <div>
                  <label
                    htmlFor="shortBio"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tell students about yourself (optional)"
                  />
                </div>
              </>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Completing Profile..." : "Complete Profile"}
            </button>
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
