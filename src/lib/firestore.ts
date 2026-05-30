import {
  doc, getDoc, setDoc, updateDoc,
  serverTimestamp, Timestamp,
  collection, query, orderBy, limit, getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserStats } from '../types';

/* ── Firestore document shape ── */
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp | null;
  lastActive: Timestamp | null;
  stats: UserStats;
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
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Update lastActive on every login
    await updateDoc(ref, { lastActive: serverTimestamp() });
    return snap.data() as UserProfile;
  }

  // New user — seed document
  const username = displayName?.replace(/\s+/g, '') ?? `Typer${uid.slice(0, 5)}`;
  const profile: Omit<UserProfile, 'createdAt' | 'lastActive'> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    lastActive: ReturnType<typeof serverTimestamp>;
  } = {
    uid,
    username,
    email,
    photoURL,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    stats: DEFAULT_STATS,
  };

  await setDoc(ref, profile);
  return { ...profile, createdAt: null, lastActive: null };
}

/** Save full stats object (call after XP gains, level ups etc.) */
export async function saveStats(uid: string, stats: UserStats): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { stats, lastActive: serverTimestamp() });

  // Mirror to leaderboard collection for global ranking
  const lbRef = doc(db, 'leaderboard', uid);
  await setDoc(lbRef, {
    uid,
    xp: stats.xp,
    level: stats.level,
    avgWpm: stats.avgWpm,
    avgAccuracy: stats.avgAccuracy,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/** Subscribe to own user doc in real time */
export function subscribeToUser(
  uid: string,
  cb: (profile: UserProfile) => void,
) {
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, snap => {
    if (snap.exists()) cb(snap.data() as UserProfile);
  });
}

/* ── Leaderboard ── */
export interface LeaderboardEntry {
  uid: string;
  xp: number;
  level: number;
  avgWpm: number;
  avgAccuracy: number;
  username?: string;
  photoURL?: string | null;
}

/** Fetch top-N leaderboard entries (one-shot) */
export async function fetchLeaderboard(n = 20): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('xp', 'desc'),
    limit(n),
  );
  const snap = await getDocs(q);

  // Enrich with username from user docs
  const entries = await Promise.all(
    snap.docs.map(async d => {
      const entry = d.data() as LeaderboardEntry;
      try {
        const userSnap = await getDoc(doc(db, 'users', entry.uid));
        if (userSnap.exists()) {
          const u = userSnap.data() as UserProfile;
          entry.username = u.username;
          entry.photoURL = u.photoURL;
        }
      } catch { /* non-critical */ }
      return entry;
    }),
  );

  return entries;
}

/** Subscribe to leaderboard in real time */
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
    const entries = await Promise.all(
      snap.docs.map(async d => {
        const entry = d.data() as LeaderboardEntry;
        try {
          const userSnap = await getDoc(doc(db, 'users', entry.uid));
          if (userSnap.exists()) {
            const u = userSnap.data() as UserProfile;
            entry.username = u.username;
            entry.photoURL = u.photoURL;
          }
        } catch { /* non-critical */ }
        return entry;
      }),
    );
    cb(entries);
  });
}
