import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { ADMOB_UNITS, PAGE_CHANGE_INTERSTITIAL_CHANCE, TOOL_PAGE_INTERSTITIAL_CHANCE } from './monetization';
import { getRandomSponsorAd, HouseAdItem } from './constants/houseAds';
import { useBanner } from './BannerContext';

let NativeInterstitialAd: any = null;
let NativeAdEventType: any = null;
let NativeMobileAds: any = null;
let NativeAdsConsent: any = null;

if (Platform.OS !== 'web') {
  try {
    const gma = require('react-native-google-mobile-ads');
    NativeInterstitialAd = gma.InterstitialAd;
    NativeAdEventType = gma.AdEventType;
    NativeMobileAds = gma.default;
    NativeAdsConsent = gma.AdsConsent;
  } catch {
    // Native module not linked or web environment
  }
}

interface InterstitialContextType {
  triggerPageChangeAd: (force?: boolean, isToolPage?: boolean) => boolean;
  showSponsorInterstitial: () => void;
  isAdVisible: boolean;
  closeAd: () => void;
}

const InterstitialContext = createContext<InterstitialContextType | undefined>(undefined);

export const InterstitialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdFree } = useBanner();
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [currentSponsorAd, setCurrentSponsorAd] = useState<HouseAdItem>(() => getRandomSponsorAd());
  const countdownIntervalRef = useRef<any>(null);
  const interstitialRef = useRef<any>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize native AdMob interstitial on iOS/Android
  useEffect(() => {
    if (Platform.OS === 'web' || !NativeInterstitialAd || !NativeAdEventType) return;

    try {
      (async () => {
        if (NativeAdsConsent) {
          await NativeAdsConsent.gatherConsent().catch(() => {});
        }
        if (NativeMobileAds) {
          await NativeMobileAds().initialize().catch(() => {});
        }
      })();

      const adUnitId = Platform.OS === 'ios' ? ADMOB_UNITS.ios.interstitial : ADMOB_UNITS.android.interstitial;
      const interstitial = NativeInterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
      interstitialRef.current = interstitial;

      const unsubLoaded = interstitial.addAdEventListener(NativeAdEventType.LOADED, () => {
        setInterstitialLoaded(true);
      });
      const unsubClosed = interstitial.addAdEventListener(NativeAdEventType.CLOSED, () => {
        setInterstitialLoaded(false);
        interstitial.load();
      });

      interstitial.load();

      return () => {
        unsubLoaded?.();
        unsubClosed?.();
      };
    } catch (e) {
      console.warn('[Interstitial] Native ad setup failed:', e);
    }
  }, []);

  const showSponsorModal = () => {
    // BSA & Impact only - never house ads
    const ad = getRandomSponsorAd();
    setCurrentSponsorAd(ad);
    setCountdown(5);
    setCanClose(false);
    setIsAdVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const closeAd = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsAdVisible(false);
    });
  };

  /**
   * Trigger an interstitial on page change:
   * - 2.0% chance (0.02) when entering a Tool Kit page.
   * - 0.20% chance (0.002) on general page changes.
   * AdMob on mobile / BSA & Impact sponsors on web (never house ads).
   */
  const triggerPageChangeAd = (force: boolean = false, isToolPage: boolean = false): boolean => {
    // If user has unlocked Ad Free, never trigger interstitial ads
    if (isAdFree) {
      return false;
    }

    const chance = isToolPage ? TOOL_PAGE_INTERSTITIAL_CHANCE : PAGE_CHANGE_INTERSTITIAL_CHANCE;
    const roll = Math.random();
    const shouldTrigger = force || roll < chance;

    if (!shouldTrigger) {
      return false;
    }

    console.log(
      `[Interstitial] ${isToolPage ? '2.0% Tool page' : '0.20% page change'} ad triggered! (roll: ${roll.toFixed(5)})`
    );

    // 1. Native AdMob interstitial on mobile
    if (Platform.OS !== 'web' && interstitialLoaded && interstitialRef.current) {
      try {
        interstitialRef.current.show();
        return true;
      } catch (err) {
        console.warn('[Interstitial] AdMob show error, falling back to BSA/Impact sponsor:', err);
      }
    }

    // 2. Web or AdMob fallback: Full-screen BSA / Impact sponsor interstitial
    showSponsorModal();
    return true;
  };

  const handleOpenAd = () => {
    if (currentSponsorAd?.targetUrl) {
      Linking.openURL(currentSponsorAd.targetUrl).catch(() => {});
    }
  };

  return (
    <InterstitialContext.Provider
      value={{
        triggerPageChangeAd,
        showSponsorInterstitial: showSponsorModal,
        isAdVisible,
        closeAd,
      }}
    >
      {children}

      {/* Full-screen Interstitial Modal: Impact & BSA Sponsors Only */}
      <Modal visible={isAdVisible} transparent animationType="fade" onRequestClose={closeAd}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.adContainer,
              { opacity: fadeAnim, borderColor: currentSponsorAd.accentColor + '80' },
            ]}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.sponsorTag,
                    {
                      backgroundColor: currentSponsorAd.accentColor + '25',
                      borderColor: currentSponsorAd.accentColor + '60',
                    },
                  ]}
                >
                  <Text style={[styles.sponsorTagText, { color: currentSponsorAd.accentColor }]}>
                    {currentSponsorAd.category === 'IMPACT' ? 'IMPACT PARTNER' : 'BSA SPONSOR'}
                  </Text>
                </View>
                <Text style={styles.taglineText}>
                  {currentSponsorAd.tagline || 'Featured Sponsor'}
                </Text>
              </View>

              {canClose ? (
                <TouchableOpacity style={styles.closeBtn} onPress={closeAd} activeOpacity={0.8}>
                  <Text style={styles.closeBtnText}>✕ Close</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownText}>Ad • {countdown}s</Text>
                </View>
              )}
            </View>

            {/* Creative Area */}
            <View style={styles.creativeArea}>
              {currentSponsorAd.imageUrl ? (
                <Image
                  source={{ uri: currentSponsorAd.imageUrl }}
                  style={styles.adHeroImage}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[
                    styles.adHeroIcon,
                    {
                      borderColor: currentSponsorAd.accentColor + '40',
                      backgroundColor: currentSponsorAd.accentColor + '15',
                    },
                  ]}
                >
                  <Text style={{ fontSize: 44 }}>{currentSponsorAd.emoji || '📢'}</Text>
                </View>
              )}

              <Text style={styles.adTitle}>{currentSponsorAd.title}</Text>
              {currentSponsorAd.description ? (
                <Text style={styles.adDescription}>{currentSponsorAd.description}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: currentSponsorAd.accentColor }]}
                onPress={handleOpenAd}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>
                  {currentSponsorAd.category === 'IMPACT' ? 'Visit Partner ↗' : 'Learn More ↗'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.adFooter}>
              <Text style={styles.adFooterText}>
                {currentSponsorAd.subtitle || 'Verified Sponsor'}
              </Text>
              <Text style={styles.adFooterDisclosure}>Sponsored Disclosure</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </InterstitialContext.Provider>
  );
};

export const useInterstitial = (): InterstitialContextType => {
  const context = useContext(InterstitialContext);
  if (!context) {
    throw new Error('useInterstitial must be used within an InterstitialProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#151722',
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f111a',
    borderBottomWidth: 1,
    borderBottomColor: '#242838',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sponsorTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  sponsorTagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  taglineText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  countdownBadge: {
    backgroundColor: '#242838',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  closeBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  creativeArea: {
    padding: 24,
    alignItems: 'center',
  },
  adHeroImage: {
    width: 96,
    height: 96,
    borderRadius: 18,
    marginBottom: 16,
  },
  adHeroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 16,
  },
  adTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    maxWidth: 320,
  },
  ctaButton: {
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaButtonText: {
    color: '#0f111a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f111a',
    borderTopWidth: 1,
    borderTopColor: '#242838',
  },
  adFooterText: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  adFooterDisclosure: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
});
