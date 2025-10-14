"use client";

import React, { useState } from "react";
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
  Award,
} from "lucide-react";

interface MetricData {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  textColor: string;
}

const PlatformAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const keyMetrics: MetricData[] = [
    {
      label: "Student Engagement",
      value: "87.3%",
      trend: "+5.2%",
      isPositive: true,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Average Progress",
      value: "73.8%",
      trend: "+12.1%",
      isPositive: true,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Teacher Performance",
      value: "9.2/10",
      trend: "+0.3",
      isPositive: true,
      icon: Star,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Platform Revenue",
      value: "$45.2K",
      trend: "+18.7%",
      isPositive: true,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  const performanceData = [
    {
      subject: "Mathematics",
      completion: 89,
      engagement: 92,
      difficulty: "Advanced",
    },
    {
      subject: "Physics",
      completion: 84,
      engagement: 88,
      difficulty: "Intermediate",
    },
    {
      subject: "Chemistry",
      completion: 78,
      engagement: 85,
      difficulty: "Beginner",
    },
    {
      subject: "Biology",
      completion: 91,
      engagement: 94,
      difficulty: "Intermediate",
    },
  ];

  const learningTrends = [
    {
      category: "Most Popular Subject",
      value: "Mathematics",
      percentage: "34%",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      category: "Peak Learning Hours",
      value: "2-6 PM",
      percentage: "42%",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      category: "Top Teacher Rating",
      value: "Dr. Johnson",
      percentage: "9.8/10",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      category: "Success Rate",
      value: "Course Completion",
      percentage: "87%",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive insights into platform performance, user engagement, and
          learning outcomes
        </p>
      </div>

      {/* Time Range Selector */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              Analytics Overview
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 cursor-pointer"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Download className="w-5 h-5" />
              <span className="font-semibold">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 ${metric.bgColor}/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative flex items-center justify-between mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    metric.isPositive
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {metric.isPositive ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {metric.trend}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </p>
                <p className="text-gray-500 text-xs mt-1">vs last period</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Performance */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              Subject Performance
            </h3>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Live Data</span>
            </div>
          </div>

          <div className="space-y-6">
            {performanceData.map((subject, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {subject.subject}
                      </h4>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          subject.difficulty === "Advanced"
                            ? "text-red-700 bg-red-100"
                            : subject.difficulty === "Intermediate"
                            ? "text-yellow-700 bg-yellow-100"
                            : "text-green-700 bg-green-100"
                        }`}
                      >
                        {subject.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 flex-1 max-w-md">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">
                          Completion
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {subject.completion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${subject.completion}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">
                          Engagement
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {subject.engagement}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${subject.engagement}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Trends */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Learning Trends
          </h3>
          <div className="space-y-4">
            {learningTrends.map((trend, index) => {
              const IconComponent = trend.icon;
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${trend.bgColor} transition-all duration-300`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${trend.color}`} />
                    <span className="text-gray-700 font-medium">
                      {trend.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">
                      {trend.value}
                    </div>
                    <div className={`text-sm ${trend.color}`}>
                      {trend.percentage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Platform Statistics
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Daily Active Users",
                value: "1,234",
                icon: Users,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                label: "Session Duration",
                value: "42 min",
                icon: Clock,
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                label: "Course Completion",
                value: "87%",
                icon: Target,
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                label: "User Satisfaction",
                value: "4.8/5",
                icon: Star,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${stat.bgColor} transition-all duration-300`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-gray-700 font-medium">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "1.0s" }}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            Real-time Activity
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-medium">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Active Sessions",
              value: "156",
              icon: Activity,
              color: "from-green-500 to-green-600",
              textColor: "text-green-600",
            },
            {
              label: "Questions Solved",
              value: "2,341",
              icon: Target,
              color: "from-blue-500 to-blue-600",
              textColor: "text-blue-600",
            },
            {
              label: "Live Lessons",
              value: "23",
              icon: Eye,
              color: "from-purple-600 to-purple-700",
              textColor: "text-purple-600",
            },
          ].map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-3xl font-bold ${activity.textColor} mb-2`}
                >
                  {activity.value}
                </div>
                <div className="text-gray-600 text-sm">{activity.label}</div>
              </div>
            );
          })}
        </div>
      </div>

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
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default PlatformAnalytics;
