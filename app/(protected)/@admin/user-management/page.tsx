"use client";

import React from "react";
import UserManagement from "@/components/AdminDashboard/UserManagement";

const UserManagementPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <UserManagement />
      </div>
    </main>
  );
};

export default UserManagementPage;
