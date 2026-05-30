import React, { useState, useEffect } from 'react';
import { Mission, KeyboardSkin, SoundPack, Badge, LeaderboardUser } from './types';
import {
  INITIAL_SKINS, INITIAL_SOUNDPACKS, INITIAL_MISSIONS,
  INITIAL_BADGES, INITIAL_LEADERBOARD
} from './data';
import { useAuth } from './contexts/AuthContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DashboardTab } from './components/DashboardTab';
import { MissionsTab } from './components/MissionsTab';
import { ShopTab } from './components/ShopTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { StatsTab } from './components/StatsTab';
import { ProfileTab } from './components/ProfileTab';
import { Home, Flag, ShoppingBag, BarChart2, User, Coins, Bell, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playLevelUpSound, playSuccessSound } from './audio';
import { subscribeToLeaderboard, LeaderboardEntry } from './lib/firestore';

type NavTab = 'home' | 'missions' | 'shop' | 'stats' | 'profile';

const NAV_TABS: { id: NavTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'missions', label: 'Missions', Icon: Flag },
  { id: 'shop',     label: 'Shop',     Icon: ShoppingBag },
  { id: 'stats',    label: 'Stats',    Icon: BarChart2 },
  { id: 'profile',  label: 'Profile',  Icon: User },
];

const LoadingScreen = () => (
  <div className="flex flex-col h-dvh w-full bg-[#0D0D0F] items-center justify-center gap-4">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-black text-2xl font-black"
      style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}>X</div>
    <div className="w-6 h-6 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Loading…</p>
  </div>
);

