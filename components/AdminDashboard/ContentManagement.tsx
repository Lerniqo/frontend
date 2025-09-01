'use client'

import React, { useState } from 'react'
import { 
  Globe, 
  FileText, 
  Star, 
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  User,
  Calendar,
  Award,
  TrendingUp,
  XCircle
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
      title: 'Linear Algebra Fundamentals', 
      subject: 'Mathematics', 
      teacher: 'Dr. Chen', 
      uploadDate: '2024-01-12',
      status: 'approved',
      qualityScore: 8.9
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'pending': return 'text-orange-400 bg-orange-400/20 border-orange-400/30'
      case 'flagged': return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'rejected': return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'flagged': return <AlertTriangle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const handleContentAction = (_id: number, _action: string) => {
    // console.log(`Content ${id} ${action}`)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm font-medium tracking-wide">Content Management</span>
        </div>
        <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Content & Knowledge Graph
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage educational content, moderate uploads, and maintain the knowledge graph
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Content', value: '1,234', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
          { label: 'Pending Review', value: '23', icon: Clock, color: 'from-orange-500 to-orange-600' },
          { label: 'Knowledge Nodes', value: '5,678', icon: Globe, color: 'from-purple-600 to-purple-700' },
          { label: 'Quality Score', value: '8.7/10', icon: Star, color: 'from-green-500 to-green-600' }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color}/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filter */}
      <div className="group relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content by title, subject, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <option value="all" className="bg-slate-800 text-white">All Status</option>
                <option value="pending" className="bg-slate-800 text-white">Pending</option>
                <option value="approved" className="bg-slate-800 text-white">Approved</option>
                <option value="flagged" className="bg-slate-800 text-white">Flagged</option>
                <option value="rejected" className="bg-slate-800 text-white">Rejected</option>
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white">Recent Content Uploads</h3>
              <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{recentContent.length} Items</span>
              </div>
            </div>

            <div className="space-y-6">
              {recentContent.map((content) => (
                <div key={content.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/20 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Content Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{content.title}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                              <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-blue-400" />
                                <span>{content.subject}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-purple-400" />
                                <span>{content.teacher}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span>{new Date(content.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quality Score and Status */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-semibold">
                              {content.qualityScore}/10
                            </span>
                          </div>
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs border ${getStatusColor(content.status)}`}>
                            {getStatusIcon(content.status)}
                            <span className="font-medium capitalize">{content.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        {content.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleContentAction(content.id, 'reject')}
                              className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              <XCircle className="w-5 h-5" />
                              <span className="font-semibold">Reject</span>
                            </button>
                            <button
                              onClick={() => handleContentAction(content.id, 'approve')}
                              className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">Approve</span>
                            </button>
                          </>
                        )}
                        {content.status === 'flagged' && (
                          <button
                            onClick={() => handleContentAction(content.id, 'review')}
                            className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-semibold">Review</span>
                          </button>
                        )}
                        <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-slate-300 hover:text-white">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Graph Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Knowledge Graph</h3>
            <div className="space-y-4">
              {[
                { label: 'Mathematics Nodes', value: '1,245', growth: '+23%' },
                { label: 'Physics Nodes', value: '987', growth: '+18%' },
                { label: 'Chemistry Nodes', value: '756', growth: '+15%' },
                { label: 'Connections', value: '12,543', growth: '+31%' }
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300 font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg text-white">{stat.value}</span>
                    <span className="text-green-400 text-sm flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Content Quality</h3>
            <div className="space-y-4">
              {[
                { label: 'Average Score', value: '8.7/10', color: 'text-green-400' },
                { label: 'Flagged Content', value: '2.3%', color: 'text-orange-400' },
                { label: 'Approval Rate', value: '94.2%', color: 'text-blue-400' },
                { label: 'Teacher Rating', value: '4.8/5', color: 'text-purple-400' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-slate-300 font-medium">{metric.label}</span>
                  <span className={`font-bold text-lg ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentManagement
