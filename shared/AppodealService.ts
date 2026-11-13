import Appodeal, { AppodealAdType } from 'react-native-appodeal';
import { Platform } from 'react-native';
import { APPODEAL_APP_KEY as APPODEAL_KEYS, AD_TEST_MODE } from './monetization';

// Appodeal App Key from the central Cauldron ad config (shared/monetization.ts).
const APPODEAL_APP_KEY = Platform.OS === 'ios' ? APPODEAL_KEYS.ios : APPODEAL_KEYS.android;

export class AppodealService {
  private static instance: AppodealService;

  private constructor() {}

  static getInstance(): AppodealService {
    if (!AppodealService.instance) {
      AppodealService.instance = new AppodealService();
    }
    return AppodealService.instance;
  }

  /**
   * Initialize Appodeal SDK
   */
  async initialize(): Promise<void> {
    try {
      console.log('[Appodeal] Initializing Appodeal SDK...');

      // Initialize Appodeal with both banner and rewarded video ad types
      const adTypes = AppodealAdType.REWARDED_VIDEO | AppodealAdType.BANNER;
      Appodeal.initialize(APPODEAL_APP_KEY, adTypes);
      console.log('[Appodeal] SDK initialized with BANNER and REWARDED_VIDEO');

      // Test vs production ads is controlled centrally (shared/monetization.ts).
      Appodeal.setTesting(AD_TEST_MODE);
      console.log(`[Appodeal] Test mode ${AD_TEST_MODE ? 'ENABLED (test ads)' : 'disabled (production ads)'}`);

      // Set auto cache for both banner and rewarded video
      Appodeal.setAutoCache(AppodealAdType.BANNER, true);
      Appodeal.setAutoCache(AppodealAdType.REWARDED_VIDEO, true);
      console.log('[Appodeal] Auto-cache enabled for banner and rewarded video');

      // Initial cache of banner and rewarded video ads - do it multiple times
      console.log('[Appodeal] Requesting initial cache (attempt 1)');
      Appodeal.cache(AppodealAdType.BANNER);
      Appodeal.cache(AppodealAdType.REWARDED_VIDEO);

      // Aggressive re-caching at 500ms
      setTimeout(() => {
        try {
          console.log('[Appodeal] Requesting cache (attempt 2 at 500ms)');
          Appodeal.cache(AppodealAdType.BANNER);
          Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
        } catch (err) {
          console.error('[Appodeal] Error during cache at 500ms:', err);
        }
      }, 500);

      // Another cache at 1s
      setTimeout(() => {
        try {
          console.log('[Appodeal] Requesting cache (attempt 3 at 1s)');
          Appodeal.cache(AppodealAdType.BANNER);
          Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
        } catch (err) {
          console.error('[Appodeal] Error during cache at 1s:', err);
        }
      }, 1000);

      // Check status and cache again if needed
      setTimeout(() => {
        try {
          const bannerLoaded = Appodeal.isLoaded(AppodealAdType.BANNER);
          const videoLoaded = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
          console.log(`[Appodeal] Ad status at 5s - Banner: ${bannerLoaded}, Video: ${videoLoaded}`);

          if (!bannerLoaded) {
            console.log('[Appodeal] Banner not loaded, requesting cache again...');
            Appodeal.cache(AppodealAdType.BANNER);
          }
          if (!videoLoaded) {
            console.log('[Appodeal] Rewarded video not loaded, requesting cache again...');
            Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
          }
        } catch (err) {
          console.error('[Appodeal] Error checking ad status:', err);
        }
      }, 5000);

      // Additional check at 10 seconds
      setTimeout(() => {
        try {
          const bannerLoaded = Appodeal.isLoaded(AppodealAdType.BANNER);
          const videoLoaded = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
          console.log(`[Appodeal] Ad status at 10s - Banner: ${bannerLoaded}, Video: ${videoLoaded}`);
        } catch (err) {
          console.error('[Appodeal] Error checking ad status at 10s:', err);
        }
      }, 10000);

      console.log('[Appodeal] Initialization complete');
    } catch (error) {
      console.error('[Appodeal] Failed to initialize:', error);
    }
  }

  /**
   * Pre-cache rewarded video ads before showing
   */
  precacheRewardedVideo(): void {
    try {
      console.log('[Appodeal] Pre-caching rewarded video ads...');
      Appodeal.cache(AppodealAdType.REWARDED_VIDEO);
    } catch (error) {
      console.error('[Appodeal] Error pre-caching rewarded video:', error);
    }
  }

  /**
   * Compatibility alias: pocketMagick screens call showRewardedAd()
   */
  async showRewardedAd(): Promise<boolean> {
    return this.showRewardedVideo();
  }

