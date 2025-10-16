"use client";

import { useEffect, useState } from "react";
import {
  getAllContests,
  getTopRankersByContestId,
  createNewContest,
  checkWeekAvailability,
  Contest,
  TopRanker,
  CreateContestData,
} from "@/services/contestService";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Plus,
  X,
  Medal,
  Star,
  Sparkles,
} from "lucide-react";

export default function ContestManagementPage() {
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [topRankers, setTopRankers] = useState<TopRanker[]>([]);
  const [loadingRankers, setLoadingRankers] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateContestData>({
    eventName: "",
    subtitle: "",
    bannerImage: "",
    startDate: "",
    endDate: "",
    tasks: [],
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await getAllContests();
      setContests(data);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContestClick = async (contest: Contest) => {
    const now = new Date();
    const startDate = new Date(contest.startDate);

    // Don't fetch rankers for future contests
    if (startDate > now) {
      setSelectedContest(contest);
      setTopRankers([]);
      return;
    }

    setSelectedContest(contest);
    setLoadingRankers(true);
    try {
      const rankers = await getTopRankersByContestId(contest.eventId);
      setTopRankers(rankers);
    } catch (error) {
      console.error("Failed to fetch top rankers:", error);
    } finally {
      setLoadingRankers(false);
    }
  };

  const handleBack = () => {
    setSelectedContest(null);
    setTopRankers([]);
  };

  const handleCreateContest = async () => {
    const errors: string[] = [];

    if (!formData.eventName) errors.push("Event name is required");
    if (!formData.subtitle) errors.push("Subtitle is required");
    if (!formData.bannerImage) errors.push("Banner image URL is required");
    if (!formData.startDate) errors.push("Start date is required");
    if (!formData.endDate) errors.push("End date is required");
    if (formData.tasks.length === 0)
      errors.push("At least one task is required");
    if (formData.tasks.length > 5) errors.push("Maximum 5 tasks allowed");

    // Validate week availability
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Check if start is Monday and end is Sunday
      if (startDate.getDay() !== 1) {
        errors.push("Start date must be a Monday");
      }
      if (endDate.getDay() !== 0) {
        errors.push("End date must be a Sunday");
      }

      // Check if week is available
      const isAvailable = await checkWeekAvailability(
        formData.startDate,
        formData.endDate
      );
      if (!isAvailable) {
        errors.push("This week is already occupied by another contest");
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setLoading(true);
    try {
      await createNewContest(formData);
      alert("Contest created successfully!");
      // Reset form
      setFormData({
        eventName: "",
        subtitle: "",
        bannerImage: "",
        startDate: "",
        endDate: "",
        tasks: [],
      });
      setShowCreateForm(false);
      // Reload page to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to create contest:", error);
      alert("Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    if (formData.tasks.length >= 5) {
      alert("Maximum 5 tasks allowed");
      return;
    }
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          title: "",
          description: "",
          goal: 0,
          unit: "",
          rewardPoints: 0,
          type: "1v1_battle",
        },
      ],
    });
  };

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== index),
    });
  };

  const updateTask = (index: number, field: string, value: any) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };

    // Update unit and description based on task type
    if (field === "type") {
      if (value === "1v1_battle") {
        newTasks[index].unit = "wins";
        newTasks[
          index
        ].description = `Win ${newTasks[index].goal} One vs One Battles`;
      } else if (value === "ai_quiz") {
        newTasks[index].unit = "score";
        newTasks[index].description = `Score ${
          newTasks[index].goal
        }+ in AI-Generated ${newTasks[index].difficulty || "medium"} Quiz`;
      }
    }

    if (field === "goal" && newTasks[index].type === "1v1_battle") {
      newTasks[index].description = `Win ${value} One vs One Battles`;
    }

    if (
      (field === "goal" || field === "difficulty") &&
      newTasks[index].type === "ai_quiz"
    ) {
      newTasks[index].description = `Score ${
        newTasks[index].goal
      }+ in AI-Generated ${newTasks[index].difficulty || "medium"} Quiz`;
    }

    setFormData({ ...formData, tasks: newTasks });
  };

  // Categorize contests
  const now = new Date();
  const activeAndPastContests = contests.filter((contest) => {
    const startDate = new Date(contest.startDate);
    return startDate <= now;
  });

  const futureContests = contests.filter((contest) => {
    const startDate = new Date(contest.startDate);
    return startDate > now;
  });

  // Sort active and past contests: active first, then by date descending
  const sortedActiveAndPast = [...activeAndPastContests].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Sort future contests by start date ascending
  const sortedFutureContests = [...futureContests].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  if (loading) {
    return <GeneralLoadingComponent text="Loading Contest Management" />;
  }

  if (loadingRankers && selectedContest) {
    return <GeneralLoadingComponent text="Loading Top Rankers" />;
  }

  // Detail View
  if (selectedContest) {
    const isFutureContest = new Date(selectedContest.startDate) > now;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="group flex items-center space-x-2 px-4 py-2.5 mb-6 bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300/60 transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                Back to All Contests
              </span>
            </button>

            {/* Contest Header with Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
              <div
                className="h-64 bg-cover bg-center relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${selectedContest.bannerImage})`,
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">
                      {selectedContest.eventName}
                    </h1>
                    {selectedContest.isActive && (
                      <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                        In Progress
                      </span>
                    )}
                    {isFutureContest && (
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <p className="text-white/90 text-lg">
                    {selectedContest.subtitle}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          selectedContest.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(selectedContest.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Contest Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedContest.tasks.map((task, index) => (
                  <div
                    key={task.taskId}
                    className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800 flex-1">
                        {task.title}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        {task.rewardPoints} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Goal:</span> {task.goal}{" "}
                        {task.unit}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status.replace("_", " ").toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Rankers Section - Only show for non-future contests */}
            {!isFutureContest && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Top Rankers
                </h2>
                {topRankers.length > 0 ? (
                  <div className="space-y-3">
                    {topRankers.map((ranker) => (
                      <div
                        key={ranker.rank}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-lg ${
                          ranker.rank === 1
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400"
                            : ranker.rank === 2
                            ? "bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400"
                            : ranker.rank === 3
                            ? "bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                              ranker.rank === 1
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                : ranker.rank === 2
                                ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                                : ranker.rank === 3
                                ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {ranker.rank <= 3 ? (
                              <Medal className="w-6 h-6" />
                            ) : (
                              ranker.rank
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {ranker.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Rank #{ranker.rank}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-xl text-gray-800">
                            {ranker.points}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No ranking data available yet.
                  </p>
                )}
              </div>
            )}

            {isFutureContest && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 text-center">
                <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Upcoming Contest
                </h3>
                <p className="text-gray-600">
                  This contest hasn't started yet. Rankings will be available
                  after the contest begins.
                </p>
              </div>
            )}
          </div>
        </section>

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
        `}</style>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <section className="relative z-10 py-16">
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <header className="mb-8 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
                  Contest Management
                </h1>
                <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                  Manage student contests and view leaderboards
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                {showCreateForm ? (
                  <>
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Create New Contest</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Create Contest Form */}
          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Contest
              </h2>

              {formErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="font-bold text-red-800 mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Math Challenge Week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Compete and win amazing rewards!"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.bannerImage}
                    onChange={(e) =>
                      setFormData({ ...formData, bannerImage: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date (Monday) *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date (Sunday) *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tasks Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Tasks (Max 5)
                  </h3>
                  <button
                    onClick={addTask}
                    disabled={formData.tasks.length >= 5}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    + Add Task
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800">
                          Task {index + 1}
                        </h4>
                        <button
                          onClick={() => removeTask(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Task Type
                          </label>
                          <select
                            value={task.type}
                            onChange={(e) =>
                              updateTask(index, "type", e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                          >
                            <option value="1v1_battle">1v1 Battle</option>
                            <option value="ai_quiz">AI Quiz</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) =>
                              updateTask(index, "title", e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder="Task title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {task.type === "1v1_battle"
                              ? "Number of Wins"
                              : "Minimum Score"}
                          </label>
                          <input
                            type="number"
                            value={task.goal}
                            onChange={(e) =>
                              updateTask(
                                index,
                                "goal",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder={
                              task.type === "1v1_battle" ? "10" : "8"
                            }
                          />
                        </div>

                        {task.type === "ai_quiz" && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Difficulty
                            </label>
                            <select
                              value={task.difficulty || "medium"}
                              onChange={(e) =>
                                updateTask(index, "difficulty", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reward Points
                          </label>
                          <input
                            type="number"
                            value={task.rewardPoints}
                            onChange={(e) =>
                              updateTask(
                                index,
                                "rewardPoints",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            placeholder="100"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={task.description}
                            onChange={(e) =>
                              updateTask(index, "description", e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                            rows={2}
                            placeholder="Task description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCreateContest}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Create Contest
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      eventName: "",
                      subtitle: "",
                      bannerImage: "",
                      startDate: "",
                      endDate: "",
                      tasks: [],
                    });
                    setFormErrors([]);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Active and Past Contests */}
          {sortedActiveAndPast.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Active & Past Contests{" "}
                {sortedActiveAndPast.filter((c) => c.isActive).length > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    ({sortedActiveAndPast.filter((c) => c.isActive).length}{" "}
                    Active,{" "}
                    {sortedActiveAndPast.filter((c) => !c.isActive).length}{" "}
                    Completed)
                  </span>
                )}
              </h2>
              <div className="relative">
                <div
                  className="flex overflow-x-auto space-x-6 lg:space-x-8 pt-3 pb-8 scroll-smooth"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {sortedActiveAndPast.map((contest) => (
                    <div
                      key={contest.eventId}
                      onClick={() => handleContestClick(contest)}
                      className="flex-shrink-0 w-[400px] rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden relative bg-white"
                      style={{
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(135deg, #8B5CF6, #3B82F6) border-box",
                        border: "3px solid transparent",
                      }}
                    >
                      {/* Banner Image */}
                      <div
                        className="h-48 bg-cover bg-center relative"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${contest.bannerImage})`,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                              {contest.eventName}
                            </h3>
                            {contest.isActive ? (
                              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full animate-pulse">
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-white/90 text-sm line-clamp-2">
                            {contest.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-white p-6">
                        <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">
                              {new Date(contest.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">
                              {contest.tasks.length} Tasks
                            </span>
                          </div>
                        </div>

                        <button className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Future Contests */}
          {sortedFutureContests.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Upcoming Contests
              </h2>
              <div className="relative">
                <div
                  className="flex overflow-x-auto space-x-6 lg:space-x-8 pt-3 pb-8 scroll-smooth"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {sortedFutureContests.map((contest) => (
                    <div
                      key={contest.eventId}
                      onClick={() => handleContestClick(contest)}
                      className="flex-shrink-0 w-[400px] rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden relative bg-white"
                      style={{
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(135deg, #8B5CF6, #3B82F6) border-box",
                        border: "3px solid transparent",
                      }}
                    >
                      {/* Banner Image */}
                      <div
                        className="h-48 bg-cover bg-center relative"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${contest.bannerImage})`,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                              {contest.eventName}
                            </h3>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full">
                              Upcoming
                            </span>
                          </div>
                          <p className="text-white/90 text-sm line-clamp-2">
                            {contest.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-white p-6">
                        <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              Starts:{" "}
                              {new Date(contest.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">
                              {contest.tasks.length} Tasks
                            </span>
                          </div>
                        </div>

                        <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {contests.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No contests available</p>
              <p className="text-gray-500 mt-2">
                Create your first contest to get started!
              </p>
            </div>
          )}
        </div>
      </section>

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

        /* Hide scrollbar for horizontal scroll containers */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
