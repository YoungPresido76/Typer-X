import { LevelTitle } from '../types';

/** XP required to REACH a given level (cumulative threshold) */
export function xpForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(level, 1.5));
}

/** XP needed to go from level → level+1 (delta) */
export function xpDeltaForLevel(level: number): number {
  return xpForLevel(level + 1) - xpForLevel(level);
}

/** Current level from total accumulated XP */
export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
    if (level >= 50) return 50;
  }
  return level;
}

/** XP progress within the current level (0–1) */
export function xpProgress(totalXP: number): number {
  const level = levelFromXP(totalXP);
  if (level >= 50) return 1;
  const start = xpForLevel(level);
  const end = xpForLevel(level + 1);
  return (totalXP - start) / (end - start);
}

/** Human-readable title for a given level */
export function getLevelTitle(level: number): LevelTitle {
  if (level >= 50) return 'Eternal Scribe';
  if (level >= 40) return 'Glyph Master';
  if (level >= 30) return 'Cipher Knight';
  if (level >= 20) return 'Word Forger';
  if (level >= 10) return 'Key Carver';
  return 'Glyph Apprentice';
}

/** Accent color class per title (for badges/labels) */
export function getTitleColor(title: LevelTitle): string {
  switch (title) {
    case 'Eternal Scribe':  return 'text-amber-400';
    case 'Glyph Master':    return 'text-violet-400';
    case 'Cipher Knight':   return 'text-cyan-400';
    case 'Word Forger':     return 'text-emerald-400';
    case 'Key Carver':      return 'text-sky-400';
    default:                return 'text-gray-400';
  }
}

/** Border/bg tint per title */
export function getTitleBg(title: LevelTitle): string {
  switch (title) {
    case 'Eternal Scribe':  return 'bg-amber-500/10 border-amber-500/20';
    case 'Glyph Master':    return 'bg-violet-500/10 border-violet-500/20';
    case 'Cipher Knight':   return 'bg-cyan-500/10 border-cyan-500/20';
    case 'Word Forger':     return 'bg-emerald-500/10 border-emerald-500/20';
    case 'Key Carver':      return 'bg-sky-500/10 border-sky-500/20';
    default:                return 'bg-gray-500/10 border-gray-500/20';
  }
}
