"use client";

import React from "react";
import { WebinarData } from "./WebinarRoom";

interface WebinarHeaderProps {
  webinar: WebinarData;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  onLeaveWebinar: () => void;
}

export default function WebinarHeader({
  webinar,
  elapsedTime,
  formatTime,
  onLeaveWebinar,
}: WebinarHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500/20 text-red-300 border border-red-400/30";
      case "starting-soon":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
      case "ended":
        return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "● LIVE";
      case "starting-soon":
        return "Starting Soon";
      case "ended":
        return "Ended";
      default:
        return status;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Status */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-white">{webinar.title}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  webinar.status
                )}`}
              >
                {getStatusText(webinar.status)}
              </span>

              {webinar.status === "live" && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Additional Info */}
        <div className="hidden md:flex items-center space-x-6 text-slate-400 text-sm">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Participants</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Recording</span>
          </div>
        </div>

        {/* Right Section - Leave Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onLeaveWebinar}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            Leave Webinar
          </button>
        </div>
      </div>
    </div>
  );
}
