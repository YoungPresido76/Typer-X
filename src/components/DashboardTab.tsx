import React from 'react';
import { UserStats, Mission } from '../types';
import {
  Flame, ArrowUpRight, Award, Trophy, ChevronRight,
  Keyboard, Lock, Gift, Target,
} from 'lucide-react';

interface DashboardTabProps {
  userStats: UserStats;
  missions: Mission[];
  onNavigate: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ userStats, missions, onNavigate }) => {
  const xpPercent    = Math.min(100, Math.round((userStats.xp / userStats.xpNeeded) * 100));
  const dailyPercent = Math.min(100, Math.round((userStats.dailyGoalProgress / userStats.dailyGoalTarget) * 100));
  const activeMissions = missions.filter(m => m.type === 'daily').slice(0, 3);
  const hasData = userStats.totalWords > 0;

  return (
    <div className="space-y-6">

      {/* 1. Level + Streak */}
      <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border-2 border-orange-500/10">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-neutral-800 fill-none" strokeWidth="3.5" />
              <circle cx="32" cy="32" r="28" className="stroke-orange-500 fill-none transition-all duration-300"
                strokeWidth="3.5" strokeDasharray="175.92"
                strokeDashoffset={175.92 - (175.92 * xpPercent) / 100} />
            </svg>
            <div className="text-center">
              <span className="text-[10px] uppercase text-gray-500 block leading-tight">LV</span>
              <span className="text-lg font-black text-white leading-normal">{userStats.level}</span>
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white flex items-center gap-1.5 leading-tight">
              Level {userStats.level} Pilot{' '}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono">
                ELITE TYPIST
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              XP: {userStats.xp.toLocaleString()} / {userStats.xpNeeded.toLocaleString()} ({xpPercent}%)
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto p-3.5 bg-gradient-to-r from-orange-500/15 to-orange-500/5 rounded-xl border border-orange-500/15 flex items-center justify-between md:justify-around gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#121417] rounded-xl flex items-center justify-center border border-orange-500/20 text-orange-400">
              <Flame className="w-5 h-5 fill-orange-500 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black text-white tracking-wide block">DAY STREAK BOOST</span>
              <p className="text-[10px] text-orange-400/80 font-mono">Maintain streak to lock multipliers</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[20px] font-black text-orange-500 block leading-none">{userStats.streak}</span>
            <span className="text-[8px] text-gray-500 font-mono font-bold">DAYS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. Today's Performance */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Today's Performance Overview
        </h3>

        {!hasData ? (
          <div className="bg-[#1A1D22] p-6 rounded-2xl border border-neutral-800 border-dashed text-center">
            <Keyboard className="w-8 h-8 text-orange-500/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-400">No typing data yet</p>
            <p className="text-xs text-gray-600 font-mono mt-1 max-w-xs mx-auto leading-relaxed">
              Install the Typer X keyboard to start tracking words, WPM and accuracy across all your apps.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1A1D22] p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[11px] font-mono uppercase tracking-wide">WORDS TYPED</span>
                <span className="text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +12%
                </span>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-black text-white">{userStats.totalWords.toLocaleString()}</h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Cumulative logs</p>
              </div>
            </div>

            <div className="bg-[#1A1D22] p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[11px] font-mono uppercase tracking-wide">SPEED AVG (WPM)</span>
                <span className="text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +5%
                </span>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-black text-white">
                  {userStats.avgWpm} <span className="text-xs text-neutral-500">WPM</span>
                </h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Relative to last 100 sessions</p>
              </div>
            </div>

            <div className="bg-[#1A1D22] p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[11px] font-mono uppercase tracking-wide">ACCURACY VALUE</span>
                <span className="text-amber-500 text-[10px] font-mono font-bold flex items-center gap-0.5">
                  <Target className="w-3 h-3" /> Optimal
                </span>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-black text-white">{userStats.avgAccuracy}%</h2>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Excludes backspaces</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Daily Goal + Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Goal */}
        <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-500" /> Daily Goal Progress
              </span>
              <span className="text-xs font-bold text-orange-400 font-mono">
                {userStats.dailyGoalProgress} / {userStats.dailyGoalTarget} XP
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mb-4 font-mono">
              {hasData ? 'Keep typing to reach your daily goal.' : 'Start typing to begin filling your daily goal.'}
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-full h-2.5 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg transition-all duration-300"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-gray-500">
              <span>{dailyPercent}% Complete</span>
              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-orange-400" />
                Reward: <span className="text-orange-400 ml-1">+300 XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Daily Missions preview */}
        <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-orange-500" />
              Daily Missions ({missions.filter(m => m.type === 'daily' && m.completed).length}/{activeMissions.length})
            </h3>
            <span
              onClick={() => onNavigate('missions')}
              className="text-[10px] text-orange-400 cursor-pointer font-bold flex items-center"
            >
              All Goals <ChevronRight className="w-3.5 h-3.5 inline ml-0.5" />
            </span>
          </div>

          <div className="space-y-3">
            {activeMissions.length === 0 ? (
              <p className="text-xs text-gray-600 font-mono text-center py-4">Loading missions…</p>
            ) : activeMissions.map(m => {
              const pct    = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
              const noData = m.currentValue === 0 && !m.completed;
              return (
                <div key={m.id} className="p-3 bg-[#121417] rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold block truncate ${noData ? 'text-gray-600' : 'text-gray-200'}`}>
                      {m.title}
                    </span>
                    {noData ? (
                      <p className="text-[9px] text-gray-700 font-mono mt-1 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Waiting for keyboard
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-neutral-900 rounded overflow-hidden">
                          <div
                            className={`h-full rounded transition-all ${m.completed ? 'bg-emerald-500' : 'bg-orange-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 w-12 text-right">
                          {m.currentValue}/{m.targetValue}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    {m.completed
                      ? <span className="text-[9px] px-2 py-1 rounded-md bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 font-bold font-mono">DONE</span>
                      : <span className="text-[9px] px-2 py-1 rounded-md bg-orange-950/10 text-orange-400/80 border border-orange-500/10 font-bold font-mono">+{m.xpReward}XP</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
