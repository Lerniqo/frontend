"use client";

import React from "react";
import Link from "next/link";

export default function WebinarIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Webinar Center</h1>
        <p className="text-slate-300 mb-8">
          Join or host interactive webinar sessions
        </p>

        <div className="space-y-4">
          <Link
            href="/webinar/demo-webinar-123"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:scale-105 font-medium"
          >
            Join Demo Webinar
          </Link>

          <div className="mt-4">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
