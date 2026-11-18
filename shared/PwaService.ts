/**
 * PWA & Web Push Service
 * Manages service worker registration, installation prompt (beforeinstallprompt),
 * and desktop/mobile notification permission for the web version of Cauldron.
 */

import { Platform } from 'react-native';

let deferredPrompt: any = null;
const listeners = new Set<() => void>();

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Capture beforeinstallprompt event for PWA installation
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
    listeners.forEach((fn) => fn());
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn());
    console.log('[PWA] Cauldron Web App installed successfully');
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/cauldron/sw.js', { scope: '/cauldron/' })
        .then((reg) => {
          console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    });
  }
}

export const PwaService = {
  /**
   * Check if app is already running in standalone mode (installed PWA)
   */
  isStandalone(): boolean {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
    const isStandaloneWindow = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = (window.navigator as any).standalone === true;
    return !!(isStandaloneWindow || isNavigatorStandalone);
  },

  /**
   * Detect device platform for web visitors: 'ios' | 'android' | 'desktop'
   */
  getDeviceType(): 'ios' | 'android' | 'desktop' {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'desktop';
    const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera || '';
    const platform = (navigator as any).platform || '';

    // iOS detection (including iPadOS on desktop Safari)
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

    if (isIOS) return 'ios';

    // Android detection
    if (/Android/i.test(ua)) return 'android';

    return 'desktop';
  },

  /**
   * Check if installation prompt is available
   */
  canInstall(): boolean {
    return !!deferredPrompt && !this.isStandalone();
  },

  /**
   * Subscribe to installability changes
   */
  subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Trigger the PWA installation dialog AND request notification permissions
   * so users receive alerts on PC/Mac even when closed.
   */
  async promptInstallAndEnableNotifications(): Promise<{ installed: boolean; notifications: boolean }> {
    let notifications = false;
    let installed = false;

    // 1. Request notification permission first / concurrently
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        notifications = perm === 'granted';
      } catch (err) {
        console.warn('[PWA] Notification request error:', err);
      }
    }

    // 2. Prompt PWA install if event captured
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          installed = true;
          deferredPrompt = null;
          listeners.forEach((fn) => fn());
        }
      } catch (err) {
        console.warn('[PWA] Install prompt error:', err);
      }
    } else {
      // If deferredPrompt is not available (e.g. Safari, or already installed, or browser doesn't support beforeinstallprompt)
      installed = this.isStandalone();
    }

    return { installed, notifications };
  },
};

export default PwaService;
