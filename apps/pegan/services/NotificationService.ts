/**
 * Notification Service
 * Handles scheduling and managing local notifications for horoscopes using Notifee
 */

import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { getZodiacSign } from './ZodiacService';
import { API_CONFIG } from '../config';
import { ToastService } from './ToastService';

// Fallback horoscope templates for each zodiac sign (if API fails)
const HOROSCOPE_TEMPLATES: Record<string, string> = {
  aries:
    'Today is perfect for new beginnings. Your confidence will open doors. Trust your instincts.',
  taurus:
    'Stability and comfort are within reach. A practical approach yields rewards. Stay grounded.',
  gemini:
    'Communication flows freely today. Connection brings joy. Share your ideas with confidence.',
  cancer:
    'Trust your emotions today. Intuition guides you to what matters most. Nurture yourself.',
  leo:
    'Your natural charisma shines brightly. Express yourself boldly. Leadership opportunities await.',
  virgo:
    'Details matter today. Your analytical mind finds solutions. Trust the process, refine your plans.',
  libra:
    'Balance and harmony are within reach. Relationships flourish. Choose peace and cooperation.',
  scorpio:
    'Transformation is in the air. Embrace change with courage. Your power lies in resilience.',
  sagittarius:
    'Adventure calls! Expand your horizons. Optimism opens unexpected pathways. Explore freely.',
  capricorn:
    'Hard work pays dividends today. Goals come closer. Persistence and discipline lead to success.',
  aquarius:
    'Innovation and change energize you. Think differently. Your unique perspective creates impact.',
  pisces:
    'Dreams guide you today. Creativity flows freely. Trust the mystical energies around you.',
};

// Notification channel ID
const HOROSCOPE_CHANNEL_ID = 'horoscope-channel';

