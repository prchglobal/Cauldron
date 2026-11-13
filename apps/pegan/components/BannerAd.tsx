import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AppodealService from '../AppodealService';
import { useTheme } from '../ThemeContext';

export function BannerAd() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Show banner ad when component mounts
    AppodealService.showBannerAd();

    // Hide banner ad when component unmounts
    return () => {
      AppodealService.hideBannerAd();
    };
  }, []);

  const cardBg = isDarkMode ? '#fff' : '#2a2a2a';

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {/* Appodeal banner ad renders here via native module */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
