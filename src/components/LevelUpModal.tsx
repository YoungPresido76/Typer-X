import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getLevelTitle, getTitleColor } from '../hooks/useXP';

interface LevelUpModalProps {
  level: number;
  xpGained: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, xpGained, onClose }) => {
  const title = getLevelTitle(level);
  const titleColor = getTitleColor(title);
  const [waveComplete, setWaveComplete] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWaveComplete(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Wave sweep — bottom-right to top-left, cyan → violet → amber */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ clipPath: 'circle(0% at 100% 100%)' }}
          animate={{ clipPath: 'circle(150% at 100% 100%)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(124,58,237,0.22) 50%, rgba(245,158,11,0.16) 100%)',
          }}
        />

        {/* Dark backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: waveComplete ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-sm mx-4 mb-8 rounded-3xl overflow-hidden"
          initial={{ y: 120, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Card inner glow border */}
          <div className="absolute inset-0 rounded-3xl p-px">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-violet-500/20 to-amber-500/20" />
          </div>

          <div className="relative bg-[#0F1114] rounded-3xl p-7 text-center space-y-5">
            {/* Sparkle header */}
            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-[0.25em] text-cyan-500 uppercase font-mono">
                ✦ Level Ascension ✦
              </p>
              <h2 className="text-3xl font-black text-white tracking-tight">LEVEL UP!</h2>
            </div>

            {/* Level badge */}
            <div className="relative mx-auto w-28 h-28">
              {/* Outer ring pulse */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'conic-gradient(from 0deg, #06B6D4, #7C3AED, #F59E0B, #06B6D4)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-1 rounded-full bg-[#0F1114] flex flex-col items-center justify-center">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">LV</span>
                <span className="text-4xl font-black text-white leading-none">{level}</span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <p className="text-xs text-gray-400">You reached</p>
              <p className={`text-lg font-black ${titleColor}`}>{title}</p>
            </div>

            {/* Reward row */}
            <div className="flex items-center justify-around bg-white/4 rounded-2xl p-4 border border-white/5">
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">XP Gained</p>
                <p className="text-sm font-black text-cyan-400 mt-0.5">+{xpGained.toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Level</p>
                <p className="text-sm font-black text-violet-400 mt-0.5">{level}</p>
              </div>
              <div className="w-px h-8 bg-white/8" />
              <div className="text-center">
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Streak</p>
                <p className="text-sm font-black text-amber-400 mt-0.5">×1.5</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-white cursor-pointer active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 60%, #F59E0B 100%)',
              }}
            >
              Awesome! 🔥
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
