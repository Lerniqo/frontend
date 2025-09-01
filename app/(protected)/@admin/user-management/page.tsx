'use client'

import React from 'react'
import UserManagement from '@/components/AdminDashboard/UserManagement'

const UserManagementPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400 text-lg">Manage users, roles, and permissions across the platform</p>
        </div>
        <UserManagement />
      </div>
    </main>
  )
}

export default UserManagementPage
