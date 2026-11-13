import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
  Modal,
  Switch,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AdsConsent } from 'react-native-google-mobile-ads';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import { useBanner } from '../BannerContext';
import PurchaseService from '../PurchaseService';
// Quick runtime check to validate the imported PurchaseService singleton
console.log('PurchaseService ->', PurchaseService);
import AppodealService from '../AppodealService';
import NotificationService from '../services/NotificationService';
import { ToastService } from '../services/ToastService';
import { TarotReadingModal } from '../components/TarotReadingModal';
import VersionCheckService from '../VersionCheckService';

export function WelcomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode, themeMode, setThemeMode } = useTheme();
  const { setLockState, setMultipleLockStates } = useLocks();
  const { bannerTop } = useBanner();

  // Calculate padding dynamically based on banner position
  // If banner top is known, calculate padding to stop before it
  // Otherwise use a reasonable default
  const bottomPadding = insets.bottom + 76;
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [showMeditationModal, setShowMeditationModal] = useState(false);
  const [showTarotReading, setShowTarotReading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Horoscope Notification States
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  const [horoscopeEnabled, setHoroscopeEnabled] = useState(false);
  const [initialHoroscopeEnabled, setInitialHoroscopeEnabled] = useState(false);
  const [hasSavedPreference, setHasSavedPreference] = useState(false);
  const [horoscopeBirthday, setHoroscopeBirthday] = useState(new Date());
  const [horoscopeTime, setHoroscopeTime] = useState(new Date());
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Numerology Calculator States
  const [showNumerologyModal, setShowNumerologyModal] = useState(false);
  const [numerologyInput, setNumerologyInput] = useState('');
  const [numerologyResult, setNumerologyResult] = useState('');

  // Debug Mode States
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugPasskey, setDebugPasskey] = useState('');

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  // Numerology meanings
  const numerologyMeanings: Record<number, string> = {
    1: 'Leadership, independence, determination, and new beginnings. You are a pioneer with strong willpower and ambition.',
    2: 'Balance, harmony, cooperation, and diplomacy. You are intuitive, sensitive, and excel at working with others.',
    3: 'Creativity, self-expression, communication, and enthusiasm. You are optimistic, charismatic, and full of energy.',
    4: 'Stability, hard work, organization, and loyalty. You are practical, reliable, and build strong foundations.',
    5: 'Freedom, adventure, versatility, and change. You are adaptable, curious, and love exploring new experiences.',
    6: 'Love, nurturing, responsibility, and harmony. You are caring, compassionate, and create balance in relationships.',
    7: 'Spiritual wisdom, analysis, introspection, and intuition. You are philosophical, mysterious, and seek deeper truth.',
    8: 'Power, abundance, success, and material achievement. You are ambitious, strategic, and focused on results.',
    9: 'Compassion, universal love, completion, and wisdom. You are idealistic, generous, and see the bigger picture.',
    11: 'Inspiration, spiritual awareness, and enlightenment. You are intuitive, visionary, and connected to higher consciousness.',
    22: 'Master builder, vision to reality, and great ambition. You have the power to achieve great things on a large scale.',
    33: 'Master teacher, compassion, and healing. You are here to uplift humanity with wisdom and unconditional love.',
  };

  const getReducedNumber = (num: number): number => {
    // Master numbers stay as they are
    if (num === 11 || num === 22 || num === 33) return num;
    // Reduce to single digit
    while (num >= 10) {
      num = Math.floor(num / 10) + (num % 10);
    }
    return num;
  };

  const handleNumerologyCalculate = () => {
    if (!numerologyInput.trim()) {
      Alert.alert('Please enter a number', 'Enter a number between 0 and 999.');
      return;
    }
    const num = parseInt(numerologyInput, 10);
    if (isNaN(num) || num < 0 || num > 999) {
      Alert.alert('Invalid number', 'Please enter a number between 0 and 999.');
      return;
    }
    if (num === 0) {
      setNumerologyResult('Zero represents potential, infinite possibilities, and the beginning of all things.');
      return;
    }
    const reduced = getReducedNumber(num);
    const meaning = numerologyMeanings[reduced] || 'Exploring the mysteries of this number...';
    setNumerologyResult(`${num}\n\n${meaning}`);
  };

  // Load horoscope settings from AsyncStorage and initialize Notifee
  useEffect(() => {
    const loadHoroscopeSettings = async () => {
      try {
        // Initialize notification service
        await NotificationService.initialize();

        const enabled = await AsyncStorage.getItem('horoscopeNotificationsEnabled');
        const birthday = await AsyncStorage.getItem('horoscopeBirthday');
        const time = await AsyncStorage.getItem('horoscopeNotificationTime');

        if (enabled !== null) {
          const parsedEnabled = JSON.parse(enabled);
          setHoroscopeEnabled(parsedEnabled);
          setInitialHoroscopeEnabled(parsedEnabled);
          setHasSavedPreference(true);
          console.log('[Horoscope] Loaded saved preference from AsyncStorage:', parsedEnabled);
        }
        if (birthday !== null) setHoroscopeBirthday(new Date(birthday));
        if (time !== null) setHoroscopeTime(new Date(time));
      } catch (error) {
        console.warn('Error loading horoscope settings:', error);
      }
    };
    loadHoroscopeSettings();
  }, []);

  // Check for app updates on startup
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        await VersionCheckService.checkForUpdates();
      } catch (error) {
        console.error('[WelcomeScreen] Error checking for updates:', error);
      }
    };
    checkForUpdates();
  }, []);

  const handleRestorePurchases = async () => {
    setIsRestoringPurchases(true);
    try {
      await PurchaseService.initialize();
      const restoredFeatures = await PurchaseService.restorePurchases();

      // Unlock each restored feature
      restoredFeatures.forEach((featureKey) => {
        setLockState(featureKey, 'unlocked');
      });

      if (restoredFeatures.length > 0) {
        Alert.alert(
          'Purchases Restored',
          `Successfully restored access to: ${restoredFeatures.join(', ')}`
        );
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases could be restored.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', `Error restoring purchases: ${error}`);
    } finally {
      setIsRestoringPurchases(false);
    }
  };

  const handleLogProductDetails = async () => {
    try {
      await PurchaseService.initialize();
      const skus = PurchaseService.getProductSkus();
      console.log('[IAP][debug] Test SKUs:', skus);
      for (const sku of skus) {
        try {
          const details = await PurchaseService.fetchProductDetails(sku);
          console.log(`[IAP][debug] SKU ${sku} details:`, details);
        } catch (err) {
          console.error('[IAP][debug] Error fetching details for', sku, err);
        }
      }
      Alert.alert('IAP Debug', 'Fetched product details — check logcat for details');
    } catch (error) {
      console.error('[IAP][debug] Unexpected error fetching product details:', error);
      Alert.alert('IAP Debug Error', String(error));
    }
  };

  const handleHoroscopeNotification = () => {
    // If user has never saved a preference, default to enabled (first-time user experience)
    // If user has saved a preference, always show that saved preference
    if (hasSavedPreference) {
      // User has saved a preference - use it (could be true or false)
      setHoroscopeEnabled(initialHoroscopeEnabled);
      console.log('[Horoscope] Opening modal with saved preference:', initialHoroscopeEnabled);
    } else {
      // First time - no saved preference yet - default to true
      setHoroscopeEnabled(true);
      console.log('[Horoscope] Opening modal for first time, defaulting to enabled');
    }
    setShowHoroscopeModal(true);
  };

  const handleSaveHoroscopeSettings = async () => {
    console.log('[Horoscope] Save Settings clicked. Enabled:', horoscopeEnabled);

    try {
      // Validate: If enabling notifications, show permission prompt first
      if (horoscopeEnabled) {
        try {
          console.log('[Horoscope] Notifications enabled - requesting permissions first');
          // Request permissions BEFORE saving settings
          await NotificationService.checkAndRequestPermissions();
        } catch (error) {
          console.error('[Horoscope] Error requesting permissions:', error);
        }
      }

      // Now save all settings
      await AsyncStorage.setItem('horoscopeNotificationsEnabled', JSON.stringify(horoscopeEnabled));
      await AsyncStorage.setItem('horoscopeBirthday', horoscopeBirthday.toISOString());
      await AsyncStorage.setItem('horoscopeNotificationTime', horoscopeTime.toISOString());

      console.log('[Horoscope] Settings saved to AsyncStorage');

      // Update state to reflect the newly saved values
      // This ensures when the modal opens again, it shows the saved preference
      setInitialHoroscopeEnabled(horoscopeEnabled);
      setHasSavedPreference(true);
      console.log('[Horoscope] Updated initial state:', horoscopeEnabled);

      // Schedule notification based on enabled state
      await NotificationService.scheduleHoroscopeNotification(
        horoscopeBirthday,
        horoscopeTime,
        horoscopeEnabled
      );

      console.log('[Horoscope] Notification scheduled');

      // Show toast and close modal
      ToastService.show('Horoscope settings saved!', 'short');
      setShowHoroscopeModal(false);
    } catch (error) {
      ToastService.show('Failed to save horoscope settings', 'short');
      console.error('Error saving horoscope settings:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleTarotReading = async () => {
    setIsLoadingAd(true);
    try {
      const adCompleted = await AppodealService.showRewardedVideo();
      if (adCompleted) {
        // Grant temporary trial access to tarot
        setLockState('tarot', 'test');
        setShowTarotReading(true);
      } else {
        Alert.alert('Ad Cancelled', 'Please watch the full ad to unlock Tarot Reading.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load ad. Please try again.');
      console.warn('Error showing rewarded video:', error);
    } finally {
      setIsLoadingAd(false);
    }
  };

  const handleHelpButtonPress = () => {
    setShowHelpModal(true);
  };

  const handleUMPConsent = async () => {
    try {
      console.log('[UMP] Requesting consent info update before showing privacy form...');
      // Ensure we have up-to-date consent info from the native SDK first
      await AdsConsent.requestInfoUpdate();

      console.log('[UMP] Opening privacy options form...');
      const infoAfter = await AdsConsent.showPrivacyOptionsForm();
      console.log('[UMP] Privacy options form closed, consent info:', infoAfter);
    } catch (error) {
      console.error('[UMP] Error showing privacy options form:', error);
      const msg = (error as any)?.message ?? String(error);
      Alert.alert('Error', `Failed to load privacy options: ${msg}`);
    }
  };

  const handleCloseHoroscopeModal = () => {
    console.log('[Horoscope] Closing modal without saving, reverting to initial state');
    // Revert to the initially loaded value from AsyncStorage
    setHoroscopeEnabled(initialHoroscopeEnabled);
    setShowHoroscopeModal(false);
  };

  const handleMeditationMusic = async () => {
    // Show rewarded video ad
    try {
      console.log('[Welcome] Attempting to show rewarded video before opening meditation music');
      await AppodealService.showRewardedVideo();
    } catch (error) {
      console.error('[Welcome] Error showing video ad:', error);
    }

    setShowMeditationModal(true);
  };

  const handleShareApp = async () => {
    try {
      const appStoreLink = Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/pocketmystic/id6739472969'
        : 'https://play.google.com/store/apps/details?id=com.prch.pmystic';

      await Share.share({
        message: Platform.OS === 'ios'
          ? `Check out pocketMystic - The spiritual toolkit in your pocket! ${appStoreLink}`
          : `Check out pocketMystic - The spiritual toolkit in your pocket!\n${appStoreLink}`,
        url: appStoreLink,
        title: 'Share pocketMystic',
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleMoreApps = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/developer/id1859000424'
      : 'market://search?q=pub:PrCh%20Global';

    Linking.openURL(url).catch(() => {
      // Fallback if developer link doesn't work
      Linking.openURL('https://prch.online');
    });
  };

  const handleDebugPasskeySubmit = async () => {
    const correctPasskey = 'testmode=PrCh438';

    if (debugPasskey === correctPasskey) {
      // Enable test mode for all features at once
      try {
        await setMultipleLockStates({
          tarot: 'test',
          horoscopes: 'test',
          astrology: 'test',
        });

        Alert.alert('Test Mode Enabled', 'All features are now in test/try for free mode!');
        setShowDebugModal(false);
        setDebugPasskey('');
      } catch (error) {
        console.error('Error setting test mode:', error);
        Alert.alert('Error', 'Failed to enable test mode: ' + error);
      }
    } else {
      Alert.alert('Invalid Passkey', 'The passkey you entered is incorrect.');
      setDebugPasskey('');
    }
  };

  // Navigation handlers for extras grid
  const handleNavigateTo = (screenName: string) => {
    (navigation as any).navigate(screenName);
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: cardBg, paddingTop: insets.top + 12 }]}>
          <Text style={[styles.title, { color: textColor }]}>pocketMystic</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            The spiritual toolkit in your pocket!
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={[styles.content, { paddingHorizontal: 16 + Math.max(insets.left, insets.right), paddingBottom: bannerTop ? 60 : 0 }]}>
          {/* Navigation Grid - 3 rows x 2 columns */}
          <View style={styles.navigationGrid}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Tarot')}
              >
                <Text style={styles.gridButtonEmoji}>🔮</Text>
                <Text style={styles.gridButtonText}>Tarot</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Chakras')}
              >
                <Text style={styles.gridButtonEmoji}>⚡</Text>
                <Text style={styles.gridButtonText}>Chakras</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Horoscopes')}
              >
                <Text style={styles.gridButtonEmoji}>✨</Text>
                <Text style={styles.gridButtonText}>Horoscope</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Crystals')}
              >
                <Text style={styles.gridButtonEmoji}>💎</Text>
                <Text style={styles.gridButtonText}>Crystals</Text>
              </TouchableOpacity>
            </View>

            {/* Row 3 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Astrology')}
              >
                <Text style={styles.gridButtonEmoji}>🌙</Text>
                <Text style={styles.gridButtonText}>Astrology</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleNavigateTo('Numerology')}
              >
                <Text style={styles.gridButtonEmoji}>🖐️</Text>
                <Text style={styles.gridButtonText}>Palmistry</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Tarot Reading Button */}
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: '#ec4899' },
              isLoadingAd && { opacity: 0.6 },
            ]}
            onPress={handleTarotReading}
            disabled={isLoadingAd}
          >
            {isLoadingAd ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.notificationButtonText}>🔮 Tarot Reading</Text>
            )}
          </TouchableOpacity>

          {/* Numerology Calculator Button */}
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => {
              setNumerologyInput('');
              setNumerologyResult('');
              setShowNumerologyModal(true);
            }}
          >
            <Text style={styles.notificationButtonText}>🔢 Numerology Calculator</Text>
          </TouchableOpacity>

          {/* Horoscope Notification Button (moved above the separator) */}
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: '#10b981' }]}
            onPress={handleHoroscopeNotification}
          >
            <Text style={styles.notificationButtonText}>🔔 Horoscope Notification</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator} />

          {/* More + Help (side-by-side) */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.halfButton, { backgroundColor: '#fbbf24' }]}
              onPress={() => setShowMoreModal(true)}
            >
              <Text style={styles.halfButtonText}>🔗 More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.halfButton, { backgroundColor: '#ef4444' }]}
              onPress={handleHelpButtonPress}
            >
              <Text style={styles.halfButtonText}>? Help</Text>
            </TouchableOpacity>
          </View>

          {/* Theme Toggle */}
          <View style={[styles.themeToggle, { backgroundColor: cardBg, marginTop: 16 }]}>
        <Text style={[styles.themeLabel, { color: textColor }]}>Theme:</Text>
        <View style={styles.themeModeContainer}>
          <TouchableOpacity
            style={[
              styles.themeModeButton,
              themeMode === 'light' && styles.themeModeButtonActive,
              {
                backgroundColor: themeMode === 'light' ? '#8b5cf6' : '#f0f0f0',
              },
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[styles.themeModeText, { color: themeMode === 'light' ? '#fff' : '#000' }]}>
              ☀️ Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeModeButton,
              themeMode === 'dark' && styles.themeModeButtonActive,
              {
                backgroundColor: themeMode === 'dark' ? '#8b5cf6' : '#3a3a3a',
              },
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[styles.themeModeText, { color: themeMode === 'dark' ? '#fff' : '#fff' }]}>
              🌙 Dark
            </Text>
          </TouchableOpacity>
        </View>

        </View>
        </View>
      </ScrollView>

      <TarotReadingModal
        visible={showTarotReading}
        onClose={() => setShowTarotReading(false)}
        isDarkMode={isDarkMode}
        cardBg={cardBg}
        textColor={textColor}
        mutedColor={mutedColor}
      />

      {/* Help Modal */}
      <Modal visible={showHelpModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <View>
              <Text style={[styles.helpModalTitle, { color: textColor }]}>Help</Text>
              <Text style={[styles.helpVersionText, { color: textColor }]}> 
                v1.0 <Text style={styles.helpBuildText}>(build 1)</Text>
              </Text>

              <Text style={[styles.helpBrandTitle, { color: textColor }]}>pocketMystic™</Text>
              <Text style={[styles.helpBrandSubtitle, { color: textColor }]}>PrCh® Software | PrCh Global Trust©</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.helpCloseButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Help Button Options */}
            <ScrollView style={styles.helpButtonsContainer}>
              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => NotificationService.sendTestNotification()}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>🔔 Test Notification</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={handleUMPConsent}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>🔑 Privacy Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => {
                  Linking.openURL('https://prch.online/agreements');
                  setShowHelpModal(false);
                }}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>📋 Terms of Use</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => {
                  Linking.openURL('https://prch.online/privacy');
                  setShowHelpModal(false);
                }}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>🔒 Privacy Policy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => {
                  Linking.openURL('https://prch.online/contact');
                  setShowHelpModal(false);
                }}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>💬 Support</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, isRestoringPurchases && { opacity: 0.6 }]}
                onPress={handleRestorePurchases}
                disabled={isRestoringPurchases}
              >
                {isRestoringPurchases ? (
                  <ActivityIndicator color={textColor} size="small" />
                ) : (
                  <Text style={[styles.helpButtonText, { color: textColor }]}>🛒 Restore Purchases</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => setShowDebugModal(true)}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>🐛 Debug Mode</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* More Modal */}
      <Modal visible={showMoreModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.helpModalTitle, { color: textColor }]}>More Options</Text>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => setShowMoreModal(false)}
            >
              <Text style={styles.helpCloseButtonText}>✕</Text>
            </TouchableOpacity>

            {/* More Button Options */}
            <ScrollView style={styles.helpButtonsContainer}>
              <TouchableOpacity
                style={[styles.helpButton, { borderBottomColor: mutedColor }]}
                onPress={() => {
                  handleMoreApps();
                  setShowMoreModal(false);
                }}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>🔗 More Apps</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.helpButton]}
                onPress={() => {
                  handleShareApp();
                  setShowMoreModal(false);
                }}
              >
                <Text style={[styles.helpButtonText, { color: textColor }]}>📤 Share App</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Numerology Calculator Modal */}
      <Modal visible={showNumerologyModal} transparent animationType="fade">
        <View style={[styles.numerologyOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.numerologyContent, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.numerologyCloseButton}
              onPress={() => setShowNumerologyModal(false)}
            >
              <Text style={styles.numerologyCloseButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.numerologyTitle, { color: textColor }]}>Numerology Calculator</Text>

            {!numerologyResult ? (
              <>
                <Text style={[styles.numerologyLabel, { color: textColor }]}>Enter a number (0-999):</Text>
                <TextInput
                  style={[styles.numerologyInput, { color: textColor, borderColor: mutedColor }]}
                  placeholder="Enter number"
                  placeholderTextColor={mutedColor}
                  keyboardType="number-pad"
                  maxLength={3}
                  value={numerologyInput}
                  onChangeText={setNumerologyInput}
                />
                <TouchableOpacity
                  style={[styles.numerologyButton, { backgroundColor: '#3b82f6' }]}
                  onPress={handleNumerologyCalculate}
                >
                  <Text style={styles.numerologyButtonText}>Calculate</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ScrollView style={styles.numerologyResultContainer}>
                  <Text style={[styles.numerologyResultText, { color: textColor }]}>
                    {numerologyResult}
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={[styles.numerologyButton, { backgroundColor: '#10b981' }]}
                  onPress={() => {
                    setNumerologyInput('');
                    setNumerologyResult('');
                  }}
                >
                  <Text style={styles.numerologyButtonText}>Calculate Another</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Debug Modal */}
      <Modal visible={showDebugModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.helpModalTitle, { color: textColor }]}>Debug Mode</Text>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => {
                setShowDebugModal(false);
                setDebugPasskey('');
              }}
            >
              <Text style={styles.helpCloseButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={{ paddingTop: 16 }}>
              <Text style={[styles.debugLabel, { color: mutedColor }]}>Enter Passkey:</Text>
              <TextInput
                style={[styles.debugInput, { color: textColor, borderColor: mutedColor }]}
                placeholder="Passkey"
                placeholderTextColor={mutedColor}
                value={debugPasskey}
                onChangeText={setDebugPasskey}
              />

              <TouchableOpacity
                style={[styles.debugButton, { backgroundColor: '#8b5cf6' }]}
                onPress={handleDebugPasskeySubmit}
              >
                <Text style={styles.debugButtonText}>Enable Test Mode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.debugButton, { backgroundColor: '#06b6d4' }]}
                onPress={handleLogProductDetails}
              >
                <Text style={styles.debugButtonText}>Log SKU Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.debugButton, { backgroundColor: '#ef4444' }]}
                onPress={() => {
                  setShowDebugModal(false);
                  setDebugPasskey('');
                }}
              >
                <Text style={styles.debugButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Meditation Music Modal */}
      <Modal visible={showMeditationModal} animationType="slide" presentationStyle="fullScreen">
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
          {/* Close Button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMeditationModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>Meditation Music</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* WebView for YouTube Playlist */}
          <WebView
            source={{
              uri: 'https://www.youtube.com/playlist?list=PLQvUH8bV2DLq4F-qg5xV_PghKECyx2xFH',
            }}
            style={styles.webView}
            javaScriptEnabled={true}
          />
        </View>
      </Modal>

      {/* Horoscope Notification Modal */}
      <Modal visible={showHoroscopeModal} animationType="slide" transparent>
        <View style={[styles.horoscopeModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.horoscopeModalContent, { backgroundColor: cardBg }]}>
            {/* Header */}
            <View style={styles.horoscopeHeader}>
              <Text style={[styles.horoscopeTitle, { color: textColor }]}>Daily Horoscope</Text>
              <TouchableOpacity onPress={handleCloseHoroscopeModal}>
                <Text style={[styles.closeText, { color: mutedColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.horoscopeContent}>
              {/* Enable Toggle */}
              <View style={styles.horoscopeSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Enable Notifications</Text>
                <Switch
                  value={horoscopeEnabled}
                  onValueChange={setHoroscopeEnabled}
                  trackColor={{ false: '#ccc', true: '#8b5cf6' }}
                  thumbColor={horoscopeEnabled ? '#fff' : '#f0f0f0'}
                />
              </View>

              {/* Birthday Section */}
              <View style={styles.horoscopeSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Birthday</Text>
                <TouchableOpacity
                  style={[styles.horoscopeButton, { backgroundColor: '#8b5cf6' }]}
                  onPress={() => setShowBirthdayPicker(true)}
                >
                  <Text style={styles.horoscopeButtonText}>{formatDate(horoscopeBirthday)}</Text>
                </TouchableOpacity>
              </View>

              {/* Notification Time Section */}
              <View style={styles.horoscopeSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Notification Time</Text>
                <TouchableOpacity
                  style={[styles.horoscopeButton, { backgroundColor: '#06b6d4' }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.horoscopeButtonText}>{formatTime(horoscopeTime)}</Text>
                </TouchableOpacity>
              </View>

              {/* Info Text */}
              <View style={styles.horoscopeSection}>
                <Text style={[styles.infoText, { color: mutedColor }]}>
                  We'll use your birthday to calculate your zodiac sign and send personalized daily horoscope notifications at your preferred time.
                </Text>
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.horoscopeSaveButton, { backgroundColor: '#8b5cf6' }]}
              onPress={handleSaveHoroscopeSettings}
            >
              <Text style={styles.horoscopeSaveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Native Birthday Picker */}
      {showBirthdayPicker && (
        <DateTimePicker
          value={horoscopeBirthday}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowBirthdayPicker(false);
            if (event.type === 'set' && selectedDate) {
              setHoroscopeBirthday(selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {/* Native Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={horoscopeTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (event.type === 'set' && selectedTime) {
              setHoroscopeTime(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    marginTop: 16,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  footerButtonText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff',
    marginVertical: 12,
  },
  themeToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  themeModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 8,
  },
  themeModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModeButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  themeModeText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  notificationButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  halfButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  halfButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  thirdButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  thirdButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  horoscopeModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  horoscopeModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 16,
  },
  horoscopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  horoscopeTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  horoscopeContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  horoscopeSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  horoscopeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horoscopeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  horoscopeSaveButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  horoscopeSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  navigationGrid: {
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  gridButtonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  gridButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  helpModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    width: '85%',
    maxHeight: '70%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  helpModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  helpVersionText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  helpBuildText: {
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.7,
  },
  helpBrandTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  helpBrandSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
  },
  helpCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpCloseButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#999',
  },
  helpButtonsContainer: {
    marginTop: 8,
  },
  helpButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  numerologyOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numerologyContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  numerologyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  numerologyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  numerologyInput: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  numerologyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  numerologyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  numerologyResultContainer: {
    maxHeight: 250,
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  numerologyResultText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  numerologyCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numerologyCloseButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#999',
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  debugInput: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  debugButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
