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
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            {/* Main spinning circle */}
            <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin">
              <div className="absolute inset-0 border-4 border-t-blue-400 border-r-purple-400 border-b-blue-300 border-l-purple-300 rounded-full animate-spin"></div>
            </div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"></div>

            {/* Outer spinning rings */}
            <div
              className="absolute -inset-2 border-2 border-transparent rounded-full animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            >
              <div className="absolute inset-0 border-2 border-t-transparent border-r-blue-300/50 border-b-transparent border-l-purple-300/50 rounded-full"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              {goingBack
                ? "Returning to Knowledge Graph..."
                : "Loading Concept..."}
            </p>
            <div className="flex justify-center mt-3 space-x-1">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
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
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
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
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Concept
          </h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 font-semibold"
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
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">
            Concept Not Found
          </h2>
          <p className="text-slate-300 mb-4">
            The requested concept could not be found.
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 font-semibold"
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
        return <Video className="text-red-400" />;
      case "Note":
        return <FileText className="text-green-400" />;
      case "Quiz":
        return <HelpCircle className="text-purple-400" />;
      default:
        return <Book className="text-blue-400" />;
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
      <div ref={containerRef} className="p-8 space-y-8">
        {/* Header */}
        <div ref={headerRef}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 border border-white/20 text-white"
            >
              <ArrowLeft size={16} />
              <span className="font-semibold">Back to Knowledge Graph</span>
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {conceptData.name}
          </h1>
          <p className="text-purple-200 mb-6 text-lg">
            Concept ID:{" "}
            <span className="font-medium text-white">
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
              },
              {
                label: "Resources",
                value: conceptData.resources.length,
                icon: Book,
                color: "bg-blue-600",
              },
              {
                label: "Videos",
                value: conceptData.resources.filter((r) => r.type === "Video")
                  .length,
                icon: Video,
                color: "bg-red-600",
              },
              {
                label: "Quizzes",
                value: conceptData.resources.filter((r) => r.type === "Quiz")
                  .length,
                icon: HelpCircle,
                color: "bg-purple-600",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-white/10 rounded-2xl border border-white/20 p-6">
          <div className="flex items-center mb-4">
            <Zap className="text-yellow-400 mr-3" size={20} />
            <h3 className="text-lg font-semibold text-white">Learning Tips</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Video className="text-red-400" size={16} />
              <span className="text-sm text-slate-300">Video Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-green-400" size={16} />
              <span className="text-sm text-slate-300">Notes & Reading</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={16} />
              <span className="text-sm text-slate-300">Quizzes & Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="text-blue-400" size={16} />
              <span className="text-sm text-slate-300">Other Resources</span>
            </div>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
            <ul className="text-blue-200 space-y-2 text-sm">
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
              <div className="bg-white/10 rounded-2xl border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Bookmark className="text-orange-400 mr-3" />
                  Prerequisites ({conceptData.prerequisites.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conceptData.prerequisites.map((prerequisite) => (
                    <div
                      key={prerequisite.conceptId}
                      className="bg-white/10 rounded-2xl border border-orange-500/30 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className="font-semibold text-white">
                            {prerequisite.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Prerequisite concept
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Eye className="text-orange-400" size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Section */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Book className="text-blue-400 mr-3" />
                Learning Resources ({conceptData.resources.length})
              </h2>
              <div className="space-y-4">
                {conceptData.resources.map((resource, index) => (
                  <div
                    key={resource.resourceId}
                    className="bg-white/10 rounded-2xl border border-white/20 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="text-xl">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-white text-lg">
                            {resource.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                              {resource.type}
                            </span>
                            <span className="text-sm text-slate-300">
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
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart3 className="text-teal-400 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/20">
                  <span className="text-slate-300">Prerequisites:</span>
                  <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                    {conceptData.prerequisites.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/20">
                  <span className="text-slate-300">Resources:</span>
                  <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                    {conceptData.resources.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/20">
                  <span className="text-slate-300">Videos:</span>
                  <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                    {
                      conceptData.resources.filter((r) => r.type === "Video")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/20">
                  <span className="text-slate-300">Quizzes:</span>
                  <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                    {
                      conceptData.resources.filter((r) => r.type === "Quiz")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Types */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Tags className="text-purple-400 mr-2" />
                Resource Types
              </h3>
              <div className="space-y-3">
                {Array.from(
                  new Set(conceptData.resources.map((r) => r.type))
                ).map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-colors duration-200"
                  >
                    <span className="flex items-center">
                      <span className="mr-3">{getResourceIcon(type)}</span>
                      <span className="text-slate-200 font-medium">{type}</span>
                    </span>
                    <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm font-bold border border-blue-400/30">
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
    </div>
  );
};

export default ConceptViewer;
