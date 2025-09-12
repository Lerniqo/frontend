"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Star, 
  Trophy, 
  BookOpen, 
  Target,
  Play,
  Clock,
  Crown,
  Gem,
  Sparkles,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface LearningStep {
  id: number;
  title: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  totalLessons: number;
  completedLessons: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  isPremium?: boolean;
  isNew?: boolean;
}

const learningSteps: LearningStep[] = [
  {
    id: 1,
    title: "Mathematics Basics",
    description: "Algebra & Geometry foundations",
    progress: 100,
    isCompleted: true,
    isLocked: false,
    isActive: false,
    totalLessons: 12,
    completedLessons: 12,
    difficulty: "Beginner",
    estimatedTime: "3h 20m",
    isPremium: false
  },
  {
    id: 2,
    title: "Calculus I",
    description: "Limits, derivatives & applications",
    progress: 85,
    isCompleted: false,
    isLocked: false,
    isActive: true,
    totalLessons: 18,
    completedLessons: 15,
    difficulty: "Intermediate",
    estimatedTime: "5h 45m",
    isPremium: true
  },
  {
    id: 3,
    title: "Calculus II",
    description: "Integration & series",
    progress: 0,
    isCompleted: false,
    isLocked: true,
    isActive: false,
    totalLessons: 20,
    completedLessons: 0,
    difficulty: "Intermediate",
    estimatedTime: "6h 30m",
    isPremium: true
  },
  {
    id: 4,
    title: "Linear Algebra",
    description: "Matrices & vector spaces",
    progress: 0,
    isCompleted: false,
    isLocked: true,
    isActive: false,
    totalLessons: 16,
    completedLessons: 0,
    difficulty: "Advanced",
    estimatedTime: "7h 15m",
    isPremium: true,
    isNew: true
  },
  {
    id: 5,
    title: "Final Assessment",
    description: "Comprehensive exam & certification",
    progress: 0,
    isCompleted: false,
    isLocked: true,
    isActive: false,
    totalLessons: 6,
    completedLessons: 0,
    difficulty: "Advanced",
    estimatedTime: "4h 00m",
    isPremium: true
  }
];

const LearningPath: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "from-green-400 to-emerald-500";
      case "Intermediate": return "from-blue-400 to-cyan-500";
      case "Advanced": return "from-purple-400 to-pink-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getStepIcon = (step: LearningStep) => {
    if (step.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-400 fill-current" />;
    } else if (step.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    } else if (step.isActive) {
      return <Play className="w-4 h-4 text-blue-400 fill-current" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <SpotlightCard 
      className="rounded-xl"
      spotlightColor="rgba(59, 130, 246, 0.15)"
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
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-white/60">Learning Journey</p>
              </div>
            </div>
            
            {/* Premium Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Mathematics</span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">67%</span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "67%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Learning Steps */}
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {learningSteps.map((step, index) => (
              <PremiumLearningStep
                key={step.id}
                step={step}
                index={index}
                isHovered={hoveredStep === step.id}
                onHover={setHoveredStep}
                getDifficultyColor={getDifficultyColor}
                getStepIcon={getStepIcon}
                totalSteps={learningSteps.length}
              />
            ))}
          </div>

          {/* Premium Footer */}
          <div className="p-3 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  4/5
                </div>
                <div className="text-xs text-white/60">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  28h
                </div>
                <div className="text-xs text-white/60">Total Time</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              Continue Learning
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </SpotlightCard>
  );
};

interface PremiumLearningStepProps {
  step: LearningStep;
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  getDifficultyColor: (difficulty: string) => string;
  getStepIcon: (step: LearningStep) => React.ReactElement;
  totalSteps: number;
}

const PremiumLearningStep: React.FC<PremiumLearningStepProps> = ({
  step,
  index,
  isHovered,
  onHover,
  getDifficultyColor,
  getStepIcon,
  totalSteps
}) => {
  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => onHover(step.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Connection Line */}
      {index < totalSteps - 1 && (
        <div className="absolute left-4 top-8 w-px h-6 bg-gradient-to-b from-blue-400/30 to-purple-400/30" />
      )}

      {/* Interactive Background */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
        step.isActive 
          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20' 
          : step.isLocked
            ? 'bg-white/0'
            : 'bg-white/5 group-hover:bg-white/10'
      }`} />
      
      {/* Premium Glow Effect */}
      {isHovered && !step.isLocked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-3 flex items-center space-x-3">
        {/* Icon Container */}
        <div className="relative">
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            step.isCompleted 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/25' 
              : step.isActive 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                : step.isLocked
                  ? 'bg-gray-500/20 border border-gray-400/30'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg group-hover:shadow-purple-500/25'
          }`}>
            <div className={`w-4 h-4 ${
              step.isLocked ? 'text-gray-400' : 'text-white'
            }`}>
              {getStepIcon(step)}
            </div>
          </div>
          
          {/* Premium Badge */}
          {step.isPremium && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Gem className="w-1.5 h-1.5 text-white" />
            </div>
          )}
          
          {/* New Badge */}
          {step.isNew && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-white" />
            </div>
          )}

          {/* Active Indicator */}
          {step.isActive && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium transition-colors duration-300 ${
              step.isLocked 
                ? 'text-white/50' 
                : step.isActive
                  ? 'text-blue-400'
                  : 'text-white group-hover:text-blue-300'
            }`}>
              {step.title}
            </h4>
            
            {/* Difficulty Badge */}
            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getDifficultyColor(step.difficulty)} text-white font-medium transition-all duration-300`}>
              {step.difficulty.charAt(0)}
            </span>
          </div>
          
          <p className={`text-xs mt-0.5 transition-colors duration-300 ${
            step.isLocked 
              ? 'text-white/30' 
              : step.isActive
                ? 'text-blue-300/80'
                : 'text-white/60 group-hover:text-white/80'
          }`}>
            {step.description}
          </p>

          {/* Progress Section */}
          {!step.isLocked && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>{step.completedLessons}/{step.totalLessons} lessons</span>
                <span>{step.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${
                    step.isCompleted 
                      ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1 text-xs text-white/50">
              <Clock className="w-3 h-3" />
              <span>{step.estimatedTime}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {step.progress >= 75 && !step.isCompleted && (
                <div className="text-xs text-green-400 font-medium">
                  Ready
                </div>
              )}
              
              {step.isCompleted && (
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Border Indicator */}
      {step.isActive && (
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
          layoutId="activeLearningIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Hover Sparkles */}
      <AnimatePresence>
        {isHovered && !step.isLocked && (
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

export default LearningPath;

// Add global styles for custom scrollbar
const globalStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.8);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}
