"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { userService } from "../../services/userService";
import TeacherStoreCard from "./TeacherStoreCard";
import TeacherProfile from "./TeacherProfile";

interface TeacherProfile {
  userId: string;
  fullName: string;
  qualifications: string;
  experienceSummary: string;
  level: number;
}

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

export default function TeachersStore() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherProfile[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [currentView, setCurrentView] = useState<"list" | "profile">("list");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );

  const router = useRouter();

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await userService.getTeachers();

        if (response.success && response.teachers) {
          setTeachers(response.teachers);
          setFilteredTeachers(response.teachers);
        } else {
          setError(response.message || "Failed to fetch teachers");
        }
      } catch (err) {
        setError("An error occurred while fetching teachers");
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Animation on mount
  useEffect(() => {
    if (containerRef.current && !loading) {
      gsap.fromTo(
        containerRef.current,
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
  }, [loading]);

  // Filter teachers based on search term and level
  useEffect(() => {
    let filtered = teachers;

    // Filter by search term (name, qualifications, or experience summary)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.qualifications
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          teacher.experienceSummary
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== null) {
      filtered = filtered.filter((teacher) => teacher.level === selectedLevel);
    }

    setFilteredTeachers(filtered);

    // Animate cards when filtered
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [teachers, searchTerm, selectedLevel]);

  const handleViewProfile = (teacher: TeacherProfile) => {
    // Navigate to teacher profile view
    setSelectedTeacherId(teacher.userId);
    setCurrentView("profile");
  };

  const handleGoBackToList = () => {
    setCurrentView("list");
    setSelectedTeacherId(null);
  };

  const handleBackToDashboard = () => {
    router.push("/Student/Dashboard");
  };

  const handleHireTeacher = (teacher: DetailedTeacherProfile) => {
    // Handle hiring logic here
    console.log("Hiring teacher:", teacher.fullName);
    alert(`Have to Complete this teacher name ${teacher.fullName}'s profile.`);
    // You can add more hiring logic here, such as:
    // - Navigate to a booking/payment page
    // - Send a hiring request to the backend
    // - Open a modal with hiring details
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel(null);

    // Animate search input clear
    if (searchRef.current) {
      gsap.to(searchRef.current, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleLevelSelect = (level: number | null) => {
    setSelectedLevel(level);

    // Animate button selection
    const buttons = document.querySelectorAll("[data-level-button]");
    buttons.forEach((button) => {
      gsap.to(button, {
        scale: button.getAttribute("data-level") === String(level) ? 1.05 : 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-blue-200 p-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600 font-medium">
            Loading teachers...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-red-200 p-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render teacher profile view
  if (currentView === "profile" && selectedTeacherId) {
    return (
      <TeacherProfile
        teacherId={selectedTeacherId}
        onGoBack={handleGoBackToList}
        onHireTeacher={handleHireTeacher}
      />
    );
  }

  // Render teachers list view
  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-blue-200 p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
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
            Back to Dashboard
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Teachers Store
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and connect with qualified educators
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search teachers by name, qualifications, or experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 pl-12 pr-4 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-200 text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Level Filter Buttons */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <span className="text-sm font-semibold text-gray-700 mr-2">
            Filter by Level:
          </span>
          <button
            data-level-button
            data-level="null"
            onClick={() => handleLevelSelect(null)}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${
              selectedLevel === null
                ? "bg-gradient-to-r from-blue-400 to-green-400 text-white border-blue-400 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:shadow-md"
            }`}
          >
            All Levels
          </button>
          {[0, 1, 2, 3].map((level) => (
            <button
              key={level}
              data-level-button
              data-level={level}
              onClick={() => handleLevelSelect(level)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${
                selectedLevel === level
                  ? "bg-gradient-to-r from-blue-400 to-green-400 text-white border-blue-400 shadow-lg"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              Level {level} ({getLevelLabel(level)})
            </button>
          ))}
        </div>

        {/* Active Filters & Results Summary */}
        {(searchTerm || selectedLevel !== null) && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-700">
                  Showing {filteredTeachers.length} of {teachers.length}{" "}
                  teachers
                </span>
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded-full border border-blue-300">
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {selectedLevel !== null && (
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full border border-green-300">
                    Level {selectedLevel} - {getLevelLabel(selectedLevel)}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">🔍</span>
          </div>
          <div className="text-gray-500 text-xl font-semibold mb-2">
            No teachers found
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm || selectedLevel !== null
              ? "Try adjusting your search criteria or clearing the filters to see more results."
              : "No teachers are currently available in our system."}
          </p>
        </div>
      ) : (
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTeachers.map((teacher) => (
            <TeacherStoreCard
              key={teacher.userId}
              teacher={teacher}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}

      {/* Footer Results Summary */}
      <div className="mt-8 text-center">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
          <span className="text-gray-600 font-medium">
            Displaying {filteredTeachers.length} teacher
            {filteredTeachers.length !== 1 ? "s" : ""}
            {searchTerm || selectedLevel !== null ? (
              <span className="text-blue-600">
                {" "}
                (filtered from {teachers.length} total)
              </span>
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
