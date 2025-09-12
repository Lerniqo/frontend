"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  // This component serves as a fallback, but the actual dashboard content
  // will be rendered through the parallel routes (@teacher, @student, @admin)
  // in the protected layout based on user role

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600">Hello, {user.fullName || user.email}!</p>
        <p className="text-sm text-gray-500 mt-2">Role: {user.role}</p>
      </div>
    </div>
  );
}