export class NotificationService {
  /**
   * Initialize Notifee library
   */
  static async initialize(): Promise<void> {
    try {
      console.log('[Notifications] Initializing Notifee...');

      // Create notification channel for Android 8.0+
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: HOROSCOPE_CHANNEL_ID,
          name: 'Horoscope Notifications',
          description: 'Daily horoscope notifications',
          importance: 4, // IMPORTANCE_DEFAULT
          sound: 'default',
          vibration: true,
        });
        console.log('[Notifications] Android notification channel created');
      }

      console.log('[Notifications] Notifee initialized');
    } catch (error) {
      console.error('[Notifications] Error initializing Notifee:', error);
    }
  }

  /**
   * Check if notification permissions are granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('[Notifications] Android permission status:', hasPermission);
        return hasPermission;
      } else {
        // For iOS, check using Notifee
        const settings = await notifee.getNotificationSettings();
        const hasAlert = settings.authorizationStatus >= 1; // Authorized
        console.log('[Notifications] iOS permission status:', hasAlert);
        return hasAlert;
      }
    } catch (error) {
      console.error('[Notifications] Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions from user
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        console.log('[Notifications] Starting permission request flow...');
        console.log('[Notifications] Platform.Version:', Platform.Version);

        // Step 1: Request POST_NOTIFICATIONS
        console.log('[Notifications] Step 1 - Requesting POST_NOTIFICATIONS...');
        let postNotificationsGranted = false;

        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'pocketPegan needs permission to send you daily horoscope notifications.',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            }
          );
          postNotificationsGranted = result === PermissionsAndroid.RESULTS.GRANTED;
          console.log('[Notifications] POST_NOTIFICATIONS permission result:', result);
          console.log('[Notifications] POST_NOTIFICATIONS granted:', postNotificationsGranted);
        } catch (error) {
          console.error('[Notifications] Error requesting POST_NOTIFICATIONS:', error);
          postNotificationsGranted = false;
        }

        // Step 2: Request SCHEDULE_EXACT_ALARM if POST_NOTIFICATIONS was granted AND Android 12+
        let scheduleAlarmGranted = false;

        if (postNotificationsGranted && Platform.Version >= 31) {
          console.log('[Notifications] Step 2 - POST_NOTIFICATIONS granted, now requesting SCHEDULE_EXACT_ALARM...');
          console.log('[Notifications] Android version is', Platform.Version, '(>= 31)');

          try {
            const result = await PermissionsAndroid.request(
              'android.permission.SCHEDULE_EXACT_ALARM',
              {
                title: 'Schedule Alarms Permission',
                message: 'pocketPegan needs permission to schedule exact notification times.',
                buttonNegative: 'Cancel',
                buttonPositive: 'Allow',
              }
            );
            scheduleAlarmGranted = result === PermissionsAndroid.RESULTS.GRANTED;
            console.log('[Notifications] SCHEDULE_EXACT_ALARM permission result:', result);
            console.log('[Notifications] SCHEDULE_EXACT_ALARM granted:', scheduleAlarmGranted);
          } catch (error) {
            console.error('[Notifications] Error requesting SCHEDULE_EXACT_ALARM:', error);
            scheduleAlarmGranted = false;
          }
        } else if (!postNotificationsGranted) {
          console.log('[Notifications] POST_NOTIFICATIONS not granted, skipping SCHEDULE_EXACT_ALARM');
        } else if (Platform.Version < 31) {
          console.log('[Notifications] Android version is', Platform.Version, '(< 31), SCHEDULE_EXACT_ALARM not needed');
        }

        // Return true if at least POST_NOTIFICATIONS is granted
        const success = postNotificationsGranted;
        console.log('[Notifications] Final permission status - POST_NOTIFICATIONS:', postNotificationsGranted, 'SCHEDULE_EXACT_ALARM:', scheduleAlarmGranted);
        return success;
      } else {
        // For iOS, request permissions using Notifee
        console.log('[Notifications] Requesting iOS permissions...');
        const settings = await notifee.requestPermission();
        const hasAlert = settings.authorizationStatus >= 1; // Authorized
        console.log('[Notifications] iOS permission result:', hasAlert);
        return hasAlert;
      }
    } catch (error) {
      console.error('[Notifications] Error in requestPermissions:', error);
      return false;
    }
  }

  /**
   * Check and request notification permissions if needed
   */
  static async checkAndRequestPermissions(): Promise<void> {
    try {
      console.log('[Notifications] Starting permission check and request flow...');
      // Request permissions with sequential flow (each dialog waits for user response or timeout)
      const granted = await this.requestPermissions();

      if (granted) {
        console.log('[Notifications] All required permissions granted!');
        ToastService.show('You will now receive daily horoscope notifications.', 'long');
      } else {
        console.warn('[Notifications] One or more permissions were not granted');
        // Don't show error toast - user may have intentionally denied
      }
    } catch (error) {
      console.error('[Notifications] Error in checkAndRequestPermissions:', error);
    }
  }

  /**
   * Fetch horoscope preview from API (first half of text + "...")
   */
  private static async getHoroscopePreview(zodiacSign: string): Promise<string> {
    try {
      if (API_CONFIG.NINJAS_API_KEY === 'YOUR_API_KEY_HERE') {
        // Return fallback if API key not configured
        return HOROSCOPE_TEMPLATES[zodiacSign] || 'Check your horoscope today!';
      }

      const response = await fetch(
        `${API_CONFIG.NINJAS_BASE_URL}/horoscope?zodiac=${zodiacSign}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': API_CONFIG.NINJAS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.horoscope && typeof data.horoscope === 'string') {
        // Extract 40% of text and append "..."
        const fullText = data.horoscope;
        const truncateAt = Math.ceil(fullText.length * 0.4);
        const preview = fullText.substring(0, truncateAt) + '...';
        return preview;
      }

      // Fallback if no horoscope in response
      return HOROSCOPE_TEMPLATES[zodiacSign] || 'Check your horoscope today!';
    } catch (error) {
      console.warn(`[Notifications] Failed to fetch horoscope from API: ${error}`);
      // Return fallback horoscope on API error
      return HOROSCOPE_TEMPLATES[zodiacSign] || 'Check your horoscope today!';
    }
  }

  /**
   * Schedule daily horoscope notification
   */
  static async scheduleHoroscopeNotification(
    birthday: Date,
    notificationTime: Date,
    enabled: boolean
  ): Promise<void> {
    console.log('[Notifications] scheduleHoroscopeNotification called with enabled:', enabled);
    try {
      // Cancel existing notifications first
      console.log('[Notifications] Calling cancelAllNotifications...');
      await this.cancelAllNotifications();
      console.log('[Notifications] cancelAllNotifications completed');

      if (!enabled) {
        console.log('[Notifications] Horoscope notifications disabled');
        return;
      }

      // Get zodiac sign
      const zodiac = getZodiacSign(birthday);

      // Fetch horoscope preview from API (first 50% + "...")
      const horoscopePreview = await this.getHoroscopePreview(zodiac.sign);

      // Schedule notification to repeat daily at specified time
      const hours = notificationTime.getHours();
      const minutes = notificationTime.getMinutes();

      const scheduleDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        hours,
        minutes,
        0
      );

      // If the scheduled time is in the past, schedule for tomorrow instead
      const now = new Date();
      if (scheduleDate < now) {
        console.log('[Notifications] Scheduled time is in the past, scheduling for tomorrow instead');
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      console.log(`[Notifications] Scheduling horoscope notification:`);
      console.log(`  Zodiac: ${zodiac.name}`);
      console.log(`  Time: ${hours}:${String(minutes).padStart(2, '0')}`);
      console.log(`  Schedule Date: ${scheduleDate.toString()}`);
      console.log(`  Current Time: ${new Date().toString()}`);
      console.log(`  Message: ${horoscopePreview}`);

      // Schedule the notification
      await notifee.createTriggerNotification(
        {
          id: 'horoscope-daily-' + zodiac.sign,
          title: `Your ${zodiac.name} Horoscope ${zodiac.emoji}`,
          body: horoscopePreview,
          data: {
            zodiacSign: zodiac.sign,
            zodiacName: zodiac.name,
            zodiacEmoji: zodiac.emoji,
            deepLink: 'pocketoccultist://horoscopes',
          },
          android: {
            channelId: HOROSCOPE_CHANNEL_ID,
            sound: 'default',
            vibration: [100, 200, 100],
            loopSound: false,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
          },
          ios: {
            sound: 'default',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: scheduleDate.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
        }
      );

      console.log(
        `[Notifications] Scheduled ${zodiac.name} horoscope at ${hours}:${String(minutes).padStart(2, '0')}`
      );

      // Verify notification was scheduled
      setTimeout(async () => {
        const scheduled = await notifee.getTriggerNotificationIds();
        console.log(
          `[Notifications] Verified - ${scheduled.length} notification(s) scheduled:`,
          scheduled
        );
      }, 500);
    } catch (error) {
      console.error('[Notifications] Error scheduling notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      const scheduled = await notifee.getTriggerNotificationIds();
      for (const id of scheduled) {
        await notifee.cancelNotification(id);
        console.log(`[Notifications] Cancelled notification: ${id}`);
      }
      if (scheduled.length > 0) {
        console.log(`[Notifications] All ${scheduled.length} notifications cancelled`);
      } else {
        console.log('[Notifications] No scheduled notifications to cancel');
      }
    } catch (error) {
      console.error('[Notifications] Error cancelling notifications:', error);
    }
  }

  /**
   * Cancel specific notification by ID
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await notifee.cancelNotification(notificationId);
      console.log(`[Notifications] Cancelled notification: ${notificationId}`);
    } catch (error) {
      console.error('[Notifications] Error cancelling notification:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  static async getScheduledNotifications(): Promise<string[]> {
    try {
      const scheduled = await notifee.getTriggerNotificationIds();
      console.log('[Notifications] Scheduled:', scheduled);
      return scheduled;
    } catch (error) {
      console.error('[Notifications] Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Send a test notification immediately (for debugging)
   */
  static async sendTestNotification(): Promise<void> {
    try {
      console.log('[Notifications] Sending test notification immediately');
      await notifee.displayNotification({
        id: 'test-notification',
        title: 'Test Notification',
        body: 'This is a test notification to verify the system is working.',
        android: {
          channelId: HOROSCOPE_CHANNEL_ID,
          sound: 'default',
          vibration: [100, 200, 100],
          loopSound: false,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
      console.log('[Notifications] Test notification displayed');
    } catch (error) {
      console.error('[Notifications] Error sending test notification:', error);
    }
  }
}

export default NotificationService;
