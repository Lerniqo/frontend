'use client'

import React from 'react'
import AdminOverview from '@/components/AdminDashboard/AdminOverview'

const AdminDashboardPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <AdminOverview />
      </div>
    </main>
  )
}

export default AdminDashboardPage