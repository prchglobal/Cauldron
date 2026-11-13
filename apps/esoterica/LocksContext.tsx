import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LockState = 'locked' | 'test' | 'unlocked';

export interface FeatureLocks {
  sophia: LockState;
  seth: LockState;
  logos: LockState;
  christos: LockState;
}

interface LocksContextType {
  locks: Record<string, LockState>;
  setLockState: (feature: string, state: LockState) => Promise<void>;
  setMultipleLockStates: (updates: Record<string, LockState>) => Promise<void>;
  isLocked: (feature: keyof FeatureLocks) => boolean;
  isTest: (feature: keyof FeatureLocks) => boolean;
  isUnlocked: (feature: keyof FeatureLocks) => boolean;
  isPracticeLocked: (featureName: string, practiceIndex: number) => boolean;
  hasUnlockedPractice: (featureName: string) => boolean;
}

const LocksContext = createContext<LocksContextType | undefined>(undefined);

const DEFAULT_LOCKS: Record<string, LockState> = {
  sophia: 'locked',
  seth: 'locked',
  logos: 'locked',
  christos: 'locked',
  sophia_practice_1: 'unlocked',  // Only first Sophia practice is free by default
};

const ASYNC_STORAGE_KEY = 'cauldron_esoterica_locks';

export function LocksProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState<Record<string, LockState>>(DEFAULT_LOCKS);

  // Load locks from AsyncStorage on app start
  useEffect(() => {
    loadLocksFromStorage();
  }, []);

  const loadLocksFromStorage = async () => {
    try {
      const savedLocks = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (savedLocks) {
        const parsed = JSON.parse(savedLocks) as Record<string, LockState>;
        setLocks(parsed);
      }
    } catch (error) {
      console.warn('Failed to load locks from AsyncStorage:', error);
    }
  };

  const setLockState = async (feature: string, state: LockState) => {
    const newLocks = {
      ...locks,
      [feature]: state,
    };
    setLocks(newLocks);

    // Only save to AsyncStorage if not in 'test' mode (test mode is temporary)
    if (state !== 'test') {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newLocks));
      } catch (error) {
        console.warn('Failed to save locks to AsyncStorage:', error);
      }
    }
  };

  const setMultipleLockStates = async (updates: Record<string, LockState>) => {
    const newLocks = {
      ...locks,
      ...updates,
    };
    setLocks(newLocks);

    // Only save to AsyncStorage if not setting everything to 'test'
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

  const isPracticeLocked = (featureName: string, practiceIndex: number): boolean => {
    // Check for individual practice lock first
    const practiceLockKey = `${featureName}_practice_${practiceIndex + 1}`;
    if (locks[practiceLockKey] !== undefined) {
      return locks[practiceLockKey] === 'locked';
    }

    // Fall back to feature-level lock
    const featureKey = featureName.toLowerCase() as keyof FeatureLocks;
    if (featureKey in locks) {
      return locks[featureKey] === 'locked';
    }

    return true;
  };

  const hasUnlockedPractice = (featureName: string): boolean => {
    // Check if any practice of this feature is unlocked
    for (let i = 1; i <= 5; i++) {
      const practiceLockKey = `${featureName}_practice_${i}`;
      if (locks[practiceLockKey] === 'unlocked') {
        return true;
      }
    }
    // Also check feature-level lock
    const featureKey = featureName.toLowerCase() as keyof FeatureLocks;
    if (locks[featureKey] === 'unlocked') {
      return true;
    }
    return false;
  };

  const value = {
    locks,
    setLockState,
    setMultipleLockStates,
    isLocked,
    isTest,
    isUnlocked,
    isPracticeLocked,
    hasUnlockedPractice,
  };

  return (
    <LocksContext.Provider value={value}>
      {children}
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
