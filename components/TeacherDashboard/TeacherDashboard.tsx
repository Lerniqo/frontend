'use client';

import React, { useState, useEffect } from 'react';
import { getNotifications, getQuestions, getResources, getWebinars, getAvailability, Notification, Question, Resource, Webinar, AvailabilitySlot } from '@/services/teacherDashboardService';
import NavigationMenu from './NavigationMenu';
import MotivatedHeading from './MotivatedHeading';
import AvailabilityManager from './AvailabilityManager';
import NotificationsPanel from './NotificationsPanel';
import QuestionBankManager from './QuestionBankManager';
import ResourceManager from './ResourceManager';
import WebinarManager from './WebinarManager';
import SubMenu from './SubMenu';

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  // New state for popups
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // New state for submenus
  const [activeScheduleSubsection, setActiveScheduleSubsection] = useState('availability');
  const [activeContentSubsection, setActiveContentSubsection] = useState('questions');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [notificationsRes, questionsRes, resourcesRes, webinarsRes, availabilityRes] = await Promise.all([
          getNotifications(),
          getQuestions(),
          getResources(),
          getWebinars(),
          getAvailability(),
        ]);

        if (notificationsRes.success) setNotifications(notificationsRes.data || []);
        if (questionsRes.success) setQuestions(questionsRes.data || []);
        if (resourcesRes.success) setResources(resourcesRes.data || []);
        if (webinarsRes.success) setWebinars(webinarsRes.data || []);
        if (availabilityRes.success) setAvailability(availabilityRes.data || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h3>
              <p className="text-slate-400">Preparing your premium experience...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-20">
            <MotivatedHeading />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <AvailabilityManager availability={availability} setAvailability={setAvailability} />
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />
              </div>
            </div>
          </div>
        );
      case 'schedule':
        const scheduleItems = [
          { id: 'availability', label: 'Availability', icon: '📅', color: 'from-blue-500 to-blue-600' },
          { id: 'webinars', label: 'Webinars', icon: '🎥', color: 'from-purple-500 to-purple-600' }
        ];

        return (
          <section className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">Schedule Management</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Manage Your Schedule</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">Set your availability and schedule live sessions for your students</p>
            </div>

            <SubMenu
              items={scheduleItems}
              activeItem={activeScheduleSubsection}
              onItemChange={setActiveScheduleSubsection}
              title="Schedule Sections"
            />

            <div className="transition-all duration-500 ease-in-out">
              {activeScheduleSubsection === 'availability' && (
                <div className="max-w-5xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                    <AvailabilityManager availability={availability} setAvailability={setAvailability} />
                  </div>
                </div>
              )}

              {activeScheduleSubsection === 'webinars' && (
                <div className="max-w-5xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                    <WebinarManager webinars={webinars} setWebinars={setWebinars} />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case 'content':
        const contentItems = [
          { id: 'questions', label: 'Question Bank', icon: '❓', color: 'from-indigo-500 to-indigo-600' },
          { id: 'resources', label: 'Resources', icon: '📚', color: 'from-purple-500 to-purple-600' }
        ];

        return (
          <section className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-300 text-sm font-medium">Content Management</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Manage Your Content</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">Create questions and share educational resources with your students</p>
            </div>

            <SubMenu
              items={contentItems}
              activeItem={activeContentSubsection}
              onItemChange={setActiveContentSubsection}
              title="Content Sections"
            />

            <div className="transition-all duration-500 ease-in-out">
              {activeContentSubsection === 'questions' && (
                <div className="max-w-5xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                    <QuestionBankManager questions={questions} setQuestions={setQuestions} />
                  </div>
                </div>
              )}

              {activeContentSubsection === 'resources' && (
                <div className="max-w-5xl mx-auto">
                  <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                    <ResourceManager resources={resources} setResources={setResources} />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case 'profile':
        return (
          <section className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium">Profile</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Your Profile</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">View and manage your teacher profile information</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-3xl">T</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Teacher Name</h3>
                  <p className="text-slate-400 mb-8">teacher@example.com</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <p className="text-white">Teacher Name</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <p className="text-white">teacher@example.com</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                        <p className="text-white">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                        <p className="text-white">Mathematics</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Experience</label>
                        <p className="text-white">5+ years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <p className="text-white">New York, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'edit-profile':
        return (
          <section className="py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-pink-300 text-sm font-medium">Edit Profile</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Edit Your Profile</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">Update your information and preferences</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-10 hover:bg-white/15 transition-all duration-500">
                <form className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Change Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="Teacher"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="teacher@example.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                      <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option value="mathematics">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="english">English</option>
                        <option value="history">History</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Experience</label>
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
                      onClick={() => setActiveSection('profile')}
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
      default:
        return (
          <div className="space-y-20">
            <MotivatedHeading />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <AvailabilityManager availability={availability} setAvailability={setAvailability} />
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
                <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

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

      <main className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
