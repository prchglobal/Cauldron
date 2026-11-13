/**
 * Esoterica house - Cauldron master app.
 * Param-driven native stack (see witch/Section.tsx for the pattern).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from './ThemeContext';
import { LocksProvider } from './LocksContext';
import { SophiaScreen } from './screens/SophiaScreen';
import { SethScreen } from './screens/SethScreen';
import { LogosScreen } from './screens/LogosScreen';
import { ChristosScreen } from './screens/ChristosScreen';
import { PracticeDetailScreen } from './screens/PracticeDetailScreen';
import { houseScreenOptions } from '../../shared/houseHeader';

const Stack = createNativeStackNavigator();

export default function EsotericaHouse({ route }: any) {
  const { isDarkMode, highlightColor } = useTheme();
  const initial = route?.params?.category || 'Sophia';

  return (
    <LocksProvider>
      <Stack.Navigator initialRouteName={initial} screenOptions={houseScreenOptions(isDarkMode, highlightColor)}>
        <Stack.Screen name="Sophia" component={SophiaScreen} />
        <Stack.Screen name="Seth" component={SethScreen} />
        <Stack.Screen name="Logos" component={LogosScreen} />
        <Stack.Screen name="Christos" component={ChristosScreen} />
        <Stack.Screen name="PracticeDetail" component={PracticeDetailScreen} options={({ route }: any) => ({ headerTitle: route?.params?.screenName || '' })} />
      </Stack.Navigator>
    </LocksProvider>
  );
}
