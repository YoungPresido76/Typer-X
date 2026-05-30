import React, { useState, useEffect } from 'react';
import { KeyboardSkin, SoundPack, Mission, Badge, LeaderboardUser, UserStats } from './types';
import {
  INITIAL_SKINS,
  INITIAL_SOUNDPACKS,
  INITIAL_MISSIONS,
  INITIAL_BADGES,
  INITIAL_LEADERBOARD
} from './data';
import { DashboardTab } from './components/DashboardTab';
import { MissionsTab } from './components/MissionsTab';
import { ShopTab } from './components/ShopTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { StatsTab } from './components/StatsTab';
import { ProfileTab } from './components/ProfileTab';

import {
  Home, Flag, ShoppingBag, BarChart2, User,
  Coins, X, Bell, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playLevelUpSound, playSuccessSound } from './audio';

type NavTab = 'home' | 'missions' | 'shop' | 'stats' | 'profile';

const NAV_TABS: { id: NavTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'missions', label: 'Missions', Icon: Flag },
  { id: 'shop',     label: 'Shop',     Icon: ShoppingBag },
  { id: 'stats',    label: 'Stats',    Icon: BarChart2 },
  { id: 'profile',  label: 'Profile',  Icon: User },
];

export default function App() {
  const [activeTab, setActiveTab]   = useState<NavTab>('home');
  const [skins, setSkins]           = useState<KeyboardSkin[]>(INITIAL_SKINS);
  const [sounds, setSounds]         = useState<SoundPack[]>(INITIAL_SOUNDPACKS);
  const [missions, setMissions]     = useState<Mission[]>(INITIAL_MISSIONS);
  const [badges]                    = useState<Badge[]>(INITIAL_BADGES);
  const [leaderboard]               = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  const [userStats, setUserStats] = useState<UserStats>({
    level: 14,
    xp: 7820,
    xpNeeded: 10000,
    coins: 2450,
    streak: 9,
    highestStreak: 12,
    totalWords: 2843,
    totalKeys: 152300,
    avgWpm: 68,
    avgAccuracy: 94,
    dailyGoalProgress: 2843,
    dailyGoalTarget: 5000,
  });

  const [toasts, setToasts]           = useState<Array<{ id: number; text: string; type: 'success' | 'achievement' | 'reward' }>>([]);
  const [activeModal, setActiveModal] = useState<'level-up' | 'daily-reward' | 'streak-boost' | null>(null);
  const [lastLevel, setLastLevel]     = useState(14);

  /* ── toast helper ── */
  const triggerToast = (text: string, type: 'success' | 'achievement' | 'reward') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  /* ── level-up watcher ── */
  useEffect(() => {
    if (userStats.level > lastLevel) {
      setLastLevel(userStats.level);
      playLevelUpSound();
      setActiveModal('level-up');
    }
  }, [userStats.level, lastLevel]);

  const claimDailyReward = () => {
    playSuccessSound();
    setActiveModal(null);
    setUserStats(prev => ({ ...prev, coins: prev.coins + 300, xp: Math.min(prev.xpNeeded - 1, prev.xp + 200) }));
    triggerToast('Daily Chest Claimed: +300 Coins & +200 XP! 🎁', 'reward');
  };

  const toastIcons: Record<string, string> = {
    success: '✅',
    achievement: '🏆',
    reward: '🎁',
  };

  return (
    /* ── outer centering shell ── */
    <div className="min-h-screen bg-[#080A0C] flex items-center justify-center p-4 font-sans">

      {/* ambient glow */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/4 rounded-full blur-3xl" />
      </div>

      {/* ══════════════════════════════════════════
          PHONE FRAME
      ══════════════════════════════════════════ */}
      <div className="relative w-full" style={{ maxWidth: 390 }}>

        {/* Bezel */}
        <div
          className="relative overflow-hidden border border-white/8"
          style={{
            background: '#0D0D0F',
            borderRadius: 44,
            minHeight: 844,
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.85), 0 0 50px rgba(249,115,22,0.05)',
          }}
        >
          {/* Dynamic island */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-28 h-8 bg-black rounded-2xl flex items-center justify-center gap-2 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#1A1A1C]" />
              <div className="w-8 h-1.5 rounded-full bg-[#1A1A1C]" />
            </div>
          </div>

          {/* Screen */}
          <div className="flex flex-col" style={{ height: 'calc(844px - 56px)' }}>

            {/* ── App Header ── */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-orange-500/8 bg-[#0D0D0F]/90 backdrop-blur sticky top-0 z-30">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-base"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}
                >
                  X
                </div>
                <div>
                  <p className="text-[13px] font-black text-white tracking-widest uppercase leading-none">
                    TYPER <span className="text-orange-500">X</span>
                  </p>
                  <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest leading-tight mt-0.5">
                    Gamified Keyboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Coins badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <Coins className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-black text-gray-200 font-mono">{userStats.coins.toLocaleString()}</span>
                </div>
                {/* Notification */}
                <button
                  onClick={() => setActiveModal('daily-reward')}
                  className="relative w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                >
                  <Bell className="w-4 h-4 text-gray-400" />
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
                </button>
              </div>
            </header>

            {/* ── Screen area ── */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="absolute inset-0 overflow-y-auto"
                  style={{ scrollbarWidth: 'none' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className="p-4">
                    {activeTab === 'home' && (
                      <DashboardTab
                        userStats={userStats}
                        missions={missions}
                        onNavigate={(to) => setActiveTab(to as NavTab)}
                      />
                    )}

                    {activeTab === 'missions' && (
                      <MissionsTab
                        missions={missions}
                        setMissions={setMissions}
                        userStats={userStats}
                        setUserStats={setUserStats}
                        triggerToast={triggerToast}
                      />
                    )}

                    {activeTab === 'shop' && (
                      <ShopTab
                        skins={skins}
                        setSkins={setSkins}
                        sounds={sounds}
                        setSounds={setSounds}
                        userStats={userStats}
                        setUserStats={setUserStats}
                        triggerToast={triggerToast}
                      />
                    )}

                    {activeTab === 'stats' && (
                      <>
                        <LeaderboardTab
                          leaderboard={leaderboard}
                          userXp={userStats.xp}
                          userWpm={userStats.avgWpm}
                          userAccuracy={userStats.avgAccuracy}
                          onStartDuel={() => triggerToast('Arena Duel coming in Chat 4! 🏎️', 'success')}
                        />
                        <div className="mt-6">
                          <StatsTab userStats={userStats} />
                        </div>
                      </>
                    )}

                    {activeTab === 'profile' && (
                      <ProfileTab userStats={userStats} badges={badges} />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Bottom Navigation ── */}
            <nav className="flex items-center justify-around px-1 py-2 bg-[#0D0D0F]/95 backdrop-blur-xl border-t border-white/5">
              {NAV_TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="relative flex flex-col items-center justify-center gap-1 w-16 py-1 cursor-pointer group"
                  >
                    {/* Active top bar */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bar"
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200 ${
                        isActive ? 'bg-orange-500/15' : 'group-active:bg-white/5'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors duration-200 ${
                          isActive ? 'text-orange-400' : 'text-gray-600 group-hover:text-gray-400'
                        }`}
                      />
                    </motion.div>

                    <span
                      className={`text-[9px] font-bold tracking-wide transition-colors duration-200 ${
                        isActive ? 'text-orange-400' : 'text-gray-600'
                      }`}
                    >
                      {label.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </nav>

          </div>
        </div>

        {/* Desktop label */}
        <p className="text-center text-[10px] text-gray-700 font-mono mt-4 tracking-widest uppercase">
          Typer X · Companion App · Chat 3 Build
        </p>
      </div>

      {/* ── Toast Stack ── */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.92 }}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#121417]/95 border border-neutral-800 border-l-2 border-l-orange-500 rounded-xl shadow-2xl pointer-events-auto backdrop-blur"
            >
              <span className="text-sm">{toastIcons[toast.type]}</span>
              <p className="text-xs font-bold text-gray-200 flex-1">{toast.text}</p>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-gray-600 hover:text-white cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4 pb-8"
          >
            {/* Level Up */}
            {activeModal === 'level-up' && (
              <motion.div
                initial={{ scale: 0.9, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 40 }}
                className="bg-[#121417] border border-orange-500/20 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl shadow-orange-500/10 relative"
              >
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <p className="text-[10px] text-orange-500 font-bold font-mono tracking-widest uppercase">✦ Level Ascension ✦</p>
                  <h2 className="text-2xl font-black text-white mt-1">LEVEL UP! 🥇</h2>
                </div>

                {/* Level badge */}
                <div className="relative mx-auto w-24 h-24">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(from 0deg, #FF7A00, #FF5000, #FBBF24, #FF7A00)' }}
                  />
                  <div className="absolute inset-1 rounded-full bg-[#121417] flex flex-col items-center justify-center">
                    <span className="text-[8px] text-gray-500 font-mono uppercase">LV</span>
                    <span className="text-4xl font-black text-white leading-none">{userStats.level}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  You reached <b className="text-white">Level {userStats.level}</b>. Keep typing to level up faster!
                </p>

                <div className="bg-[#1A1D22] p-3 rounded-xl border border-neutral-800 flex justify-around">
                  <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-mono uppercase">XP Reward</p>
                    <p className="text-xs font-black text-orange-400">+250 XP</p>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-mono uppercase">Streak</p>
                    <p className="text-xs font-black text-orange-400">×1.5</p>
                  </div>
                </div>

                <button
                  onClick={() => { playSuccessSound(); setActiveModal(null); }}
                  className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}
                >
                  Awesome! 🔥
                </button>
              </motion.div>
            )}

            {/* Daily Reward */}
            {activeModal === 'daily-reward' && (
              <motion.div
                initial={{ scale: 0.9, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 40 }}
                className="bg-[#121417] border border-orange-500/20 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl shadow-orange-500/10 relative"
              >
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <p className="text-[10px] text-orange-500 font-bold font-mono tracking-widest uppercase">Daily Loyalty Drop</p>
                  <h2 className="text-2xl font-black text-white mt-1">DAILY REWARD</h2>
                </div>

                <div className="text-5xl animate-bounce py-2">🎁</div>

                <p className="text-xs text-gray-400 px-2 leading-relaxed">
                  Day 9 Reward ready to claim. Maintain your streak to keep rewards growing!
                </p>

                <div className="bg-[#1A1D22] p-3 rounded-xl border border-neutral-800 flex justify-around">
                  <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-mono uppercase">Coins</p>
                    <p className="text-xs font-black text-orange-400">+300</p>
                  </div>
                  <div className="w-px bg-neutral-800" />
                  <div className="text-center">
                    <p className="text-[9px] text-gray-500 font-mono uppercase">XP Boost</p>
                    <p className="text-xs font-black text-orange-400">+200 XP</p>
                  </div>
                </div>

                <button
                  onClick={claimDailyReward}
                  className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}
                >
                  Claim Reward
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
