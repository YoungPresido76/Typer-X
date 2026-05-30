import React, { useState } from 'react';
import { KeyboardSkin, SoundPack, UserStats } from '../types';
import { playSuccessSound } from '../audio';
import { ShieldCheck, ShoppingCart, Key, Sparkles, Volume2, Coins, AlertCircle } from 'lucide-react';

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
  skins,
  setSkins,
  sounds,
  setSounds,
  userStats,
  setUserStats,
  triggerToast,
}) => {
  const [subTab, setSubTab] = useState<'skins' | 'sounds'>('skins');

  const handleEquipSkin = (id: string) => {
    setSkins(prev => prev.map(s => ({
      ...s,
      equipped: s.id === id
    })));
    triggerToast('Keyboard Theme Equipped!', 'success');
  };

  const handlePurchaseSkin = (skin: KeyboardSkin) => {
    if (userStats.coins < skin.cost) {
      triggerToast(`Insufficient funds! Need ${skin.cost} Coins. Type in Sandbox to earn!`, 'success');
      return;
    }

    playSuccessSound();
    
    // Deduct coins
    setUserStats(prev => ({
      ...prev,
      coins: prev.coins - skin.cost
    }));

    // Unlock skin
    setSkins(prev => prev.map(s => {
      if (s.id === skin.id) {
        return { ...s, unlocked: true, equipped: true };
      }
      return { ...s, equipped: s.id === skin.id ? true : false };
    }));

    triggerToast(`Skins Grid Unlocked: ${skin.name}! 🎨`, 'reward');
  };

  const handleEquipSound = (id: string) => {
    setSounds(prev => prev.map(s => ({
      ...s,
      equipped: s.id === id
    })));
    triggerToast('Mechanical key click equipped!', 'success');
  };

  const handlePurchaseSound = (sound: SoundPack) => {
    if (userStats.coins < sound.cost) {
      triggerToast(`Insufficient funds! Need ${sound.cost} Coins. Type in Sandbox to earn!`, 'success');
      return;
    }

    playSuccessSound();

    // Deduct coins
    setUserStats(prev => ({
      ...prev,
      coins: prev.coins - sound.cost
    }));

    // Unlock sound pack
    setSounds(prev => prev.map(s => {
      if (s.id === sound.id) {
        return { ...s, unlocked: true, equipped: true };
      }
      return { ...s, equipped: s.id === sound.id ? true : false };
    }));

    triggerToast(`Soundpack Activated: ${sound.name}! 🔊`, 'reward');
  };

  return (
    <div className="space-y-6">
      
      {/* Balance Indicator & Mini Header */}
      <div className="bg-[#1A1D22] p-4.5 rounded-2xl border border-neutral-850 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Typer X Rewards Shop</h3>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Spend earned currency on customizable skins & click packs</p>
        </div>
        
        {/* Shiny Coins Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl font-bold text-sm">
          <Coins className="w-4 h-4" />
          <span>{userStats.coins.toLocaleString()}</span>
          <span className="text-[9px] text-gray-400 font-normal">pts</span>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex bg-[#121417] p-1 rounded-xl border border-neutral-850 max-w-xs mx-auto">
        <button
          onClick={() => setSubTab('skins')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            subTab === 'skins'
              ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Keyboard Skins
        </button>
        <button
          onClick={() => setSubTab('sounds')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            subTab === 'sounds'
              ? 'bg-[#1A1D22] text-orange-500 border border-orange-500/10'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Key Sound Packs
        </button>
      </div>

      {subTab === 'skins' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skins.map((skin) => (
            <div 
              key={skin.id} 
              className={`p-5 rounded-2xl bg-[#1A1D22] border transition-all flex flex-col justify-between ${
                skin.equipped ? 'border-orange-500 shadow-md shadow-orange-500/5' : 'border-neutral-850 hover:border-neutral-800'
              }`}
            >
              <div>
                {/* Simulated Skin Preview Card */}
                <div 
                  className={`w-full h-24 rounded-xl mb-4 p-3 flex flex-col justify-between relative overflow-hidden bg-gradient-to-tr ${skin.primaryBg}`}
                >
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] font-mono font-black text-white/90 bg-[#121417]/90 px-1.5 py-0.5 rounded uppercase">
                      Skin Name: {skin.name}
                    </span>
                    {skin.equipped && (
                      <span className="text-[8px] bg-orange-500 text-black px-1.5 py-0.5 rounded font-black font-sans">
                        EQUIPPED
                      </span>
                    )}
                  </div>

                  {/* Tiny mock virtual layouts in sample card */}
                  <div className="flex gap-1 z-10">
                    {['q', 'w', 'e', 'r', 't'].map(k => (
                      <div key={k} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black uppercase text-gray-300 pointer-events-none select-none border-b border-b-[#0D0D11] ${skin.keyBg}`}>
                        {k}
                      </div>
                    ))}
                    <div className="w-10 h-6 bg-gradient-to-r from-orange-400 to-amber-500 rounded flex items-center justify-center text-[8px] text-white/90 font-bold uppercase overflow-hidden border-b border-b-orange-600">
                      Space
                    </div>
                  </div>

                  {/* Ambient glowing circle element in card */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-45"
                    style={{ background: `radial-gradient(circle at 70% 30%, ${skin.radialGradient}, transparent 60%)` }}
                  />
                </div>

                <h4 className="text-sm font-bold text-gray-200">{skin.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{skin.description}</p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-neutral-850/60 flex items-center justify-between gap-2">
                <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">
                  {skin.unlocked ? 'Unlocked ✔' : 'Premium lock'}
                </span>

                {skin.equipped ? (
                  <button disabled className="px-4 py-1.5 bg-orange-600/10 text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold leading-normal font-sans">
                    Active theme
                  </button>
                ) : skin.unlocked ? (
                  <button 
                    onClick={() => handleEquipSkin(skin.id)}
                    className="px-4 py-1.5 bg-neutral-[#222] hover:bg-[#20242B] text-gray-200 hover:text-white border border-neutral-800 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                  >
                    Equip Theme
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchaseSkin(skin)}
                    className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Coins className="w-3.5 h-3.5" /> Buy for {skin.cost}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sounds.map((sound) => (
            <div 
              key={sound.id} 
              className={`p-5 rounded-2xl bg-[#1A1D22] border transition-all flex flex-col justify-between ${
                sound.equipped ? 'border-orange-500 shadow-md shadow-orange-500/5' : 'border-neutral-850 hover:border-neutral-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-[#121417] rounded-xl text-orange-400 border border-neutral-800">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  {sound.equipped && (
                    <span className="text-[8px] bg-orange-500 text-black px-1.5 py-0.5 rounded font-black font-sans leading-none">
                      ACTIVE PACK
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-gray-200 mt-4">{sound.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{sound.description}</p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-neutral-850/60 flex items-center justify-between gap-2">
                <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">
                  {sound.unlocked ? 'License active' : 'Locked Pack'}
                </span>

                {sound.equipped ? (
                  <button disabled className="px-4 py-1.5 bg-orange-600/10 text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold font-sans">
                    Active sound
                  </button>
                ) : sound.unlocked ? (
                  <button 
                    onClick={() => handleEquipSound(sound.id)}
                    className="px-4 py-1.5 bg-neutral-[#222] hover:bg-[#20242B] text-gray-200 hover:text-white border border-neutral-800 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                  >
                    Equip Pack
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchaseSound(sound)}
                    className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Coins className="w-3.5 h-3.5" /> Buy for {sound.cost}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
