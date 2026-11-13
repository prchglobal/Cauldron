/**
 * Witchery house - Cauldron master app.
 * Param-driven native stack: the accordion menu opens a specific category via
 * route.params.category; the header back button returns to the menu.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { GreenWitchScreen } from './screens/GreenWitchScreen';
import { FlowWitchScreen } from './screens/FlowWitchScreen';
import { SpiritWitchScreen } from './screens/SpiritWitchScreen';
import { CosmicWitchScreen } from './screens/CosmicWitchScreen';
import { PracticeDetailScreen } from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function WitchHouse({ route }: any) {
  const { isDarkMode } = useTheme();
  const initial = route?.params?.category || 'GreenWitch';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, '#8b5cf6')}>
        <Stack.Screen name="GreenWitch" component={GreenWitchScreen} />
        <Stack.Screen name="FlowWitch" component={FlowWitchScreen} />
        <Stack.Screen name="SpiritWitch" component={SpiritWitchScreen} />
        <Stack.Screen name="CosmicWitch" component={CosmicWitchScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