export default function App() {
  const { user, profile, userStats, loading, updateStats, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [skins, setSkins]         = useState<KeyboardSkin[]>(INITIAL_SKINS);
  const [sounds, setSounds]       = useState<SoundPack[]>(INITIAL_SOUNDPACKS);
  const [missions, setMissions]   = useState<Mission[]>(INITIAL_MISSIONS);
  const [liveLeaderboard, setLiveLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [toasts, setToasts]           = useState<Array<{ id: number; text: string; type: 'success' | 'achievement' | 'reward' }>>([]);
  const [activeModal, setActiveModal] = useState<'level-up' | 'daily-reward' | 'confirm-logout' | null>(null);
  const [lastLevel, setLastLevel]     = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToLeaderboard(20, setLiveLeaderboard);
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!userStats) return;
    if (lastLevel === null) { setLastLevel(userStats.level); return; }
    if (userStats.level > lastLevel) {
      setLastLevel(userStats.level);
      playLevelUpSound();
      setActiveModal('level-up');
    }
  }, [userStats?.level]);

  const triggerToast = (text: string, type: 'success' | 'achievement' | 'reward') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  const claimDailyReward = () => {
    playSuccessSound();
    setActiveModal(null);
    if (!userStats) return;
    updateStats({ ...userStats, coins: userStats.coins + 300, xp: Math.min(userStats.xpNeeded - 1, userStats.xp + 200) });
    triggerToast('Daily Reward Claimed: +300 Coins & +200 XP! 🎁', 'reward');
  };

  const mappedLeaderboard: LeaderboardUser[] = liveLeaderboard.map((e, i) => ({
    rank: i + 1, name: e.username ?? `User${e.uid.slice(0, 4)}`,
    xp: e.xp, wpm: e.avgWpm, accuracy: e.avgAccuracy,
    avatarBg: 'bg-orange-500', avatarUrl: e.photoURL ?? undefined,
    isCurrentUser: e.uid === user?.uid,
  }));

  if (loading) return <LoadingScreen />;
  if (!user || !userStats) return <OnboardingScreen />;

  return (
    <div className="flex flex-col h-dvh w-full bg-[#0D0D0F] text-gray-200 font-sans overflow-hidden">

      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-[#0D0D0F]/95 backdrop-blur border-b border-orange-500/10 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-base"
            style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}>X</div>
          <div>
            <p className="text-sm font-black text-white tracking-widest uppercase leading-none">TYPER <span className="text-orange-500">X</span></p>
            <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest leading-tight mt-0.5">{profile?.username ?? 'Gamified Keyboard'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <Coins className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-black text-gray-200 font-mono">{userStats.coins.toLocaleString()}</span>
          </div>
          <button onClick={() => setActiveModal('daily-reward')}
            className="relative w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
            <Bell className="w-4 h-4 text-gray-400" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {activeTab === 'home' && <DashboardTab userStats={userStats} missions={missions} onNavigate={t => setActiveTab(t as NavTab)} />}
              {activeTab === 'missions' && <MissionsTab missions={missions} setMissions={setMissions} userStats={userStats} setUserStats={next => updateStats(next)} triggerToast={triggerToast} />}
              {activeTab === 'shop' && <ShopTab skins={skins} setSkins={setSkins} sounds={sounds} setSounds={setSounds} userStats={userStats} setUserStats={next => updateStats(next)} triggerToast={triggerToast} />}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <LeaderboardTab leaderboard={mappedLeaderboard.length ? mappedLeaderboard : INITIAL_LEADERBOARD} userXp={userStats.xp} userWpm={userStats.avgWpm} userAccuracy={userStats.avgAccuracy} onStartDuel={() => triggerToast('Arena Duel coming in Chat 5! 🏎️', 'success')} />
                  <StatsTab userStats={userStats} />
                </div>
              )}
              {activeTab === 'profile' && (
                <>
                  <ProfileTab userStats={userStats} badges={INITIAL_BADGES} />
                  <button onClick={() => setActiveModal('confirm-logout')} className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/8 text-xs font-bold text-gray-500 cursor-pointer active:bg-white/4 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="flex-shrink-0 flex items-center justify-around px-1 pt-2 bg-[#0D0D0F]/95 backdrop-blur border-t border-white/5"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {NAV_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)} className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 cursor-pointer">
              {isActive && <motion.div layoutId="nav-bar" className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #FF7A00, #FBBF24)' }} transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <motion.div animate={{ scale: isActive ? 1.1 : 1 }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-orange-500/15' : ''}`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-orange-400' : 'text-gray-600'}`} />
              </motion.div>
              <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-orange-400' : 'text-gray-600'}`}>{label.toUpperCase()}</span>
            </button>
          );
        })}
      </nav>

      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 max-w-[280px] pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#121417]/95 border border-neutral-800 border-l-2 border-l-orange-500 rounded-xl shadow-2xl pointer-events-auto backdrop-blur">
              <p className="text-xs font-bold text-gray-200 flex-1">{toast.text}</p>
              <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))} className="text-gray-600 cursor-pointer"><X className="w-3 h-3" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
            onClick={e => { if (e.target === e.currentTarget) setActiveModal(null); }}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="bg-[#121417] border border-orange-500/20 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 cursor-pointer"><X className="w-5 h-5" /></button>

              {activeModal === 'level-up' && (<>
                <div><p className="text-[10px] text-orange-500 font-mono tracking-widest uppercase">✦ Level Ascension ✦</p><h2 className="text-2xl font-black text-white mt-1">LEVEL UP! 🥇</h2></div>
                <div className="relative mx-auto w-24 h-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, #FF7A00, #FF5000, #FBBF24, #FF7A00)' }} />
                  <div className="absolute inset-1 rounded-full bg-[#121417] flex flex-col items-center justify-center">
                    <span className="text-[8px] text-gray-500 uppercase font-mono">LV</span>
                    <span className="text-4xl font-black text-white leading-none">{userStats.level}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">You reached <b className="text-white">Level {userStats.level}</b>. Keep typing to level up faster!</p>
                <button onClick={() => { playSuccessSound(); setActiveModal(null); }} className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}>Awesome! 🔥</button>
              </>)}

              {activeModal === 'daily-reward' && (<>
                <div><p className="text-[10px] text-orange-500 font-mono tracking-widest uppercase">Daily Loyalty Drop</p><h2 className="text-2xl font-black text-white mt-1">DAILY REWARD</h2></div>
                <div className="text-5xl animate-bounce py-2">🎁</div>
                <div className="bg-[#1A1D22] p-3 rounded-xl border border-neutral-800 flex justify-around">
                  <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">Coins</p><p className="text-sm font-black text-orange-400">+300</p></div>
                  <div className="w-px bg-neutral-800" />
                  <div className="text-center"><p className="text-[9px] text-gray-500 font-mono uppercase">XP</p><p className="text-sm font-black text-orange-400">+200</p></div>
                </div>
                <button onClick={claimDailyReward} className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5000)' }}>Claim Reward</button>
              </>)}

              {activeModal === 'confirm-logout' && (<>
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto"><LogOut className="w-5 h-5 text-red-400" /></div>
                <div><h2 className="text-lg font-black text-white">Sign Out?</h2><p className="text-xs text-gray-500 mt-1">Your progress is saved. Sign back in anytime.</p></div>
                <div className="flex gap-3">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-2xl font-bold text-sm text-gray-400 border border-white/8 cursor-pointer">Cancel</button>
                  <button onClick={() => { logout(); setActiveModal(null); }} className="flex-1 py-3 rounded-2xl font-black text-sm text-white bg-red-500/20 border border-red-500/30 cursor-pointer">Sign Out</button>
                </div>
              </>)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
