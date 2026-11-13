import React, { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Basic locks state, customize as needed
const defaultLocks = {
  locked: false,
  lockType: null,
  setLockState: () => {},
  setMultipleLockStates: () => {},
  isUnlocked: (key: string) => key === 'witchLucifer',
  isTest: (key: string) => false,
  unlockAllWitches: async () => {},
};

export const LocksContext = createContext(defaultLocks);

export const useLocks = () => {
  const locks = useContext(LocksContext);
  if (!locks) {
    throw new Error('useLocks must be used within a LocksProvider');
  }
  return locks;
};

interface LocksProviderProps {
  children: React.ReactNode;
  value?: typeof defaultLocks;
}

export function LocksProvider({ children, value = defaultLocks }: LocksProviderProps) {
  // Track test mode locks in state
  const [testLocks, setTestLocks] = useState<Record<string, boolean>>({
    witchLucifer: true, // Lucifer is unlocked by default
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load lock states from AsyncStorage on mount
  useEffect(() => {
    const loadLockStates = async () => {
      try {
        const stored = await AsyncStorage.getItem('cauldron_magick_locks');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTestLocks(parsed);
        }
      } catch (error) {
        console.error('[LocksContext] Error loading lock states:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLockStates();
  }, []);

  // Save lock states to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      const saveLockStates = async () => {
        try {
          await AsyncStorage.setItem('cauldron_magick_locks', JSON.stringify(testLocks));
        } catch (error) {
          console.error('[LocksContext] Error saving lock states:', error);
        }
      };
      saveLockStates();
    }
  }, [testLocks, isLoaded]);

  // Handle setting individual lock states
  const setLockState = (key: string, state: any) => {
    if (state === 'test' || state === 'unlocked') {
      setTestLocks(prev => ({ ...prev, [key]: true }));
    } else {
      setTestLocks(prev => ({ ...prev, [key]: false }));
    }
  };

  // Handle setting multiple lock states at once
  const setMultipleLockStates = async (states: Record<string, string>) => {
    const newLocks: Record<string, boolean> = { ...testLocks };
    Object.entries(states).forEach(([key, state]) => {
      newLocks[key] = state === 'test' || state === 'unlocked';
    });
    setTestLocks(newLocks);
  };

  // Check if a witch is unlocked (by default or subscription)
  const isUnlocked = (key: string) => {
    // If the key has been explicitly set in testLocks, use that value
    if (key in testLocks) {
      return testLocks[key] === true;
    }
    // Otherwise, Lucifer is unlocked by default
    return key === 'witchLucifer';
  };

  // Check if a witch is in test mode (same as isUnlocked for now)
  const isTest = (key: string) => {
    return testLocks[key] === true;
  };

  // Unlock all witches (for subscription)
  const unlockAllWitches = async () => {
    setTestLocks({
      witchLucifer: true,
      witchEnoch: true,
    });
  };

  const locksValue = {
    locked: false,
    lockType: null,
    setLockState,
    setMultipleLockStates,
    isUnlocked,
    isTest,
    unlockAllWitches,
  };

  return (
    <LocksContext.Provider value={locksValue}>
      {children}
    </LocksContext.Provider>
  );
}
