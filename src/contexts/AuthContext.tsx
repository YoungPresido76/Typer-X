import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut } from '../lib/auth';
import { getOrCreateUser, saveStats, subscribeToUser, UserProfile, DEFAULT_STATS } from '../lib/firestore';
import { UserStats } from '../types';

interface AuthContextValue {
  user:        User | null;
  profile:     UserProfile | null;
  userStats:   UserStats | null;
  loading:     boolean;
  firestoreError: string | null;
  updateStats: (stats: UserStats) => Promise<void>;
  logout:      () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, profile: null, userStats: null, loading: true, firestoreError: null,
  updateStats: async () => {}, logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]               = useState<User | null>(null);
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const p = await getOrCreateUser(
            firebaseUser.uid,
            firebaseUser.email ?? '',
            firebaseUser.displayName,
            firebaseUser.photoURL,
          );
          setProfile(p);
          setFirestoreError(null);
        } catch (err) {
          console.error('Firestore error:', err);
          // Firestore failed (not set up yet, rules blocking, etc.)
          // Still let the user in with a local-only profile
          setFirestoreError(
            'Firestore not set up yet — running in offline mode. Enable Firestore in Firebase Console.'
          );
          setProfile({
            uid: firebaseUser.uid,
            username: firebaseUser.displayName?.replace(/\s+/g, '') ?? `Typer${firebaseUser.uid.slice(0, 5)}`,
            email: firebaseUser.email ?? '',
            photoURL: firebaseUser.photoURL,
            createdAt: null,
            lastActive: null,
            stats: DEFAULT_STATS,
          });
        } finally {
          // Always unblock the app — never get stuck loading
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || firestoreError) return;
    const unsub = subscribeToUser(user.uid, setProfile);
    return unsub;
  }, [user, firestoreError]);

  const updateStats = useCallback(async (stats: UserStats) => {
    if (!user) return;
    setProfile(prev => prev ? { ...prev, stats } : prev);
    if (!firestoreError) {
      await saveStats(user.uid, stats).catch(console.error);
    }
  }, [user, firestoreError]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    setFirestoreError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, userStats: profile?.stats ?? null, loading, firestoreError, updateStats, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
