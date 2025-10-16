"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers, getTeachersList } from "@/services/userService";
import { User } from "@/types/auth.types";
import SubMenu from "@/components/TeacherDashboard/SubMenu";
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
  BarChart3,
} from "lucide-react";

// Donut Chart Component
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    hexColor: string;
  }>;
  size?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 30,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  // Handle edge case where total is 0
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={strokeWidth}
          />
        </svg>
        <div className="mt-6 text-center text-gray-500">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const segments = data.map((item) => {
    const percentage = item.value / total || 0;
    const sliceLength = percentage * circumference;
    const offset = currentOffset;
    currentOffset += sliceLength;

    return {
      ...item,
      offset: isFinite(offset) ? offset : 0,
      sliceLength: isFinite(sliceLength) ? sliceLength : 0,
      percentage: isFinite(percentage * 100) ? Math.round(percentage * 100) : 0,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.hexColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${
              isFinite(segment.sliceLength) ? segment.sliceLength : 0
            } ${circumference}`}
            strokeDashoffset={`${
              isFinite(-segment.offset) ? -segment.offset : 0
            }`}
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
      </svg>
      <div className="mt-6 space-y-2 w-full">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.hexColor }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {segment.label}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-800">
              {isFinite(segment.percentage) ? segment.percentage : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState<
    "Students" | "Teachers" | "Admins"
  >("Students");

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
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
  }, []);

  // Get filtered users by role
  const getFilteredUsers = () => {
    const roleMap: { [key: string]: string } = {
      Students: "Student",
      Teachers: "Teacher",
      Admins: "Admin",
    };

    let filtered = allUsers.filter(
      (user) => user.role === roleMap[userRoleFilter]
    );

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Calculate user distribution from actual data
  const studentCount = allUsers.filter(
    (user) => user.role === "Student"
  ).length;
  const teacherCount = allUsers.filter(
    (user) => user.role === "Teacher"
  ).length;
  const adminCount = allUsers.filter((user) => user.role === "Admin").length;

  const userDistributionData = [
    {
      label: "Students",
      value: studentCount,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hexColor: "#3b82f6",
    },
    {
      label: "Teachers",
      value: teacherCount,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hexColor: "#9333ea",
    },
    {
      label: "Admins",
      value: adminCount,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hexColor: "#4f46e5",
    },
  ];

  const totalUserCount = studentCount + teacherCount + adminCount || 1;

  // Calculate percentages
  const userDistributionWithPercentages = userDistributionData.map((item) => ({
    ...item,
    percentage: Math.round((item.value / totalUserCount) * 100),
  }));

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
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            label: "Total Users",
            value: totalUsers !== null ? totalUsers.toString() : "Loading...",
            icon: Users,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Active Teachers",
            value:
              activeTeachers !== null
                ? activeTeachers.toString()
                : "Loading...",
            icon: UserCheck,
            color: "from-purple-600 to-purple-700",
          },
          {
            label: "Active Students",
            value:
              activeStudents !== null
                ? activeStudents.toString()
                : "Loading...",
            icon: UserCheck,
            color: "from-indigo-500 to-indigo-600",
          },
        ].map((stat, index) => {
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

      {/* User Distribution and Chart - Professional Design */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up mb-8"
        style={{ animationDelay: "0.25s" }}
      >
        {/* User Distribution List Box */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  User Distribution
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Breakdown of platform users
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              {userDistributionWithPercentages.map((stat, index) => (
                <div
                  key={index}
                  className={`group/item flex justify-between items-center p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-gray-300 transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-4 h-4 rounded-full shadow-md group-hover/item:scale-125 transition-transform duration-300`}
                      style={{ backgroundColor: stat.hexColor }}
                    ></div>
                    <span className="text-gray-700 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">users</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">
                  {totalUserCount}
                </span>{" "}
                total users in the system
              </p>
            </div>
          </div>
        </div>

        {/* Donut Chart Box */}
        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gradient-to-r from-indigo-200 to-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Distribution Chart
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Visual representation
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-center py-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/50">
              <DonutChart
                data={userDistributionData}
                size={280}
                strokeWidth={40}
              />
            </div>
          </div>
        </div>
      </div>
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

      {/* User Role Filter SubMenu */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="px-8 pt-6">
          <SubMenu
            items={[
              {
                id: "Students",
                label: "Students",
                icon: "👨‍🎓",
                color: "from-blue-500 to-blue-600",
              },
              {
                id: "Teachers",
                label: "Teachers",
                icon: "👨‍🏫",
                color: "from-purple-600 to-purple-700",
              },
              {
                id: "Admins",
                label: "Admins",
                icon: "⚙️",
                color: "from-indigo-500 to-indigo-600",
              },
            ]}
            activeItem={userRoleFilter}
            onItemChange={(item) =>
              setUserRoleFilter(item as "Students" | "Teachers" | "Admins")
            }
            title="User Type"
          />
        </div>
      </div>

      {/* Users List */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {userRoleFilter} List
            </h3>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {filteredUsers.length} {userRoleFilter}
              </span>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No {userRoleFilter.toLowerCase()} found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.userId}
                  className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-1">
                            {user.fullName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-blue-500" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-purple-500" />
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {user.role}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              user.isVerified ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="text-xs font-semibold text-gray-600">
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              user.isProfileCompleted
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-xs font-semibold text-gray-600">
                            {user.isProfileCompleted
                              ? "Profile Complete"
                              : "Incomplete Profile"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 lg:flex-nowrap flex-wrap">
                      <button className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">View</span>
                      </button>
                      <button className="p-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
