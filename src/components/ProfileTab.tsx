import React from 'react';
import { UserStats, Badge } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Award, Flame, Shield, ChevronRight } from 'lucide-react';

interface ProfileTabProps { userStats: UserStats; badges: Badge[]; }

const BADGE_DATA = [
  { name: 'Speedster',    icon: '⚡', color: '#FF7A1A', unlocked: true  },
  { name: 'Consistent',  icon: '🔥', color: '#22C55E', unlocked: true  },
  { name: 'Perfectionist',icon: '🎯', color: '#F59E0B', unlocked: true  },
  { name: 'Marathon',    icon: '👟', color: '#3B82F6', unlocked: false },
  { name: 'Focus Master',icon: '🧠', color: '#FF8347', unlocked: false },
  { name: 'Night Owl',   icon: '🌙', color: '#A855F7', unlocked: false },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ userStats }) => {
  const { profile, user } = useAuth();
  const xpPct = Math.min(100, Math.round((userStats.xp / userStats.xpNeeded) * 100));
  const username = profile?.username ?? user?.displayName ?? 'TyperX';
  const initial  = username.charAt(0).toUpperCase();

  return (
    <div className="space-y-4">

      {/* ── Profile header card ── */}
      <div className="tx-card">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-glow"
              style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}>
              {user?.photoURL
                ? <img src={user.photoURL} alt={username} className="w-full h-full rounded-2xl object-cover" />
                : initial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22C55E] border-2 border-[#1A1D22]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white truncate">{username}</h3>
              <span className="text-[9px] px-2 py-0.5 bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20 rounded-lg font-mono font-bold uppercase">
                Elite Typist
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-mono mt-0.5">Level {userStats.level} · Streak ×1.5</p>
            {/* XP bar */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[9px] text-[#6B7280] font-mono">
                <span>XP {xpPct}%</span>
                <span>{userStats.xp.toLocaleString()} / {userStats.xpNeeded.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-[#0F1116] rounded-full overflow-hidden border border-[#2D3037]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#F59E0B]"
                  style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lifetime metrics ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP',    value: (96540 + userStats.xp).toLocaleString().replace(/,(\d{3})$/, 'K').split(',')[0] + (96540 + userStats.xp > 999 ? 'K' : '') },
          { label: 'Words',       value: `${(userStats.totalWords / 1000).toFixed(1)}K` },
          { label: 'Avg WPM',     value: userStats.avgWpm.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="tx-card !p-3 text-center">
            <p className="text-xl font-black text-white">{value}</p>
            <p className="text-[9px] text-[#6B7280] font-mono uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Badges ── */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
            <Award size={13} /> Badges
          </h4>
          <button className="text-[10px] text-[#FF7A1A] font-bold flex items-center gap-0.5 cursor-pointer">
            View all <ChevronRight size={11} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGE_DATA.map(b => (
            <div key={b.name} className={`flex flex-col items-center gap-1.5 ${!b.unlocked ? 'opacity-35' : ''}`}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2"
                style={{ borderColor: b.color, background: `${b.color}12` }}>
                {b.icon}
              </div>
              <span className="text-[10px] text-[#9CA3AF] text-center font-medium leading-tight">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Achievements ── */}
      <div className="tx-card">
        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Shield size={13} /> Recent Achievements
        </h4>
        <div className="space-y-2.5">
          {[
            { title: 'Speedster',        sub: 'Typed 100 WPM in a single session', points: '+12', color: '#FF7A1A' },
            { title: 'Consistency King', sub: 'Typed 7 days in a row',             points: null,  color: '#22C55E' },
            { title: 'Perfect Accuracy', sub: 'Achieved 100% accuracy',            points: null,  color: '#F59E0B' },
          ].map(({ title, sub, points, color }) => (
            <div key={title} className="flex items-center gap-3 p-3 bg-[#0F1116] rounded-xl border border-[#2D3037]">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Flame size={15} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F5F5F5]">{title}</p>
                <p className="text-[10px] text-[#6B7280]">{sub}</p>
              </div>
              {points && <span className="text-[10px] font-black text-[#FF7A1A]">{points}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
