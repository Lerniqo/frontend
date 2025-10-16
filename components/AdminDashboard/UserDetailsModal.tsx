"use client";

import React from "react";
import { X, Mail, Award, Calendar, CheckCircle, XCircle } from "lucide-react";

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Student":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: "from-blue-500 to-blue-600",
        };
      case "Teacher":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: "from-purple-600 to-purple-700",
        };
      case "Admin":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
          icon: "from-indigo-500 to-indigo-600",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "from-gray-500 to-gray-600",
        };
    }
  };

  const roleColor = getRoleColor(user.role);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden flex flex-col">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${roleColor.icon} p-4 sm:p-6 relative overflow-hidden flex-shrink-0`}
          >
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-all duration-200 z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex items-center space-x-3">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${roleColor.icon} rounded-lg flex items-center justify-center shadow-lg ring-2 ring-white/20 flex-shrink-0`}
              >
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white line-clamp-1">
                  {user.fullName}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 flex-shrink-0">
            {/* Contact Information */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-700 flex items-center space-x-1">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Contact</span>
              </h3>
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-200/50">
                <p className="text-xs text-gray-900 font-medium break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account Status - Compact */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-700 flex items-center space-x-1">
                <Award className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Status</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Verification Status */}
                <div
                  className={`rounded p-2 border-2 ${
                    user.isVerified
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start space-x-1">
                    {user.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        Email
                      </p>
                      <p
                        className={`font-bold text-xs ${
                          user.isVerified ? "text-green-700" : "text-yellow-700"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Completion Status */}
                <div
                  className={`rounded p-2 border-2 ${
                    user.isProfileCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start space-x-1">
                    {user.isProfileCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        Profile
                      </p>
                      <p
                        className={`font-bold text-xs ${
                          user.isProfileCompleted
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {user.isProfileCompleted ? "Complete" : "Incomplete"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Dates - Compact */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-700 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Timeline</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Created Date */}
                <div className="bg-indigo-50 rounded p-2 border border-indigo-200/50">
                  <p className="text-xs font-semibold text-gray-600">Created</p>
                  <p className="text-xs font-bold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Last Updated Date */}
                <div className="bg-purple-50 rounded p-2 border border-purple-200/50">
                  <p className="text-xs font-semibold text-gray-600">Updated</p>
                  <p className="text-xs font-bold text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* User ID - Compact */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">User ID</p>
              <p className="text-xs text-gray-900 font-mono break-all bg-gray-50 rounded p-2 border border-gray-200">
                {user.userId}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 p-3 flex flex-col-reverse sm:flex-row justify-end gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              Close
            </button>
           
          </div>

          {/* Animation */}
          <style jsx>{`
            @keyframes scale-in {
              0% {
                opacity: 0;
                transform: scale(0.95);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-scale-in {
              animation: scale-in 0.3s ease-out;
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default UserDetailsModal;
