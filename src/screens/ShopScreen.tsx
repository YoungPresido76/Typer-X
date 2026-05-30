import React from 'react';
import { ShoppingBag, Lock, Star } from 'lucide-react';
import { UserStats } from '../types';

interface ShopScreenProps { userStats: UserStats; }

const THEMES = [
  { id: 'default',  name: 'Glyph Dark',    color: '#06B6D4', cost: 0,    owned: true  },
  { id: 'violet',   name: 'Violet Storm',  color: '#7C3AED', cost: 500,  owned: false },
  { id: 'amber',    name: 'Ember Forge',   color: '#F59E0B', cost: 500,  owned: false },
  { id: 'emerald',  name: 'Circuit Green', color: '#10B981', cost: 800,  owned: false },
  { id: 'rose',     name: 'Crimson Keys',  color: '#F43F5E', cost: 1000, owned: false },
  { id: 'gold',     name: 'Gold Sovereign',color: '#EAB308', cost: 2000, owned: false },
];

export const ShopScreen: React.FC<ShopScreenProps> = ({ userStats }) => (
  <div className="flex flex-col h-full overflow-y-auto scrollbar-none px-4 py-4">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-violet-400" />
        <h2 className="text-sm font-black text-white">Shop</h2>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-xl">
        <span className="text-xs">💎</span>
        <span className="text-xs font-black text-violet-300 font-mono">{userStats.gems}</span>
      </div>
    </div>

    <p className="text-[10px] text-gray-500 mb-4">Themes · Key Sounds · Effects · Avatars</p>

    <div className="grid grid-cols-2 gap-2.5">
      {THEMES.map(t => (
        <div
          key={t.id}
          className="relative p-3.5 rounded-2xl border bg-[#14161A] border-white/6 flex flex-col gap-2"
        >
          {/* Color swatch */}
          <div className="w-full h-12 rounded-xl" style={{ background: `${t.color}22`, border: `1.5px solid ${t.color}44` }}>
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg" style={{ background: t.color, boxShadow: `0 4px 14px ${t.color}55` }} />
            </div>
          </div>
          <p className="text-xs font-bold text-gray-200">{t.name}</p>
          {t.owned
            ? <span className="text-[9px] text-emerald-400 font-bold">✓ Owned</span>
            : (
              <button className="flex items-center gap-1 text-[9px] font-black text-violet-300 cursor-pointer active:scale-95 transition-transform">
                💎 {t.cost} <span className="text-gray-600 font-normal">gems</span>
              </button>
            )}
          {!t.owned && <Lock className="absolute top-2.5 right-2.5 w-3 h-3 text-gray-600" />}
        </div>
      ))}
    </div>

    <div className="mt-4 p-4 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 text-center space-y-1">
      <div className="flex items-center justify-center gap-1.5">
        <Star className="w-3.5 h-3.5 text-cyan-400" />
        <p className="text-xs font-black text-cyan-400">Pro Pass — $2.99/mo</p>
      </div>
      <p className="text-[9px] text-gray-500">All themes · 2× XP · Premium effects</p>
    </div>
  </div>
);
