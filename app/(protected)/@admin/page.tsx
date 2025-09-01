import React from 'react';
import { BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Manage your platform with comprehensive administrative tools
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">2,456</div>
            <div className="text-slate-400 text-sm">Total Users</div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">1,234</div>
            <div className="text-slate-400 text-sm">Active Content</div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <span className="text-xs font-medium bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                +15%
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">98.5%</div>
            <div className="text-slate-400 text-sm">System Uptime</div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                +22%
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">89.2%</div>
            <div className="text-slate-400 text-sm">User Satisfaction</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "New user registered", time: "2 minutes ago", type: "user" },
                { action: "Content approved", time: "15 minutes ago", type: "content" },
                { action: "System update completed", time: "1 hour ago", type: "system" },
                { action: "Analytics report generated", time: "2 hours ago", type: "analytics" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-400' :
                    activity.type === 'content' ? 'bg-green-400' :
                    activity.type === 'system' ? 'bg-yellow-400' : 'bg-purple-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-slate-200 text-sm">{activity.action}</div>
                    <div className="text-slate-400 text-xs">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Manage Users", icon: Users, color: "blue" },
                { name: "Content Review", icon: BookOpen, color: "green" },
                { name: "View Analytics", icon: BarChart3, color: "purple" },
                { name: "System Settings", icon: TrendingUp, color: "pink" },
              ].map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                  >
                    <IconComponent className={`w-6 h-6 text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                    <div className="text-slate-200 text-sm font-medium">{action.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional content to demonstrate scrolling */}
        <div className="mt-8 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Platform Overview</h3>
          <p className="text-slate-300 leading-relaxed">
            This admin dashboard provides comprehensive oversight of the Lerniqo platform. 
            Monitor user engagement, manage content quality, analyze platform performance, 
            and ensure optimal user experience across all educational services. 
            The footer below contains additional navigation links and platform statistics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;