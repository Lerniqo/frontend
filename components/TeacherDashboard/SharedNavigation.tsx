'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Notification } from '@/services/teacherDashboardService';
import NotificationPopup from './NotificationPopup';
import ProfileDropdown from './ProfileDropdown';

interface SharedNavigationProps {
  notifications?: Notification[];
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;
  onLogout?: () => void;
}

export default function SharedNavigation({
  notifications = [],
  setNotifications,
  onLogout
}: SharedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'content-management', label: 'Content', icon: '📚', path: '/content-management' },
    { id: 'schedule-management', label: 'Schedule', icon: '⏰', path: '/schedule-management' },
    { id: 'contests', label: 'Contests', icon: '🏆', path: '/contests' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="hidden sm:block">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg hover:from-blue-300 hover:via-purple-300 hover:to-indigo-300 transition-all duration-300 hover:drop-shadow-xl cursor-pointer"
                     onClick={() => handleNavigation('/dashboard')}>
                  Learniqo
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex space-x-3 xl:space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`group relative flex items-center space-x-3 px-5 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-purple-500/30 scale-105 ring-2 ring-white/20'
                    : 'text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg'
                }`}
              >
                <div className={`text-lg lg:text-xl transition-transform duration-300 ${
                  isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <span className="relative z-10 font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-3 lg:space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationPopup(!showNotificationPopup);
                  setShowProfileDropdown(false);
                }}
                className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
                </svg>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg ring-2 ring-white/30">
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
                className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-white/30 py-6 bg-white/5 backdrop-blur-2xl">
            <div className="space-y-3 px-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavigation(item.path);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-medium text-base transition-all duration-500 backdrop-blur-sm overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-2xl ring-2 ring-white/30 scale-105 border border-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-white/20 border border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <span className="text-xl drop-shadow-sm">{item.icon}</span>
                  <span className="drop-shadow-sm">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notification Popup */}
      {showNotificationPopup && setNotifications && (
        <NotificationPopup
          notifications={notifications}
          setNotifications={setNotifications}
          isVisible={showNotificationPopup}
          onClose={() => setShowNotificationPopup(false)}
        />
      )}

      {/* Profile Dropdown */}
      {showProfileDropdown && onLogout && (
        <ProfileDropdown
          isVisible={showProfileDropdown}
          onViewProfile={() => {
            handleNavigation('/profile');
            setShowProfileDropdown(false);
          }}
          onEditProfile={() => {
            handleNavigation('/profile');
            setShowProfileDropdown(false);
          }}
          onLogout={onLogout}
          onClose={() => setShowProfileDropdown(false)}
        />
      )}
    </nav>
  );
}
