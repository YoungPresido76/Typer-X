import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { Crown, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardTabProps {
  leaderboard: LeaderboardUser[];
  userXp: number;
  userWpm: number;
  userAccuracy: number;
  onStartDuel: () => void;
}

const RANK_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'];
const RANK_ICONS  = ['👑', '🥈', '🥉'];

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ leaderboard, userXp, userWpm, userAccuracy, onStartDuel }) => {
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Leaderboard</h2>
        <span className="text-[10px] text-[#6B7280] font-mono bg-[#1A1D22] px-2.5 py-1 rounded-lg border border-[#2D3037]">
          Season ends 5d 12h
        </span>
      </div>

      {/* Tab */}
      <div className="flex bg-[#0F1116] p-1 rounded-xl border border-[#2D3037]">
        {(['global', 'friends'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
              tab === t ? 'bg-[#1A1D22] text-[#FF7A1A] border border-[#FF7A1A]/15' : 'text-[#6B7280]'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Top 3 podium */}
      {leaderboard.length >= 3 && (
        <div className="tx-card">
          <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Top Performers</h4>
          <div className="flex items-end justify-around gap-2">
            {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
              const pos = [2, 1, 3][i];
              const heights = ['h-16', 'h-20', 'h-14'];
              const size = i === 1 ? 'w-14 h-14' : 'w-11 h-11';
              return (
                <div key={u.rank} className="flex flex-col items-center gap-1.5">
                  <span className="text-lg">{RANK_ICONS[pos - 1]}</span>
                  <div className={`${size} rounded-full flex items-center justify-center font-black text-base text-white border-2`}
                    style={{ background: u.avatarBg || '#FF7A1A', borderColor: RANK_COLORS[pos - 1] }}>
                    {(u.name ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[10px] font-bold text-white text-center max-w-[64px] truncate">{u.name}</p>
                  <p className="text-[9px] text-[#6B7280] font-mono">{(u.xp / 1000).toFixed(1)}k XP</p>
                  <div className={`w-full ${heights[i]} rounded-t-xl border border-[#2D3037] flex items-end justify-center pb-1`}
                    style={{ background: `${RANK_COLORS[pos - 1]}12` }}>
                    <span className="text-sm font-black" style={{ color: RANK_COLORS[pos - 1] }}>#{pos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {leaderboard.map((u, i) => (
          <motion.div
            key={u.rank}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
              u.isCurrentUser
                ? 'bg-[#FF7A1A]/6 border-[#FF7A1A]/20'
                : 'bg-[#1A1D22] border-[#2D3037]'
            }`}
          >
            {/* Rank */}
            <div className="w-8 text-center flex-shrink-0">
              {u.rank <= 3
                ? <Crown size={16} className="mx-auto" style={{ color: RANK_COLORS[u.rank - 1] }} />
                : <span className="text-xs font-bold text-[#6B7280]">#{u.rank}</span>
              }
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
              style={{ background: u.avatarBg || '#FF7A1A' }}>
              {(u.name ?? 'U').charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-bold truncate ${u.isCurrentUser ? 'text-[#FF7A1A]' : 'text-white'}`}>{u.name}</p>
                {u.isCurrentUser && (
                  <span className="text-[7px] px-1.5 py-0.5 bg-[#FF7A1A]/15 text-[#FF7A1A] rounded font-bold border border-[#FF7A1A]/20">YOU</span>
                )}
              </div>
              <p className="text-[10px] text-[#6B7280] font-mono">{u.wpm} WPM · {u.accuracy}% acc</p>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-black text-[#F5F5F5] font-mono">{(u.xp / 1000).toFixed(1)}k</p>
              <p className="text-[8px] text-[#6B7280] font-mono">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Duel CTA */}
      <button
        onClick={onStartDuel}
        className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform shadow-glow"
        style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}
      >
        ⚡ Challenge Arena
      </button>
    </div>
  );
};
