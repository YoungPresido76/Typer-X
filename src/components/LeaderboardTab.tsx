import React, { useState } from 'react';
import { LeaderboardEntry } from '../lib/firestore';
import {
  Trophy, Users, Earth, Compass, Zap,
  Sparkles, Wifi, WifiOff, Crown,
} from 'lucide-react';

interface LeaderboardTabProps {
  entries:      LeaderboardEntry[];
  currentUid:   string | null;
  currentStats: { xp: number; avgWpm: number; avgAccuracy: number; level: number } | null;
  loading:      boolean;
  onStartDuel:  () => void;
}

/* Deterministic avatar colour from username */
const avatarColor = (name: string) => {
  const palette = ['#FF7A00','#3B82F6','#22C55E','#8B5CF6','#EF4444','#F59E0B','#06B6D4','#EC4899'];
  return palette[name.charCodeAt(0) % palette.length];
};

/* Skeleton row */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1A1D22] border border-neutral-800 animate-pulse">
    <div className="w-7 h-3 bg-neutral-800 rounded" />
    <div className="w-9 h-9 bg-neutral-800 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="h-2.5 bg-neutral-800 rounded w-28" />
      <div className="h-2 bg-neutral-800 rounded w-20" />
    </div>
    <div className="w-12 h-3 bg-neutral-800 rounded" />
  </div>
);

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  entries, currentUid, currentStats, loading, onStartDuel,
}) => {
  const [tab, setTab] = useState<'global' | 'friends' | 'country'>('global');

  const myEntry = entries.find(e => e.uid === currentUid);
  const myRank  = myEntry ? entries.indexOf(myEntry) + 1 : null;

  return (
    <div className="space-y-6">

      {/* Arena duel banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-red-500 font-bold font-mono tracking-widest uppercase">
            MULTIPLAYER ARENA
          </span>
          <h3 className="text-base font-black text-white flex items-center gap-1.5">
            Active Typist Duel is Online! <Sparkles className="w-4 h-4 text-orange-400" />
          </h3>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Challenge players to a raw typing duel. Finish sentences without typos to grab big coin loot.
          </p>
        </div>
        <button
          onClick={onStartDuel}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-red-600 active:scale-95 transition-transform text-black text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Zap className="w-4 h-4" /> START DUEL
        </button>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: list */}
        <div className="lg:col-span-2 bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-500" />
              Weekly Arena Ranks
              {loading
                ? <WifiOff className="w-3 h-3 text-gray-600 ml-1" />
                : <Wifi    className="w-3 h-3 text-emerald-500 ml-1" />
              }
            </h3>

            {/* Sub-tabs */}
            <div className="flex bg-[#121417] p-1 rounded-lg border border-neutral-800">
              {[
                { id: 'global',  label: 'Global',  Icon: Earth   },
                { id: 'friends', label: 'Friends', Icon: Users   },
                { id: 'country', label: 'Country', Icon: Compass },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id as typeof tab)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    tab === id
                      ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Friends / Country empty */}
          {tab !== 'global' && (
            <div className="text-center py-10">
              <Users className="w-8 h-8 text-orange-500/20 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">
                {tab === 'friends' ? 'No friends added yet' : 'Country rankings coming soon'}
              </p>
              <p className="text-xs text-gray-600 font-mono mt-1">This feature is in development</p>
            </div>
          )}

          {/* Global — loading */}
          {tab === 'global' && loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Global — empty */}
          {tab === 'global' && !loading && entries.length === 0 && (
            <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl">
              <Trophy className="w-8 h-8 text-orange-500/20 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">Leaderboard is empty</p>
              <p className="text-xs text-gray-600 font-mono mt-1 max-w-xs mx-auto leading-relaxed">
                Be the first. Start typing with the Typer X keyboard to claim the #1 spot.
              </p>
            </div>
          )}

          {/* Global — list */}
          {tab === 'global' && !loading && entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((u, i) => {
                const isMe = u.uid === currentUid;
                return (
                  <div key={u.uid}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      isMe
                        ? 'bg-orange-500/5 border-orange-500/20'
                        : 'bg-[#121417] border-neutral-800'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-7 text-center flex-shrink-0">
                      {i < 3
                        ? <Crown className="w-4 h-4 mx-auto" style={{ color: ['#F59E0B','#9CA3AF','#CD7F32'][i] }} />
                        : <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                      }
                    </div>

                    {/* Avatar */}
                    {u.photoURL
                      ? <img src={u.photoURL} alt={u.username} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                      : <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                          style={{ background: avatarColor(u.username ?? 'U') }}>
                          {(u.username ?? 'U').charAt(0).toUpperCase()}
                        </div>
                    }

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold truncate ${isMe ? 'text-orange-400' : 'text-gray-200'}`}>
                          {u.username ?? 'Unknown'}
                        </p>
                        {isMe && (
                          <span className="text-[7px] px-1.5 py-0.5 bg-orange-500/15 text-orange-400 rounded font-bold border border-orange-500/20">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Lv.{u.level} · {u.avgWpm} WPM · {u.avgAccuracy}%
                      </p>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black text-gray-200 font-mono">{(u.xp / 1000).toFixed(1)}k</p>
                      <p className="text-[8px] text-gray-600 font-mono">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MY RANK PINNED — not in top 20 */}
          {tab === 'global' && !loading && currentStats && !myEntry && (
            <div className="mt-3 pt-3 border-t border-neutral-800">
              <p className="text-[9px] text-gray-600 font-mono mb-2 uppercase tracking-wider">Your Position</p>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                <div className="w-7 text-center">
                  <span className="text-xs font-bold text-orange-400">--</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-sm text-black flex-shrink-0">
                  Y
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-orange-400">You</p>
                    <span className="text-[7px] px-1.5 py-0.5 bg-orange-500/15 text-orange-400 rounded font-bold border border-orange-500/20">
                      NOT RANKED
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Type more to earn a rank</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-300 font-mono">{(currentStats.xp / 1000).toFixed(1)}k</p>
                  <p className="text-[8px] text-gray-600 font-mono">XP</p>
                </div>
              </div>
            </div>
          )}

          {/* MY RANK PINNED — in list but below fold */}
          {tab === 'global' && !loading && myEntry && myRank && myRank > 8 && (
            <div className="mt-3 pt-3 border-t border-neutral-800">
              <p className="text-[9px] text-gray-600 font-mono mb-2 uppercase tracking-wider">Your Position</p>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                <div className="w-7 text-center">
                  <span className="text-xs font-bold text-orange-400">#{myRank}</span>
                </div>
                {myEntry.photoURL
                  ? <img src={myEntry.photoURL} className="w-9 h-9 rounded-xl object-cover" alt="" />
                  : <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
                      style={{ background: avatarColor(myEntry.username ?? 'U') }}>
                      {(myEntry.username ?? 'U').charAt(0).toUpperCase()}
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-orange-400 truncate">{myEntry.username}</p>
                    <span className="text-[7px] px-1.5 py-0.5 bg-orange-500/15 text-orange-400 rounded font-bold border border-orange-500/20">YOU</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Lv.{myEntry.level} · {myEntry.avgWpm} WPM</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-300 font-mono">{(myEntry.xp / 1000).toFixed(1)}k</p>
                  <p className="text-[8px] text-gray-600 font-mono">XP</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Stats panel */}
        <div className="space-y-4">
          <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800">
            <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-4">
              Your Stats
            </h4>
            <div className="space-y-3">
              {[
                { label: 'XP Score',   value: currentStats ? `${(currentStats.xp / 1000).toFixed(1)}k` : '--' },
                { label: 'Avg WPM',    value: currentStats ? `${currentStats.avgWpm}` : '--' },
                { label: 'Accuracy',   value: currentStats ? `${currentStats.avgAccuracy}%` : '--' },
                { label: 'Rank',       value: myRank ? `#${myRank}` : 'Unranked' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-neutral-800 last:border-0">
                  <span className="text-xs text-gray-500 font-mono">{label}</span>
                  <span className="text-xs font-black text-orange-400">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1D22] p-4 rounded-2xl border border-neutral-800 text-center">
            <p className="text-[10px] text-gray-500 font-mono">Season ends</p>
            <p className="text-lg font-black text-white">5d 12h 45m</p>
            <p className="text-[10px] text-orange-400 font-mono mt-1">Top 3 get exclusive themes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
