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
  Target
} from "lucide-react";
import { CAMERA_PATH } from "@/constants/cameraPath";
import type { DashboardUIProps } from "@/types/dashboard.types";

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

      {/* Top Gaming Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="m-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-4">
            <div className="flex justify-between items-center">
              {/* Left side - Logo/Brand */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center border border-white/20">
                  <Gamepad2 className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Lerniqo
                  </h1>
                  <p className="text-white/60 text-xs">Gaming Mode</p>
                </div>
              </div>

              {/* Center - Navigation Menu */}
              <div className="flex items-center space-x-2">
                {navigationItems.map((item, index) => (
                  <NavButton 
                    key={index}
                    icon={item.icon} 
                    label={item.label} 
                    color={item.gradient} 
                  />
                ))}
              </div>

              {/* Right side - User Profile & Search */}
              <div className="flex items-center space-x-4">
                <SearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isSearchFocused={isSearchFocused}
                  setIsSearchFocused={setIsSearchFocused}
                />
                <UserAvatar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-3">
            <div className="flex flex-col space-y-2">
              <SideNavButton 
                icon={Home} 
                label="Dashboard" 
                active={activeNav === 'dashboard'}
                onClick={() => setActiveNav('dashboard')} 
              />
              <SideNavButton 
                icon={TrendingUp} 
                label="Progress" 
                active={activeNav === 'progress'}
                onClick={() => setActiveNav('progress')} 
              />
              <SideNavButton 
                icon={GraduationCap} 
                label="My Sessions" 
                active={activeNav === 'sessions'}
                onClick={() => setActiveNav('sessions')} 
              />
              <SideNavButton 
                icon={Bot} 
                label="AI Tutor" 
                active={activeNav === 'ai-tutor'}
                onClick={() => setActiveNav('ai-tutor')} 
              />
              <SideNavButton 
                icon={MessageCircle} 
                label="Forum" 
                active={activeNav === 'forum'}
                onClick={() => setActiveNav('forum')} 
              />
              <SideNavButton 
                icon={Settings} 
                label="Settings" 
                active={activeNav === 'settings'}
                onClick={() => setActiveNav('settings')} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side stats */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-4">
            <div className="flex flex-col space-y-4 text-center">
              <div className="space-y-2">
                <div className="bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs px-3 py-1 rounded-full">
                  Level 12
                </div>
                <div className="text-xs text-white/60">Next: 550 XP</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-bold">2,450</span>
                </div>
                <div className="text-xs text-white/60">Total XP</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-white font-bold">7</span>
                </div>
                <div className="text-xs text-white/60">Day Streak</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-bold">#247</span>
                </div>
                <div className="text-xs text-white/60">Global Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Achievement Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-4">
            <div className="flex items-center space-x-6">
              <AchievementItem 
                icon={Trophy} 
                label="Achievements" 
                value="12/50" 
                color="text-yellow-400" 
              />
              <AchievementItem 
                icon={Target} 
                label="Completed" 
                value="85%" 
                color="text-green-400" 
              />
              <AchievementItem 
                icon={Zap} 
                label="Speed Bonus" 
                value="x2.5" 
                color="text-blue-400" 
              />
              <AchievementItem 
                icon={Star} 
                label="Perfect Scores" 
                value="23" 
                color="text-purple-400" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gaming Controls Hint */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="p-3">
            <div className="text-xs text-white/60 space-y-1">
              <p className="text-white font-semibold mb-2 flex items-center space-x-1">
                <Gamepad2 className="w-3 h-3" />
                <span>Controls</span>
              </p>
              <p>← ↓ Move backward | ↑ → Move forward</p>
              <p>🖱️ Mouse: Adjust camera view</p>
            </div>
          </div>
        </div>
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
  icon: React.ElementType; 
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
  icon: React.ElementType; 
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
  icon: React.ElementType; 
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
