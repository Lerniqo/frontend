'use client';

import React from 'react';

export default function MotivatedHeading() {
  return (
    <div className="text-center mb-20">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-8">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-semibold tracking-wide">WELCOME BACK</span>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-tight">
            Educator Portal
          </h1>

          <p className="text-2xl md:text-3xl mb-10 text-slate-300 leading-relaxed max-w-4xl mx-auto">
            Your expertise shapes tomorrow&apos;s leaders. Every lesson, every interaction, every moment matters.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="group flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">💡</div>
              <span className="text-white font-semibold">Inspire</span>
            </div>
            <div className="group flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">📚</div>
              <span className="text-white font-semibold">Teach</span>
            </div>
            <div className="group flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">🌱</div>
              <span className="text-white font-semibold">Grow</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 left-6 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-8 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
    </div>
  );
}
