"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AnimatedContent from '@/components/ui/AnimatedContent';
import { MediaViewer } from '@/components/MediaViewer';
import { MediaResource } from '@/types/mediaViewer.types';
import { sampleResources } from '@/utils/sampleData';
import { 
  FileText, 
  Play, 
  Image as ImageIcon, 
  File,
  Eye,
  Download,
  Clock,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function MediaViewerDemo() {
  const [selectedResource, setSelectedResource] = useState<MediaResource | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredResources = filterType === 'all' 
    ? sampleResources 
    : sampleResources.filter(resource => resource.type === filterType);

  const getResourceIcon = (type: MediaResource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'video':
        return <Play className="w-6 h-6 text-blue-500" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-green-500" />;
      case 'audio':
        return <Play className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-slate-500" />;
    }
  };

  const getResourceColor = (type: MediaResource['type']) => {
    switch (type) {
      case 'pdf':
        return 'from-red-50 to-pink-50 border-red-200 hover:border-red-300';
      case 'video':
        return 'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300';
      case 'image':
        return 'from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
      case 'audio':
        return 'from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300';
      default:
        return 'from-slate-50 to-gray-50 border-slate-200 hover:border-slate-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <AnimatedContent distance={50} duration={1} delay={0.2}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 mb-6">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="text-blue-300 font-medium tracking-wide">Media Viewer Demo</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Media Viewer
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Experience our premium media viewer with AI-powered assistance. 
              View PDFs, videos, images, and more with context-aware AI support.
            </p>
          </div>
        </AnimatedContent>

        {/* Filter Buttons */}
        <AnimatedContent distance={30} duration={0.8} delay={0.4}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { type: 'all', label: 'All Resources', icon: BookOpen },
              { type: 'pdf', label: 'PDFs', icon: FileText },
              { type: 'video', label: 'Videos', icon: Play },
              { type: 'image', label: 'Images', icon: ImageIcon }
            ].map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={`${
                  filterType === type
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0'
                    : 'border-white/20 text-blue-200 hover:bg-white/10 backdrop-blur-sm'
                } transition-all duration-200`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </AnimatedContent>

        {/* Resource Grid */}
        <AnimatedContent distance={40} duration={0.8} delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredResources.map((resource, index) => (
              <AnimatedContent 
                key={resource.id} 
                distance={20} 
                duration={0.6} 
                delay={0.8 + (index * 0.1)}
              >
                <Card
                  className={`bg-gradient-to-br ${getResourceColor(resource.type)} backdrop-blur-xl border-2 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="p-6">
                    {/* Resource Type Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                          {resource.type}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-white/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      {resource.metadata?.subject && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            {resource.metadata.subject} - {resource.metadata.grade}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {resource.size && (
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{formatFileSize(resource.size)}</span>
                          </div>
                        )}
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(resource.duration)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Difficulty Badge */}
                    {resource.metadata?.difficulty && (
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          resource.metadata.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-700'
                            : resource.metadata.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {resource.metadata.difficulty}
                        </span>
                        
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </AnimatedContent>
            ))}
          </div>
        </AnimatedContent>

        {/* Info Section */}
        <AnimatedContent distance={30} duration={0.8} delay={1.2}>
          <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Features of the Media Viewer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-200">
                <div>
                  <h3 className="font-semibold text-white mb-2">🤖 AI Assistant</h3>
                  <p>Get context-aware help and explanations while viewing content</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">🔍 Advanced Controls</h3>
                  <p>Zoom, rotate, navigate, and interact with your media files</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">📱 Responsive Design</h3>
                  <p>Beautiful, premium UI that works on all devices</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>

      {/* Media Viewer Modal */}
      {selectedResource && (
        <MediaViewer
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          showAIAssistant={true}
        />
      )}
    </div>
  );
}
