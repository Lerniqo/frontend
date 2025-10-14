"use client";

import React, { useState } from "react";
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
  Clock,
} from "lucide-react";

interface PendingTeacher {
  id: number;
  name: string;
  subject: string;
  date: string;
  status: string;
  email?: string;
  qualifications?: string[];
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pendingTeachers: PendingTeacher[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      subject: "Mathematics",
      date: "2024-01-15",
      status: "pending",
      email: "sarah.johnson@email.com",
      qualifications: ["PhD Mathematics", "10+ years experience"],
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      subject: "Physics",
      date: "2024-01-14",
      status: "pending",
      email: "michael.chen@email.com",
      qualifications: ["PhD Physics", "Research Publications: 15+"],
    },
    {
      id: 3,
      name: "Ms. Emily Davis",
      subject: "Chemistry",
      date: "2024-01-13",
      status: "pending",
      email: "emily.davis@email.com",
      qualifications: ["MSc Chemistry", "5+ years teaching"],
    },
  ];

  const handleApproval = (_id: number, _approved: boolean) => {
    // console.log(`Teacher ${id} ${approved ? 'approved' : 'rejected'}`)
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Manage user registrations, teacher applications, and platform access
        </p>
      </div>

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            label: "Total Users",
            value: "2,456",
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
          },
          {
            label: "Pending Teachers",
            value: "23",
            icon: UserCheck,
            color: "from-purple-600 to-purple-700",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
          },
          {
            label: "Active Teachers",
            value: "87",
            icon: Shield,
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600",
          },
          {
            label: "This Month",
            value: "+34",
            icon: CheckCircle,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
          },
        ].map((stat, index) => {
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
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Teacher Applications */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              Pending Teacher Applications
            </h3>
            <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full border border-orange-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {pendingTeachers.length} Pending
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {pendingTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Teacher Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">
                          {teacher.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-blue-500" />
                            <span>{teacher.subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-purple-500" />
                            <span>{teacher.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span>
                              {new Date(teacher.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div className="flex flex-wrap gap-2">
                      {teacher.qualifications?.map((qual, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs border border-blue-200"
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
                    <button className="p-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Distribution Overview */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            User Distribution
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Students",
                value: "2,156",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                percentage: "88%",
              },
              {
                label: "Teachers",
                value: "87",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
                percentage: "11%",
              },
              {
                label: "Admins",
                value: "3",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
                percentage: "1%",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${stat.bgColor} transition-all duration-300`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${stat.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-bold text-lg ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {stat.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Platform Integrity
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Active Users",
                value: "98.5%",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                label: "Verified Teachers",
                value: "94%",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                label: "Account Health",
                value: "99.2%",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                label: "Security Score",
                value: "95%",
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
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

export default UserManagement;
