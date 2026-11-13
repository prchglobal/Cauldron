/**
 * Notification Service
 * Handles scheduling and managing local notifications for horoscopes and custom alerts.
 * Multi-notification support for iOS, Android, and Web Notification API fallback.
 */

import { PermissionsAndroid, Platform } from 'react-native';
import { getZodiacSign } from '../services/ZodiacService';
import { API_CONFIG } from '../config';
import { ToastService } from '../services/ToastService';

let notifee: any = null;
let TriggerType: any = null;
let RepeatFrequency: any = null;
let AndroidImportance: any = null;

try {
  const notifeeModule = require('@notifee/react-native');
  notifee = notifeeModule.default || notifeeModule;
  TriggerType = notifeeModule.TriggerType;
  RepeatFrequency = notifeeModule.RepeatFrequency;
  AndroidImportance = notifeeModule.AndroidImportance;
} catch {
  // Web or stub
}

const HOROSCOPE_TEMPLATES: Record<string, string> = {
  aries: 'Today is perfect for new beginnings. Your confidence will open doors. Trust your instincts.',
  taurus: 'Stability and comfort are within reach. A practical approach yields rewards. Stay grounded.',
  gemini: 'Communication flows freely today. Connection brings joy. Share your ideas with confidence.',
  cancer: 'Trust your emotions today. Intuition guides you to what matters most. Nurture yourself.',
  leo: 'Your natural charisma shines brightly. Express yourself boldly. Leadership opportunities await.',
  virgo: 'Details matter today. Your analytical mind finds solutions. Trust the process, refine your plans.',
  libra: 'Balance and harmony are within reach. Relationships flourish. Choose peace and cooperation.',
  scorpio: 'Transformation is in the air. Embrace change with courage. Your power lies in resilience.',
  sagittarius: 'Adventure calls! Expand your horizons. Optimism opens unexpected pathways. Explore freely.',
  capricorn: 'Hard work pays dividends today. Goals come closer. Persistence and discipline lead to success.',
  aquarius: 'Innovation and change energize you. Think differently. Your unique perspective creates impact.',
  pisces: 'Dreams guide you today. Creativity flows freely. Trust the mystical energies around you.',
};

const HOROSCOPE_CHANNEL_ID = 'horoscope-channel';
const GENERAL_CHANNEL_ID = 'general-notifications';

export class NotificationService {
  /**
   * Initialize Notifee channels for Android
   */
  static async initialize(): Promise<void> {
    try {
      if (Platform.OS === 'android' && notifee) {
        await notifee.createChannel({
          id: HOROSCOPE_CHANNEL_ID,
          name: 'Horoscope Notifications',
          description: 'Daily horoscope notifications',
          importance: AndroidImportance?.HIGH ?? 4,
          sound: 'default',
          vibration: true,
          vibrationPattern: [100, 200, 100, 200],
        });

        await notifee.createChannel({
          id: GENERAL_CHANNEL_ID,
          name: 'General Alerts',
          description: 'Cauldron reminders and alerts',
          importance: AndroidImportance?.DEFAULT ?? 3,
          sound: 'default',
          vibration: true,
          vibrationPattern: [100, 200, 100, 200],
        });
      }
    } catch (error) {
      console.warn('[Notifications] Error initializing:', error);
    }
  }

