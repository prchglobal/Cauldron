import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LockState = 'locked' | 'test' | 'unlocked';

export interface FeatureLocks {
  tarot: LockState;
  horoscopes: LockState;
  astrology: LockState;
}

interface LocksContextType {
  locks: FeatureLocks;
  setLockState: (feature: keyof FeatureLocks, state: LockState) => void;
  setMultipleLockStates: (updates: Partial<FeatureLocks>) => Promise<void>;
  isLocked: (feature: keyof FeatureLocks) => boolean;
  isTest: (feature: keyof FeatureLocks) => boolean;
  isUnlocked: (feature: keyof FeatureLocks) => boolean;
}

const LocksContext = createContext<LocksContextType | undefined>(undefined);

const DEFAULT_LOCKS: FeatureLocks = {
  tarot: 'locked',
  horoscopes: 'locked',
  astrology: 'locked',
};

const ASYNC_STORAGE_KEY = 'cauldron_mystic_locks';

export function LocksProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState<FeatureLocks>(DEFAULT_LOCKS);
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Load locks from AsyncStorage on app start
  useEffect(() => {
    loadLocksFromStorage();
  }, []);

  const loadLocksFromStorage = async () => {
    try {
      const savedLocks = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (savedLocks) {
        const parsed = JSON.parse(savedLocks) as Partial<FeatureLocks>;
        // Merge with defaults so missing keys don't cause undefined values
        const merged: FeatureLocks = {
          ...DEFAULT_LOCKS,
          ...parsed,
        };
        setLocks(merged);
      }
    } catch (error) {
      console.warn('Failed to load locks from AsyncStorage:', error);
    } finally {
      setHydrated(true);
    }
  };

  const setLockState = async (feature: keyof FeatureLocks, state: LockState) => {
    // Use functional update to avoid race conditions when multiple updates occur
    let newLocks: FeatureLocks = { ...locks };
    setLocks(prev => {
      newLocks = {
        ...prev,
        [feature]: state,
      };
      return newLocks;
    });

    // Only save to AsyncStorage if not in 'test' mode (test mode is temporary)
    if (state !== 'test') {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newLocks));
      } catch (error) {
        console.warn('Failed to save locks to AsyncStorage:', error);
      }
    }
  };

  const setMultipleLockStates = async (updates: Partial<FeatureLocks>) => {
    // Use functional update to avoid overwriting concurrent updates
    let newLocks: FeatureLocks = { ...locks };
    setLocks(prev => {
      newLocks = {
        ...prev,
        ...updates,
      };
      return newLocks;
    });

    // Only save to AsyncStorage if any update is not 'test'
    const shouldSave = Object.values(updates).some(state => state !== 'test');
    if (shouldSave) {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newLocks));
      } catch (error) {
        console.warn('Failed to save locks to AsyncStorage:', error);
      }
    }
  };

  const isLocked = (feature: keyof FeatureLocks): boolean => locks[feature] === 'locked';
  const isTest = (feature: keyof FeatureLocks): boolean => locks[feature] === 'test';
  const isUnlocked = (feature: keyof FeatureLocks): boolean => locks[feature] === 'unlocked';

  const value = {
    locks,
    setLockState,
    setMultipleLockStates,
    isLocked,
    isTest,
    isUnlocked,
  };

  return (
    // Delay rendering children until persisted locks are loaded to avoid UI mismatch
    <LocksContext.Provider value={value}>
      {hydrated ? children : null}
    </LocksContext.Provider>
  );
}

export function useLocks() {
  const context = useContext(LocksContext);
  if (context === undefined) {
    throw new Error('useLocks must be used within a LocksProvider');
  }
  return context;
}
