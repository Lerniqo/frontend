'use client';

import React, { useState } from 'react';
import { Resource, uploadResource } from '@/services/teacherDashboardService';

interface ResourceManagerProps {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
}

export default function ResourceManager({ resources, setResources }: ResourceManagerProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video' as 'video' | 'note' | 'audio' | 'document',
    url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await uploadResource(formData);
      if (result.success && result.data) {
        setResources([...resources, result.data]);
        setFormData({ title: '', type: 'video', url: '' });
        setShowUploadForm(false);
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'note': return '📝';
      case 'audio': return '🎵';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/30';
      case 'note': return 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/30';
      case 'audio': return 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30';
      case 'document': return 'from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30';
      default: return 'from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-indigo-400/30 shadow-lg">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Resource Library</h3>
            <p className="text-slate-400 text-lg">Share premium educational materials with your students</p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
        >
          {showUploadForm ? (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Resource</span>
            </div>
          )}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/10 transition-all duration-500">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">Upload New Resource</h4>
              <p className="text-slate-400">Share educational materials with your students</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">Resource Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
                  placeholder="Enter resource title"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">Resource Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'note' | 'audio' | 'document' })}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
                >
                  <option value="video" className="bg-slate-800">🎥 Video</option>
                  <option value="note" className="bg-slate-800">📝 Note</option>
                  <option value="audio" className="bg-slate-800">🎵 Audio</option>
                  <option value="document" className="bg-slate-800">📄 Document</option>
                </select>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">Resource URL</label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg pr-12"
                  placeholder="https://example.com/resource"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-8 py-4 bg-slate-600/50 text-white rounded-2xl hover:bg-slate-600 transition-all duration-300 shadow-lg hover:scale-105 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                Upload Resource
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      <div className="space-y-6">
        {resources.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Resources Yet</h3>
            <p className="text-slate-400 text-lg mb-6">Start sharing educational materials with your students</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              Upload Your First Resource
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white">Your Resources ({resources.length})</h4>
              <div className="text-sm text-slate-400">
                Total Downloads: {resources.reduce((sum, resource) => sum + resource.downloads, 0)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {resources.map((resource, index) => (
                <div key={resource.id} className="group backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="p-8">
                    {/* Resource Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-300 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{getTypeIcon(resource.type)}</div>
                          <div>
                            <h4 className="font-bold text-white text-xl mb-1">{resource.title}</h4>
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getTypeColor(resource.type)}`}>
                              {resource.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-slate-300 font-semibold">{resource.downloads}</span>
                        </div>
                        <div className="text-xs text-slate-500">downloads</div>
                      </div>
                    </div>

                    {/* Resource Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{formatDate(resource.uploadedAt)}</span>
                        </div>
                        <div className="text-xs text-slate-500">Resource ID: #{resource.id.slice(-6)}</div>
                      </div>

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Resource
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
