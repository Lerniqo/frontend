"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Maximize2
} from 'lucide-react';
import { ViewerContext } from '@/types/mediaViewer.types';

interface PDFViewerProps {
  url: string;
  title: string;
  onContextChange?: (context: ViewerContext) => void;
  resourceId: string;
}

export default function PDFViewer({ url, title, onContextChange, resourceId }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  // Use ref to store the latest onContextChange function to avoid dependency issues
  const onContextChangeRef = useRef(onContextChange);
  onContextChangeRef.current = onContextChange;

  // Memoize the context update function to prevent infinite re-renders
  const updateContext = useCallback(() => {
    if (onContextChangeRef.current) {
      onContextChangeRef.current({
        resourceId,
        currentPage,
        zoomLevel,
        selectedText: selectedText || undefined
      });
    }
  }, [resourceId, currentPage, zoomLevel, selectedText]);

  useEffect(() => {
    updateContext();
  }, [updateContext]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-200">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 max-w-xs truncate">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1 px-3 py-2 bg-slate-100 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[50px] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Other Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="h-8 w-8 p-0 hover:bg-purple-100"
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="h-8 w-8 p-0 hover:bg-green-100"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = title;
              link.click();
            }}
            className="h-8 w-8 p-0 hover:bg-indigo-100"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease'
            }}
            onMouseUp={handleTextSelection}
          >
            {/* PDF Content Area */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-ping"></div>
                      <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">Loading PDF...</p>
                  </div>
                </div>
              )}
              
              {/* Embed PDF */}
              <iframe
                src={`${url}#page=${currentPage}&zoom=${zoomLevel}`}
                className="w-full h-[800px] border-0"
                title={title}
                onLoad={() => setIsLoading(false)}
                style={{ minWidth: '800px' }}
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Selection Info */}
      {selectedText && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-slate-600">
              Selected: <span className="font-medium text-slate-800">&quot;{selectedText}&quot;</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
