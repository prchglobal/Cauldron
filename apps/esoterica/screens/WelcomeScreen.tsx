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
// DateTimePicker removed (horoscope feature removed)
import { AdsConsent } from 'react-native-google-mobile-ads';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import { useBanner } from '../BannerContext';
import PurchaseService from '../PurchaseService';
import NotificationService from '../services/NotificationService';
import { ToastService } from '../services/ToastService';
// TarotReadingModal removed (feature removed)
import VersionCheckService from '../VersionCheckService';
import { AdService } from '../services/AdService';

// Gnostic Terminology Glossary
const GNOSTIC_GLOSSARY: Record<string, string> = {
  'Aeons': 'Divine emanations from the Monad; eternal spiritual beings in the Pleroma.',
  'Archons': 'Lesser powers that serve the Demiurge and maintain material illusion.',
  'Christos': 'The Anointed One; consciousness awakened to divine nature and authority.',
  'Descent and Ascent': 'The soul\'s journey into matter and the return to divine source.',
  'Divine Embodiment': 'The body as sacred vessel for conscious divine presence.',
  'Divine Light': 'The eternal radiance emanating from the Monad through all creation.',
  'Demiurge': 'The false creator god who traps consciousness in material illusion.',
  'Fall into Matter': 'The forgetting of divine origin through manifestation and incarnation.',
  'Fractal Geometry': 'Sacred patterns repeating across all scales of divine creation.',
  'Gnostic Differentiation': 'Discriminating between divine and demiurgic consciousness.',
  'Gnosis': 'Direct experiential knowledge of the divine nature of reality.',
  'Golden Proportion': 'The divine ratio found throughout natural creation.',
  'Interior Silence': 'The sacred void within where infinite wisdom dwells.',
  'Incarnational': 'Relating to divine consciousness entering and sanctifying material form.',
  'Jacob\'s Ladder': 'The vertical axis of revelation connecting earth to heaven.',
  'Logos': 'The Divine Word; the principle of divine intelligence and cosmic order.',
  'Meta-awareness': 'Awareness of awareness itself; transcendent consciousness.',
  'Monad': 'The ultimate divine source; the One from which all emanates.',
  'Mythic Interiorization': 'Making cosmic myths alive and active within consciousness.',
  'Ontological': 'Concerning the fundamental nature of being and existence itself.',
  'Pattern Recognition': 'Perceiving divine order and sacred geometry within manifestation.',
  'Pleroma': 'The fullness of divine presence; the realm of eternal light and wisdom.',
  'Pneuma': 'Spirit; the divine breath and essence animating all life.',
  'Sacred Cycles': 'The eternal rhythmic patterns in divine manifestation.',
  'Sacred Seed': 'The divine spark or generative power within each being.',
  'Sapiential': 'Relating to wisdom; connected to the path of Sophia and enlightenment.',
  'Seth': 'The true seed of light planted in matter; the uncorrupted divine lineage.',
  'Sophia': 'Divine Wisdom; the emanation of the Monad dwelling in the Pleroma.',
  'Vertical Axis': 'The sacred connection between material and divine realms.',
};

