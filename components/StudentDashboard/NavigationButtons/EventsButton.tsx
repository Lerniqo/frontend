import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";

const EventsButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="relative group transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Events"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110" />

      {/* Gradient border wrapper */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400/40 via-teal-500/40 to-blue-600/40 p-0.5 shadow-lg shadow-teal-500/25">
        {/* Main circular container with white background */}
        <div
          className={`
            w-full h-full rounded-full 
            bg-white/80 backdrop-blur-sm
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            ${
              isHovered
                ? "scale-105 shadow-xl shadow-teal-500/40 bg-gradient-to-br from-emerald-50 to-blue-50"
                : "scale-100"
            }
            active:scale-95
          `}
        >
          {/* Icon with gradient colors */}
          <div className="relative">
            <Calendar
              className={`
                w-6 h-6 transition-all duration-300
                ${isHovered ? "text-teal-600" : "text-slate-600"}
              `}
            />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div
        className={`
        absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 
        bg-white/90 backdrop-blur-sm rounded-md shadow-lg border border-teal-200
        text-xs font-medium text-slate-700 whitespace-nowrap
        transition-all duration-200
        ${
          isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
      >
        Events
      </div>
    </button>
  );
};

export default EventsButton;
