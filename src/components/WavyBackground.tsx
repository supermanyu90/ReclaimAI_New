import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

interface WavyBackgroundProps {
  mouseX: number;
  mouseY: number;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({ mouseX, mouseY }) => {
  const moveX = useTransform(useSpring(mouseX, { stiffness: 50, damping: 20 }), [0, 1000], [-30, 30]);
  const moveY = useTransform(useSpring(mouseY, { stiffness: 50, damping: 20 }), [0, 1000], [-20, 20]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 0.05 }} />
            <stop offset="100%" style={{ stopColor: '#4a5d4e', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 100 Q 250 50 500 100 T 1000 100 L 1000 0 L 0 0 Z"
          fill="url(#waveGrad)"
          style={{ x: moveX, y: moveY }}
          animate={{
            d: [
              "M0 100 Q 250 50 500 100 T 1000 100 L 1000 0 L 0 0 Z",
              "M0 100 Q 250 150 500 100 T 1000 100 L 1000 0 L 0 0 Z",
              "M0 100 Q 250 50 500 100 T 1000 100 L 1000 0 L 0 0 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 150 Q 300 200 600 150 T 1200 150 L 1200 0 L 0 0 Z"
          fill="url(#waveGrad)"
          style={{ x: useTransform(moveX, (v) => -v * 1.5), y: useTransform(moveY, (v) => -v * 1.5) }}
          animate={{
            d: [
              "M0 150 Q 300 200 600 150 T 1200 150 L 1200 0 L 0 0 Z",
              "M0 150 Q 300 100 600 150 T 1200 150 L 1200 0 L 0 0 Z",
              "M0 150 Q 300 200 600 150 T 1200 150 L 1200 0 L 0 0 Z"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};
