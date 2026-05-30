import React, { useState } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { LeaderboardUser } from '../types';

interface LeaderboardScreenProps { users: LeaderboardUser[]; }

const MOCK_USERS: LeaderboardUser[] = [
  { rank: 1, username: 'PhantomType',   level: 42, xp: 128450, wpm: 88, avatarBg: '#F97316' },
  { rank: 2, username: 'SpeedDemon',    level: 38, xp: 115230, wpm: 92, avatarBg: '#10B981' },
  { rank: 3, username: 'KeyMaster',     level: 35, xp: 108770, wpm: 75, avatarBg: '#6366F1' },
  { rank: 4, username: 'TyperX',     level: 14, xp: 96540,  wpm: 67, avatarBg: '#06B6D4', isCurrentUser: true },
  { rank: 5, username: 'QuickFingers',  level: 29, xp: 88210,  wpm: 84, avatarBg: '#EC4899' },
  { rank: 6, username: 'HexHammer',     level: 24, xp: 72150,  wpm: 60, avatarBg: '#14B8A6' },
  { rank: 7, username: 'MacroMage',     level: 21, xp: 64920,  wpm: 67, avatarBg: '#D946EF' },
];

const rankStyles = [
  'text-amber-400',
  'text-slate-300',
  'text-amber-700',
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = () => {
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-black text-white">Leaderboard</h2>
        </div>
        <span className="text-[9px] text-gray-500 font-mono">Season ends 5d 12h</span>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-white/4 rounded-xl mb-4">
        {(['global', 'friends'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
              tab === t ? 'bg-cyan-500 text-white' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {MOCK_USERS.map((u, i) => (
          <motion.div
            key={u.username}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-2xl border ${
              u.isCurrentUser
                ? 'bg-cyan-500/8 border-cyan-500/25'
                : 'bg-[#14161A] border-white/5'
            }`}
          >
            {/* Rank */}
            <div className="w-7 text-center">
              {u.rank <= 3
                ? <Crown className={`w-4 h-4 mx-auto ${rankStyles[u.rank - 1]}`} />
                : <span className="text-xs font-black text-gray-500">#{u.rank}</span>
              }
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
              style={{ background: u.avatarBg }}
            >
              {u.username.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-black truncate ${u.isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>
                  {u.username}
                </p>
                {u.isCurrentUser && (
                  <span className="text-[7px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-bold border border-cyan-500/20">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-[9px] text-gray-500 font-mono">Lv.{u.level} · {u.wpm} WPM</p>
            </div>

            {/* XP */}
            <div className="text-right">
              <p className="text-xs font-black text-gray-200 font-mono">{(u.xp / 1000).toFixed(1)}k</p>
              <p className="text-[8px] text-gray-600 font-mono">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-2xl border border-violet-500/10 bg-violet-500/5 text-center">
        <p className="text-[9px] text-gray-500">Firebase real-time sync — coming in Chat 4</p>
      </div>
    </div>
  );
};
