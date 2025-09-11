"use client";

import React, { useState, useCallback } from 'react';
import { MediaViewer } from '@/components/MediaViewer';
import { MediaResource } from '@/types/mediaViewer.types';
import { Button } from '@/components/ui/button';

// Test component to verify the fix
export default function MediaViewerTest() {
  const [selectedResource, setSelectedResource] = useState<MediaResource | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  // This will help us track re-renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  const testResource: MediaResource = {
    id: 'test-1',
    title: 'Test PDF Document',
    type: 'pdf',
    url: 'https://www.africau.edu/images/default/sample.pdf',
    description: 'A test PDF to verify the infinite re-render fix'
  };

  const openViewer = useCallback(() => {
    setSelectedResource(testResource);
  }, []);

  const closeViewer = useCallback(() => {
    setSelectedResource(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          MediaViewer Re-render Fix Test
        </h1>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 mb-8">
          <p className="text-white mb-4">
            Render Count: <span className="font-bold text-blue-400">{renderCount}</span>
          </p>
          <p className="text-blue-200 text-sm">
            If the render count rapidly increases when the viewer is open, 
            there's still an infinite re-render issue.
          </p>
        </div>

        <Button
          onClick={openViewer}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          Open Test PDF Viewer
        </Button>

        {selectedResource && (
          <MediaViewer
            resource={selectedResource}
            onClose={closeViewer}
            showAIAssistant={true}
          />
        )}
      </div>
    </div>
  );
}
