/**
 * Shared native-stack header for the practice/tools house stacks.
 * Returns a screenOptions function so each screen gets a back button with the
 * '🫙 Cauldron' brand title next to it that calls navigation.goBack(): from a
 * category (the stack's initial route) that bubbles up to the parent and returns
 * to the accordion main menu; from a pushed detail screen it returns to the category.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function houseScreenOptions(isDarkMode: boolean, accent: string) {
  return ({ navigation }: any) => ({
    headerShown: true,
    headerTitle: '',
    headerTintColor: accent,
    headerStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' },
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 12 }}
        accessibilityLabel="Back to Cauldron menu"
        activeOpacity={0.7}
      >
        <Text style={{ color: accent, fontSize: 28, fontWeight: '300', marginTop: -2, marginRight: 6 }}>‹</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: isDarkMode ? '#fff' : '#1a1a1a', letterSpacing: 0.3 }}>
          🫙 Cauldron
        </Text>
      </TouchableOpacity>
    ),
  });
}
