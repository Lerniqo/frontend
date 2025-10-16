"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  Clock,
  Award,
  ArrowLeft,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getEvent, EventResponse } from "@/services/contentService";
import LoadingComponent from "@/components/CommonComponents/Loading";

export default function StudentContestsPage() {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const data = await getEvent();
        setEventData(data);
      } catch (error) {
        console.error("Error loading event data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Event Found
          </h2>
          <p className="text-gray-600">
            Please check back later for upcoming contests.
          </p>
        </div>
      </div>
    );
  }

  const { contestDetails, topRankers } = eventData;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button - Fixed Position */}
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-md hover:bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-500 hover:border-blue-500 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 text-purple-600" />
          <Home className="w-5 h-5 text-blue-500" />
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </motion.button>
      </div>

      {/* Banner Section - Full Screen */}
      <div className="relative h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${contestDetails.bannerImage})` }}
        >
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Title and Subtitle */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
          >
            {contestDetails.eventName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white font-medium drop-shadow-xl"
          >
            {contestDetails.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-3 text-center">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Challenge Tasks
            </span>
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            Complete these tasks to earn points and climb the leaderboard
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contestDetails.tasks.map((task, index) => {
              const isCompleted = task.progress >= task.goal;
              const progressPercentage = (task.progress / task.goal) * 100;

              return (
                <motion.div
                  key={task.taskId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                    isCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-purple-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{task.description}</p>
                    </div>
                    <div className="ml-4">
                      {isCompleted ? (
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      ) : (
                        <Clock className="w-10 h-10 text-purple-500" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {task.progress} / {task.goal} {task.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : "bg-gradient-to-r from-purple-500 to-blue-500"
                        }`}
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Status and Reward */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        +{task.rewardPoints} Points
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : task.status === "in_progress"
                        ? "In Progress"
                        : "Not Started"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Rankers Section */}
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-3 text-center">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Top Rankers
              </span>
            </h2>
            <p className="text-gray-600 text-center mb-12 text-lg">
              See where you stand among the best performers
            </p>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-5">
                <div className="grid grid-cols-3 gap-4 text-white font-bold text-lg">
                  <div>Rank</div>
                  <div>Name</div>
                  <div className="text-right">Points</div>
                </div>
              </div>

              {/* Rankers List */}
              <div className="divide-y divide-gray-100">
                {topRankers.map((ranker, index) => (
                  <motion.div
                    key={ranker.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`px-8 py-6 hover:bg-purple-50 transition-colors duration-200 ${
                      ranker.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                        : ""
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* Rank */}
                      <div className="flex items-center gap-3">
                        {ranker.rank <= 3 ? (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-lg shadow-lg">
                            {ranker.rank}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
                            {ranker.rank}
                          </div>
                        )}
                        {ranker.rank === 1 && (
                          <Trophy className="w-6 h-6 text-yellow-500" />
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <span
                          className={`font-semibold text-lg ${
                            ranker.rank <= 3 ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {ranker.name}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <span
                          className={`font-bold text-xl ${
                            ranker.rank <= 3
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
                              : "text-purple-600"
                          }`}
                        >
                          {ranker.points}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">pts</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
