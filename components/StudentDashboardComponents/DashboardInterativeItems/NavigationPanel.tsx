import React, { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  CalendarIcon,
  TrophyIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

export default function NavigationPanel() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    // { id: "profile", label: "Profile", icon: UserIcon },
    { id: "lesson-library", label: "Lesson Library", icon: BuildingLibraryIcon },
    { id: "learning-path", label: "Learning Path", icon: AcademicCapIcon },
    { id: "teachers", label: "Teachers", icon: UserGroupIcon },
    { id: "progress", label: "Progress", icon: ChartBarIcon },
    { id: "forum", label: "Forum", icon: ChatBubbleLeftRightIcon },
    { id: "my-sessions", label: "My Sessions", icon: CalendarIcon },
    // { id: "gamification", label: "Gamification", icon: TrophyIcon },
    { id: "ai-tutor", label: "AI Tutor", icon: SparklesIcon },
    { id: "settings", label: "Settings", icon: CogIcon },
  ];

  return (
    <div className="flex-1 h-full pointer-events-auto">
      <div className="bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-6 rounded-xl shadow-2xl h-full w-full backdrop-blur-sm border border-purple-400/30">
        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold">Navigation</h2>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
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
      </div>
    </div>
  );
}
