'use client'

import React, { useState } from 'react'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  UserCheck,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  Clock
} from 'lucide-react'

interface PendingTeacher {
  id: number
  name: string
  subject: string
  date: string
  status: string
  email?: string
  qualifications?: string[]
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const pendingTeachers: PendingTeacher[] = [
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      subject: 'Mathematics', 
      date: '2024-01-15', 
      status: 'pending',
      email: 'sarah.johnson@email.com',
      qualifications: ['PhD Mathematics', '10+ years experience']
    },
    { 
      id: 2, 
      name: 'Prof. Michael Chen', 
      subject: 'Physics', 
      date: '2024-01-14', 
      status: 'pending',
      email: 'michael.chen@email.com',
      qualifications: ['PhD Physics', 'Research Publications: 15+']
    },
    { 
      id: 3, 
      name: 'Ms. Emily Davis', 
      subject: 'Chemistry', 
      date: '2024-01-13', 
      status: 'pending',
      email: 'emily.davis@email.com',
      qualifications: ['MSc Chemistry', '5+ years teaching']
    }
  ]

  const handleApproval = (_id: number, _approved: boolean) => {
    // console.log(`Teacher ${id} ${approved ? 'approved' : 'rejected'}`)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm font-medium tracking-wide">User Management</span>
        </div>
        <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage user registrations, teacher applications, and platform access
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Users', value: '2,456', icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Pending Teachers', value: '23', icon: UserCheck, color: 'from-purple-600 to-purple-700' },
          { label: 'Active Teachers', value: '87', icon: Shield, color: 'from-indigo-500 to-indigo-600' },
          { label: 'This Month', value: '+34', icon: CheckCircle, color: 'from-green-500 to-green-600' }
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
                placeholder="Search users by name, email, or subject..."
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
                <option value="rejected" className="bg-slate-800 text-white">Rejected</option>
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Applications */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white">Pending Teacher Applications</h3>
              <div className="flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full border border-orange-500/30">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{pendingTeachers.length} Pending</span>
              </div>
            </div>

            <div className="space-y-6">
              {pendingTeachers.map((teacher) => (
                <div key={teacher.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl border border-white/20 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Teacher Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-1">{teacher.name}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                              <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-blue-400" />
                                <span>{teacher.subject}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-purple-400" />
                                <span>{teacher.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span>{new Date(teacher.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Qualifications */}
                        <div className="flex flex-wrap gap-2">
                          {teacher.qualifications?.map((qual, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30"
                            >
                              {qual}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleApproval(teacher.id, false)}
                          className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">Reject</span>
                        </button>
                        <button
                          onClick={() => handleApproval(teacher.id, true)}
                          className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Approve</span>
                        </button>
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

      {/* User Distribution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">User Distribution</h3>
            <div className="space-y-4">
              {[
                { label: 'Students', value: '2,156', color: 'text-blue-400', percentage: '88%' },
                { label: 'Teachers', value: '87', color: 'text-purple-400', percentage: '11%' },
                { label: 'Admins', value: '3', color: 'text-indigo-400', percentage: '1%' }
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-slate-300 font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                    <span className="text-slate-400 text-sm">{stat.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Platform Integrity</h3>
            <div className="space-y-4">
              {[
                { label: 'Active Users', value: '98.5%', color: 'text-green-400' },
                { label: 'Verified Teachers', value: '94%', color: 'text-blue-400' },
                { label: 'Account Health', value: '99.2%', color: 'text-purple-400' },
                { label: 'Security Score', value: '95%', color: 'text-indigo-400' }
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

export default UserManagement
