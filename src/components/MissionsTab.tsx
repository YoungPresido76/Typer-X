import React, { useState } from 'react';
import { Mission, UserStats } from '../types';
import { playSuccessSound } from '../audio';
import { Calendar, Zap, Trophy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionsTabProps {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  triggerToast: (msg: string, type: 'success' | 'achievement' | 'reward') => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({ missions, setMissions, userStats, setUserStats, triggerToast }) => {
  const [tab, setTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const filtered = missions.filter(m =>
    tab === 'daily' ? m.type === 'daily' : tab === 'weekly' ? m.type === 'weekly' : m.type === 'achievement'
  );

  const handleClaim = (id: string, xpReward: number, coinReward: number) => {
    playSuccessSound();
    setMissions(prev => prev.map(m => m.id === id ? { ...m, claimed: true } : m));
    setUserStats(prev => {
      let xp = prev.xp + xpReward;
      let level = prev.level;
      if (xp >= prev.xpNeeded) { xp -= prev.xpNeeded; level += 1; }
      return { ...prev, xp, level, coins: prev.coins + coinReward };
    });
    triggerToast(`Claimed +${xpReward} XP & +${coinReward} Coins! 💰`, 'reward');
  };

  const TABS = [
    { id: 'daily' as const,        label: 'Daily',        Icon: Calendar },
    { id: 'weekly' as const,       label: 'Weekly',       Icon: Zap },
    { id: 'achievements' as const, label: 'Achievements', Icon: Trophy },
  ];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white">Missions</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Complete tasks to earn XP & Coins</p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex bg-[#0F1116] p-1 rounded-xl border border-[#2D3037]">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === id
                ? 'bg-[#1A1D22] text-[#FF7A1A] border border-[#FF7A1A]/15 shadow-e1'
                : 'text-[#6B7280]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mission cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {filtered.map((m, i) => {
            const pct = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
            const done = pct >= 100;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-2xl border transition-colors ${
                  done && !m.claimed
                    ? 'bg-[#1A1D22] border-[#FF7A1A]/25 shadow-glow'
                    : m.claimed
                    ? 'bg-[#1A1D22] border-[#22C55E]/20'
                    : 'bg-[#1A1D22] border-[#2D3037]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.claimed ? 'bg-[#22C55E]/15 border border-[#22C55E]/20' :
                    done      ? 'bg-[#FF7A1A]/15 border border-[#FF7A1A]/20' :
                                'bg-[#0F1116] border border-[#2D3037]'
                  }`}>
                    {m.claimed
                      ? <CheckCircle size={18} className="text-[#22C55E]" />
                      : tab === 'daily'   ? <Calendar size={16} className={done ? 'text-[#FF7A1A]' : 'text-[#6B7280]'} />
                      : tab === 'weekly'  ? <Zap size={16} className={done ? 'text-[#FF7A1A]' : 'text-[#6B7280]'} />
                      :                    <Trophy size={16} className={done ? 'text-[#FF7A1A]' : 'text-[#6B7280]'} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-[#F5F5F5] leading-snug">{m.title}</h4>
                        {m.description && <p className="text-[11px] text-[#6B7280] mt-0.5">{m.description}</p>}
                      </div>
                      <span className="text-[10px] font-black text-[#FF7A1A] font-mono whitespace-nowrap">+{m.xpReward} XP</span>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex-1 h-2 bg-[#0F1116] rounded-full overflow-hidden border border-[#2D3037]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            m.claimed ? 'bg-[#22C55E]' : done ? 'bg-gradient-to-r from-[#FF7A1A] to-[#F59E0B]' : 'bg-gradient-to-r from-[#FF7A1A] to-[#FF8347]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#6B7280] w-20 text-right whitespace-nowrap">
                        {m.currentValue.toLocaleString()} / {m.targetValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Claim button */}
                    <div className="mt-3">
                      {m.claimed ? (
                        <span className="text-[10px] px-3 py-1.5 rounded-lg bg-[#22C55E]/8 text-[#22C55E] border border-[#22C55E]/15 font-bold font-mono">
                          ✓ CLAIMED
                        </span>
                      ) : done ? (
                        <button
                          onClick={() => handleClaim(m.id, m.xpReward, m.coinReward)}
                          className="px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-all shadow-glow"
                          style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}
                        >
                          Claim XP
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#6B7280] font-mono">{pct}% complete</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="tx-card text-center py-10">
              <Trophy size={32} className="mx-auto text-[#2D3037] mb-3" />
              <p className="text-sm font-semibold text-[#9CA3AF]">No {tab} missions yet</p>
              <p className="text-xs text-[#6B7280] mt-1">Check back soon!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
