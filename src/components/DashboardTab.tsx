import React from 'react';
import { UserStats, Mission } from '../types';
import { Flame, FileText, Target, Zap, ChevronRight, MoreVertical, Gift, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardTabProps {
  userStats: UserStats;
  missions: Mission[];
  onNavigate: (tab: string) => void;
}

/* ── Sparkline ── */
const Sparkline = () => (
  <svg viewBox="0 0 120 24" className="w-full h-6" preserveAspectRatio="none">
    <path d="M0,18 L15,15 L30,13 L45,14 L60,10 L75,8 L90,6 L105,7 L120,4"
      fill="none" stroke="#FF7A1A" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    <path d="M0,18 L15,15 L30,13 L45,14 L60,10 L75,8 L90,6 L105,7 L120,4 L120,24 L0,24Z"
      fill="#FF7A1A" opacity="0.08" />
  </svg>
);

export const DashboardTab: React.FC<DashboardTabProps> = ({ userStats, missions, onNavigate }) => {
  const xpPct     = Math.min(100, Math.round((userStats.xp / userStats.xpNeeded) * 100));
  const dailyPct  = Math.min(100, Math.round((userStats.dailyGoalProgress / userStats.dailyGoalTarget) * 100));
  const daily     = missions.filter(m => m.type === 'daily').slice(0, 3);

  return (
    <div className="space-y-4">

      {/* ── Level + Streak Card ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between">

          {/* Circular level */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#2D3037" strokeWidth="3.5" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#FF7A1A" strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - xpPct / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] text-[#6B7280] font-mono uppercase leading-none">LV</span>
                <span className="text-lg font-black text-white leading-tight">{userStats.level}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-bold text-white leading-none">Level {userStats.level}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/15 font-mono font-bold uppercase tracking-wider">
                  Elite Typist
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                {userStats.xp.toLocaleString()} / {userStats.xpNeeded.toLocaleString()} XP · {xpPct}%
              </p>
              {/* XP progress bar */}
              <div className="w-full h-1.5 bg-[#0F1116] rounded-full overflow-hidden mt-2 border border-[#2D3037]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #FF7A1A, #FF8347)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center px-3 py-2.5 bg-[#FF7A1A]/8 border border-[#FF7A1A]/15 rounded-2xl ml-2 flex-shrink-0">
            <Flame className="w-5 h-5 text-[#FF7A1A] fill-[#FF7A1A]/50" />
            <span className="text-2xl font-black text-[#FF7A1A] leading-tight">{userStats.streak}</span>
            <span className="text-[8px] text-[#FF7A1A]/60 font-bold uppercase tracking-wider">Days</span>
          </div>
        </div>
      </div>

      {/* ── Today's Performance ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#F5F5F5]">Today's Performance</h4>
          <button className="text-[#6B7280]"><MoreVertical size={16} /></button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { value: userStats.totalWords.toLocaleString(), label: 'Words',    Icon: FileText, color: 'text-[#FF7A1A]' },
            { value: `${userStats.avgAccuracy}%`,           label: 'Accuracy', Icon: Target,   color: 'text-[#22C55E]' },
            { value: `${userStats.avgWpm}`,                 label: 'WPM',      Icon: Zap,      color: 'text-[#FF7A1A]' },
          ].map(({ value, label, Icon, color }) => (
            <div key={label} className="text-center">
              <Icon size={18} className={`mx-auto mb-1.5 ${color}`} />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">{label}</div>
            </div>
          ))}
        </div>

        <Sparkline />
        <p className="text-[11px] text-[#22C55E] mt-2">Keep it up! You're doing great.</p>
      </div>

      {/* ── Daily Goal ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Trophy size={14} className="text-[#FF7A1A]" /> Daily Goal
          </span>
          <span className="text-xs font-bold text-[#FF7A1A] font-mono">
            {userStats.dailyGoalProgress.toLocaleString()} / {userStats.dailyGoalTarget.toLocaleString()} XP
          </span>
        </div>
        <p className="text-[10px] text-[#6B7280] font-mono mb-3">{dailyPct}% complete · Reward: <span className="text-[#FF7A1A]">+300 XP Bonus</span></p>
        <div className="w-full h-2.5 bg-[#0F1116] rounded-full overflow-hidden border border-[#2D3037]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF7A1A, #F59E0B)' }}
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>

        {/* Next reward */}
        <div className="flex items-center gap-2 p-3 bg-[#0F1116] rounded-xl border border-[#2D3037] mt-3">
          <Gift size={14} className="text-[#F59E0B]" />
          <span className="text-xs text-[#9CA3AF]">Next Reward:</span>
          <span className="text-xs font-semibold text-[#F59E0B]">Neon Orange Theme</span>
        </div>
      </div>

      {/* ── Daily Missions ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={14} className="text-[#FF7A1A]" />
            Daily Missions ({missions.filter(m => m.type === 'daily' && m.completed).length}/{daily.length})
          </h3>
          <button onClick={() => onNavigate('missions')} className="text-[10px] text-[#FF7A1A] font-bold flex items-center gap-0.5 cursor-pointer">
            View all <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-2.5">
          {daily.map(m => {
            const pct = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
            return (
              <div key={m.id} className={`p-3 rounded-xl border flex items-center gap-3 ${m.completed ? 'bg-[#22C55E]/5 border-[#22C55E]/20' : 'bg-[#0F1116] border-[#2D3037]'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.completed ? 'bg-[#22C55E]/15' : 'bg-[#1A1D22]'}`}>
                  {m.completed
                    ? <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    : <Target size={14} className="text-[#6B7280]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${m.completed ? 'text-[#22C55E]' : 'text-[#F5F5F5]'}`}>{m.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-[#2D3037] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${m.completed ? 'bg-[#22C55E]' : 'bg-[#FF7A1A]'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap">{m.currentValue}/{m.targetValue}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#FF7A1A] font-mono flex-shrink-0">+{m.xpReward}XP</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
