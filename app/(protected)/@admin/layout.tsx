"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Bell,
  User,
  Menu,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import AdminFooter from "@/components/AdminDashboard/AdminFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationPopup(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    {
      id: "user-management",
      label: "User Management",
      path: "/user-management",
    },
    { id: "content", label: "Content Management", path: "/content" },
    { id: "analytics", label: "Analytics", path: "/analytics" },
  ];

  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: "user",
      title: "New user registration",
      message: "John Doe has registered as a student",
      time: "2 minutes ago",
      read: false,
      color: "blue",
    },
    {
      id: 2,
      type: "content",
      title: "Content approved",
      message: "Mathematics lesson has been approved",
      time: "1 hour ago",
      read: false,
      color: "green",
    },
    {
      id: 3,
      type: "system",
      title: "System update",
      message: "Platform maintenance scheduled for tonight",
      time: "3 hours ago",
      read: false,
      color: "yellow",
    },
    {
      id: 4,
      type: "analytics",
      title: "Weekly report ready",
      message: "Your weekly analytics report is ready for review",
      time: "1 day ago",
      read: true,
      color: "purple",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
  };

  const handleProfileAction = (action: string) => {
    setShowProfileDropdown(false);
    switch (action) {
      case "profile":
        router.push("/profile");
        break;
      case "dashboard":
        router.push("/dashboard");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "logout":
        // Handle logout logic here
        console.warn("Logging out...");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Navigation Header */}
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
                  Learniqo Admin
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
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setShowNotificationPopup(!showNotificationPopup);
                    setShowProfileDropdown(false);
                  }}
                  className="relative p-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </button>

                {/* Notification Popup */}
                {showNotificationPopup && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        You have {unreadCount}{" "}
                        {unreadCount === 1
                          ? "new notification"
                          : "new notifications"}
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 ${
                            !notification.read ? "bg-blue-50/50" : ""
                          } animate-in slide-in-from-right-4 fade-in-0`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.color === "blue"
                                  ? "bg-blue-500"
                                  : notification.color === "green"
                                  ? "bg-green-500"
                                  : notification.color === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-purple-500"
                              } ${!notification.read ? "animate-pulse" : ""}`}
                            ></div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-gray-800"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 flex space-x-2">
                      <button className="flex-1 text-center text-sm text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:scale-105">
                        Mark all as read
                      </button>
                      <button className="flex-1 text-center text-sm text-gray-600 hover:text-gray-800 transition-all duration-200 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 hover:scale-105">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotificationPopup(false);
                  }}
                  className="relative p-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <User className="w-6 h-6" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Admin User
                          </p>
                          <p className="text-xs text-gray-600">
                            admin@lerniqo.com
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleProfileAction("profile")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() => handleProfileAction("dashboard")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleProfileAction("settings")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <Settings className="w-4 h-4" />
                        <span>System Settings</span>
                      </button>
                      <hr className="border-gray-200 my-2" />
                      <button
                        onClick={() => handleProfileAction("logout")}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:pl-5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 min-h-0 pt-20">{children}</div>

      {/* Admin Footer */}
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
