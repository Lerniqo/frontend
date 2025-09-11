import React, { useState } from "react";
import { X } from "lucide-react";

interface HideButtonProps {
  onClick?: () => void;
  className?: string;
}

const HideButton: React.FC<HideButtonProps> = ({ onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ease-in-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Hide"
    >
      {/* Outer glow ring with red colors */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 via-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110" />

      {/* Main circular container with transparent blurred background */}
      <div
        className={`
          w-12 h-12 rounded-full 
          bg-white/20 backdrop-blur-md
          border border-red-400/30
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${
            isHovered
              ? "scale-105 shadow-xl shadow-red-500/40 bg-white/30 border-red-400/50"
              : "scale-100"
          }
          active:scale-95
        `}
      >
        {/* X Icon with red colors */}
        <X
          className={`
              w-7 h-7 
              transition-all duration-300 ease-in-out
              text-red-700
              ${isHovered ? "rotate-90" : "rotate-0"}
            `}
          style={{
            filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))",
          }}
        />
      </div>
    </button>
  );
};

export default HideButton;
