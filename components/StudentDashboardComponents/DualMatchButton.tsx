"use client";

import { useState } from "react";
import { Swords } from "lucide-react";
import { motion } from "framer-motion";
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
        sparkSize={8}
        sparkRadius={25}
        sparkCount={15}
        duration={600}
        extraScale={1.2}
      >
        <GlareHover
          width="80px"
          height="80px"
          background="linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)"
          borderRadius="20px"
          borderColor="rgba(255, 255, 255, 0.15)"
          glareColor="#ffffff"
          glareOpacity={0.4}
          glareSize={120}
          transitionDuration={400}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={disabled}
              className={`
                w-20 h-20 rounded-2xl border-2 border-white/30 backdrop-blur-xl
                bg-gradient-to-br from-blue-500/25 via-purple-600/25 to-blue-500/25
                hover:from-blue-500/35 hover:via-purple-600/35 hover:to-blue-500/35
                hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30
                transition-all duration-300 group relative overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isHovered ? 'shadow-2xl shadow-blue-500/40 border-blue-400/60' : 'shadow-lg shadow-blue-500/15'}
              `}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-600/15 to-blue-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-pulse" />
                <div className="absolute inset-1 rounded-xl border border-purple-400/25 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                <motion.div
                  animate={isHovered ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                >
                  <Swords className="w-5 h-5 text-white" />
                </motion.div>
                
                <div className="text-center">
                  <div className="text-xs font-bold text-white px-2 py-1 bg-black/30 backdrop-blur-sm rounded-md border border-white/20">
                    BATTLE
                  </div>
                </div>
              </div>

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
