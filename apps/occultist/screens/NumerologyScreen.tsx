import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

// Fixed dimensions for palm diagram
const PALM_WIDTH = 300;
const PALM_HEIGHT = 450;

const PALMISTRY_ITEMS = [
  {
    id: 'life-line',
    name: 'Life Line',
    meaning: 'Vitality, Health, Life Path',
    description:
      'The Life Line reveals information about your physical health, vitality, and major life changes. It runs from between the thumb and index finger down to the wrist. A long, clear line suggests good health and a full life. Breaks or changes indicate significant life transitions.',
    characteristics: 'Health, vitality, longevity, resilience, life events',
    location: 'Inner edge of palm',
  },
  {
    id: 'head-line',
    name: 'Head Line',
    meaning: 'Intellect, Communication, Thinking',
    description:
      'The Head Line represents your mental powers, communication style, and intellectual abilities. It runs horizontally across the middle of the palm. A straight line suggests logical thinking, while a curved line indicates creativity. It reveals your approach to learning and problem-solving.',
    characteristics: 'Intellect, reasoning, communication, creativity, focus',
    location: 'Middle of palm',
  },
  {
    id: 'heart-line',
    name: 'Heart Line',
    meaning: 'Emotions, Love, Relationships',
    description:
      'The Heart Line reveals your emotional nature and capacity for love. It runs horizontally near the top of the palm. This line shows how you express emotions, your romantic inclinations, and your relationship patterns. A long, clear line suggests emotional balance and deep connections.',
    characteristics: 'Love, passion, emotions, compassion, relationships',
    location: 'Top of palm',
  },
  {
    id: 'fate-line',
    name: 'Fate Line',
    meaning: 'Destiny, Career, Life Purpose',
    description:
      'The Fate Line represents your destiny and life purpose. It typically runs vertically from the base of the palm toward the middle finger. A clear Fate Line suggests a strong sense of direction and purpose. Its presence or absence indicates how much control you have over your destiny.',
    characteristics: 'Destiny, career, purpose, direction, ambition',
    location: 'Center of palm',
  },
  {
    id: 'apollo-line',
    name: 'Apollo Line',
    meaning: 'Creativity, Success, Talent',
    description:
      'The Apollo Line, also called the Sun Line, represents creativity, artistic talent, and success. It runs vertically beneath the ring finger. A well-defined Apollo Line suggests natural talent, success in artistic pursuits, and recognition. It indicates your potential for achievement and public success.',
    characteristics: 'Creativity, talent, success, artistry, recognition',
    location: 'Under ring finger',
  },
  {
    id: 'mercury-line',
    name: 'Mercury Line',
    meaning: 'Communication, Business, Intellect',
    description:
      'The Mercury Line represents communication skills, business acumen, and intellectual pursuits. It runs vertically beneath the little finger. A clear Mercury Line suggests excellent communication abilities and business success. It reveals your skills in persuasion and intellectual expression.',
    characteristics: 'Communication, business, wit, intellect, diplomacy',
    location: 'Under little finger',
  },
  {
    id: 'mount-venus',
    name: 'Mount of Venus',
    meaning: 'Love, Sensuality, Passion',
    description:
      'The Mount of Venus is the fleshy area beneath the thumb. It represents love, sexuality, and passion. A well-developed, firm mount indicates warmth, passion, and capacity for love. Underdeveloped indicates reserved emotions. The overall condition reflects your approach to relationships and sensuality.',
    characteristics: 'Love, passion, sexuality, warmth, desire',
    location: 'Below thumb',
  },
  {
    id: 'mount-luna',
    name: 'Mount of Luna',
    meaning: 'Intuition, Imagination, Dreams',
    description:
      'The Mount of Luna is located at the base of the palm on the opposite side from Venus. It represents imagination, intuition, and the subconscious mind. A prominent mount suggests strong intuition, creativity, and spiritual inclinations. It reveals your connection to the mystical and imaginative realms.',
    characteristics: 'Intuition, imagination, creativity, spirituality, dreams',
    location: 'Lower palm base',
  },
  {
    id: 'mount-jupiter',
    name: 'Mount of Jupiter',
    meaning: 'Leadership, Ambition, Fortune',
    description:
      'The Mount of Jupiter is located beneath the index finger. It represents leadership, ambition, and good fortune. A well-developed mount indicates natural leadership abilities, confidence, and expansive energy. It reveals your capacity for success and your approach to power and authority.',
    characteristics: 'Leadership, ambition, confidence, luck, authority',
    location: 'Below index finger',
  },
  {
    id: 'mount-saturn',
    name: 'Mount of Saturn',
    meaning: 'Responsibility, Wisdom, Spirituality',
    description:
      'The Mount of Saturn is located beneath the middle finger. It represents responsibility, wisdom, and spiritual depth. A well-developed mount suggests seriousness, discipline, and inner wisdom. It indicates your capacity for focus, philosophical thinking, and spiritual understanding.',
    characteristics: 'Responsibility, wisdom, discipline, spirituality, caution',
    location: 'Below middle finger',
  },
  {
    id: 'mount-apollo',
    name: 'Mount of Apollo',
    meaning: 'Creativity, Success, Brightness',
    description:
      'The Mount of Apollo, also called the Mount of the Sun, is located beneath the ring finger. It represents creativity, artistic expression, and success. A prominent mount indicates natural talent, charisma, and the ability to shine. It reveals your creative potential and capacity for success and recognition.',
    characteristics: 'Creativity, success, talent, charisma, brilliance',
    location: 'Below ring finger',
  },
  {
    id: 'mount-mercury',
    name: 'Mount of Mercury',
    meaning: 'Communication, Commerce, Intellect',
    description:
      'The Mount of Mercury is located beneath the little finger. It represents communication, business skills, and intellectual abilities. A well-developed mount indicates eloquence, business acumen, and persuasive abilities. It reveals your capacity for commerce, clever thinking, and verbal expression.',
    characteristics: 'Communication, business, intellect, wit, persuasion',
    location: 'Below little finger',
  },
  {
    id: 'mount-mars',
    name: 'Mounts of Mars',
    meaning: 'Courage, Strength, Energy',
    description:
      'There are two Mounts of Mars on the hand - one between the Life Line and Heart Line (Upper Mars), and one near the thumb (Lower Mars). They represent courage, strength, and energy. Well-developed mounts indicate bravery, physical vitality, and assertiveness. They reveal your capacity to overcome obstacles and face challenges.',
    characteristics: 'Courage, strength, energy, determination, valor',
    location: 'Multiple locations on palm',
  },
];

