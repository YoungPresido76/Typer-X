import { useState, useEffect, useCallback } from 'react';
import { Mission, UserStats } from '../types';
import { getActiveMissions } from '../data/missions';
import { saveMissions } from '../lib/firestore';

const DAILY_ACTIVE  = 5;
const WEEKLY_ACTIVE = 4;

function todayISO()       { return new Date().toISOString().split('T')[0]; }
function thisWeekISO()    {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay()); // Sunday
  return d.toISOString().split('T')[0];
}

interface UseMissionsResult {
  missions:     Mission[];
  claimMission: (id: string, xpReward: number, coinReward: number) => void;
  syncProgress: (newStats: Partial<UserStats>) => void;
}

export function useMissions(
  uid: string | null,
  userStats: UserStats | null,
  persistedMissions: { active: Mission[]; lastReset: string; weeklyReset: string } | null | undefined,
  updateStats: (s: UserStats) => Promise<void>,
  triggerToast: (msg: string, type: 'success' | 'achievement' | 'reward') => void,
): UseMissionsResult {
  const [missions, setMissions] = useState<Mission[]>([]);

  /* ── Initialise / rotate missions ── */
  useEffect(() => {
    const today      = todayISO();
    const thisWeek   = thisWeekISO();

    if (persistedMissions && persistedMissions.active.length > 0) {
      let active = [...persistedMissions.active];
      let changed = false;

      // Rotate daily missions if day has changed
      if (persistedMissions.lastReset !== today) {
        const newDailies = getActiveMissions(DAILY_ACTIVE, 0);
        active = [
          ...newDailies,
          ...active.filter(m => m.type !== 'daily'),
        ];
        changed = true;
      }

      // Rotate weekly missions if week has changed
      if (persistedMissions.weeklyReset !== thisWeek) {
        const newWeeklies = getActiveMissions(0, WEEKLY_ACTIVE);
        active = [
          ...active.filter(m => m.type !== 'weekly'),
          ...newWeeklies,
        ];
        changed = true;
      }

      setMissions(active);

      if (changed && uid) {
        saveMissions(uid, active, today, thisWeek).catch(console.error);
      }
    } else {
      // First time — generate fresh set
      const fresh = getActiveMissions(DAILY_ACTIVE, WEEKLY_ACTIVE);
      setMissions(fresh);
      if (uid) {
        saveMissions(uid, fresh, today, thisWeek).catch(console.error);
      }
    }
  }, [uid, persistedMissions]);

  /* ── Claim a completed mission ── */
  const claimMission = useCallback((id: string, xpReward: number, coinReward: number) => {
    if (!userStats || !uid) return;

    setMissions(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, claimed: true } : m);
      saveMissions(uid, updated, todayISO(), thisWeekISO()).catch(console.error);
      return updated;
    });

    // XP + level up logic
    let newXp    = userStats.xp + xpReward;
    let newLevel = userStats.level;
    let newXpNeeded = userStats.xpNeeded;

    while (newXp >= newXpNeeded) {
      newXp      -= newXpNeeded;
      newLevel   += 1;
      newXpNeeded = Math.floor(1000 * Math.pow(newLevel, 1.5));
    }

    const next: UserStats = {
      ...userStats,
      xp:       newXp,
      level:    newLevel,
      xpNeeded: newXpNeeded,
      coins:    userStats.coins + coinReward,
    };

    updateStats(next);
    triggerToast(`+${xpReward} XP & +${coinReward} Coins claimed!`, 'reward');
  }, [uid, userStats, updateStats, triggerToast]);

  /* ── Sync real IME progress into active missions ──
     Called when Typer X keyboard sends XP events.
     For now this is a no-op shell — the IME bridge
     will call this in Chat 12 when the keyboard is built. */
  const syncProgress = useCallback((newStats: Partial<UserStats>) => {
    if (!newStats) return;
    setMissions(prev =>
      prev.map(m => {
        if (m.claimed) return m;
        let cv = m.currentValue;

        switch (m.id.split('-')[1]) {
          case 'words':   cv = newStats.totalWords   ?? cv; break;
          case 'keys':    cv = newStats.totalKeys    ?? cv; break;
          case 'wpm':     cv = newStats.avgWpm       ?? cv; break;
          case 'acc':     cv = newStats.avgAccuracy  ?? cv; break;
          case 'streak':  cv = newStats.streak       ?? cv; break;
          case 'xp':      cv = newStats.xp           ?? cv; break;
        }

        const completed = cv >= m.targetValue;
        return { ...m, currentValue: cv, completed };
      })
    );
  }, []);

  return { missions, claimMission, syncProgress };
}
