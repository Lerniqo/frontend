"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import WebinarHeader from "./WebinarHeader";
import VideoArea from "./VideoArea";
import ControlBar from "./ControlBar";
import Sidebar from "./Sidebar";

export interface Participant {
  id: string;
  name: string;
  role: "organizer" | "attendee";
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: "chat" | "question";
}

export interface WebinarData {
  id: string;
  title: string;
  status: "starting-soon" | "live" | "ended";
  startTime: Date;
  duration: number;
  organizerId: string;
}

interface WebinarRoomProps {
  webinarId: string;
}

export default function WebinarRoom({ webinarId }: WebinarRoomProps) {
  const router = useRouter();
  const [webinarData, setWebinarData] = useState<WebinarData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants">("chat");
  const [viewMode, setViewMode] = useState<"speaker" | "gallery">("speaker");
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [isUserVideoOn, setIsUserVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  const _videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate loading webinar data
    const loadWebinarData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockWebinar: WebinarData = {
          id: webinarId,
          title: "AI in Education 2025",
          status: "live",
          startTime: new Date(Date.now() - 300000), // Started 5 minutes ago
          duration: 60,
          organizerId: "organizer-1",
        };

        const mockParticipants: Participant[] = [
          {
            id: "organizer-1",
            name: "Dr. Sarah Johnson",
            role: "organizer",
            isVideoOn: true,
            isAudioOn: true,
            isScreenSharing: false,
          },
          {
            id: "user-1",
            name: "Current User",
            role: "attendee",
            isVideoOn: false,
            isAudioOn: false,
          },
          {
            id: "user-2",
            name: "John Smith",
            role: "attendee",
            isVideoOn: false,
            isAudioOn: false,
          },
          {
            id: "user-3",
            name: "Alice Brown",
            role: "attendee",
            isVideoOn: true,
            isAudioOn: true,
          },
        ];

        const mockMessages: ChatMessage[] = [
          {
            id: "1",
            userId: "organizer-1",
            userName: "Dr. Sarah Johnson",
            message: "Welcome everyone to our AI in Education webinar!",
            timestamp: new Date(Date.now() - 240000),
            type: "chat",
          },
          {
            id: "2",
            userId: "user-2",
            userName: "John Smith",
            message: "Thank you for hosting this session!",
            timestamp: new Date(Date.now() - 180000),
            type: "chat",
          },
          {
            id: "3",
            userId: "user-3",
            userName: "Alice Brown",
            message:
              "Can you share more about AI integration in classroom settings?",
            timestamp: new Date(Date.now() - 120000),
            type: "question",
          },
        ];

        setWebinarData(mockWebinar);
        setParticipants(mockParticipants);
        setChatMessages(mockMessages);
        setCurrentUser(mockParticipants.find((p) => p.id === "user-1") || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading webinar data:", error);
        setLoading(false);
      }
    };

    loadWebinarData();
  }, [webinarId]);

  // Timer for elapsed time
  useEffect(() => {
    if (webinarData?.status === "live") {
      const interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - webinarData.startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [webinarData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleLeaveWebinar = () => {
    if (confirm("Are you sure you want to leave the webinar?")) {
      router.back();
    }
  };

  const toggleMute = () => {
    setIsUserMuted(!isUserMuted);
    if (currentUser) {
      const updatedUser = { ...currentUser, isAudioOn: isUserMuted };
      setCurrentUser(updatedUser);
      setParticipants((prev) =>
        prev.map((p) => (p.id === currentUser.id ? updatedUser : p))
      );
    }
  };

  const toggleVideo = () => {
    setIsUserVideoOn(!isUserVideoOn);
    if (currentUser) {
      const updatedUser = { ...currentUser, isVideoOn: !isUserVideoOn };
      setCurrentUser(updatedUser);
      setParticipants((prev) =>
        prev.map((p) => (p.id === currentUser.id ? updatedUser : p))
      );
    }
  };

  const toggleScreenShare = () => {
    if (currentUser?.role === "organizer") {
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const sendMessage = (message: string, type: "chat" | "question" = "chat") => {
    if (!currentUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message,
      timestamp: new Date(),
      type,
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Joining Webinar...
          </h2>
          <p className="text-slate-400">
            Please wait while we connect you to the session
          </p>
        </div>
      </div>
    );
  }

  if (!webinarData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Webinar Not Found
          </h2>
          <p className="text-slate-400 mb-4">
            The webinar you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <WebinarHeader
        webinar={webinarData}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        onLeaveWebinar={handleLeaveWebinar}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <VideoArea
            participants={participants}
            viewMode={viewMode}
            setViewMode={setViewMode}
            currentUser={currentUser}
            isScreenSharing={isScreenSharing}
          />

          {/* Control Bar */}
          <ControlBar
            currentUser={currentUser}
            isUserMuted={isUserMuted}
            isUserVideoOn={isUserVideoOn}
            isScreenSharing={isScreenSharing}
            sidebarOpen={sidebarOpen}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleChat={() => {
              setSidebarTab("chat");
              setSidebarOpen(true);
            }}
            onToggleParticipants={() => {
              setSidebarTab("participants");
              setSidebarOpen(true);
            }}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={sidebarTab}
          setActiveTab={setSidebarTab}
          participants={participants}
          chatMessages={chatMessages}
          currentUser={currentUser}
          onSendMessage={sendMessage}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
