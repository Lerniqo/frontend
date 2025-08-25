"use client";

import React from "react";
import { gsap } from "gsap";

interface TeacherProfile {
  userId: string;
  fullName: string;
  qualifications: string;
  experienceSummary: string;
  level: number;
}

interface TeacherStoreCardProps {
  teacher: TeacherProfile;
  onViewProfile?: (teacher: TeacherProfile) => void;
}

export default function TeacherStoreCard({
  teacher,
  onViewProfile,
}: TeacherStoreCardProps) {
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

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(teacher);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 group">
      {/* Teacher Avatar & Info */}
      <div className="flex items-start mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {teacher.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-700 transition-colors duration-200">
            {teacher.fullName}
          </h3>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(
              teacher.level
            )}`}
          >
            Level {teacher.level} - {getLevelLabel(teacher.level)}
          </span>
        </div>
      </div>

      {/* Qualifications */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Qualifications:
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {teacher.qualifications}
        </p>
      </div>

      {/* Experience Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Experience:
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {teacher.experienceSummary}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleViewProfile}
        className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        }}
      >
        View Profile
      </button>
    </div>
  );
}
