/**
 * Tools house - Cauldron master app.
 * Param-driven native stack: the accordion menu opens a specific tool via
 * route.params.category; the header back button returns to the menu.
 * (Repurposed from pocketMystic, which was already a divination-tools app.)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { ToolsHomeScreen } from './screens/ToolsHomeScreen';
import { TarotScreen } from './screens/TarotScreen';
import { NumerologyScreen } from './screens/NumerologyScreen';
import { PalmistryScreen } from './screens/PalmistryScreen';
import { GematriaScreen } from './screens/GematriaScreen';
import { MoonPhaseScreen } from './screens/MoonPhaseScreen';
import { HoroscopesScreen } from './screens/HoroscopesScreen';
import { AstrologyScreen } from './screens/AstrologyScreen';
import { ChakrasScreen } from './screens/ChakrasScreen';
import { CrystalsScreen } from './screens/CrystalsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

function ToolsStack({ route }: any) {
  const { isDarkMode } = useTheme();
  const initial = route?.params?.category || 'ToolsHome';

  return (
    <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, '#8b5cf6')}>
      <Stack.Screen name="ToolsHome" component={ToolsHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tarot" component={TarotScreen} options={{ headerTitle: 'Tarot Cards' }} />
      <Stack.Screen name="Palmistry" component={PalmistryScreen} options={{ headerTitle: 'Palmistry' }} />
      <Stack.Screen name="Numerology" component={NumerologyScreen} options={{ headerTitle: 'Numerology' }} />
      <Stack.Screen name="Gematria" component={GematriaScreen} options={{ headerTitle: 'Gematria' }} />
      <Stack.Screen name="MoonPhase" component={MoonPhaseScreen} options={{ headerTitle: 'Moon Phases' }} />
      <Stack.Screen name="Horoscopes" component={HoroscopesScreen} options={{ headerTitle: 'Horoscopes' }} />
      <Stack.Screen name="Astrology" component={AstrologyScreen} options={{ headerTitle: 'Astrology' }} />
      <Stack.Screen name="Chakras" component={ChakrasScreen} options={{ headerTitle: 'Chakras' }} />
      <Stack.Screen name="Crystals" component={CrystalsScreen} options={{ headerTitle: 'Crystals' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerTitle: 'Notification Settings' }} />
    </Stack.Navigator>
  );
}

export default function ToolsSection({ route }: any) {
  return (
    <LocksProvider>
      <ToolsStack route={route} />
    </LocksProvider>
  );
}
