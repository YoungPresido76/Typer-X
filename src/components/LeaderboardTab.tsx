import React, { useState } from 'react';
import { LeaderboardEntry } from '../lib/firestore';
import { Crown, Trophy, Users, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeaderboardTabProps {
  entries:        LeaderboardEntry[];
  currentUid:     string | null;
  currentStats:   { xp: number; avgWpm: number; avgAccuracy: number; level: number } | null;
  loading:        boolean;
  onStartDuel:    () => void;
}

const RANK_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'];
const RANK_ICONS  = ['👑', '🥈', '🥉'];

/* Avatar initials */
const Avatar: React.FC<{ username: string; photoURL?: string | null; size?: string }> = ({
  username, photoURL, size = 'w-9 h-9',
}) => {
  const colors = ['#FF7A1A','#3B82F6','#22C55E','#8B5CF6','#EF4444','#F59E0B','#06B6D4','#EC4899'];
  const hue    = username.charCodeAt(0) % colors.length;
  return photoURL
    ? <img src={photoURL} alt={username} className={`${size} rounded-xl object-cover flex-shrink-0`} />
    : <div className={`${size} rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0`}
        style={{ background: colors[hue] }}>
        {username.charAt(0).toUpperCase()}
      </div>;
};

/* Skeleton row */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1A1D22] border border-[#2D3037] animate-pulse">
    <div className="w-8 h-3 bg-[#2D3037] rounded" />
    <div className="w-9 h-9 bg-[#2D3037] rounded-xl" />
    <div className="flex-1 space-y-1.5">
      <div className="h-2.5 bg-[#2D3037] rounded w-28" />
      <div className="h-2 bg-[#2D3037] rounded w-20" />
    </div>
    <div className="w-12 h-3 bg-[#2D3037] rounded" />
  </div>
);

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  entries, currentUid, currentStats, loading, onStartDuel,
}) => {
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  const myEntry  = entries.find(e => e.uid === currentUid);
  const myRank   = myEntry ? entries.indexOf(myEntry) + 1 : null;
  const isInTop  = myRank !== null && myRank <= entries.length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Leaderboard</h2>
        <div className="flex items-center gap-1.5">
          {loading
            ? <WifiOff size={12} className="text-[#6B7280]" />
            : <Wifi    size={12} className="text-[#22C55E]" />
          }
          <span className="text-[10px] text-[#6B7280] font-mono bg-[#1A1D22] px-2.5 py-1 rounded-lg border border-[#2D3037]">
            Season ends 5d 12h
          </span>
        </div>
      </div>

      {/* Tab */}
      <div className="flex bg-[#0F1116] p-1 rounded-xl border border-[#2D3037]">
        {(['global', 'friends'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
              tab === t
                ? 'bg-[#1A1D22] text-[#FF7A1A] border border-[#FF7A1A]/15'
                : 'text-[#6B7280]'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Friends empty state */}
      {tab === 'friends' && (
        <div className="tx-card text-center py-10 border-dashed">
          <Users size={28} className="mx-auto text-[#FF7A1A]/40 mb-3" />
          <p className="text-sm font-bold text-[#9CA3AF]">No friends added yet</p>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed max-w-[220px] mx-auto">
            Friend challenges are coming in a future update.
          </p>
        </div>
      )}

      {/* Global leaderboard */}
      {tab === 'global' && (
        <>
          {/* Empty state — no Firestore data yet */}
          {!loading && entries.length === 0 && (
            <div className="tx-card text-center py-10 border-dashed">
              <Trophy size={28} className="mx-auto text-[#FF7A1A]/40 mb-3" />
              <p className="text-sm font-bold text-[#9CA3AF]">Leaderboard is empty</p>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed max-w-[240px] mx-auto">
                Be the first! Start typing with the Typer X keyboard to claim the #1 spot.
              </p>
              <div className="mt-4 px-3 py-2 bg-[#FF7A1A]/5 border border-[#FF7A1A]/15 rounded-xl">
                <p className="text-[10px] text-[#FF7A1A] font-mono">
                  Scores sync in real-time once the keyboard is active.
                </p>
              </div>
            </div>
          )}

          {/* Skeleton loading */}
          {loading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Top 3 podium */}
          {!loading && entries.length >= 3 && (
            <div className="tx-card">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Top Performers</p>
              <div className="flex items-end justify-around gap-2">
                {[entries[1], entries[0], entries[2]].map((u, i) => {
                  const pos = [2, 1, 3][i];
                  const barH = ['h-14', 'h-20', 'h-12'][i];
                  const sz   = i === 1 ? 'w-12 h-12' : 'w-10 h-10';
                  return (
                    <div key={u.uid} className="flex flex-col items-center gap-1.5">
                      <span className="text-lg">{RANK_ICONS[pos - 1]}</span>
                      <Avatar username={u.username ?? '?'} photoURL={u.photoURL} size={sz} />
                      <p className="text-[10px] font-bold text-white max-w-[64px] truncate text-center">
                        {u.username ?? 'Unknown'}
                      </p>
                      <p className="text-[9px] text-[#6B7280] font-mono">{(u.xp / 1000).toFixed(1)}k</p>
                      <div className={`w-full ${barH} rounded-t-xl flex items-end justify-center pb-1 border border-[#2D3037]`}
                        style={{ background: `${RANK_COLORS[pos-1]}10` }}>
                        <span className="text-sm font-black" style={{ color: RANK_COLORS[pos-1] }}>#{pos}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full list */}
          {!loading && entries.length > 0 && (
            <AnimatePresence>
              <div className="space-y-2">
                {entries.map((u, i) => {
                  const isMe = u.uid === currentUid;
                  return (
                    <motion.div
                      key={u.uid}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                        isMe
                          ? 'bg-[#FF7A1A]/6 border-[#FF7A1A]/25'
                          : 'bg-[#1A1D22] border-[#2D3037]'
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-7 text-center flex-shrink-0">
                        {i < 3
                          ? <Crown size={14} className="mx-auto" style={{ color: RANK_COLORS[i] }} />
                          : <span className="text-xs font-bold text-[#6B7280]">#{i + 1}</span>
                        }
                      </div>

                      <Avatar username={u.username ?? '?'} photoURL={u.photoURL} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-bold truncate ${isMe ? 'text-[#FF7A1A]' : 'text-white'}`}>
                            {u.username ?? 'Unknown'}
                          </p>
                          {isMe && (
                            <span className="text-[7px] px-1.5 py-0.5 bg-[#FF7A1A]/15 text-[#FF7A1A] rounded font-bold border border-[#FF7A1A]/20">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#6B7280] font-mono">
                          Lv.{u.level} · {u.avgWpm} WPM
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-[#F5F5F5] font-mono">{(u.xp / 1000).toFixed(1)}k</p>
                        <p className="text-[8px] text-[#6B7280] font-mono">XP</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}

          {/* ── MY RANK PINNED AT BOTTOM ── */}
          {!loading && currentStats && !isInTop && (
            <div className="sticky bottom-0 pb-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#FF7A1A]/30 bg-[#121417] shadow-e3">
                <div className="w-7 text-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#FF7A1A]">
                    #{entries.length + 1}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A1A] to-[#FF5000] flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                  Y
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#FF7A1A]">You</p>
                    <span className="text-[7px] px-1.5 py-0.5 bg-[#FF7A1A]/15 text-[#FF7A1A] rounded font-bold border border-[#FF7A1A]/20">
                      NOT RANKED
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] font-mono">Start typing to earn a rank</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#F5F5F5] font-mono">{(currentStats.xp / 1000).toFixed(1)}k</p>
                  <p className="text-[8px] text-[#6B7280] font-mono">XP</p>
                </div>
              </div>
            </div>
          )}

          {/* MY RANK pinned — when user IS in the list but needs to be visible */}
          {!loading && isInTop && myEntry && myRank && myRank > 6 && (
            <div className="sticky bottom-0 pb-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#FF7A1A]/25 bg-[#121417] shadow-e3">
                <div className="w-7 text-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#FF7A1A]">#{myRank}</span>
                </div>
                <Avatar username={myEntry.username ?? 'You'} photoURL={myEntry.photoURL} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#FF7A1A] truncate">{myEntry.username}</p>
                    <span className="text-[7px] px-1.5 py-0.5 bg-[#FF7A1A]/15 text-[#FF7A1A] rounded font-bold border border-[#FF7A1A]/20">YOU</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] font-mono">Lv.{myEntry.level} · {myEntry.avgWpm} WPM</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#F5F5F5] font-mono">{(myEntry.xp / 1000).toFixed(1)}k</p>
                  <p className="text-[8px] text-[#6B7280] font-mono">XP</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Arena CTA */}
      <button
        onClick={onStartDuel}
        className="w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}
      >
        ⚡ Challenge Arena
      </button>
    </div>
  );
};
