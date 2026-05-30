import React, { useState } from 'react';
import { UserStats } from '../types';
import { TrendingUp, BarChart2, Calendar, ShieldAlert, Award, Clock } from 'lucide-react';

interface StatsTabProps {
  userStats: UserStats;
}

export const StatsTab: React.FC<StatsTabProps> = ({ userStats }) => {
  const [activeDateFilter, setActiveDateFilter] = useState<'7' | '30' | '90'>('7');

  // Hardcoded coordinates for our WPM linechart
  // We'll draw a beautifully glowing custom SVG area path
  const wpmDataSeven = [
    { day: 'Mon', wpm: 58 },
    { day: 'Tue', wpm: 64 },
    { day: 'Wed', wpm: 60 },
    { day: 'Thu', wpm: 72 },
    { day: 'Fri', wpm: 68 },
    { day: 'Sat', wpm: 78 },
    { day: 'Sun', wpm: 74 },
  ];

  const wpmDataThirty = [
    { day: 'W1', wpm: 52 },
    { day: 'W2', wpm: 58 },
    { day: 'W3', wpm: 64 },
    { day: 'W4', wpm: 74 },
  ];

  const chartData = activeDateFilter === '7' ? wpmDataSeven : wpmDataThirty;

  // Let's programmatically calculate custom SVG points
  const width = 500;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  // Find max WPM to scale graph
  const maxWpm = Math.max(...chartData.map(d => d.wpm), 90);
  const minWpm = Math.min(...chartData.map(d => d.wpm), 40);

  const getX = (index: number) => {
    const step = (width - paddingLeft - paddingRight) / (chartData.length - 1);
    return paddingLeft + index * step;
  };

  const getY = (wpm: number) => {
    const range = maxWpm - 40; // baseline 40
    const graphHeight = height - paddingTop - paddingBottom;
    const ratio = (wpm - 40) / range;
    return height - paddingBottom - ratio * graphHeight;
  };

  // Build the SVG path
  let linePath = '';
  let areaPath = '';

  if (chartData.length > 0) {
    // Generate line string
    linePath = chartData.reduce((acc, current, index) => {
      const x = getX(index);
      const y = getY(current.wpm);
      return acc + `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }, '');

    // Generate area string
    const baselineY = height - paddingBottom;
    const startX = getX(0);
    const endX = getX(chartData.length - 1);
    areaPath = `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
  }

  // Key error diagnostics mockups
  const errorKeys = [
    { key: 'P', errors: 24, text: 'Often pressed key instead of O' },
    { key: 'B', errors: 18, text: 'Thumb reach error on lower row space lines' },
    { key: 'Q', errors: 12, text: 'Pinky offset typing errors' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Date filters switch header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#1A1D22] p-4.5 rounded-2xl border border-neutral-850">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-500" /> Analytical Typing Speed Progress
          </h3>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Vector logs matching real daily keystroke speed trends</p>
        </div>

        {/* Option toggler */}
        <div className="flex bg-[#121417] p-1 rounded-lg border border-neutral-850 self-end sm:self-auto">
          {[
            { id: '7', label: '7 Days' },
            { id: '30', label: '30 Days' },
            { id: '90', label: '90 Days' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveDateFilter(opt.id as any)}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                activeDateFilter === opt.id
                  ? 'bg-[#1A1D22] text-orange-400 border border-orange-500/10'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid containing graph and stats summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph box - larger columns span */}
        <div className="lg:col-span-2 bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Words per minute trends (WPM)</span>
            <span className="text-orange-400 text-xs font-bold font-mono">Avg Peak: 78 WPM</span>
          </div>

          {/* Handcoded Pure SVG Chart container */}
          <div className="relative w-full overflow-x-auto overflow-y-hidden">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-auto min-w-[400px] text-gray-600 font-mono text-[9px] select-none"
            >
              {/* Gradients definitions */}
              <defs>
                <linearGradient id="chart-glowing-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {Array.from({ length: 4 }).map((_, i) => {
                const wpmVal = 40 + i * 15;
                const y = getY(wpmVal);
                return (
                  <g key={i}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={width - paddingRight} 
                      y2={y} 
                      className="stroke-neutral-800/60" 
                      strokeWidth="1" 
                      strokeDasharray="2.5" 
                    />
                    <text x={paddingLeft - 8} y={y + 3} className="text-right fill-gray-500 text-[8px]" textAnchor="end">
                      {wpmVal}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#chart-glowing-area)" />

              {/* Glowing Line */}
              <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" className="stroke-orange-500" />

              {/* Interactive Dots & text */}
              {chartData.map((d, idx) => {
                const x = getX(idx);
                const y = getY(d.wpm);
                return (
                  <g key={idx}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="4.5" 
                      className="fill-[#1A1D22] stroke-orange-500" 
                      strokeWidth="2.5" 
                    />
                    {/* Hover floating label */}
                    <text x={x} y={y - 10} className="fill-orange-400 font-bold" textAnchor="middle">
                      {d.wpm}
                    </text>
                    {/* Bottom Day coordinate */}
                    <text x={x} y={height - 20} className="fill-gray-500 text-[9px]" textAnchor="middle">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2 font-mono">
            <span>Chart: Baseline locked 40 WPM</span>
            <span>Speed trends update on real sandbox typed inputs!</span>
          </div>
        </div>

        {/* Error diagnosis summary items */}
        <div className="space-y-4">
          <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Errant Key Mapping List
            </h4>
            
            <div className="space-y-3">
              {errorKeys.map((err, i) => (
                <div key={i} className="p-3 bg-[#121417] rounded-xl border border-neutral-850 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950/20 text-red-400 border border-red-500/10 font-mono font-black text-xs flex items-center justify-center">
                    {err.key}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400">Error rate index</span>
                      <span className="text-[10px] font-mono text-red-400 font-bold">{err.errors}%</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-sans truncate mt-0.5">{err.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1D22] p-5 rounded-2xl border border-neutral-850 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-xs font-bold text-gray-200">Active hours pattern</span>
                <p className="text-[10px] text-gray-500">Most active: 10:00 - 14:00 Hrs</p>
              </div>
            </div>
            <span className="text-xs font-mono text-orange-400">Peak WPM</span>
          </div>
        </div>

      </div>

    </div>
  );
};
