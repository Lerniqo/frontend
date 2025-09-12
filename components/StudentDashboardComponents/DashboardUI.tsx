"use client";

import { useState } from "react";
import { 
  Search, 
  Trophy, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Zap, 
  Settings,
  Home,
  TrendingUp,
  Bot,
  MessageCircle,
  Gamepad2,
  Star,
  Award,
  Target,
  LucideIcon,
  Library,
  Calendar,
  HelpCircle,
  Crown
} from "lucide-react";
import { CAMERA_PATH } from "@/constants/cameraPath";
import type { DashboardUIProps } from "@/types/dashboard.types";
import DualMatchButton from "./DualMatchButton";
import LearningPath from "./LearningPath";
import PremiumNavigation from "./PremiumNavigation";
import FloatingActionButton from "./FloatingActionButton";

export default function DashboardUI({ currentPathProgress }: DashboardUIProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const progressPercentage = (currentPathProgress / (CAMERA_PATH.length - 1) * 100).toFixed(1);

  const navigationItems = [
    { 
      icon: Zap, 
      label: "Dual Match", 
      description: "Challenge friends",
      gradient: "from-yellow-500 to-orange-500",
      count: 3
    },
    { 
      icon: Trophy, 
      label: "Contests", 
      description: "Join competitions",
      gradient: "from-yellow-500 to-yellow-600",
      count: 12
    },
    { 
      icon: BookOpen, 
      label: "Learning Path", 
      description: "Your journey",
      gradient: "from-green-500 to-emerald-500",
      progress: Math.round(parseFloat(progressPercentage))
    },
    { 
      icon: GraduationCap, 
      label: "Resource Library", 
      description: "Study materials",
      gradient: "from-blue-500 to-cyan-500",
      count: 156
    },
    { 
      icon: Users, 
      label: "Teachers", 
      description: "Expert guidance",
      gradient: "from-purple-500 to-pink-500",
      count: 8
    }
  ];

  return (
    <>
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
      </div>

      {/* Premium Top Gaming Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="m-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-blue-500/5 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_70%)] rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(147,51,234,0.1),transparent_70%)] rounded-2xl" />
          
          <div className="relative p-4">
            <div className="flex justify-between items-center">
              {/* Left side - Premium Logo/Brand */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg shadow-blue-500/25">
                    <Gamepad2 className="text-white w-7 h-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Lerniqo
                  </h1>
                  <p className="text-white/70 text-sm font-medium">Premium Gaming Mode</p>
                </div>
              </div>

              {/* Center - Enhanced Navigation Menu */}
              <div className="flex items-center space-x-3">
                {navigationItems.map((item, index) => (
                  <NavButton 
                    key={index}
                    icon={item.icon} 
                    label={item.label} 
                    color={item.gradient} 
                  />
                ))}
              </div>

              {/* Right side - Premium User Profile & Search */}
              <div className="flex items-center space-x-4">
                <PremiumSearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isSearchFocused={isSearchFocused}
                  setIsSearchFocused={setIsSearchFocused}
                />
                <PremiumUserAvatar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Left Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40">
        <PremiumNavigation 
          activeNav={activeNav}
          onNavChange={setActiveNav}
        />
      </div>

      {/* Right side Learning Path */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40">
        <LearningPath />
      </div>

      {/* Premium Achievement Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-blue-500/5 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] rounded-2xl" />
          
          <div className="relative p-6">
            <div className="flex items-center space-x-8">
              <PremiumAchievementItem 
                icon={Trophy} 
                label="Achievements" 
                value="12/50" 
                color="from-yellow-400 to-orange-500"
                progress={24}
              />
              <PremiumAchievementItem 
                icon={Target} 
                label="Completed" 
                value="85%" 
                color="from-green-400 to-emerald-500"
                progress={85}
              />
              <PremiumAchievementItem 
                icon={Zap} 
                label="Speed Bonus" 
                value="x2.5" 
                color="from-blue-400 to-cyan-500"
                isMultiplier={true}
              />
              <PremiumAchievementItem 
                icon={Star} 
                label="Perfect Scores" 
                value="23" 
                color="from-purple-400 to-pink-500"
                count={23}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Floating Action Button */}
      <div className="absolute bottom-6 left-6 z-30">
        <FloatingActionButton 
          onClick={() => {
            console.log("Premium action activated!");
          }}
          variant="primary"
          size="lg"
        />
      </div>
    </>
  );
}

// Navigation Button Component
const NavButton = ({ 
  icon: Icon, 
  label, 
  color = "from-blue-500 to-purple-600" 
}: { 
  icon: LucideIcon; 
  label: string; 
  color?: string; 
}) => (
  <div className="group cursor-pointer">
    <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all duration-300 backdrop-blur-sm">
      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
        {label}
      </span>
    </button>
  </div>
);

// Side Navigation Button Component
const SideNavButton = ({ 
  icon: Icon, 
  label, 
  active = false,
  onClick 
}: { 
  icon: LucideIcon; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' 
        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white hover:text-purple-400'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Simple Navigation Button Component - Matching LearningPath Style
const SimpleNavButton = ({ 
  icon: Icon, 
  label, 
  active = false,
  onClick,
  gradient = "from-blue-500 to-purple-600"
}: { 
  icon: LucideIcon; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
  gradient?: string;
}) => (
  <div 
    onClick={onClick}
    className="group relative flex items-start space-x-2.5 p-2 rounded-lg border border-transparent cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/10"
  >
    {/* Premium Hover Background Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    
    {/* Step Icon */}
    <div className="flex-shrink-0 relative z-10">
      <div className={`p-1.5 rounded-full border transition-all duration-300 group-hover:shadow-md ${
        active 
          ? "border-blue-400/50 bg-blue-500/20 text-blue-400 group-hover:border-blue-400/70 group-hover:bg-blue-500/30" 
          : "border-purple-400/50 bg-purple-500/20 text-purple-400 group-hover:border-purple-400/70 group-hover:bg-purple-500/30"
      }`}>
        <Icon className="w-4 h-4 stroke-[2.5] group-hover:stroke-[3]" />
      </div>
      
      {active && (
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
      )}
    </div>

    {/* Step Content */}
    <div className="flex-1 min-w-0 relative z-10">
      <div className="flex items-start justify-between">
        <div>
          <h4 className={`text-sm font-medium transition-colors duration-300 ${
            active ? 'text-white group-hover:text-blue-100' : 'text-white/90 group-hover:text-white'
          }`}>
            {label}
          </h4>
          <p className="text-xs text-white/60 mt-0.5 group-hover:text-white/70 transition-colors duration-300">
            {active ? 'Active' : 'Available'}
          </p>
        </div>
        
        {active && (
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-300" />
          </div>
        )}
      </div>
    </div>

    {/* Premium Hover Border Glow */}
    <div className={`absolute inset-0 rounded-lg border border-transparent group-hover:border-blue-400/20 transition-all duration-300 ${
      active ? 'border-blue-400/30' : ''
    }`} />
  </div>
);

// Search Bar Component
const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  isSearchFocused, 
  setIsSearchFocused 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => setIsSearchFocused(false)}
      placeholder="Quick search resources..."
      className="w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 focus:bg-white/15 backdrop-blur-sm transition-all duration-300"
    />
    {searchQuery && (
      <div className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
        <div className="p-3 text-sm text-white/80 border-b border-white/10">
          Quick results for "{searchQuery}"
        </div>
        <div className="max-h-48 overflow-y-auto">
          <div className="p-3 hover:bg-white/10 cursor-pointer transition-colors">
            <div className="text-white font-medium">Mathematics - Calculus</div>
            <div className="text-xs text-white/60">Chapter 3: Derivatives</div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// User Avatar Component
const UserAvatar = () => (
  <div className="group relative">
    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 cursor-pointer">
      <span className="text-white font-bold text-lg">JD</span>
    </div>
    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
  </div>
);

// Achievement Item Component
const AchievementItem = ({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: LucideIcon; 
  label: string; 
  value: string; 
  color: string; 
}) => (
  <div className="flex items-center space-x-2 text-center">
    <Icon className={`w-5 h-5 ${color}`} />
    <div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-white/60 text-xs uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

// Premium Search Bar Component
const PremiumSearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  isSearchFocused, 
  setIsSearchFocused 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
}) => (
  <div className="relative group">
    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm transition-all duration-300 ${
      isSearchFocused ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-50'
    }`} />
    <div className="relative">
      <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
        isSearchFocused ? 'text-blue-400' : 'text-white/60 group-hover:text-white/80'
      }`} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        placeholder="Search premium resources..."
        className={`w-80 pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 
          focus:outline-none focus:border-blue-500/50 focus:bg-white/15 backdrop-blur-sm 
          transition-all duration-300 hover:bg-white/15 hover:border-white/30
          ${isSearchFocused ? 'shadow-lg shadow-blue-500/10' : ''}
        `}
      />
      {/* Premium Glow Effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-opacity duration-300 ${
        isSearchFocused ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
    
    {searchQuery && (
      <div className="absolute top-full mt-3 w-full bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
        <div className="p-4 text-sm text-white/80 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          Quick results for "{searchQuery}"
        </div>
        <div className="max-h-48 overflow-y-auto">
          <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors group">
            <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">Mathematics - Advanced Calculus</div>
            <div className="text-xs text-white/60 mt-1">Chapter 3: Derivatives & Applications</div>
          </div>
          <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors group">
            <div className="text-white font-semibold group-hover:text-purple-300 transition-colors">Physics - Quantum Mechanics</div>
            <div className="text-xs text-white/60 mt-1">Premium Course by Dr. Smith</div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Premium User Avatar Component
const PremiumUserAvatar = () => (
  <div className="group relative">
    {/* Glow Ring */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 animate-pulse" />
    
    {/* Main Avatar */}
    <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-white/50 transition-all duration-300 cursor-pointer shadow-lg shadow-blue-500/25 group-hover:scale-110">
      <span className="text-white font-bold text-lg drop-shadow-lg">JD</span>
    </div>
    
    {/* Status Indicator */}
    <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 animate-pulse shadow-lg shadow-green-500/25" />
    
    {/* Premium Badge */}
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border border-slate-900">
      <Crown className="w-3 h-3 text-white" />
    </div>
    
    {/* Hover Sparkles */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full animate-ping"
          style={{
            left: `${20 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  </div>
);
const PremiumAchievementItem = ({ 
  icon: Icon, 
  label, 
  value, 
  color,
  progress,
  count,
  isMultiplier = false
}: { 
  icon: LucideIcon; 
  label: string; 
  value: string; 
  color: string;
  progress?: number;
  count?: number;
  isMultiplier?: boolean;
}) => (
  <div className="group relative flex items-center space-x-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
    {/* Icon with Gradient Background */}
    <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg transition-all duration-300 group-hover:scale-110`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    
    {/* Content */}
    <div className="flex flex-col items-start">
      <div className={`text-xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent transition-all duration-300`}>
        {value}
      </div>
      <div className="text-white/70 text-sm font-medium group-hover:text-white transition-colors duration-300">
        {label}
      </div>
      
      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-16 h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
    
    {/* Premium Glow Effect */}
    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${color.replace('to-', 'to-transparent from-')} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
    
    {/* Animated Sparkles */}
    {isMultiplier && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
    )}
  </div>
);
