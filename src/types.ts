export interface KeyboardSkin {
  id: string;
  name: string;
  colorName: string;
  primaryBg: string; // Tailwind class
  surfaceBg: string;
  keyBg: string;
  keyTextColor: string;
  accentBg: string;
  accentTextColor: string;
  shadowColor: string;
  description: string;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  radialGradient: string;
}

export interface SoundPack {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  soundType: 'mechanical' | 'bubble' | 'synth' | 'laser';
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly' | 'achievement';
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'speed' | 'accuracy' | 'streak' | 'volume';
  tier: number; // 1, 2, 3
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl?: string;
  xp: number;
  wpm: number;
  accuracy: number;
  avatarBg: string; // e.g., bg-orange-500
  isCurrentUser: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  xpNeeded: number;
  coins: number;
  streak: number;
  highestStreak: number;
  totalWords: number;
  totalKeys: number;
  avgWpm: number;
  avgAccuracy: number;
  dailyGoalProgress: number; // words typed today
  dailyGoalTarget: number;
}
