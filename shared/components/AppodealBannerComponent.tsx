import React, { useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppodealBanner } from 'react-native-appodeal';
import { useTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppodealService from '../AppodealService';
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
      borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
      bottom: insets.bottom,
      position: 'absolute' as const,
      left: 0,
      right: 0,
      zIndex: 1,
    },
  ], [cardBg, isDarkMode, insets.bottom]);

  useEffect(() => {
    // When component mounts, show banner and ensure ads are cached
    console.log('[Appodeal Banner] Component mounted, showing banner');
    try {
      Appodeal.show(AppodealAdType.BANNER);
      AppodealService.cacheAds();
    } catch (err) {
      console.error('[Appodeal Banner] Error showing banner on mount:', err);
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
