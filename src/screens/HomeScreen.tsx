import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Flame, Zap, Target, ChevronRight, ArrowUpRight,
  Keyboard, Trophy, Star
} from 'lucide-react';
import { UserStats, Mission } from '../types';
import { getLevelTitle, getTitleColor, getTitleBg, xpForLevel } from '../hooks/useXP';
import { XPBar } from '../components/XPBar';

interface HomeScreenProps {
  userStats: UserStats;
  missions: Mission[];
  onNavigate: (tab: string) => void;
}

/* ── tiny sparkline data ── */
const sparkPoints = [42, 55, 48, 70, 65, 80, 76];
const toPath = (pts: number[], w: number, h: number) => {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const norm = pts.map(p => 1 - (p - min) / (max - min || 1));
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  return norm
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${xs[i].toFixed(1)} ${(y * h).toFixed(1)}`)
    .join(' ');
};

const Sparkline: React.FC<{ color: string }> = ({ color }) => {
  const W = 72; const H = 28;
  const d = toPath(sparkPoints, W, H);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <path d={d} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill={color} fillOpacity="0.08" />
    </svg>
  );
};

/* ── stat card ── */
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta: string;
  positive?: boolean;
  color: string;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, unit, delta, positive = true, color }) => (
  <div className="bg-[#14161A] rounded-2xl p-4 border border-white/5 flex flex-col justify-between gap-3">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        <ArrowUpRight className="w-3 h-3" />{delta}
      </span>
    </div>
    <div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black text-white">{value}</span>
        {unit && <span className="text-xs text-gray-500 mb-0.5">{unit}</span>}
      </div>
      <Sparkline color={color} />
    </div>
  </div>
);

/* ── mission row ── */
const MissionRow: React.FC<{ mission: Mission }> = ({ mission }) => {
  const pct = Math.min(100, Math.round((mission.currentValue / mission.targetValue) * 100));
  const done = pct >= 100;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
        done
          ? 'bg-cyan-500/8 border-cyan-500/20'
          : 'bg-[#14161A] border-white/5'
      }`}
    >
      {/* Icon circle */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-cyan-500/20' : 'bg-white/5'
      }`}>
        {done ? (
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Target className="w-4 h-4 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold truncate ${done ? 'text-cyan-300' : 'text-gray-200'}`}>
          {mission.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${done ? 'bg-cyan-500' : 'bg-violet-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[9px] font-mono text-gray-500 whitespace-nowrap">
            {mission.currentValue.toLocaleString()} / {mission.targetValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="text-[10px] font-black text-cyan-400">+{mission.xpReward} XP</span>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   HOME SCREEN
══════════════════════════════════════════ */
export const HomeScreen: React.FC<HomeScreenProps> = ({ userStats, missions, onNavigate }) => {
  const { level, xp, xpNeeded, streak, avgWpm, avgAccuracy, totalWords, dailyGoalXp, dailyGoalTarget, username } = userStats;

  const title = getLevelTitle(level);
  const titleColor = getTitleColor(title);
  const titleBg = getTitleBg(title);
  const xpPct = Math.min(100, Math.round((xp / xpNeeded) * 100));
  const dailyPct = Math.min(100, Math.round((dailyGoalXp / dailyGoalTarget) * 100));

  const dailyMissions = useMemo(() => missions.filter(m => m.type === 'daily').slice(0, 3), [missions]);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none">

      {/* ── Top status bar ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-black text-base">
              {username.charAt(0).toUpperCase()}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0D0D0F]" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Welcome back</p>
            <p className="text-sm font-black text-white leading-tight">{username}</p>
          </div>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
          <span className="text-sm">💎</span>
          <span className="text-xs font-black text-violet-300 font-mono">{userStats.gems.toLocaleString()}</span>
        </div>
      </div>

      {/* ── Level card ── */}
      <div className="mx-4 mt-1 p-4 rounded-2xl bg-[#14161A] border border-white/6 space-y-3">
        <div className="flex items-center justify-between">
          {/* Circular level indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" className="fill-none stroke-white/6" strokeWidth="3" />
                <circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke="url(#xpGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - xpPct / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[8px] text-gray-500 font-mono uppercase">LV</span>
                <span className="text-xl font-black text-white leading-none">{level}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-black text-white">Level {level}</h3>
                <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold border ${titleBg} ${titleColor}`}>
                  {title}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP · {xpPct}%
              </p>
            </div>
          </div>

          {/* Streak badge */}
          <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-500/50" />
            <span className="text-lg font-black text-amber-400 leading-tight">{streak}</span>
            <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-wider">Days</span>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-1.5">
          <XPBar xp={xp} xpNeeded={xpNeeded} level={level} />
          <div className="flex justify-between">
            <span className="text-[9px] text-gray-600 font-mono">XP Progress</span>
            <span className="text-[9px] text-cyan-500/80 font-mono font-bold">{xpPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Today's Performance ── */}
      <div className="mx-4 mt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Performance</h4>
          <button className="text-[9px] text-cyan-500 font-bold flex items-center gap-0.5" onClick={() => onNavigate('stats')}>
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Words" value={totalWords.toLocaleString()} delta="+12%" color="#06B6D4" />
          <StatCard label="Accuracy" value={avgAccuracy} unit="%" delta="+5%" color="#7C3AED" />
          <StatCard label="WPM" value={avgWpm} delta="+8%" color="#F59E0B" />
        </div>
      </div>

      {/* ── Daily Goal ── */}
      <div className="mx-4 mt-3 p-4 rounded-2xl bg-[#14161A] border border-white/5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black text-gray-200">Daily Goal</span>
          </div>
          <span className="text-xs font-black text-cyan-400 font-mono">
            {dailyGoalXp.toLocaleString()} / {dailyGoalTarget.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06B6D4, #7C3AED)' }}
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-gray-600 font-mono">{dailyPct}% complete</span>
          <span className="text-[9px] text-gray-600 font-mono">
            {(dailyGoalTarget - dailyGoalXp).toLocaleString()} XP to go
          </span>
        </div>
      </div>

      {/* ── Daily Missions ── */}
      <div className="mx-4 mt-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Missions</h4>
          <button className="text-[9px] text-cyan-500 font-bold flex items-center gap-0.5" onClick={() => onNavigate('missions')}>
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {dailyMissions.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <MissionRow mission={m} />
            </motion.div>
          ))}
        </div>

        {/* Quick action CTAs */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => onNavigate('leaderboard')}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#14161A] border border-white/5 text-xs font-bold text-gray-300 active:scale-95 transition-transform cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Rankings
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 text-xs font-bold text-violet-300 active:scale-95 transition-transform cursor-pointer"
          >
            <Star className="w-4 h-4 text-violet-400" /> Shop
          </button>
        </div>
      </div>
    </div>
  );
};
