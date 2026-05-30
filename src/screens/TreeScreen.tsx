import React from 'react';
import { GitBranch, Lock } from 'lucide-react';
import { UserStats } from '../types';
import { getLevelTitle, getTitleColor } from '../hooks/useXP';

interface TreeScreenProps { userStats: UserStats; }

const MILESTONES = [
  { level: 1,  label: 'Glyph Apprentice', unlocks: 'Basic XP tracking',          color: '#94A3B8' },
  { level: 10, label: 'Key Carver',        unlocks: 'Daily Missions unlock',      color: '#38BDF8' },
  { level: 20, label: 'Word Forger',       unlocks: 'Shop & Themes unlock',       color: '#34D399' },
  { level: 30, label: 'Cipher Knight',     unlocks: 'Leaderboard rank badge',     color: '#818CF8' },
  { level: 40, label: 'Glyph Master',      unlocks: 'Pro Pass benefits',          color: '#C084FC' },
  { level: 50, label: 'Eternal Scribe',    unlocks: '★ Prestige title + effects', color: '#FBBF24' },
];

export const TreeScreen: React.FC<TreeScreenProps> = ({ userStats }) => {
  const { level } = userStats;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-black text-white">Progression Tree</h2>
      </div>

      <p className="text-xs text-gray-500 mb-5 leading-relaxed">
        Type your way through every rank. Each milestone unlocks new features across the whole app.
      </p>

      <div className="relative">
        {/* Vertical spine */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/8" />

        <div className="space-y-5">
          {MILESTONES.map((m, i) => {
            const reached = level >= m.level;
            const current = level >= m.level && (i === MILESTONES.length - 1 || level < MILESTONES[i + 1].level);
            return (
              <div key={m.level} className="relative flex items-start gap-4 pl-10">
                {/* Node */}
                <div
                  className={`absolute left-3 top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 ${
                    reached
                      ? 'border-transparent'
                      : 'border-white/15 bg-[#0D0D0F]'
                  }`}
                  style={reached ? { background: m.color, boxShadow: `0 0 10px ${m.color}55` } : {}}
                >
                  {!reached && <div className="w-1.5 h-1.5 rounded-full bg-white/15" />}
                </div>

                <div
                  className={`flex-1 p-3.5 rounded-2xl border transition-colors ${
                    current
                      ? 'border-cyan-500/25 bg-cyan-500/8'
                      : reached
                      ? 'border-white/8 bg-[#14161A]'
                      : 'border-white/5 bg-[#14161A]/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black" style={{ color: reached ? m.color : '#6B7280' }}>
                        {m.label}
                      </p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">Level {m.level}</p>
                    </div>
                    {!reached && <Lock className="w-3.5 h-3.5 text-gray-600" />}
                    {current && (
                      <span className="text-[8px] px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-lg font-bold border border-cyan-500/20">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">{m.unlocks}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="mt-6 p-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 text-center">
        <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Skill Branches</p>
        <p className="text-xs text-gray-500 mt-1">Speed, Accuracy & Endurance trees — coming in a future chat.</p>
      </div>
    </div>
  );
};
