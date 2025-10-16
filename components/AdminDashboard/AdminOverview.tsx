"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAllUsers, getTeachersList } from "@/services/userService";
import {
  Users,
  BarChart3,
  CheckCircle,
  UserCheck,
  FileText,
  Globe,
  Shield,
  Clock,
} from "lucide-react";


const AdminOverview = () => {

 const [totalUsers, setTotalUsers] = useState<number | null>(null);

 useEffect(() => {
   const fetchTotalUsers = async () => {
     try {
       const users = await getAllUsers();
       setTotalUsers(users.length);
     } catch (error) {
       console.error("Error fetching total users:", error);
     }
   };

   fetchTotalUsers();
 }, []);

 const [activeTeachers, setActiveTeachers] = useState<number | null>(null);

  useEffect(() => {
    const fetchActiveTeachers = async () => {
      try {
        const teachers = await getTeachersList();
        setActiveTeachers(teachers.length);
      } catch (error) {
        console.error("Error fetching active teachers:", error);
      }
    };

    fetchActiveTeachers();
  }, []);

  const [activeStudents, setActiveStudents] = useState<number | null>(null);

  useEffect(() => { 
    const fetchActiveStudents = async () => {
      try {
        const users = await getAllUsers();  
        const students = users.filter((user) => user.role === "Student");
        setActiveStudents(students.length);
      } catch (error) {
        console.error("Error fetching active students:", error);
      }     
    };

    fetchActiveStudents();
  }
, []);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers !== null ? totalUsers.toString() : "Loading...",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },

    {
      label: "Active Teachers",
      value: activeTeachers !== null ? activeTeachers.toString() : "Loading...",
      icon: UserCheck,
      color: "from-purple-600 to-purple-700",
    },
    {
      label: "Active Students",
      value: activeStudents !== null ? activeStudents.toString() : "Loading...",
      icon: UserCheck,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Pending Reviews",
      value: "23",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive platform insights and management tools at your
          fingertips
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "600ms" }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              label: "Review Teacher Applications",
              color: "from-blue-500 to-blue-600",
              href: "/user-management", // <-- target route
            },
            {
              icon: FileText,
              label: "Moderate Content",
              color: "from-purple-600 to-purple-700",
              href: "/content", // <-- target route
            },
            {
              icon: Globe,
              label: "Update Knowledge Graph",
              color: "from-indigo-500 to-indigo-600",
              href: "/knowledge-graph", // <-- target route
            },
          ].map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div
                  className={`group relative flex items-center space-x-4 p-6 bg-gradient-to-r ${action.color} text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden cursor-pointer`}
                >
                  <div className="relative z-10 flex items-center space-x-4">
                    <IconComponent className="w-6 h-6" />
                    <span className="font-semibold">{action.label}</span>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "750ms" }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                type: "user",
                message: "New teacher application from Dr. Sarah Johnson",
                time: "5 min ago",
                icon: UserCheck,
                color: "text-blue-500",
              },
              {
                type: "content",
                message: "Content approved: Advanced Calculus",
                time: "1 hour ago",
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                type: "analytics",
                message: "Weekly analytics report generated",
                time: "2 hours ago",
                icon: BarChart3,
                color: "text-purple-500",
              },
              {
                type: "system",
                message: "Knowledge graph updated",
                time: "4 hours ago",
                icon: Globe,
                color: "text-indigo-500",
              },
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300"
                >
                  <IconComponent className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">
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
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "900ms" }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            System Health
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Server Uptime",
                value: "99.9%",
                color: "text-green-600",
              },
              {
                label: "Response Time",
                value: "145ms",
                color: "text-blue-600",
              },
              {
                label: "Active Sessions",
                value: "1,789",
                color: "text-purple-600",
              },
              { label: "Error Rate", value: "0.01%", color: "text-orange-600" },
            ].map((metric, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className="text-gray-600 font-medium">
                  {metric.label}
                </span>
                <span className={`font-bold text-lg ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Today&apos;s Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "New Users", value: "34" },
                { label: "Content Uploads", value: "12" },
                { label: "Support Tickets", value: "8" },
                { label: "Revenue", value: "$1,234" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
