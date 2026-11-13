import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PurchaseManager } from './PurchaseService';
import { SKUS } from './monetization';

const AD_FREE_STORAGE_KEY = 'cauldron_ad_free_unlocked';

interface BannerContextType {
  bannerTop: number | null;
  setBannerTop: (top: number | null) => void;
  isAdFree: boolean;
  setAdFree: (active: boolean) => Promise<void>;
  checkAdFreeStatus: () => Promise<boolean>;
}

export const BannerContext = createContext<BannerContextType>({
  bannerTop: null,
  setBannerTop: () => {},
  isAdFree: false,
  setAdFree: async () => {},
  checkAdFreeStatus: async () => false,
});

export function BannerProvider({ children }: { children: ReactNode }) {
  const [bannerTop, setBannerTop] = useState<number | null>(null);
  const [isAdFree, setIsAdFreeState] = useState<boolean>(false);

  const checkAdFreeStatus = useCallback(async (): Promise<boolean> => {
    try {
      // 1. Check local storage cache
      const cached = await AsyncStorage.getItem(AD_FREE_STORAGE_KEY);
      if (cached === 'true') {
        setIsAdFreeState(true);
        return true;
      }

      // 2. Check native IAP owned SKUs (adFree or allAccess)
      const owned = await PurchaseManager.restorePurchases();
      const hasAdFree = owned.includes(SKUS.adFree) || owned.includes(SKUS.allAccess);
      if (hasAdFree) {
        await AsyncStorage.setItem(AD_FREE_STORAGE_KEY, 'true');
        setIsAdFreeState(true);
        return true;
      }

      setIsAdFreeState(false);
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    checkAdFreeStatus();
  }, [checkAdFreeStatus]);

  const setAdFree = useCallback(async (active: boolean) => {
    setIsAdFreeState(active);
    try {
      if (active) {
        await AsyncStorage.setItem(AD_FREE_STORAGE_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(AD_FREE_STORAGE_KEY);
      }
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      bannerTop: isAdFree ? 0 : bannerTop,
      setBannerTop,
      isAdFree,
      setAdFree,
      checkAdFreeStatus,
    }),
    [bannerTop, isAdFree, setAdFree, checkAdFreeStatus]
  );

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  return React.useContext(BannerContext);
}