  /**
   * Show a rewarded video ad and wait for completion
   * @returns Promise<boolean> - true if ad was watched completely, false if cancelled
   */
  async showRewardedVideo(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      try {
        console.log('[Appodeal] Attempting to show rewarded video...');
        console.log('[Appodeal] Checking Appodeal SDK state...');

        // First attempt to cache if not loaded
        console.log('[Appodeal] Requesting rewarded video cache...');
        Appodeal.cache(AppodealAdType.REWARDED_VIDEO);

        // Check if rewarded video is available
        const isAvailable = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
        console.log(`[Appodeal] Ad available immediately: ${isAvailable}`);
        console.log('[Appodeal] Test mode status:', Appodeal.getLogLevel?.() || 'unknown');

        if (!isAvailable) {
          console.warn('[Appodeal] No rewarded video ad loaded, attempting to cache and retry...');

          // Wait for ad to load
          let attempts = 0;
          const checkInterval = setInterval(() => {
            attempts++;
            const retryAvailable = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
            console.log(`[Appodeal] Ad check attempt ${attempts}: ${retryAvailable}`);

            if (retryAvailable) {
              clearInterval(checkInterval);
              console.log('[Appodeal] Ad loaded, attempting to show...');

              let resolvedFromRetry = false;

              const onRetryFinish = () => {
                if (!resolvedFromRetry) {
                  resolvedFromRetry = true;
                  console.log('[Appodeal] Video finished, user earned reward');
                  subscriptions.forEach(sub => sub.remove());
                  resolve(true);
                }
              };

              const onRetryClose = () => {
                if (!resolvedFromRetry) {
                  resolvedFromRetry = true;
                  console.log('[Appodeal] Video closed without completion');
                  subscriptions.forEach(sub => sub.remove());
                  resolve(false);
                }
              };

              const onRetryExpired = () => {
                if (!resolvedFromRetry) {
                  resolvedFromRetry = true;
                  console.log('[Appodeal] Video expired');
                  subscriptions.forEach(sub => sub.remove());
                  resolve(false);
                }
              };

              subscriptions.push(Appodeal.addEventListener('onRewardedVideoFinished', onRetryFinish));
              subscriptions.push(Appodeal.addEventListener('onRewardedVideoClosed', onRetryClose));
              subscriptions.push(Appodeal.addEventListener('onRewardedVideoExpired', onRetryExpired));

              try {
                Appodeal.show(AppodealAdType.REWARDED_VIDEO);
              } catch (showError) {
                console.error('[Appodeal] Error showing ad:', showError);
                resolve(false);
              }
            } else if (attempts >= 10) {
              clearInterval(checkInterval);
              console.warn('[Appodeal] Ads not available after 10 attempts (5 seconds)');
              resolve(false);
            }
          }, 500);

          return;
        }

        let resolved = false;
        const subscriptions: Array<{ remove: () => void }> = [];

        // Set up event listeners
        const onFinish = () => {
          if (!resolved) {
            resolved = true;
            console.log('[Appodeal] Video finished, user earned reward');
            subscriptions.forEach(sub => sub.remove());
            resolve(true);
          }
        };

        const onClose = () => {
          if (!resolved) {
            resolved = true;
            console.log('[Appodeal] Video closed without completion');
            subscriptions.forEach(sub => sub.remove());
            resolve(false);
          }
        };

        const onExpired = () => {
          if (!resolved) {
            resolved = true;
            console.log('[Appodeal] Video expired');
            subscriptions.forEach(sub => sub.remove());
            resolve(false);
          }
        };

        subscriptions.push(Appodeal.addEventListener('onRewardedVideoFinished', onFinish));
        subscriptions.push(Appodeal.addEventListener('onRewardedVideoClosed', onClose));
        subscriptions.push(Appodeal.addEventListener('onRewardedVideoExpired', onExpired));

        console.log('[Appodeal] Showing ad to user...');
        // Show the ad
        Appodeal.show(AppodealAdType.REWARDED_VIDEO);

        // Timeout after 90 seconds
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.warn('[Appodeal] Ad display timeout');
            subscriptions.forEach(sub => sub.remove());
            resolve(false);
          }
        }, 90000);
      } catch (error) {
        console.error('[Appodeal] Error showing rewarded video:', error);
        resolve(false);
      }
    });
  }

  /**
   * Check if rewarded video is available
   */
  isRewardedVideoAvailable(): boolean {
    try {
      const isLoaded = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
      console.log(`[Appodeal] Rewarded video available: ${isLoaded}`);
      return isLoaded;
    } catch (error) {
      console.error('[Appodeal] Error checking rewarded video availability:', error);
      return false;
    }
  }

  /**
   * Cache ads to be ready for display
   */
  cacheAds(): void {
    try {
      console.log('[Appodeal] Requesting ad cache for BANNER and REWARDED_VIDEO...');
      Appodeal.cache(AppodealAdType.BANNER);
      Appodeal.cache(AppodealAdType.REWARDED_VIDEO);

      // Verify cache was requested
      setTimeout(() => {
        const bannerLoaded = Appodeal.isLoaded(AppodealAdType.BANNER);
        const videoLoaded = Appodeal.isLoaded(AppodealAdType.REWARDED_VIDEO);
        console.log(`[Appodeal] Ad cache status after request - Banner: ${bannerLoaded}, Video: ${videoLoaded}`);
      }, 2000);
    } catch (error) {
      console.error('[Appodeal] Error caching ads:', error);
    }
  }

  /**
   * Show a banner ad at bottom of screen
   */
  showBannerAd(): void {
    try {
      console.log('[Appodeal] Showing banner ad...');
      Appodeal.show(AppodealAdType.BANNER);
      console.log('[Appodeal] Banner ad displayed');
    } catch (error) {
      console.error('[Appodeal] Error showing banner ad:', error);
    }
  }

  /**
   * Hide the banner ad
   */
  hideBannerAd(): void {
    try {
      console.log('[Appodeal] Hiding banner ad...');
      Appodeal.hide(AppodealAdType.BANNER);
      console.log('[Appodeal] Banner ad hidden');
    } catch (error) {
      console.error('[Appodeal] Error hiding banner ad:', error);
    }
  }

  /**
   * Check if banner ad is available
   */
  isBannerAdAvailable(): boolean {
    try {
      const isLoaded = Appodeal.isLoaded(AppodealAdType.BANNER);
      console.log(`[Appodeal] Banner ad available: ${isLoaded}`);
      return isLoaded;
    } catch (error) {
      console.error('[Appodeal] Error checking banner ad availability:', error);
      return false;
    }
  }
}

export default AppodealService.getInstance();
