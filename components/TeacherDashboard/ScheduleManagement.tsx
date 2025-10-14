"use client";

import React, { useState, useEffect } from "react";
import {
  getWebinars,
  getAvailability,
  Webinar,
  AvailabilitySlot,
} from "@/services/teacherDashboardService";
import AvailabilityManager from "./AvailabilityManager";
import WebinarManager from "./WebinarManager";
import SubMenu from "./SubMenu";
import SharedNavigation from "./SharedNavigation";
import TeacherFooter from "./TeacherFooter";
import GeneralLoadingComponent from "../CommonComponents/GeneralLoadingComponent";

export default function ScheduleManagement() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScheduleSubsection, setActiveScheduleSubsection] =
    useState("availability");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [webinarsRes, availabilityRes] = await Promise.all([
          getWebinars(),
          getAvailability(),
        ]);

        if (webinarsRes.success) setWebinars(webinarsRes.data || []);
        if (availabilityRes.success)
          setAvailability(availabilityRes.data || []);
      } catch (error) {
        console.error("Error loading schedule management data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <GeneralLoadingComponent text="Loading Schedule Management" />;
  }

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
              Schedule Management Center
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Set your availability and schedule live sessions for your students
              with precision and ease.
            </p>
          </header>

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
                <div className="group relative">
                  <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                    <div className="absolute top-4 left-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          Availability Management
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <AvailabilityManager
                        availability={availability}
                        setAvailability={setAvailability}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeScheduleSubsection === "webinars" && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="relative bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                    <div className="absolute top-4 left-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          Webinar Management
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <WebinarManager
                        webinars={webinars}
                        setWebinars={setWebinars}
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
