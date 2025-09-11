import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const ResourceLibraryButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push("/resource-library");
  };

  return (
    <button
      className="relative group transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      aria-label="Resource Library"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110" />

      {/* Gradient border wrapper */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-500 p-0.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
        {/* Inner button */}
        <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white">
          {/* Icon container with subtle gradient background */}
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <BookOpen 
              size={20} 
              className="relative z-10 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" 
            />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div
        className={`
        absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 
        bg-white/90 backdrop-blur-sm rounded-md shadow-lg border border-blue-200
        text-xs font-medium text-slate-700 whitespace-nowrap
        transition-all duration-200
        ${
          isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
      >
        Resource Library
      </div>
    </button>
  );
};

export default ResourceLibraryButton;
