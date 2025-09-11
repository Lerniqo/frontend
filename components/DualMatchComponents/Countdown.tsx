"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  count: number;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ count, onComplete }) => {
  React.useEffect(() => {
    if (count === 0) {
      setTimeout(onComplete, 1000);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        {count > 0 ? (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              textShadow: [
                "0 0 0px rgba(59, 130, 246, 0)",
                "0 0 20px rgba(59, 130, 246, 0.8)",
                "0 0 0px rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ duration: 1 }}
            className="text-[200px] font-bold text-white leading-none"
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              textShadow: [
                "0 0 0px rgba(34, 197, 94, 0)",
                "0 0 30px rgba(34, 197, 94, 0.8)",
                "0 0 0px rgba(34, 197, 94, 0)"
              ]
            }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <div className="text-8xl font-bold text-green-400">START!</div>
            <div className="text-2xl text-white/70">Quiz begins now!</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Countdown;
