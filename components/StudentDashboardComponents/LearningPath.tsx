"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Star, 
  Trophy, 
  BookOpen, 
  Target,
  Play,
  Clock
} from "lucide-react";

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
    estimatedTime: "3h 20m"
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
    estimatedTime: "5h 45m"
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
    estimatedTime: "6h 30m"
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
    estimatedTime: "7h 15m"
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
    estimatedTime: "4h 00m"
  }
];

const LearningPath: React.FC = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/20 border-green-500/50";
      case "Intermediate": return "text-blue-400 bg-blue-500/20 border-blue-500/50";
      case "Advanced": return "text-purple-400 bg-purple-500/20 border-purple-500/50";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/50";
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
    >
      {/* Compact Header */}
      <div className="p-2.5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Learning Path</h3>
              <p className="text-xs text-white/70">Mathematics</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-white font-medium">67%</span>
          </div>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Compact Learning Steps */}
      <div className="p-2.5 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {learningSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative ${
              step.isLocked 
                ? "opacity-60 cursor-not-allowed" 
                : "cursor-pointer hover:bg-white/5"
            } transition-all duration-200`}
          >
            {/* Simple Connection Line */}
            {index < learningSteps.length - 1 && (
              <div className="absolute left-4 top-8 w-px h-6 bg-white/20" />
            )}
            
            <div className="relative flex items-start space-x-2.5 p-2 rounded-lg border border-transparent group-hover:border-white/10 transition-all duration-200">
              {/* Compact Step Icon */}
              <div className="flex-shrink-0 relative">
                <div className={`p-1.5 rounded-full border ${
                  step.isCompleted 
                    ? "border-green-400/50 bg-green-500/20 text-green-400" 
                    : step.isActive 
                      ? "border-blue-400/50 bg-blue-500/20 text-blue-400" 
                      : step.isLocked
                        ? "border-gray-400/50 bg-gray-500/20 text-gray-400"
                        : "border-purple-400/50 bg-purple-500/20 text-purple-400"
                }`}>
                  {getStepIcon(step)}
                </div>
                
                {step.isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                )}
              </div>

              {/* Compact Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-xs ${
                      step.isLocked ? "text-white/50" : "text-white"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${
                      step.isLocked ? "text-white/30" : "text-white/60"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ml-1 flex-shrink-0 ${getDifficultyColor(step.difficulty)}`}>
                    {step.difficulty.charAt(0)}
                  </span>
                </div>

                {/* Compact Progress Bar */}
                {!step.isLocked && (
                  <div className="mt-1.5">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{step.completedLessons}/{step.totalLessons}</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div 
                        className={`h-full rounded-full ${
                          step.isCompleted 
                            ? "bg-green-400" 
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Simple Meta Info */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-1 text-xs text-white/40">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{step.estimatedTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {step.progress >= 75 && !step.isCompleted && (
                      <div className="text-xs text-green-400 font-medium">
                        Ready
                      </div>
                    )}
                    
                    {step.isCompleted && (
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Compact Footer */}
      <div className="p-2.5 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          Continue Learning
        </motion.button>
      </div>

      <style jsx global>{`
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
      `}</style>
    </motion.div>
  );
};

export default LearningPath;
