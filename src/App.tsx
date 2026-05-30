import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

import { UserStats, Mission, NavTab, Toast } from './types';
import { xpForLevel, levelFromXP } from './hooks/useXP';
import { BottomNav } from './components/BottomNav';
import { LevelUpModal } from './components/LevelUpModal';
import { HomeScreen } from './screens/HomeScreen';
import { TreeScreen } from './screens/TreeScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { ShopScreen } from './screens/ShopScreen';
import { SettingsScreen } from './screens/SettingsScreen';

/* ── seed data ── */
const INITIAL_STATS: UserStats = {
  level: 14,
  xp: 7820,
  xpNeeded: xpForLevel(15),
  gems: 2450,
  streak: 9,
  highestStreak: 12,
  totalWords: 2843,
  totalKeys: 152300,
  avgWpm: 68,
  avgAccuracy: 94,
  dailyGoalXp: 2843,
  dailyGoalTarget: 5000,
  username: 'TyperX',
};

const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', type: 'daily', title: 'Type 1,000 words today',   description: '', xpReward: 150, gemReward: 50, currentValue: 247,  targetValue: 1000, completed: false, claimed: false, iconName: 'keyboard' },
  { id: 'm2', type: 'daily', title: 'Maintain 95% accuracy',   description: '', xpReward: 100, gemReward: 30, currentValue: 94,   targetValue: 95,   completed: false, claimed: false, iconName: 'target'   },
  { id: 'm3', type: 'daily', title: 'Use swipe typing 50 times',description: '', xpReward: 60,  gemReward: 20, currentValue: 32,   targetValue: 50,   completed: false, claimed: false, iconName: 'swipe'    },
  { id: 'm4', type: 'weekly',title: 'Type 5,000 words',         description: '', xpReward: 200, gemReward: 80, currentValue: 2643, targetValue: 5000, completed: false, claimed: false, iconName: 'chart'    },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [levelUpModal, setLevelUpModal] = useState<{ level: number; xpGained: number } | null>(null);
  const [lastLevel, setLastLevel] = useState(INITIAL_STATS.level);

  /* ── toast helpers ── */
  const addToast = useCallback((text: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  /* ── level-up watcher ── */
  useEffect(() => {
    if (stats.level > lastLevel) {
      setLastLevel(stats.level);
      setLevelUpModal({ level: stats.level, xpGained: stats.xp });
    }
  }, [stats.level, lastLevel, stats.xp]);

  /* ── demo: add XP on tab change ── */
  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const screenProps = {
    userStats: stats,
    missions,
    onNavigate: (t: string) => setActiveTab(t as NavTab),
  };

  return (
    /* ──────────────────────────────────────────
       OUTER: centering shell for desktop preview
    ────────────────────────────────────────── */
    <div className="min-h-screen bg-[#080A0C] flex items-center justify-center p-4 font-display">

      {/* Desktop ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* ──────────────────────────────────────────
          PHONE FRAME
      ────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ maxWidth: '390px' }}
      >
        {/* Phone bezel */}
        <div
          className="relative rounded-[44px] overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: '#0D0D0F',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(6,182,212,0.06)',
            minHeight: '844px',
          }}
        >
          {/* Dynamic island */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-28 h-8 bg-black rounded-2xl flex items-center justify-center gap-2 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#1A1A1C]" />
              <div className="w-8 h-1.5 rounded-full bg-[#1A1A1C]" />
            </div>
          </div>

          {/* Screen content */}
          <div className="flex flex-col" style={{ height: 'calc(844px - 56px)' }}>

            {/* ── App header ── */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                {/* Typer X logo mark */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #06B6D4, #7C3AED)' }}
                >
                  G
                </div>
                <div>
                  <p className="text-[13px] font-black text-white tracking-tight leading-none">
                    Glyph<span className="text-cyan-400">Key</span>
                  </p>
                  <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest leading-tight">
                    Level up your typing
                  </p>
                </div>
              </div>

              <button className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center relative cursor-pointer active:scale-90 transition-transform">
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </button>
            </header>

            {/* ── Screen area ── */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.16 }}
                >
                  {activeTab === 'home'        && <HomeScreen {...screenProps} />}
                  {activeTab === 'tree'        && <TreeScreen userStats={stats} />}
                  {activeTab === 'leaderboard' && <LeaderboardScreen users={[]} />}
                  {activeTab === 'shop'        && <ShopScreen userStats={stats} />}
                  {activeTab === 'settings'    && <SettingsScreen />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Bottom nav ── */}
            <BottomNav active={activeTab} onNavigate={handleNavigate} />
          </div>
        </div>

        {/* Desktop label */}
        <p className="text-center text-[10px] text-gray-700 font-mono mt-4 tracking-widest uppercase">
          Typer X v0.2 · Chat 2 Build
        </p>
      </div>

      {/* ── Toast stack (outside phone frame for visibility) ── */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.92 }}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#14161A]/95 border border-cyan-500/20 border-l-2 border-l-cyan-500 rounded-xl shadow-2xl pointer-events-auto backdrop-blur"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse flex-shrink-0" />
              <p className="text-xs font-bold text-gray-200">{toast.text}</p>
              <button
                onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))}
                className="ml-1 text-gray-600 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Level Up Modal ── */}
      <AnimatePresence>
        {levelUpModal && (
          <LevelUpModal
            level={levelUpModal.level}
            xpGained={levelUpModal.xpGained}
            onClose={() => setLevelUpModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
