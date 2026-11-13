import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

const NUMBER_MEANINGS: Record<number, { title: string; keywords: string; description: string }> = {
  1: {
    title: 'The Leader / Pioneer',
    keywords: 'Independence, Ambition, Innovation, Willpower',
    description: 'Number 1 represents primal force, individuality, and self-reliance. You are driven to break new ground and stand on your own two feet.',
  },
  2: {
    title: 'The Peacemaker / Diplomat',
    keywords: 'Harmony, Intuition, Cooperation, Balance',
    description: 'Number 2 represents duality, partnership, and sensitivity. You bring peace, connection, and gentle grace to challenging situations.',
  },
  3: {
    title: 'The Creator / Communicator',
    keywords: 'Self-expression, Creativity, Joy, Charisma',
    description: 'Number 3 radiates optimism, artistic gifts, and vibrant speech. You inspire others through warmth, storytelling, and joyful expression.',
  },
  4: {
    title: 'The Builder / Foundation',
    keywords: 'Stability, Discipline, Order, Practicality',
    description: 'Number 4 provides the bedrock structure. You are dependable, methodic, and skilled at turning ideas into lasting physical reality.',
  },
  5: {
    title: 'The Adventurer / Free Spirit',
    keywords: 'Freedom, Adaptability, Travel, Curiosity',
    description: 'Number 5 thrives on change, sensual experiences, and dynamic freedom. You embrace life as a fast-paced, ever-shifting adventure.',
  },
  6: {
    title: 'The Nurturer / Caregiver',
    keywords: 'Love, Family, Responsibility, Healing',
    description: 'Number 6 is the heartbeat of compassion, community, and service. You create sanctuary and nurture harmony wherever you go.',
  },
  7: {
    title: 'The Mystic / Seeker',
    keywords: 'Wisdom, Spiritual Insight, Analysis, Solitude',
    description: 'Number 7 probes the deep mysteries. You seek ultimate truth beneath the surface through quiet contemplation and spiritual study.',
  },
  8: {
    title: 'The Achiever / Manifestor',
    keywords: 'Abundance, Power, Material Mastery, Karma',
    description: 'Number 8 bridges spiritual intent and material mastery. You command resources, establish justice, and manifest ambitious goals.',
  },
  9: {
    title: 'The Humanitarian / Sage',
    keywords: 'Universal Love, Completion, Wisdom, Philanthropy',
    description: 'Number 9 represents higher consciousness and universal brotherhood. You let go of ego to serve the highest good of humanity.',
  },
  11: {
    title: 'Master 11: The Illuminator',
    keywords: 'Spiritual Awakening, Visionary, High Intuition',
    description: 'Master number 11 is an intuitive channel connecting mortal awareness to cosmic light. You inspire spiritual transformation.',
  },
  22: {
    title: 'Master 22: The Master Builder',
    keywords: 'Large-scale Manifestation, Practical Idealism',
    description: 'Master number 22 translates transcendent dreams into grand structural realities that benefit generations.',
  },
  33: {
    title: 'Master 33: The Master Teacher',
    keywords: 'Spiritual Upliftment, Compassion, Divine Guidance',
    description: 'Master number 33 embodies pure unconditional devotion and healing service to uplift planetary consciousness.',
  },
};

function reduceNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

function calculateLifePath(birthdate: string): number | null {
  const digits = birthdate.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const sum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduceNumber(sum);
}

function calculateNameNumber(name: string): number | null {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) return null;
  const letterMap: Record<string, number> = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9,
  };
  const sum = clean.split('').reduce((acc, char) => acc + (letterMap[char] || 0), 0);
  return reduceNumber(sum);
}

export function NumerologyScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const [birthdate, setBirthdate] = useState('1990-01-01');
  const [name, setName] = useState('');

  const lifePath = calculateLifePath(birthdate);
  const nameNumber = calculateNameNumber(name);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaaaaa' : '#666666';
  const accent = '#8b5cf6';
  const borderColor = isDarkMode ? '#3a3a3a' : '#e5e7eb';

  const bottomPadding = insets.bottom + (bannerTop ? 76 : 30);

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>🔢 Numerology</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Discover the sacred vibration of numbers and names
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}>
        {/* Life Path Calculator */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>✨ Life Path Number</Text>
          <Text style={[styles.cardSubtitle, { color: mutedColor }]}>
            Calculated from your date of birth (YYYY-MM-DD):
          </Text>

          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: isDarkMode ? '#1f1d2b' : '#f9fafb', borderColor }]}
            value={birthdate}
            onChangeText={setBirthdate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={mutedColor}
          />

          {lifePath && NUMBER_MEANINGS[lifePath] ? (
            <View style={[styles.resultBox, { backgroundColor: accent + '15', borderColor: accent + '50' }]}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>{lifePath}</Text>
              </View>
              <Text style={[styles.resultTitle, { color: accent }]}>{NUMBER_MEANINGS[lifePath].title}</Text>
              <Text style={[styles.resultKeywords, { color: textColor }]}>
                Keywords: {NUMBER_MEANINGS[lifePath].keywords}
              </Text>
              <Text style={[styles.resultDescription, { color: mutedColor }]}>
                {NUMBER_MEANINGS[lifePath].description}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Expression / Destiny Number Calculator */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>🔤 Destiny (Name) Number</Text>
          <Text style={[styles.cardSubtitle, { color: mutedColor }]}>
            Enter your full birth name or current name:
          </Text>

          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: isDarkMode ? '#1f1d2b' : '#f9fafb', borderColor }]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. John Doe"
            placeholderTextColor={mutedColor}
          />

          {nameNumber && NUMBER_MEANINGS[nameNumber] ? (
            <View style={[styles.resultBox, { backgroundColor: accent + '15', borderColor: accent + '50' }]}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>{nameNumber}</Text>
              </View>
              <Text style={[styles.resultTitle, { color: accent }]}>{NUMBER_MEANINGS[nameNumber].title}</Text>
              <Text style={[styles.resultKeywords, { color: textColor }]}>
                Keywords: {NUMBER_MEANINGS[nameNumber].keywords}
              </Text>
              <Text style={[styles.resultDescription, { color: mutedColor }]}>
                {NUMBER_MEANINGS[nameNumber].description}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  content: { padding: 16, gap: 16 },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cardSubtitle: { fontSize: 13, marginBottom: 14, lineHeight: 18 },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  resultBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
  },
  numberBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  numberBadgeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  resultKeywords: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
