import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

const PLANETS = [
  { name: 'Sun', symbol: '☉', meaning: 'Self, identity, core essence' },
  { name: 'Moon', symbol: '☽', meaning: 'Emotions, instincts, inner self' },
  { name: 'Mercury', symbol: '☿', meaning: 'Communication, intellect' },
  { name: 'Venus', symbol: '♀', meaning: 'Love, beauty, values' },
  { name: 'Mars', symbol: '♂', meaning: 'Action, passion, drive' },
  { name: 'Jupiter', symbol: '♃', meaning: 'Expansion, luck, growth' },
  { name: 'Saturn', symbol: '♄', meaning: 'Discipline, responsibility' },
];

const ZODIAC_SIGNS = [
  {
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    ruling: 'Mars',
    traits: 'Bold, courageous, ambitious, energetic',
    strength: 'Passionate, determined, confident',
    weakness: 'Impulsive, reckless, impatient',
    compatible: 'Leo, Sagittarius',
    description:
      'Aries is the first sign of the zodiac, symbolized by the Ram. Aries natives are known for their boldness, courage, and pioneering spirit. They are natural leaders who love challenges and new adventures.',
  },
  {
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    ruling: 'Venus',
    traits: 'Reliable, practical, loyal, steady',
    strength: 'Dependable, patient, grounded',
    weakness: 'Stubborn, materialistic, possessive',
    compatible: 'Virgo, Capricorn',
    description:
      'Taurus is symbolized by the Bull and is known for stability and groundedness. Taurus natives value security, loyalty, and the finer things in life. They are dependable and practical.',
  },
  {
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    ruling: 'Mercury',
    traits: 'Communicative, curious, intelligent, adaptable',
    strength: 'Witty, clever, versatile',
    weakness: 'Inconsistent, indecisive, anxious',
    compatible: 'Libra, Aquarius',
    description:
      'Gemini is represented by the Twins and is known for communication and intellectual curiosity. Geminis are quick-witted, adaptable, and love exchanging ideas with others.',
  },
  {
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    ruling: 'Moon',
    traits: 'Emotional, nurturing, protective, intuitive',
    strength: 'Caring, compassionate, loyal',
    weakness: 'Moody, overly sensitive, clingy',
    compatible: 'Scorpio, Pisces',
    description:
      'Cancer is symbolized by the Crab and is deeply emotional and nurturing. Cancerians are known for their strong connection to home and family, and their intuitive nature.',
  },
  {
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    ruling: 'Sun',
    traits: 'Confident, generous, creative, passionate',
    strength: 'Charismatic, ambitious, warm-hearted',
    weakness: 'Arrogant, stubborn, attention-seeking',
    compatible: 'Aries, Sagittarius',
    description:
      'Leo is symbolized by the Lion and is known for confidence and creativity. Leos are natural leaders who love the spotlight and are known for their generous and warm nature.',
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    ruling: 'Mercury',
    traits: 'Analytical, practical, organized, meticulous',
    strength: 'Observant, hardworking, reliable',
    weakness: 'Perfectionist, critical, overly cautious',
    compatible: 'Taurus, Capricorn',
    description:
      'Virgo is represented by the Maiden and is known for practical intelligence and attention to detail. Virgos are analytical, organized, and have a strong desire to serve others.',
  },
  {
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    ruling: 'Venus',
    traits: 'Diplomatic, fair, social, charming',
    strength: 'Just, aesthetic, balanced',
    weakness: 'Indecisive, people-pleasing, superficial',
    compatible: 'Gemini, Aquarius',
    description:
      'Libra is symbolized by the Scales and is known for balance, harmony, and justice. Libras are social, charming, and value fairness and beautiful surroundings.',
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    ruling: 'Mars, Pluto',
    traits: 'Intense, mysterious, passionate, secretive',
    strength: 'Determined, brave, intuitive',
    weakness: 'Jealous, manipulative, resentful',
    compatible: 'Cancer, Pisces',
    description:
      'Scorpio is symbolized by the Scorpion and is known for intensity and passion. Scorpios are mysterious, deeply emotional, and have a powerful presence.',
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    ruling: 'Jupiter',
    traits: 'Adventurous, optimistic, honest, expansive',
    strength: 'Jovial, generous, enthusiastic',
    weakness: 'Tactless, overconfident, restless',
    compatible: 'Aries, Leo',
    description:
      'Sagittarius is represented by the Archer and is known for adventure and optimism. Sagittarians love freedom, exploration, and expanding their knowledge and horizons.',
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    ruling: 'Saturn',
    traits: 'Ambitious, disciplined, responsible, practical',
    strength: 'Self-controlled, good managers, ambitious',
    weakness: 'Pessimistic, coldness, unforgiving',
    compatible: 'Taurus, Virgo',
    description:
      'Capricorn is symbolized by the Goat and is known for ambition and discipline. Capricorns are practical, hardworking, and have a strong sense of responsibility.',
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    ruling: 'Saturn, Uranus',
    traits: 'Humanitarian, innovative, independent, intellectual',
    strength: 'Progressive, original, visionary',
    weakness: 'Detached, stubborn, aloof',
    compatible: 'Gemini, Libra',
    description:
      'Aquarius is represented by the Water Bearer and is known for innovation and humanitarian ideals. Aquarians are progressive thinkers who value independence and friendship.',
  },
  {
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    ruling: 'Jupiter, Neptune',
    traits: 'Compassionate, artistic, intuitive, gentle',
    strength: 'Empathetic, artistic, intuitive',
    weakness: 'Overly trusting, escapist, victim mentality',
    compatible: 'Cancer, Scorpio',
    description:
      'Pisces is symbolized by the Fish and is known for compassion and intuition. Pisceans are dreamy, artistic, and have a deep connection to emotions and spirituality.',
  },
];

