"use client";

import React from "react";
import { Participant } from "./WebinarRoom";

interface VideoAreaProps {
  participants: Participant[];
  viewMode: "speaker" | "gallery";
  setViewMode: (mode: "speaker" | "gallery") => void;
  currentUser: Participant | null;
  isScreenSharing: boolean;
}

export default function VideoArea({
  participants,
  viewMode,
  setViewMode,
  currentUser: _currentUser,
  isScreenSharing,
}: VideoAreaProps) {
  const organizer = participants.find((p) => p.role === "organizer");
  const attendees = participants.filter((p) => p.role === "attendee");

  const renderParticipantVideo = (participant: Participant, isMain = false) => {
    const videoSizeClass = isMain
      ? "w-full h-full"
      : viewMode === "gallery"
      ? "w-full h-48"
      : "w-32 h-24";

    return (
      <div
        key={participant.id}
        className={`relative ${videoSizeClass} bg-slate-800 rounded-lg overflow-hidden border border-slate-600`}
      >
        {/* Video placeholder or actual video */}
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          {participant.isVideoOn ? (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="text-white text-sm mt-2 text-center px-2">
                {participant.name}
              </span>
            </div>
          )}
        </div>

        {/* Participant info overlay */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1 flex items-center justify-between">
            <span className="text-white text-xs font-medium truncate">
              {participant.name}
              {participant.role === "organizer" && (
                <span className="ml-1 bg-blue-500 text-white text-xs px-1 rounded">
                  HOST
                </span>
              )}
            </span>
            <div className="flex items-center space-x-1">
              {!participant.isAudioOn && (
                <svg
                  className="w-3 h-3 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                </svg>
              )}
              {!participant.isVideoOn && (
                <svg
                  className="w-3 h-3 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82l8.18 8.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2zM16 16H5V7h.73L16 17.27V16z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Screen sharing indicator */}
        {participant.isScreenSharing && (
          <div className="absolute top-2 left-2">
            <div className="bg-green-500/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
              </svg>
              <span>Sharing</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => setViewMode("speaker")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              viewMode === "speaker"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            Speaker View
          </button>
          <button
            onClick={() => setViewMode("gallery")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              viewMode === "gallery"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            Gallery View
          </button>
        </div>

        {isScreenSharing && (
          <div className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-lg text-sm font-medium">
            Screen sharing is active
          </div>
        )}
      </div>

      {/* Video Layout */}
      {viewMode === "speaker" ? (
        <div className="flex space-x-4 h-full">
          {/* Main speaker video */}
          <div className="flex-1">
            {organizer && renderParticipantVideo(organizer, true)}
          </div>

          {/* Side participants */}
          <div className="w-36 space-y-2 overflow-y-auto">
            {attendees.map((participant) =>
              renderParticipantVideo(participant)
            )}
          </div>
        </div>
      ) : (
        /* Gallery view */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
          {participants.map((participant) =>
            renderParticipantVideo(participant)
          )}
        </div>
      )}

      {/* Screen sharing overlay */}
      {isScreenSharing && (
        <div className="absolute inset-4 bg-slate-900 rounded-lg border border-slate-600 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Screen Sharing Active
            </h3>
            <p className="text-slate-400">
              The presenter is sharing their screen
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
