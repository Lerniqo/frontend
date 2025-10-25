"use client";

import React from "react";
import ResourceLibrary from "@/components/ResourceLibrary/ResourceLibrary";
import SharedNavigation from "@/components/TeacherDashboard/SharedNavigation";
import TeacherFooter from "@/components/TeacherDashboard/TeacherFooter";
import { useAuth } from "@/contexts/AuthContext";

export default function ResourceLibraryPage() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Navigation */}
      <SharedNavigation onLogout={logout} />

      {/* Main content */}
      <main>
        <ResourceLibrary />
      </main>

      {/* Footer */}
      <TeacherFooter />
    </div>
  );
}
