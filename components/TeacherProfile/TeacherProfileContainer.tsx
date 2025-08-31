"use client";

import React, { useEffect, useState } from 'react';
import { TeacherProfile as TeacherProfileType } from '@/types/auth.types';
import { userService } from '@/services/userService';
import Loading from '@/components/CommonComponents/Loading';
import TeacherProfileHeader from '@/components/TeacherProfile/TeacherProfileHeader';
import TeacherAboutSection from '@/components/TeacherProfile/TeacherAboutSection';
import TeacherBookingCard from '@/components/TeacherProfile/TeacherBookingCard';
import TeacherContactInfo from '@/components/TeacherProfile/TeacherContactInfo';
import TeacherBookingModal from '@/components/TeacherProfile/TeacherBookingModal';
import { SelectedSlot } from '@/types/auth.types';

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
  onHireTeacher,
}: TeacherProfileContainerProps) {
  const [teacher, setTeacher] = useState<TeacherProfileType | null>(initialTeacher || null);
  const [loading, setLoading] = useState(!initialTeacher);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

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
            setError(response.message || 'Failed to load teacher profile');
          }
        } catch (err) {
          setError('An unexpected error occurred while fetching teacher profile');
          console.error('Error fetching teacher profile:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTeacherProfile();
    }
  }, [initialTeacher, teacherId]);

  const handleHireTeacher = (teacherId: string) => {
    // Open the booking modal instead of calling the passed prop
    setIsBookingModalOpen(true);
  };

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(false);
    // Here you would typically proceed with the booking process
    alert(`Booking confirmed for ${slot.date} at ${slot.timeSlot.startTime} - ${slot.timeSlot.endTime}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Teacher Not Found</h2>
          <p className="text-gray-600 mb-6">The requested teacher profile could not be found.</p>
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Teachers
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <TeacherProfileHeader 
          name={teacher.fullName || 'Unknown Teacher'}
          profilePictureUrl={teacher.profileImage}
          yearsOfExperience={teacher.yearsOfExperience}
          highestEducationLevel={teacher.highestEducationLevel}
          qualifications={teacher.qualifications}
        />
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TeacherAboutSection 
                shortBio={teacher.shortBio}
                qualifications={teacher.qualifications}
              />
            </div>
            
            <div className="space-y-6">
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
        teacherName={teacher.fullName || 'Unknown Teacher'}
        teacherId={teacher.userId}
        onSlotSelect={handleSlotSelect}
      />
    </div>
  );
}