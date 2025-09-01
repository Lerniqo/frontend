'use client'

import React, { useState } from 'react'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  UserCheck,
  FileText,
  Globe,
  Activity,
  Shield,
  Star,
  Clock
} from 'lucide-react'
import UserManagement from './UserManagement'
import ContentManagement from './ContentManagement'
import PlatformAnalytics from './PlatformAnalytics'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive platform management and analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'content', label: 'Content & Knowledge Graph', icon: BookOpen },
              { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'analytics' && <PlatformAnalytics />}
        </div>
      </div>
    </div>
  )
}

// Overview Section Component
const OverviewSection = () => {
  const stats = [
    { label: 'Total Users', value: '2,456', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Teachers', value: '87', change: '+5%', icon: UserCheck, color: 'from-purple-500 to-purple-600' },
    { label: 'Content Items', value: '1,234', change: '+18%', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Pending Reviews', value: '23', change: '-3%', icon: Clock, color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Shield className="w-5 h-5" />
            <span>Review Teacher Applications</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <FileText className="w-5 h-5" />
            <span>Moderate Content</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Globe className="w-5 h-5" />
            <span>Update Knowledge Graph</span>
          </button>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Platform Activity</h3>
        <div className="space-y-3">
          {[
            { 
              type: 'user', 
              message: 'New teacher application received from Dr. Sarah Johnson', 
              time: '5 minutes ago',
              icon: UserCheck,
              color: 'text-blue-500'
            },
            { 
              type: 'content', 
              message: 'Content approved: Advanced Calculus - Integration Techniques', 
              time: '1 hour ago',
              icon: CheckCircle,
              color: 'text-green-500'
            },
            { 
              type: 'analytics', 
              message: 'Weekly analytics report generated successfully', 
              time: '2 hours ago',
              icon: BarChart3,
              color: 'text-purple-500'
            },
            { 
              type: 'system', 
              message: 'Knowledge graph updated with 15 new concepts', 
              time: '4 hours ago',
              icon: Globe,
              color: 'text-indigo-500'
            }
          ].map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                <IconComponent className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time</span>
              <span className="font-semibold text-blue-600">145ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-semibold text-purple-600">1,789</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-semibold text-orange-600">0.01%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Registrations</span>
              <span className="font-semibold text-green-600">34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Content Uploads</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Support Tickets</span>
              <span className="font-semibold text-orange-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Today</span>
              <span className="font-semibold text-purple-600">$1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
