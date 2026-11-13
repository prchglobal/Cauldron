import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

// Hebrew Gematria values (standard / mispar hechrachi)
const hebrewGematria: Record<string, number> = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
  'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200,
  'ש': 300, 'ת': 400,
};

// English Gematria (simple: A=1, B=2 ... Z=26)
const englishGematria: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 10, k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17,
  r: 18, s: 19, t: 20, u: 21, v: 22, w: 23, x: 24, y: 25, z: 26,
};

const numerologyMeanings: Record<number, string> = {
  1: 'Leadership, independence, determination, and new beginnings.',
  2: 'Balance, harmony, cooperation, and diplomacy.',
  3: 'Creativity, self-expression, communication, and enthusiasm.',
  4: 'Stability, hard work, organization, and loyalty.',
  5: 'Freedom, adventure, versatility, and change.',
  6: 'Love, nurturing, responsibility, and harmony.',
  7: 'Spiritual wisdom, analysis, introspection, and intuition.',
  8: 'Power, abundance, success, and material achievement.',
  9: 'Compassion, universal love, completion, and wisdom.',
  11: 'Inspiration, spiritual awareness, and enlightenment (master number).',
  22: 'Master builder — turning vision into reality on a large scale.',
  33: 'Master teacher — compassion, healing, and uplifting humanity.',
};

function getReducedNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num >= 10) {
    num = Math.floor(num / 10) + (num % 10);
  }
  return num;
}

export function GematriaScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const inputBg = isDarkMode ? '#1f1f1f' : '#f0f0f0';

  const bottomPadding = insets.bottom + 76;

  const handleCalculate = () => {
    Keyboard.dismiss();
    const text = input.trim();
    if (!text) {
      setResult('Enter a word or phrase (English A–Z or Hebrew א–ת) to calculate its gematria value.');
      return;
    }

    let hebrewTotal = 0;
    let englishTotal = 0;
    let hasHebrew = false;
    let hasEnglish = false;

    for (const char of text) {
      const lowerChar = char.toLowerCase();
      if (hebrewGematria[char]) {
        hebrewTotal += hebrewGematria[char];
        hasHebrew = true;
      } else if (englishGematria[lowerChar]) {
        englishTotal += englishGematria[lowerChar];
        hasEnglish = true;
      }
    }

    if (!hasHebrew && !hasEnglish) {
      setResult('No alphabetic characters found. Enter letters (English A–Z or Hebrew א–ת).');
      return;
    }

    const reducedEnglish = getReducedNumber(englishTotal);
    const reducedHebrew = getReducedNumber(hebrewTotal);
    let out = `"${text}"\n\n`;

    if (hasEnglish) {
      out += `📝 English Gematria: ${englishTotal}\n   Reduced: ${reducedEnglish}\n\n`;
    }
    if (hasHebrew) {
      out += `✡️ Hebrew Gematria: ${hebrewTotal}\n   Reduced: ${reducedHebrew}\n\n`;
    }

    const mainReduced = hasHebrew ? reducedHebrew : reducedEnglish;
    const meaning = numerologyMeanings[mainReduced];
    if (meaning) {
      out += `🔮 Numerological meaning of ${mainReduced}:\n${meaning}`;
    }

    setResult(out.trim());
  };

  return (
    <View style={[styles.screen, { backgroundColor: containerBg }]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: bottomPadding }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: textColor }]}>✡️ Gematria</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Numeric value of words in English and Hebrew
        </Text>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
            placeholder="Enter a word or phrase"
            placeholderTextColor={mutedColor}
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
            onSubmitEditing={handleCalculate}
          />
          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {result ? (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.result, { color: textColor }]}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  result: { fontSize: 15, lineHeight: 22 },
});
