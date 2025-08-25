"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { userService } from "../../services/userService";
import Loading from "../CommonComponents/Loading";

interface DetailedTeacherProfile {
  userId: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  qualifications: string;
  experienceSummary: string;
  yearsOfExperience: number;
  level: number; // 0, 1, 2, 3
  educationLevel: string;
  bioOrTeachingPhilosophy: string;
  subjectsTaught: string[];
  profilePictureUrl?: string;
  isVerified: boolean;
}

interface TeacherProfileProps {
  teacherId: string;
  onGoBack: () => void;
  onHireTeacher: (teacher: DetailedTeacherProfile) => void;
}

export default function TeacherProfile({
  teacherId,
  onGoBack,
  onHireTeacher,
}: TeacherProfileProps) {
  const [teacher, setTeacher] = useState<DetailedTeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation for the card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Load teacher profile data
    loadTeacherProfile();
  }, [teacherId]);

  const loadTeacherProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userService.getTeacher(teacherId);

      if (response.success && response.teacher) {
        setTeacher(response.teacher);
      } else {
        setError(response.message || "Failed to load teacher profile");
      }
    } catch (error) {
      console.error("Failed to load teacher profile:", error);
      setError("An error occurred while loading the teacher profile");
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (level: number): string => {
    switch (level) {
      case 0:
        return "Beginner";
      case 1:
        return "Intermediate";
      case 2:
        return "Advanced";
      case 3:
        return "Expert";
      default:
        return "Unknown";
    }
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 0:
        return "bg-green-100 text-green-800 border-green-200";
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 3:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleHire = () => {
    if (teacher) {
      onHireTeacher(teacher);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-lg text-gray-600 mb-6">
              {error || "Teacher profile not found"}
            </p>
            <div className="space-x-4">
              <button
                onClick={loadTeacherProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onGoBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
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
                onClick={onGoBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
                title="Back to Teachers"
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
                  Teacher Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Detailed information about the educator
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {teacher.isVerified && (
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
                className={`px-3 py-2 rounded-full text-xs font-medium border-2 ${getLevelColor(
                  teacher.level
                )}`}
              >
                Level {teacher.level} - {getLevelLabel(teacher.level)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10">
          <div className="space-y-8">
            {/* Profile Picture & Basic Info Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={teacher.profilePictureUrl || "/Profile.jpg"}
                  alt="Teacher Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                {teacher.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {teacher.fullName}
                </h2>
                <p className="text-gray-600 text-lg">
                  {teacher.educationLevel}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {teacher.yearsOfExperience} years of experience
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {teacher.address}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {teacher.phoneNumber}
                </p>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {teacher.qualifications}
                </p>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {teacher.yearsOfExperience} years
                </p>
              </div>

              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {teacher.educationLevel}
                </p>
              </div>

              {/* Teaching Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Level
                </label>
                <span
                  className={`inline-block px-4 py-2 rounded-lg font-medium border-2 ${getLevelColor(
                    teacher.level
                  )}`}
                >
                  Level {teacher.level} - {getLevelLabel(teacher.level)}
                </span>
              </div>

              {/* Subjects Taught */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects Taught
                </label>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjectsTaught.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Summary */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Summary
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800 min-h-[60px]">
                  {teacher.experienceSummary}
                </p>
              </div>

              {/* Bio / Teaching Philosophy */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Philosophy & Bio
                </label>
                <p className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                  {teacher.bioOrTeachingPhilosophy}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={onGoBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </button>

              <button
                onClick={handleHire}
                className="px-8 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Hire Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
