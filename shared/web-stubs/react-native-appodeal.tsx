import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AppodealAdType = {
  NONE: 0,
  INTERSTITIAL: 1,
  BANNER: 2,
  BANNER_BOTTOM: 2,
  BANNER_TOP: 4,
  REWARDED_VIDEO: 128,
  NON_SKIPPABLE_VIDEO: 128,
  MREC: 256,
};

export const Appodeal = {
  initialize: (_appKey: string, _adTypes: number) => {
    console.log('[Appodeal Web Stub] Initialized');
  },
  setTesting: (_testing: boolean) => {
    console.log('[Appodeal Web Stub] Testing set to', _testing);
  },
  setAutoCache: (_adType: number, _autoCache: boolean) => {},
  cache: (_adType: number) => {},
  show: (_adType: number) => false,
  hide: (_adType: number) => {},
  canShow: (_adType: number) => false,
  isLoaded: (_adType: number) => false,
  addEventListener: (_event: string, _handler: Function) => {},
  removeEventListener: (_event: string, _handler: Function) => {},
};

export function AppodealBanner(_props: any) {
  return null;
}

export function AppodealMrec(_props: any) {
  return null;
}

export default Appodeal;