// Astrological Houses
const HOUSES = [
  {
    number: 1,
    name: 'House of Self',
    meaning: 'Identity, appearance, personality, self-image',
    description: 'The First House rules your personality, appearance, and how you present yourself to the world. It represents your vitality and immediate impression on others.',
  },
  {
    number: 2,
    name: 'House of Finances',
    meaning: 'Money, possessions, values, self-worth',
    description: 'The Second House governs finances, material possessions, personal values, and self-worth. It relates to earning and spending money.',
  },
  {
    number: 3,
    name: 'House of Communication',
    meaning: 'Siblings, short trips, communication, intellect',
    description: 'The Third House rules communication, thinking, siblings, and short journeys. It governs learning and the exchange of ideas.',
  },
  {
    number: 4,
    name: 'House of Home',
    meaning: 'Family, home, property, foundations, parents',
    description: 'The Fourth House rules home, family, property, and your private life. It represents your roots and emotional foundation.',
  },
  {
    number: 5,
    name: 'House of Pleasure',
    meaning: 'Romance, creativity, children, self-expression',
    description: 'The Fifth House governs creativity, romance, children, and pleasures. It rules self-expression and creative pursuits.',
  },
  {
    number: 6,
    name: 'House of Service',
    meaning: 'Health, work, daily routines, service to others',
    description: 'The Sixth House rules health, work, and daily routines. It represents service to others and attention to detail.',
  },
  {
    number: 7,
    name: 'House of Relationships',
    meaning: 'Marriage, partnerships, legal matters, others',
    description: 'The Seventh House governs marriage, partnerships, and relationships. It rules how you relate to others and contracts.',
  },
  {
    number: 8,
    name: 'House of Transformation',
    meaning: 'Shared resources, inheritances, transformation, death',
    description: 'The Eighth House rules shared resources, inheritances, sexuality, and transformation. It deals with deep changes and hidden matters.',
  },
  {
    number: 9,
    name: 'House of Adventure',
    meaning: 'Higher learning, travel, philosophy, expansion',
    description: 'The Ninth House governs higher learning, long-distance travel, philosophy, and spiritual growth. It rules wisdom and exploration.',
  },
  {
    number: 10,
    name: 'House of Career',
    meaning: 'Career, public image, reputation, authority',
    description: 'The Tenth House rules career, public image, and reputation. It represents your professional achievements and authority.',
  },
  {
    number: 11,
    name: 'House of Friendships',
    meaning: 'Friendships, groups, hopes, wishes, networking',
    description: 'The Eleventh House governs friendships, group activities, and aspirations. It rules your social circles and future goals.',
  },
  {
    number: 12,
    name: 'House of Secrets',
    meaning: 'Subconscious, hidden matters, spirituality, karma',
    description: 'The Twelfth House rules the subconscious, hidden matters, and spirituality. It represents karmic lessons and spiritual growth.',
  },
];

