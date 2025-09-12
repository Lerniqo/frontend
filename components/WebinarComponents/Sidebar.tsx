"use client";

import React, { useState, useRef, useEffect } from "react";
import { Participant, ChatMessage } from "./WebinarRoom";

interface SidebarProps {
  isOpen: boolean;
  activeTab: "chat" | "participants";
  setActiveTab: (tab: "chat" | "participants") => void;
  participants: Participant[];
  chatMessages: ChatMessage[];
  currentUser: Participant | null;
  onSendMessage: (message: string, type?: "chat" | "question") => void;
  onCloseSidebar: () => void;
}

export default function Sidebar({
  isOpen,
  activeTab,
  setActiveTab,
  participants,
  chatMessages,
  currentUser,
  onSendMessage,
  onCloseSidebar,
}: SidebarProps) {
  const [messageInput, setMessageInput] = useState("");
  const [messageType, setMessageType] = useState<"chat" | "question">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim(), messageType);
      setMessageInput("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const organizer = participants.find((p) => p.role === "organizer");
  const attendees = participants.filter((p) => p.role === "attendee");

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === "chat"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === "participants"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            Participants ({participants.length})
          </button>
        </div>

        <button
          onClick={onCloseSidebar}
          className="text-slate-400 hover:text-white transition-colors duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {message.userName}
                      </span>
                      {message.type === "question" && (
                        <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded border border-yellow-400/30">
                          Q&A
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {message.message}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setMessageType("chat")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all duration-300 ${
                    messageType === "chat"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setMessageType("question")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all duration-300 ${
                    messageType === "question"
                      ? "bg-yellow-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Q&A
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-2">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    messageType === "chat"
                      ? "Type a message..."
                      : "Ask a question..."
                  }
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm resize-none border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Send {messageType === "question" ? "Question" : "Message"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Participants Tab */
          <div className="p-4 space-y-4">
            {/* Organizer */}
            {organizer && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Host
                </h3>
                <div className="bg-slate-700/50 rounded-lg p-3 border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {organizer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {organizer.name}
                        </p>
                        <p className="text-blue-300 text-xs">Organizer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          organizer.isAudioOn ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full ${
                          organizer.isVideoOn ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                Attendees ({attendees.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {attendees.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-slate-700/30 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {participant.name}
                          </p>
                          {participant.id === currentUser?.id && (
                            <p className="text-blue-300 text-xs">(You)</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {participant.isAudioOn ? (
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                          </svg>
                        )}
                        {participant.isVideoOn ? (
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82l8.18 8.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2zM16 16H5V7h.73L16 17.27V16z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
