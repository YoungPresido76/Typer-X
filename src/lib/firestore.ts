import {
  doc, getDoc, setDoc, updateDoc,
  serverTimestamp, Timestamp,
  collection, query, orderBy, limit, getDocs,
  onSnapshot, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserStats, Mission } from '../types';

/* ── Firestore document shape ── */
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp | null;
  lastActive: Timestamp | null;
  stats: UserStats;
  missions?: MissionProgress; // persisted mission state
}

/* Mission progress stored per user */
export interface MissionProgress {
  active: Mission[];          // today's active missions
  lastReset: string;          // ISO date string — when daily missions were last rotated
  weeklyReset: string;        // ISO date string — when weekly missions were last rotated
}

/* ── Default stats for brand-new users ── */
export const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  xpNeeded: 1000,
  coins: 100,
  streak: 0,
  highestStreak: 0,
  totalWords: 0,
  totalKeys: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  dailyGoalProgress: 0,
  dailyGoalTarget: 5000,
};

/** Create or fetch user document on first login */
export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null,
): Promise<UserProfile> {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, { lastActive: serverTimestamp() });
    return snap.data() as UserProfile;
  }

  const username = displayName?.replace(/\s+/g, '') ?? `Typer${uid.slice(0, 5)}`;
  const profile = {
    uid, username, email, photoURL,
    createdAt:  serverTimestamp(),
    lastActive: serverTimestamp(),
    stats: DEFAULT_STATS,
    missions: null,
  };

  await setDoc(ref, profile);
  return { ...profile, createdAt: null, lastActive: null } as unknown as UserProfile;
}

/** Save full stats object + mirror to leaderboard */
export async function saveStats(uid: string, stats: UserStats): Promise<void> {
  const batch = writeBatch(db);

  batch.update(doc(db, 'users', uid), {
    stats,
    lastActive: serverTimestamp(),
  });

  batch.set(doc(db, 'leaderboard', uid), {
    uid,
    xp:          stats.xp,
    level:       stats.level,
    avgWpm:      stats.avgWpm,
    avgAccuracy: stats.avgAccuracy,
    updatedAt:   serverTimestamp(),
  }, { merge: true });

  await batch.commit();
}

/** Save mission progress to Firestore */
export async function saveMissions(
  uid: string,
  missions: Mission[],
  lastReset: string,
  weeklyReset: string,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    missions: { active: missions, lastReset, weeklyReset },
  });
}

/** Subscribe to own user doc in real time */
export function subscribeToUser(
  uid: string,
  cb: (profile: UserProfile) => void,
) {
  return onSnapshot(doc(db, 'users', uid), snap => {
    if (snap.exists()) cb(snap.data() as UserProfile);
  });
}

/* ── Leaderboard ── */
export interface LeaderboardEntry {
  uid:         string;
  xp:          number;
  level:       number;
  avgWpm:      number;
  avgAccuracy: number;
  username?:   string;
  photoURL?:   string | null;
}

/** Optimised leaderboard subscription — batch-fetches usernames once */
export function subscribeToLeaderboard(
  n: number,
  cb: (entries: LeaderboardEntry[]) => void,
) {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('xp', 'desc'),
    limit(n),
  );

  return onSnapshot(q, async snap => {
    // Batch-fetch user docs for username/avatar enrichment
    const uids = snap.docs.map(d => d.id);
    const userSnaps = await Promise.allSettled(
      uids.map(uid => getDoc(doc(db, 'users', uid)))
    );

    const usernameMap: Record<string, { username: string; photoURL: string | null }> = {};
    userSnaps.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value.exists()) {
        const u = res.value.data() as UserProfile;
        usernameMap[uids[i]] = { username: u.username, photoURL: u.photoURL };
      }
    });

    const entries: LeaderboardEntry[] = snap.docs.map(d => {
      const entry = d.data() as LeaderboardEntry;
      const info  = usernameMap[entry.uid];
      return {
        ...entry,
        username: info?.username ?? `User${entry.uid.slice(0, 4)}`,
        photoURL: info?.photoURL ?? null,
      };
    });

    cb(entries);
  });
}
