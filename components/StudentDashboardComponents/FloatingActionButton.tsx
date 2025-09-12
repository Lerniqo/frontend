"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Plus, Sparkles } from "lucide-react";

interface FloatingActionButtonProps {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  variant = "primary",
  size = "md",
  disabled = false
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const gradients = {
    primary: "from-blue-500 to-purple-600",
    secondary: "from-purple-500 to-blue-600",
    accent: "from-blue-600 to-indigo-600"
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <motion.button
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-r ${gradients[variant]}
          rounded-full shadow-2xl border border-white/20
          flex items-center justify-center
          backdrop-blur-sm
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/25 hover:scale-110 active:scale-95'}
        `}
        onClick={!disabled ? onClick : undefined}
        whileHover={!disabled ? { 
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.3 }
        } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        disabled={disabled}
      >
        {/* Icon */}
        <motion.div
          animate={!disabled ? {
            rotate: [0, 360],
            transition: { duration: 8, repeat: Infinity, ease: "linear" }
          } : undefined}
        >
          <Zap className={`${iconSizes[size]} text-white drop-shadow-lg`} />
        </motion.div>

        {/* Background Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-xl animate-pulse" />
      </motion.button>

      {/* Premium Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${20 + (i * 60 / 6)}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Pulse Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default FloatingActionButton;
