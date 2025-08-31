'use client';

import React, { useState } from 'react';
import { Notification } from '@/services/teacherDashboardService';
import NotificationPopup from './NotificationPopup';
import ProfileDropdown from './ProfileDropdown';

interface NavigationMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onLogout: () => void;
  showNotificationPopup: boolean;
  showProfileDropdown: boolean;
  setShowNotificationPopup: (show: boolean) => void;
  setShowProfileDropdown: (show: boolean) => void;
}

export default function NavigationMenu({
  activeSection,
  onSectionChange,
  notifications,
  setNotifications,
  onLogout,
  showNotificationPopup,
  showProfileDropdown,
  setShowNotificationPopup,
  setShowProfileDropdown
}: NavigationMenuProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'content', label: 'Content Management', icon: '📚' },
    { id: 'schedule', label: 'Schedule Management', icon: '⏰' },
    { id: 'contests', label: 'Contests', icon: '🏆' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">Teacher Dashboard</span>
                <div className="text-xs text-slate-400 font-medium">Premium Edition</div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`group relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/25 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`text-lg transition-transform duration-300 ${
                  activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <span className="relative z-10">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationPopup(!showNotificationPopup);
                  setShowProfileDropdown(false);
                }}
                className="relative p-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
                </svg>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>
            </div>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotificationPopup(false);
                }}
                className="p-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      <NotificationPopup
        notifications={notifications}
        setNotifications={setNotifications}
        isVisible={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
      />

      {/* Profile Dropdown */}
      <ProfileDropdown
        isVisible={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        onViewProfile={() => {
          // Navigate to profile view
          setShowProfileDropdown(false);
        }}
        onEditProfile={() => {
          // Navigate to profile edit
          setShowProfileDropdown(false);
        }}
        onLogout={() => {
          onLogout();
        }}
      />

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl">
          <div className="px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
