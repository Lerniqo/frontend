"use client";

import React, { useState } from 'react';
import { DetailedTeacherProfile } from '@/types/auth.types';

interface TeacherCardProps {
  teacher: DetailedTeacherProfile;
  viewMode: 'grid' | 'list';
  onViewProfile: (teacherId: string) => void;
  onBookLesson?: (teacherId: string) => void;
  onToggleFavorite?: (teacherId: string) => void;
}

export default function TeacherCard({
  teacher,
  viewMode,
  onViewProfile,
  onBookLesson,
  onToggleFavorite
}: TeacherCardProps) {
  const getExperienceLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityStatus = (status: string) => {
    switch (status) {
      case 'available':
        return { color: 'text-green-600', bg: 'bg-green-100', text: 'Available' };
      case 'busy':
        return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Busy' };
      case 'offline':
        return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Offline' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  const availabilityStatus = getAvailabilityStatus(teacher.availability.status);

  if (viewMode === 'list') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 group">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {teacher.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              {/* Online Status Indicator */}
              {teacher.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-xl mb-1 group-hover:text-blue-700 transition-colors duration-200">
                  {teacher.fullName}
                  {teacher.isVerified && (
                    <svg className="inline w-5 h-5 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getExperienceLevelColor(teacher.experienceLevel)}`}>
                    {teacher.experienceLevel.charAt(0).toUpperCase() + teacher.experienceLevel.slice(1)}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${availabilityStatus.bg} ${availabilityStatus.color}`}>
                    {availabilityStatus.text}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-600">
                    {teacher.totalStudents || 0} students
                  </span>
                </div>
              </div>

              <div className="text-right">
                {teacher.hourlyRate && (
                  <div className="text-lg font-bold text-green-600">
                    ${teacher.hourlyRate}/{teacher.currency || 'USD'}
                  </div>
                )}
              </div>
            </div>



            {/* Bio and Additional Information */}
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {teacher.bioOrTeachingPhilosophy || teacher.shortBio}
            </p>
            
            {/* Professional Details */}
            <div className="mb-3 text-sm text-gray-600">
              {teacher.highestEducationLevel && (
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{teacher.highestEducationLevel}</span>
                </div>
              )}
              {teacher.yearsOfExperience && (
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{teacher.yearsOfExperience} years experience</span>
                </div>
              )}
              {teacher.address && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{teacher.address}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onViewProfile(teacher.userId)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                View Profile
              </button>
              {onBookLesson && teacher.availability.status === 'available' && (
                <button
                  onClick={() => onBookLesson(teacher.userId)}
                  className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  Book Lesson
                </button>
              )}
              {teacher.responseTime && (
                <span className="text-xs text-gray-500">{teacher.responseTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 group h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {teacher.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)}
          </div>
          {teacher.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
      </div>

      {/* Teacher Info */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-700 transition-colors duration-200">
          {teacher.fullName}
          {teacher.isVerified && (
            <svg className="inline w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </h3>

        {/* Experience Level and Status */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getExperienceLevelColor(teacher.experienceLevel)}`}>
            {teacher.experienceLevel.charAt(0).toUpperCase() + teacher.experienceLevel.slice(1)}
          </span>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${availabilityStatus.bg} ${availabilityStatus.color}`}>
            {availabilityStatus.text}
          </span>
        </div>

        {/* Student Count */}
        <div className="mb-3">
          <span className="text-sm text-gray-600">
            {teacher.totalStudents || 0} students
          </span>
        </div>



        {/* Bio and Professional Details */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
          {teacher.bioOrTeachingPhilosophy || teacher.shortBio}
        </p>
        
        {/* Professional Summary */}
        <div className="mb-3 text-xs text-gray-600 space-y-1">
          {teacher.highestEducationLevel && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="truncate">{teacher.highestEducationLevel}</span>
            </div>
          )}
          {teacher.yearsOfExperience && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{teacher.yearsOfExperience} years exp.</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        {teacher.hourlyRate && (
          <div className="text-center mb-3">
            <span className="text-lg font-bold text-green-600">
              ${teacher.hourlyRate}/{teacher.currency || 'USD'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onViewProfile(teacher.userId)}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            View Profile
          </button>
          {onBookLesson && teacher.availability.status === 'available' && (
            <button
              onClick={() => onBookLesson(teacher.userId)}
              className="w-full border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              Book Lesson
            </button>
          )}
        </div>

        {teacher.responseTime && (
          <p className="text-xs text-gray-500 text-center mt-2">{teacher.responseTime}</p>
        )}
      </div>
    </div>
  );
}