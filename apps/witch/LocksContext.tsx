import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LockState = 'locked' | 'test' | 'unlocked';

export interface FeatureLocks {
  tarot: LockState;
  horoscopes: LockState;
  astrology: LockState;
  witchG: LockState;
  witchF: LockState;
  witchC: LockState;
  witchS: LockState;
}

interface LocksContextType {
  locks: FeatureLocks;
  setLockState: (feature: keyof FeatureLocks, state: LockState) => void;
  setMultipleLockStates: (updates: Partial<FeatureLocks>) => Promise<void>;
  unlockAllWitches: () => Promise<void>;
  isLocked: (feature: keyof FeatureLocks) => boolean;
  isTest: (feature: keyof FeatureLocks) => boolean;
  isUnlocked: (feature: keyof FeatureLocks) => boolean;
}

const LocksContext = createContext<LocksContextType | undefined>(undefined);

const DEFAULT_LOCKS: FeatureLocks = {
  tarot: 'locked',
  horoscopes: 'locked',
  astrology: 'locked',
  witchG: 'unlocked',
  witchF: 'locked',
  witchC: 'locked',
  witchS: 'locked',
};

const ASYNC_STORAGE_KEY = 'cauldron_witch_locks';

export function LocksProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState<FeatureLocks>(DEFAULT_LOCKS);

  // Performance monitoring to detect excessive re-renders
  const renderCountRef = useRef(0);
  const lastLogTimeRef = useRef(Date.now());

  // Safeguard against rapid state updates
  const lastUpdateTimeRef = useRef(0);
  const updateCountRef = useRef(0);
  const minUpdateIntervalMs = 100; // Minimum 100ms between updates

  useEffect(() => {
    renderCountRef.current++;
    const now = Date.now();
    const timeSinceLastLog = now - lastLogTimeRef.current;

    // Log render rate every 5 seconds
    if (timeSinceLastLog > 5000) {
      const rendersPerSecond = (renderCountRef.current / timeSinceLastLog) * 1000;
      console.log(`[LocksProvider] Render rate: ${rendersPerSecond.toFixed(2)} renders/sec`);

      // Warn if more than 5 renders per second
      if (rendersPerSecond > 5) {
        console.warn(`[LocksProvider] WARNING: High render rate detected (${rendersPerSecond.toFixed(2)}/sec). Possible infinite loop!`);
      }

      renderCountRef.current = 0;
      lastLogTimeRef.current = now;
    }
  });

  // Load locks from AsyncStorage on app start
  useEffect(() => {
    loadLocksFromStorage();
  }, []);

  const loadLocksFromStorage = async () => {
    try {
      const savedLocks = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (savedLocks) {
        const parsed = JSON.parse(savedLocks) as FeatureLocks;
        setLocks(parsed);
      }
    } catch (error) {
      console.warn('Failed to load locks from AsyncStorage:', error);
    }
  };

  const setLockState = useCallback(async (feature: keyof FeatureLocks, state: LockState) => {
    setLocks(prevLocks => {
      const newLocks = {
        ...prevLocks,
        [feature]: state,
      };

      // Only save to AsyncStorage if not in 'test' mode (test mode is temporary)
      if (state !== 'test') {
        AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newLocks)).catch(error => {
          console.warn('Failed to save locks to AsyncStorage:', error);
        });
      }

      return newLocks;
    });
  }, []);

  const setMultipleLockStates = useCallback(async (updates: Partial<FeatureLocks>) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    // Safeguard: Detect rapid successive updates
    if (timeSinceLastUpdate < minUpdateIntervalMs) {
      updateCountRef.current++;
      console.warn(
        `[LocksContext] SAFEGUARD: Update blocked - too rapid (${updateCountRef.current} in <${minUpdateIntervalMs}ms). ` +
        `Updates must be at least ${minUpdateIntervalMs}ms apart. This indicates a potential infinite update loop.`
      );
      return;
    }

    // Reset counter on valid update
    updateCountRef.current = 0;
    lastUpdateTimeRef.current = now;

    console.log('[LocksContext] setMultipleLockStates called with updates:', updates);
    setLocks(prevLocks => {
      const newLocks = {
        ...prevLocks,
        ...updates,
      };
      console.log('[LocksContext] Previous locks:', prevLocks);
      console.log('[LocksContext] New locks:', newLocks);

      // Only save to AsyncStorage if not setting everything to 'test'
      const shouldSave = Object.values(updates).some(state => state !== 'test');
      console.log('[LocksContext] Should save to AsyncStorage:', shouldSave);

      if (shouldSave) {
        console.log('[LocksContext] Saving locks to AsyncStorage:', ASYNC_STORAGE_KEY);
        AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newLocks)).catch(error => {
          console.warn('[LocksContext] Failed to save locks to AsyncStorage:', error);
        }).then(() => {
          console.log('[LocksContext] Successfully saved locks to AsyncStorage');
        });
      }

      return newLocks;
    });
  }, [lastUpdateTimeRef, minUpdateIntervalMs, updateCountRef]);

  const unlockAllWitches = useCallback(async () => {
    console.log('[LocksContext] unlockAllWitches called - unlocking all witch types');
    await setMultipleLockStates({
      witchG: 'unlocked',
      witchF: 'unlocked',
      witchC: 'unlocked',
      witchS: 'unlocked',
    });
  }, [setMultipleLockStates]);

  const isLocked = useCallback((feature: keyof FeatureLocks): boolean => locks[feature] === 'locked', [locks]);
  const isTest = useCallback((feature: keyof FeatureLocks): boolean => locks[feature] === 'test', [locks]);
  const isUnlocked = useCallback((feature: keyof FeatureLocks): boolean => locks[feature] === 'unlocked', [locks]);

  const value = useMemo(() => ({
    locks,
    setLockState,
    setMultipleLockStates,
    unlockAllWitches,
    isLocked,
    isTest,
    isUnlocked,
  }), [locks, setLockState, setMultipleLockStates, unlockAllWitches, isLocked, isTest, isUnlocked]);

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
