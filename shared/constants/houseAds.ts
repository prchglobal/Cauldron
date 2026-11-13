import { Platform } from 'react-native';

export type DetectedOS = 'ios' | 'android' | 'desktop';

export interface HouseAdItem {
  id: string;
  badge?: string;
  tagline?: string;
  title: string;
  description?: string;
  subtitle: string;
  emoji?: string;
  imageUrl?: string;
  accentColor: string;
  targetUrl: string;
  category: 'GET_APP' | 'PRCH_ADS' | 'IMPACT' | 'BSA';
}

export function detectClientEnvironment(): DetectedOS {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';

  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      return 'ios';
    }
    if (/android/i.test(ua)) {
      return 'android';
    }
  }

  return 'desktop';
}

export const GOOGLE_PLAY_DEVELOPER_URL = 'https://play.google.com/store/apps/developer?id=PrCh+Global&hl=en_US';
export const APPLE_DEVELOPER_URL = 'https://apps.apple.com/us/developer/project-chaos-global-llc/id1859000424';

export const CAULDRON_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.prch.cauldron';
export const CAULDRON_IOS_APP_URL = 'https://apps.apple.com/us/developer/project-chaos-global-llc/id1859000424';

export const AIRBALL_APP_URL = 'https://apps.prch.site/airball/';

/**
 * 1. "GET THE APP" / Cross-App Promotion
 */
export function getAppDownloadAd(os: DetectedOS): HouseAdItem {
  if (os === 'ios') {
    return {
      id: 'cauldron-ios-app',
      tagline: 'Official App Store',
      title: 'Cauldron on iOS',
      description: 'Your complete occult & spiritual companion on iPhone & iPad.',
      subtitle: 'Apple App Store',
      emoji: '🔮',
      accentColor: '#a78bfa',
      targetUrl: CAULDRON_IOS_APP_URL,
      category: 'GET_APP',
    };
  }
  return {
    id: 'cauldron-android-app',
    tagline: 'Google Play Store',
    title: 'Cauldron on Android',
    description: 'Tarot, astrology, grimoires & rituals in the palm of your hand.',
    subtitle: 'Google Play',
    emoji: '✨',
    accentColor: '#8b5cf6',
    targetUrl: CAULDRON_ANDROID_APP_URL,
    category: 'GET_APP',
  };
}

/**
 * 2. PrCh House Ads (Music, Games, Literature, Sports)
 */
export const BOOYAH_AD: HouseAdItem = {
  id: 'booyah-ad',
  tagline: 'Hot New Pop Artist',
  title: 'Booyah',
  description: 'Hot new white female rapper and rising pop star!',
  subtitle: 'ThatGirlBooyah.com',
  imageUrl: 'https://apps.prch.site/airball/assets/booyah.jpeg',
  emoji: '🎤',
  accentColor: '#ec4899',
  targetUrl: 'https://ThatGirlBooyah.com',
  category: 'PRCH_ADS',
};

export const MAGIC_CHESS_AD: HouseAdItem = {
  id: 'magic-chess-ad',
  tagline: 'Ability-Based Chess',
  title: 'Magic Chess',
  description: 'Chess reimagined with magic. Cast unique piece spells!',
  subtitle: 'MagicChess.app',
  imageUrl: 'https://apps.prch.site/airball/assets/magicchess.png',
  emoji: '♟️',
  accentColor: '#a855f7',
  targetUrl: 'https://magicchess.app',
  category: 'PRCH_ADS',
};

export const BETH_HARPER_AD: HouseAdItem = {
  id: 'beth-harper-ad',
  tagline: 'Psychological Thriller',
  title: "Don't Trust Beth Harper",
  description: 'A chilling suspense novel. Available now on Kindle.',
  subtitle: 'Amazon.com',
  imageUrl: 'https://apps.prch.site/airball/assets/bethharper.jpg',
  emoji: '📖',
  accentColor: '#e11d48',
  targetUrl: 'https://www.amazon.com/dp/B0GMXP3NCZ',
  category: 'PRCH_ADS',
};

export const TEDDYS_TRIP_AD: HouseAdItem = {
  id: 'teddys-trip-ad',
  tagline: "Children's Adventure",
  title: "Teddy's Trip",
  description: 'An adorable heartwarming adventure. Available on Amazon.',
  subtitle: 'Amazon.com',
  imageUrl: 'https://apps.prch.site/airball/assets/teddystrip.jpg',
  emoji: '✈️',
  accentColor: '#f59e0b',
  targetUrl: 'https://www.amazon.com/Teddys-Trip-Andboo-ebook/dp/B0CTHRHX4Z',
  category: 'PRCH_ADS',
};

export const CAULDRON_AD: HouseAdItem = {
  id: 'cauldron-ad',
  tagline: 'Spiritual Companion',
  title: 'Cauldron',
  description: 'Tarot, astrology, grimoires & rituals in the palm of your hand.',
  subtitle: 'apps.prch.site/cauldron',
  imageUrl: 'https://apps.prch.site/airball/assets/cauldron.png',
  emoji: '🔮',
  accentColor: '#8b5cf6',
  targetUrl: 'https://apps.prch.site/cauldron/',
  category: 'PRCH_ADS',
};

