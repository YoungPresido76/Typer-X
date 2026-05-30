import React, { useState } from 'react';
import { Settings, ChevronRight, Bell, Shield, Palette, Keyboard, Info } from 'lucide-react';

const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${on ? 'bg-cyan-500' : 'bg-white/12'}`}
  >
    <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
  </button>
);

export const SettingsScreen: React.FC = () => {
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const Row: React.FC<{ icon: React.ReactNode; label: string; sub?: string; right?: React.ReactNode }> = ({ icon, label, sub, right }) => (
    <div className="flex items-center gap-3 py-3.5 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-200">{label}</p>
        {sub && <p className="text-[9px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {right ?? <ChevronRight className="w-3.5 h-3.5 text-gray-600" />}
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none px-4 py-4">
      <div className="flex items-center gap-2 mb-5">
        <Settings className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-black text-white">Settings</h2>
      </div>

      {/* Account */}
      <div className="mb-4 p-4 rounded-2xl bg-[#14161A] border border-white/6">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Account</p>
        <Row icon={<div className="w-5 h-5 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white text-xs font-black flex items-center justify-center">G</div>} label="TyperX" sub="Elite Typist · Level 14" />
        <Row icon={<Shield className="w-4 h-4 text-violet-400" />} label="Google Sign-In" sub="Connected" right={<span className="text-[9px] text-emerald-400 font-bold">✓</span>} />
      </div>

      {/* Preferences */}
      <div className="mb-4 p-4 rounded-2xl bg-[#14161A] border border-white/6">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Preferences</p>
        <Row icon={<Keyboard className="w-4 h-4 text-cyan-400" />} label="Haptic Feedback" sub="Vibrate on key press" right={<Toggle on={haptics} onChange={() => setHaptics(p => !p)} />} />
        <Row icon={<Bell className="w-4 h-4 text-violet-400" />} label="Key Sounds" sub="Click audio on press" right={<Toggle on={sounds} onChange={() => setSounds(p => !p)} />} />
        <Row icon={<Bell className="w-4 h-4 text-amber-400" />} label="Push Notifications" sub="Streak & mission alerts" right={<Toggle on={notifications} onChange={() => setNotifications(p => !p)} />} />
        <Row icon={<Palette className="w-4 h-4 text-gray-400" />} label="Theme" sub="Glyph Dark (default)" />
      </div>

      {/* Privacy */}
      <div className="mb-4 p-4 rounded-2xl bg-[#14161A] border border-white/6">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Privacy</p>
        <Row icon={<Shield className="w-4 h-4 text-gray-400" />} label="Share Analytics" sub="Help improve Typer X" right={<Toggle on={analytics} onChange={() => setAnalytics(p => !p)} />} />
      </div>

      {/* About */}
      <div className="p-4 rounded-2xl bg-[#14161A] border border-white/6">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">About</p>
        <Row icon={<Info className="w-4 h-4 text-gray-400" />} label="Typer X" sub="v0.2.0 · Chat 2 Build" right={<span className="text-[9px] text-gray-600 font-mono">v0.2</span>} />
      </div>

      <p className="text-center text-[9px] text-gray-700 font-mono mt-5">
        TYPER X · EVERY WORD LEVELS YOU UP
      </p>
    </div>
  );
};
