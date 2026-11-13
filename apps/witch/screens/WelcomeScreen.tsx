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
import AppodealService from '../AppodealService';
import NotificationService from '../services/NotificationService';
import { ToastService } from '../services/ToastService';
import VersionCheckService from '../VersionCheckService';
import { calculateMoonPhase, getNextPhaseDates, getMonthCalendar, formatDateFull, type MoonPhaseInfo } from '../utils/MoonPhaseCalculator';

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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Numerology Calculator States
  const [showNumerologyModal, setShowNumerologyModal] = useState(false);
  const [numerologyInput, setNumerologyInput] = useState('');
  const [numerologyResult, setNumerologyResult] = useState('');

  // Moon Phase Tracker States
  const [showMoonPhaseModal, setShowMoonPhaseModal] = useState(false);
  const [selectedMoonDate, setSelectedMoonDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState(14);
  const [showMoonDatePicker, setShowMoonDatePicker] = useState(false);
  const [currentMoonPhase, setCurrentMoonPhase] = useState<MoonPhaseInfo | null>(null);
  const [nextPhaseDates, setNextPhaseDates] = useState<any[]>([]);
  const [moonCalendar, setMoonCalendar] = useState<MoonPhaseInfo[]>([]);

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

  // Check for app updates on startup
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        await VersionCheckService.checkForUpdates();
      } catch (error) {
        // Silently ignore version check errors (common in dev/test environments)
        // console.debug('[WelcomeScreen] Version check failed (expected in dev):', error?.message);
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

  const handleMoonPhase = () => {
    const phaseInfo = calculateMoonPhase(selectedMoonDate);
    setCurrentMoonPhase(phaseInfo);
    setNextPhaseDates(getNextPhaseDates(selectedMoonDate, 4));
    setMoonCalendar(getMonthCalendar(selectedMoonDate, calendarDays));
    setShowMoonPhaseModal(true);
  };

  const handleUpdateMoonPhase = (newDate: Date) => {
    setSelectedMoonDate(newDate);
    const phaseInfo = calculateMoonPhase(newDate);
    setCurrentMoonPhase(phaseInfo);
    setNextPhaseDates(getNextPhaseDates(newDate, 4));
    setMoonCalendar(getMonthCalendar(newDate, calendarDays));
  };

  const handleCalendarDaysChange = (days: number) => {
    setCalendarDays(days);
    setMoonCalendar(getMonthCalendar(selectedMoonDate, days));
  };

  const handleShareApp = async () => {
    try {
      const appStoreLink = Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/pocketmystic/id6739472969'
        : 'https://play.google.com/store/apps/details?id=com.prch.pmystic';

      await Share.share({
        message: Platform.OS === 'ios'
          ? `Check out pocketWitch - The spiritual toolkit in your pocket! ${appStoreLink}`
          : `Check out pocketWitch - The spiritual toolkit in your pocket!\n${appStoreLink}`,
        url: appStoreLink,
        title: 'Share pocketWitch',
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleMoreApps = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/developer/prch-global/id1234567890' // Update with your iOS developer ID
      : 'https://play.google.com/store/apps/developer?id=PrCh+Global';

    Linking.openURL(url).catch(() => {
      // Fallback if developer link doesn't work
      Linking.openURL('https://prch.online');
    });
  };

  const handleDebugPasskeySubmit = async () => {
    const input = debugPasskey.trim();

    // Handle original test mode passkey
    if (input === 'testmode=PrCh438') {
      try {
        await setMultipleLockStates({
          witchG: 'test',
          witchF: 'test',
          witchC: 'test',
          witchS: 'test',
        });

        Alert.alert('Test Mode Enabled', 'All witches unlocked for this session. Will reset on app restart.');
        setShowDebugModal(false);
        setDebugPasskey('');
      } catch (error) {
        console.error('Error setting test mode:', error);
        Alert.alert('Error', 'Failed to enable test mode: ' + error);
      }
    }
    // Handle subscription active debug mode
    else if (input === 'testmode=sub-on-yes-1') {
      PurchaseService.setDebugSubscriptionMode('active');
      Alert.alert('Debug Mode Enabled', 'Subscription is now ACTIVE in debug mode. This persists until app restart.');
      setShowDebugModal(false);
      setDebugPasskey('');
    }
    // Handle subscription inactive debug mode
    else if (input === 'testmode=sub-on-no-2') {
      PurchaseService.setDebugSubscriptionMode('inactive');
      Alert.alert('Debug Mode Enabled', 'Subscription is now INACTIVE in debug mode. This persists until app restart.');
      setShowDebugModal(false);
      setDebugPasskey('');
    }
    // Handle clear debug mode
    else if (input === 'testmode=clear-debug') {
      PurchaseService.setDebugSubscriptionMode('none');
      Alert.alert('Debug Mode Cleared', 'All debug modes have been cleared. Using real subscription checks.');
      setShowDebugModal(false);
      setDebugPasskey('');
    }
    else {
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
          <Text style={[styles.title, { color: textColor }]}>pocketWitch</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            The wiccan toolkit in your pocket!
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={[styles.content, { paddingHorizontal: 16 + Math.max(insets.left, insets.right), paddingBottom: bannerTop ? 60 : 0 }]}>
          {/* Navigation Grid - 2 rows x 2 columns */}
          <View style={styles.navigationGrid}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#52c41a' }]}
                onPress={() => handleNavigateTo('GreenWitch')}
              >
                <Text style={styles.gridButtonEmoji}>🌿</Text>
                <Text style={styles.gridButtonText}>Green Witch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#ff69b4' }]}
                onPress={() => handleNavigateTo('SpiritWitch')}
              >
                <Text style={styles.gridButtonEmoji}>🌬️</Text>
                <Text style={styles.gridButtonText}>Spirit Witch</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#00d4ff' }]}
                onPress={() => handleNavigateTo('FlowWitch')}
              >
                <Text style={styles.gridButtonEmoji}>🌊</Text>
                <Text style={styles.gridButtonText}>Flow Witch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridButton, { backgroundColor: '#ffc857' }]}
                onPress={() => handleNavigateTo('CosmicWitch')}
              >
                <Text style={styles.gridButtonEmoji}>☄️</Text>
                <Text style={styles.gridButtonText}>Cosmic Witch</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Help Modal */}
      <Modal visible={showHelpModal} transparent animationType="fade">
        <View style={[styles.helpModalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.helpModalContent, { backgroundColor: cardBg }]}>
            <View>
              <Text style={[styles.helpModalTitle, { color: textColor }]}>Help</Text>
              <Text style={[styles.helpVersionText, { color: textColor }]}>
                v1.0 <Text style={styles.helpBuildText}>(build 1)</Text>
              </Text>
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
          <View style={[styles.helpModalContent, { backgroundColor: cardBg, maxHeight: '80%' }]}>
            <Text style={[styles.helpModalTitle, { color: textColor }]}>Debug Help</Text>

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

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.debugSectionTitle, { color: textColor }]}>Enter Passkey</Text>
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
                <Text style={styles.debugButtonText}>Apply Passkey</Text>
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Moon Phase Modal */}
      <Modal visible={showMoonPhaseModal} transparent animationType="fade">
        <View style={[styles.moonPhaseModalOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <View style={[styles.moonPhaseModalContent, { backgroundColor: cardBg }]}>
            {/* Header */}
            <View style={styles.moonPhaseHeader}>
              <Text style={[styles.moonPhaseTitle, { color: textColor }]}>Moon Phases</Text>
              <TouchableOpacity onPress={() => setShowMoonPhaseModal(false)}>
                <Text style={[styles.closeText, { color: mutedColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.moonPhaseContent} showsVerticalScrollIndicator={false}>
              {/* Current Moon Phase Section */}
              {currentMoonPhase && (
                <View style={[styles.currentPhaseContainer, { borderColor: mutedColor }]}>
                  <Text style={styles.moonEmoji}>{currentMoonPhase.phaseEmoji}</Text>
                  <Text style={[styles.phaseName, { color: textColor }]}>{currentMoonPhase.phaseName}</Text>
                  <Text style={[styles.illuminationText, { color: mutedColor }]}>
                    Illumination: {currentMoonPhase.illumination}%
                  </Text>
                  <Text style={[styles.illuminationText, { color: mutedColor }]}>
                    Age: {currentMoonPhase.age} days
                  </Text>
                  <Text style={[styles.zodiacText, { color: mutedColor }]}>
                    Lunar Zodiac: {currentMoonPhase.zodiacEmoji} {currentMoonPhase.zodiacSign}
                  </Text>
                </View>
              )}

              {/* Date Picker Section */}
              <View style={styles.datePickerSection}>
                <TouchableOpacity
                  style={[styles.todayButton, { backgroundColor: '#e0e7ff' }]}
                  onPress={() => handleUpdateMoonPhase(new Date())}
                >
                  <Text style={[styles.todayButtonText, { color: '#7c3aed' }]}>Set to today</Text>
                </TouchableOpacity>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Select Date</Text>
                <TouchableOpacity
                  style={[styles.datePickerButton, { backgroundColor: '#7c3aed' }]}
                  onPress={() => setShowMoonDatePicker(true)}
                >
                  <Text style={styles.horoscopeButtonText}>{selectedMoonDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>

              {/* Calendar Days Toggle */}
              <Text style={[styles.sectionLabel, { color: textColor }]}>Calendar View</Text>
              <View style={styles.calendarToggle}>
                {[7, 14, 30].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.calendarToggleButton,
                      {
                        backgroundColor: calendarDays === days ? '#7c3aed' : '#e5e5e5',
                      },
                    ]}
                    onPress={() => handleCalendarDaysChange(days)}
                  >
                    <Text
                      style={[
                        styles.horoscopeButtonText,
                        { color: calendarDays === days ? '#fff' : textColor },
                      ]}
                    >
                      {days}D
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Moon Calendar */}
              {moonCalendar.length > 0 && (
                <View style={styles.calendarContainer}>
                  {moonCalendar.map((day, index) => (
                    <View key={index} style={[styles.dayItem, { borderBottomColor: mutedColor }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.illuminationText, { color: textColor }]}>
                          {new Date(selectedMoonDate.getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.moonEmoji}>{day.phaseEmoji}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={[styles.illuminationText, { color: mutedColor }]}>{day.illumination}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Next Important Dates */}
              {nextPhaseDates.length > 0 && (
                <View style={styles.nextDatesContainer}>
                  <Text style={[styles.sectionLabel, { color: textColor }]}>Next Important Dates</Text>
                  {nextPhaseDates.map((phase, index) => (
                    <View key={index} style={[styles.nextDateItem, { borderBottomColor: mutedColor }]}>
                      <Text style={[styles.illuminationText, { color: textColor }]}>
                        {phase.emoji} {phase.phaseName}
                      </Text>
                      <Text style={[styles.illuminationText, { color: mutedColor }]}>
                        {phase.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Moon Date Picker */}
      {showMoonDatePicker && (
        <DateTimePicker
          value={selectedMoonDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowMoonDatePicker(false);
            if (event.type === 'set' && selectedDate) {
              handleUpdateMoonPhase(selectedDate);
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
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  horoscopeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  debugSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  debugPasskeyItem: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  debugPasskeyCode: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  debugPasskeyDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  // Moon Phase Tracker Styles
  moonPhaseModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonPhaseModalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  moonPhaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moonPhaseTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  moonPhaseContent: {
    paddingHorizontal: 4,
  },
  currentPhaseContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  moonEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  phaseName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  illuminationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  zodiacText: {
    fontSize: 14,
    marginTop: 8,
  },
  datePickerSection: {
    marginBottom: 16,
  },
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  todayButton: {
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 0,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 8,
  },
  calendarToggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderBottomWidth: 1,
  },
  nextDatesContainer: {
    marginTop: 12,
  },
  nextDateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