export const AIRBALL_AD: HouseAdItem = {
  id: 'airball-ad',
  tagline: 'Live Sports & Recaps',
  title: 'AirBall',
  description: 'Live scores, real-time schedule & official recaps for NHL, NFL, NBA.',
  subtitle: 'apps.prch.site/airball',
  imageUrl: 'https://apps.prch.site/airball/logo2.png',
  emoji: '🏀',
  accentColor: '#ff6b42',
  targetUrl: AIRBALL_APP_URL,
  category: 'PRCH_ADS',
};

/**
 * 3. Impact Affiliate Network & BSA (BuySellAds) Ready Slots
 */
export const IMPACT_AFFILIATE_AD: HouseAdItem = {
  id: 'impact-partner-ad',
  tagline: 'Featured Partner',
  title: 'Project Chaos Global',
  description: 'Explore books, music, high-performance apps and entertainment.',
  subtitle: 'prch.global',
  imageUrl: 'https://prch.global/assets/favicon.png',
  emoji: '⚡',
  accentColor: '#38bdf8',
  targetUrl: 'https://prch.global',
  category: 'IMPACT',
};

export const BSA_SPONSOR_AD: HouseAdItem = {
  id: 'bsa-sponsor-ad',
  tagline: 'Sponsor Spotlight',
  title: 'Advertise with PrCh',
  description: 'Reach thousands of daily engaged readers and app users.',
  subtitle: 'apps.prch.site',
  emoji: '📢',
  accentColor: '#10b981',
  targetUrl: 'https://prch.global/contact',
  category: 'BSA',
};

export let dynamicHouseAds: HouseAdItem[] = [
  BOOYAH_AD,
  MAGIC_CHESS_AD,
  BETH_HARPER_AD,
  TEDDYS_TRIP_AD,
  CAULDRON_AD,
  AIRBALL_AD,
  IMPACT_AFFILIATE_AD,
  BSA_SPONSOR_AD,
];

// In-house direct link preventer: current app id whose self-promo web links should NOT be shown
export const CURRENT_APP_ID = 'cauldron';

/**
 * Filter out direct in-house links pointing back to this same app,
 * preserving GET_APP store links.
 */
export function filterInHouseAds(ads: HouseAdItem[], currentApp: string = CURRENT_APP_ID): HouseAdItem[] {
  return ads.filter((ad) => {
    if (ad.category === 'GET_APP') return true;
    if (ad.id === `${currentApp}-ad`) return false;
    if (ad.targetUrl) {
      const lowerUrl = ad.targetUrl.toLowerCase();
      if (lowerUrl.includes(`apps.prch.site/${currentApp}`)) return false;
    }
    return true;
  });
}

const REMOTE_ADS_URL = 'https://apps.prch.site/cauldron/data/ads.json';
const FALLBACK_ADS_URL = 'https://apps.prch.site/airball/assets/ads.json';
let lastSyncTimestamp = 0;
const SYNC_INTERVAL_MS = 5 * 60 * 1000;

export async function syncRemoteAds(): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTimestamp < SYNC_INTERVAL_MS) return;

  try {
    let res = await fetch(`${REMOTE_ADS_URL}?t=${now}`).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(`${FALLBACK_ADS_URL}?t=${now}`).catch(() => null);
    }
    if (!res || !res.ok) return;

    const data = await res.json();
    if (data?.ads && Array.isArray(data.ads) && data.ads.length > 0) {
      dynamicHouseAds = filterInHouseAds(data.ads, CURRENT_APP_ID);
      lastSyncTimestamp = now;
      console.log(`[HouseAds] Synced ${dynamicHouseAds.length} remote ads`);
    }
  } catch {
    // Fail silently, use existing bundled ads
  }
}

if (typeof fetch !== 'undefined') {
  syncRemoteAds().catch(() => {});
}

export function getRandomPrChAd(): HouseAdItem {
  const filtered = filterInHouseAds(dynamicHouseAds, CURRENT_APP_ID);
  const pool = filtered.length > 0
    ? filtered
    : filterInHouseAds([BOOYAH_AD, MAGIC_CHESS_AD, BETH_HARPER_AD, TEDDYS_TRIP_AD, CAULDRON_AD, AIRBALL_AD, IMPACT_AFFILIATE_AD, BSA_SPONSOR_AD], CURRENT_APP_ID);
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Ad Selection Logic:
 * Mobile: 20% Store Download App, 80% House/Impact/BSA rotation
 * Desktop: 100% In-House/Impact/BSA rotation
 */
export function selectNextAd(): HouseAdItem {
  const os = detectClientEnvironment();
  const isMobile = os === 'ios' || os === 'android';
  const roll = Math.random();

  if (isMobile && roll < 0.20) {
    return getAppDownloadAd(os);
  }

  return getRandomPrChAd();
}

/**
 * Interstitial sponsor pool: Impact Affiliate and BSA slots only (NO house ads).
 */
export function getRandomSponsorAd(): HouseAdItem {
  const sponsorPool = dynamicHouseAds.filter(
    (a) => a.category === 'IMPACT' || a.category === 'BSA'
  );
  if (sponsorPool.length > 0) {
    const idx = Math.floor(Math.random() * sponsorPool.length);
    return sponsorPool[idx];
  }
  // Fallback to static BSA / Impact sponsors if remote ads haven't loaded
  const staticPool = [IMPACT_AFFILIATE_AD, BSA_SPONSOR_AD];
  return staticPool[Math.floor(Math.random() * staticPool.length)];
}

