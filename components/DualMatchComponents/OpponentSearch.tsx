"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Zap, Trophy, Target } from 'lucide-react';

interface OpponentSearchProps {
  progress: number;
  onlineCount: number;
}

const OpponentSearch: React.FC<OpponentSearchProps> = ({ progress, onlineCount }) => {
  const searchSteps = [
    { text: "Scanning for opponents...", icon: Target },
    { text: "Matching skill levels...", icon: Zap },
    { text: "Connecting to server...", icon: Wifi },
    { text: "Finalizing match...", icon: Trophy }
  ];

  const currentStep = Math.floor((progress / 100) * searchSteps.length);

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Main Search Animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 border-4 border-slate-700 border-t-blue-500 rounded-full absolute"
        />
        
        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-36 h-36 border-4 border-slate-700 border-r-purple-600 rounded-full absolute"
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-slate-700 border-b-indigo-500 rounded-full absolute"
        />
        
        {/* Center Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <Users className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Finding opponent...</span>
          <span className="text-white/70">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Search Steps */}
      <div className="space-y-4">
        {searchSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isActive || isCompleted ? 1 : 0.3, 
                x: 0,
                scale: isActive ? 1.05 : 1
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                isActive ? 'bg-blue-500/20 border border-blue-500/50' : 
                isCompleted ? 'bg-green-500/20 border border-green-500/50' :
                'bg-white/5 border border-white/10'
              }`}
            >
              <motion.div
                animate={isActive ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  isActive ? 'bg-blue-500' : 
                  isCompleted ? 'bg-green-500' : 
                  'bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 text-white" />
              </motion.div>
              
              <span className={`text-lg ${
                isActive ? 'text-blue-300 font-semibold' : 
                isCompleted ? 'text-green-300' : 
                'text-white/60'
              }`}>
                {step.text}
              </span>
              
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-green-400"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{onlineCount.toLocaleString()}</div>
          <div className="text-white/60 text-sm">Players Online</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">~30s</div>
          <div className="text-white/60 text-sm">Avg Wait Time</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">98%</div>
          <div className="text-white/60 text-sm">Match Success</div>
        </div>
      </div>
    </div>
  );
};

export default OpponentSearch;
