"use client";

import React, { useState, useEffect } from "react";
import {
  getAvailability,
  getAllTeachersSessions,
  AvailabilitySlot,
  TeacherSession,
} from "@/services/teacherDashboardService";
import AvailabilityManager from "./AvailabilityManager";
import SubMenu from "./SubMenu";
import CreateGroupSessionModal from "./CreateGroupSessionModal";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";

export default function ScheduleManagement() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [groupSessions, setGroupSessions] = useState<TeacherSession[]>([]);
  const [oneOnOneSessions, setOneOnOneSessions] = useState<TeacherSession[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeScheduleSubsection, setActiveScheduleSubsection] =
    useState("availability");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [availabilityRes, sessionsRes] = await Promise.all([
          getAvailability(),
          getAllTeachersSessions(),
        ]);

        if (availabilityRes.success)
          setAvailability(availabilityRes.data || []);

        if (sessionsRes.success && sessionsRes.data) {
          // Filter sessions by type
          const groupSessionsList = sessionsRes.data.filter(
            (session: TeacherSession) => session.session_type === "GROUP"
          );
          const oneOnOneSessionsList = sessionsRes.data.filter(
            (session: TeacherSession) => session.session_type === "ONE_ON_ONE"
          );

          setGroupSessions(groupSessionsList);
          setOneOnOneSessions(oneOnOneSessionsList);
        }
      } catch (error) {
        console.error("Error loading schedule management data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGroupSessionCreated = async () => {
    // Reload group sessions
    try {
      const sessionsRes = await getAllTeachersSessions();
      if (sessionsRes.success && sessionsRes.data) {
        const groupSessionsList = sessionsRes.data.filter(
          (session: TeacherSession) => session.session_type === "GROUP"
        );
        setGroupSessions(groupSessionsList);
      }
    } catch (error) {
      console.error("Error reloading group sessions:", error);
    }
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Schedule Management" />;
  }

  const scheduleItems = [
    {
      id: "availability",
      label: "Availability",
      icon: "📅",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "group-sessions",
      label: "Group Sessions",
      icon: "👥",
      color: "from-green-600 to-green-700",
    },
    {
      id: "one-on-one-sessions",
      label: "One on One Sessions",
      icon: "👤",
      color: "from-orange-600 to-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Navigation */}
      <SharedNavigation
        onLogout={() => {
          // Handle logout logic here
          console.warn("Logout functionality not implemented");
        }}
      />

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-20">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              Schedule Management Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Set your availability and schedule live sessions for your students
              with precision and ease.
            </p>
          </header>

          <div className="mb-16">
            <SubMenu
              items={scheduleItems}
              activeItem={activeScheduleSubsection}
              onItemChange={setActiveScheduleSubsection}
              title="Schedule Sections"
            />
          </div>

          <div className="transition-all duration-700 ease-in-out">
            {activeScheduleSubsection === "availability" && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                    <div className="absolute top-4 left-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          Availability Management
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <AvailabilityManager
                        availability={availability}
                        setAvailability={setAvailability}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeScheduleSubsection === "group-sessions" && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  {/* Add Group Session Button */}
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                    >
                      <span>➕</span>
                      Add Group Session
                    </button>
                  </div>

                  <div className="relative transition-all duration-300">
                    <div className="mt-8">
                      {groupSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                          {groupSessions.map((session) => (
                            <div key={session.session_id} className="h-110">
                              <SessionCard session={session} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">
                            No group sessions scheduled yet
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            Create your first group session to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeScheduleSubsection === "one-on-one-sessions" && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="relative transition-all duration-300">
                    <div className="mt-8">
                      {oneOnOneSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                          {oneOnOneSessions.map((session) => (
                            <div key={session.session_id} className="h-110">
                              <SessionCard session={session} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">
                            No one-on-one sessions scheduled yet
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            Create your first one-on-one session to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Create Group Session Modal */}
      <CreateGroupSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreated={handleGroupSessionCreated}
      />

      {/* Create Group Session Modal */}
      <CreateGroupSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreated={handleGroupSessionCreated}
      />

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
      `}</style>
    </div>
  );
}

/**
 * Session Card Component to display individual session details
 */
function SessionCard({ session }: { session: TeacherSession }) {
  const startDate = new Date(session.start_time);
  const endDate = new Date(session.end_time);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 p-[3px] h-full">
      {/* Inner white/gray background */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
              {session.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              ID: {session.session_id.slice(0, 8)}...
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              session.status
            )}`}
          >
            {session.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {session.description}
        </p>

        {/* Date and Time */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Date:</span> {formatDate(startDate)}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Time:</span> {formatTime(startDate)}{" "}
            - {formatTime(endDate)}
          </p>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-2 bg-gray-100 rounded">
            <p className="text-gray-600 font-semibold">Max Attendees</p>
            <p className="text-gray-900 font-bold">{session.max_attendees}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded">
            <p className="text-gray-600 font-semibold">Current Attendees</p>
            <p className="text-gray-900 font-bold">{session.attendees_count}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-semibold">
              {session.is_paid ? "Paid Session" : "Free Session"}
            </span>
            {session.is_paid && session.price && (
              <span className="text-lg font-bold text-amber-600">
                ${parseFloat(session.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <a
            href={session.zoom_start_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-200 text-center"
          >
            Join Zoom
          </a>
          <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-200">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
