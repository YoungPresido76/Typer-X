import { KeyboardSkin, SoundPack, Mission, Badge, LeaderboardUser } from './types';

export const INITIAL_SKINS: KeyboardSkin[] = [
  {
    id: 'neon-orange',
    name: 'Neon Orange',
    colorName: 'Orange',
    primaryBg: 'from-orange-500/20 to-orange-500/5 border border-orange-500/30',
    surfaceBg: 'bg-[#121417]/95 border border-orange-500/10',
    keyBg: 'bg-[#1D1D22] hover:bg-[#25252B] active:bg-orange-500/20 border-b-2 border-b-[#0D0D11] active:border-b-orange-500 text-gray-200 hover:text-orange-400',
    keyTextColor: 'text-gray-200',
    accentBg: 'bg-gradient-to-r from-orange-500 to-orange-600 active:from-orange-600 active:to-orange-700 shadow-lg shadow-orange-500/20 text-white',
    accentTextColor: 'text-white',
    shadowColor: 'shadow-orange-500/10',
    description: 'The standard issue cybernetic interface. Bold tactile feedback with warm neon glowing nodes.',
    cost: 0,
    unlocked: true,
    equipped: true,
    radialGradient: 'rgba(249, 115, 22, 0.15)'
  },
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    colorName: 'Blue',
    primaryBg: 'from-blue-500/20 to-blue-500/5 border border-blue-500/30',
    surfaceBg: 'bg-[#121417]/95 border border-blue-500/10',
    keyBg: 'bg-[#1D1D22] hover:bg-[#25252B] active:bg-blue-500/20 border-b-2 border-b-[#0D0D11] active:border-b-blue-500 text-gray-200 hover:text-blue-400',
    keyTextColor: 'text-gray-200',
    accentBg: 'bg-gradient-to-r from-blue-500 to-blue-600 active:from-blue-600 active:to-blue-700 shadow-lg shadow-blue-500/20 text-white',
    accentTextColor: 'text-white',
    shadowColor: 'shadow-blue-500/10',
    description: 'High-frequency subzero ice skin. Emits deep blue cooling waves and cold pulse feedback.',
    cost: 2000,
    unlocked: false,
    equipped: false,
    radialGradient: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    colorName: 'Green',
    primaryBg: 'from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30',
    surfaceBg: 'bg-[#121417]/95 border border-emerald-500/10',
    keyBg: 'bg-[#1D1D22] hover:bg-[#25252B] active:bg-emerald-500/20 border-b-2 border-b-[#0D0D11] active:border-b-emerald-500 text-gray-200 hover:text-emerald-400',
    keyTextColor: 'text-gray-200',
    accentBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 active:from-emerald-600 active:to-emerald-700 shadow-lg shadow-emerald-500/20 text-white',
    accentTextColor: 'text-white',
    shadowColor: 'shadow-emerald-500/10',
    description: 'Direct tap into the source code grid. Green cascading numbers pulse behind every key pressed.',
    cost: 2000,
    unlocked: false,
    equipped: false,
    radialGradient: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colorName: 'Purple',
    primaryBg: 'from-purple-500/20 to-purple-500/5 border border-purple-500/30',
    surfaceBg: 'bg-[#121417]/95 border border-purple-500/10',
    keyBg: 'bg-[#1D1D22] hover:bg-[#25252B] active:bg-purple-500/20 border-b-2 border-b-[#0D0D11] active:border-b-purple-500 text-gray-200 hover:text-purple-400',
    keyTextColor: 'text-gray-200',
    accentBg: 'bg-gradient-to-r from-purple-500 to-purple-600 active:from-purple-600 active:to-purple-700 shadow-lg shadow-purple-500/20 text-white',
    accentTextColor: 'text-white',
    shadowColor: 'shadow-purple-500/10',
    description: 'An premium, ultra-dense dark-matter composite with heavy obsidian keystroke frames and purple plasma flares.',
    cost: 2000,
    unlocked: false,
    equipped: false,
    radialGradient: 'rgba(139, 92, 246, 0.15)'
  }
];

