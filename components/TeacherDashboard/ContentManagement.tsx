"use client";

import React, { useState, useEffect } from "react";
import {
  getQuestions,
  getResources,
  Question,
  Resource,
} from "@/services/teacherDashboardService";
import QuestionBankManager from "./QuestionBankManager";
import ResourceManager from "./ResourceManager";
import SubMenu from "./SubMenu";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";

export default function ContentManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContentSubsection, setActiveContentSubsection] =
    useState("questions");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsRes, resourcesRes] = await Promise.all([
          getQuestions(),
          getResources(),
        ]);

        if (questionsRes.success) setQuestions(questionsRes.data || []);
        if (resourcesRes.success) setResources(resourcesRes.data || []);
      } catch (error) {
        console.error("Error loading content management data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-white">
                Loading Content Management
              </h3>
              <p className="text-slate-400 text-lg">
                Setting up your content tools...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contentItems = [
    {
      id: "questions",
      label: "Question Bank",
      icon: "❓",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "resources",
      label: "Resources",
      icon: "📚",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Navigation */}
      <SharedNavigation
        onLogout={() => {
          // Handle logout logic here
          console.warn("Logout functionality not implemented");
        }}
      />

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-20">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              Your Content Command Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Here you can effortlessly upload, organize, and manage all your
              educational resources for your students.
            </p>
          </header>

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
                <div className="group relative">
                  <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                    <div className="absolute top-4 left-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          Question Bank
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <QuestionBankManager
                        questions={questions}
                        setQuestions={setQuestions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeContentSubsection === "resources" && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                    <div className="absolute top-4 left-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          Resource Library
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <ResourceManager
                        resources={resources}
                        setResources={setResources}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <TeacherFooter />

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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
