import React from 'react';
import { UserStats, Badge } from '../types';
import { Award, Zap, Target, Flame, AlertCircle, Compass, Sparkles } from 'lucide-react';

interface ProfileTabProps {
  userStats: UserStats;
  badges: Badge[];
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ userStats, badges }) => {
  const xpPercent = Math.min(100, Math.round((userStats.xp / userStats.xpNeeded) * 100));

  return (
    <div className="space-y-6">
      
      {/* 1. Core Profile Pilot Header */}
      <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850 flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar block with glowing background */}
        <div className="relative">
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 p-[3px] shadow-lg shadow-orange-500/20">
            <div className="w-full h-full rounded-full bg-[#121417] flex items-center justify-center font-black text-2xl text-orange-400">
              TX
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1A1D22] animate-pulse" />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <h3 className="text-base font-black text-white tracking-widest flex justify-center sm:justify-start items-center gap-2">
            TyperX (You) <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-600/10 text-orange-400 border border-orange-500/20 font-mono font-bold">LEGENDARY TYPIST</span>
          </h3>
          <p className="text-xs text-gray-400 font-mono">Profile Level {userStats.level} • Streak Multiply index: 1.5x</p>
          
          <div className="w-full max-w-sm mt-3 space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>XP OVERALL PROGRESS ({xpPercent}%)</span>
              <span>{userStats.xp.toLocaleString()} / {userStats.xpNeeded.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cumulative lifetime metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP farming', value: (96540 + userStats.xp).toLocaleString(), desc: 'Cumulative milestones' },
          { label: 'Words registered', value: userStats.totalWords.toLocaleString(), desc: 'Across all grids' },
          { label: 'Letters typed', value: userStats.totalKeys.toLocaleString(), desc: 'Key hits logged' },
          { label: 'Highest Streak', value: `${userStats.highestStreak} Days`, desc: 'Unbroken activity' }
        ].map((item, i) => (
          <div key={i} className="bg-[#1A1D22] p-4 rounded-xl border border-neutral-850 text-center sm:text-left">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">{item.label}</span>
            <h3 className="text-xl font-black text-white mt-1 leading-snug">{item.value}</h3>
            <p className="text-[9px] text-gray-500 font-mono mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Badges Grid */}
      <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-orange-500" /> Achievement Badge Inventory
          </h3>
          <span className="text-[10px] text-gray-500 font-mono font-bold">
            {badges.filter(b => b.unlocked).length} / {badges.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl text-center flex flex-col justify-between border relative overflow-hidden transition-all duration-200 ${
                badge.unlocked 
                  ? 'bg-neutral-900/60 border-orange-500/25 hover:border-orange-500/40 shadow-sm'
                  : 'bg-neutral-950/25 border-neutral-850 text-neutral-600'
              }`}
            >
              <div className="flex flex-col items-center">
                {/* Visual token medallion item */}
                <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center font-bold text-[#0a0a0d] border select-none transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-tr from-orange-400 to-amber-500 border-orange-300 shadow-md shadow-orange-500/10'
                    : 'bg-[#121417] text-neutral-600 border-neutral-800'
                }`}>
                  {badge.name.slice(0, 2)}
                </div>
                
                <h4 className={`text-xs font-black ${badge.unlocked ? 'text-white' : 'text-neutral-500'}`}>{badge.name}</h4>
                <p className={`text-[10px] leading-snug mt-1 max-w-[140px] ${badge.unlocked ? 'text-gray-400' : 'text-neutral-600'}`}>
                  {badge.description}
                </p>
              </div>

              {/* Status footer inside badge card */}
              <div className="mt-3 pt-2 border-t border-neutral-900">
                {badge.unlocked ? (
                  <span className="text-[8px] px-2 py-0.5 bg-orange-500/15 text-orange-400 rounded font-bold font-mono tracking-wide uppercase">
                    Unlocked • {badge.unlockedAt}
                  </span>
                ) : (
                  <span className="text-[8px] text-neutral-600 font-bold font-mono uppercase">
                    Locked Block
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
