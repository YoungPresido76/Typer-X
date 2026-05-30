import React, { useState } from 'react';
import { Mission, UserStats } from '../types';
import { playSuccessSound } from '../audio';
import { Trophy, Calendar, Sparkles, CheckCircle, Zap, ShieldCheck, Award } from 'lucide-react';

interface MissionsTabProps {
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  triggerToast: (msg: string, type: 'success' | 'achievement' | 'reward') => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  missions,
  setMissions,
  userStats,
  setUserStats,
  triggerToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const filteredMissions = missions.filter(m => {
    if (activeSubTab === 'daily') return m.type === 'daily';
    if (activeSubTab === 'weekly') return m.type === 'weekly';
    return m.type === 'achievement';
  });

  const handleClaimReward = (mId: string, xpReward: number, coinReward: number) => {
    playSuccessSound();
    
    // 1. Mark as claimed
    setMissions(prev => prev.map(m => {
      if (m.id === mId) {
        return { ...m, claimed: true };
      }
      return m;
    }));

    // 2. Add rewards to stats
    setUserStats(prev => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let newCoins = prev.coins + coinReward;
      let levelUp = false;

      if (newXp >= prev.xpNeeded) {
        newXp -= prev.xpNeeded;
        newLevel += 1;
        levelUp = true;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        coins: newCoins,
      };
    });

    triggerToast(`Claimed reward: +${xpReward} XP & +${coinReward} Coins! 💰`, 'reward');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab select buttons */}
      <div className="flex bg-[#121417] p-1 rounded-xl border border-neutral-850 max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'daily'
              ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Daily Tasks
        </button>
        <button
          onClick={() => setActiveSubTab('weekly')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'weekly'
              ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Weekly League
        </button>
        <button
          onClick={() => setActiveSubTab('achievements')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'achievements'
              ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Grid or list of tasks */}
      <div className="space-y-4">
        {filteredMissions.map((m) => {
          const taskPercent = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
          return (
            <div 
              key={m.id} 
              className={`p-5 bg-[#1A1D22] rounded-2xl border border-neutral-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-[#20242B] ${
                m.completed && !m.claimed ? 'border-orange-500/20 shadow-md shadow-orange-500/5' : ''
              }`}
            >
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl border ${
                    m.completed 
                      ? 'bg-emerald-950/10 text-emerald-400 border-emerald-500/15' 
                      : 'bg-[#121417] text-orange-400 border-neutral-800'
                  }`}>
                    {activeSubTab === 'daily' ? <Calendar className="w-4 h-4" /> : activeSubTab === 'weekly' ? <Zap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">{m.title}</h4>
                    <p className="text-[11px] text-gray-500">{m.description}</p>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        m.completed ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'
                      }`}
                      style={{ width: `${taskPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 w-16 text-right">
                    {m.currentValue.toLocaleString()} / {m.targetValue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action cell: Claim or Info */}
              <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 shrink-0 md:min-w-[124px]">
                <div className="text-left md:text-center">
                  <span className="text-[9px] text-gray-500 font-mono font-bold block uppercase leading-none">REWARD POOL</span>
                  <span className="text-[11px] font-black text-orange-400 mt-1 block">+{m.xpReward} XP & +{m.coinReward} 🪙</span>
                </div>

                {m.claimed ? (
                  <button disabled className="w-full md:w-28 py-2.5 rounded-xl bg-neutral-900 text-neutral-600 border border-neutral-850 text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-1">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600" /> CLAIMED
                  </button>
                ) : m.completed ? (
                  <button 
                    onClick={() => handleClaimReward(m.id, m.xpReward, m.coinReward)}
                    className="w-full md:w-28 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5000] text-black text-xs font-black tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-600/30 animate-pulse cursor-pointer"
                  >
                    CLAIM XP
                  </button>
                ) : (
                  <button disabled className="w-full md:w-28 py-2.5 rounded-xl bg-neutral-900 text-neutral-600 border border-neutral-850 text-xs font-bold font-mono">
                    {taskPercent}% LOCKED
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
