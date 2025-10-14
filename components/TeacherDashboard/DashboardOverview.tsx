"use client";

import React, { useState, useEffect } from "react";
import {
  getNotifications,
  getAvailability,
  Notification,
  AvailabilitySlot,
} from "@/services/teacherDashboardService";
import MotivatedHeading from "./MotivatedHeading";
import AvailabilityManager from "./AvailabilityManager";
import NotificationsPanel from "./NotificationsPanel";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardOverview() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [notificationsRes, availabilityRes] = await Promise.all([
          getNotifications(),
          getAvailability(),
        ]);

        if (notificationsRes.success)
          setNotifications(notificationsRes.data || []);
        if (availabilityRes.success)
          setAvailability(availabilityRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Dashboard Overview" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Navigation */}
      <SharedNavigation
        notifications={notifications}
        setNotifications={setNotifications}
        onLogout={() => {
          logout();
        }}
      />

      <div className="relative z-10 pt-8 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="space-y-12">
            <div className="text-center mb-8 mt-16 animate-fade-in-up">
              <MotivatedHeading />
            </div>

            {/* Stats Overview */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Active Students Card */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      24
                    </h3>
                    <p className="text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300">
                      Active Students
                    </p>
                  </div>
                </div>
              </div>
              {/* Courses Card */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                      12
                    </h3>
                    <p className="text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300">
                      Courses
                    </p>
                  </div>
                </div>
              </div>
              {/* Success Rate Card */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                      89%
                    </h3>
                    <p className="text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300">
                      Success Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {/* Availability Manager Placeholder */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  Manage Your Availability
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                    <span className="font-medium">Monday - Friday</span>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle"
                        id="toggle1"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-blue-600"
                        defaultChecked
                      />
                      <label
                        htmlFor="toggle1"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                    <span className="font-medium">Saturday</span>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle"
                        id="toggle2"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-blue-600"
                      />
                      <label
                        htmlFor="toggle2"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </div>
                <button className="mt-8 w-full group relative px-6 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Update Schedule
                </button>
              </div>
              {/* Notifications Panel Placeholder */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
                {/* Header with Icon */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Recent Notifications
                  </h3>
                </div>

                {/* Notification List */}
                <ul className="space-y-3 flex-grow">
                  <li className="group flex items-center space-x-4 p-3.5 rounded-lg transition-colors duration-200 bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100 cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">New Student:</span> Alex
                        Johnson has enrolled.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        5 minutes ago
                      </p>
                    </div>
                  </li>

                  <li className="group flex items-center space-x-4 p-3.5 rounded-lg transition-colors duration-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">
                          Assignment Graded:
                        </span>{" "}
                        "Project Alpha" submission marked.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </li>

                  <li className="group flex items-center space-x-4 p-3.5 rounded-lg transition-colors duration-200 hover:bg-slate-50 cursor-pointer">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Reminder:</span> "Intro
                        to Physics" starts in 1 hour.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </li>
                </ul>
                <button className="mt-6 w-full group relative px-6 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <TeacherFooter />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        /* Custom toggle switch styles */
        .toggle-checkbox:checked {
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
