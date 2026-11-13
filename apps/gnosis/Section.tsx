/**
 * Gnosis house - Cauldron master app.
 * Its own categories (the Gnostic / dualist "Light vs Darkness" traditions from
 * the design notes), distinct from the Occult house: Mandaeism, Manichaean,
 * Zoroastrianism. Param-driven native stack (see witch/Section.tsx pattern).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { MandaeismScreen } from './screens/MandaeismScreen';
import { ManichaeanScreen } from './screens/ManichaeanScreen';
import { ZoroastrianismScreen } from './screens/ZoroastrianismScreen';
import { PracticeDetailScreen } from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function GnosisHouse({ route }: any) {
  const { isDarkMode } = useTheme();
  const initial = route?.params?.category || 'Mandaeism';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, isDarkMode ? '#ef4444' : '#3b82f6')}>
        <Stack.Screen name="Mandaeism" component={MandaeismScreen} />
        <Stack.Screen name="Manichaean" component={ManichaeanScreen} />
        <Stack.Screen name="Zoroastrianism" component={ZoroastrianismScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
