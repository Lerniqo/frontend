"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import type { StudentProfile } from "@/types/auth.types";
import Image from "next/image";

import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial animation for the card
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }

    // Load profile data
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getCurrentUser();
      console.log("Profile response:", response);

      if (response.success && response.data) {
        // Cast to StudentProfile since this is the student profile page
        const studentProfile = response.data as StudentProfile;
        setProfile(studentProfile);
        setFormData(studentProfile);
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("An unexpected error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]:
        name === "gradeLevel"
          ? value === "" || value === "0"
            ? undefined
            : parseInt(value)
          : value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Animate form fields
    gsap.fromTo(
      ".form-field",
      { scale: 0.98, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05 }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
  };

  const handleUpdate = async () => {
    if (!formData) return;

    try {
      setUpdating(true);
      const updateData = {
        fullName: formData.fullName,
        gradeLevel: formData.gradeLevel,
        learningGoals: formData.learningGoals,
        school: formData.school,
        addressCity: formData.addressCity,
        parentGuardianName: formData.parentGuardianName,
        parentContact: formData.parentContact,
        relationship: formData.relationship,
      };

      const response = await userService.updateProfile(updateData);

      if (response.success && response.data) {
        // Cast to StudentProfile since this is the student profile page
        const updatedProfile = response.data as StudentProfile;
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setIsEditing(false);

        // Success animation
        gsap.fromTo(
          ".success-indicator",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        // Show success message briefly
        setTimeout(() => {
          gsap.to(".success-indicator", {
            scale: 0,
            opacity: 0,
            duration: 0.3,
          });
        }, 2000);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setError("An error occurred while updating your profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Your Profile" />;
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Profile Loading Error
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Success Indicator */}
          {!isEditing && (
            <div className="success-indicator fixed top-24 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 scale-0">
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div ref={cardRef} className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-t-3xl border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Profile Picture */}
                    <div className="relative">
                      <Image
                        src={formData?.profileImage || "/Profile.jpg"}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* User Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {formData?.fullName || "Student"}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {formData?.role || "Student"}
                        </span>
                        {profile?.isVerified && (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ID: {formData?.userId}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-end justify-between space-x-3">
                    {/* Back Button */}
                    <button
                      onClick={handleBackToDashboard}
                      className="group flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300/60 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </div>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                        Back to Dashboard
                      </span>
                    </button>

                    {/* Edit/Save Buttons */}
                    <div className="flex items-center space-x-3 m-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleCancel}
                            disabled={updating}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center font-medium shadow-lg"
                          >
                            {updating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Save Changes
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="px-6 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-400 hover:text-purple-800 transition-all duration-300 flex items-center font-medium shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData?.fullName || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                        {formData?.fullName || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-600 border border-gray-200">
                      {formData?.email || "Not specified"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* School */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      School/Institution
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="school"
                        value={formData?.school || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter your school name"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.school || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Grade Level */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade Level
                    </label>
                    {isEditing ? (
                      <select
                        name="gradeLevel"
                        value={formData?.gradeLevel || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
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
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.gradeLevel
                          ? `Grade ${formData.gradeLevel}`
                          : "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="addressCity"
                        value={formData?.addressCity || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter your city"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.addressCity || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Parent/Guardian Name */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parent/Guardian Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="parentGuardianName"
                        value={formData?.parentGuardianName || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter parent/guardian name"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.parentGuardianName || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Relationship */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Relationship
                    </label>
                    {isEditing ? (
                      <select
                        name="relationship"
                        value={formData?.relationship || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      >
                        <option value="">Select relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.relationship || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Parent Contact */}
                  <div className="form-field">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parent Contact
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="parentContact"
                        value={formData?.parentContact || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter parent contact number"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {formData?.parentContact || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Learning Goals - Full Width */}
                  <div className="form-field md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Learning Goals & Interests
                    </label>
                    {isEditing ? (
                      <textarea
                        name="learningGoals"
                        value={formData?.learningGoals || ""}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none"
                        placeholder="Describe your learning goals, interests, and what you hope to achieve..."
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 min-h-[100px] whitespace-pre-wrap">
                        {formData?.learningGoals ||
                          "No learning goals specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
