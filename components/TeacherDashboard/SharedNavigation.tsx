"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Notification } from "@/services/teacherDashboardService";
import NotificationPopup from "./NotificationPopup";
import ProfileDropdown from "./ProfileDropdown";

interface SharedNavigationProps {
  notifications?: Notification[];
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;
  onLogout?: () => void;
}

export default function SharedNavigation({
  notifications = [],
  setNotifications,
  onLogout,
}: SharedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "content-management", label: "Content", path: "/content-management" },
    {
      id: "schedule-management",
      label: "Schedule",
      path: "/schedule-management",
    },
    { id: "contests", label: "Contests", path: "/contests" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              onClick={() => handleNavigation("/dashboard")}
              className="group flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                Learniqo
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative font-medium transition-all duration-300 group py-2 px-3 cursor-pointer rounded-lg hover:bg-blue-50 ${
                  isActive(item.path)
                    ? "text-blue-600 hover:text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="flex items-center gap-2">{item.label}</span>
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ${
                    isActive(item.path) ? "w-6" : "w-0 group-hover:w-6"
                  }`}
                ></span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Notification Icon */}
            <button
              onClick={() => {
                setShowNotificationPopup(!showNotificationPopup);
                setShowProfileDropdown(false);
              }}
              className="relative p-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </button>

            {/* Profile Icon */}
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationPopup(false);
              }}
              className="relative p-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-lg">
            <div className="container mx-auto px-6 py-4">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    onClick={() => {
                      handleNavigation(item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`block font-medium transition-colors duration-200 py-2 border-b border-gray-100 cursor-pointer ${
                      isActive(item.path)
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
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
            handleNavigation("/profile");
            setShowProfileDropdown(false);
          }}
          onEditProfile={() => {
            handleNavigation("/profile");
            setShowProfileDropdown(false);
          }}
          onLogout={onLogout}
          onClose={() => setShowProfileDropdown(false)}
        />
      )}
    </nav>
  );
}
