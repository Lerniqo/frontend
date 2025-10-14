"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConceptContent() {
  const searchParams = useSearchParams();
  const conceptId = searchParams.get("conceptId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-6">
            Concept Learning Page
          </h1>
          <div className="text-xl text-slate-300 mb-8">
            <p className="mb-4">Welcome to the concept learning page!</p>
            {conceptId ? (
              <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50">
                <p className="text-emerald-400 font-semibold mb-2">
                  Current Concept ID:
                </p>
                <p className="text-white font-mono text-lg">{conceptId}</p>
              </div>
            ) : (
              <div className="bg-red-900/30 p-6 rounded-lg border border-red-600/50">
                <p className="text-red-400">
                  No concept ID provided in the URL
                </p>
              </div>
            )}
          </div>
          <div className="text-slate-400">
            <p>
              This page will display detailed learning materials, videos,
              exercises,
            </p>
            <p>and interactive content for the selected concept.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConceptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-white text-xl">Loading concept...</div>
        </div>
      }
    >
      <ConceptContent />
    </Suspense>
  );
}
