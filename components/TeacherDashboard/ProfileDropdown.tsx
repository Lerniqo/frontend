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
      <div className="absolute top-20 right-4 w-64 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 z-50 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-white/20 before:to-transparent before:rounded-3xl">
        <div className="relative z-10 p-6 border-b border-white/30 bg-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg drop-shadow-sm">T</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white drop-shadow-lg">Teacher Name</h3>
              <p className="text-sm text-white/80">teacher@example.com</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 py-2 bg-white/5 backdrop-blur-sm">
          <button
            onClick={() => {
              onViewProfile();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-white/90 font-medium drop-shadow-sm">View Profile</span>
          </button>

          <button
            onClick={() => {
              onEditProfile();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-white/90 font-medium drop-shadow-sm">Edit Profile</span>
          </button>

          <div className="border-t border-white/30 my-2"></div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full px-6 py-3 text-left hover:bg-red-500/20 transition-all duration-300 flex items-center space-x-3 text-red-300 hover:text-red-200 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium drop-shadow-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
