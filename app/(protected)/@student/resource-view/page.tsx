"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

function ResourceViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resourceId");

  if (!resourceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ No Resource Selected
            </h3>
            <p className="text-red-600">
              Please select a resource from the concept view page to view its
              details.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
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
              Resource Preview
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Viewing learning resource
            </p>
          </header>

          {/* Content Area */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-lg p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Resource ID
                </h2>
                <p className="text-gray-600 font-mono text-sm break-all">
                  {resourceId}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Resource Preview
                </h3>
                <p className="text-gray-600 mb-4">
                  This is a placeholder for the resource view page. The full
                  implementation will include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>PDF viewer for document resources</li>
                  <li>Video player for video content</li>
                  <li>Interactive quiz interfaces</li>
                  <li>Resource download options</li>
                  <li>Progress tracking</li>
                  <li>Bookmarking and notes</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ✅ Successfully Loaded
                </h3>
                <p className="text-gray-600">
                  The resource ID has been successfully passed to this page via
                  URL parameters. Integration with the backend API will be
                  implemented to fetch and display the actual resource content.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🚧 Under Development
                </h3>
                <p className="text-gray-600">
                  This page is currently under development. Once completed, it
                  will provide a comprehensive resource viewing experience with
                  interactive features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
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
      `}</style>
    </div>
  );
}

export default function ResourceViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resource...</p>
          </div>
        </div>
      }
    >
      <ResourceViewContent />
    </Suspense>
  );
}
