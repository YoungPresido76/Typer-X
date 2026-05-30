import React from 'react';
import { motion } from 'motion/react';

interface XPBarProps {
  xp: number;
  xpNeeded: number;
  level: number;
  animate?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ xp, xpNeeded, level, animate = false }) => {
  const pct = Math.min(100, Math.round((xp / xpNeeded) * 100));

  return (
    <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #06B6D4, #7C3AED, #F59E0B)',
          backgroundSize: '200% 100%',
        }}
        initial={{ width: animate ? '0%' : `${pct}%` }}
        animate={{
          width: `${pct}%`,
          backgroundPosition: animate ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
        }}
        transition={{
          width: { duration: 0.6, ease: 'easeOut' },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
        }}
      />
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};