export function WelcomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode, themeMode, setThemeMode, highlightColor } = useTheme();
  const { setLockState, setMultipleLockStates, isLocked, hasUnlockedPractice } = useLocks();
  const { bannerTop } = useBanner();

  // Calculate padding dynamically based on banner position
  // If banner top is known, calculate padding to stop before it
  // Otherwise use a reasonable default
  const bottomPadding = insets.bottom + 76;
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Debug Mode States
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugPasskey, setDebugPasskey] = useState('');

  // Terminology Modal State
  const [showTerminologyModal, setShowTerminologyModal] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  // Numerology feature removed

  // Horoscope feature removed

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

  // Tarot reading removed

  const handleHelpButtonPress = () => {
    setShowHelpModal(true);
  };

  const handleUMPConsent = async () => {
    try {
      console.log('[UMP] Opening privacy options form...');
      const infoAfter = await AdsConsent.showPrivacyOptionsForm();
      console.log('[UMP] Privacy options form closed, consent info:', infoAfter);
    } catch (error) {
      console.error('[UMP] Error showing privacy options form:', error);
      Alert.alert('Error', 'Failed to load privacy options. Please try again.');
    }
  };

  // Horoscope removed

  // Meditation music removed

  const handleShareApp = async () => {
    try {
      const appStoreLink = Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/pocketmystic/id6739472969'
        : 'https://play.google.com/store/apps/details?id=com.prch.pesoterica';

      await Share.share({
        message: Platform.OS === 'ios'
          ? `Check out pEsoterica - The spiritual toolkit in your pocket! ${appStoreLink}`
          : `Check out pEsoterica - The spiritual toolkit in your pocket!\n${appStoreLink}`,
        url: appStoreLink,
        title: 'Share pEsoterica',
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
    try {
      if (debugPasskey === 'testmode=PrCh438') {
        // Unlock all 20 individual practice locks (4 features × 5 practices each)
        await setMultipleLockStates({
          sophia: 'unlocked',
          seth: 'unlocked',
          logos: 'unlocked',
          christos: 'unlocked',
        });

        Alert.alert('Test Mode Enabled', 'All 20 practice locks are now unlocked!');
        setShowDebugModal(false);
        setDebugPasskey('');
      } else if (debugPasskey === 'Reset=yes') {
        // Reset all locks to default state
        await setMultipleLockStates({
          sophia: 'locked',
          seth: 'locked',
          logos: 'locked',
          christos: 'locked',
          sophia_practice_1: 'unlocked',
        });

        Alert.alert('Locks Reset', 'All locks have been reset to default state!');
        setShowDebugModal(false);
        setDebugPasskey('');
      } else if (debugPasskey === 'TestAds') {
        // Test Appodeal ads with 100% probability
        setShowDebugModal(false);
        setDebugPasskey('');
        try {
          const result = await AdService.showRewardedVideoAd(100);
          if (result) {
            Alert.alert('Ad Test Complete', 'Rewarded video ad test completed (100% probability)', [{ text: 'OK' }]);
          }
        } catch (adError) {
          const errorMessage = adError instanceof Error ? adError.message : String(adError);
          Alert.alert('Ad Failed', `Error showing ad: ${errorMessage}`, [{ text: 'OK' }]);
        }
      } else {
        Alert.alert('Invalid Passkey', 'The passkey you entered is incorrect.');
        setDebugPasskey('');
      }
    } catch (error) {
      console.error('Error processing passkey:', error);
      Alert.alert('Error', 'Failed to process passkey: ' + error);
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
          <Text style={[styles.title, { color: textColor }]}>pocketEsoterica</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Explore the ancient secrets of Christ Conciousness
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={[styles.content, { paddingHorizontal: 16 + Math.max(insets.left, insets.right), paddingBottom: bannerTop ? 60 : 0 }]}>
          {/* Navigation Grid - Single Column */}
          <View style={styles.navigationGrid}>
            {/* Sophia */}
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: '#00008B' }]}
              onPress={() => handleNavigateTo('Sophia')}
            >
              <Text style={styles.gridButtonEmoji}>🕊️</Text>
              <Text style={styles.gridButtonText}>Sophia</Text>
            </TouchableOpacity>

            {/* Seth */}
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: '#0047AB', opacity: hasUnlockedPractice('seth') ? 1 : 0.4 }]}
              onPress={() => handleNavigateTo('Seth')}
            >
              <Text style={styles.gridButtonEmoji}>🐍</Text>
              <Text style={styles.gridButtonText}>Seth {!hasUnlockedPractice('seth') ? '🔒' : ''}</Text>
            </TouchableOpacity>

            {/* Logos */}
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: '#4A90E2', opacity: hasUnlockedPractice('logos') ? 1 : 0.4 }]}
              onPress={() => handleNavigateTo('Logos')}
            >
              <Text style={styles.gridButtonEmoji}>☀️</Text>
              <Text style={styles.gridButtonText}>Logos {!hasUnlockedPractice('logos') ? '🔒' : ''}</Text>
            </TouchableOpacity>

            {/* Christos */}
            <TouchableOpacity
              style={[styles.gridButton, { backgroundColor: '#87CEEB', opacity: hasUnlockedPractice('christos') ? 1 : 0.4 }]}
              onPress={() => handleNavigateTo('Christos')}
            >
              <Text style={styles.gridButtonEmoji}>👑</Text>
              <Text style={styles.gridButtonText}>Christos {!hasUnlockedPractice('christos') ? '🔒' : ''}</Text>
            </TouchableOpacity>
          </View>

          {/* Removed: Tarot, Numerology, Meditation, Horoscope features */}
          <View style={styles.separator} />

          {/* Terminology Button */}
          <TouchableOpacity
            style={[styles.fullButton, { backgroundColor: '#8b5cf6' }]}
            onPress={() => setShowTerminologyModal(true)}
          >
            <Text style={styles.fullButtonText}>📖 Terminology</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Tarot reading removed */}

      {/* Help Modal */}
      <Modal visible={showHelpModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <View>
              <Text style={[styles.helpModalTitle, { color: textColor }]}>Help</Text>
              <Text style={[styles.helpVersionText, { color: textColor }]}>
                v1.0 <Text style={styles.helpBuildText}>(build 1)</Text>
              </Text>
              <Text style={[styles.appNameText, { color: textColor }]}>pocketEsoterica™</Text>
              <Text style={[styles.copyrightText, { color: mutedColor }]}>PrCh® Software | PrCh Global Trust©</Text>
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

      {/* Numerology removed */}

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

      {/* Meditation music removed */}

      {/* Terminology Modal */}
      <Modal visible={showTerminologyModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.helpModalTitle, { color: textColor }]}>Gnostic Terminology</Text>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => setShowTerminologyModal(false)}
            >
              <Text style={styles.helpCloseButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Glossary Terms */}
            <ScrollView style={styles.helpButtonsContainer}>
              {Object.entries(GNOSTIC_GLOSSARY).map(([term, definition]) => (
                <View key={term} style={styles.glossaryEntry}>
                  <Text style={[styles.glossaryTerm, { color: textColor }]}>{term}</Text>
                  <Text style={[styles.glossaryDefinition, { color: mutedColor }]}>
                    {definition}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Horoscope removed */}
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
  fullButton: {
    marginTop: 16,
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
  fullButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridButton: {
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
  appNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
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
  glossaryEntry: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  glossaryTerm: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  glossaryDefinition: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
});
