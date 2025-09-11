"use client";

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface GamingNavItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
  count?: number;
  progress?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export default function GamingNavItem({
  icon: Icon,
  label,
  description,
  gradient,
  count,
  progress,
  onClick,
  isActive = false
}: GamingNavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer mb-2 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-300 
        ${isActive 
          ? 'bg-slate-700/80 border-blue-500/60 shadow-lg shadow-blue-500/20' 
          : 'bg-slate-800/60 border-slate-700/40 hover:border-blue-500/40'
        }
        hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10
      `}>
        
        {/* Background Gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-r ${gradient} transition-opacity duration-300
          ${isHovered || isActive ? 'opacity-10' : 'opacity-0'}
        `}></div>
        
        {/* Animated Border Effect */}
        {(isHovered || isActive) && (
          <div className="absolute inset-0 rounded-xl">
            <div className={`
              absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-20 
              animate-pulse
            `}></div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} p-2 shadow-lg 
            transition-all duration-300
            ${isHovered ? 'shadow-xl scale-110' : ''}
          `}>
            <Icon className="w-full h-full text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`
                font-semibold transition-colors duration-300
                ${isActive 
                  ? 'text-blue-400' 
                  : isHovered 
                    ? 'text-blue-400' 
                    : 'text-white'
                }
              `}>
                {label}
              </h3>
              
              {count !== undefined && (
                <span className={`
                  text-xs px-2 py-1 rounded-full border transition-all duration-300
                  ${isActive || isHovered
                    ? 'bg-blue-500/30 text-blue-300 border-blue-400/40'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }
                `}>
                  {count}
                </span>
              )}
              
              {progress !== undefined && (
                <span className={`
                  text-xs px-2 py-1 rounded-full border transition-all duration-300
                  ${isActive || isHovered
                    ? 'bg-purple-500/30 text-purple-300 border-purple-400/40'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  }
                `}>
                  {progress}%
                </span>
              )}
            </div>
            
            <p className={`
              text-xs mt-0.5 transition-colors duration-300
              ${isHovered ? 'text-slate-300' : 'text-slate-400'}
            `}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Progress bar for Learning Path */}
        {progress !== undefined && (
          <div className="mt-3 relative">
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className={`
                  h-2 rounded-full transition-all duration-500 shadow-sm
                  ${isActive || isHovered 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-blue-400/40' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/30'
                  }
                `}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Glow effect on hover */}
        {isHovered && (
          <div className={`
            absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-xl opacity-20 
            blur-sm -z-10 animate-pulse
          `}></div>
        )}
      </div>
    </div>
  );
}
