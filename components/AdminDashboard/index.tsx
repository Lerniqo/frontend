"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import UserManagement from "./UserManagement";
import ContentManagement from "./ContentManagement";
import PlatformAnalytics from "./PlatformAnalytics";
import LessonLibraryManager from "./LessonLibraryManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Navigation Menu */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-2">
              <div className="flex space-x-2">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "users", label: "User Management", icon: Users },
                  { id: "content", label: "Content & Graph", icon: BookOpen },
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="animate-fade-in-up">
            {activeTab === "overview" && <OverviewSection />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "content" && <ContentManagement />}
            {activeTab === "analytics" && <PlatformAnalytics />}
          </div>
        </div>
      </main>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Overview Section Component with clean light styling
const OverviewSection = () => {
  const stats = [
    {
      label: "Total Users",
      value: "2,456",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Active Teachers",
      value: "87",
      change: "+5%",
      icon: UserCheck,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Content Items",
      value: "1,234",
      change: "+18%",
      icon: BookOpen,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      label: "Pending Reviews",
      value: "23",
      change: "-3%",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive platform insights and management tools at your
          fingertips
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 ${stat.bgColor}/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative flex items-center justify-between mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    stat.change.startsWith("+")
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs mt-1">from last month</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              label: "Review Teacher Applications",
              color: "from-blue-500 to-blue-600",
              hoverColor: "hover:from-blue-600 hover:to-blue-700",
            },
            {
              icon: FileText,
              label: "Moderate Content",
              color: "from-purple-600 to-purple-700",
              hoverColor: "hover:from-purple-700 hover:to-purple-800",
            },
            {
              icon: Globe,
              label: "Update Knowledge Graph",
              color: "from-indigo-500 to-indigo-600",
              hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
            },
          ].map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className={`group relative flex items-center space-x-4 p-6 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden`}
              >
                <div className="relative z-10 flex items-center space-x-4">
                  <IconComponent className="w-6 h-6" />
                  <span className="font-semibold">{action.label}</span>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                type: "user",
                message: "New teacher application from Dr. Sarah Johnson",
                time: "5 min ago",
                icon: UserCheck,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                type: "content",
                message: "Content approved: Advanced Calculus",
                time: "1 hour ago",
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                type: "analytics",
                message: "Weekly analytics report generated",
                time: "2 hours ago",
                icon: BarChart3,
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                type: "system",
                message: "Knowledge graph updated",
                time: "4 hours ago",
                icon: Globe,
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
              },
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:${activity.bgColor} transition-all duration-300 cursor-pointer group`}
                >
                  <div
                    className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            System Health
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Server Uptime",
                value: "99.9%",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                label: "Response Time",
                value: "145ms",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                label: "Active Sessions",
                value: "1,789",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                label: "Error Rate",
                value: "0.01%",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${metric.bgColor} transition-all duration-300`}
              >
                <span className="text-gray-700 font-medium">
                  {metric.label}
                </span>
                <span className={`font-bold text-lg ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Today&apos;s Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "New Users", value: "34", color: "text-blue-600" },
                {
                  label: "Content Uploads",
                  value: "12",
                  color: "text-purple-600",
                },
                {
                  label: "Support Tickets",
                  value: "8",
                  color: "text-orange-600",
                },
                { label: "Revenue", value: "$1,234", color: "text-green-600" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-gray-50 rounded-lg p-3"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
export {
  UserManagement,
  ContentManagement,
  PlatformAnalytics,
  LessonLibraryManager,
};
