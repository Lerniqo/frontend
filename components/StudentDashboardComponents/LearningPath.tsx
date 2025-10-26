"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Lock,
  Star,
  Trophy,
  Target,
  Play,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { getLearningPath } from "@/services/contentService";

interface LearningStep {
  stepNumber: number;
  title: string;
  description: string;
  conceptName?: string;
  conceptId?: string;
  estimatedDuration: string;
  prerequisites: string[];
  resources: string[];
  status?: "done" | "progressing" | "waiting";
}

interface LearningPathProps {
  learningPathData?: LearningStep[];
  startingStationStatus?: "done" | "progressing" | "waiting";
}

const LearningPath: React.FC<LearningPathProps> = ({
  learningPathData,
  startingStationStatus = "waiting",
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        if (learningPathData) {
          setSteps(learningPathData);
        } else {
          const data = await getLearningPath();
          setSteps(data);
        }
      } catch (error) {
        console.error("Failed to fetch learning path:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [learningPathData]);

  const getStepIcon = (step: LearningStep) => {
    const status = step.status || "waiting";
    if (status === "done") {
      return <CheckCircle className="w-4 h-4 text-green-400 fill-current" />;
    } else if (status === "waiting") {
      return <Lock className="w-4 h-4 text-gray-400" />;
    } else if (status === "progressing") {
      return <Play className="w-4 h-4 text-blue-400 fill-current" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Calculate overall progress
  const completedSteps = steps.filter((s) => s.status === "done").length;
  const overallProgress =
    steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  if (isLoading) {
    return (
      <SpotlightCard
        className="rounded-xl"
        spotlightColor="rgba(59, 130, 246, 0.15)"
        spotlightSize={200}
        intensity={0.6}
      >
        <Card className="w-64 bg-black/40 backdrop-blur-2xl border-0 overflow-hidden relative">
          <CardContent className="p-6 relative z-10 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </CardContent>
        </Card>
      </SpotlightCard>
    );
  }

  // Show waiting state message when starting station is in waiting
  if (startingStationStatus === "waiting") {
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

          <CardContent className="p-6 relative z-10">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/25">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Learning Path</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-white text-center">
                  No learning path yet! Take the initial quiz to create your
                  personalized learning journey.
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-white/60 mb-2">
                  Click on the character to start your quiz
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SpotlightCard>
    );
  }

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
                <span className="text-sm font-medium text-white">
                  Circle Geometry
                </span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {overallProgress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Learning Steps */}
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {steps.map((step, index) => (
              <PremiumLearningStep
                key={step.conceptId || index}
                step={step}
                index={index}
                isHovered={hoveredStep === step.stepNumber}
                onHover={setHoveredStep}
                getStepIcon={getStepIcon}
                totalSteps={steps.length}
              />
            ))}
          </div>

          {/* Premium Footer */}
          <div className="p-3 border-t border-white/10">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {completedSteps}/{steps.length}
                </div>
                <div className="text-xs text-white/60">Steps</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {steps.length}d
                </div>
                <div className="text-xs text-white/60">Duration</div>
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
  getStepIcon: (step: LearningStep) => React.ReactElement;
  totalSteps: number;
}

const PremiumLearningStep: React.FC<PremiumLearningStepProps> = ({
  step,
  index,
  isHovered,
  onHover,
  getStepIcon,
  totalSteps,
}) => {
  const status = step.status || "waiting";
  const isCompleted = status === "done";
  const isLocked = status === "waiting" && index > 0;
  const isActive = status === "progressing";

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => onHover(step.stepNumber)}
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
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
            : isLocked
            ? "bg-white/0"
            : "bg-white/5 group-hover:bg-white/10"
        }`}
      />

      {/* Premium Glow Effect */}
      {isHovered && !isLocked && (
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
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/25"
                : isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
                : isLocked
                ? "bg-gray-500/20 border border-gray-400/30"
                : "bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg group-hover:shadow-purple-500/25"
            }`}
          >
            <div
              className={`w-4 h-4 ${isLocked ? "text-gray-400" : "text-white"}`}
            >
              {getStepIcon(step)}
            </div>
          </div>

          {/* Active Indicator */}
          {isActive && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4
              className={`text-sm font-medium transition-colors duration-300 ${
                isLocked
                  ? "text-white/50"
                  : isActive
                  ? "text-blue-400"
                  : "text-white group-hover:text-blue-300"
              }`}
            >
              Step {step.stepNumber}: {step.title}
            </h4>

            {/* Status Badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-300 ${
                isCompleted
                  ? "bg-green-500/30 text-green-300"
                  : isActive
                  ? "bg-blue-500/30 text-blue-300"
                  : "bg-gray-500/30 text-gray-300"
              }`}
            >
              {status === "done" ? "✓" : status === "progressing" ? "→" : "🔒"}
            </span>
          </div>

          <p
            className={`text-xs mt-0.5 transition-colors duration-300 ${
              isLocked
                ? "text-white/30"
                : isActive
                ? "text-blue-300/80"
                : "text-white/60 group-hover:text-white/80"
            }`}
          >
            {step.description}
          </p>

          {/* Progress Section - Show duration and resources */}
          {!isLocked && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.estimatedDuration}
                </span>
                <span className="flex items-center">
                  📚 {step.resources.length} resources
                </span>
              </div>
              {step.resources.length > 0 && (
                <div className="text-xs text-blue-300/70 mb-1 truncate">
                  {step.resources[0]}
                </div>
              )}
            </div>
          )}

          {/* Meta Info */}
          {!isLocked && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-white/50">
                {step.prerequisites.length > 0 && (
                  <span>Req: {step.prerequisites.length}</span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {isCompleted && (
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Border Indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"
          layoutId="activeLearningIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Hover Sparkles */}
      <AnimatePresence>
        {isHovered && !isLocked && (
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
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}
