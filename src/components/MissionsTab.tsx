import React, { useState } from 'react';
import { Mission, UserStats } from '../types';
import {
  Calendar, Zap, Trophy, CheckCircle, Lock,
  Keyboard, Target, Flame, Star, Clock,
  TrendingUp, Gift, Shield, AlignLeft, MessageCircle,
  Hash, Moon, Sun, Coffee, RefreshCw, Share2, LogIn,
  Grid, Type, Smile, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ── Icon map ── */
const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  FileText, Keyboard, Zap, Target, Clock, Flame, Star,
  TrendingUp, Gift, Shield, AlignLeft, MessageCircle,
  Hash, Moon, Sun, Coffee, RefreshCw, Share2, LogIn,
  Grid, Type, Smile, Trophy, Calendar, Key: Keyboard,
  Award: Trophy, Crown: Trophy, ShoppingBag: Gift,
};

const MissionIcon: React.FC<{ name: string; active?: boolean; completed?: boolean }> = ({
  name, active = false, completed = false,
}) => {
  const Icon = ICON_MAP[name] ?? Target;
  return (
    <Icon
      size={16}
      className={completed ? 'text-[#22C55E]' : active ? 'text-[#FF7A1A]' : 'text-[#6B7280]'}
    />
  );
};

/* ── Empty shell card ── */
const EmptyShell: React.FC<{ tab: 'daily' | 'weekly' | 'achievements' }> = ({ tab }) => {
  const msgs = {
    daily: {
      icon: <Keyboard size={32} className="mx-auto text-[#FF7A1A]/40 mb-3" />,
      title: 'No progress yet',
      body:  'Your daily missions are ready. Install the Typer X keyboard and start typing in any app to track progress here in real time.',
      sub:   'Progress syncs automatically once the keyboard is active.',
    },
    weekly: {
      icon: <Zap size={32} className="mx-auto text-[#FF7A1A]/40 mb-3" />,
      title: 'Weekly missions waiting',
      body:  'Weekly missions reset every Monday. Typing data from the Typer X keyboard will update these automatically.',
      sub:   'Bigger rewards — bigger grind.',
    },
    achievements: {
      icon: <Trophy size={32} className="mx-auto text-[#FF7A1A]/40 mb-3" />,
      title: 'No achievements yet',
      body:  'Achievements are permanent milestones earned through lifetime typing. They never reset.',
      sub:   'Start typing to unlock your first badge.',
    },
  };
  const m = msgs[tab];
  return (
    <div className="tx-card text-center py-10 border-dashed">
      {m.icon}
      <p className="text-sm font-bold text-[#9CA3AF]">{m.title}</p>
      <p className="text-xs text-[#6B7280] mt-2 leading-relaxed max-w-[260px] mx-auto">{m.body}</p>
      <p className="text-[10px] text-[#FF7A1A]/60 font-mono mt-3">{m.sub}</p>
    </div>
  );
};

