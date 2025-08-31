'use client';

import React, { useState } from 'react';
import { Webinar, scheduleWebinar } from '@/services/teacherDashboardService';

interface WebinarManagerProps {
  webinars: Webinar[];
  setWebinars: (webinars: Webinar[]) => void;
}

export default function WebinarManager({ webinars, setWebinars }: WebinarManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    duration: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await scheduleWebinar(formData);
      if (result.success && result.data) {
        setWebinars([...webinars, result.data]);
        setFormData({ title: '', description: '', scheduledDate: '', duration: 60 });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error scheduling webinar:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      case 'ongoing': return 'bg-green-500/20 text-green-300 border border-green-400/30';
      case 'completed': return 'bg-slate-500/20 text-slate-300 border border-slate-400/30';
      default: return 'bg-slate-500/20 text-slate-300 border border-slate-400/30';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl border border-blue-400/30">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Webinar Management</h3>
            <p className="text-slate-400 mt-1">Connect with students through live interactive sessions</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {showCreateForm ? 'Cancel' : 'Schedule Webinar'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10">
          <h4 className="text-xl font-semibold text-white mb-6">Schedule New Webinar</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Webinar Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400 backdrop-blur-sm"
                  placeholder="Enter an engaging webinar title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400 backdrop-blur-sm"
                  min="30"
                  max="240"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400 backdrop-blur-sm resize-none"
                rows={4}
                placeholder="Describe what students will learn and the key topics you'll cover"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white backdrop-blur-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 shadow-lg hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:scale-105"
              >
                Schedule Webinar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {webinars.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-300 text-lg">No webinars scheduled yet</p>
            <p className="text-slate-400 text-sm mt-2">Create your first webinar to begin engaging with your audience</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {webinars.map((webinar) => (
              <div key={webinar.id} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-3">{webinar.title}</h4>
                    <p className="text-slate-300 mb-4 leading-relaxed">{webinar.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                          <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Date & Time</p>
                          <p className="text-slate-300 font-medium text-sm">{formatDateTime(webinar.scheduledDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <div className="p-2 bg-green-500/20 rounded-lg border border-green-400/30">
                          <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Attendees</p>
                          <p className="text-slate-300 font-medium text-sm">{webinar.attendees} registered</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                          <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Duration</p>
                          <p className="text-slate-300 font-medium text-sm">{webinar.duration} minutes</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(webinar.status)}`}>
                        {webinar.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:scale-105 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Webinar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
