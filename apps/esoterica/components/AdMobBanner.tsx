import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme } from '../ThemeContext';

export function AdMobBanner() {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? '#fff' : '#2a2a2a';

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      <BannerAd
        unitId="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy"
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('[AdMob] Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdMob] Banner ad failed to load:', error);
        }}
      />
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
