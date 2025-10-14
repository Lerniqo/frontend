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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_70%)]"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "2s",
                }}
              ></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-white">
                Loading Dashboard
              </h3>
              <p className="text-slate-400 text-lg">
                Preparing your premium experience...
              </p>
              <div className="flex items-center justify-center space-x-2 mt-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="space-y-16">
            <div className="text-center mb-12 mt-20">
              <MotivatedHeading />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Active Students Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <h3 className="text-3xl font-bold text-gray-800">24</h3>
                    <p className="text-gray-500 font-medium">Active Students</p>
                  </div>
                </div>
              </div>
              {/* Courses Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <h3 className="text-3xl font-bold text-gray-800">12</h3>
                    <p className="text-gray-500 font-medium">Courses</p>
                  </div>
                </div>
              </div>
              {/* Success Rate Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <svg
                      className="w-8 h-8 text-white"
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
                    <h3 className="text-3xl font-bold text-gray-800">89%</h3>
                    <p className="text-gray-500 font-medium">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Availability Manager Placeholder */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        /* Custom toggle switch styles (line 69 update) */
        .toggle-checkbox:checked {
          border-color: #3b82f6; /* Tailwind's blue-500 */
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
