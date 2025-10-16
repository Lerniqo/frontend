"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllGroupSessions,
  getMySessions,
  SessionWithTeacher,
  Session,
} from "@/services/schedulingService";
import SubMenu from "@/components/TeacherDashboard/SubMenu";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import {
  ArrowLeft,
  Clock,
  Users,
  Video,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";

interface SessionDetailModalProps {
  session: SessionWithTeacher | null;
  isRegistered: boolean;
  onClose: () => void;
  onRegister: (sessionId: string) => void;
  onUnregister: (sessionId: string) => void;
}

function SessionDetailModal({
  session,
  isRegistered,
  onClose,
  onRegister,
  onUnregister,
}: SessionDetailModalProps) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky flex flex-row top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">{session.title}</h2>
          <p className="text-purple-100 mt-1">{session.description}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Start Time</p>
                <p className="font-semibold text-gray-800">
                  {new Date(session.start_time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">End Time</p>
                <p className="font-semibold text-gray-800">
                  {new Date(session.end_time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Attendees</p>
                <p className="font-semibold text-gray-800">
                  {session.attendees_count} / {session.max_attendees}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Price</p>
                <p className="font-semibold text-gray-800">
                  {session.is_paid && session.price
                    ? `$${session.price.toFixed(2)}`
                    : "Free"}
                </p>
              </div>
            </div>

            {session.teacher_name && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg col-span-full">
                <User className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-600">Teacher</p>
                  <p className="font-semibold text-gray-800">
                    {session.teacher_name}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg col-span-full">
              <Video className="w-5 h-5 text-pink-600" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Video Conference</p>
                <a
                  href={session.zoom_start_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pink-600 hover:text-pink-700 underline break-all"
                >
                  {session.zoom_start_url}
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            {isRegistered ? (
              <button
                onClick={() => onUnregister(session.session_id)}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all"
              >
                Unregister
              </button>
            ) : (
              <button
                onClick={() => onRegister(session.session_id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allGroupSessions, setAllGroupSessions] = useState<Session[]>([]);
  const [mySessions, setMySessions] = useState<SessionWithTeacher[]>([]);
  const [viewMode, setViewMode] = useState<"one-on-one" | "group">("group");
  const [selectedSession, setSelectedSession] =
    useState<SessionWithTeacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisteredSession, setIsRegisteredSession] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupSessions, userSessions] = await Promise.all([
        getAllGroupSessions(),
        getMySessions(),
      ]);

      setAllGroupSessions(groupSessions);
      setMySessions(userSessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSessionRegistered = (sessionId: string): boolean => {
    return mySessions.some((s) => s.session_id === sessionId);
  };

  const handleSessionClick = (session: Session, registered: boolean) => {
    setSelectedSession(session as SessionWithTeacher);
    setIsRegisteredSession(registered);
    setIsModalOpen(true);
  };

  const handleRegister = (sessionId: string) => {
    console.warn(`Register for session: ${sessionId}`);
    // TODO: Implement registration logic
    setIsModalOpen(false);
  };

  const handleUnregister = (sessionId: string) => {
    console.warn(`Unregister from session: ${sessionId}`);
    // TODO: Implement unregistration logic
    setIsModalOpen(false);
  };

  const getFilteredMySessions = () => {
    if (viewMode === "one-on-one") {
      return mySessions.filter((s) => s.session_type === "ONE_ON_ONE");
    } else {
      return mySessions.filter((s) => s.session_type === "GROUP");
    }
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Sessions" />;
  }

  const viewItems = [
    {
      id: "group",
      label: "Group Sessions",
      icon: "👥",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "one-on-one",
      label: "One-on-One Sessions",
      icon: "🎯",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <section className="relative z-10 py-16">
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-8 relative">
            <div className="absolute top-0 right-0">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300/60 transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                  Back to Dashboard
                </span>
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              Live Sessions
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Join group sessions or schedule one-on-one tutoring with expert
              teachers.
            </p>
          </header>

          {/* All Group Sessions - Horizontal Scroll */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Available Group Sessions
            </h2>
            <div className="relative">
              <div
                id="cards-container"
                className="flex overflow-x-auto space-x-6 lg:space-x-8 pt-3 pb-8 scroll-smooth"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {allGroupSessions.map((session, index) => {
                  const registered = isSessionRegistered(session.session_id);
                  const isFull =
                    session.attendees_count >= session.max_attendees;

                  // Only Purple and Blue gradients
                  const gradients = [
                    {
                      from: "from-purple-500",
                      to: "to-indigo-600",
                      hover: "hover:shadow-purple-300/60",
                      textColor: "text-purple-100",
                      iconColor: "text-purple-600",
                      btnFrom: "from-purple-600",
                      btnTo: "to-indigo-700",
                      btnHoverFrom: "hover:from-purple-700",
                      btnHoverTo: "hover:to-indigo-800",
                      borderColor: "border-purple-200/60",
                    },
                    {
                      from: "from-blue-500",
                      to: "to-indigo-600",
                      hover: "hover:shadow-blue-300/60",
                      textColor: "text-blue-100",
                      iconColor: "text-blue-600",
                      btnFrom: "from-blue-600",
                      btnTo: "to-indigo-700",
                      btnHoverFrom: "hover:from-blue-700",
                      btnHoverTo: "hover:to-indigo-800",
                      borderColor: "border-blue-200/60",
                    },
                  ];

                  const gradient = registered
                    ? {
                        from: "from-gray-800",
                        to: "to-gray-300",
                        hover: "hover:shadow-gray-300/60",
                        textColor: "text-gray-100",
                        iconColor: "text-gray-600",
                        btnFrom: "from-gray-600",
                        btnTo: "to-gray-700",
                        btnHoverFrom: "hover:from-gray-700",
                        btnHoverTo: "hover:to-emerald-800",
                        borderColor: "border-green-200/60",
                      }
                    : gradients[index % gradients.length];

                  return (
                    <div
                      key={session.session_id}
                      className={`flex-shrink-0 w-[360px] bg-white rounded-2xl shadow-xl border ${gradient.borderColor} transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${gradient.hover} group flex flex-col overflow-hidden cursor-pointer`}
                      onClick={() => handleSessionClick(session, registered)}
                    >
                      {/* Header with gradient background - Increased height */}
                      <div
                        className={`h-32 flex items-start justify-between gap-3 bg-gradient-to-br ${gradient.from} ${gradient.to} px-6 py-5`}
                      >
                        {/* Left side: Title and Subtitle (2 lines) */}
                        <div className="flex-1 flex flex-col gap-2 overflow-hidden min-w-0">
                          <h3
                            className="text-lg font-bold text-white tracking-tight leading-tight"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
                          >
                            {session.title}
                          </h3>
                          <p
                            className={`${gradient.textColor} text-xs font-medium leading-relaxed line-clamp-2`}
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                          >
                            {session.description}
                          </p>
                        </div>

                        {/* Right side: Price and Attendees */}
                        <div className="flex-shrink-0 flex flex-col items-end gap-2.5">
                          <p
                            className="text-xl font-bold text-white tracking-tight"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}
                          >
                            {session.is_paid && session.price
                              ? `$${session.price.toFixed(2)}`
                              : "Free"}
                          </p>
                          <div
                            className={`flex items-center gap-1.5 ${gradient.textColor} text-xs font-semibold`}
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                          >
                            <Users
                              className="w-3.5 h-3.5 flex-shrink-0"
                              strokeWidth={2.5}
                            />
                            <span className="whitespace-nowrap">
                              {session.attendees_count} /{" "}
                              {session.max_attendees}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Body - Reduced padding */}
                      <div className="px-6 py-4 flex flex-col flex-grow">
                        {/* Calendar and Clock - At opposite ends */}
                        <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className={`w-[18px] h-[18px] ${gradient.iconColor}`}
                              strokeWidth={2.2}
                            />
                            <span className="font-medium">
                              {new Date(
                                session.start_time
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock
                              className={`w-[18px] h-[18px] ${gradient.iconColor}`}
                              strokeWidth={2.2}
                            />
                            <span className="font-medium">
                              {new Date(session.start_time).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Action Button - Reduced margin */}
                        {registered ? (
                          <button
                            className={`w-full bg-gradient-to-r ${gradient.btnFrom} ${gradient.btnTo} text-white font-semibold py-3 rounded-xl ${gradient.btnHoverFrom} ${gradient.btnHoverTo} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.02] shadow-md hover:shadow-lg`}
                          >
                            View Details
                          </button>
                        ) : isFull ? (
                          <button className="w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed shadow-sm">
                            Registration Full
                          </button>
                        ) : (
                          <button
                            className={`w-full bg-gradient-to-r ${gradient.btnFrom} ${gradient.btnTo} text-white font-semibold py-3 rounded-xl ${gradient.btnHoverFrom} ${gradient.btnHoverTo} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-[1.02] shadow-md hover:shadow-lg`}
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="mb-8">
            <SubMenu
              items={viewItems}
              activeItem={viewMode}
              onItemChange={(item) =>
                setViewMode(item as "one-on-one" | "group")
              }
              title="My Sessions"
            />
          </div>

          {/* My Sessions List */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredMySessions().length > 0 ? (
                getFilteredMySessions().map((session) => (
                  <div
                    key={session.session_id}
                    className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleSessionClick(session, true)}
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {session.description}
                    </p>
                    <div className="space-y-2 text-sm mb-4">
                      {session.teacher_name && (
                        <div className="flex items-center text-gray-700">
                          <User className="w-4 h-4 mr-2 text-yellow-600" />
                          {session.teacher_name}
                        </div>
                      )}
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        {new Date(session.start_time).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-purple-500" />
                        {new Date(session.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(session.zoom_join_url, "_blank");
                        }}
                      >
                        Join
                      </button>
                      <button
                        className="flex-1 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSessionClick(session, true);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="text-lg">
                    No {viewMode === "one-on-one" ? "one-on-one" : "group"}{" "}
                    sessions scheduled yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Session Detail Modal */}
      {isModalOpen && (
        <SessionDetailModal
          session={selectedSession}
          isRegistered={isRegisteredSession}
          onClose={() => setIsModalOpen(false)}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
        />
      )}

      {/* CSS for animations */}
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

        :global(.animate-blob) {
          animation: blob 7s infinite;
        }

        :global(.animation-delay-2000) {
          animation-delay: 2s;
        }

        :global(.animation-delay-4000) {
          animation-delay: 4s;
        }

        /* Hide scrollbar for cards container */
        #cards-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