export const INITIAL_SOUNDPACKS: SoundPack[] = [
  {
    id: 'mech-click',
    name: 'Tactile Mechanical',
    description: 'High-satisfaction double blue clicky switches, simulated using real dual audio harmonics.',
    cost: 0,
    unlocked: true,
    equipped: true,
    soundType: 'mechanical'
  },
  {
    id: 'bubble-pop',
    name: 'ASMR Bubble Pop',
    description: 'Soft bubble decompression sound. Extremely silent, deeply calming, and therapeutic.',
    cost: 1000,
    unlocked: false,
    equipped: false,
    soundType: 'bubble'
  },
  {
    id: 'retro-synth',
    name: '8-Bit Retro Synth',
    description: 'Classic chiptune synthesized blip. Pitch increases slightly as you build high-speed streak typing multipliers.',
    cost: 1500,
    unlocked: false,
    equipped: false,
    soundType: 'synth'
  },
  {
    id: 'laser-zap',
    name: 'Cosmic Laser Beam',
    description: 'Fast swept futuristic space gun blast. High-frequency release suitable for rapid keystrokes.',
    cost: 1500,
    unlocked: false,
    equipped: false,
    soundType: 'laser'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'daily-words',
    type: 'daily',
    title: 'Type 1,000 words today',
    description: 'Show typing endurance in our sandbox environment.',
    xpReward: 100,
    coinReward: 300,
    currentValue: 247,
    targetValue: 1000,
    completed: false,
    claimed: false,
    iconName: 'Keyboard'
  },
  {
    id: 'daily-accuracy',
    type: 'daily',
    title: 'Maintain 95% accuracy',
    description: 'Minimum 50 letters typed with high accuracy standards.',
    xpReward: 100,
    coinReward: 300,
    currentValue: 94,
    targetValue: 95,
    completed: false,
    claimed: false,
    iconName: 'Target'
  },
  {
    id: 'daily-swipe',
    type: 'daily',
    title: 'Use swipe typing 50 times',
    description: 'Experience trace curves using quick swipe gestures inside the mock keyboard.',
    xpReward: 60,
    coinReward: 200,
    currentValue: 32,
    targetValue: 50,
    completed: false,
    claimed: false,
    iconName: 'Fingerprint'
  },
  {
    id: 'weekly-words',
    type: 'weekly',
    title: 'Type 5,000 words in sandbox',
    description: 'Long-term stamina test. Gain solid typing speed metrics.',
    xpReward: 200,
    coinReward: 600,
    currentValue: 2643,
    targetValue: 5000,
    completed: false,
    claimed: false,
    iconName: 'BarChart'
  },
  {
    id: 'ach-speedster',
    type: 'achievement',
    title: 'Perfect Speedster',
    description: 'Reach an instantaneous speed of 100 Words Per Minute (WPM) during any block.',
    xpReward: 300,
    coinReward: 1000,
    currentValue: 68,
    targetValue: 100,
    completed: false,
    claimed: false,
    iconName: 'Lightning'
  },
  {
    id: 'ach-consistency',
    type: 'achievement',
    title: 'Consistent Compyle',
    description: 'Log typing sessions with an active streak for exactly 7 days straight.',
    xpReward: 300,
    coinReward: 1000,
    currentValue: 6, // 6 days
    targetValue: 7,
    completed: false,
    claimed: false,
    iconName: 'Calendar'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-speedster',
    name: 'Speedster',
    description: 'Achieved 100 WPM in a single typing test session.',
    category: 'speed',
    tier: 1,
    unlocked: true,
    unlockedAt: '2026-05-24'
  },
  {
    id: 'badge-consistency',
    name: 'Consistency King',
    description: 'Maintained an unbroken typing streak of 7 days in a row.',
    category: 'streak',
    tier: 1,
    unlocked: true,
    unlockedAt: '2026-05-25'
  },
  {
    id: 'badge-accuracy',
    name: 'Perfect Accuracy',
    description: 'Maintained 100% accuracy over a 50+ word paragraph.',
    category: 'accuracy',
    tier: 2,
    unlocked: false
  },
  {
    id: 'badge-marathon',
    name: 'Marathon Writer',
    description: 'Typed a cumulative total of 10,000 words in the companion sandboxes.',
    category: 'volume',
    tier: 3,
    unlocked: false
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'PhantomType', xp: 128450, wpm: 88, accuracy: 98, avatarBg: 'bg-[#FF5A1F]', isCurrentUser: false },
  { rank: 2, name: 'SpeedDemon', xp: 115230, wpm: 92, accuracy: 93, avatarBg: 'bg-emerald-500', isCurrentUser: false },
  { rank: 3, name: 'KeyMaster', xp: 108770, wpm: 75, accuracy: 96, avatarBg: 'bg-indigo-500', isCurrentUser: false },
  { rank: 5, name: 'QuickFingers', xp: 88210, wpm: 84, accuracy: 91, avatarBg: 'bg-pink-500', isCurrentUser: false },
  { rank: 6, name: 'HexHammer', xp: 72150, wpm: 60, accuracy: 95, avatarBg: 'bg-teal-500', isCurrentUser: false },
  { rank: 7, name: 'MacroMage', xp: 64920, wpm: 67, accuracy: 94, avatarBg: 'bg-fuchsia-500', isCurrentUser: false }
];
