/**
 * Notifications Settings Screen
 * Dedicated tool screen under Tool Kit for configuring Daily Horoscope,
 * custom multi-notifications, and testing delivery.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../ThemeContext';
import NotificationService from '../../help/services/NotificationService';
import { ToastService } from '../../help/services/ToastService';
import { getZodiacSign } from '../../help/services/ZodiacService';
import PwaService from '../../../shared/PwaService';

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const [horoscopeEnabled, setHoroscopeEnabled] = useState(false);
  const [horoscopeBirthday, setHoroscopeBirthday] = useState(new Date());
  const [horoscopeTime, setHoroscopeTime] = useState(new Date());
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsPwaInstalled(PwaService.isStandalone());
      const unsub = PwaService.subscribe(() => {
        setIsPwaInstalled(PwaService.isStandalone());
      });
      return unsub;
    }
  }, []);

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
        const hasPerm = await NotificationService.checkPermissions();
        setPermissionStatus(hasPerm ? 'granted' : 'pending');

        const enabled = await AsyncStorage.getItem('horoscopeNotificationsEnabled');
        const birthday = await AsyncStorage.getItem('horoscopeBirthday');
        const time = await AsyncStorage.getItem('horoscopeNotificationTime');
        if (enabled !== null) setHoroscopeEnabled(JSON.parse(enabled));
        if (birthday !== null) setHoroscopeBirthday(new Date(birthday));
        if (time !== null) setHoroscopeTime(new Date(time));
      } catch (e) {
        console.warn('[Notifications] Failed to load preferences:', e);
      }
    })();
  }, []);

  const saveHoroscopeSettings = async (enabled: boolean) => {
    try {
      if (enabled) {
        const granted = await NotificationService.checkAndRequestPermissions();
        setPermissionStatus(granted ? 'granted' : 'denied');
      }
      await AsyncStorage.setItem('horoscopeNotificationsEnabled', JSON.stringify(enabled));
      await AsyncStorage.setItem('horoscopeBirthday', horoscopeBirthday.toISOString());
      await AsyncStorage.setItem('horoscopeNotificationTime', horoscopeTime.toISOString());
      await NotificationService.scheduleHoroscopeNotification(horoscopeBirthday, horoscopeTime, enabled);
      ToastService.show(enabled ? 'Daily horoscope notification enabled' : 'Daily horoscope notification disabled', 'short');
    } catch (e) {
      ToastService.show('Failed to save notification settings', 'short');
      console.error('[Notifications] save settings error:', e);
    }
  };

  const handleTestNotification = async () => {
    await NotificationService.sendTestNotification();
    const hasPerm = await NotificationService.checkPermissions();
    setPermissionStatus(hasPerm ? 'granted' : 'denied');
  };

  const handleScheduleTestAlert = async (secondsFromNow: number) => {
    const triggerDate = new Date(Date.now() + secondsFromNow * 1000);
    const id = `test-alert-${Date.now()}`;
    await NotificationService.scheduleCustomNotification({
      id,
      title: '🔔 Cauldron Timed Alert',
      body: `Your scheduled ${secondsFromNow}s alert has arrived!`,
      triggerDate,
    });
    ToastService.show(`Scheduled alert in ${secondsFromNow} seconds`, 'short');
  };

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const zodiac = getZodiacSign(horoscopeBirthday);

  return (
    <View style={[styles.screen, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: bottomPadding }}>
        <Text style={[styles.title, { color: textColor }]}>🔔 Notification Settings</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Manage daily horoscope deliveries, custom multi-alerts, and system permissions.
        </Text>

        {Platform.OS === 'web' && (
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity
              style={[
                styles.installWebAppCard,
                {
                  backgroundColor: isDarkMode ? '#231d38' : '#ede9fe',
                  borderColor: accent,
                },
              ]}
              onPress={async () => {
                const { installed, notifications } = await PwaService.promptInstallAndEnableNotifications();
                const hasPerm = await NotificationService.checkPermissions();
                setPermissionStatus(hasPerm ? 'granted' : 'denied');
                if (notifications) {
                  ToastService.show('Notifications enabled! You will receive alerts when browser is closed.', 'long');
                }
                if (installed) {
                  setIsPwaInstalled(true);
                  ToastService.show('Cauldron Web App installed to desktop/mobile!', 'long');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.installCardTitle, { color: textColor }]}>
                  {isPwaInstalled ? '✅ Web App Installed & Active' : '📲 Install Web App'}
                </Text>
                <Text style={[styles.installCardSub, { color: mutedColor }]}>
                  Installs Cauldron to your PC/Mac or Home Screen with desktop push notifications enabled when the app is closed.
                </Text>
              </View>
              <View style={[styles.installBadge, { backgroundColor: accent }]}>
                <Text style={styles.installBadgeText}>{isPwaInstalled ? 'Configured' : 'Install'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* DAILY HOROSCOPE SECTION */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>DAILY HOROSCOPE</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={[styles.linkText, { color: textColor }]}>🔔  Daily horoscope notification</Text>
              <Text style={[styles.subText, { color: mutedColor }]}>
                Delivers sign {zodiac.emoji} {zodiac.name} insights to your device.
              </Text>
            </View>
            <Switch
              value={horoscopeEnabled}
              onValueChange={(v) => {
                setHoroscopeEnabled(v);
                saveHoroscopeSettings(v);
              }}
              trackColor={{ true: accent, false: '#767577' }}
            />
          </View>

          <TouchableOpacity
            style={[styles.linkRow, { borderBottomColor: borderColor }]}
            onPress={() => setShowBirthdayPicker(true)}
          >
            <Text style={[styles.linkText, { color: textColor }]}>🎂  Birthday (Zodiac)</Text>
            <Text style={[styles.valueText, { color: accent }]}>{formatDate(horoscopeBirthday)} ({zodiac.emoji} {zodiac.name})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchRow} onPress={() => setShowTimePicker(true)}>
            <Text style={[styles.linkText, { color: textColor }]}>⏰  Delivery time</Text>
            <Text style={[styles.valueText, { color: accent }]}>{formatTime(horoscopeTime)}</Text>
          </TouchableOpacity>
        </View>

        {showBirthdayPicker && (
          <DateTimePicker
            value={horoscopeBirthday}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => {
              if (Platform.OS !== 'ios' && Platform.OS !== 'web') {
                setShowBirthdayPicker(false);
              }
              if (d) {
                setHoroscopeBirthday(d);
                if (horoscopeEnabled) saveHoroscopeSettings(true);
              }
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={horoscopeTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => {
              if (Platform.OS !== 'ios' && Platform.OS !== 'web') {
                setShowTimePicker(false);
              }
              if (d) {
                setHoroscopeTime(d);
                if (horoscopeEnabled) saveHoroscopeSettings(true);
              }
            }}
          />
        )}

        {/* MULTI-ALERT & TEST NOTIFICATIONS */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>TESTING & MULTI-ALERTS</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={[styles.linkRow, { borderBottomColor: borderColor }]}
            onPress={handleTestNotification}
          >
            <Text style={[styles.linkText, { color: textColor }]}>⚡  Send instant test notification</Text>
            <Text style={[styles.chevron, { color: mutedColor }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, { borderBottomColor: borderColor }]}
            onPress={() => handleScheduleTestAlert(10)}
          >
            <Text style={[styles.linkText, { color: textColor }]}>⏱️  Schedule test alert (in 10s)</Text>
            <Text style={[styles.chevron, { color: mutedColor }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, { borderBottomColor: borderColor }]}
            onPress={() => handleScheduleTestAlert(60)}
          >
            <Text style={[styles.linkText, { color: textColor }]}>⏱️  Schedule test alert (in 60s)</Text>
            <Text style={[styles.chevron, { color: mutedColor }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={async () => {
              await NotificationService.cancelAllNotifications();
              ToastService.show('All scheduled alerts cleared', 'short');
            }}
          >
            <Text style={[styles.linkText, { color: '#ef4444' }]}>🗑️  Clear all scheduled notifications</Text>
          </TouchableOpacity>
        </View>

        {/* PLATFORM ARCHITECTURE INFO */}
        <Text style={[styles.sectionHeader, { color: mutedColor }]}>SYSTEM STATUS</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.linkText, { color: textColor }]}>Platform</Text>
            <Text style={[styles.valueText, { color: mutedColor }]}>{Platform.OS.toUpperCase()}</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.linkText, { color: textColor }]}>Permission Status</Text>
            <Text style={[styles.valueText, { color: permissionStatus === 'granted' ? '#10b981' : '#f59e0b' }]}>
              {permissionStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linkText: { fontSize: 16, fontWeight: '500' },
  subText: { fontSize: 12, marginTop: 2 },
  valueText: { fontSize: 14, fontWeight: '500' },
  chevron: { fontSize: 18 },
  installWebAppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  installCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  installCardSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  installBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
