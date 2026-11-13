import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppodealBanner } from 'react-native-appodeal';
import { useTheme } from '../ThemeContext';

export function AppodealMRECComponent() {
  const { isDarkMode } = useTheme();
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';

  return (
    <View style={[styles.mrecContainer, { backgroundColor: cardBg }]}>
      <AppodealBanner
        style={styles.mrec}
        adSize="300x250"
        placement="default"
        onAdLoaded={(event: any) => {
          console.log('[Appodeal MREC] Ad loaded:', event);
        }}
        onAdFailedToLoad={(error: any) => {
          console.warn('[Appodeal MREC] Failed to load:', error);
        }}
        onAdClicked={() => {
          console.log('[Appodeal MREC] Ad clicked');
        }}
        onAdExpired={() => {
          console.log('[Appodeal MREC] Ad expired');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mrecContainer: {
    width: '100%',
    height: 280,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  mrec: {
    width: 300,
    height: 250,
  },
});
