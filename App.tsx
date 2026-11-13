/**
 * Cauldron - master app housing the pocket spirituality apps.
 * One navigation container; each sub-app lives on the root stack as a section
 * with its own bottom tabs, locks, and purchases. Theme, banner ads, and the
 * Appodeal SDK are shared across all sections.
 */

import React, { useEffect, useRef } from 'react';
import { Text, View, Linking, Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './shared/ThemeContext';
import { BannerProvider } from './shared/BannerContext';
import { InterstitialProvider, useInterstitial } from './shared/InterstitialContext';
import AppodealService from './shared/AppodealService';
import { UniversalAdBanner } from './shared/components/UniversalAdBanner';
import { MainMenuScreen } from './screens/MainMenuScreen';

import WitchSection from './apps/witch/Section';
import OccultistSection from './apps/occultist/Section';
import GnosisSection from './apps/gnosis/Section';
import PeganSection from './apps/pegan/Section';
import MagickSection from './apps/magick/Section';
import EsotericaSection from './apps/esoterica/Section';
import ToolsSection from './apps/mystic/Section';
import HelpSection from './apps/help/Section';

let notifee: any = null;
let EventType: any = null;
try {
  const notifeeModule = require('@notifee/react-native');
  notifee = notifeeModule.default || notifeeModule;
  EventType = notifeeModule.EventType;
} catch {
  // web or stub
}

const RootStack = createNativeStackNavigator();

function AppNavigation() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const { triggerPageChangeAd } = useInterstitial();

  // Listen for notification opens & deep links
  useEffect(() => {
    const handleNotificationOpen = (notification: any) => {
      const data = notification?.data;
      const isHoroscope =
        data?.isHoroscopeNotification === 'true' ||
        String(data?.deepLink || '').includes('horoscope') ||
        String(notification?.id || '').includes('horoscope');

      if (isHoroscope) {
        console.log('[DeepLink] Opened via horoscope notification - triggering 100% interstitial ad (unless ad-free)');
        // 100% chance interstitial ad (force = true)
        triggerPageChangeAd(true);

        // Navigate to Horoscopes tool screen
        navigationRef.current?.navigate('Tools', { category: 'Horoscopes' });
      }
    };

    // 1. Initial notification when app opens from cold start
    if (notifee?.getInitialNotification) {
      notifee.getInitialNotification().then((initialNotification: any) => {
        if (initialNotification?.notification) {
          handleNotificationOpen(initialNotification.notification);
        }
      }).catch(() => {});
    }

    // 2. Foreground / background event listeners
    let unsubscribeForeground: any = null;
    if (notifee?.onForegroundEvent && EventType?.PRESS) {
      unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }: any) => {
        if (type === EventType.PRESS && detail?.notification) {
          handleNotificationOpen(detail.notification);
        }
      });
    }

    // 3. Linking URL listener (e.g. cauldron://horoscopes or web query params)
    const handleDeepLinkUrl = (url: string | null) => {
      if (!url) return;
      if (url.includes('horoscope')) {
        console.log('[DeepLink] Opened with horoscope deep link URL:', url);
        triggerPageChangeAd(true);
        navigationRef.current?.navigate('Tools', { category: 'Horoscopes' });
      }
    };

    Linking.getInitialURL().then(handleDeepLinkUrl).catch(() => {});
    const linkingSub = Linking.addEventListener('url', (event) => handleDeepLinkUrl(event.url));

    return () => {
      unsubscribeForeground?.();
      linkingSub?.remove();
    };
  }, [triggerPageChangeAd]);

  return (
    <NavigationContainer
      ref={navigationRef}
      fallback={<Text>Loading...</Text>}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRoute = navigationRef.current?.getCurrentRoute();
        const currentRouteName = currentRoute?.name;

        if (previousRouteName && currentRouteName && previousRouteName !== currentRouteName) {
          // Page change detected
          const toolScreens = [
            'Tools', 'ToolsHome', 'Tarot', 'Palmistry', 'Numerology',
            'Gematria', 'MoonPhase', 'Horoscopes', 'Astrology', 'Chakras', 'Crystals',
            'Notifications'
          ];
          const isToolPage = toolScreens.includes(currentRouteName);
          // Tool page changes have a 2% chance; general page changes have a 0.20% chance
          triggerPageChangeAd(false, isToolPage);
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <RootStack.Navigator
          screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
          initialRouteName="MainMenu"
        >
          <RootStack.Screen name="MainMenu" component={MainMenuScreen} />
          <RootStack.Screen name="Witch" component={WitchSection} />
          <RootStack.Screen name="Occultist" component={OccultistSection} />
          <RootStack.Screen name="Gnosis" component={GnosisSection} />
          <RootStack.Screen name="Pegan" component={PeganSection} />
          <RootStack.Screen name="Magick" component={MagickSection} />
          <RootStack.Screen name="Esoterica" component={EsotericaSection} />
          <RootStack.Screen name="Tools" component={ToolsSection} />
          <RootStack.Screen name="Help" component={HelpSection} />
        </RootStack.Navigator>
        <UniversalAdBanner />
      </View>
    </NavigationContainer>
  );
}

function App() {
  useEffect(() => {
    try {
      AppodealService.initialize();
    } catch (error) {
      console.warn('Failed to initialize Appodeal:', error);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <BannerProvider>
        <ThemeProvider>
          <InterstitialProvider>
            <AppNavigation />
          </InterstitialProvider>
        </ThemeProvider>
      </BannerProvider>
    </SafeAreaProvider>
  );
}

export default App;
