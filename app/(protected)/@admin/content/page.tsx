'use client'

import React from 'react'
import ContentManagement from '@/components/AdminDashboard/ContentManagement'

const ContentManagementPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <ContentManagement />
      </div>
    </main>
  )
}

export default ContentManagementPage
