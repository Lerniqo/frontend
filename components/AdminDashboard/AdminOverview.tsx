"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, getTeachersList } from "@/services/userService";
import {
  Users,
  UserCheck,
  CheckCircle,
  Clock,
} from "lucide-react";


interface Teacher {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminOverview = () => {

 const [totalUsers, setTotalUsers] = useState<number | null>(null);
 const [teachers, setTeachers] = useState<Teacher[]>([]);
 const [students, setStudents] = useState<Student[]>([]);
 const [loadingTeachers, setLoadingTeachers] = useState(true);
 const [loadingStudents, setLoadingStudents] = useState(true);

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
        const teachersList = await getTeachersList();
        setTeachers(teachersList);
        setActiveTeachers(teachersList.length);
        setLoadingTeachers(false);
      } catch (error) {
        console.error("Error fetching active teachers:", error);
        setLoadingTeachers(false);
      }
    };

    fetchActiveTeachers();
  }, []);

  const [activeStudents, setActiveStudents] = useState<number | null>(null);

  useEffect(() => { 
    const fetchActiveStudents = async () => {
      try {
        const users = await getAllUsers();  
        const studentsList = users.filter((user) => user.role === "Student");
        setStudents(studentsList);
        setActiveStudents(studentsList.length);
        setLoadingStudents(false);
      } catch (error) {
        console.error("Error fetching active students:", error);
        setLoadingStudents(false);
      }     
    };

    fetchActiveStudents();
  }, []);

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

      {/* Teachers and Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teachers Section */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Teachers ({teachers.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loadingTeachers ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading teachers...</p>
              </div>
            ) : teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div
                  key={teacher.userId}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {teacher.fullName || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {teacher.email}
                    </p>
                  </div>
                  {teacher.isVerified && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">No teachers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Students Section */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: "750ms" }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Students ({students.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Loading students...</p>
              </div>
            ) : students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.userId}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-purple-50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {student.fullName || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {student.email}
                    </p>
                  </div>
                  {student.isVerified && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
