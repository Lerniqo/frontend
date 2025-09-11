"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Maximize2,
  Move,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { ViewerContext } from '@/types/mediaViewer.types';

interface ImageViewerProps {
  url: string;
  title: string;
  onContextChange?: (context: ViewerContext) => void;
  resourceId: string;
}

export default function ImageViewer({ url, title, onContextChange, resourceId }: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);

  // Use ref to store the latest onContextChange function to avoid dependency issues
  const onContextChangeRef = useRef(onContextChange);
  onContextChangeRef.current = onContextChange;

  // Memoize the context update function to prevent infinite re-renders
  const updateContext = useCallback(() => {
    if (onContextChangeRef.current) {
      onContextChangeRef.current({
        resourceId,
        zoomLevel,
      });
    }
  }, [resourceId, zoomLevel]);

  useEffect(() => {
    updateContext();
  }, [updateContext]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 500));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(100);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageInfo({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setIsLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-green-50">
      {/* Image Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-200">
            <ImageIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-700 max-w-xs truncate">
              {title}
            </span>
          </div>
          
          {imageInfo && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {imageInfo.width} × {imageInfo.height}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 25}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 500}
              className="h-8 w-8 p-0 hover:bg-green-100"
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
            onClick={handleReset}
            className="h-8 px-3 hover:bg-blue-100 text-sm"
          >
            Reset
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="h-8 w-8 p-0 hover:bg-indigo-100"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 w-8 p-0 hover:bg-teal-100"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Content */}
      <div 
        className="flex-1 overflow-hidden relative bg-gradient-to-br from-slate-100 to-slate-50"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-20 animate-ping"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-slate-600">Loading Image...</p>
              </div>
            </div>
          )}
          
          <div
            className={`transition-transform duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={url}
              alt={title}
              className="max-w-none rounded-lg shadow-2xl border border-white"
              onLoad={handleImageLoad}
              onError={() => setIsLoading(false)}
              draggable={false}
              style={{
                maxHeight: zoomLevel > 100 ? 'none' : '80vh',
                maxWidth: zoomLevel > 100 ? 'none' : '80vw'
              }}
            />
          </div>
        </div>

        {/* Zoom/Position Info */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center gap-4">
            <span>Zoom: {zoomLevel}%</span>
            <span>Rotation: {rotation}°</span>
            {zoomLevel > 100 && (
              <span className="flex items-center gap-1">
                <Move className="w-3 h-3" />
                Drag to pan
              </span>
            )}
          </div>
        </div>

        {/* Grid pattern when zoomed */}
        {zoomLevel > 200 && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </div>
    </div>
  );
}
