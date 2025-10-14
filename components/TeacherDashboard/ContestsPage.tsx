"use client";

import React, { useState, useEffect } from "react";
import { getContests, Contest } from "@/services/teacherDashboardService";
import ContestManager from "./ContestManager";
import SubMenu from "./SubMenu";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContestSubsection, setActiveContestSubsection] =
    useState("active");

  useEffect(() => {
    const loadData = async () => {
      try {
        const contestsRes = await getContests();
        if (contestsRes.success) setContests(contestsRes.data || []);
      } catch (error) {
        console.error("Error loading contests data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Contest Management" />;
  }

  const contestItems = [
    {
      id: "active",
      label: "Active Contests",
      icon: "🏆",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "draft",
      label: "Draft Contests",
      icon: "📝",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "completed",
      label: "Completed",
      icon: "✅",
      color: "from-green-500 to-green-600",
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
              Contest Management Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Create, manage, and track educational contests to engage your
              students and enhance their learning experience.
            </p>
          </header>

          <div className="mb-16">
            <SubMenu
              items={contestItems}
              activeItem={activeContestSubsection}
              onItemChange={setActiveContestSubsection}
              title="Contest Sections"
            />
          </div>

          <div className="transition-all duration-700 ease-in-out">
            <div className="max-w-6xl mx-auto">
              <div className="group relative">
                <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                  <div className="absolute top-4 left-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-purple-700">
                        {contestItems.find(
                          (item) => item.id === activeContestSubsection
                        )?.label || "Contest Management"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <ContestManager
                      contests={contests}
                      setContests={setContests}
                    />
                  </div>
                </div>
              </div>
            </div>
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
