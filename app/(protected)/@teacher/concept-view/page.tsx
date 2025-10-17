"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  getConceptByConceptId,
  ConceptDetailResponse,
} from "@/services/contentService";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import SubMenu from "@/components/TeacherDashboard/SubMenu";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";

// Helper function to format names (remove parenthesis, replace hyphens, capitalize)
const formatName = (name: string): string => {
  if (!name) return "";
  // Remove content within parentheses and the parentheses themselves
  let cleaned = name.replace(/\s*\([^)]*\)\s*/g, "").trim();
  // Replace hyphens with spaces
  cleaned = cleaned.replace(/-/g, " ");
  // Capitalize first letter of each word
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function ConceptViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptId = searchParams.get("conceptId");

  const [conceptData, setConceptData] = useState<ConceptDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"prerequisites" | "resources">(
    "prerequisites"
  );

  useEffect(() => {
    const fetchConceptData = async () => {
      if (!conceptId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getConceptByConceptId(conceptId);
        console.log("data" , data)
        setConceptData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch concept data";
        setError(errorMessage);
        console.error("❌ Error fetching concept:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConceptData();
  }, [conceptId]);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Concept Details" />;
  }

  if (!conceptId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ No Concept Selected
            </h3>
            <p className="text-red-600">
              Please select a concept from the Learning Resources page to view
              its details.
            </p>
            <button
              onClick={() => router.push("/resource-library")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Learning Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ❌ Error Loading Concept
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/resource-library")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Learning Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!conceptData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-8 relative">
            {/* Back Button */}
            <div className="absolute top-0 right-0">
              <button
                onClick={() => router.back()}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300/60 transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                  Back
                </span>
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              {formatName(conceptData.name)}
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              {conceptData.description}
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              {conceptData.type}
            </div>
          </header>

          {/* View Mode Selector */}
          <div className="mb-8">
            <SubMenu
              items={[
                {
                  id: "prerequisites",
                  label: "Prerequisites",
                  icon: "📚",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  id: "resources",
                  label: "Learning Resources",
                  icon: "📄",
                  color: "from-purple-600 to-purple-700",
                },
              ]}
              activeItem={viewMode}
              onItemChange={(item) =>
                setViewMode(item as "prerequisites" | "resources")
              }
              title="View Mode"
            />
          </div>

          {/* Main Content */}
          <div className="transition-all duration-700 ease-in-out">
            {viewMode === "prerequisites" && (
              <div
                className="p-8 overflow-y-auto custom-scrollbar"
                style={{
                  height: "calc(100vh - 400px)",
                  minHeight: "500px",
                }}
              >
                {/* <div className="flex items-center space-x-2 mb-6">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Prerequisites
                  </h2>
                </div> */}

                {conceptData.prerequisites &&
                conceptData.prerequisites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {conceptData.prerequisites.map((prereq) => (
                      <button
                        key={prereq.conceptId}
                        onClick={() =>
                          router.push(
                            `/concept-view?conceptId=${prereq.conceptId}`
                          )
                        }
                        className="text-left px-6 py-4 rounded-xl transition-all border bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 hover:shadow-md transform hover:scale-102"
                      >
                        <p className="font-semibold text-gray-800">
                          {formatName(prereq.name)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {prereq.description}
                        </p>
                        <div className="mt-2 inline-block px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                          {prereq.type}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      No prerequisites for this concept
                    </p>
                    <p className="text-sm mt-2">
                      You can start learning this concept directly!
                    </p>
                  </div>
                )}
              </div>
            )}

            {viewMode === "resources" && (
              <div
                className="overflow-y-auto custom-scrollbar"
                style={{
                  height: "calc(100vh - 400px)",
                  minHeight: "500px",
                }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Learning Resources
                  </h2>
                </div>

                {conceptData.learningResources &&
                conceptData.learningResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {conceptData.learningResources.map((resource) => (
                      <button
                        key={resource.resourceId}
                        onClick={() => {
                          if (resource.url) {
                            window.open(resource.url, "_blank");
                          }
                        }}
                        className="text-left px-6 py-4 rounded-xl transition-all border bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 hover:shadow-md transform hover:scale-102"
                      >
                        <p className="font-semibold text-gray-800">
                          {resource.name || "Unnamed Resource"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-block px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs font-medium">
                            {resource.type}
                          </div>
                          {resource.price > 0 ? (
                            <span className="text-sm font-semibold text-green-600">
                              ${resource.price}
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-blue-600">
                              Free
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      No learning resources available
                    </p>
                    <p className="text-sm mt-2">
                      Resources will be added soon!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CSS for animations and custom scrollbar */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        :global(.animate-blob) {
          animation: blob 7s infinite;
        }

        :global(.animation-delay-2000) {
          animation-delay: 2s;
        }

        :global(.animation-delay-4000) {
          animation-delay: 4s;
        }

        /* Custom Scrollbar Styles */
        :global(.custom-scrollbar::-webkit-scrollbar) {
          width: 10px;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-track) {
          background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
          border-radius: 10px;
          margin: 10px 0;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
          background: linear-gradient(180deg, #a855f7, #9333ea);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
          background: linear-gradient(180deg, #9333ea, #7e22ce);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb:active) {
          background: linear-gradient(180deg, #7e22ce, #6b21a8);
        }

        /* Firefox Scrollbar */
        :global(.custom-scrollbar) {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #f3f4f6;
        }
      `}</style>
    </div>
  );
}

export default function ConceptViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading concept...</p>
          </div>
        </div>
      }
    >
      <ConceptViewContent />
    </Suspense>
  );
}
