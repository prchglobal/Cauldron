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

const CHAKRAS = [
  {
    name: 'Crown',
    color: '#ffffff',
    symbol: '⚪',
    meaning: 'Spirituality, connection, enlightenment',
    affirmation: 'I am connected to the divine',
  },
  {
    name: 'Third Eye',
    color: '#4400ff',
    symbol: '🟣',
    meaning: 'Intuition, vision, insight',
    affirmation: 'I trust my intuition',
  },
  {
    name: 'Throat',
    color: '#0088ff',
    symbol: '🔵',
    meaning: 'Communication, expression, truth',
    affirmation: 'I express myself freely',
  },
  {
    name: 'Heart',
    color: '#00ff00',
    symbol: '💚',
    meaning: 'Love, compassion, connection',
    affirmation: 'I am open to love',
  },
  {
    name: 'Solar Plexus',
    color: '#ffff00',
    symbol: '🟡',
    meaning: 'Power, confidence, will',
    affirmation: 'I am confident and powerful',
  },
  {
    name: 'Sacral',
    color: '#ff8800',
    symbol: '🟠',
    meaning: 'Creativity, sexuality, passion',
    affirmation: 'I embrace my creativity',
  },
  {
    name: 'Root',
    color: '#ff0000',
    symbol: '🔴',
    meaning: 'Stability, grounding, survival',
    affirmation: 'I am safe and grounded',
  },
];

export function ChakrasScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const selectedChakraData = CHAKRAS.find((c) => c.name === selectedChakra);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>Chakras</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Balance your energy centers
        </Text>
      </View>

      <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
        <View style={styles.chakraStack}>
          {CHAKRAS.map((chakra) => (
            <TouchableOpacity
              key={chakra.name}
              style={[
                styles.chakraItem,
                {
                  backgroundColor: selectedChakra === chakra.name ? '#000000' : cardBg,
                  opacity: selectedChakra === chakra.name ? 1 : 0.8,
                },
              ]}
              onPress={() => setSelectedChakra(chakra.name)}
            >
              <Text style={styles.chakraSymbol}>{chakra.symbol}</Text>
              <View style={styles.chakraInfo}>
                <Text
                  style={[
                    styles.chakraName,
                    {
                      color: selectedChakra === chakra.name ? '#fff' : textColor,
                    },
                  ]}
                >
                  {chakra.name}
                </Text>
                <Text
                  style={[
                    styles.chakraLabel,
                    {
                      color: selectedChakra === chakra.name ? '#fff' : mutedColor,
                    },
                  ]}
                >
                  {chakra.meaning}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedChakraData && (
          <View style={[styles.detailCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.detailTitle, { color: textColor }]}>
              {selectedChakraData.name} Chakra
            </Text>
            <View style={styles.affirmationBox}>
              <Text style={[styles.affirmation, { color: '#8b5cf6' }]}>
                "{selectedChakraData.affirmation}"
              </Text>
            </View>
            <Text style={[styles.detailMeaning, { color: mutedColor }]}>
              The {selectedChakraData.name} Chakra represents{' '}
              {selectedChakraData.meaning.toLowerCase()}.
            </Text>
          </View>
        )}
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
  chakraStack: {
    marginBottom: 20,
  },
  chakraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chakraSymbol: {
    fontSize: 32,
    marginRight: 12,
  },
  chakraInfo: {
    flex: 1,
  },
  chakraName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chakraLabel: {
    fontSize: 13,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  affirmationBox: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    marginBottom: 12,
  },
  affirmation: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  detailMeaning: {
    fontSize: 14,
    lineHeight: 22,
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
