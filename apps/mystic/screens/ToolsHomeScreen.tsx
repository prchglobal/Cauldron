import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

interface Tool {
  route: string;
  title: string;
  emoji: string;
  blurb: string;
}

const TOOLS: Tool[] = [
  { route: 'Tarot', title: 'Tarot Cards', emoji: '🔮', blurb: 'Draw and interpret the cards' },
  { route: 'Palmistry', title: 'Palmistry', emoji: '✋', blurb: 'Lines and mounts of the hand' },
  { route: 'Numerology', title: 'Numerology', emoji: '🔢', blurb: 'Reduce numbers to their meaning' },
  { route: 'Gematria', title: 'Gematria', emoji: '✡️', blurb: 'Numeric value of words' },
  { route: 'MoonPhase', title: 'Moon Phases', emoji: '🌙', blurb: 'Track the lunar cycle' },
  { route: 'Horoscopes', title: 'Horoscopes', emoji: '✨', blurb: 'Daily zodiac readings' },
  { route: 'Astrology', title: 'Astrology', emoji: '🌌', blurb: 'Signs, planets & houses' },
  { route: 'Chakras', title: 'Chakras', emoji: '⚡', blurb: 'The seven energy centers' },
  { route: 'Crystals', title: 'Crystals', emoji: '💎', blurb: 'Stones and their properties' },
];

export function ToolsHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accent = '#8b5cf6';

  const bottomPadding = insets.bottom + 76;

  return (
    <View style={[styles.screen, { backgroundColor: containerBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: bottomPadding }}>
        <TouchableOpacity onPress={() => navigation.getParent()?.goBack()} style={styles.backRow}>
          <Text style={[styles.backText, { color: accent }]}>‹ Menu</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>🧰 Tools</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>Divination and reference for every path</Text>

        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.route}
            style={[styles.card, { backgroundColor: cardBg, borderLeftColor: accent }]}
            onPress={() => navigation.navigate(tool.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardEmoji}>{tool.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: textColor }]}>{tool.title}</Text>
              <Text style={[styles.cardBlurb, { color: mutedColor }]}>{tool.blurb}</Text>
            </View>
            <Text style={[styles.chevron, { color: accent }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  backRow: { marginBottom: 8 },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  cardEmoji: { fontSize: 28, marginRight: 14 },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  cardBlurb: { fontSize: 12, marginTop: 3 },
  chevron: { fontSize: 28, fontWeight: '300', marginLeft: 8 },
});
