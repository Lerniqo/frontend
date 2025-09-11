"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  type: 'success' | 'error' | 'victory';
  onComplete?: () => void;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ trigger, type, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const colors = {
        success: ['#10b981', '#34d399', '#6ee7b7'], // Green shades
        error: ['#ef4444', '#f87171', '#fca5a5'], // Red shades
        victory: ['#fbbf24', '#f59e0b', '#f3f4f6', '#fef3c7'] // Gold/yellow shades
      };

      const particleCount = type === 'victory' ? 20 : 10;
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[type][Math.floor(Math.random() * colors[type].length)],
          size: Math.random() * 8 + 4
        });
      }

      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
    }
  }, [trigger, type, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ 
              opacity: 1, 
              scale: 0,
              y: 0
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              y: type === 'victory' ? -100 : -50,
              x: type === 'victory' ? Math.random() * 200 - 100 : 0
            }}
            transition={{ 
              duration: type === 'victory' ? 2 : 1.5,
              ease: 'easeOut',
              delay: Math.random() * 0.5
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleEffect;
