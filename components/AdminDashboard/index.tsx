'use client'

import React, { useState } from 'react'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  CheckCircle, 
  UserCheck,
  FileText,
  Globe,
  Shield,
  Clock,
  Bell,
  User
} from 'lucide-react'
import UserManagement from './UserManagement'
import ContentManagement from './ContentManagement'
import PlatformAnalytics from './PlatformAnalytics'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Navigation Header */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider font-sans bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg hover:from-blue-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 hover:drop-shadow-xl">
                  Lerniqo Admin
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex space-x-3 xl:space-x-4">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'users', label: 'User Management', icon: '👥' },
                { id: 'content', label: 'Content & Graph', icon: '📚' },
                { id: 'analytics', label: 'Analytics', icon: '📈' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative flex items-center space-x-3 px-5 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 overflow-hidden ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-500/30 scale-105 ring-2 ring-white/20'
                      : 'text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg'
                  }`}
                >
                  <div className={`text-lg lg:text-xl transition-transform duration-300 ${
                    activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="relative z-10 font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Notification Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationPopup(!showNotificationPopup);
                    setShowProfileDropdown(false);
                  }}
                  className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
                >
                  <Bell className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg ring-2 ring-white/30">
                    3
                  </div>
                </button>
              </div>

              {/* Profile Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotificationPopup(false);
                  }}
                  className="relative p-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg"
                >
                  <User className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'content' && <ContentManagement />}
          {activeTab === 'analytics' && <PlatformAnalytics />}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative z-10 mt-auto">
        <div className="backdrop-blur-xl bg-white/5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Lerniqo</h3>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                  Empowering administrators with comprehensive tools to manage and optimize 
                  educational platforms for the future of learning.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">
                  Admin Tools
                </h4>
                <ul className="space-y-2">
                  {['User Management', 'Content Moderation', 'Analytics Dashboard', 'System Settings'].map((link) => (
                    <li key={link}>
                      <button className="text-slate-400 hover:text-white transition-colors text-sm">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">
                  Support
                </h4>
                <ul className="space-y-2">
                  {['Documentation', 'System Status', 'Security Center', 'Contact Support'].map((link) => (
                    <li key={link}>
                      <button className="text-slate-400 hover:text-white transition-colors text-sm">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-slate-400 text-sm">
                  © 2024 Lerniqo Admin Dashboard. All rights reserved.
                </p>
                <div className="flex items-center space-x-6">
                  <span className="text-slate-400 text-sm">Made with</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-slate-400 text-sm">for educational excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

// Overview Section Component with premium styling
const OverviewSection = () => {
  const stats = [
    { label: 'Total Users', value: '2,456', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Teachers', value: '87', change: '+5%', icon: UserCheck, color: 'from-purple-600 to-purple-700' },
    { label: 'Content Items', value: '1,234', change: '+18%', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Pending Reviews', value: '23', change: '-3%', icon: Clock, color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm font-medium tracking-wide">Admin Overview</span>
        </div>
        <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Comprehensive platform insights and management tools at your fingertips
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color}/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-red-400 bg-red-400/20'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">from last month</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, label: 'Review Teacher Applications', color: 'from-blue-500 to-blue-600' },
              { icon: FileText, label: 'Moderate Content', color: 'from-purple-600 to-purple-700' },
              { icon: Globe, label: 'Update Knowledge Graph', color: 'from-indigo-500 to-indigo-600' }
            ].map((action, index) => {
              const IconComponent = action.icon
              return (
                <button 
                  key={index}
                  className={`group relative flex items-center space-x-4 p-6 bg-gradient-to-r ${action.color} text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden`}
                >
                  <div className="relative z-10 flex items-center space-x-4">
                    <IconComponent className="w-6 h-6" />
                    <span className="font-semibold">{action.label}</span>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { 
                  type: 'user', 
                  message: 'New teacher application from Dr. Sarah Johnson', 
                  time: '5 min ago',
                  icon: UserCheck,
                  color: 'text-blue-400'
                },
                { 
                  type: 'content', 
                  message: 'Content approved: Advanced Calculus', 
                  time: '1 hour ago',
                  icon: CheckCircle,
                  color: 'text-green-400'
                },
                { 
                  type: 'analytics', 
                  message: 'Weekly analytics report generated', 
                  time: '2 hours ago',
                  icon: BarChart3,
                  color: 'text-purple-400'
                },
                { 
                  type: 'system', 
                  message: 'Knowledge graph updated', 
                  time: '4 hours ago',
                  icon: Globe,
                  color: 'text-indigo-400'
                }
              ].map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <IconComponent className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{activity.message}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">System Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Server Uptime', value: '99.9%', color: 'text-green-400' },
                { label: 'Response Time', value: '145ms', color: 'text-blue-400' },
                { label: 'Active Sessions', value: '1,789', color: 'text-purple-400' },
                { label: 'Error Rate', value: '0.01%', color: 'text-orange-400' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-slate-300 font-medium">{metric.label}</span>
                  <span className={`font-bold text-lg ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Today&apos;s Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'New Users', value: '34' },
                  { label: 'Content Uploads', value: '12' },
                  { label: 'Support Tickets', value: '8' },
                  { label: 'Revenue', value: '$1,234' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
