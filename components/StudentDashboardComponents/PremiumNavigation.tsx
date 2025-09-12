"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Library, 
  Users, 
  Trophy, 
  Calendar, 
  MessageCircle, 
  HelpCircle,
  Sparkles,
  Star,
  Zap,
  Crown,
  Gem,
  LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
  count?: number;
  isNew?: boolean;
  isPremium?: boolean;
  progress?: number;
}

interface PremiumNavigationProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onOpenModal?: (content: 'contests' | 'teachers' | 'resource-library') => void;
}

const navigationItems: NavigationItem[] = [
  {
    icon: Library,
    label: "Resource Library",
    description: "Premium study materials",
    gradient: "from-blue-500 via-blue-600 to-purple-600",
    count: 156,
    isPremium: true
  },
  {
    icon: Users,
    label: "Expert Teachers",
    description: "1-on-1 guidance",
    gradient: "from-purple-500 via-purple-600 to-blue-600",
    count: 8,
    isPremium: true
  },
  {
    icon: Trophy,
    label: "Elite Contests",
    description: "Exclusive competitions",
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    count: 12,
    isNew: true
  },
  {
    icon: Calendar,
    label: "Live Sessions",
    description: "Interactive learning",
    gradient: "from-purple-500 via-violet-500 to-blue-500",
    count: 3
  },
  {
    icon: MessageCircle,
    label: "Study Groups",
    description: "Collaborative learning",
    gradient: "from-blue-500 via-cyan-500 to-purple-500",
    count: 24
  },
  {
    icon: HelpCircle,
    label: "AI Quizzes",
    description: "Adaptive testing",
    gradient: "from-purple-600 via-blue-500 to-indigo-600",
    progress: 85
  }
];

const PremiumNavigation: React.FC<PremiumNavigationProps> = ({ 
  activeNav, 
  onNavChange,
  onOpenModal
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (item: NavigationItem) => {
    const navKey = item.label.toLowerCase().replace(' ', '-');
    onNavChange(navKey);
    
    // Open modal for specific navigation items
    if (onOpenModal) {
      if (item.label === "Elite Contests") {
        onOpenModal('contests');
      } else if (item.label === "Expert Teachers") {
        onOpenModal('teachers');
      } else if (item.label === "Resource Library") {
        onOpenModal('resource-library');
      }
    }
  };

  return (
    <SpotlightCard 
      className="rounded-xl"
      spotlightColor="rgba(147, 51, 234, 0.15)"
      spotlightSize={200}
      intensity={0.6}
    >
      <Card className="w-64 bg-black/40 backdrop-blur-2xl border-0 overflow-hidden relative">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/10 to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.15),transparent_40%)]" />
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 p-[1px]">
          <div className="w-full h-full bg-black/60 rounded-xl" />
        </div>

      <CardContent className="p-0 relative z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-white/60">Elite Learning Experience</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-2">
          {navigationItems.map((item, index) => (
            <PremiumNavItem
              key={index}
              item={item}
              isActive={activeNav === item.label.toLowerCase().replace(' ', '-')}
              isHovered={hoveredItem === item.label}
              onHover={setHoveredItem}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>

        {/* Premium Stats Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-xs text-white/60">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                247
              </div>
              <div className="text-xs text-white/60">Study Streak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </SpotlightCard>
  );
};

interface PremiumNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: (label: string | null) => void;
  onClick: () => void;
}

const PremiumNavItem: React.FC<PremiumNavItemProps> = ({
  item,
  isActive,
  isHovered,
  onHover,
  onClick
}) => {
  const { icon: Icon, label, description, gradient, count, isNew, isPremium, progress } = item;

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Interactive Background */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20' 
          : 'bg-white/5 group-hover:bg-white/10'
      }`} />
      
      {/* Premium Glow Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-3 flex items-center space-x-3">
        {/* Icon Container */}
        <div className="relative">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} shadow-lg transition-all duration-300 ${
            isActive ? 'shadow-blue-500/25' : 'group-hover:shadow-purple-500/25'
          }`}>
            <Icon className={`w-4 h-4 text-white transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`} />
          </div>
          
          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Gem className="w-1.5 h-1.5 text-white" />
            </div>
          )}
          
          {/* New Badge */}
          {isNew && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-white" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium transition-colors duration-300 ${
              isActive 
                ? 'text-blue-400' 
                : 'text-white group-hover:text-blue-300'
            }`}>
              {label}
            </h4>
            
            {/* Count or Progress */}
            {count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/10 text-white/80 group-hover:bg-purple-500/20 group-hover:text-purple-300'
              }`}>
                {count}
              </span>
            )}
            
            {progress !== undefined && (
              <div className="flex items-center space-x-2">
                <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs text-white/80">{progress}%</span>
              </div>
            )}
          </div>
          
          <p className={`text-xs transition-colors duration-300 ${
            isActive 
              ? 'text-blue-300/80' 
              : 'text-white/60 group-hover:text-white/80'
          }`}>
            {description}
          </p>
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
          layoutId="activeIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Hover Sparkles */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumNavigation;
