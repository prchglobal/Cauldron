import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

const CRYSTALS = [
  {
    name: 'Amethyst',
    emoji: '💜',
    property: 'Calming, spiritual awakening',
  },
  {
    name: 'Rose Quartz',
    emoji: '💗',
    property: 'Love, compassion, heart healing',
  },
  {
    name: 'Clear Quartz',
    emoji: '💎',
    property: 'Clarity, amplification, energy',
  },
  {
    name: 'Citrine',
    emoji: '💛',
    property: 'Abundance, prosperity, joy',
  },
  {
    name: 'Black Tourmaline',
    emoji: '🖤',
    property: 'Protection, grounding, cleansing',
  },
  {
    name: 'Selenite',
    emoji: '✨',
    property: 'Purity, clarity, charging',
  },
  {
    name: 'Amazonite',
    emoji: '💙',
    property: 'Calm communication, truth',
  },
  {
    name: 'Labradorite',
    emoji: '🌙',
    property: 'Transformation, magic, intuition',
  },
  {
    name: 'Moonstone',
    emoji: '⭐',
    property: 'New beginnings, intuition, feminine',
  },
];

export function CrystalsScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>(null);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const selectedCrystalData = CRYSTALS.find((c) => c.name === selectedCrystal);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>Crystals</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Harness natural healing energy
        </Text>
      </View>

      <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Crystal Collection
        </Text>

        <View style={styles.crystalGrid}>
          {CRYSTALS.map((crystal) => (
            <TouchableOpacity
              key={crystal.name}
              style={[
                styles.crystalCard,
                {
                  backgroundColor: selectedCrystal === crystal.name ? '#8b5cf6' : cardBg,
                  borderColor: selectedCrystal === crystal.name ? '#8b5cf6' : '#e0e0e0',
                },
              ]}
              onPress={() => setSelectedCrystal(crystal.name)}
            >
              <Text style={styles.crystalEmoji}>{crystal.emoji}</Text>
              <Text
                style={[
                  styles.crystalName,
                  {
                    color: selectedCrystal === crystal.name ? '#fff' : textColor,
                  },
                ]}
                numberOfLines={1}
              >
                {crystal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCrystalData && (
          <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoEmoji}>{selectedCrystalData.emoji}</Text>
              <Text style={[styles.infoName, { color: textColor }]}>
                {selectedCrystalData.name}
              </Text>
            </View>
            <Text style={[styles.infoProperty, { color: mutedColor }]}>
              {selectedCrystalData.property}
            </Text>
            <View style={[styles.usageHint, { backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a' }]}>
              <Text style={[styles.usageText, { color: mutedColor }]}>
                💡 Carry in your pocket, place on your altar, or meditate with
                this crystal to harness its energy.
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.tipsCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.tipsTitle, { color: textColor }]}>
            Crystal Care Tips
          </Text>
          <Text style={[styles.tipText, { color: mutedColor }]}>
            • Cleanse your crystals under moonlight or running water
          </Text>
          <Text style={[styles.tipText, { color: mutedColor }]}>
            • Set clear intentions with your crystals
          </Text>
          <Text style={[styles.tipText, { color: mutedColor }]}>
            • Keep them in a special pouch or altar space
          </Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  crystalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  crystalCard: {
    width: '32%',
    aspectRatio: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crystalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  crystalName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  infoName: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoProperty: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 22,
  },
  usageHint: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  usageText: {
    fontSize: 13,
    lineHeight: 20,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 8,
  },
  adBanner: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 12,
  },
});