export function NumerologyScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [selectedItem, setSelectedItem] = useState<(typeof PALMISTRY_ITEMS)[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = isDarkMode ? '#ef4444' : '#3b82f6';
  const borderColor = isDarkMode ? '#666' : '#999';
  const palmBg = isDarkMode ? '#1a1a1a' : '#f9f9f9';

  const handlePalmFeature = (featureId: string) => {
    const item = PALMISTRY_ITEMS.find(i => i.id === featureId);
    if (item) {
      setSelectedItem(item);
      setShowModal(true);
    }
  };

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    const maxWidth = width * 0.90;
    const scale = Math.min(maxWidth / PALM_WIDTH, 1.3);
    setScaleFactor(scale);
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>Palmistry</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Learn to read palms
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
        {/* Palm Diagram */}
        <View onLayout={handleContainerLayout} style={styles.diagramWrapper}>
          <View style={[styles.palmContainer, { transform: [{ scale: scaleFactor }] }]}>
            {/* Hand Outline */}
            <View style={[styles.palmBase, { borderColor, backgroundColor: palmBg }]}>
              {/* Thumb */}
              <View style={[styles.thumb, { borderColor }]} />

              {/* Four Fingers */}
              <View style={styles.fingersContainer}>
                <View style={[styles.finger, { borderColor }]} />
                <View style={[styles.finger, { borderColor }]} />
                <View style={[styles.finger, { borderColor }]} />
                <View style={[styles.finger, { borderColor }]} />
              </View>
            </View>

            {/* Palm Lines */}
            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.lifeLine,
                selectedItem?.id === 'life-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('life-line')}
              activeOpacity={0.7}
            >
              <Text style={styles.lineLabel}>L{'\n'}i{'\n'}f{'\n'}e</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.heartLine,
                selectedItem?.id === 'heart-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('heart-line')}
              activeOpacity={0.7}
            >
              <Text style={[styles.lineLabel, styles.horizontalLineLabel]} numberOfLines={1}>Heart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.headLine,
                selectedItem?.id === 'head-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('head-line')}
              activeOpacity={0.7}
            >
              <Text style={[styles.lineLabel, styles.horizontalLineLabel]} numberOfLines={1}>Head</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.fateLine,
                selectedItem?.id === 'fate-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('fate-line')}
              activeOpacity={0.7}
            >
              <Text style={styles.lineLabel}>Fate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.apolloLine,
                selectedItem?.id === 'apollo-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('apollo-line')}
              activeOpacity={0.7}
            >
              <Text style={styles.lineLabel}>Apollo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmLineElement,
                styles.mercuryLine,
                selectedItem?.id === 'mercury-line' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mercury-line')}
              activeOpacity={0.7}
            >
              <Text style={styles.lineLabel}>Mercury</Text>
            </TouchableOpacity>

            {/* Palm Mounts */}
            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountVenus,
                selectedItem?.id === 'mount-venus' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-venus')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Venus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountLuna,
                selectedItem?.id === 'mount-luna' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-luna')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Luna</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountJupiter,
                selectedItem?.id === 'mount-jupiter' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-jupiter')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Jupiter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountSaturn,
                selectedItem?.id === 'mount-saturn' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-saturn')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Saturn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountApollo,
                selectedItem?.id === 'mount-apollo' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-apollo')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Apollo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountMercury,
                selectedItem?.id === 'mount-mercury' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-mercury')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Mercury</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.palmMountElement,
                styles.mountMars,
                selectedItem?.id === 'mount-mars' && styles.highlighted,
              ]}
              onPress={() => handlePalmFeature('mount-mars')}
              activeOpacity={0.7}
            >
              <Text style={styles.mountLabel} numberOfLines={1}>Mars</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={[styles.legendTitle, { color: textColor }]}>
            Tap any line or mount to learn more
          </Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.legendText, { color: mutedColor }]}>Palm Lines</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={[styles.legendText, { color: mutedColor }]}>Palm Mounts</Text>
          </View>
        </View>
      </ScrollView>

      {/* Palmistry Detail Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedItem && (
                <>
                  {/* Palm Item Name */}
                  <View style={styles.numberDisplay}>
                    <Text style={styles.largeNumber}>
                      {selectedItem.name}
                    </Text>
                  </View>

                  {/* Meaning */}
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    {selectedItem.meaning}
                  </Text>

                  {/* Description */}
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
                      {selectedItem.description}
                    </Text>
                  </View>

                  {/* Characteristics */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      ✨ Characteristics
                    </Text>
                    <View style={styles.traitsContainer}>
                      {selectedItem.characteristics.split(', ').map((char, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.traitBadge,
                            { backgroundColor: '#8b5cf6' },
                          ]}
                        >
                          <Text style={styles.traitText}>{char}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Location */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>
                      📍 Location
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedItem.location}
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
  scrollContent: {
    paddingBottom: 24,
  },

  /* Diagram Styles */
  diagramWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  palmContainer: {
    width: PALM_WIDTH,
    height: PALM_HEIGHT,
    position: 'relative',
    marginVertical: 24,
  },

  /* Hand Outline Styles */
  palmBase: {
    width: 220,
    height: 300,
    borderWidth: 2,
    borderRadius: 40,
    position: 'absolute',
    top: 100,
    left: 40,
  },
  thumb: {
    width: 60,
    height: 90,
    borderWidth: 2,
    borderRadius: 30,
    position: 'absolute',
    top: 80,
    left: -35,
    transform: [{ rotate: '-15deg' }],
  },
  fingersContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: -85,
    left: 30,
    width: 160,
    justifyContent: 'space-between',
  },
  finger: {
    width: 32,
    height: 90,
    borderWidth: 2,
    borderRadius: 16,
  },

  /* Palm Lines */
  palmLineElement: {
    position: 'absolute',
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lifeLine: {
    width: 6,
    height: 140,
    borderRadius: 3,
    top: 120,
    left: 85,
    transform: [{ rotate: '25deg' }],
  },
  heartLine: {
    width: 170,
    height: 5,
    borderRadius: 2.5,
    top: 130,
    left: 75,
  },
  headLine: {
    width: 180,
    height: 5,
    borderRadius: 2.5,
    top: 165,
    left: 70,
  },
  fateLine: {
    width: 5,
    height: 160,
    borderRadius: 2.5,
    top: 180,
    left: 148,
  },
  apolloLine: {
    width: 5,
    height: 120,
    borderRadius: 2.5,
    top: 200,
    left: 195,
  },
  mercuryLine: {
    width: 5,
    height: 100,
    borderRadius: 2.5,
    top: 210,
    left: 235,
  },
  lineLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginVertical: 0,
  },
  horizontalLineLabel: {
    marginVertical: -10,
    marginBottom: -8,
  },

  /* Palm Mounts */
  palmMountElement: {
    position: 'absolute',
    backgroundColor: '#f59e0b',
    opacity: 0.65,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mountVenus: {
    width: 70,
    height: 70,
    borderRadius: 35,
    top: 250,
    left: 50,
  },
  mountLuna: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    top: 290,
    left: 200,
  },
  mountJupiter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 95,
    left: 95,
  },
  mountSaturn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 90,
    left: 145,
  },
  mountApollo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    top: 95,
    left: 190,
  },
  mountMercury: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    top: 100,
    left: 230,
  },
  mountMars: {
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 200,
    left: 130,
  },
  mountLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* Highlighted State */
  highlighted: {
    opacity: 1,
    transform: [{ scale: 1.12 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },

  /* Legend */
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },

  /* Modal Styles */
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
    color: '#fff',
  },
  modalScrollContent: {
    padding: 16,
    paddingTop: 56,
  },
  numberDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  largeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  detailTitle: {
    fontSize: 22,
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
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  traitText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
