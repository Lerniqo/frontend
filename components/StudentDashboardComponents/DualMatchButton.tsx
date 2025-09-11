"use client";

import { useState } from "react";
import { Swords, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClickSpark from "@/components/reactbits/ClickSpark";
import GlareHover from "@/components/reactbits/GlareHover";
import { Button } from "@/components/ui/button";

interface DualMatchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function DualMatchButton({ onClick, disabled = false }: DualMatchButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.();
  };

  return (
    <div className="relative">
      <ClickSpark
        sparkColor="#3b82f6"
        sparkSize={10}
        sparkRadius={25}
        sparkCount={16}
        duration={500}
        extraScale={1.2}
      >
        <GlareHover
          width="120px"
          height="120px"
          background="linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)"
          borderRadius="20px"
          borderColor="rgba(255, 255, 255, 0.1)"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareSize={180}
          transitionDuration={400}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={disabled}
              className={`
                w-32 h-32 rounded-3xl border-2 border-white/20 backdrop-blur-xl
                bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-blue-500/20
                hover:from-blue-500/30 hover:via-purple-600/30 hover:to-blue-500/30
                hover:border-white/30 hover:shadow-xl hover:shadow-blue-500/20
                transition-all duration-300 group relative overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isHovered ? 'shadow-2xl shadow-purple-500/30' : 'shadow-lg shadow-blue-500/10'}
              `}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-3xl">
                <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/20 animate-pulse" />
                <div className="absolute inset-1 rounded-2xl border border-purple-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                <motion.div
                  animate={isHovered ? { rotate: [0, 15, -15, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Swords className="w-8 h-8 text-white" />
                </motion.div>
                
                <div className="text-center">
                  <div className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    DUAL
                  </div>
                  <div className="text-sm font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    MATCH
                  </div>
                </div>
              </div>

              {/* Lightning bolt animation */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 20 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-2 right-2"
                  >
                    <Zap className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner accent dots */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-blue-400 rounded-full opacity-60" />
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400 rounded-full opacity-60" />
            </Button>
          </motion.div>
        </GlareHover>
      </ClickSpark>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [-2, 2, -2],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -left-1 w-1 h-1 bg-blue-400 rounded-full"
        />
        <motion.div
          animate={{
            y: [2, -2, 2],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute -bottom-1 -right-1 w-1 h-1 bg-purple-400 rounded-full"
        />
      </div>
    </div>
  );
}
