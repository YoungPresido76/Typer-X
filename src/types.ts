export type NavTab = 'home' | 'tree' | 'leaderboard' | 'shop' | 'settings';

export type LevelTitle =
  | 'Glyph Apprentice'
  | 'Key Carver'
  | 'Word Forger'
  | 'Cipher Knight'
  | 'Glyph Master'
  | 'Eternal Scribe';

export interface UserStats {
  level: number;
  xp: number;
  xpNeeded: number;
  gems: number;          // premium currency
  streak: number;
  highestStreak: number;
  totalWords: number;
  totalKeys: number;
  avgWpm: number;
  avgAccuracy: number;
  dailyGoalXp: number;     // XP earned today
  dailyGoalTarget: number; // daily XP target
  username: string;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly' | 'achievement';
  title: string;
  description: string;
  xpReward: number;
  gemReward: number;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  level: number;
  xp: number;
  wpm: number;
  avatarBg: string;
  isCurrentUser?: boolean;
}

export interface ShopItem {
  id: string;
  category: 'themes' | 'keySounds' | 'effects' | 'avatars';
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  previewColor?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Toast {
  id: number;
  text: string;
  type: 'success' | 'achievement' | 'reward' | 'xp';
}
