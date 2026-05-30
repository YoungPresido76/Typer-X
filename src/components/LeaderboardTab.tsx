import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { Trophy, Award, Search, Users, Earth, Compass, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface LeaderboardTabProps {
  leaderboard: LeaderboardUser[];
  userXp: number;
  userWpm: number;
  userAccuracy: number;
  onStartDuel: () => void;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  leaderboard,
  userXp,
  userWpm,
  userAccuracy,
  onStartDuel,
}) => {
  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'friends' | 'country'>('global');

  // Insert user dynamically at rank 4 based on XP
  const fullLeaderboard: LeaderboardUser[] = [
    leaderboard[0], // PhantomType - 128K
    leaderboard[1], // SpeedDemon - 115K
    leaderboard[2], // KeyMaster - 108K
    {
      rank: 4,
      name: 'TyperX (You)',
      xp: 96540 + userXp,
      wpm: userWpm,
      accuracy: userAccuracy,
      avatarBg: 'bg-gradient-to-tr from-orange-500 to-amber-500',
      isCurrentUser: true,
    },
    ...leaderboard.slice(3), // QuickFingers, HexHammer, MacroMage
  ];

  return (
    <div className="space-y-6">
      
      {/* Social duel promotion card banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-red-500 font-bold font-mono tracking-widest uppercase">MULTIPLAYER ARENA</span>
          <h3 className="text-base font-black text-white flex items-center gap-1.5">
            Active Typist Duel is Online! <Sparkles className="w-4 h-4 text-orange-400" />
          </h3>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Challenge players like <b>SpeedDemon</b> or <b>PhantomType</b> to a raw typing duel in our smartphone console! Finish sentences without typos to grab big coin loot.
          </p>
        </div>
        
        <button 
          onClick={onStartDuel}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-red-600 hover:opacity-90 active:scale-95 transition-transform text-black text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          START DUEL IN PHONE ⚔️
        </button>
      </div>

      {/* Grid: Toggles and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 cols: Rankings list */}
        <div className="lg:col-span-2 bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-500" /> Weekly Arena Ranks
            </h3>

            {/* Subsection buttons */}
            <div className="flex bg-[#121417] p-1 rounded-lg border border-neutral-850">
              {[
                { id: 'global', label: 'Global', icon: Earth },
                { id: 'friends', label: 'Friends', icon: Users },
                { id: 'country', label: 'Country', icon: Compass },
              ].map(sub => {
                const IconComp = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setLeaderboardTab(sub.id as any)}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                      leaderboardTab === sub.id
                        ? 'bg-[#1A1D22] text-orange-400 border border-orange-500/10'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table List of players */}
          <div className="space-y-2">
            
            {/* Table headers */}
            <div className="grid grid-cols-12 px-4 py-1.5 text-[9px] text-gray-500 font-mono font-bold tracking-wider border-b border-neutral-800">
              <div className="col-span-1">RANK</div>
              <div className="col-span-5">TYPIST</div>
              <div className="col-span-2 text-right">SPEED</div>
              <div className="col-span-2 text-right">ACCURACY</div>
              <div className="col-span-2 text-right">TOTAL XP</div>
            </div>

            {fullLeaderboard.map((player) => (
              <div 
                key={player.rank} 
                className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl border font-sans hover:bg-[#20242B] transition-colors ${
                  player.isCurrentUser 
                    ? 'bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/30' 
                    : 'bg-[#121417] border-neutral-850'
                }`}
              >
                {/* Seed placement */}
                <div className="col-span-1 text-xs font-black font-mono">
                  {player.rank === 1 ? (
                    <span className="text-yellow-500">🥇</span>
                  ) : player.rank === 2 ? (
                    <span className="text-gray-400">🥈</span>
                  ) : player.rank === 3 ? (
                    <span className="text-amber-600">🥉</span>
                  ) : (
                    <span className="text-gray-400">{player.rank}</span>
                  )}
                </div>

                {/* Typography avatar + name */}
                <div className="col-span-5 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] text-[#0a0a0d] shadow-sm uppercase ${player.avatarBg}`}>
                    {player.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${player.isCurrentUser ? 'text-orange-400' : 'text-gray-200'}`}>
                      {player.name}
                    </span>
                    {player.isCurrentUser && (
                      <span className="block text-[8px] text-orange-500/80 font-mono tracking-wide">PREMIUM PILOT</span>
                    )}
                  </div>
                </div>

                {/* WPM score */}
                <div className="col-span-2 text-right text-xs font-bold text-gray-300 font-mono">
                  {player.wpm} <span className="text-[10px] text-neutral-500 font-normal">WPM</span>
                </div>

                {/* ACC score */}
                <div className="col-span-2 text-right text-xs font-mono text-gray-300">
                  {player.accuracy}%
                </div>

                {/* Cumulative XP */}
                <div className="col-span-2 text-right text-xs font-black text-white font-mono">
                  {player.xp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-500 font-mono mt-4 text-center">
            Season ranks refresh in 5d 12h 45m UTC. Top 3 typists earn legendary neon light effects!
          </p>
        </div>

        {/* Right 1 col: Competitive summary */}
        <div className="space-y-4">
          <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Your Competitive Index</h4>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-neutral-850">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Speed league tier</span>
                <span className="text-xs font-black text-orange-400">GOLD LEAGUE III</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-neutral-850">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Avg Accuracy streak</span>
                <span className="text-xs font-black text-emerald-400">95.4% Max</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-neutral-850">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Typist Rank Percentile</span>
                <span className="text-xs font-black text-teal-400">Top 12%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 p-5 rounded-2xl">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">Weekly Tournament</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
              Every Friday, participate in the asynchronous <strong>Word Sprint Marathon</strong> relative to global members. Ensure your high speed streak registers inside simulator sandbox logs.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
