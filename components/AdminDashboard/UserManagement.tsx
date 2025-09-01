'use client'

import React from 'react'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  UserCheck,
  Shield
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

  const handleApprove = (teacherId: number) => {
    console.log(`Approving teacher with ID: ${teacherId}`)
    // Add approval logic here
  }

  const handleReject = (teacherId: number) => {
    console.log(`Rejecting teacher with ID: ${teacherId}`)
    // Add rejection logic here
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students</span>
              <span className="font-semibold text-blue-600 text-lg">2,156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Teachers</span>
              <span className="font-semibold text-purple-600 text-lg">87</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admins</span>
              <span className="font-semibold text-indigo-600 text-lg">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Integrity</h3>
            <Shield className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600 text-lg">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Suspended</span>
              <span className="font-semibold text-orange-600 text-lg">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reported Issues</span>
              <span className="font-semibold text-red-600 text-lg">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Teacher Vetting</h3>
            <UserCheck className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Applications</span>
              <span className="font-semibold text-orange-600 text-lg">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved This Month</span>
              <span className="font-semibold text-green-600 text-lg">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rejected</span>
              <span className="font-semibold text-red-600 text-lg">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Teacher Applications */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Pending Teacher Applications</h3>
        <div className="space-y-4">
          {pendingTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white/50 rounded-lg p-6 border border-white/30 hover:shadow-md transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900 text-lg">{teacher.name}</h4>
                  <p className="text-gray-600">{teacher.subject}</p>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                  <div className="mt-2">
                    {teacher.qualifications?.map((qual, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-sm text-gray-500">Applied on</p>
                  <p className="font-medium text-gray-900">{teacher.date}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => handleApprove(teacher.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button 
                    onClick={() => handleReject(teacher.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Tools */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">User Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Users className="w-6 h-6" />
            <span className="font-medium">View All Users</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <UserCheck className="w-6 h-6" />
            <span className="font-medium">Manage Roles</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Shield className="w-6 h-6" />
            <span className="font-medium">Security Audit</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <XCircle className="w-6 h-6" />
            <span className="font-medium">Suspend Users</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
