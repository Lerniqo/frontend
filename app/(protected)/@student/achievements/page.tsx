"use client";

import React from "react";
import { Trophy, Star, Medal, Award, Target, Zap } from "lucide-react";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Your Achievements
          </h1>
          <p className="text-white/70 text-lg">
            Track your progress and celebrate your learning milestones
          </p>
        </div>

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Achievement Cards */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">First Steps</h3>
                <p className="text-white/60 text-sm">
                  Complete your first lesson
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-full" />
            </div>
            <p className="text-yellow-400 text-sm mt-2">Completed</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick Learner</h3>
                <p className="text-white/60 text-sm">
                  Complete 5 lessons in a day
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/5" />
            </div>
            <p className="text-blue-400 text-sm mt-2">3/5 completed</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Perfect Score</h3>
                <p className="text-white/60 text-sm">Get 100% on a quiz</p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-full" />
            </div>
            <p className="text-purple-400 text-sm mt-2">Completed</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Consistent</h3>
                <p className="text-white/60 text-sm">
                  Study for 7 days straight
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/6" />
            </div>
            <p className="text-green-400 text-sm mt-2">5/7 days</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Speed Runner</h3>
                <p className="text-white/60 text-sm">
                  Complete lesson in under 5 minutes
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/20 rounded-full w-0" />
            </div>
            <p className="text-white/60 text-sm mt-2">Not started</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Math Master</h3>
                <p className="text-white/60 text-sm">
                  Complete advanced mathematics module
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-2/3" />
            </div>
            <p className="text-cyan-400 text-sm mt-2">8/12 chapters</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Achievement Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                12
              </div>
              <p className="text-white/70 text-sm">Total Achievements</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                8
              </div>
              <p className="text-white/70 text-sm">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                3
              </div>
              <p className="text-white/70 text-sm">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                67%
              </div>
              <p className="text-white/70 text-sm">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
