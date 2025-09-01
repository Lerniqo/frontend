'use client'

import React from 'react'
import { 
  Globe, 
  FileText, 
  Star, 
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'

interface ContentItem {
  id: number
  title: string
  subject: string
  teacher: string
  uploadDate: string
  status: 'pending' | 'approved' | 'flagged' | 'rejected'
  qualityScore?: number
}

const ContentManagement = () => {
  const recentContent: ContentItem[] = [
    { 
      id: 1, 
      title: 'Advanced Calculus - Integration Techniques', 
      subject: 'Mathematics', 
      teacher: 'Dr. Smith', 
      uploadDate: '2024-01-15',
      status: 'pending',
      qualityScore: 8.5
    },
    { 
      id: 2, 
      title: 'Quantum Mechanics Fundamentals', 
      subject: 'Physics', 
      teacher: 'Prof. Johnson', 
      uploadDate: '2024-01-14',
      status: 'approved',
      qualityScore: 9.2
    },
    { 
      id: 3, 
      title: 'Organic Chemistry Reactions', 
      subject: 'Chemistry', 
      teacher: 'Ms. Davis', 
      uploadDate: '2024-01-13',
      status: 'flagged',
      qualityScore: 6.8
    },
    { 
      id: 4, 
      title: 'Cell Division and Mitosis', 
      subject: 'Biology', 
      teacher: 'Dr. Wilson', 
      uploadDate: '2024-01-12',
      status: 'approved',
      qualityScore: 8.9
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'flagged': return 'bg-red-100 text-red-800 border-red-200'
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'flagged': return <AlertTriangle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Knowledge Graph Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Graph Structure</h3>
            <Globe className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Matters (Subjects)</span>
              <span className="font-semibold text-blue-600 text-lg">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Molecules (Topics)</span>
              <span className="font-semibold text-purple-600 text-lg">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Atoms (Concepts)</span>
              <span className="font-semibold text-indigo-600 text-lg">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prerequisite Links</span>
              <span className="font-semibold text-green-600 text-lg">2,456</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Content Moderation Queue</h3>
            <FileText className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Review</span>
              <span className="font-semibold text-orange-600 text-lg">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Today</span>
              <span className="font-semibold text-green-600 text-lg">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rejected</span>
              <span className="font-semibold text-red-600 text-lg">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quality Score Avg</span>
              <span className="font-semibold text-blue-600 text-lg">8.7/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Tools */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex flex-col items-center space-y-3 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group">
            <Globe className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-center">Edit Knowledge Graph</span>
            <span className="text-sm opacity-90 text-center">Add/modify concepts and prerequisites</span>
          </button>
          
          <button className="flex flex-col items-center space-y-3 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg group">
            <FileText className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-center">Review Content</span>
            <span className="text-sm opacity-90 text-center">Moderate teacher submissions</span>
          </button>
          
          <button className="flex flex-col items-center space-y-3 p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg group">
            <Star className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-center">Quality Assurance</span>
            <span className="text-sm opacity-90 text-center">Ensure academic accuracy</span>
          </button>
        </div>
      </div>

      {/* Recent Content Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Content Activity</h3>
        <div className="space-y-4">
          {recentContent.map((content) => (
            <div key={content.id} className="bg-white/50 rounded-lg p-5 border border-white/30 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900">{content.title}</h4>
                  <p className="text-gray-600 text-sm">{content.subject}</p>
                  <p className="text-gray-500 text-sm">by {content.teacher}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-sm text-gray-500">Upload Date</p>
                  <p className="font-medium text-gray-900">{content.uploadDate}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-sm text-gray-500">Quality Score</p>
                  <div className="flex items-center justify-center lg:justify-start space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <p className="font-medium text-gray-900">{content.qualityScore}/10</p>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                    {getStatusIcon(content.status)}
                    <span className="capitalize">{content.status}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Graph Management */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Knowledge Graph Management</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recent Graph Updates</h4>
            <div className="space-y-3">
              {[
                { action: 'Added new concept', item: 'Linear Algebra - Eigenvalues', time: '2 hours ago' },
                { action: 'Updated prerequisites', item: 'Calculus III - Multivariable Functions', time: '4 hours ago' },
                { action: 'Created new topic', item: 'Advanced Physics - Thermodynamics', time: '6 hours ago' }
              ].map((update, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{update.action}</p>
                    <p className="text-xs text-gray-600">{update.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{update.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Graph Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-blue-600">87.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                <span className="text-gray-600">Active Connections</span>
                <span className="font-semibold text-purple-600">2,456</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                <span className="text-gray-600">Orphaned Concepts</span>
                <span className="font-semibold text-orange-600">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentManagement
