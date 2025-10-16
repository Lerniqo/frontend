"use client";

import React, { useState, useEffect } from "react";
import {
  getQuestions,
  getResources,
  Question,
  Resource,
} from "@/services/teacherDashboardService";
import {
  getParticlesAndTopics,
  ParticleOption,
  TopicOption,
  getAllQuestionsByTeacher,
  QuestionResponse,
} from "@/services/contentService";
import QuestionBankManager from "./QuestionBankManager";
import ResourceManager from "./ResourceManager";
import SubMenu from "./SubMenu";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";

export default function ContentManagement() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [particles, setParticles] = useState<ParticleOption[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContentSubsection, setActiveContentSubsection] =
    useState("questions");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsFromApi, resourcesRes, particlesAndTopics] =
          await Promise.all([
            getAllQuestionsByTeacher(),
            getResources(),
            getParticlesAndTopics(),
          ]);

        // Map API response to Question format for UI
        const mappedQuestions: Question[] = questionsFromApi.map(
          (q: QuestionResponse) => {
            // Find the index of the correct answer in the options array
            const correctAnswerIndex = q.options.findIndex(
              (option) => option === q.correctAnswer
            );

            return {
              id: q.id,
              subject: q.tags && q.tags.length > 0 ? q.tags[0] : "General",
              question: q.questionText,
              options: q.options,
              correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
              difficulty: "easy" as "easy" | "medium" | "hard", // Default to easy since API doesn't provide this
            };
          }
        );

        setQuestions(mappedQuestions);
        if (resourcesRes.success) setResources(resourcesRes.data || []);
        setParticles(particlesAndTopics.particles);
        setTopics(particlesAndTopics.topics);
      } catch (error) {
        console.error("Error loading content management data:", error);
      } finally {
        setLoading(false);
        // console.log(particles);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Content Management" />;
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
                        particles={particles}
                        topics={topics}
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
