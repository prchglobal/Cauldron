/**
 * Pegan house - Cauldron master app.
 * Param-driven native stack (see witch/Section.tsx). Category label -> screen:
 * Tethering=TetheringScreen, Mediation=IntercesssionScreen,
 * Continuity=ContinuityScreen, Regeneration=RegenerationScreen, plus Ritual Book.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { TetheringScreen } from './screens/TetheringScreen';
import { IntercesssionScreen } from './screens/IntercesssionScreen';
import { ContinuityScreen } from './screens/ContinuityScreen';
import { RegenerationScreen } from './screens/RegenerationScreen';
import { RitualBookScreen } from './screens/RitualBookScreen';
import { PracticeDetailScreen } from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function PeganHouse({ route }: any) {
  const { isDarkMode, accentColor } = useTheme();
  const initial = route?.params?.category || 'Tethering';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, accentColor)}>
        <Stack.Screen name="Tethering" component={TetheringScreen} />
        <Stack.Screen name="Mediation" component={IntercesssionScreen} />
        <Stack.Screen name="Continuity" component={ContinuityScreen} />
        <Stack.Screen name="Regeneration" component={RegenerationScreen} />
        <Stack.Screen name="RitualBook" component={RitualBookScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
