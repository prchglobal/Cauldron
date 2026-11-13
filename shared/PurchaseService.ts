/**
 * Shared Cauldron purchase service.
 *
 * One implementation for every house. A house is "unlocked" when the account
 * owns either the global all-access subscription OR that house's own one-time
 * unlock (see shared/monetization.ts). A single module-level debug override lets
 * the Help ▸ Developer panel mimic an active/inactive subscription across the
 * whole app at once.
 *
 * Each apps/<house>/PurchaseService.ts is a one-line shim:
 *   export default createPurchaseService(SKUS.<house>);
 * so existing `import PurchaseService from '../PurchaseService'` calls keep working.
 */
import {
  initConnection,
  endConnection,
  getAvailablePurchases,
  requestPurchase,
} from 'react-native-iap';
import { SKUS } from './monetization';

export type DebugMode = 'none' | 'active' | 'inactive';

// Global override shared by every house instance (Help ▸ Developer toggles it).
let globalDebugMode: DebugMode = 'none';
let initialized = false;

async function ensureInit(): Promise<void> {
  if (initialized) return;
  try {
    await initConnection();
    initialized = true;
  } catch (e) {
    console.warn('[IAP] initConnection failed:', e);
  }
}

function isValidPurchase(p: any): boolean {
  // Android exposes purchaseState; iOS exposes transactionId.
  if (p?.purchaseState !== undefined) return p.purchaseState === 'PurchasedState';
  return !!p?.transactionId;
}

/** Product ids currently owned (valid) on the account. */
export async function getOwnedSkus(): Promise<string[]> {
  await ensureInit();
  try {
    const purchases = await getAvailablePurchases();
    return purchases.filter(isValidPurchase).map((p: any) => p.productId);
  } catch (e) {
    console.warn('[IAP] getAvailablePurchases failed:', e);
    return [];
  }
}

export function setGlobalDebugMode(mode: DebugMode): void {
  globalDebugMode = mode;
  console.log('[IAP] global debug subscription mode =', mode);
}
export function getGlobalDebugMode(): DebugMode {
  return globalDebugMode;
}

/**
 * A per-house purchase handle. `unlockSkus` are the product ids that grant
 * access to this house (its own unlock plus the global all-access sub).
 */
export class HousePurchases {
  constructor(private readonly unlockSkus: string[]) {}

  async initialize(): Promise<void> {
    await ensureInit();
  }

  /** Primary gate used by the practice screens. */
  async isSubscriptionActive(): Promise<boolean> {
    if (globalDebugMode !== 'none') return globalDebugMode === 'active';
    const owned = await getOwnedSkus();
    return owned.some((id) => this.unlockSkus.includes(id));
  }

  /** Alias with clearer intent. */
  async isHouseUnlocked(): Promise<boolean> {
    return this.isSubscriptionActive();
  }

  async isFeaturePurchased(_featureKey?: string): Promise<boolean> {
    return this.isSubscriptionActive();
  }

  async purchaseSubscription(): Promise<boolean> {
    return this.purchaseProduct(SKUS.allAccess);
  }

  /** Buy this house's own one-time unlock (first non-all-access sku). */
  async purchaseHouse(): Promise<boolean> {
    const houseSku = this.unlockSkus.find((s) => s !== SKUS.allAccess) || SKUS.allAccess;
    return this.purchaseProduct(houseSku);
  }

  /** Kept for API compatibility with older callers (feature key is ignored). */
  async purchaseFeature(_featureKey?: string): Promise<boolean> {
    return this.purchaseHouse();
  }

  async purchaseProduct(sku: string): Promise<boolean> {
    await ensureInit();
    try {
      console.log('[IAP] requesting purchase:', sku);
      await requestPurchase(sku as any);
      return true;
    } catch (e: any) {
      if (e?.code === 'E_USER_CANCELLED' || String(e?.message || '').toLowerCase().includes('cancel')) {
        console.log('[IAP] purchase cancelled by user');
        return false;
      }
      console.error('[IAP] purchase error:', e);
      throw e;
    }
  }

  /** Returns the owned product ids (superset; the live gate is isSubscriptionActive). */
  async restorePurchases(): Promise<string[]> {
    return getOwnedSkus();
  }

  getProductSkus(): string[] {
    return this.unlockSkus;
  }

  /** Not available in react-native-iap v14 wrapper; kept as a safe stub. */
  async fetchProductDetails(_sku?: string): Promise<null> {
    return null;
  }

  /** Sets the GLOBAL debug override (affects every house). */
  setDebugSubscriptionMode(mode: DebugMode): void {
    setGlobalDebugMode(mode);
  }

  async cleanup(): Promise<void> {
    if (initialized) {
      try {
        await endConnection();
      } catch (e) {
        console.warn('[IAP] endConnection failed:', e);
      }
      initialized = false;
    }
  }
}

/** House handle: its own unlock + the global all-access sub both grant access. */
export function createPurchaseService(houseSku: string): HousePurchases {
  return new HousePurchases([houseSku, SKUS.allAccess]);
}

/** App-wide handle for Help ▸ Restore / Developer (all-access only). */
export const PurchaseManager = new HousePurchases([SKUS.allAccess]);
