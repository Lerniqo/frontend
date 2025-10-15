"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConceptViewContent() {
  const searchParams = useSearchParams();
  const conceptId = searchParams.get("conceptId");

  return (
    <div className="min-h-screen bg-white">
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-20">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              Concept View
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Detailed view of the selected concept
            </p>
          </header>

          {/* Content Area */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-purple-700">
                  Concept Details
                </span>
              </div>

              {conceptId ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Concept ID
                    </h2>
                    <p className="text-gray-600 font-mono text-sm break-all">
                      {conceptId}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      📚 Content Coming Soon
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This is a placeholder for the concept view page. Here you
                      will be able to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>View detailed concept information</li>
                      <li>Access learning materials and resources</li>
                      <li>Watch video explanations</li>
                      <li>Practice with exercises</li>
                      <li>Track your progress</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      ✅ Successfully Loaded
                    </h3>
                    <p className="text-gray-600">
                      The concept ID has been successfully passed to this page
                      via URL parameters.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    ⚠️ No Concept Selected
                  </h3>
                  <p className="text-red-600">
                    Please select a concept from the Learning Resources page to
                    view its details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
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
