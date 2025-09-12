import React, { useState } from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onClick?: () => void;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onClick,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ease-in-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Logout"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110" />

      {/* Main circular container with transparent blurred background */}
      <div
        className={`
          w-12 h-12 rounded-full 
          bg-white/20 backdrop-blur-md
          border border-teal-400/30
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${
            isHovered
              ? "scale-105 shadow-xl shadow-teal-500/40 bg-white/30 border-teal-400/50"
              : "scale-100"
          }
          active:scale-95
        `}
      >
        {/* Logout Icon */}
        <LogOut
          className={`
              w-7 h-7 
              transition-all duration-300 ease-in-out
              text-teal-700
              ${isHovered ? "translate-x-0.5" : "translate-x-0"}
            `}
          style={{
            filter: "drop-shadow(0 0 8px rgba(20, 184, 166, 0.3))",
          }}
        />
      </div>
    </button>
  );
};

export default LogoutButton;
