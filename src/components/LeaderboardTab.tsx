import React, { useState } from 'react';
import { LeaderboardEntry } from '../lib/firestore';
import {
  Trophy, Users, Earth, Compass, Zap, Sparkles,
  Wifi, WifiOff, Medal, Crown,
} from 'lucide-react';

interface LeaderboardTabProps {
  entries:      LeaderboardEntry[];
  currentUid:   string | null;
  currentStats: { xp: number; avgWpm: number; avgAccuracy: number; level: number } | null;
  loading:      boolean;
  onStartDuel:  () => void;
}

/* Deterministic avatar colour */
const avatarColor = (name: string) => {
  const p = ['#FF7A00','#3B82F6','#22C55E','#8B5CF6','#EF4444','#F59E0B','#06B6D4','#EC4899'];
  return p[(name.charCodeAt(0) ?? 0) % p.length];
};

/* Rank medal using Lucide */
const RankCell: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Medal className="w-4 h-4 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-gray-400 text-xs font-bold">{rank}</span>;
};

/* Skeleton row */
const SkeletonRow = () => (
  <div className="grid grid-cols-12 items-center px-4 py-3 rounded-xl border border-neutral-800 bg-[#121417] animate-pulse gap-2">
    <div className="col-span-1 h-3 w-4 bg-neutral-800 rounded" />
    <div className="col-span-5 flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-neutral-800" />
      <div className="h-2.5 bg-neutral-800 rounded w-20" />
    </div>
    <div className="col-span-2 h-2.5 bg-neutral-800 rounded" />
    <div className="col-span-2 h-2.5 bg-neutral-800 rounded" />
    <div className="col-span-2 h-2.5 bg-neutral-800 rounded" />
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

      {/* Arena duel banner — exact chat4 */}
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

      {/* Grid: list + stats panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Rankings list — lg: 2 cols */}
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
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    tab === id
                      ? 'bg-[#1A1D22] text-orange-400 border border-orange-500/10'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
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

          {/* Global — loading skeletons */}
          {tab === 'global' && loading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Global — empty state */}
          {tab === 'global' && !loading && entries.length === 0 && (
            <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl">
              <Trophy className="w-8 h-8 text-orange-500/20 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">Leaderboard is empty</p>
              <p className="text-xs text-gray-600 font-mono mt-2 max-w-xs mx-auto leading-relaxed">
                Be the first. Start typing with the Typer X keyboard to claim the #1 spot.
              </p>
            </div>
          )}

          {/* Global — table — exact chat4 layout */}
          {tab === 'global' && !loading && entries.length > 0 && (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 px-4 py-1.5 text-[9px] text-gray-500 font-mono font-bold tracking-wider border-b border-neutral-800">
                <div className="col-span-1">RANK</div>
                <div className="col-span-5">TYPIST</div>
                <div className="col-span-2 text-right">SPEED</div>
                <div className="col-span-2 text-right">ACCURACY</div>
                <div className="col-span-2 text-right">TOTAL XP</div>
              </div>

              <div className="space-y-2 mt-2">
                {entries.map((u, i) => {
                  const isMe = u.uid === currentUid;
                  return (
                    <div
                      key={u.uid}
                      className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl border transition-colors ${
                        isMe
                          ? 'bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/30'
                          : 'bg-[#121417] border-neutral-800'
                      }`}
                    >
                      <div className="col-span-1 text-xs font-black font-mono flex items-center">
                        <RankCell rank={i + 1} />
                      </div>

                      <div className="col-span-5 flex items-center gap-2">
                        {u.photoURL
                          ? <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                          : <div
                              className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] text-white"
                              style={{ background: avatarColor(u.username ?? 'U') }}
                            >
                              {(u.username ?? 'U').slice(0, 2).toUpperCase()}
                            </div>
                        }
                        <div>
                          <span className={`text-xs font-bold ${isMe ? 'text-orange-400' : 'text-gray-200'}`}>
                            {u.username ?? 'Unknown'}
                          </span>
                          {isMe && (
                            <span className="block text-[8px] text-orange-500/80 font-mono tracking-wide">YOU</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 text-right text-xs font-bold text-gray-300 font-mono">
                        {u.avgWpm} <span className="text-[10px] text-neutral-500 font-normal">WPM</span>
                      </div>
                      <div className="col-span-2 text-right text-xs font-mono text-gray-300">
                        {u.avgAccuracy}%
                      </div>
                      <div className="col-span-2 text-right text-xs font-black text-white font-mono">
                        {u.xp.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MY RANK PINNED — not in list */}
              {!myEntry && currentStats && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <p className="text-[9px] text-gray-600 font-mono mb-2 uppercase tracking-wider">Your position</p>
                  <div className="grid grid-cols-12 items-center px-4 py-3 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                    <div className="col-span-1 text-xs font-black font-mono text-orange-400">--</div>
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-[11px] text-black">
                        YO
                      </div>
                      <div>
                        <span className="text-xs font-bold text-orange-400">You</span>
                        <span className="block text-[8px] text-orange-500/80 font-mono">NOT RANKED YET</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-xs font-bold text-gray-300 font-mono">
                      {currentStats.avgWpm} <span className="text-[10px] text-neutral-500">WPM</span>
                    </div>
                    <div className="col-span-2 text-right text-xs font-mono text-gray-300">
                      {currentStats.avgAccuracy}%
                    </div>
                    <div className="col-span-2 text-right text-xs font-black text-white font-mono">
                      {currentStats.xp.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* MY RANK PINNED — in list but below fold */}
              {myEntry && myRank && myRank > 8 && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <p className="text-[9px] text-gray-600 font-mono mb-2 uppercase tracking-wider">Your position</p>
                  <div className="grid grid-cols-12 items-center px-4 py-3 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                    <div className="col-span-1 text-xs font-black font-mono text-orange-400">#{myRank}</div>
                    <div className="col-span-5 flex items-center gap-2">
                      {myEntry.photoURL
                        ? <img src={myEntry.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                        : <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] text-white" style={{ background: avatarColor(myEntry.username ?? 'U') }}>
                            {(myEntry.username ?? 'U').slice(0, 2).toUpperCase()}
                          </div>
                      }
                      <div>
                        <span className="text-xs font-bold text-orange-400">{myEntry.username}</span>
                        <span className="block text-[8px] text-orange-500/80 font-mono">YOU</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-xs font-bold text-gray-300 font-mono">
                      {myEntry.avgWpm} <span className="text-[10px] text-neutral-500">WPM</span>
                    </div>
                    <div className="col-span-2 text-right text-xs font-mono text-gray-300">{myEntry.avgAccuracy}%</div>
                    <div className="col-span-2 text-right text-xs font-black text-white font-mono">{myEntry.xp.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-500 font-mono mt-4 text-center">
                Season ranks refresh in 5d 12h 45m UTC. Top 3 typists earn legendary neon light effects.
              </p>
            </>
          )}
        </div>

        {/* Right panel — exact chat4 */}
        <div className="space-y-4">
          <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Your Competitive Index
            </h4>
            <div className="space-y-3.5">
              {[
                { label: 'Speed league tier',      value: currentStats ? `${currentStats.avgWpm} WPM` : 'NO DATA',       color: 'text-orange-400' },
                { label: 'Avg Accuracy streak',    value: currentStats ? `${currentStats.avgAccuracy}%`  : 'NO DATA',     color: 'text-emerald-400' },
                { label: 'Typist Rank Percentile', value: myRank ? `Top rank #${myRank}`                 : 'Unranked',     color: 'text-teal-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{label}</span>
                  <span className={`text-xs font-black ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 p-5 rounded-2xl">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">
              Weekly Tournament
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
              Every Friday, participate in the <strong>Word Sprint Marathon</strong> relative to global members.
              Ensure your high speed streak registers for ranking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
