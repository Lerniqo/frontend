"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import TeacherProfile from './TeacherProfile';
import { TeacherProfile as TeacherProfileType } from '@/types/auth.types';
import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import Loading from '@/components/CommonComponents/Loading';
import NavBar from '@/components/LandingPageComponents/NavBar';
import Footer from '@/components/LandingPageComponents/Footer';

interface TeacherProfileClientWrapperProps {
  teacherId: string;
  teacher?: TeacherProfileType;
}

export default function TeacherProfileClientWrapper({ teacherId, teacher: initialTeacher }: TeacherProfileClientWrapperProps) {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherProfileType | null>(initialTeacher || null);
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

  const handleGoBack = () => {
    router.push('/teachers');
  };

  const handleHireTeacher = (_teacherId: string) => {
    // This function will be handled by the TeacherProfileContainer now
    // The modal will be opened from there
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={handleGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
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
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Teacher Not Found</h2>
            <p className="text-gray-600 mb-6">The requested teacher profile could not be found.</p>
            <button
              onClick={handleGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <TeacherProfile 
        teacher={teacher}
        onGoBack={handleGoBack}
        onHireTeacher={handleHireTeacher}
      />
      <Footer />
    </>
  );
}