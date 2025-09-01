'use client';

import React, { useState, useEffect } from 'react';
import { getWebinars, getAvailability, Webinar, AvailabilitySlot } from '@/services/teacherDashboardService';
import AvailabilityManager from './AvailabilityManager';
import WebinarManager from './WebinarManager';
import SubMenu from './SubMenu';
import SharedNavigation from './SharedNavigation';

export default function ScheduleManagement() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScheduleSubsection, setActiveScheduleSubsection] = useState('availability');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [webinarsRes, availabilityRes] = await Promise.all([
          getWebinars(),
          getAvailability(),
        ]);

        if (webinarsRes.success) setWebinars(webinarsRes.data || []);
        if (availabilityRes.success) setAvailability(availabilityRes.data || []);
      } catch (error) {
        console.error('Error loading schedule management data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_70%)]"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-white">Loading Schedule Management</h3>
              <p className="text-slate-400 text-lg">Setting up your scheduling tools...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scheduleItems = [
    { id: 'availability', label: 'Availability', icon: '📅', color: 'from-blue-500 to-blue-600' },
    { id: 'webinars', label: 'Webinars', icon: '🎥', color: 'from-purple-600 to-purple-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.4),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_70%)]"></div>

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Navigation */}
      <SharedNavigation
        onLogout={() => {
          // Handle logout logic here
          console.warn('Logout functionality not implemented');
        }}
      />

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-8">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-medium tracking-wide">Schedule Management</span>
            </div>
            <h1 className="text-6xl font-bold mb-8 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Manage Your Schedule
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">Set your availability and schedule live sessions for your students with precision and ease</p>
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
            {activeScheduleSubsection === 'availability' && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <AvailabilityManager availability={availability} setAvailability={setAvailability} />
                  </div>
                </div>
              </div>
            )}

            {activeScheduleSubsection === 'webinars' && (
              <div className="max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-12 hover:bg-white/15 transition-all duration-500">
                    <WebinarManager webinars={webinars} setWebinars={setWebinars} />
                  </div>
                </div>
              </div>
            )}
          </div>
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
