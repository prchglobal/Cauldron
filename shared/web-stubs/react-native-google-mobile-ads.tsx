import React from 'react';
import { View } from 'react-native';

export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
};

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

export const AdsConsent = {
  requestInfoUpdate: async () => ({}),
  loadAndShowConsentFormIfRequired: async () => ({}),
  showPrivacyOptionsForm: async () => ({}),
  getStatus: async () => 'NOT_REQUIRED',
  reset: async () => {},
};

export function BannerAd(_props: any) {
  return null;
}

export const useForeground = () => {};

export default {
  BannerAd,
  BannerAdSize,
  TestIds,
  AdsConsent,
  useForeground,
};
