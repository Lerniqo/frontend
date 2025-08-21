"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";

import Loading from "@/components/CommonComponents/Loading"; // Adjust the import path as necessary
import UpdatingComponent from "@/components/CommonComponents/Updating"; // Adjust the import path as necessary

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
  profilePictureUrl: string;
  gradeLevel: number | null;
  learningGoals: string | null;
  qualifications: string | null;
  experienceYears: number | null;
  bio: string | null;
  isVerified: boolean | null;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Load profile data
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyProfile();
      if (response.success && response.user) {
        setProfile(response.user);
        setFormData(response.user);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]:
        name === "gradeLevel" || name === "experienceYears"
          ? value === ""
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
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
        email: formData.email,
        gradeLevel: formData.gradeLevel,
        learningGoals: formData.learningGoals,
        qualifications: formData.qualifications,
        experienceYears: formData.experienceYears,
        bio: formData.bio,
        profilePictureUrl: formData.profilePictureUrl,
      };

      const response = await userService.updateMyProfile(updateData);

      if (response.success && response.user) {
        setProfile(response.user);
        setFormData(response.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + response.message);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/Student/Dashboard");
  };

  if (loading) {
    return <Loading />;
  }

  if (!profile || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
          <div className="text-center">
            <p className="text-lg text-gray-600">Failed to load profile data</p>
            <button
              onClick={loadProfile}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
      {updating && <UpdatingComponent />}

      <div
        ref={cardRef}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={handleBackToDashboard}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Student Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your profile information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {profile.isVerified && (
                <span className="flex items-center text-green-600 text-sm">
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
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10">
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={formData.profilePictureUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {formData.fullName}
                </h2>
                <p className="text-gray-600 capitalize">{formData.role}</p>
                <p className="text-sm text-gray-500">ID: {formData.id}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {formData.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {formData.email}
                  </p>
                )}
              </div>

              {/* Grade Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="gradeLevel"
                    value={formData.gradeLevel || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="12"
                  />
                ) : (
                  <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {formData.gradeLevel || "Not specified"}
                  </p>
                )}
              </div>

              {/* Learning Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Goals
                </label>
                {isEditing ? (
                  <textarea
                    name="learningGoals"
                    value={formData.learningGoals || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800 min-h-[80px]">
                    {formData.learningGoals || "No learning goals specified"}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                    {formData.bio || "No bio available"}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={updating}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
    </div>
  );
}
