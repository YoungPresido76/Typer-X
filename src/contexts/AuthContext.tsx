import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, handleRedirectResult, signOut } from '../lib/auth';
import { getOrCreateUser, saveStats, subscribeToUser, UserProfile } from '../lib/firestore';
import { UserStats } from '../types';

interface AuthContextValue {
  user:        User | null;
  profile:     UserProfile | null;
  userStats:   UserStats | null;
  loading:     boolean;
  updateStats: (stats: UserStats) => Promise<void>;
  logout:      () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:        null,
  profile:     null,
  userStats:   null,
  loading:     true,
  updateStats: async () => {},
  logout:      async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Handle mobile redirect result on mount */
  useEffect(() => { handleRedirectResult(); }, []);

  /* Listen to Firebase auth state */
  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const p = await getOrCreateUser(
          firebaseUser.uid,
          firebaseUser.email ?? '',
          firebaseUser.displayName,
          firebaseUser.photoURL,
        );
        setProfile(p);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });
    return unsub;
  }, []);

  /* Subscribe to real-time profile updates once logged in */
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUser(user.uid, setProfile);
    return unsub;
  }, [user]);

  const updateStats = useCallback(async (stats: UserStats) => {
    if (!user) return;
    // Optimistically update local state
    setProfile(prev => prev ? { ...prev, stats } : prev);
    await saveStats(user.uid, stats);
  }, [user]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        userStats: profile?.stats ?? null,
        loading,
        updateStats,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
