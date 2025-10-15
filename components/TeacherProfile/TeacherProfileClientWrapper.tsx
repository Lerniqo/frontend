"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherProfile from "./TeacherProfile";
import { TeacherProfile as TeacherProfileType } from "@/types/auth.types";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
// import NavBar from '@/components/LandingPageComponents/NavBar';
import Footer from "@/components/LandingPageComponents/Footer";

interface TeacherProfileClientWrapperProps {
  teacherId: string;
  teacher?: TeacherProfileType;
}

export default function TeacherProfileClientWrapper({
  teacherId,
  teacher: initialTeacher,
}: TeacherProfileClientWrapperProps) {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherProfileType | null>(
    initialTeacher || null
  );
  const [loading, setLoading] = useState(!initialTeacher);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTeacher && teacherId) {
      const fetchTeacherProfile = async () => {
        try {
          setLoading(true);
          const response = await userService.getTeacherProfile(teacherId);

          if (response.success && response.data) {
            setTeacher(response.data);
          } else {
            setError(response.message || "Failed to load teacher profile");
          }
        } catch (err) {
          setError(
            "An unexpected error occurred while fetching teacher profile"
          );
          console.error("Error fetching teacher profile:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchTeacherProfile();
    }
  }, [initialTeacher, teacherId]);

  const handleGoBack = () => {
    router.push("/teachers");
  };

  const handleHireTeacher = (_teacherId: string) => {
    // This function will be handled by the TeacherProfileContainer now
    // The modal will be opened from there
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Teacher Profile..." />;
  }

  if (error) {
    return (
      <>
        {/* <NavBar /> */}
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!teacher) {
    return (
      <>
        {/* <NavBar /> */}
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Teacher Not Found
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The requested teacher profile could not be found. They may have
              removed their profile or the link is invalid.
            </p>
            <button
              onClick={handleGoBack}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Teachers
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TeacherProfile
        teacher={teacher}
        onGoBack={handleGoBack}
        onHireTeacher={handleHireTeacher}
      />
      <Footer />
    </>
  );
}
