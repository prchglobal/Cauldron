import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('themeMode');
      if (saved === 'light' || saved === 'dark') {
        setThemeModeState(saved);
      }
    } catch (error) {
      // AsyncStorage may not be available (e.g., on web)
      console.warn('Theme preference storage not available:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      // AsyncStorage may not be available (e.g., on web)
      console.warn('Theme preference storage not available:', error);
    }
  }, []);

  const isDarkMode = themeMode === 'dark';

  const value = useMemo(() => ({ isDarkMode, themeMode, setThemeMode }), [isDarkMode, themeMode, setThemeMode]);

  return (
    <ThemeContext.Provider value={value}>
      {!isLoaded ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
