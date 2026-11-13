/**
 * Magick house - Cauldron master app.
 * Param-driven native stack (see witch/Section.tsx). magick screens are default
 * exports and each category has its own PracticeDetail route name.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import LuciferScreen from './screens/LuciferScreen';
import EnochScreen from './screens/EnochScreen';
import PracticeDetailScreen from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function MagickHouse({ route }: any) {
  const { isDarkMode, accentColor } = useTheme();
  const initial = route?.params?.category || 'Lucifer';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, accentColor)}>
        <Stack.Screen name="Lucifer" component={LuciferScreen} />
        <Stack.Screen name="Enoch" component={EnochScreen} />
        <Stack.Screen name="LuciferPracticeDetail" component={PracticeDetailScreen} />
        <Stack.Screen name="EnochPracticeDetail" component={PracticeDetailScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
