"use client";

import React, { useState, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";

const RadioCard = ({ onClose, canvasSize }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate responsive sizing based on canvas size
  const responsiveStyles = useMemo(() => {
    if (!canvasSize) return {};

    const { width, height } = canvasSize;
    const baseWidth = 1920; // Base design width
    const baseHeight = 1080; // Base design height

    // Calculate scale factors
    const widthScale = width / baseWidth;
    const heightScale = height / baseHeight;
    const scale = Math.min(widthScale, heightScale, 1.2); // Cap maximum scale

    // Ensure minimum scale for readability
    const finalScale = Math.max(scale, 0.6);

    // Calculate responsive width based on canvas size
    let cardWidth = "28rem"; // default (w-110 equivalent)
    if (width < 768) {
      cardWidth = "20rem"; // mobile
    } else if (width < 1024) {
      cardWidth = "24rem"; // tablet
    } else if (width >= 1920) {
      cardWidth = "32rem"; // large screens
    }

    return {
      transform: `scale(${finalScale})`,
      transformOrigin: "center center",
      width: cardWidth,
      maxWidth: "90vw", // Ensure it doesn't exceed viewport
    };
  }, [canvasSize]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    // Handle previous track logic here
    console.log("Previous track");
  };

  const handleNext = () => {
    // Handle next track logic here
    console.log("Next track");
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 mx-auto border border-gray-100 relative"
      style={responsiveStyles}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-500 hover:text-gray-700"
        aria-label="Close radio player"
      >
        <X size={16} />
      </button>

      {/* Header and Visual Indicator - Horizontal Layout */}
      <div className="flex items-center gap-4 mb-4">
        {/* Visual Indicator */}
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-white animate-pulse" : "bg-white"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Now Playing
          </h3>
          <h2 className="text-lg font-bold text-gray-800">Study Beats Radio</h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          >
            <SkipBack size={18} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-500">
          {isPlaying ? "♪ Playing..." : "Paused"}
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-1">
          <div
            className={`bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full transition-all duration-300 ${
              isPlaying ? "w-1/3" : "w-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RadioCard;
