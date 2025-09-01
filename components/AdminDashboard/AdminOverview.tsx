'use client'

import React from 'react'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  CheckCircle, 
  TrendingUp,
  UserCheck,
  FileText,
  Globe,
  Shield,
  Clock
} from 'lucide-react'

const AdminOverview = () => {
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
              <h4 className="text-lg font-semibold text-white mb-4">Today's Stats</h4>
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

export default AdminOverview
