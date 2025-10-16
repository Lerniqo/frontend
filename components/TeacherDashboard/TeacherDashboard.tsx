"use client";

import React, { useState, useEffect } from "react";
import {
  getNotifications,
  getQuestions,
  getResources,
  getWebinars,
  getAvailability,
  getContests,
  getAllTeachersSessions,
  Notification,
  Question,
  Resource,
  Webinar,
  AvailabilitySlot,
  Contest,
  TeacherSession,
} from "@/services/teacherDashboardService";
import {
  getParticlesAndTopics,
  ParticleOption,
  TopicOption,
} from "@/services/contentService";
import NavigationMenu from "./NavigationMenu";
import MotivatedHeading from "./MotivatedHeading";
import AvailabilityManager from "./AvailabilityManager";
import NotificationsPanel from "./NotificationsPanel";
import QuestionBankManager from "./QuestionBankManager";
import ResourceManager from "./ResourceManager";
import WebinarManager from "./WebinarManager";
import ContestManager from "./ContestManager";
import SubMenu from "./SubMenu";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [sessions, setSessions] = useState<TeacherSession[]>([]);
  const [particles, setParticles] = useState<ParticleOption[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loading, setLoading] = useState(true);

  // New state for popups
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // New state for submenus
  const [activeScheduleSubsection, setActiveScheduleSubsection] =
    useState("availability");
  const [activeContentSubsection, setActiveContentSubsection] =
    useState("questions");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          notificationsRes,
          questionsRes,
          resourcesRes,
          webinarsRes,
          availabilityRes,
          contestsRes,
          sessionsRes,
          particlesAndTopicsRes,
        ] = await Promise.all([
          getNotifications(),
          getQuestions(),
          getResources(),
          getWebinars(),
          getAvailability(),
          getContests(),
          getAllTeachersSessions(),
          getParticlesAndTopics(),
        ]);

        if (notificationsRes.success)
          setNotifications(notificationsRes.data || []);
        if (questionsRes.success) setQuestions(questionsRes.data || []);
        if (resourcesRes.success) setResources(resourcesRes.data || []);
        if (webinarsRes.success) setWebinars(webinarsRes.data || []);
        if (availabilityRes.success)
          setAvailability(availabilityRes.data || []);
        if (contestsRes.success) setContests(contestsRes.data || []);
        if (sessionsRes.success) setSessions(sessionsRes.data || []);
        if (particlesAndTopicsRes && particlesAndTopicsRes.particles) {
          setParticles(particlesAndTopicsRes.particles || []);
          setTopics(particlesAndTopicsRes.topics || []);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Teacher Dashboard" />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-16">
            <div className="text-center mb-12">
              <MotivatedHeading />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500 group">
                <AvailabilityManager
                  availability={availability}
                  setAvailability={setAvailability}
                  sessions={sessions}
                />
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500 group">
                <NotificationsPanel
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>
            </div>
          </div>
        );
      case "schedule":
        const scheduleItems = [
          {
            id: "availability",
            label: "Availability",
            icon: "📅",
            color: "from-blue-500 to-blue-600",
          },
          {
            id: "webinars",
            label: "Webinars",
            icon: "🎥",
            color: "from-purple-500 to-purple-600",
          },
        ];

        return (
          <section className="py-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium tracking-wide">
                  Schedule Management
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Manage Your Schedule
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Set your availability and schedule live sessions for your
                students with precision and ease
              </p>
            </div>

            <div className="mb-16">
              <SubMenu
                items={scheduleItems}
                activeItem={activeScheduleSubsection}
                onItemChange={setActiveScheduleSubsection}
                title="Schedule Sections"
              />
            </div>

            <div className="transition-all duration-700 ease-in-out">
              {activeScheduleSubsection === "availability" && (
                <div className="max-w-6xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <AvailabilityManager
                      availability={availability}
                      setAvailability={setAvailability}
                      sessions={sessions}
                    />
                  </div>
                </div>
              )}

              {activeScheduleSubsection === "webinars" && (
                <div className="max-w-6xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <WebinarManager
                      webinars={webinars}
                      setWebinars={setWebinars}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case "content":
        const contentItems = [
          {
            id: "questions",
            label: "Question Bank",
            icon: "❓",
            color: "from-indigo-500 to-indigo-600",
          },
          {
            id: "resources",
            label: "Resources",
            icon: "📚",
            color: "from-purple-500 to-purple-600",
          },
        ];

        return (
          <section className="py-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-300 text-sm font-medium tracking-wide">
                  Content Management
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Manage Your Content
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Create questions and share educational resources with your
                students
              </p>
            </div>

            <div className="mb-16">
              <SubMenu
                items={contentItems}
                activeItem={activeContentSubsection}
                onItemChange={setActiveContentSubsection}
                title="Content Sections"
              />
            </div>

            <div className="transition-all duration-700 ease-in-out">
              {activeContentSubsection === "questions" && (
                <div className="max-w-6xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <QuestionBankManager
                      questions={questions}
                      setQuestions={setQuestions}
                      particles={particles}
                      topics={topics}
                    />
                  </div>
                </div>
              )}

              {activeContentSubsection === "resources" && (
                <div className="max-w-6xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <ResourceManager
                      resources={resources}
                      setResources={setResources}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case "profile":
        return (
          <section className="py-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium tracking-wide">
                  Profile
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Your Profile
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                View and manage your teacher profile information
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <span className="text-white font-bold text-5xl">T</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Teacher Name
                  </h3>
                  <p className="text-slate-400 mb-12 text-lg">
                    teacher@example.com
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Full Name
                        </label>
                        <p className="text-white text-lg">Teacher Name</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Email
                        </label>
                        <p className="text-white text-lg">
                          teacher@example.com
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Phone
                        </label>
                        <p className="text-white text-lg">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Subject
                        </label>
                        <p className="text-white text-lg">Mathematics</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Experience
                        </label>
                        <p className="text-white text-lg">5+ years</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Location
                        </label>
                        <p className="text-white text-lg">New York, USA</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10">
                    <button
                      onClick={() => setActiveSection("edit-profile")}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case "edit-profile":
        return (
          <section className="py-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-pink-300 text-sm font-medium tracking-wide">
                  Edit Profile
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Edit Your Profile
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Update your information and preferences
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                <form className="space-y-8">
                  <div className="text-center mb-12">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <span className="text-white font-bold text-5xl">T</span>
                    </div>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors duration-300"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Teacher"
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Name"
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="teacher@example.com"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Subject
                      </label>
                      <select className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg">
                        <option value="mathematics">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="english">English</option>
                        <option value="history">History</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Experience
                      </label>
                      <select className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg">
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5+">5+ years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-8">
                    <button
                      type="button"
                      onClick={() => setActiveSection("profile")}
                      className="px-8 py-4 bg-slate-600 text-white rounded-2xl hover:bg-slate-700 transition-all duration-300 shadow-lg hover:scale-105 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:scale-105 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        );
      case "edit-profile":
        return (
          <section className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-pink-300 text-sm font-medium">
                  Edit Profile
                </span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
                Edit Your Profile
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Update your information and preferences
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                <form className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Teacher"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="teacher@example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Subject
                      </label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option value="mathematics">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="english">English</option>
                        <option value="history">History</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Experience
                      </label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5+">5+ years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveSection("profile")}
                      className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        );
      case "contests":
        return (
          <section className="py-16">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-300 text-sm font-medium tracking-wide">
                  Contest Management
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Manage Your Contests
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Create and manage educational contests for your students
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                <ContestManager contests={contests} setContests={setContests} />
              </div>
            </div>
          </section>
        );
      default:
        return (
          <div className="space-y-20">
            <MotivatedHeading />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <AvailabilityManager
                  availability={availability}
                  setAvailability={setAvailability}
                />
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <NotificationsPanel
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <NavigationMenu
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          notifications={notifications}
          setNotifications={setNotifications}
          onLogout={() => {
            // Handle logout logic here
            // You can add actual logout logic like clearing tokens, redirecting, etc.
          }}
          showNotificationPopup={showNotificationPopup}
          showProfileDropdown={showProfileDropdown}
          setShowNotificationPopup={setShowNotificationPopup}
          setShowProfileDropdown={setShowProfileDropdown}
        />

        <main className="relative z-10 flex-1 pt-12 pb-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Premium Footer */}
      <footer className="relative z-10 mt-auto">
        <div className="backdrop-blur-xl bg-white/5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Lerniqo</h3>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                  Empowering teachers and students with innovative learning
                  solutions. Create, manage, and deliver exceptional educational
                  experiences.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Schedule
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Content
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Profile
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-slate-400 text-sm mb-4 md:mb-0">
                  © 2025 Lerniqo. All rights reserved. Built with ❤️ for
                  educators.
                </p>
                <div className="flex items-center space-x-6">
                  <span className="text-slate-400 text-sm">Made with</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-slate-400 text-sm">
                    for the future of education
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
