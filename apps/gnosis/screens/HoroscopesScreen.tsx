import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { API_CONFIG } from '../config';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export function HoroscopesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSignPress = async (sign: string) => {
    setSelectedSign(sign);
    setLoading(true);
    setError('');
    setHoroscope('');

    try {
      if (API_CONFIG.NINJAS_API_KEY === 'YOUR_API_KEY_HERE') {
        setError(
          'API key not configured. Please add your API Ninjas key to config.ts'
        );
        setLoading(false);
        return;
      }

      const signLower = sign.toLowerCase();
      const response = await fetch(
        `${API_CONFIG.NINJAS_BASE_URL}/horoscope?zodiac=${signLower}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': API_CONFIG.NINJAS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.horoscope) {
        setHoroscope(data.horoscope);
      } else {
        setError('No horoscope data received');
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to fetch horoscope. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = isDarkMode ? '#ef4444' : '#3b82f6';

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>Horoscopes</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Daily guidance from the stars
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Select Your Sign</Text>

          <View style={styles.signGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <TouchableOpacity
                key={sign}
                style={[
                  styles.signCard,
                  {
                    backgroundColor: selectedSign === sign ? '#8b5cf6' : cardBg,
                  },
                ]}
                onPress={() => handleSignPress(sign)}
              >
                <Text
                  style={[
                    styles.signName,
                    {
                      color: selectedSign === sign ? '#fff' : textColor,
                    },
                  ]}
                >
                  {sign}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading && <ActivityIndicator size="large" color="#8b5cf6" style={styles.loader} />}

          {error && !loading && (
            <View style={[styles.errorCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.errorText, { color: '#ef4444' }]}>{error}</Text>
            </View>
          )}

          {horoscope && !loading && (
            <View style={[styles.resultCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.resultText, { color: textColor }]}>{horoscope}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signCard: {
    width: '32%',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signName: {
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
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
