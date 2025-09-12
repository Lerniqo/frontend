"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  CogIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export default function StudentNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: HomeIcon,
      path: "/student-dashboard",
    },
    {
      id: "lesson-library",
      label: "Lesson Library",
      icon: BuildingLibraryIcon,
      path: "/lesson-library",
    },
    {
      id: "learning-path",
      label: "Learning Path",
      icon: AcademicCapIcon,
      path: "/learning-path",
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: UserGroupIcon,
      path: "/teachers",
    },
    {
      id: "progress",
      label: "Progress",
      icon: ChartBarIcon,
      path: "/progress",
    },
    {
      id: "forum",
      label: "Forum",
      icon: ChatBubbleLeftRightIcon,
      path: "/forum",
    },
    {
      id: "my-sessions",
      label: "My Sessions",
      icon: CalendarIcon,
      path: "/my-sessions",
    },
    {
      id: "ai-tutor",
      label: "AI Tutor",
      icon: SparklesIcon,
      path: "/ai-tutor",
    },
    { id: "settings", label: "Settings", icon: CogIcon, path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-6 rounded-xl shadow-2xl h-full w-full backdrop-blur-sm border border-purple-400/30">
      <div className="mb-6">
        <h2 className="text-white text-xl font-semibold">Navigation</h2>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? "bg-purple-600/50 text-white border border-purple-400/40 shadow-lg"
                  : "text-purple-200 hover:bg-purple-700/30 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white"
                    : "text-purple-300 group-hover:text-white"
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-purple-300 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Center - Welcome Message (only on dashboard) */}
      {/* {pathname === "/student-dashboard" && (
        <div className="flex-3 bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-6 rounded-xl shadow-2xl h-1/4 w-full backdrop-blur-sm border border-purple-400/30 flex flex-col justify-center pointer-events-none">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg text-blue-200/90 font-medium">
              Ready to continue your learning journey?
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      )} */}

      {/* Right Side - Profile and Notifications */}
      {/* <div className="flex flex-col gap-3 flex-1 bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-4 rounded-xl shadow-2xl h-full w-full backdrop-blur-sm border border-purple-400 border-opacity-30 pointer-events-auto">
        <ProfileNavigationButton />
        <NotificationsSection />
      </div> */}
    </div>
  );
}

function _NotificationsSection() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl p-4 backdrop-blur-sm border border-purple-400/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
        {/* Assignment Due Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-orange-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Assignment Due
              </h4>
              <p className="text-xs text-blue-200/80">
                Math homework is due tomorrow at 11:59 PM
              </p>
              <span className="text-xs text-orange-300 mt-1 block">
                Due in 18 hours
              </span>
            </div>
            <div className="w-2 h-2 bg-orange-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* New Message Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-blue-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                New Message
              </h4>
              <p className="text-xs text-blue-200/80">
                Your teacher posted feedback on your essay
              </p>
              <span className="text-xs text-blue-300 mt-1 block">
                2 minutes ago
              </span>
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Grade Posted Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-green-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Grade Posted
              </h4>
              <p className="text-xs text-blue-200/80">
                Your Science quiz grade is now available
              </p>
              <span className="text-xs text-green-300 mt-1 block">
                1 hour ago
              </span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Event Reminder */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-purple-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Event Reminder
              </h4>
              <p className="text-xs text-blue-200/80">
                Virtual study group starts in 30 minutes
              </p>
              <span className="text-xs text-purple-300 mt-1 block">
                Starting soon
              </span>
            </div>
            <div className="w-2 h-2 bg-purple-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Course Update */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Course Update
              </h4>
              <p className="text-xs text-blue-200/80">
                New learning materials added to History class
              </p>
              <span className="text-xs text-yellow-300 mt-1 block">
                3 hours ago
              </span>
            </div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full ml-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
