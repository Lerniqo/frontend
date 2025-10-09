"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface QuestionTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({ timeLeft, totalTime, isActive }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  return (
    <div className="relative">
      {/* Timer Circle */}
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 32 32">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="16"
            cy="16"
            r="14"
            stroke={isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#3b82f6"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={87.96}
            strokeDashoffset={87.96 - (87.96 * percentage) / 100}
            transition={{ duration: 0.3 }}
            className={`${isActive ? 'drop-shadow-lg' : ''}`}
            style={{
              filter: isCritical ? 'drop-shadow(0 0 8px #ef4444)' : 
                      isWarning ? 'drop-shadow(0 0 8px #f59e0b)' : 
                      'drop-shadow(0 0 8px #3b82f6)'
            }}
          />
        </svg>
        
        {/* Timer text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
        >
          <span 
            className={`text-2xl font-bold ${
              isCritical ? 'text-red-400' : 
              isWarning ? 'text-yellow-400' : 
              'text-white'
            }`}
          >
            {timeLeft}
          </span>
        </motion.div>
      </div>

      {/* Warning pulses */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-red-400"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default QuestionTimer;
