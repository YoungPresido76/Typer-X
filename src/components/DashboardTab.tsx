import React from 'react';
import { UserStats, Mission } from '../types';
import { Flame, FileText, Target, Zap, ChevronRight, Gift, Trophy, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardTabProps {
  userStats: UserStats;
  missions:  Mission[];
  onNavigate: (tab: string) => void;
}

/* ── Sparkline — shows flat line when no data ── */
const Sparkline: React.FC<{ hasData: boolean }> = ({ hasData }) => (
  <svg viewBox="0 0 120 24" className="w-full h-6" preserveAspectRatio="none">
    {hasData ? (
      <>
        <path d="M0,18 L15,15 L30,13 L45,14 L60,10 L75,8 L90,6 L105,7 L120,4"
          fill="none" stroke="#FF7A1A" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
        <path d="M0,18 L15,15 L30,13 L45,14 L60,10 L75,8 L90,6 L105,7 L120,4 L120,24 L0,24Z"
          fill="#FF7A1A" opacity="0.08" />
      </>
    ) : (
      <path d="M0,16 L120,16" stroke="#2D3037" strokeWidth="1.5" strokeDasharray="4,4" />
    )}
  </svg>
);

export const DashboardTab: React.FC<DashboardTabProps> = ({ userStats, missions, onNavigate }) => {
  const xpPct    = Math.min(100, Math.round((userStats.xp / userStats.xpNeeded) * 100));
  const dailyPct = Math.min(100, Math.round((userStats.dailyGoalProgress / userStats.dailyGoalTarget) * 100));
  const daily    = missions.filter(m => m.type === 'daily').slice(0, 3);
  const hasData  = userStats.totalWords > 0;

  return (
    <div className="space-y-4">

      {/* ── Level + Streak card ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Circular XP ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#2D3037" strokeWidth="3.5" />
                <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#FF7A1A" strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - xpPct / 100) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[8px] text-[#6B7280] font-mono uppercase">LV</span>
                <span className="text-xl font-black text-white leading-tight">{userStats.level}</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-bold text-white">Level {userStats.level}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-lg bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/15 font-mono font-bold uppercase">
                  {userStats.level < 10 ? 'Rookie' : userStats.level < 20 ? 'Elite Typist' : 'Master Typist'}
                </span>
              </div>
              <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">
                {userStats.xp.toLocaleString()} / {userStats.xpNeeded.toLocaleString()} XP · {xpPct}%
              </p>
              <div className="w-full h-1.5 bg-[#0F1116] rounded-full overflow-hidden mt-2 border border-[#2D3037]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#F59E0B]"
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
          {!hasData && (
            <span className="text-[9px] text-[#6B7280] font-mono px-2 py-0.5 bg-[#0F1116] rounded-lg border border-[#2D3037]">
              No data yet
            </span>
          )}
        </div>

        {!hasData ? (
          /* Empty shell */
          <div className="text-center py-4">
            <Keyboard size={24} className="mx-auto text-[#3A3D45] mb-2" />
            <p className="text-xs text-[#4B5563]">No typing data yet</p>
            <p className="text-[10px] text-[#3A3D45] font-mono mt-1">Install the keyboard to start tracking</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { v: userStats.totalWords.toLocaleString(), label:'Words',    Icon: FileText, c:'text-[#FF7A1A]' },
                { v: `${userStats.avgAccuracy}%`,           label:'Accuracy', Icon: Target,   c:'text-[#22C55E]' },
                { v: `${userStats.avgWpm}`,                 label:'WPM',      Icon: Zap,      c:'text-[#FF7A1A]' },
              ].map(({ v, label, Icon, c }) => (
                <div key={label} className="text-center">
                  <Icon size={16} className={`mx-auto mb-1.5 ${c}`} />
                  <div className="text-xl font-bold text-white">{v}</div>
                  <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">{label}</div>
                </div>
              ))}
            </div>
            <Sparkline hasData />
            <p className="text-[11px] text-[#22C55E] mt-2">Keep it up! You're doing great.</p>
          </>
        )}
      </div>

      {/* ── Daily Goal ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Trophy size={13} className="text-[#FF7A1A]" /> Daily Goal
          </span>
          <span className="text-xs font-bold text-[#FF7A1A] font-mono">
            {userStats.dailyGoalProgress.toLocaleString()} / {userStats.dailyGoalTarget.toLocaleString()} XP
          </span>
        </div>
        <p className="text-[10px] text-[#6B7280] font-mono mb-3">
          {dailyPct}% complete · Bonus: <span className="text-[#FF7A1A]">+300 XP</span>
        </p>
        <div className="w-full h-2.5 bg-[#0F1116] rounded-full overflow-hidden border border-[#2D3037]">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#F59E0B]"
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
        {!hasData && (
          <p className="text-[10px] text-[#4B5563] font-mono mt-2 italic">
            Start typing to fill this bar
          </p>
        )}
        <div className="flex items-center gap-2 p-3 bg-[#0F1116] rounded-xl border border-[#2D3037] mt-3">
          <Gift size={13} className="text-[#F59E0B]" />
          <span className="text-xs text-[#9CA3AF]">Next Reward:</span>
          <span className="text-xs font-semibold text-[#F59E0B]">Neon Orange Theme</span>
        </div>
      </div>

      {/* ── Daily Missions preview ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={13} className="text-[#FF7A1A]" />
            Daily Missions
          </h3>
          <button onClick={() => onNavigate('missions')}
            className="text-[10px] text-[#FF7A1A] font-bold flex items-center gap-0.5 cursor-pointer">
            View all <ChevronRight size={11} />
          </button>
        </div>

        {daily.length === 0 ? (
          <p className="text-xs text-[#4B5563] text-center py-4">Loading missions…</p>
        ) : (
          <div className="space-y-2.5">
            {daily.map(m => {
              const pct    = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
              const noData = m.currentValue === 0;
              return (
                <div key={m.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    m.claimed ? 'bg-[#22C55E]/5 border-[#22C55E]/20'
                    : pct>=100 ? 'bg-[#FF7A1A]/5 border-[#FF7A1A]/20'
                    :            'bg-[#0F1116] border-[#2D3037]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.claimed ? 'bg-[#22C55E]/15' : noData ? 'bg-[#1A1D22]' : 'bg-[#1A1D22]'
                  }`}>
                    {m.claimed
                      ? <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      : <Target size={13} className={noData ? 'text-[#3A3D45]' : 'text-[#6B7280]'} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${
                      m.claimed ? 'text-[#22C55E]' : noData ? 'text-[#4B5563]' : 'text-[#F5F5F5]'
                    }`}>{m.title}</p>
                    {noData ? (
                      <p className="text-[9px] text-[#3A3D45] font-mono mt-1">Waiting for keyboard…</p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 bg-[#2D3037] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${m.claimed ? 'bg-[#22C55E]' : 'bg-[#FF7A1A]'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[8px] text-[#6B7280] font-mono">{pct}%</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-[#FF7A1A] font-mono">+{m.xpReward}XP</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
