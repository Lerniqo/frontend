"use client";

import { useState, useCallback } from 'react';
import { MediaResource, ViewerContext } from '@/types/mediaViewer.types';

interface UseMediaViewerOptions {
  onResourceChange?: (resource: MediaResource | null) => void;
  onContextChange?: (context: ViewerContext | null) => void;
}

export function useMediaViewer(options: UseMediaViewerOptions = {}) {
  const [currentResource, setCurrentResource] = useState<MediaResource | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<ViewerContext | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const openViewer = useCallback((resource: MediaResource, showAI = true) => {
    setCurrentResource(resource);
    setIsViewerOpen(true);
    setIsAIAssistantOpen(showAI);
    options.onResourceChange?.(resource);
  }, [options]);

  const closeViewer = useCallback(() => {
    setCurrentResource(null);
    setIsViewerOpen(false);
    setCurrentContext(null);
    setIsAIAssistantOpen(false);
    options.onResourceChange?.(null);
    options.onContextChange?.(null);
  }, [options]);

  const updateContext = useCallback((context: ViewerContext) => {
    setCurrentContext(context);
    options.onContextChange?.(context);
  }, [options]);

  const toggleAIAssistant = useCallback(() => {
    setIsAIAssistantOpen(prev => !prev);
  }, []);

  return {
    // State
    currentResource,
    isViewerOpen,
    currentContext,
    isAIAssistantOpen,
    
    // Actions
    openViewer,
    closeViewer,
    updateContext,
    toggleAIAssistant,
  };
}
