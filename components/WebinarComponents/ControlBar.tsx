"use client";

import React, { useState } from "react";
import { Participant } from "./WebinarRoom";

interface ControlBarProps {
  currentUser: Participant | null;
  isUserMuted: boolean;
  isUserVideoOn: boolean;
  isScreenSharing: boolean;
  sidebarOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleSidebar: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
}

export default function ControlBar({
  currentUser,
  isUserMuted,
  isUserVideoOn,
  isScreenSharing,
  sidebarOpen: _sidebarOpen,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleSidebar: _onToggleSidebar,
  onToggleChat,
  onToggleParticipants,
}: ControlBarProps) {
  const [showSettings, setShowSettings] = useState(false);

  const isOrganizer = currentUser?.role === "organizer";

  const ControlButton = ({
    onClick,
    active,
    disabled = false,
    children,
    tooltip,
  }: {
    onClick: () => void;
    active: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-3 rounded-full transition-all duration-300 ${
        disabled
          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
          : active
          ? "bg-blue-500 text-white shadow-lg"
          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border-t border-white/10 px-6 py-4">
      <div className="flex items-center justify-center space-x-4">
        {/* Microphone Control */}
        <ControlButton
          onClick={onToggleMute}
          active={!isUserMuted}
          tooltip={isUserMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isUserMuted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
          )}
        </ControlButton>

        {/* Video Control */}
        <ControlButton
          onClick={onToggleVideo}
          active={isUserVideoOn}
          tooltip={isUserVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isUserVideoOn ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82l8.18 8.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2zM16 16H5V7h.73L16 17.27V16z" />
            </svg>
          )}
        </ControlButton>

        {/* Screen Share Control (Organizer only) */}
        <ControlButton
          onClick={onToggleScreenShare}
          active={isScreenSharing}
          disabled={!isOrganizer}
          tooltip={
            !isOrganizer
              ? "Only organizers can share screen"
              : isScreenSharing
              ? "Stop sharing screen"
              : "Share screen"
          }
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
          </svg>
        </ControlButton>

        {/* Participants */}
        <ControlButton
          onClick={onToggleParticipants}
          active={false}
          tooltip="Show participants"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.02 3.02 0 0 0 16.93 6.5H15.5c-.8 0-1.53.32-2.06.85l-7.15 7.15A2.99 2.99 0 0 0 8.4 18.5h2.1v3.5h2v-3.5h2v3.5h2v-3.5h2v3.5h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z" />
          </svg>
        </ControlButton>

        {/* Chat */}
        <ControlButton
          onClick={onToggleChat}
          active={false}
          tooltip="Open chat"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </ControlButton>

        {/* Settings */}
        <div className="relative">
          <ControlButton
            onClick={() => setShowSettings(!showSettings)}
            active={showSettings}
            tooltip="Settings"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
          </ControlButton>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute bottom-16 right-0 w-64 bg-slate-800 rounded-lg border border-slate-600 shadow-xl z-10">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-4">
                  Audio & Video Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Camera
                    </label>
                    <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                      <option>Default Camera</option>
                      <option>External Webcam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Microphone
                    </label>
                    <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                      <option>Default Microphone</option>
                      <option>External Microphone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Speaker
                    </label>
                    <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                      <option>Default Speaker</option>
                      <option>External Speaker</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors duration-300"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
