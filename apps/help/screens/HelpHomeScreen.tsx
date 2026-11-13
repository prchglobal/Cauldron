import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Linking,
  Alert,
  Share,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AdsConsent } from 'react-native-google-mobile-ads';
import { useTheme } from '../../../shared/ThemeContext';
import { useBanner } from '../../../shared/BannerContext';
import { AdFreeModal } from '../../../shared/components/AdFreeModal';
import { PurchaseManager, setGlobalDebugMode, getGlobalDebugMode } from '../../../shared/PurchaseService';
import { DEV_PASSKEYS } from '../../../shared/monetization';
import NotificationService from '../services/NotificationService';
import { ToastService } from '../services/ToastService';

const DEV_URL = Platform.OS === 'ios'
  ? 'https://apps.apple.com/developer/prch-global/id1234567890'
  : 'https://play.google.com/store/apps/developer?id=PrCh+Global';

export function HelpHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode, themeMode, setThemeMode } = useTheme();
  const { bannerTop, isAdFree } = useBanner();

  const [showAdFreeModal, setShowAdFreeModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [devTaps, setDevTaps] = useState(0);
  const [devVisible, setDevVisible] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [debugMode, setDebugMode] = useState(getGlobalDebugMode());

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const owned = await PurchaseManager.restorePurchases();
      ToastService.show(
        owned.length > 0 ? `Restored ${owned.length} purchase(s)` : 'No purchases found',
        'short',
      );
    } catch (e) {
      Alert.alert('Restore failed', 'Could not restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleUnlock = async () => {
    try {
      await PurchaseManager.initialize();
      const ok = await PurchaseManager.purchaseSubscription();
      if (ok) ToastService.show('Thank you! Unlocking...', 'short');
    } catch (e) {
      Alert.alert('Purchase error', 'Could not start the purchase. Please try again.');
    }
  };

  const onVersionTap = () => {
    const n = devTaps + 1;
    setDevTaps(n);
    if (n >= 7) {
      setDevVisible(true);
      ToastService.show('Developer options unlocked', 'short');
    }
  };

  const applyPasskey = () => {
    const key = passkey.trim();
    let mode = getGlobalDebugMode();
    if (key === DEV_PASSKEYS.subOn) mode = 'active';
    else if (key === DEV_PASSKEYS.subOff) mode = 'inactive';
    else if (key === DEV_PASSKEYS.clear) mode = 'none';
    else {
      Alert.alert('Invalid passkey', 'That developer passkey was not recognised.');
      setPasskey('');
      return;
    }
    setGlobalDebugMode(mode);
    setDebugMode(mode);
    setPasskey('');
    ToastService.show(`Debug subscription: ${mode}`, 'short');
  };

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#444' : '#e0e0e0';
  const accent = '#8b5cf6';

  const bottomPadding = insets.bottom + 76;

  useEffect(() => {
    (async () => {
      try {
        await NotificationService.initialize();
        const enabled = await AsyncStorage.getItem('horoscopeNotificationsEnabled');
        const birthday = await AsyncStorage.getItem('horoscopeBirthday');
        const time = await AsyncStorage.getItem('horoscopeNotificationTime');
        if (enabled !== null) setHoroscopeEnabled(JSON.parse(enabled));
        if (birthday !== null) setHoroscopeBirthday(new Date(birthday));
        if (time !== null) setHoroscopeTime(new Date(time));
      } catch (e) {
        console.warn('[Help] Failed to load notification prefs:', e);
      }
    })();
  }, []);

  const saveHoroscopeSettings = async (enabled: boolean) => {
    try {
      if (enabled) {
        await NotificationService.checkAndRequestPermissions();
      }
      await AsyncStorage.setItem('horoscopeNotificationsEnabled', JSON.stringify(enabled));
      await AsyncStorage.setItem('horoscopeBirthday', horoscopeBirthday.toISOString());
      await AsyncStorage.setItem('horoscopeNotificationTime', horoscopeTime.toISOString());
      await NotificationService.scheduleHoroscopeNotification(horoscopeBirthday, horoscopeTime, enabled);
      ToastService.show(enabled ? 'Daily horoscope on' : 'Daily horoscope off', 'short');
    } catch (e) {
      ToastService.show('Failed to save notification settings', 'short');
      console.error('[Help] save horoscope settings error:', e);
    }
  };

  const handleUMPConsent = async () => {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch (e) {
      Alert.alert('Error', 'Failed to load privacy options. Please try again.');
    }
  };

  const handleShareApp = async () => {
    try {
      const link = Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id6739472969'
        : 'https://play.google.com/store/apps/details?id=com.prch.cauldron';
      await Share.share({ message: `Check out Cauldron — a pocket of spiritual practice!\n${link}`, url: link });
    } catch (e) {
      console.warn('[Help] share error:', e);
    }
  };

  const openURL = (url: string) => Linking.openURL(url).catch(() => Linking.openURL('https://prch.online'));

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const linkRow = (emoji: string, label: string, onPress: () => void) => (
    <TouchableOpacity style={[styles.linkRow, { borderBottomColor: borderColor }]} onPress={onPress}>
      <Text style={[styles.linkText, { color: textColor }]}>{emoji}  {label}</Text>
      <Text style={[styles.chevron, { color: mutedColor }]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screen, { backgroundColor: containerBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: bottomPadding }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: accent, fontSize: 28, fontWeight: '300', marginTop: -2, marginRight: 6 }}>‹</Text><Text style={{ fontSize: 18, fontWeight: '700', color: textColor, letterSpacing: 0.3 }}>🫙 Cauldron</Text></View>
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>❓ Help</Text>

        {/* Theme */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.themeRow}>
            {(['light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeButton,
                  { backgroundColor: themeMode === mode ? accent : (isDarkMode ? '#3a3a3a' : '#f0f0f0') },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text style={[styles.themeButtonText, { color: themeMode === mode ? '#fff' : textColor }]}>
                  {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Help */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>HELP &amp; SUPPORT</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {linkRow('🔔', 'Notification Settings', () => navigation.navigate('Tools', { category: 'Notifications' }))}
          {linkRow('🔑', 'Privacy settings', handleUMPConsent)}
          {linkRow('📋', 'Terms of Use', () => openURL('https://prch.online/agreements'))}
          {linkRow('🔒', 'Privacy Policy', () => openURL('https://prch.online/privacy'))}
          {linkRow('✉️', 'Contact us', () => openURL('https://prch.online/contact'))}
        </View>

        {/* Purchases (Native app only, completely hidden on Web) */}
        {Platform.OS !== 'web' && (
          <>
            <Text style={[styles.sectionHeader, { color: mutedColor }]}>PURCHASES</Text>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              {linkRow('✨', 'Unlock all (all-access)', handleUnlock)}
              {linkRow(isAdFree ? '🛡️' : '🚫', isAdFree ? 'Ad-Free (Active)' : 'Ad-Free ($1.99)', () => setShowAdFreeModal(true))}
              <TouchableOpacity style={styles.switchRow} onPress={handleRestore} disabled={isRestoring}>
                <Text style={[styles.linkText, { color: textColor }]}>♻️  Restore purchases</Text>
                <Text style={[styles.valueText, { color: mutedColor }]}>{isRestoring ? 'Restoring…' : ''}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* About */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {linkRow('📤', 'Share Cauldron', handleShareApp)}
          {linkRow('🔗', 'More apps by PrCh', () => openURL(DEV_URL))}
          <TouchableOpacity style={styles.switchRow} onPress={onVersionTap} activeOpacity={1}>
            <Text style={[styles.linkText, { color: mutedColor }]}>Version</Text>
            <Text style={[styles.valueText, { color: mutedColor }]}>Cauldron 1.1</Text>
          </TouchableOpacity>
        </View>

        {/* Developer / Test (hidden - tap Version 7×) */}
        {devVisible && (
          <>
            <Text style={[styles.sectionHeader, { color: mutedColor }]}>DEVELOPER</Text>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.switchRow}>
                <Text style={[styles.linkText, { color: textColor }]}>Debug subscription</Text>
                <Text style={[styles.valueText, { color: debugMode === 'active' ? '#2ea043' : mutedColor }]}>{debugMode}</Text>
              </View>
              <View style={{ paddingVertical: 12 }}>
                <TextInput
                  style={[styles.passInput, { color: textColor, backgroundColor: isDarkMode ? '#1f1f1f' : '#f0f0f0' }]}
                  placeholder="Developer passkey"
                  placeholderTextColor={mutedColor}
                  autoCapitalize="none"
                  value={passkey}
                  onChangeText={setPasskey}
                  onSubmitEditing={applyPasskey}
                />
                <TouchableOpacity style={[styles.passButton, { backgroundColor: accent }]} onPress={applyPasskey}>
                  <Text style={styles.passButtonText}>Apply</Text>
                </TouchableOpacity>
                <Text style={[styles.passHint, { color: mutedColor }]}>
                  {DEV_PASSKEYS.subOn} · {DEV_PASSKEYS.subOff} · {DEV_PASSKEYS.clear}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <AdFreeModal
        visible={showAdFreeModal}
        onClose={() => setShowAdFreeModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backRow: { marginBottom: 8 },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  sectionHeader: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  card: {
    borderRadius: 12,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  themeRow: { flexDirection: 'row', paddingVertical: 14, gap: 12 },
  themeButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  themeButtonText: { fontSize: 15, fontWeight: '600' },
  passInput: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 10 },
  passButton: { borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
  passButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  passHint: { fontSize: 11, marginTop: 10 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linkText: { fontSize: 15 },
  valueText: { fontSize: 14 },
  chevron: { fontSize: 22, fontWeight: '300' },
});
