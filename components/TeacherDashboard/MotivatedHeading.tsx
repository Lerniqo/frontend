"use client";

import React from "react";

export default function MotivatedHeading() {
  return (
    <div className="text-center relative">
      <div className="relative animate-fade-in-up">
        {/* Enhanced background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-3xl blur-2xl scale-110 animate-pulse-glow"></div>

        <div className="relative bg-white border border-gray-200 rounded-3xl p-12 shadow-xl group overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-3 bg-slate-100 rounded-full px-6 py-3 border border-gray-200 mb-8">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-600 text-sm font-semibold tracking-wide">
                WELCOME BACK
              </span>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Educator Portal
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Your expertise shapes tomorrow&apos;s leaders. Every lesson, every
              interaction, every moment matters.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="group flex items-center space-x-3 bg-slate-50 rounded-2xl px-6 py-4 border border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  💡
                </div>
                <span className="text-gray-700 font-semibold">Inspire</span>
              </div>
              <div className="group flex items-center space-x-3 bg-slate-50 rounded-2xl px-6 py-4 border border-gray-200 hover:border-purple-300 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  📚
                </div>
                <span className="text-gray-700 font-semibold">Teach</span>
              </div>
              <div className="group flex items-center space-x-3 bg-slate-50 rounded-2xl px-6 py-4 border border-gray-200 hover:border-green-300 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  🌱
                </div>
                <span className="text-gray-700 font-semibold">Grow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
