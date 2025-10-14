"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getConceptById, ConceptResponse } from "../../services/contentService";
import {
  ArrowLeft,
  Book,
  Video,
  HelpCircle,
  FileText,
  Eye,
  BarChart3,
  Tags,
  Zap,
  Bookmark,
} from "lucide-react";

interface ConceptViewerProps {
  conceptId: string;
  onBack: () => void;
}

const ConceptViewer: React.FC<ConceptViewerProps> = ({ conceptId, onBack }) => {
  const [conceptData, setConceptData] = useState<ConceptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [goingBack, setGoingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConcept = async () => {
      if (!conceptId) {
        setError("No concept ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getConceptById(conceptId);
        setConceptData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load concept");
      } finally {
        setLoading(false);
      }
    };

    fetchConcept();
  }, [conceptId]);

  useEffect(() => {
    if (!loading && conceptData) {
      // Animate container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [loading, conceptData]);

  const handleGoBack = () => {
    setGoingBack(true);
    // Add a small delay to show the loading state
    setTimeout(() => {
      onBack();
    }, 800);
  };

  if (loading || goingBack) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            {/* Main spinning circle */}
            <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin">
              <div className="absolute inset-0 border-4 border-t-blue-600 border-r-purple-600 border-b-blue-500 border-l-purple-500 rounded-full animate-spin"></div>
            </div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse"></div>

            {/* Outer spinning rings */}
            <div
              className="absolute -inset-2 border-2 border-transparent rounded-full animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            >
              <div className="absolute inset-0 border-2 border-t-transparent border-r-blue-500/50 border-b-transparent border-l-purple-500/50 rounded-full"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              {goingBack
                ? "Returning to Knowledge Graph..."
                : "Loading Concept..."}
            </p>
            <div className="flex justify-center mt-3 space-x-1">
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 animate-fade-in-up">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Concept
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!conceptData) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 animate-fade-in-up">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Concept Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested concept could not be found.
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="text-red-600" />;
      case "Note":
        return <FileText className="text-green-600" />;
      case "Quiz":
        return <HelpCircle className="text-purple-600" />;
      default:
        return <Book className="text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in-up">
      <div ref={containerRef} className="p-8 space-y-8">
        {/* Header */}
        <div ref={headerRef}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition-all duration-300 border border-gray-200 text-gray-700 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={16} />
              <span className="font-semibold">Back to Knowledge Graph</span>
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {conceptData.name}
          </h1>
          <p className="text-purple-600 mb-6 text-lg">
            Concept ID:{" "}
            <span className="font-medium text-gray-800">
              {conceptData.conceptId}
            </span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Prerequisites",
                value: conceptData.prerequisites.length,
                icon: Bookmark,
                color: "bg-orange-600",
                bgColor: "bg-orange-50",
                textColor: "text-orange-600",
              },
              {
                label: "Resources",
                value: conceptData.resources.length,
                icon: Book,
                color: "bg-blue-600",
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
              },
              {
                label: "Videos",
                value: conceptData.resources.filter((r) => r.type === "Video")
                  .length,
                icon: Video,
                color: "bg-red-600",
                bgColor: "bg-red-50",
                textColor: "text-red-600",
              },
              {
                label: "Quizzes",
                value: conceptData.resources.filter((r) => r.type === "Quiz")
                  .length,
                icon: HelpCircle,
                color: "bg-purple-600",
                bgColor: "bg-purple-50",
                textColor: "text-purple-600",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border border-gray-200 p-4 hover:${stat.bgColor} hover:shadow-md transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:bg-gray-100 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Zap className="text-yellow-600 mr-3" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              Learning Tips
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Video className="text-red-600" size={16} />
              <span className="text-sm text-gray-600">Video Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-green-600" size={16} />
              <span className="text-sm text-gray-600">Notes & Reading</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-600" size={16} />
              <span className="text-sm text-gray-600">Quizzes & Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="text-blue-600" size={16} />
              <span className="text-sm text-gray-600">Other Resources</span>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-2xl border border-blue-200">
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>• Review prerequisites to understand this concept better</li>
              <li>• Browse through available learning resources</li>
              <li>
                • Resources include videos, notes, quizzes and other materials
              </li>
              <li>• Use the back button to return to the Knowledge Graph</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prerequisites Section */}
            {conceptData.prerequisites.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Bookmark className="text-orange-600 mr-3" />
                  Prerequisites ({conceptData.prerequisites.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conceptData.prerequisites.map((prerequisite) => (
                    <div
                      key={prerequisite.conceptId}
                      className="bg-orange-50 rounded-2xl border border-orange-200 p-4 hover:bg-orange-100 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className="font-semibold text-gray-800">
                            {prerequisite.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Prerequisite concept
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Eye className="text-orange-600" size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Book className="text-blue-600 mr-3" />
                Learning Resources ({conceptData.resources.length})
              </h2>
              <div className="space-y-4">
                {conceptData.resources.map((resource, index) => (
                  <div
                    key={resource.resourceId}
                    className="bg-gray-50 rounded-2xl border border-gray-200 p-4 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="text-xl">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {resource.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              {resource.type}
                            </span>
                            <span className="text-sm text-gray-600">
                              Resource {index + 1} of{" "}
                              {conceptData.resources.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="text-teal-600 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                  <span className="text-gray-600">Prerequisites:</span>
                  <span className="font-bold text-gray-800 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {conceptData.prerequisites.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                  <span className="text-gray-600">Resources:</span>
                  <span className="font-bold text-gray-800 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {conceptData.resources.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                  <span className="text-gray-600">Videos:</span>
                  <span className="font-bold text-gray-800 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {
                      conceptData.resources.filter((r) => r.type === "Video")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                  <span className="text-gray-600">Quizzes:</span>
                  <span className="font-bold text-gray-800 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                    {
                      conceptData.resources.filter((r) => r.type === "Quiz")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Types */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Tags className="text-purple-600 mr-2" />
                Resource Types
              </h3>
              <div className="space-y-3">
                {Array.from(
                  new Set(conceptData.resources.map((r) => r.type))
                ).map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span className="flex items-center">
                      <span className="mr-3">{getResourceIcon(type)}</span>
                      <span className="text-gray-700 font-medium">{type}</span>
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                      {
                        conceptData.resources.filter((r) => r.type === type)
                          .length
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
      `}</style>
    </div>
  );
};

export default ConceptViewer;
