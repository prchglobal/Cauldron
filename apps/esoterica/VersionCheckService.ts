import versionCheck from 'react-native-version-check';
import { Alert, Linking, Platform } from 'react-native';

export class VersionCheckService {
  private static instance: VersionCheckService;

  private constructor() {}

  static getInstance(): VersionCheckService {
    if (!VersionCheckService.instance) {
      VersionCheckService.instance = new VersionCheckService();
    }
    return VersionCheckService.instance;
  }

  /**
   * Check for app updates on Play Store / App Store
   */
  async checkForUpdates(): Promise<void> {
    try {
      console.log('[VersionCheck] Checking for app updates...');

      const currentVersion = versionCheck.getCurrentVersion();
      console.log(`[VersionCheck] Current version: ${currentVersion}`);

      // Get the latest version from stores
      const latestVersion = await versionCheck.getLatestVersion({
        provider: Platform.OS === 'ios' ? 'appStore' : 'playStore'
      });

      console.log(`[VersionCheck] Latest version available: ${latestVersion}`);

      // Check if update is needed
      if (currentVersion && latestVersion) {
        const isUpdateNeeded = versionCheck.isNeeded({ currentVersion, latestVersion });

        if (isUpdateNeeded) {
          console.log('[VersionCheck] Update available, prompting user...');
          this.showUpdatePrompt();
        } else {
          console.log('[VersionCheck] App is up to date');
        }
      } else {
        console.log('[VersionCheck] Could not retrieve version information');
      }
    } catch (error) {
      console.error('[VersionCheck] Error checking for updates:', error);
    }
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt(): void {
    const storeLink = Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/pocketmystic/id6739472969'
      : 'https://play.google.com/store/apps/details?id=com.prch.pesoterica';

    Alert.alert(
      'Update Available',
      'A new version of pEsoterica is available. Please update to the latest version to enjoy new features and improvements.',
      [
        {
          text: 'Update Now',
          onPress: () => {
            Linking.openURL(storeLink);
          },
          style: 'default',
        },
        {
          text: 'Later',
          onPress: () => {
            console.log('[VersionCheck] User deferred update');
          },
          style: 'cancel',
        },
      ]
    );
  }
}

export default VersionCheckService.getInstance();
