/**
 * Cauldron monetization + ads - single source of truth ("store solidarity").
 *
 * One product namespace under com.prch.cauldron: a global all-access
 * subscription plus a one-time unlock per house. Each ID is unique and
 * recognizable but shares the Cauldron scheme, so the Play/App Store listing
 * reads as one coherent app.
 *
 * ⚠️ Before production: create these exact product IDs in Play Console / App
 * Store Connect, and swap the Appodeal/AdMob keys below (they are still the
 * old pocketWitch/pocketMystic accounts). The AdMob APP id must ALSO be
 * updated in app.json and android/app/src/main/AndroidManifest.xml.
 */

export const CAULDRON_APP_ID = 'com.prch.cauldron';

// ---- Product catalog -------------------------------------------------------
// allAccess = subscription that unlocks the whole app.
// adFree    = $1.99 one-time purchase to remove all ads.
// <house>   = one-time unlock for that house only.
export const SKUS = {
  allAccess: 'com.prch.cauldron.allaccess',
  adFree: 'com.prch.cauldron.adfree',
  witchery: 'com.prch.cauldron.witchery',
  occult: 'com.prch.cauldron.occult',
  gnosis: 'com.prch.cauldron.gnosis',
  magick: 'com.prch.cauldron.magick',
  esoterica: 'com.prch.cauldron.esoterica',
  pegan: 'com.prch.cauldron.pegan',
  tools: 'com.prch.cauldron.tools',
} as const;

export type HouseSkuKey = keyof typeof SKUS;

// Every SKU the store should know about (for querying products).
export const ALL_SKUS: string[] = Object.values(SKUS);

// ---- Ads -------------------------------------------------------------------
// Flip to true to show Appodeal/AdMob TEST ads instead of live ones.
export const AD_TEST_MODE = false;

// Appodeal SDK keys (⚠️ old pocketWitch/pocketMystic keys - swap for Cauldron).
export const APPODEAL_APP_KEY = {
  ios: '2d153689b5f8acf72aae893bb60843e2bf6dbc97589521aa',
  android: '11568d66637976a34d54e2b6a5d281a23e67012abba47348',
};

// AdMob app ids (⚠️ old pocketWitch ids - also set in app.json + AndroidManifest).
export const ADMOB_APP_ID = {
  android: 'ca-app-pub-5705156853472358~9647861437',
  ios: 'ca-app-pub-5705156853472358~9405492315',
};

// AdMob ad unit IDs
export const ADMOB_UNITS = {
  android: {
    banner: 'ca-app-pub-5705156853472358/7956227580',
    interstitial: 'ca-app-pub-5705156853472358/6643145919',
  },
  ios: {
    banner: 'ca-app-pub-5705156853472358/7514119313',
    interstitial: 'ca-app-pub-5705156853472358/5591944814',
  },
};

// Probability for interstitial trigger on changing page (0.20% chance = 0.002)
export const PAGE_CHANGE_INTERSTITIAL_CHANCE = 0.002;

// Probability for interstitial trigger when entering Tools pages (2.0% chance = 0.02)
export const TOOL_PAGE_INTERSTITIAL_CHANCE = 0.02;


// Device hashes that should receive TEST ads even when AD_TEST_MODE is false
// (get the hash from the device's logcat on first ad request).
export const AD_TEST_DEVICE_IDS: string[] = [];

// ---- Developer / test unlock ----------------------------------------------
// Cauldron-branded passkeys, entered in Help ▸ Developer. Change before release.
export const DEV_PASSKEYS = {
  subOn: 'cauldron:sub-on', // mimic an active all-access subscription
  subOff: 'cauldron:sub-off', // mimic no subscription
  clear: 'cauldron:clear', // clear debug override, use real checks
};
