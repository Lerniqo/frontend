'use client'

import React from 'react'
import ContentManagement from '@/components/AdminDashboard/ContentManagement'

const ContentManagementPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-slate-400 text-lg">Manage courses, lessons, and learning graph structure</p>
        </div>
        <ContentManagement />
      </div>
    </main>
  )
}

export default ContentManagementPage
