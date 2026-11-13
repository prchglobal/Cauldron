/**
 * Occult house - Cauldron master app.
 * Param-driven native stack (see witch/Section.tsx for the pattern).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { HermeticScreen } from './screens/HermeticScreen';
import { AlchemicalScreen } from './screens/AlchemicalScreen';
import { QabalisticScreen } from './screens/QabalisticScreen';
import { SolomonicScreen } from './screens/SolomonicScreen';
import { PracticeDetailScreen } from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function OccultHouse({ route }: any) {
  const { isDarkMode } = useTheme();
  const initial = route?.params?.category || 'Hermetic';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, isDarkMode ? '#C41E3A' : '#0099CC')}>
        <Stack.Screen name="Hermetic" component={HermeticScreen} />
        <Stack.Screen name="Alchemical" component={AlchemicalScreen} />
        <Stack.Screen name="Qabalistic" component={QabalisticScreen} />
        <Stack.Screen name="Solomonic" component={SolomonicScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
