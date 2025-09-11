"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Bot, 
  Maximize2, 
  Minimize2,
  FileText,
  Play,
  Image as ImageIcon,
  File,
  Download
} from 'lucide-react';
import { MediaViewerProps, ViewerContext } from '@/types/mediaViewer.types';
import PDFViewer from './PDFViewer';
import VideoViewer from './VideoViewer';
import ImageViewer from './ImageViewer';
import AIAssistant from './AIAssistant';

export default function MediaViewer({ 
  resource, 
  onClose, 
  showAIAssistant = true, 
  initialContext 
}: MediaViewerProps) {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<ViewerContext | undefined>(initialContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Update document title
    document.title = `${resource.title} - Media Viewer`;
    
    return () => {
      document.title = 'Learniqo';
    };
  }, [resource.title]);

  const handleContextChange = useCallback((context: ViewerContext) => {
    setCurrentContext(context);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const getResourceIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'video':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-green-600" />;
      case 'audio':
        return <Play className="w-5 h-5 text-purple-600" />;
      default:
        return <File className="w-5 h-5 text-slate-600" />;
    }
  };

  const getResourceTypeColor = () => {
    switch (resource.type) {
      case 'pdf':
        return 'from-red-500/10 to-pink-500/10 border-red-200';
      case 'video':
        return 'from-blue-500/10 to-indigo-500/10 border-blue-200';
      case 'image':
        return 'from-green-500/10 to-emerald-500/10 border-green-200';
      case 'audio':
        return 'from-purple-500/10 to-violet-500/10 border-purple-200';
      default:
        return 'from-slate-500/10 to-gray-500/10 border-slate-200';
    }
  };

  const renderViewer = () => {
    const commonProps = {
      url: resource.url,
      title: resource.title,
      onContextChange: handleContextChange,
      resourceId: resource.id
    };

    switch (resource.type) {
      case 'pdf':
        return <PDFViewer {...commonProps} />;
      case 'video':
        return <VideoViewer {...commonProps} />;
      case 'image':
        return <ImageViewer {...commonProps} />;
      case 'audio':
        return <VideoViewer {...commonProps} />; // Can handle audio too
      default:
        return (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                <File className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Unsupported File Type
              </h3>
              <p className="text-slate-600 mb-6">
                This file type is not yet supported in the viewer.
              </p>
              <Button
                onClick={() => window.open(resource.url, '_blank')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm">
      <div className="h-full flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${getResourceTypeColor()} rounded-lg border`}>
              {getResourceIcon()}
              <div>
                <h1 className="font-semibold text-slate-800 text-lg">
                  {resource.title}
                </h1>
                {resource.description && (
                  <p className="text-sm text-slate-600 max-w-md truncate">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>

            {/* Resource Info */}
            <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
              {resource.size && (
                <span>Size: {(resource.size / 1024 / 1024).toFixed(1)} MB</span>
              )}
              {resource.duration && (
                <span>Duration: {Math.floor(resource.duration / 60)}:{(resource.duration % 60).toFixed(0).padStart(2, '0')}</span>
              )}
              <span className="capitalize">{resource.type} file</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Assistant Toggle */}
            {showAIAssistant && (
              <Button
                variant={isAIOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAIOpen(!isAIOpen)}
                className={`${
                  isAIOpen 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
                {isAIOpen && (
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Button>
            )}

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>

            {/* Close Button */}
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          {renderViewer()}
        </div>

        {/* AI Assistant */}
        {showAIAssistant && (
          <AIAssistant
            isOpen={isAIOpen}
            onToggle={() => setIsAIOpen(!isAIOpen)}
            currentContext={currentContext}
            resourceInfo={resource}
          />
        )}
      </div>
    </div>
  );
}
