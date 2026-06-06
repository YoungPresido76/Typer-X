import React, { useState } from 'react';
import { Mission, UserStats } from '../types';
import {
  Trophy, Calendar, CheckCircle, Zap,
  Keyboard, Lock, Clock, Star, Coins,
} from 'lucide-react';

interface MissionsTabProps {
  missions:  Mission[];
  userStats: UserStats;
  onClaim:   (id: string, xp: number, coins: number) => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({ missions, userStats, onClaim }) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const filtered = missions.filter(m =>
    activeSubTab === 'daily'        ? m.type === 'daily'
    : activeSubTab === 'weekly'     ? m.type === 'weekly'
    :                                 m.type === 'achievement'
  );

  const hasAnyProgress = filtered.some(m => m.currentValue > 0);
  const pendingClaim   = filtered.filter(m => m.completed && !m.claimed).length;

  return (
    <div className="space-y-6">

      {/* Sub-tab switcher — exact chat4 style */}
      <div className="flex bg-[#121417] p-1 rounded-xl border border-neutral-800 max-w-md mx-auto">
        {([
          { id: 'daily',        label: 'Daily Tasks' },
          { id: 'weekly',       label: 'Weekly League' },
          { id: 'achievements', label: 'Achievements' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
              activeSubTab === t.id
                ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
                : 'text-gray-400'
            }`}
          >
            {t.label}
            {activeSubTab === t.id && pendingClaim > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-black text-[8px] font-black flex items-center justify-center">
                {pendingClaim}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reset info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#121417] rounded-xl border border-neutral-800 max-w-md mx-auto">
        <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
        <p className="text-[10px] text-gray-600 font-mono">
          {activeSubTab === 'daily'
            ? `Resets at midnight · ${filtered.filter(m => !m.claimed).length} remaining`
            : activeSubTab === 'weekly'
            ? 'Resets every Monday'
            : 'Achievements never reset — permanent milestones'
          }
        </p>
      </div>

      {/* No keyboard banner */}
      {!hasAnyProgress && (
        <div className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl max-w-md mx-auto">
          <Keyboard className="w-5 h-5 text-orange-500/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-orange-400/80">Keyboard not connected yet</p>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed font-mono">
              Missions are assigned and waiting. Install the Typer X Android keyboard and progress
              will sync here automatically as you type in any app.
            </p>
          </div>
        </div>
      )}

      {/* Mission list — exact chat4 card style */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#1A1D22] p-8 rounded-2xl border border-neutral-800 border-dashed text-center">
            <Trophy className="w-8 h-8 text-orange-500/20 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">No {activeSubTab} missions yet</p>
            <p className="text-xs text-gray-600 font-mono mt-1">Check back soon</p>
          </div>
        ) : filtered.map(m => {
          const pct    = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
          const noData = m.currentValue === 0 && !m.completed;
          return (
            <div
              key={m.id}
              className={`p-5 bg-[#1A1D22] rounded-2xl border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                m.completed && !m.claimed ? 'border-orange-500/20 shadow-md shadow-orange-500/5' : ''
              } ${noData ? 'opacity-70' : ''}`}
            >
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${
                    m.claimed      ? 'bg-emerald-950/10 text-emerald-400 border-emerald-500/15'
                    : noData       ? 'bg-[#121417] text-gray-700 border-neutral-800'
                    : m.completed  ? 'bg-emerald-950/10 text-emerald-400 border-emerald-500/15'
                    :                'bg-[#121417] text-orange-400 border-neutral-800'
                  }`}>
                    {noData
                      ? <Lock className="w-4 h-4" />
                      : activeSubTab === 'daily'   ? <Calendar className="w-4 h-4" />
                      : activeSubTab === 'weekly'  ? <Zap className="w-4 h-4" />
                      :                             <Trophy className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${noData ? 'text-gray-600' : 'text-gray-200'}`}>
                      {m.title}
                    </h4>
                    {m.description && (
                      <p className="text-[11px] text-gray-500">{m.description}</p>
                    )}
                  </div>
                </div>

                {noData ? (
                  <p className="text-[10px] text-gray-700 font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Waiting for keyboard data
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          m.claimed || m.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 w-16 text-right">
                      {m.currentValue.toLocaleString()} / {m.targetValue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Reward + CTA — exact chat4 layout */}
              <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 shrink-0 md:min-w-[124px]">
                <div className="text-left md:text-center">
                  <span className="text-[9px] text-gray-500 font-mono font-bold block uppercase leading-none">
                    REWARD POOL
                  </span>
                  <span className="text-[11px] font-black text-orange-400 mt-1 block flex items-center gap-1">
                    <Star className="w-3 h-3 inline" /> +{m.xpReward} XP
                    <Coins className="w-3 h-3 inline ml-1" /> +{m.coinReward}
                  </span>
                </div>

                {m.claimed ? (
                  <button disabled className="w-full md:w-28 py-2.5 rounded-xl bg-neutral-900 text-neutral-600 border border-neutral-800 text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> CLAIMED
                  </button>
                ) : m.completed ? (
                  <button
                    onClick={() => onClaim(m.id, m.xpReward, m.coinReward)}
                    className="w-full md:w-28 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5000] text-black text-xs font-black tracking-widest uppercase active:scale-95 transition-all shadow-lg shadow-orange-600/20 animate-pulse cursor-pointer"
                  >
                    CLAIM XP
                  </button>
                ) : (
                  <button disabled className="w-full md:w-28 py-2.5 rounded-xl bg-neutral-900 text-neutral-600 border border-neutral-800 text-xs font-bold font-mono">
                    {noData ? 'NO DATA' : `${pct}% DONE`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
