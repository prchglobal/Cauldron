/**
 * Reusable Gnosis category list (Mandaeism / Manichaean / Zoroastrianism).
 * Renders the practice stack in the Occultist format and opens PracticeDetail.
 * No subscription/lock gate - Gnosis content is freely accessible.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import type { GnosisPractice } from '../data/gnosisTraditions';

interface Props {
  title: string;
  emoji: string;
  subtitle: string;
  practices: GnosisPractice[];
}

export function GnosisCategoryList({ title, emoji, subtitle, practices }: Props) {
  const navigation = useNavigation<any>();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#404040' : '#e0e0e0';

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{emoji} {title}</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {practices.map((practice) =>
              practice.isSpacer ? (
                <View key={practice.name} style={styles.spacerContainer}>
                  <View style={[styles.spacerLine, { backgroundColor: mutedColor }]} />
                  <Text style={[styles.spacerText, { color: mutedColor }]}>{practice.name}</Text>
                  <View style={[styles.spacerLine, { backgroundColor: mutedColor }]} />
                </View>
              ) : (
                <TouchableOpacity
                  key={practice.name}
                  style={[styles.practiceItem, { backgroundColor: cardBg }]}
                  onPress={() => navigation.navigate('PracticeDetail', { practice })}
                >
                  <Text style={styles.practiceEmoji}>{practice.emoji}</Text>
                  <View style={styles.practiceInfo}>
                    <Text style={[styles.practiceName, { color: textColor }]}>{practice.name}</Text>
                    <Text style={[styles.practiceLabel, { color: mutedColor }]}>{practice.description}</Text>
                  </View>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 24, borderBottomWidth: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '500' },
  content: { flex: 1, padding: 16 },
  practiceStack: { gap: 12 },
  practiceItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceEmoji: { fontSize: 32 },
  practiceInfo: { flex: 1 },
  practiceName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  practiceLabel: { fontSize: 14, fontWeight: '400' },
  spacerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, paddingHorizontal: 8 },
  spacerLine: { flex: 1, height: 3 },
  spacerText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginHorizontal: 12,
    opacity: 0.6,
  },
});
