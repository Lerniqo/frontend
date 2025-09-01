'use client'

import React from 'react'
import PlatformAnalytics from '@/components/AdminDashboard/PlatformAnalytics'

const AnalyticsPage = () => {
  return (
    <main className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Platform Analytics</h1>
          <p className="text-slate-400 text-lg">Monitor platform performance, user engagement, and key metrics</p>
        </div>
        <PlatformAnalytics />
      </div>
    </main>
  )
}

export default AnalyticsPage
