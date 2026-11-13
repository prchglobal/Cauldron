import React, { useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { AppodealBanner } from 'react-native-appodeal';
import { useTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Appodeal, { AppodealAdType } from 'react-native-appodeal';
import { useBanner } from '../BannerContext';

export function AppodealBannerComponent() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { setBannerTop } = useBanner();
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';

  const handleBannerLayout = useCallback((event: any) => {
    const { y } = event.nativeEvent.layout;
    setBannerTop(y);
  }, [setBannerTop]);

  const bannerStyle = useMemo(() => [
    styles.bannerContainer,
    {
      backgroundColor: cardBg,
      position: 'absolute' as const,
      bottom: insets.bottom,
      left: 0,
      right: 0,
      zIndex: 100,
    },
  ], [cardBg, insets.bottom]);

  useEffect(() => {
    // When component mounts, initialize and show banner
    console.log('[Appodeal Banner] Component mounted, initializing Appodeal');
    try {
      // Select app key based on platform
      const appKey = Platform.OS === 'ios'
        ? '00b43c9f1cf2a2edaca70636dacbb2324c66bffea54ea2e6'
        : '27d3c33d363122cccd3b3a54118851005b14239308e62c1a';

      console.log(`[Appodeal Banner] Initializing with ${Platform.OS} app key`);
      // Initialize with BANNER for test banner ads
      Appodeal.initialize(appKey, AppodealAdType.BANNER);

      // Cache banners and rewarded videos
      console.log('[Appodeal Banner] Caching banners and rewarded videos');
      Appodeal.cache(AppodealAdType.BANNER);
      Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
    } catch (err) {
      console.error('[Appodeal Banner] Error initializing Appodeal:', err);
    }

    // Cleanup when unmounting - explicitly hide the banner
    return () => {
      console.log('[Appodeal Banner] Component unmounting, hiding banner');
      try {
        Appodeal.hide(AppodealAdType.BANNER);
      } catch (err) {
        console.error('[Appodeal Banner] Error hiding banner on unmount:', err);
      }
    };
  }, []);

  return (
    <View
      onLayout={handleBannerLayout}
      style={bannerStyle}>
      <AppodealBanner
        style={styles.banner}
        adSize="phone"
        placement="default"
        onAdLoaded={(event: any) => {
          console.log('[Appodeal Banner] Ad loaded:', event);
        }}
        onAdFailedToLoad={(error: any) => {
          console.warn('[Appodeal Banner] Failed to load:', error);
        }}
        onAdClicked={() => {
          console.log('[Appodeal Banner] Ad clicked');
        }}
        onAdExpired={() => {
          console.log('[Appodeal Banner] Ad expired');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
});