  /**
   * Check if notification permission is granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          return Notification.permission === 'granted';
        }
        return false;
      }

      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }
        return true;
      }

      if (notifee) {
        const settings = await notifee.getNotificationSettings();
        return settings.authorizationStatus >= 1;
      }
      return false;
    } catch (error) {
      console.warn('[Notifications] Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          const perm = await Notification.requestPermission();
          return perm === 'granted';
        }
        return false;
      }

      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'Cauldron needs permission to deliver your daily horoscope and reminders.',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            }
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }

      if (notifee) {
        const settings = await notifee.requestPermission();
        return settings.authorizationStatus >= 1;
      }
      return false;
    } catch (error) {
      console.warn('[Notifications] Error requesting permissions:', error);
      return false;
    }
  }

  static async checkAndRequestPermissions(): Promise<boolean> {
    const granted = await this.requestPermissions();
    if (granted) {
      ToastService.show('Notifications enabled', 'short');
    }
    return granted;
  }

  private static async getHoroscopePreview(zodiacSign: string): Promise<string> {
    try {
      if (!API_CONFIG?.NINJAS_API_KEY || API_CONFIG.NINJAS_API_KEY === 'YOUR_API_KEY_HERE') {
        return HOROSCOPE_TEMPLATES[zodiacSign] || 'Check your horoscope today!';
      }

      const response = await fetch(
        `${API_CONFIG.NINJAS_BASE_URL}/horoscope?zodiac=${zodiacSign}`,
        {
          method: 'GET',
          headers: { 'X-Api-Key': API_CONFIG.NINJAS_API_KEY },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.horoscope && typeof data.horoscope === 'string') {
          const fullText = data.horoscope;
          const truncateAt = Math.ceil(fullText.length * 0.4);
          return fullText.substring(0, truncateAt) + '...';
        }
      }
    } catch {
      // fallback
    }
    return HOROSCOPE_TEMPLATES[zodiacSign] || 'Check your horoscope today!';
  }

  /**
   * Schedule daily horoscope notification
   */
  static async scheduleHoroscopeNotification(
    birthday: Date,
    notificationTime: Date,
    enabled: boolean
  ): Promise<void> {
    try {
      await this.cancelNotification('horoscope-daily');

      if (!enabled) return;

      const zodiac = getZodiacSign(birthday);
      const horoscopePreview = await this.getHoroscopePreview(zodiac.sign);

      const hours = notificationTime.getHours();
      const minutes = notificationTime.getMinutes();
      const scheduleDate = new Date();
      scheduleDate.setHours(hours, minutes, 0, 0);
      if (scheduleDate <= new Date()) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      if (notifee && Platform.OS !== 'web') {
        await notifee.createTriggerNotification(
          {
            id: 'horoscope-daily',
            title: `Your ${zodiac.name} Horoscope ${zodiac.emoji}`,
            body: horoscopePreview,
            data: {
              zodiacSign: zodiac.sign,
              zodiacName: zodiac.name,
              zodiacEmoji: zodiac.emoji,
              deepLink: 'cauldron://horoscopes',
              isHoroscopeNotification: 'true',
            },
            android: {
              channelId: HOROSCOPE_CHANNEL_ID,
              sound: 'default',
              vibration: [100, 200, 100, 200],
              pressAction: { id: 'default' },
            },
            ios: { sound: 'default' },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: scheduleDate.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
          }
        );
      } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Store scheduled time in localStorage for web worker or foreground timer
        localStorage.setItem('cauldron_web_horoscope_scheduled', scheduleDate.toISOString());
      }
    } catch (error) {
      console.error('[Notifications] Error scheduling horoscope:', error);
    }
  }

  /**
   * Schedule any custom alert (Multi-notification support for iOS, Android & Web)
   */
  static async scheduleCustomNotification(options: {
    id: string;
    title: string;
    body: string;
    triggerDate?: Date;
    deepLink?: string;
  }): Promise<void> {
    try {
      const { id, title, body, triggerDate, deepLink } = options;

      if (notifee && Platform.OS !== 'web') {
        if (triggerDate && triggerDate > new Date()) {
          await notifee.createTriggerNotification(
            {
              id,
              title,
              body,
              data: { deepLink: deepLink || 'cauldron://menu' },
              android: {
                channelId: GENERAL_CHANNEL_ID,
                sound: 'default',
                vibration: [100, 200, 100, 200],
                pressAction: { id: 'default' },
              },
              ios: { sound: 'default' },
            },
            {
              type: TriggerType.TIMESTAMP,
              timestamp: triggerDate.getTime(),
            }
          );
        } else {
          await notifee.displayNotification({
            id,
            title,
            body,
            data: { deepLink: deepLink || 'cauldron://menu' },
            android: {
              channelId: GENERAL_CHANNEL_ID,
              sound: 'default',
              vibration: [100, 200, 100, 200],
              pressAction: { id: 'default' },
            },
            ios: { sound: 'default' },
          });
        }
      } else if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          if (triggerDate && triggerDate > new Date()) {
            const delay = triggerDate.getTime() - Date.now();
            setTimeout(() => {
              new Notification(title, { body, icon: '/favicon.ico' });
            }, delay);
          } else {
            new Notification(title, { body, icon: '/favicon.ico' });
          }
        }
      }
    } catch (error) {
      console.error('[Notifications] Error in scheduleCustomNotification:', error);
    }
  }

  /**
   * Cancel specific notification
   */
  static async cancelNotification(id: string): Promise<void> {
    try {
      if (notifee && Platform.OS !== 'web') {
        await notifee.cancelNotification(id);
      }
    } catch (e) {
      console.warn('[Notifications] Error cancelling:', e);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      if (notifee && Platform.OS !== 'web') {
        await notifee.cancelAllNotifications();
      }
    } catch (e) {
      console.warn('[Notifications] Error cancelling all:', e);
    }
  }

  /**
   * Send immediate test notification
   */
  static async sendTestNotification(): Promise<void> {
    try {
      await this.checkAndRequestPermissions();

      if (notifee && Platform.OS !== 'web') {
        await notifee.displayNotification({
          id: `test-${Date.now()}`,
          title: '🫙 Cauldron Test Notification',
          body: 'Notifications are functioning properly for your device!',
          data: {
            deepLink: 'cauldron://horoscopes',
            isHoroscopeNotification: 'true',
          },
          android: {
            channelId: HOROSCOPE_CHANNEL_ID,
            sound: 'default',
            vibration: [100, 200, 100, 200],
            pressAction: { id: 'default' },
          },
          ios: { sound: 'default' },
        });
        ToastService.show('Test notification sent!', 'short');
      } else if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('🫙 Cauldron Test Notification', {
              body: 'Web Notifications are active!',
              icon: '/favicon.ico',
            });
            ToastService.show('Web notification sent!', 'short');
          } else {
            const res = await Notification.requestPermission();
            if (res === 'granted') {
              new Notification('🫙 Cauldron Test Notification', {
                body: 'Web Notifications are active!',
                icon: '/favicon.ico',
              });
              ToastService.show('Web notification sent!', 'short');
            } else {
              ToastService.show('Notification permission denied by browser', 'short');
            }
          }
        }
      }
    } catch (error) {
      console.error('[Notifications] Error sending test notification:', error);
    }
  }
}

export default NotificationService;
