'use client';

import React from 'react';

interface ProfileDropdownProps {
  isVisible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  isVisible,
  onClose,
  onViewProfile,
  onEditProfile,
  onLogout
}: ProfileDropdownProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Profile Dropdown */}
      <div className="absolute top-20 right-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Teacher Name</h3>
              <p className="text-sm text-gray-600">teacher@example.com</p>
            </div>
          </div>
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              onViewProfile();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-700 font-medium">View Profile</span>
          </button>

          <button
            onClick={() => {
              onEditProfile();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-gray-700 font-medium">Edit Profile</span>
          </button>

          <div className="border-t border-gray-100 my-2"></div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
