export interface Player {
  uid: string
  username: string
  avatarUrl: string
  totalXp: number
  level: number
  unlockPoints: number
  gems: number
  isPro: boolean
  createdAt: Date
  lastActive: Date
}

export interface LeaderboardEntry {
  uid: string
  username: string
  avatarUrl: string
  totalXp: number
  level: number
  rank: number
}

export interface UnlockableFeature {
  id: string
  name: string
  description: string
  levelRequired: number
  unlockPointCost: number
  branch: 1 | 2 | 3 | 4
  isUnlocked: boolean
}

export interface XpState {
  totalXp: number
  level: number
  xpInCurrentLevel: number
  xpForNextLevel: number
  progress: number // 0.0 → 1.0
}

export interface ShopItem {
  id: string
  name: string
  description: string
  gemCost?: number
  realCost?: string
  type: 'theme' | 'gem_pack' | 'pro_pass' | 'xp_boost'
}
