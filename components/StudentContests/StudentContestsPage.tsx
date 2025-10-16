"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Users, Trophy, Clock, Target } from "lucide-react";
import Link from "next/link";
import {
  getStudentContests,
  StudentContest,
} from "@/services/studentContestService";
import ContestCard from "./ContestCard";
import ContestDetails from "./ContestDetails";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentContestsPage() {
  const [contests, setContests] = useState<StudentContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState<StudentContest | null>(
    null
  );
  const [filter, setFilter] = useState<
    "all" | "active" | "upcoming" | "completed"
  >("all");

  useEffect(() => {
    const loadContests = async () => {
      try {
        const response = await getStudentContests();
        if (response.success && response.data) {
          setContests(response.data);
        }
      } catch (error) {
        console.error("Error loading contests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  const filteredContests = contests.filter((contest) => {
    if (filter === "all") return true;
    return contest.status === filter;
  });

  const stats = {
    total: contests.length,
    active: contests.filter((c) => c.status === "active").length,
    upcoming: contests.filter((c) => c.status === "upcoming").length,
    completed: contests.filter((c) => c.status === "completed").length,
    joined: contests.filter((c) => c.isJoined).length,
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
                Loading Contests
              </h3>
              <p className="text-gray-600 text-lg">
                Discovering exciting competitions for you...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedContest) {
    return (
      <ContestDetails
        contest={selectedContest}
        onBack={() => setSelectedContest(null)}
        onUpdate={(updatedContest: StudentContest) => {
          setContests((prev) =>
            prev.map((c) => (c.id === updatedContest.id ? updatedContest : c))
          );
          setSelectedContest(updatedContest);
        }}
      />
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

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav
            className="flex mb-6 sm:mb-8 animate-fade-in"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-1 md:space-x-3">
              <li className="flex items-center">
                <Link
                  href="/dashboard"
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
                </Link>
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
                    Contests
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in animation-delay-500">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform hover:scale-105 transition-transform duration-500">
              Contest{" "}
              <span className="bg-gradient-to-r from-purple-700 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Arena
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
              Challenge yourself in exciting academic competitions and compete
              with students worldwide
            </p>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12"
          >
            <div className="group relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stats.total}
                    </h3>
                    <p className="text-purple-600 font-medium text-sm">
                      Total Contests
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stats.active}
                    </h3>
                    <p className="text-green-600 font-medium text-sm">
                      Active Now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stats.upcoming}
                    </h3>
                    <p className="text-yellow-600 font-medium text-sm">
                      Upcoming
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stats.completed}
                    </h3>
                    <p className="text-purple-600 font-medium text-sm">
                      Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stats.joined}
                    </h3>
                    <p className="text-indigo-600 font-medium text-sm">
                      Joined
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {(["all", "active", "upcoming", "completed"] as const).map(
              (filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 ${
                    filter === filterOption
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white border-purple-400 shadow-lg shadow-purple-500/25"
                      : "bg-white/80 text-gray-700 border-purple-200 hover:bg-white hover:text-gray-800 hover:border-purple-300"
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              )
            )}
          </motion.div>

          {/* Contests Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredContests.map((contest, index) => (
                <motion.div
                  key={contest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ContestCard
                    contest={contest}
                    onClick={() => setSelectedContest(contest)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredContests.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-200">
                  <Trophy className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No contests found
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "No contests are available at the moment."
                    : `No ${filter} contests available.`}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
