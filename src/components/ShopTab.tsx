import React, { useState } from 'react';
import { KeyboardSkin, SoundPack, UserStats } from '../types';
import { playSuccessSound } from '../audio';
import { ShoppingBag, Lock, Check, Star, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface ShopTabProps {
  skins: KeyboardSkin[];
  setSkins: React.Dispatch<React.SetStateAction<KeyboardSkin[]>>;
  sounds: SoundPack[];
  setSounds: React.Dispatch<React.SetStateAction<SoundPack[]>>;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  triggerToast: (msg: string, type: 'success' | 'achievement' | 'reward') => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({
  skins, setSkins, sounds, setSounds, userStats, setUserStats, triggerToast
}) => {
  const [tab, setTab] = useState<'themes' | 'sounds' | 'effects' | 'avatars'>('themes');

  const handleBuySkin = (skin: KeyboardSkin) => {
    if (userStats.coins < skin.cost) {
      triggerToast(`Need ${skin.cost} Coins — keep typing to earn!`, 'success');
      return;
    }
    playSuccessSound();
    setUserStats(prev => ({ ...prev, coins: prev.coins - skin.cost }));
    setSkins(prev => prev.map(s => ({ ...s, unlocked: s.id === skin.id ? true : s.unlocked, equipped: s.id === skin.id })));
    triggerToast(`${skin.name} equipped! 🎨`, 'reward');
  };

  const handleEquipSkin = (id: string) => {
    setSkins(prev => prev.map(s => ({ ...s, equipped: s.id === id })));
    triggerToast('Theme equipped!', 'success');
  };

  const TABS = ['themes', 'sounds', 'effects', 'avatars'] as const;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-[#FF7A1A]" />
          <h2 className="text-base font-bold text-white">Shop</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D22] border border-[#2D3037] rounded-xl">
          <Coins size={13} className="text-[#FF7A1A]" />
          <span className="text-xs font-black text-[#F5F5F5] font-mono">{userStats.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 bg-[#0F1116] p-1 rounded-xl border border-[#2D3037] overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize whitespace-nowrap transition-all cursor-pointer min-w-fit ${
              tab === t ? 'bg-[#1A1D22] text-[#FF7A1A] border border-[#FF7A1A]/15' : 'text-[#6B7280]'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Themes grid */}
      {tab === 'themes' && (
        <div className="grid grid-cols-2 gap-3">
          {skins.map((skin, i) => (
            <motion.div key={skin.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`relative p-4 rounded-2xl border transition-all ${
                skin.equipped
                  ? 'border-[#FF7A1A]/40 bg-[#FF7A1A]/6 shadow-glow'
                  : 'border-[#2D3037] bg-[#1A1D22]'
              }`}
            >
              {/* Color preview */}
              <div className="w-full h-14 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"
                style={{ background: skin.radialGradient || '#1A1D22', border: `1.5px solid ${skin.accentBg || '#FF7A1A'}30` }}>
                <div className="flex gap-1">
                  {[1,2,3,4].map(k => (
                    <div key={k} className="w-6 h-5 rounded-md border border-white/10"
                      style={{ background: skin.keyBg || '#2D3037' }} />
                  ))}
                </div>
              </div>

              <p className="text-xs font-bold text-[#F5F5F5] leading-none">{skin.name}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">{skin.colorName}</p>

              <div className="mt-3">
                {skin.unlocked ? (
                  <button
                    onClick={() => handleEquipSkin(skin.id)}
                    disabled={skin.equipped}
                    className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      skin.equipped
                        ? 'bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20 cursor-default'
                        : 'bg-[#0F1116] text-[#9CA3AF] border border-[#2D3037] hover:border-[#FF7A1A]/30'
                    }`}
                  >
                    {skin.equipped ? <><Check size={10} className="inline mr-1" />Equipped</> : 'Equip'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuySkin(skin)}
                    className="w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all text-black"
                    style={{ background: 'linear-gradient(135deg, #FF7A1A, #FF5000)' }}
                  >
                    <Coins size={10} className="inline mr-1" />{skin.cost.toLocaleString()}
                  </button>
                )}
              </div>

              {!skin.unlocked && <Lock size={12} className="absolute top-3 right-3 text-[#6B7280]" />}
              {skin.equipped && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check size={10} className="text-black" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Sounds */}
      {tab === 'sounds' && (
        <div className="space-y-3">
          {sounds.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                s.equipped ? 'border-[#FF7A1A]/30 bg-[#FF7A1A]/5' : 'border-[#2D3037] bg-[#1A1D22]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F1116] border border-[#2D3037] flex items-center justify-center text-lg flex-shrink-0">
                {s.soundType === 'mechanical' ? '⌨️' : s.soundType === 'bubble' ? '🫧' : s.soundType === 'synth' ? '🎹' : '⚡'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F5F5F5]">{s.name}</p>
                <p className="text-[10px] text-[#6B7280]">{s.description}</p>
              </div>
              {s.unlocked
                ? <button onClick={() => { setSounds(p => p.map(x => ({...x, equipped: x.id === s.id}))); triggerToast(`${s.name} equipped!`, 'success'); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${s.equipped ? 'bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20' : 'bg-[#0F1116] text-[#9CA3AF] border border-[#2D3037]'}`}>
                    {s.equipped ? '✓ On' : 'Use'}
                  </button>
                : <span className="text-[10px] text-[#FF7A1A] font-mono font-black flex items-center gap-0.5"><Coins size={10} />{s.cost}</span>
              }
            </motion.div>
          ))}
        </div>
      )}

      {/* Coming soon tabs */}
      {(tab === 'effects' || tab === 'avatars') && (
        <div className="tx-card text-center py-12">
          <ShoppingBag size={32} className="mx-auto text-[#2D3037] mb-3" />
          <p className="text-sm font-bold text-[#9CA3AF]">{tab.charAt(0).toUpperCase() + tab.slice(1)} coming soon</p>
          <p className="text-xs text-[#6B7280] mt-1">Unlocks at Level 20</p>
        </div>
      )}

      {/* Pro Pass */}
      <div className="p-4 rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} className="text-[#F59E0B]" />
          <p className="text-xs font-black text-[#F59E0B] uppercase tracking-wider">Pro Pass — $2.99/mo</p>
        </div>
        <p className="text-[11px] text-[#6B7280]">All themes · 2× XP multiplier · Premium effects · Ad-free</p>
        <button className="mt-3 w-full py-2.5 rounded-xl text-xs font-black tracking-widest uppercase cursor-pointer active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FF7A1A)', color: '#000' }}>
          Unlock Pro Pass
        </button>
      </div>
    </div>
  );
};