/* ── Mission progress row ── */
const MissionRow: React.FC<{
  mission: Mission;
  onClaim: (id: string, xp: number, coins: number) => void;
  index: number;
}> = ({ mission: m, onClaim, index }) => {
  const pct     = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
  const done    = pct >= 100;
  const noData  = m.currentValue === 0 && !m.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045 }}
      className={`p-4 rounded-2xl border transition-colors ${
        m.claimed      ? 'bg-[#1A1D22] border-[#22C55E]/15'
        : done         ? 'bg-[#1A1D22] border-[#FF7A1A]/30'
        : noData       ? 'bg-[#1A1D22]/60 border-[#2D3037]/60'
        :                'bg-[#1A1D22] border-[#2D3037]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
          m.claimed ? 'bg-[#22C55E]/10 border-[#22C55E]/20'
          : done    ? 'bg-[#FF7A1A]/10 border-[#FF7A1A]/20'
          :           'bg-[#0F1116] border-[#2D3037]'
        }`}>
          {m.claimed
            ? <CheckCircle size={17} className="text-[#22C55E]" />
            : noData
            ? <Lock size={14} className="text-[#3A3D45]" />
            : <MissionIcon name={m.iconName} active={done} completed={m.claimed} />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <p className={`text-xs font-semibold leading-snug ${
              m.claimed ? 'text-[#22C55E]' : done ? 'text-white' : noData ? 'text-[#6B7280]' : 'text-[#F5F5F5]'
            }`}>{m.title}</p>
            <span className="text-[10px] font-black text-[#FF7A1A] font-mono flex-shrink-0">+{m.xpReward}XP</span>
          </div>

          {/* No-data state */}
          {noData && (
            <p className="text-[10px] text-[#3A3D45] font-mono mt-1 italic">
              Waiting for keyboard data…
            </p>
          )}

          {/* Progress bar */}
          {!noData && (
            <>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-[#0F1116] rounded-full overflow-hidden border border-[#2D3037]">
                  <motion.div
                    className={`h-full rounded-full ${
                      m.claimed ? 'bg-[#22C55E]'
                      : done    ? 'bg-gradient-to-r from-[#FF7A1A] to-[#F59E0B]'
                      :           'bg-[#FF7A1A]'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[9px] font-mono text-[#6B7280] whitespace-nowrap">
                  {m.currentValue.toLocaleString()} / {m.targetValue.toLocaleString()}
                </span>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="mt-3">
            {m.claimed ? (
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#22C55E]/6 text-[#22C55E] border border-[#22C55E]/15 font-bold font-mono">
                ✓ Claimed
              </span>
            ) : done ? (
              <button
                onClick={() => onClaim(m.id, m.xpReward, m.coinReward)}
                className="px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase text-black cursor-pointer active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}
              >
                Claim Reward
              </button>
            ) : noData ? null : (
              <span className="text-[10px] text-[#6B7280] font-mono">{pct}% complete</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════
   MISSIONS TAB
══════════════════════ */
interface MissionsTabProps {
  missions: Mission[];
  userStats: UserStats;
  onClaim: (id: string, xp: number, coins: number) => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({ missions, userStats, onClaim }) => {
  const [tab, setTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const daily        = missions.filter(m => m.type === 'daily');
  const weekly       = missions.filter(m => m.type === 'weekly');
  const achievements = missions.filter(m => m.type === 'achievement');
  const filtered     = tab === 'daily' ? daily : tab === 'weekly' ? weekly : achievements;

  const doneCount    = filtered.filter(m => m.completed && !m.claimed).length;
  const claimedCount = filtered.filter(m => m.claimed).length;
  const totalCount   = filtered.length;

  const hasAnyProgress = filtered.some(m => m.currentValue > 0);

  const TABS = [
    { id: 'daily' as const,        label: 'Daily',        count: daily.filter(m => m.completed && !m.claimed).length },
    { id: 'weekly' as const,       label: 'Weekly',       count: weekly.filter(m => m.completed && !m.claimed).length },
    { id: 'achievements' as const, label: 'Achievements', count: achievements.filter(m => m.completed && !m.claimed).length },
  ];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Missions</h2>
          <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">
            {claimedCount}/{totalCount} claimed this {tab === 'weekly' ? 'week' : 'day'}
          </p>
        </div>
        {/* Coins earned today */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D22] border border-[#2D3037] rounded-xl">
          <Star size={12} className="text-[#FF7A1A]" />
          <span className="text-xs font-black text-[#F5F5F5] font-mono">{userStats.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-[#0F1116] p-1 rounded-xl border border-[#2D3037]">
        {TABS.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer relative ${
              tab === id
                ? 'bg-[#1A1D22] text-[#FF7A1A] border border-[#FF7A1A]/15'
                : 'text-[#6B7280]'
            }`}
          >
            {label}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF7A1A] text-black text-[8px] font-black flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Daily reset timer */}
      {tab === 'daily' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0F1116] rounded-xl border border-[#2D3037]">
          <Clock size={12} className="text-[#6B7280]" />
          <p className="text-[10px] text-[#6B7280] font-mono">
            Daily missions reset at midnight · {daily.filter(m => !m.claimed).length} remaining
          </p>
        </div>
      )}

      {tab === 'weekly' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#0F1116] rounded-xl border border-[#2D3037]">
          <Calendar size={12} className="text-[#6B7280]" />
          <p className="text-[10px] text-[#6B7280] font-mono">
            Weekly missions reset on Monday
          </p>
        </div>
      )}

      {/* IME bridge notice — shown when no keyboard data yet */}
      {!hasAnyProgress && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-3.5 bg-[#FF7A1A]/5 border border-[#FF7A1A]/15 rounded-2xl"
        >
          <Keyboard size={16} className="text-[#FF7A1A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#FF7A1A]">Keyboard not connected yet</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-relaxed">
              Your missions are assigned and waiting. Once you install the Typer X Android keyboard,
              all progress syncs here automatically as you type in any app.
            </p>
          </div>
        </motion.div>
      )}

      {/* Mission list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {filtered.length === 0
            ? <EmptyShell tab={tab} />
            : filtered.map((m, i) => (
                <MissionRow key={m.id} mission={m} onClaim={onClaim} index={i} />
              ))
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
