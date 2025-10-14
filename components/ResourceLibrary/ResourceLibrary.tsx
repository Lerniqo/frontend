"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Grid, List } from "lucide-react";
import { Resource, SearchFilters } from "@/types/resource.types";
import { ResourceService } from "@/services/resourceService";
import SearchAndFilterBar from "@/components/ResourceLibrary/SearchAndFilterBar";
import HierarchicalFilters from "@/components/ResourceLibrary/HierarchicalFilters";
import ResourceCard from "@/components/ResourceLibrary/ResourceCard";
import FadeIn from "@/components/ui/FadeIn";

const ResourceLibrary: React.FC = () => {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    filters: {
      particle: "",
      atom: "",
      molecule: "",
      matter: "",
    },
  });

  useEffect(() => {
    loadInitialResources();
  }, []);

  const loadInitialResources = async () => {
    try {
      setLoading(true);
      const allResources = await ResourceService.getAllResources();
      setResources(allResources);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchFilters: SearchFilters) => {
    try {
      setSearchLoading(true);
      setFilters(searchFilters);
      const filteredResources = await ResourceService.searchResources(
        searchFilters
      );
      setResources(filteredResources);
    } catch (error) {
      console.error("Error searching resources:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleHierarchicalFilterChange = async (
    level: string,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      filters: {
        ...filters.filters,
        [level]: value,
      },
    };
    await handleSearch(newFilters);
  };

  const handleResourceClick = (resource: Resource) => {
    // Navigate to the learning resource page with the resource details
    const params = new URLSearchParams({
      resourceId: resource.id,
      type: resource.type,
      url: resource.url,
    });
    router.push(`/learning-resource?${params.toString()}`);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Loading Resource Library
              </h3>
              <p className="text-gray-600 text-lg">
                Discovering educational resources for you...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex mb-6 sm:mb-8 animate-fade-in"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="text-purple-600 hover:text-purple-700 transition-all duration-300 flex items-center text-sm sm:text-base transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4 mr-1 sm:mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-purple-700 font-medium text-sm sm:text-base">
                  Resource Library
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <FadeIn delay={100}>
          <div className="text-center mb-8 sm:mb-12 animate-fade-in animation-delay-500">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform hover:scale-105 transition-transform duration-500">
              Resource{" "}
              <span className="bg-gradient-to-r from-purple-700 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Library
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed mb-8">
              Discover a vast collection of educational resources organized by
              subject, difficulty, and type. Filter through our hierarchical
              system to find exactly what you need for your learning journey.
            </p>

            {/* View Mode Toggle */}
            <div className="flex justify-center items-center mb-6 animate-fade-in animation-delay-1000">
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-1 flex shadow-lg hover:shadow-xl transition-shadow duration-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-700 to-blue-500 text-white shadow-md"
                      : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-purple-700 to-blue-500 text-white shadow-md"
                      : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Search and Filter Section */}
        <FadeIn delay={300}>
          <div className="mb-12">
            <SearchAndFilterBar
              onSearch={handleSearch}
              totalResults={resources.length}
              isLoading={searchLoading}
            />
          </div>
        </FadeIn>

        {/* Resources Grid/List */}
        <FadeIn delay={700}>
          <div className="mb-16">
            {resources.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-2 border-purple-200">
                  <BookOpen className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  No Resources Found
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find the
                  resources you&apos;re looking for.
                </p>
                <button
                  onClick={() =>
                    handleSearch({
                      searchTerm: "",
                      filters: {
                        particle: "",
                        atom: "",
                        molecule: "",
                        matter: "",
                      },
                    })
                  }
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                }
              >
                {resources.map((resource, index) => (
                  <FadeIn key={resource.id} delay={800 + index * 100}>
                    <div className="h-full">
                      <ResourceCard
                        resource={resource}
                        onClick={handleResourceClick}
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Load More Button (for future pagination) */}
        {resources.length > 0 && (
          <div className="text-center">
            <button
              disabled
              className="px-8 py-4 bg-white/80 text-gray-500 rounded-2xl border-2 border-purple-200 cursor-not-allowed font-semibold"
            >
              More resources coming soon...
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
          opacity: 0;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
          opacity: 0;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
          opacity: 0;
        }
        .animation-delay-2500 {
          animation-delay: 2.5s;
          opacity: 0;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ResourceLibrary;
