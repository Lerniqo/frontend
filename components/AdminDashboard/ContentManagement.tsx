"use client";

import React, { useState } from "react";
import {
  Globe,
  FileText,
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  User,
  Calendar,
  Award,
  XCircle,
} from "lucide-react";
import LessonLibraryManager from "./LessonLibraryManager";
import ConceptViewer from "./ConceptViewer";

interface ContentItem {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  uploadDate: string;
  status: "pending" | "approved" | "flagged" | "rejected";
  qualityScore?: number;
}

const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [showConceptViewer, setShowConceptViewer] = useState(false);

  const recentContent: ContentItem[] = [
    {
      id: 1,
      title: "Advanced Calculus - Integration Techniques",
      subject: "Mathematics",
      teacher: "Dr. Smith",
      uploadDate: "2024-01-15",
      status: "pending",
      qualityScore: 8.5,
    },
    {
      id: 2,
      title: "Quantum Mechanics Fundamentals",
      subject: "Physics",
      teacher: "Prof. Johnson",
      uploadDate: "2024-01-14",
      status: "approved",
      qualityScore: 9.2,
    },
    {
      id: 3,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry",
      teacher: "Ms. Davis",
      uploadDate: "2024-01-13",
      status: "flagged",
      qualityScore: 6.8,
    },
    {
      id: 4,
      title: "Linear Algebra Fundamentals",
      subject: "Mathematics",
      teacher: "Dr. Chen",
      uploadDate: "2024-01-12",
      status: "approved",
      qualityScore: 8.9,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-100 border-green-200";
      case "pending":
        return "text-orange-700 bg-orange-100 border-orange-200";
      case "flagged":
        return "text-red-700 bg-red-100 border-red-200";
      case "rejected":
        return "text-gray-700 bg-gray-100 border-gray-200";
      default:
        return "text-blue-700 bg-blue-100 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleContentAction = (_id: number, _action: string) => {
    // console.log(`Content ${id} ${action}`)
  };

  const handleConceptView = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setShowConceptViewer(true);
  };

  const handleBackToKnowledgeGraph = () => {
    setShowConceptViewer(false);
    setSelectedConceptId(null);
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content & Knowledge Graph
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Manage educational content, moderate uploads, and maintain the
          knowledge graph
        </p>
      </div>

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            label: "Total Content",
            value: "1,234",
            icon: BookOpen,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
          },
          {
            label: "Pending Review",
            value: "23",
            icon: Clock,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
          },
          {
            label: "Knowledge Nodes",
            value: "5,678",
            icon: Globe,
            color: "from-purple-600 to-purple-700",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
          },
          {
            label: "Quality Score",
            value: "8.7/10",
            icon: Star,
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
              placeholder="Search content by title, subject, or teacher..."
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
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              Recent Content Uploads
            </h3>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {recentContent.length} Items
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {recentContent.map((content) => (
              <div
                key={content.id}
                className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Content Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {content.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-blue-500" />
                            <span>{content.subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-purple-500" />
                            <span>{content.teacher}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span>
                              {new Date(
                                content.uploadDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Score and Status */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-600 font-semibold">
                          {content.qualityScore}/10
                        </span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          content.status
                        )}`}
                      >
                        {getStatusIcon(content.status)}
                        <span className="font-medium capitalize">
                          {content.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {content.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleContentAction(content.id, "reject")
                          }
                          className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">Reject</span>
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(content.id, "approve")
                          }
                          className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Approve</span>
                        </button>
                      </>
                    )}
                    {content.status === "flagged" && (
                      <button
                        onClick={() =>
                          handleContentAction(content.id, "review")
                        }
                        className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold">Review</span>
                      </button>
                    )}
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

      {/* Knowledge Graph Management / Concept Viewer */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
        {showConceptViewer && selectedConceptId ? (
          <ConceptViewer
            conceptId={selectedConceptId}
            onBack={handleBackToKnowledgeGraph}
          />
        ) : (
          <LessonLibraryManager onConceptClick={handleConceptView} />
        )}
      </div>

      {/* Content Quality */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "1.0s" }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Content Quality
        </h3>
        <div className="space-y-4">
          {[
            {
              label: "Average Score",
              value: "8.7/10",
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              label: "Flagged Content",
              value: "2.3%",
              color: "text-orange-600",
              bgColor: "bg-orange-50",
            },
            {
              label: "Approval Rate",
              value: "94.2%",
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              label: "Teacher Rating",
              value: "4.8/5",
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
          ].map((metric, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${metric.bgColor} transition-all duration-300`}
            >
              <span className="text-gray-700 font-medium">{metric.label}</span>
              <span className={`font-bold text-lg ${metric.color}`}>
                {metric.value}
              </span>
            </div>
          ))}
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

export default ContentManagement;
