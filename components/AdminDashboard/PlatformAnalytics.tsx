'use client'

import React from 'react'
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
  ArrowDown
} from 'lucide-react'

interface MetricData {
  label: string
  value: string
  trend: string
  isPositive: boolean
  icon: React.ComponentType<any>
  color: string
}

const PlatformAnalytics = () => {
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
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Platform Health', 
      value: '98.7%', 
      trend: '+1.2%', 
      isPositive: true,
      icon: Activity, 
      color: 'from-indigo-500 to-indigo-600' 
    }
  ]

  const engagementData = [
    { metric: 'Daily Active Users', value: '1,789', percentage: 89 },
    { metric: 'Course Completion Rate', value: '73.8%', percentage: 74 },
    { metric: 'Average Session Duration', value: '24 min', percentage: 67 },
    { metric: 'User Retention (30 days)', value: '85.2%', percentage: 85 }
  ]

  const difficultyAreas = [
    { subject: 'Advanced Calculus', struggleRate: 67, students: 234 },
    { subject: 'Quantum Physics', struggleRate: 71, students: 189 },
    { subject: 'Organic Chemistry', struggleRate: 58, students: 267 },
    { subject: 'Linear Algebra', struggleRate: 52, students: 198 }
  ]

  const topTeachers = [
    { name: 'Dr. Smith', rating: 9.8, students: 1245, subject: 'Mathematics' },
    { name: 'Prof. Johnson', rating: 9.7, students: 987, subject: 'Physics' },
    { name: 'Ms. Davis', rating: 9.5, students: 876, subject: 'Chemistry' },
    { name: 'Dr. Wilson', rating: 9.4, students: 654, subject: 'Biology' }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.isPositive ? (
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-sm ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend} this week
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Platform Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Student Engagement Metrics</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            {engagementData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{item.metric}</span>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{width: `${item.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Marketplace Activity</h3>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50/50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">$12,456</p>
                <p className="text-xs text-green-500">+18% this month</p>
              </div>
              <div className="bg-gray-50/50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-xl font-bold text-blue-600">1,234</p>
                <p className="text-xs text-blue-500">+7% this month</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Teacher Earnings</span>
                <span className="font-semibold text-purple-600">$8,901</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Commission</span>
                <span className="font-semibold text-indigo-600">$3,555</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Popular Category</span>
                <span className="font-semibold text-orange-600">Mathematics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Common Difficulty Areas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Difficulty Areas</h3>
            <Target className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-4">
            {difficultyAreas.map((area, index) => (
              <div key={index} className="p-3 bg-gray-50/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{area.subject}</span>
                  <span className="text-sm text-red-600">{area.struggleRate}%</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Struggle Rate</span>
                  <span>{area.students} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full" 
                    style={{width: `${area.struggleRate}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Teachers */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Teachers</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div key={index} className="p-3 bg-gray-50/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{teacher.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{teacher.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{teacher.subject}</span>
                  <span>{teacher.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Popularity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Popular Content</h3>
            <BookOpen className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', enrollments: 1456, growth: '+12%' },
              { subject: 'Physics', enrollments: 1234, growth: '+8%' },
              { subject: 'Chemistry', enrollments: 987, growth: '+15%' },
              { subject: 'Biology', enrollments: 876, growth: '+6%' }
            ].map((content, index) => (
              <div key={index} className="p-3 bg-gray-50/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">{content.subject}</span>
                  <span className="text-sm text-green-600">{content.growth}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Enrollments</span>
                  <span className="font-medium">{content.enrollments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Student Success</h4>
            <p className="text-sm text-blue-800 mb-3">
              Overall student engagement is up 5.2% this week, with particularly strong performance in Mathematics and Physics courses.
            </p>
            <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
              View Details
            </button>
          </div>
          
          <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Content Quality</h4>
            <p className="text-sm text-purple-800 mb-3">
              Teacher-submitted content maintains high quality with an average score of 8.7/10. Consider featuring top-rated content.
            </p>
            <button className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors">
              Review Content
            </button>
          </div>
          
          <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Revenue Growth</h4>
            <p className="text-sm text-green-800 mb-3">
              Marketplace revenue is up 18% this month. Consider expanding popular course categories.
            </p>
            <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
              Analyze Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformAnalytics
