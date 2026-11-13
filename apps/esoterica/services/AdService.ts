import AppodealService from '../AppodealService';

export class AdService {
  /**
   * Show a rewarded video ad
   * @param probability Probability of showing ad (0-100)
   */
  static async showRewardedVideoAd(probability: number = 100): Promise<boolean> {
    try {
      console.log(`[AdService] Attempting to show rewarded video ad (${probability}% probability)`);

      // Random chance to show ad
      const shouldShowAd = Math.random() * 100 < probability;

      if (!shouldShowAd) {
        console.log('[AdService] Random probability check failed, skipping ad');
        return true;
      }

      // Check if rewarded video is available
      const isAvailable = AppodealService.isRewardedVideoAvailable();
      console.log(`[AdService] Rewarded video available: ${isAvailable}`);

      if (!isAvailable) {
        console.warn('[AdService] Rewarded video not available, proceeding without ad');
        return true;
      }

      // Show the rewarded video and wait for it to complete
      const watched = await AppodealService.showRewardedVideo();
      console.log(`[AdService] Rewarded video completed: ${watched}`);

      return true;
    } catch (error) {
      console.error('[AdService] Error showing rewarded video ad:', error);
      // Gracefully degrade - proceed even if ad fails
      return true;
    }
  }
}
