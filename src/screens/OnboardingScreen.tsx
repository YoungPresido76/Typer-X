import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithGoogle } from '../lib/auth';

export const OnboardingScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [slide,   setSlide]   = useState(0);

  const SLIDES = [
    {
      icon: '⌨️',
      title: 'Level Up Your Typing.',
      sub:   'Earn XP. Unlock rewards. Every word counts.',
    },
    {
      icon: '🔥',
      title: 'Build Daily Streaks.',
      sub:   'Stay consistent. Watch your rank climb.',
    },
    {
      icon: '🏆',
      title: 'Compete Globally.',
      sub:   'Real-time leaderboard. Your name at the top.',
    },
  ];

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign in failed. Try again.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-dvh w-full bg-[#0D0D0F] overflow-hidden relative">

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-60 h-60 bg-amber-500/6 rounded-full blur-3xl" />
      </div>

      {/* ── Top: Logo ── */}
      <div className="flex-shrink-0 flex flex-col items-center pt-16 pb-4 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-black text-4xl font-black mb-4 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
        >
          X
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-3xl font-black text-white tracking-widest uppercase"
        >
          TYPER <span className="text-orange-500">X</span>
        </motion.h1>

        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1"
        >
          Gamified Keyboard Experience
        </motion.p>
      </div>

      {/* ── Middle: Carousel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="text-center space-y-4"
          >
            {/* Icon card */}
            <div className="mx-auto w-28 h-28 rounded-3xl bg-[#1A1D22] border border-orange-500/15 flex items-center justify-center text-6xl shadow-2xl">
              {SLIDES[slide].icon}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white leading-snug">
                {SLIDES[slide].title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                {SLIDES[slide].sub}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === slide
                  ? 'w-6 h-2 bg-orange-500'
                  : 'w-2 h-2 bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom: CTAs ── */}
      <div className="flex-shrink-0 px-6 space-y-3"
           style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 text-center font-mono bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-2"
          >
            {error}
          </motion.p>
        )}

        {/* Google Sign In */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-black transition-opacity disabled:opacity-60 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
          ) : (
            <>
              {/* Google G icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Get Started
            </>
          )}
        </motion.button>

        {/* Secondary */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-400 border border-white/8 bg-white/3 tracking-wide cursor-pointer active:bg-white/6 transition-colors disabled:opacity-40"
        >
          I already have an account
        </button>

        <p className="text-center text-[9px] text-gray-700 font-mono pb-1">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};
