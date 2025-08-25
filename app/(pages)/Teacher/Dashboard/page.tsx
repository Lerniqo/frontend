'use client';

import React from 'react';
import ProtectedRoute from '@/components/CommonComponents/ProtectedRoute';

const TeacherDashboard = () => {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome to your teaching workspace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold text-blue-600">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Courses</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Assignments</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Assignment graded</p>
                  <p className="text-xs text-gray-500">Math Quiz - 2 hours ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">New student enrolled</p>
                  <p className="text-xs text-gray-500">Sarah Johnson - 1 day ago</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Course updated</p>
                  <p className="text-xs text-gray-500">Advanced Algebra - 3 days ago</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Assignment
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Schedule Class
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">Advanced Algebra</h4>
                <p className="text-gray-600 text-sm mb-3">Grade 10-12 • 18 students</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next class: Tomorrow 9:00 AM</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">Geometry Fundamentals</h4>
                <p className="text-gray-600 text-sm mb-3">Grade 9 • 22 students</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next class: Today 2:00 PM</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">Calculus I</h4>
                <p className="text-gray-600 text-sm mb-3">Grade 12 • 15 students</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next class: Friday 10:00 AM</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherDashboard;
