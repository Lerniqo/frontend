"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
  getConceptById,
  ConceptResponse,
} from "../../../services/contentService";
import {
  FaArrowLeft,
  FaBook,
  FaVideo,
  FaQuestionCircle,
  FaFileAlt,
  FaEye,
  FaPlay,
  FaChartBar,
  FaTags,
  FaBolt,
  FaGraduationCap,
  FaShare,
  FaBookmark,
  FaExternalLinkAlt,
} from "react-icons/fa";

import LoadingComponent from "@/components/CommonComponents/Loading";

export default function ConceptPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conceptId = searchParams.get("conceptId");

  const [conceptData, setConceptData] = useState<ConceptResponse | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handlePrerequisiteClick = (prerequisiteId: string) => {
    router.push(`/concept-page?conceptId=${prerequisiteId}`);
  };

  const handleResourceClick = (resource: any) => {
    router.push(
      `/learning-resource?resourceId=${resource.resourceId}&type=${
        resource.type
      }&url=${encodeURIComponent(resource.url)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
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
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!conceptData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Concept Not Found
          </h2>
          <p className="text-gray-600">
            The requested concept could not be found.
          </p>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <FaVideo className="text-red-500" />;
      case "Note":
        return <FaFileAlt className="text-green-600" />;
      case "Quiz":
        return <FaQuestionCircle className="text-purple-600" />;
      default:
        return <FaBook className="text-blue-600" />;
    }
  };

  const getResourceBgColor = (type: string) => {
    switch (type) {
      case "Video":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "Note":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "Quiz":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      default:
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white p-4">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div ref={headerRef}>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <FaArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>

              <h1 className="text-3xl font-bold mb-2">{conceptData.name}</h1>
              <p className="text-purple-100 mb-4">
                Concept ID:{" "}
                <span className="font-medium">{conceptData.conceptId}</span>
              </p>

              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {conceptData.prerequisites.length}
                    </div>
                    <div className="text-sm text-purple-100">Prerequisites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {conceptData.resources.length}
                    </div>
                    <div className="text-sm text-purple-100">Resources</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {
                        conceptData.resources.filter((r) => r.type === "Video")
                          .length
                      }
                    </div>
                    <div className="text-sm text-purple-100">Videos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {
                        conceptData.resources.filter((r) => r.type === "Quiz")
                          .length
                      }
                    </div>
                    <div className="text-sm text-purple-100">Quizzes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend/Info Section */}
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Learning Materials
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FaVideo className="text-red-500" size={16} />
                <span className="text-sm text-gray-700">Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-green-600" size={16} />
                <span className="text-sm text-gray-700">Notes & Reading</span>
              </div>
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="text-purple-600" size={16} />
                <span className="text-sm text-gray-700">Quizzes & Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBook className="text-blue-600" size={16} />
                <span className="text-sm text-gray-700">Other Resources</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-300">
                <div className="font-medium text-blue-800 mb-1">
                  💡 Learning Tips:
                </div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Complete prerequisites before starting this concept</li>
                  <li>
                    • Click on any prerequisite to learn more about it first
                  </li>
                  <li>
                    • Use the "Start Learning" button to begin with the first
                    resource
                  </li>
                  <li>• Track your progress as you complete each resource</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Prerequisites Section */}
                {conceptData.prerequisites.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaBookmark className="text-orange-500 mr-3" />
                      Prerequisites ({conceptData.prerequisites.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {conceptData.prerequisites.map((prerequisite) => (
                        <div
                          key={prerequisite.conceptId}
                          onClick={() =>
                            handlePrerequisiteClick(prerequisite.conceptId)
                          }
                          className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              <div className="font-semibold text-gray-800 group-hover:text-orange-700">
                                {prerequisite.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Click to view concept
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <FaEye
                                className="text-orange-500 group-hover:text-orange-600"
                                size={14}
                              />
                              <FaExternalLinkAlt
                                className="text-orange-400 group-hover:text-orange-500"
                                size={12}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaBook className="text-blue-500 mr-3" />
                    Learning Resources ({conceptData.resources.length})
                  </h2>
                  <div className="space-y-4">
                    {conceptData.resources.map((resource, index) => (
                      <div
                        key={resource.resourceId}
                        className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer transform hover:scale-102 hover:shadow-lg group ${getResourceBgColor(
                          resource.type
                        )}`}
                        onClick={() => handleResourceClick(resource)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-grow">
                            <div className="text-xl">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-700">
                                {resource.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 text-gray-700 border border-gray-300">
                                  {resource.type}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Resource {index + 1} of{" "}
                                  {conceptData.resources.length}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <FaPlay
                              className="text-blue-500 group-hover:text-blue-600"
                              size={14}
                            />
                            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                              Open
                            </span>
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
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaChartBar className="text-teal-500 mr-2" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Prerequisites:</span>
                      <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full text-sm">
                        {conceptData.prerequisites.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Resources:</span>
                      <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full text-sm">
                        {conceptData.resources.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Videos:</span>
                      <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full text-sm">
                        {
                          conceptData.resources.filter(
                            (r) => r.type === "Video"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Quizzes:</span>
                      <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full text-sm">
                        {
                          conceptData.resources.filter((r) => r.type === "Quiz")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resource Types */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaTags className="text-purple-500 mr-2" />
                    Resource Types
                  </h3>
                  <div className="space-y-3">
                    {Array.from(
                      new Set(conceptData.resources.map((r) => r.type))
                    ).map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="flex items-center">
                          <span className="mr-3">{getResourceIcon(type)}</span>
                          <span className="text-gray-700 font-medium">
                            {type}
                          </span>
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                          {
                            conceptData.resources.filter((r) => r.type === type)
                              .length
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaBolt className="text-green-500 mr-2" />
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        conceptData.resources.length > 0 &&
                        handleResourceClick(conceptData.resources[0])
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FaGraduationCap />
                      Start Learning
                    </button>
                    <button className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2">
                      <FaBookmark />
                      Add to Learning Path
                    </button>
                    <button className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2">
                      <FaShare />
                      Share Concept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
