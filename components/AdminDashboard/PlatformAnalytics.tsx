'use client'

import React, { useState } from 'react'
import { 
  TrendingUp, 
  BarChart3, 
  Star, 
  Activity,
  Users,
  BookOpen,
  DollarSign,
  Target,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Eye,
  Clock,
  Award
} from 'lucide-react'

interface MetricData {
  label: string
  value: string
  trend: string
  isPositive: boolean
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const PlatformAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const keyMetrics: MetricData[] = [
    { 
      label: 'Student Engagement', 
      value: '87.3%', 
      trend: '+5.2%', 
      isPositive: true,
      icon: TrendingUp, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Average Progress', 
      value: '73.8%', 
      trend: '+12.1%', 
      isPositive: true,
      icon: BarChart3, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Teacher Performance', 
      value: '9.2/10', 
      trend: '+0.3', 
      isPositive: true,
      icon: Star, 
      color: 'from-purple-600 to-purple-700' 
    },
    { 
      label: 'Platform Revenue', 
      value: '$45.2K', 
      trend: '+18.7%', 
      isPositive: true,
      icon: DollarSign, 
      color: 'from-emerald-500 to-emerald-600' 
    }
  ]

  const performanceData = [
    { subject: 'Mathematics', completion: 89, engagement: 92, difficulty: 'Advanced' },
    { subject: 'Physics', completion: 84, engagement: 88, difficulty: 'Intermediate' },
    { subject: 'Chemistry', completion: 78, engagement: 85, difficulty: 'Beginner' },
    { subject: 'Biology', completion: 91, engagement: 94, difficulty: 'Intermediate' }
  ]

  const learningTrends = [
    { 
      category: 'Most Popular Subject', 
      value: 'Mathematics', 
      percentage: '34%',
      icon: BookOpen,
      color: 'text-blue-400'
    },
    { 
      category: 'Peak Learning Hours', 
      value: '2-6 PM', 
      percentage: '42%',
      icon: Clock,
      color: 'text-purple-400'
    },
    { 
      category: 'Top Teacher Rating', 
      value: 'Dr. Johnson', 
      percentage: '9.8/10',
      icon: Award,
      color: 'text-green-400'
    },
    { 
      category: 'Success Rate', 
      value: 'Course Completion', 
      percentage: '87%',
      icon: Target,
      color: 'text-indigo-400'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm font-medium tracking-wide">Platform Analytics</span>
        </div>
        <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Comprehensive insights into platform performance, user engagement, and learning outcomes
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="group relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Analytics Overview</h3>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <option value="24h" className="bg-slate-800 text-white">Last 24 Hours</option>
                <option value="7d" className="bg-slate-800 text-white">Last 7 Days</option>
                <option value="30d" className="bg-slate-800 text-white">Last 30 Days</option>
                <option value="90d" className="bg-slate-800 text-white">Last 90 Days</option>
              </select>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Download className="w-5 h-5" />
                <span className="font-semibold">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.color}/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    metric.isPositive 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-red-400 bg-red-400/20'
                  }`}>
                    {metric.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {metric.trend}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                  <p className="text-slate-400 text-xs mt-1">vs last period</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Subject Performance */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white">Subject Performance</h3>
              <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </div>

            <div className="space-y-6">
              {performanceData.map((subject, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/20 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{subject.subject}</h4>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            subject.difficulty === 'Advanced' ? 'text-red-300 bg-red-400/20' :
                            subject.difficulty === 'Intermediate' ? 'text-yellow-300 bg-yellow-400/20' :
                            'text-green-300 bg-green-400/20'
                          }`}>
                            {subject.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 flex-1 max-w-md">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300 text-sm">Completion</span>
                            <span className="text-white font-semibold">{subject.completion}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{width: `${subject.completion}%`}}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300 text-sm">Engagement</span>
                            <span className="text-white font-semibold">{subject.engagement}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-500"
                              style={{width: `${subject.engagement}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Learning Trends</h3>
            <div className="space-y-4">
              {learningTrends.map((trend, index) => {
                const IconComponent = trend.icon
                return (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${trend.color}`} />
                      <span className="text-slate-300 font-medium">{trend.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white">{trend.value}</div>
                      <div className={`text-sm ${trend.color}`}>{trend.percentage}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Platform Statistics</h3>
            <div className="space-y-4">
              {[
                { label: 'Daily Active Users', value: '1,234', icon: Users, color: 'text-blue-400' },
                { label: 'Session Duration', value: '42 min', icon: Clock, color: 'text-purple-400' },
                { label: 'Course Completion', value: '87%', icon: Target, color: 'text-green-400' },
                { label: 'User Satisfaction', value: '4.8/5', icon: Star, color: 'text-yellow-400' }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-slate-300 font-medium">{stat.label}</span>
                    </div>
                    <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Sessions', value: '156', icon: Activity, color: 'from-green-500 to-green-600' },
              { label: 'Questions Solved', value: '2,341', icon: Target, color: 'from-blue-500 to-blue-600' },
              { label: 'Live Lessons', value: '23', icon: Eye, color: 'from-purple-600 to-purple-700' }
            ].map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{activity.value}</div>
                  <div className="text-slate-400 text-sm">{activity.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformAnalytics
