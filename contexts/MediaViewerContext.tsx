"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { MediaViewer } from '@/components/MediaViewer';
import { useMediaViewer } from '@/hooks/useMediaViewer';
import { MediaResource, ViewerContext } from '@/types/mediaViewer.types';

interface MediaViewerContextType {
  currentResource: MediaResource | null;
  isViewerOpen: boolean;
  currentContext: ViewerContext | null;
  isAIAssistantOpen: boolean;
  openViewer: (resource: MediaResource, showAI?: boolean) => void;
  closeViewer: () => void;
  updateContext: (context: ViewerContext) => void;
  toggleAIAssistant: () => void;
}

const MediaViewerContext = createContext<MediaViewerContextType | null>(null);

interface MediaViewerProviderProps {
  children: ReactNode;
}

export function MediaViewerProvider({ children }: MediaViewerProviderProps) {
  const mediaViewer = useMediaViewer();

  return (
    <MediaViewerContext.Provider value={mediaViewer}>
      {children}
      
      {/* Render the MediaViewer when open */}
      {mediaViewer.isViewerOpen && mediaViewer.currentResource && (
        <MediaViewer
          resource={mediaViewer.currentResource}
          onClose={mediaViewer.closeViewer}
          showAIAssistant={mediaViewer.isAIAssistantOpen}
        />
      )}
    </MediaViewerContext.Provider>
  );
}

export function useMediaViewerContext(): MediaViewerContextType {
  const context = useContext(MediaViewerContext);
  if (!context) {
    throw new Error('useMediaViewerContext must be used within a MediaViewerProvider');
  }
  return context;
}

// Convenience hook for quickly opening resources
export function useOpenResource() {
  const { openViewer } = useMediaViewerContext();
  
  return {
    openPDF: (resource: MediaResource) => openViewer({ ...resource, type: 'pdf' }),
    openVideo: (resource: MediaResource) => openViewer({ ...resource, type: 'video' }),
    openImage: (resource: MediaResource) => openViewer({ ...resource, type: 'image' }),
    openResource: openViewer,
  };
}
