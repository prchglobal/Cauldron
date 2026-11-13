/**
 * Cauldron Content Service
 *
 * Provides offline-first data access with automatic remote sync from Cloudflare R2.
 * Both the React Native mobile app and the Web app use this service to access
 * practice guides, traditions, rituals, and catalog data.
 *
 * Workflow:
 * 1. Immediate instant load from local bundled data (0ms latency, 100% offline).
 * 2. Background check against R2 manifest (manifest.json).
 * 3. Cache updated datasets into AsyncStorage / localStorage.
 * 4. Notify active screens of fresh content without app store updates.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

declare const window: any;

export interface ContentManifest {
  version: string;
  updatedAt: string;
  datasets: Record<string, { hash: string; updatedAt: string; path: string }>;
}

const STORAGE_PREFIX = 'cauldron_content_';
const MANIFEST_KEY = 'cauldron_manifest';

// Default R2 endpoint (can be overridden via environment or runtime)
let r2BaseUrl: string =
  (typeof process !== 'undefined' && process.env?.VITE_R2_CONTENT_URL) ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://r2.cauldron.app');

type ContentSubscriber<T> = (data: T) => void;
const subscribers = new Map<string, Set<ContentSubscriber<any>>>();

export class ContentService {
  /**
   * Set or update the Cloudflare R2 CDN base URL
   */
  static setR2BaseUrl(url: string) {
    r2BaseUrl = url.replace(/\/+$/, '');
    console.log('[ContentService] R2 Base URL configured:', r2BaseUrl);
  }

  static getR2BaseUrl(): string {
    return r2BaseUrl;
  }

  /**
   * Get dataset key for storage and subscriptions
   */
  private static getKey(house: string, dataset: string): string {
    return `${house}_${dataset}`;
  }

  /**
   * Fetch data with offline-first strategy:
   * Returns cached data if available, otherwise returns bundled fallback.
   */
  static async getData<T>(house: string, dataset: string, fallback: T): Promise<T> {
    const key = this.getKey(house, dataset);
    try {
      const cached = await AsyncStorage.getItem(STORAGE_PREFIX + key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    } catch (e) {
      console.warn(`[ContentService] Error reading cache for ${key}:`, e);
    }
    return fallback;
  }

  /**
   * Subscribe to updates for a dataset (e.g. when R2 sync pulls newer data)
   */
  static subscribe<T>(house: string, dataset: string, callback: ContentSubscriber<T>): () => void {
    const key = this.getKey(house, dataset);
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(callback);

    return () => {
      subscribers.get(key)?.delete(callback);
    };
  }

  /**
   * Sync all datasets from R2 if newer versions are available
   */
  static async syncWithR2(): Promise<boolean> {
    try {
      const manifestUrl = `${r2BaseUrl}/data/manifest.json`;
      console.log(`[ContentService] Checking R2 manifest at ${manifestUrl}...`);

      const res = await fetch(manifestUrl, { cache: 'no-cache' });
      if (!res.ok) {
        console.log(`[ContentService] No remote manifest found (${res.status}), using local baseline.`);
        return false;
      }

      const remoteManifest = (await res.json()) as ContentManifest;
      const localManifestRaw = await AsyncStorage.getItem(MANIFEST_KEY);
      const localManifest: ContentManifest | null = localManifestRaw ? JSON.parse(localManifestRaw) : null;

      let updatedCount = 0;
      for (const [key, meta] of Object.entries(remoteManifest.datasets)) {
        const localMeta = localManifest?.datasets?.[key];
        if (!localMeta || localMeta.hash !== meta.hash) {
          try {
            const dataRes = await fetch(`${r2BaseUrl}/${meta.path}`);
            if (dataRes.ok) {
              const data = await dataRes.json();
              await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
              updatedCount++;

              // Notify subscribers of this dataset
              const subs = subscribers.get(key);
              if (subs) {
                subs.forEach((cb) => cb(data));
              }
            }
          } catch (fetchErr) {
            console.warn(`[ContentService] Failed to sync ${key}:`, fetchErr);
          }
        }
      }

      await AsyncStorage.setItem(MANIFEST_KEY, JSON.stringify(remoteManifest));
      console.log(`[ContentService] R2 Sync complete. ${updatedCount} datasets updated.`);
      return true;
    } catch (err) {
      console.warn('[ContentService] R2 sync failed (operating offline):', err);
      return false;
    }
  }
}

export default ContentService;