export function AstrologyScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [tab, setTab] = useState<'zodiac' | 'planets' | 'houses'>('zodiac');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<(typeof ZODIAC_SIGNS)[0] | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<(typeof HOUSES)[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const selectedPlanetData = PLANETS.find((p) => p.name === selectedPlanet);

  const handlePlanetPress = (name: string) => {
    setSelectedPlanet(name);
    setSelectedSign(null);
    setSelectedHouse(null);
    setShowModal(true);
  };

  const handleSignPress = (sign: (typeof ZODIAC_SIGNS)[0]) => {
    setSelectedSign(sign);
    setSelectedPlanet(null);
    setSelectedHouse(null);
    setShowModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>Astrology</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Explore celestial influences
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: cardBg }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor: tab === 'zodiac' ? '#8b5cf6' : 'transparent',
            },
          ]}
          onPress={() => setTab('zodiac')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: tab === 'zodiac' ? '#8b5cf6' : mutedColor,
                fontWeight: tab === 'zodiac' ? '700' : '500',
              },
            ]}
          >
            Zodiac
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor: tab === 'planets' ? '#8b5cf6' : 'transparent',
            },
          ]}
          onPress={() => setTab('planets')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: tab === 'planets' ? '#8b5cf6' : mutedColor,
                fontWeight: tab === 'planets' ? '700' : '500',
              },
            ]}
          >
            Planets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderBottomColor: tab === 'houses' ? '#8b5cf6' : 'transparent',
            },
          ]}
          onPress={() => setTab('houses')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: tab === 'houses' ? '#8b5cf6' : mutedColor,
                fontWeight: tab === 'houses' ? '700' : '500',
              },
            ]}
          >
            Houses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {tab === 'zodiac' && (
        // Zodiac Signs View
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.signGrid}>
            {ZODIAC_SIGNS.map((sign) => (
              <TouchableOpacity
                key={sign.name}
                style={[styles.signCard, { backgroundColor: cardBg }]}
                onPress={() => handleSignPress(sign)}
              >
                <Text style={styles.signSymbol}>{sign.symbol}</Text>
                <Text style={[styles.signName, { color: textColor }]}>
                  {sign.name}
                </Text>
                <Text style={[styles.signDates, { color: mutedColor }]}>
                  {sign.dates}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {tab === 'planets' && (
        // Planets View
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.planetGrid}>
            {PLANETS.map((planet) => (
              <TouchableOpacity
                key={planet.name}
                style={[styles.planetCard, { backgroundColor: cardBg }]}
                onPress={() => handlePlanetPress(planet.name)}
              >
                <Text style={styles.planetSymbol}>{planet.symbol}</Text>
                <Text style={[styles.planetName, { color: textColor }]}>
                  {planet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {tab === 'houses' && (
        // Houses View
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.housesList}>
            {HOUSES.map((house) => (
              <TouchableOpacity
                key={house.number}
                style={[styles.houseCard, { backgroundColor: cardBg }]}
                onPress={() => {
                  setSelectedHouse(house);
                  setSelectedSign(null);
                  setSelectedPlanet(null);
                  setShowModal(true);
                }}
              >
                <Text style={styles.houseNumber}>{house.number}</Text>
                <View style={styles.houseInfo}>
                  <Text style={[styles.houseName, { color: textColor }]}>
                    {house.name}
                  </Text>
                  <Text style={[styles.houseMeaning, { color: mutedColor }]}>
                    {house.meaning}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Modal for Details */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                setSelectedSign(null);
                setSelectedPlanet(null);
                setSelectedHouse(null);
              }}
            >
              <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedPlanetData && (
                <>
                  <Text style={styles.detailSymbol}>{selectedPlanetData.symbol}</Text>
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    {selectedPlanetData.name}
                  </Text>
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Meaning
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedPlanetData.meaning}
                    </Text>
                  </View>
                </>
              )}

              {selectedSign && (
                <>
                  <Text style={styles.detailSymbol}>{selectedSign.symbol}</Text>
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    {selectedSign.name}
                  </Text>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      {selectedSign.dates}
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedSign.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.infoRow,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, { color: mutedColor }]}>
                        Element
                      </Text>
                      <Text style={[styles.infoValue, { color: textColor }]}>
                        {selectedSign.element}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, { color: mutedColor }]}>
                        Ruling
                      </Text>
                      <Text style={[styles.infoValue, { color: textColor }]}>
                        {selectedSign.ruling}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      ✨ Strengths
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedSign.strength}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>
                      ⚠ Weaknesses
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedSign.weakness}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#06b6d4' }]}>
                      💫 Compatible Signs
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedSign.compatible}
                    </Text>
                  </View>
                </>
              )}

              {selectedHouse && (
                <>
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    House {selectedHouse.number}
                  </Text>
                  <Text style={[styles.detailTitle, { color: '#8b5cf6', fontSize: 20 }]}>
                    {selectedHouse.name}
                  </Text>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Meaning
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedHouse.meaning}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      Description
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedHouse.description}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  planetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planetCard: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planetSymbol: {
    fontSize: 36,
    marginBottom: 8,
  },
  planetName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  signCard: {
    width: '32%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signSymbol: {
    fontSize: 32,
    marginBottom: 6,
  },
  signName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  signDates: {
    fontSize: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalScrollContent: {
    padding: 16,
    paddingTop: 56,
  },
  detailSymbol: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  infoItem: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  housesList: {
    flexDirection: 'column',
  },
  houseCard: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  houseNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginRight: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  houseInfo: {
    flex: 1,
  },
  houseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  houseMeaning: {
    fontSize: 13,
    lineHeight: 18,
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
