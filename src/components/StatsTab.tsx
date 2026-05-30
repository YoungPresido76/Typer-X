import React, { useState } from 'react';
import { UserStats } from '../types';
import { TrendingUp, Target, Zap, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsTabProps { userStats: UserStats; }

const WPM_DATA: Record<string, { day: string; wpm: number }[]> = {
  '7':  [{ day:'Mon',wpm:58},{ day:'Tue',wpm:64},{ day:'Wed',wpm:60},{ day:'Thu',wpm:72},{ day:'Fri',wpm:68},{ day:'Sat',wpm:78},{ day:'Sun',wpm:74}],
  '30': [{ day:'W1',wpm:52},{ day:'W2',wpm:58},{ day:'W3',wpm:64},{ day:'W4',wpm:74}],
  '90': [{ day:'M1',wpm:48},{ day:'M2',wpm:55},{ day:'M3',wpm:62}],
};

export const StatsTab: React.FC<StatsTabProps> = ({ userStats }) => {
  const [range, setRange] = useState<'7'|'30'|'90'>('7');
  const data = WPM_DATA[range];

  const W = 300; const H = 100;
  const pad = { l: 24, r: 8, t: 8, b: 24 };
  const maxW = Math.max(...data.map(d => d.wpm));
  const minW = Math.min(...data.map(d => d.wpm)) - 5;
  const gW   = W - pad.l - pad.r;
  const gH   = H - pad.t - pad.b;
  const xs   = data.map((_, i) => pad.l + (i / (data.length - 1)) * gW);
  const ys   = data.map(d => pad.t + gH - ((d.wpm - minW) / (maxW - minW + 1)) * gH);
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const area = `${line} L${xs[xs.length-1]},${H - pad.b} L${xs[0]},${H - pad.b} Z`;

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Typing Stats</h2>
        <div className="flex gap-1 bg-[#0F1116] p-0.5 rounded-lg border border-[#2D3037]">
          {(['7','30','90'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                range === r ? 'bg-[#FF7A1A] text-black' : 'text-[#6B7280]'
              }`}
            >{r}d</button>
          ))}
        </div>
      </div>

      {/* Headline metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg WPM',   value: userStats.avgWpm,       unit: '',  delta: '+12%', Icon: Zap,      color: '#FF7A1A' },
          { label: 'Accuracy',  value: userStats.avgAccuracy,  unit: '%', delta: '+5%',  Icon: Target,   color: '#22C55E' },
          { label: 'Total Words',value: (userStats.totalWords/1000).toFixed(1), unit: 'K', delta: '+18%', Icon: FileText, color: '#FF7A1A' },
        ].map(({ label, value, unit, delta, Icon, color }) => (
          <div key={label} className="tx-card !p-4 text-center">
            <Icon size={16} className="mx-auto mb-1.5" style={{ color }} />
            <div className="text-xl font-bold text-white">{value}<span className="text-sm text-[#6B7280] ml-0.5">{unit}</span></div>
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">{label}</div>
            <div className="text-[10px] text-[#22C55E] font-mono mt-1">{delta}</div>
          </div>
        ))}
      </div>

      {/* WPM Chart */}
      <div className="tx-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp size={14} className="text-[#FF7A1A]" /> WPM Trend
          </h4>
          <span className="text-[10px] text-[#FF7A1A] font-mono font-bold">{Math.max(...data.map(d => d.wpm))} peak</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(r => (
            <line key={r} x1={pad.l} y1={pad.t + gH * r} x2={W - pad.r} y2={pad.t + gH * r}
              stroke="#2D3037" strokeWidth="1" strokeDasharray="3,3" />
          ))}
          {/* Area */}
          <path d={area} fill="url(#areaGrad)" />
          {/* Line */}
          <path d={line} fill="none" stroke="#FF7A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r="3" fill="#FF7A1A" />
          ))}
          {/* X labels */}
          {data.map((d, i) => (
            <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="monospace">
              {d.day}
            </text>
          ))}
        </svg>
      </div>

      {/* Lifetime stats */}
      <div className="tx-card">
        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Lifetime Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total XP',       value: (96540 + userStats.xp).toLocaleString() },
            { label: 'Total Words',    value: userStats.totalWords.toLocaleString() },
            { label: 'Keys Typed',     value: `${(userStats.totalKeys / 1000).toFixed(1)}K` },
            { label: 'Best Streak',    value: `${userStats.highestStreak} days` },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 bg-[#0F1116] rounded-xl border border-[#2D3037]">
              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider">{label}</p>
              <p className="text-base font-black text-white mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
