"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  FaDownload,
  FaExpand,
  FaCompress,
  FaSearchPlus,
  FaSearchMinus,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

interface NoteResourceProps {
  url: string;
}

// PDF viewer with selectable text layer and AI Tutor popup trigger.
export default function NoteResource({ url }: NoteResourceProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Animate container entrance
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    // Animate the transition
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: isFullscreen ? 1 : 1.02,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25);
    }
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderControls = () => (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-700">
          <FaFileAlt className="text-green-600" />
          <span className="font-medium">PDF Document</span>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
          Zoom: {zoomLevel}%
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Zoom Out"
          >
            <FaSearchMinus size={14} />
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200"
            title="Reset Zoom"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Zoom In"
          >
            <FaSearchPlus size={14} />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg border border-gray-200 transition-all duration-200"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          title="Download PDF"
        >
          <FaDownload size={14} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="text-red-500 mb-4">
        <FaExclamationTriangle size={48} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Error Loading PDF
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        We couldn't load the PDF document. This might be due to a network issue
        or the file format.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Open Directly
        </a>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="text-green-600 mb-4 animate-spin">
        <FaSpinner size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Loading PDF Document...
      </h3>
      <p className="text-gray-600 text-center">
        Please wait while we prepare your document for viewing.
      </p>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`
        bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        ${isFullscreen ? "fixed inset-4 z-50 rounded-xl" : ""}
      `}
    >
      {renderControls()}

      <div className="relative">
        {isLoading && renderLoading()}
        {hasError && renderError()}

        {!hasError && (
          <div
            className="relative"
            style={{ height: isFullscreen ? "calc(100vh - 200px)" : "600px" }}
          >
            <iframe
              ref={iframeRef}
              src={`${url}#zoom=${zoomLevel}&toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className={`
                w-full h-full border-0 transition-opacity duration-300
                ${isLoading ? "opacity-0" : "opacity-100"}
              `}
              title="PDF Document Viewer"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="lazy"
            />

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin text-green-600">
                    <FaSpinner size={24} />
                  </div>
                  <span className="text-gray-600">Loading PDF...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with additional info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>📄 PDF Document</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Interactive viewing enabled
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Study Material
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
}
