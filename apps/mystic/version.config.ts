/**
 * CENTRAL VERSION CONFIGURATION
 * 
 * Keep this in sync with:
 * - package.json (version field)
 * - android/app/build.gradle (versionCode and versionName)
 * 
 * IMPORTANT: Update this file, then run: npm run sync-versions
 * 
 * BEFORE EVERY BUILD:
 * 1. Increment versionCode by 1
 * 2. Update semver appropriately (major.minor.patch)
 * 3. Run: npm run sync-versions
 * 4. Run: npm run build:android
 */

import { Platform } from 'react-native';

export const APP_VERSION = {
  // Semantic versioning (major.minor.patch)
  semver: '1.4.3',
  
  // Android version code (must be integer, incremented for each release)
  // Rule: ALWAYS increment by 1 for each new build
  versionCode: 8,
  
  // Display name for app
  displayName: 'pocketMystic',
};

/**
 * Build information - includes timestamp and platform
 * Used in help/about screens and logs
 */
export const BUILD_INFO = {
  version: APP_VERSION.semver,
  buildNumber: APP_VERSION.versionCode,
  appName: APP_VERSION.displayName,
  buildTime: new Date().toISOString(),
  platform: Platform.OS,
  buildString: `${APP_VERSION.displayName} v${APP_VERSION.semver} (build ${APP_VERSION.versionCode})`,
  fullInfo: {
    name: APP_VERSION.displayName,
    version: APP_VERSION.semver,
    buildCode: APP_VERSION.versionCode,
    buildDate: new Date().toLocaleDateString(),
    platform: Platform.OS,
  },
};

/**
 * Version string for display
 */
export const VERSION_STRING = BUILD_INFO.buildString;
