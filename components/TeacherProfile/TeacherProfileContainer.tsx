"use client";

import React, { useEffect, useState } from "react";
import { TeacherProfile as TeacherProfileType } from "@/types/auth.types";
import { userService } from "@/services/userService";
import {
  getTeacherAvailability,
  getMySessions,
  TeacherAvailability,
  Session,
} from "@/services/schedulingService";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import TeacherProfileHeader from "@/components/TeacherProfile/TeacherProfileHeader";
import TeacherAboutSection from "@/components/TeacherProfile/TeacherAboutSection";
import TeacherBookingCard from "@/components/TeacherProfile/TeacherBookingCard";
import TeacherContactInfo from "@/components/TeacherProfile/TeacherContactInfo";
import TeacherBookingModal from "@/components/TeacherProfile/TeacherBookingModal";
import { SelectedSlot } from "@/types/auth.types";

interface TeacherProfileContainerProps {
  teacher?: TeacherProfileType;
  teacherId?: string;
  onGoBack?: () => void;
  onHireTeacher?: (teacherId: string) => void;
}

export default function TeacherProfileContainer({
  teacher: initialTeacher,
  teacherId,
  onGoBack,
  onHireTeacher: _onHireTeacher,
}: TeacherProfileContainerProps) {
  const [teacher, setTeacher] = useState<TeacherProfileType | null>(
    initialTeacher || null
  );
  const [loading, setLoading] = useState(!initialTeacher);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [_selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>(
    []
  );
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have teacher data and we have an ID
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

  // Fetch teacher availability and user's sessions when component mounts or teacher changes
  useEffect(() => {
    const fetchAvailabilityAndSessions = async () => {
      if (teacher?.userId) {
        setLoadingAvailability(true);
        try {
          // Fetch both availability and sessions in parallel
          const [availabilityData, sessionsData] = await Promise.all([
            getTeacherAvailability(teacher.userId),
            getMySessions(),
          ]);

          setAvailabilities(availabilityData);
          setMySessions(sessionsData);
        } catch (err) {
          console.error("Error fetching availability and sessions:", err);
        } finally {
          setLoadingAvailability(false);
        }
      }
    };

    fetchAvailabilityAndSessions();
  }, [teacher]);

  const handleHireTeacher = (_teacherId: string) => {
    // Open the booking modal instead of calling the passed prop
    setIsBookingModalOpen(true);
  };

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(false);
    // Here you would typically proceed with the booking process
    alert(
      `Booking confirmed for ${slot.date} at ${slot.timeSlot.startTime} - ${slot.timeSlot.endTime}`
    );
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Teacher Profile..." />;
  }

  if (error) {
    return (
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
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
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
            The requested teacher profile could not be found.
          </p>
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Teachers
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-8">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="group flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg hover:shadow-xl border border-white/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Teachers
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="overflow-hidden">
        <TeacherProfileHeader
          name={teacher.fullName || "Unknown Teacher"}
          profilePictureUrl={teacher.profileImage}
          yearsOfExperience={teacher.yearsOfExperience}
          highestEducationLevel={teacher.highestEducationLevel}
          qualifications={teacher.qualifications}
        />

        <div className="py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
            <div className=" space-y-8">
              <TeacherAboutSection
                shortBio={teacher.shortBio}
                qualifications={teacher.qualifications}
              />
            </div>

            <div className="space-y-8">
              <TeacherBookingCard
                teacherId={teacher.userId}
                onHireTeacher={handleHireTeacher}
              />

              <TeacherContactInfo
                address={teacher.address}
                phoneNumber={teacher.phoneNumber}
                email={teacher.email}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <TeacherBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        teacherName={teacher.fullName || "Unknown Teacher"}
        teacherId={teacher.userId}
        onSlotSelect={handleSlotSelect}
        availabilities={availabilities}
        mySessions={mySessions}
        loading={loadingAvailability}
      />
    </div>
  );
}
