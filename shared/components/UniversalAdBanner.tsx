import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { selectNextAd, HouseAdItem } from '../constants/houseAds';

// Safely probe for native Google Mobile Ads
let NativeBannerAd: any = null;
let NativeBannerAdSize: any = null;
if (Platform.OS !== 'web') {
  try {
    const gma = require('react-native-google-mobile-ads');
    NativeBannerAd = gma.BannerAd;
    NativeBannerAdSize = gma.BannerAdSize;
  } catch {
    // Without native module linked
  }
}

interface UniversalAdBannerProps {
  compact?: boolean;
}

export function UniversalAdBanner({ compact = false }: UniversalAdBannerProps) {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { setBannerTop, isAdFree } = useBanner();

  const [currentAd, setCurrentAd] = useState<HouseAdItem>(() => selectNextAd());
  const [nativeAdFailed, setNativeAdFailed] = useState(false);

  // If user has unlocked Ad Free, hide the banner completely
  if (isAdFree) {
    return null;
  }

  // 90% AdMob on native mobile, 10% house ad
  const [shouldUseAdMob] = useState<boolean>(() => {
    if (Platform.OS === 'web') return false;
    if (!NativeBannerAd || !NativeBannerAdSize) return false;
    return Math.random() < 0.90;
  });

  // Rotate house / Impact / BSA ads every 10 seconds
  useEffect(() => {
    if (shouldUseAdMob && !nativeAdFailed) return;
    const interval = setInterval(() => {
      setCurrentAd(selectNextAd());
    }, 10000);
    return () => clearInterval(interval);
  }, [shouldUseAdMob, nativeAdFailed]);

  const handleBannerLayout = useCallback(
    (event: any) => {
      const { y } = event.nativeEvent.layout;
      setBannerTop(y);
    },
    [setBannerTop]
  );

  const handlePressAd = () => {
    if (!currentAd.targetUrl) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(currentAd.targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    Linking.openURL(currentAd.targetUrl).catch(() => {});
  };

  const cardBg = isDarkMode ? '#17151e' : '#ffffff';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDarkMode ? '#f3f0e8' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#9ca3af' : '#6b7280';

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: cardBg,
        borderTopColor: borderColor,
        bottom: insets.bottom,
      },
    ],
    [cardBg, borderColor, insets.bottom]
  );

  // If on native mobile and selected for AdMob
  if (Platform.OS !== 'web' && NativeBannerAd && NativeBannerAdSize && shouldUseAdMob && !nativeAdFailed) {
    return (
      <View onLayout={handleBannerLayout} style={containerStyle}>
        <NativeBannerAd
          unitId="ca-app-pub-5705156853472358/7956227580"
          size={NativeBannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdFailedToLoad={() => setNativeAdFailed(true)}
        />
      </View>
    );
  }

  // Web & In-House / Impact / BSA rotating banner
  return (
    <View onLayout={handleBannerLayout} style={containerStyle}>
      <TouchableOpacity
        style={styles.innerTouchable}
        onPress={handlePressAd}
        activeOpacity={0.88}
        accessibilityRole="link"
        accessibilityLabel={`Advertisement: ${currentAd.title}`}
      >
        {/* Artwork / Avatar */}
        {currentAd.imageUrl ? (
          <Image
            source={{ uri: currentAd.imageUrl }}
            style={[
              styles.avatarImage,
              { borderColor: currentAd.accentColor + '55' },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              {
                backgroundColor: currentAd.accentColor + '20',
                borderColor: currentAd.accentColor + '55',
              },
            ]}
          >
            <Text style={styles.emojiIcon}>{currentAd.emoji || '✨'}</Text>
          </View>
        )}

        {/* Content Column */}
        <View style={styles.contentColumn}>
          {/* Headline + Tagline Pill */}
          <View style={styles.titleRow}>
            <Text style={[styles.headline, { color: textColor }]} numberOfLines={1}>
              {currentAd.title}
            </Text>
            {Boolean(currentAd.tagline) && (
              <View
                style={[
                  styles.taglinePill,
                  {
                    backgroundColor: currentAd.accentColor + '22',
                    borderColor: currentAd.accentColor + '55',
                  },
                ]}
              >
                <Text style={[styles.taglineText, { color: currentAd.accentColor }]}>
                  {currentAd.tagline}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {Boolean(currentAd.description) && (
            <Text style={[styles.descriptionText, { color: mutedColor }]} numberOfLines={1}>
              {currentAd.description}
            </Text>
          )}

          {/* Subtitle / Target URL + Ad Disclosure Badge */}
          <View style={styles.footerRow}>
            <Text style={[styles.caption, { color: currentAd.accentColor }]} numberOfLines={1}>
              {currentAd.subtitle}
            </Text>
            <View style={styles.disclosureWrap}>
              <Text style={styles.disclosureText}>ad</Text>
              <Text style={styles.disclosureArrow}>↗</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    gap: 10,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#1f1d2b',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 22,
  },
  contentColumn: {
    flex: 1,
    height: 44,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headline: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  taglinePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.8,
  },
  taglineText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  descriptionText: {
    fontSize: 11,
    lineHeight: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  caption: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  disclosureWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  disclosureText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#8c8578',
    textTransform: 'lowercase',
  },
  disclosureArrow: {
    fontSize: 8.5,
    color: '#8c8578',
  },
});
