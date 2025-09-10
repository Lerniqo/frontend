"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { gsap } from "gsap";

import LoadingComponent from "@/components/CommonComponents/Loading";

import VideoResource from "@/components/LearningResourcesComponents/VideoResource";
import NoteResource from "@/components/LearningResourcesComponents/NoteResource";
import AITutorButton from "@/components/LearningResourcesComponents/AITutorButton";
import AITutorModel from "@/components/LearningResourcesComponents/AITutorModel";
import QuizzResource from "@/components/LearningResourcesComponents/QuizzResource";

function ResourcePageContent() {
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resourceId");
  const type = searchParams.get("type");
  const url = searchParams.get("url");

  const [loading, setLoading] = useState(true);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && resourceId && type && url) {
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
  }, [loading, resourceId, type, url]);

  const _getResourceBgColor = (type: string) => {
    switch (type) {
      case "Video":
        return "from-red-100 to-pink-100";
      case "Note":
        return "from-green-100 to-emerald-100";
      case "Quiz":
        return "from-purple-100 to-indigo-100";
      default:
        return "from-slate-100 to-gray-100";
    }
  };

  const renderResourceContent = () => {
    if (!url || !type) return null;

    switch (type) {
      case "Video":
        return <VideoResource url={url} />;

      case "Quiz":
        return <QuizzResource resourceId={resourceId} />;

      case "Note":
        return <NoteResource url={url} />;

      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Learning Resource
            </h3>
            <a
              href={url}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Open Resource
            </a>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (!resourceId || !type || !url) {
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
            Invalid Resource
          </h2>
          <p className="text-gray-600 mb-4">
            The requested resource could not be found or is missing required
            parameters.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white p-4">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div ref={headerRef} className="flex items-center gap-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white hover:text-white font-medium"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{type} Resource</h1>
                <p className="text-purple-100">
                  Resource ID: <span className="font-medium">{resourceId}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="">{renderResourceContent()}</div>
        </div>
      </div>

      {/* AI Tutor Button - Fixed to screen bottom right - Only show if not Quiz */}
      {type !== "Quiz" && (
        <AITutorButton onClick={() => setIsAITutorOpen(true)} />
      )}

      {/* AI Tutor Modal */}
      <AITutorModel
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
      />
    </div>
  );
}

export default function ResourcePage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ResourcePageContent />
    </Suspense>
  );
}
