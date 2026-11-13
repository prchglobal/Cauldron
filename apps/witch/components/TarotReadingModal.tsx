import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MAJOR_ARCANA, SWORDS, WANDS, CUPS, PENTACLES, Card } from '../screens/TarotScreen';

interface TarotReadingModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  cardBg: string;
  textColor: string;
  mutedColor: string;
}

interface DrawnCard {
  card: Card;
  isReversed: boolean;
  position: 'past' | 'present' | 'future' | 'outcome' | 'situation' | 'challenge' | 'advice';
}

type ModalStep = 'spread-select' | 'revealing' | 'interpretation';
type SpreadType = 'past-present-future' | 'situation-challenge-advice';

// Combine all cards
const ALL_CARDS = [
  ...MAJOR_ARCANA,
  ...SWORDS,
  ...WANDS,
  ...CUPS,
  ...PENTACLES,
];

// Fisher-Yates shuffle
function shuffleCards(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Draw 4 random cards with 50% reversed chance
function drawCards(spread: SpreadType): DrawnCard[] {
  const shuffled = shuffleCards(ALL_CARDS);
  const selected = shuffled.slice(0, 4);

  const positions: Array<'past' | 'present' | 'future' | 'outcome' | 'situation' | 'challenge' | 'advice'> =
    spread === 'past-present-future'
      ? ['past', 'present', 'future', 'outcome']
      : ['situation', 'challenge', 'advice', 'outcome'];

  return selected.map((card, index) => ({
    card,
    isReversed: Math.random() < 0.5,
    position: positions[index],
  }));
}

// Generate interpretation for a single card
function generateCardInterpretation(position: string, drawnCard: DrawnCard, _spread: SpreadType): string {
  const meaning = drawnCard.isReversed
    ? drawnCard.card.reversed
    : drawnCard.card.meaning;

  const context = generateContext(position);
  return `${meaning}. ${context}`;
}

// Generate interpretation based on spread and cards
function generateInterpretation(spread: SpreadType, cards: DrawnCard[]): string {
  const positionLabels = spread === 'past-present-future'
    ? ['past', 'present', 'future', 'outcome']
    : ['situation', 'challenge', 'advice', 'outcome'];

  const positionPhrases = spread === 'past-present-future'
    ? {
        past: 'In your past,',
        present: 'In your present,',
        future: 'Looking toward your future,',
        outcome: 'The outcome suggests that',
      }
    : {
        situation: 'Your current situation involves',
        challenge: 'The challenge you face is',
        advice: 'The guidance offered is',
        outcome: 'The outcome of this path will be',
      };

  let interpretation = '';

  cards.forEach((drawnCard, index) => {
    const meaning = drawnCard.isReversed
      ? drawnCard.card.reversed
      : drawnCard.card.meaning;

    const positionLabel = positionLabels[index];
    const positionPhrase = positionPhrases[positionLabel as keyof typeof positionPhrases];
    const context = generateContext(positionLabels[index]);
    const cardName = drawnCard.card.name + (drawnCard.isReversed ? ' (reversed)' : '');

    interpretation += `${positionPhrase} ${cardName} indicates ${meaning.toLowerCase()}. ${context} `;
  });

  const summary = generateSummary();
  interpretation += `\n\n${summary}\n\nTrust in the wisdom of the cards and your own intuition.`;

  return interpretation;
}

function generateContext(position: string): string {
  const contextTemplates: Record<string, string[]> = {
    Past: [
      'This has shaped your current journey.',
      'This foundation influences where you are today.',
      'This experience remains part of your story.',
    ],
    Present: [
      'This energy is active in your life now.',
      'This is what you are experiencing currently.',
      'This defines your present situation.',
    ],
    Future: [
      'This awaits you on the path ahead.',
      'This is the direction you are moving toward.',
      'This potential is emerging before you.',
    ],
    Situation: [
      'This describes your current circumstances.',
      'This is the context of your situation.',
      'This reflects what surrounds you.',
    ],
    Challenge: [
      'This is the obstacle you must overcome.',
      'This reveals the challenge before you.',
      'This is what requires your attention.',
    ],
    Advice: [
      'This offers guidance for your next step.',
      'This wisdom will serve you well.',
      'This points the way forward.',
    ],
    Outcome: [
      'This shows the culmination of this journey.',
      'This is the likely result of your path.',
      'This reveals the final chapter of this cycle.',
    ],
  };

  const templates = contextTemplates[position] || ['This card speaks to your situation.'];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSummary(): string {
  const summaryTemplates = [
    'Together, these cards paint a clear picture of your journey.',
    'The interplay of these cards reveals a meaningful narrative.',
    'This combination speaks to the interconnection of your circumstances.',
    'The universe presents these cards as your divine guidance.',
  ];

  const template = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  return template;
}

export function TarotReadingModal({
  visible,
  onClose,
  isDarkMode,
  cardBg,
  textColor,
  mutedColor,
}: TarotReadingModalProps) {
  const [step, setStep] = useState<ModalStep>('spread-select');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setStep('spread-select');
      setSelectedSpread(null);
      setDrawnCards([]);
      setRevealedCount(0);
    }
  }, [visible]);

  // Animation timer for card reveals
  useEffect(() => {
    if (step === 'revealing' && revealedCount < 4) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
      }, 1250); // 1.25 seconds

      return () => clearTimeout(timer);
    } else if (step === 'revealing' && revealedCount === 4) {
      const timer = setTimeout(() => {
        setStep('interpretation');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [step, revealedCount]);

  const handleSpreadSelect = (spread: SpreadType) => {
    const cards = drawCards(spread);
    setSelectedSpread(spread);
    setDrawnCards(cards);
    setStep('revealing');
    setRevealedCount(0);
  };

  const spreadTitle = selectedSpread === 'past-present-future'
    ? 'Past/Present/Future/Outcome'
    : 'Situation/Challenge/Advice/Outcome';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.modalContainer, { backgroundColor: containerBg }]}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Spread Selection Screen */}
        {step === 'spread-select' && (
          <View style={styles.screenContainer}>
            <Text style={[styles.screenTitle, { color: textColor }]}>Choose Your Reading</Text>
            <Text style={[styles.screenSubtitle, { color: mutedColor }]}>
              Select a spread type to begin your tarot reading
            </Text>

            <View style={styles.spreadCardsContainer}>
              {/* Past/Present/Future Spread */}
              <TouchableOpacity
                style={[styles.spreadCard, { backgroundColor: '#8b5cf6' }]}
                onPress={() => handleSpreadSelect('past-present-future')}
                activeOpacity={0.8}
              >
                <Text style={styles.spreadCardTitle}>Past/Present/Future</Text>
                <Text style={styles.spreadCardDescription}>
                  Explore your journey through time
                </Text>
              </TouchableOpacity>

              {/* Situation/Challenge/Advice Spread */}
              <TouchableOpacity
                style={[styles.spreadCard, { backgroundColor: '#ec4899' }]}
                onPress={() => handleSpreadSelect('situation-challenge-advice')}
                activeOpacity={0.8}
              >
                <Text style={styles.spreadCardTitle}>Situation/Challenge/Advice</Text>
                <Text style={styles.spreadCardDescription}>
                  Gain clarity and guidance for your path
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Card Reveal Screen */}
        {step === 'revealing' && (
          <View style={styles.screenContainer}>
            <Text style={[styles.progressText, { color: textColor }]}>
              Drawing your cards... ({revealedCount}/4)
            </Text>

            <ScrollView
              contentContainerStyle={styles.cardsScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {drawnCards.map((drawnCard, index) => (
                <View key={index} style={styles.cardRevealWrapper}>
                  {index < revealedCount && (
                    <View style={styles.cardRevealInner}>
                      <Image
                        source={drawnCard.card.image}
                        style={[
                          styles.cardImage,
                          drawnCard.isReversed && styles.cardImageReversed,
                        ]}
                      />
                      <View style={styles.cardGlow} />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Interpretation Screen */}
        {step === 'interpretation' && selectedSpread && (
          <ScrollView style={styles.interpretationContainer} contentContainerStyle={styles.interpretationScrollContent}>
            <Text style={[styles.interpretationTitle, { color: textColor }]}>
              {spreadTitle} Reading
            </Text>

            {/* Card and Interpretation Pairs */}
            {drawnCards.map((drawnCard, index) => {
              const positionLabels = selectedSpread === 'past-present-future'
                ? ['Past', 'Present', 'Future', 'Outcome']
                : ['Situation', 'Challenge', 'Advice', 'Outcome'];
              const position = positionLabels[index];
              const interpretation = generateCardInterpretation(position, drawnCard, selectedSpread);

              return (
                <View key={index} style={styles.cardInterpretationPair}>
                  {/* Card */}
                  <View style={styles.cardWithLabel}>
                    <Image
                      source={drawnCard.card.image}
                      style={[
                        styles.pairCardImage,
                        drawnCard.isReversed && styles.pairCardImageReversed,
                      ]}
                    />
                    <Text style={[styles.cardPositionLabel, { color: textColor }]}>
                      {position}
                    </Text>
                    {drawnCard.isReversed && (
                      <Text style={[styles.reversedIndicator, { color: '#ec4899' }]}>
                        Reversed
                      </Text>
                    )}
                  </View>

                  {/* Interpretation Text */}
                  <View style={[styles.cardInterpretationBox, { backgroundColor: cardBg }]}>
                    <Text style={[styles.cardInterpretationTitle, { color: textColor }]}>
                      {drawnCard.card.name}
                    </Text>
                    <Text style={[styles.cardInterpretationText, { color: mutedColor }]}>
                      {interpretation}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Reading Summary */}
            <View style={[styles.summaryBox, { backgroundColor: cardBg, borderColor: '#8b5cf6' }]}>
              <Text style={[styles.summaryTitle, { color: '#8b5cf6' }]}>
                ✨ Reading Summary
              </Text>
              <Text style={[styles.summaryText, { color: mutedColor }]}>
                {generateInterpretation(selectedSpread, drawnCards)}
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  spreadCardsContainer: {
    gap: 16,
    width: '100%',
  },
  spreadCard: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spreadCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  spreadCardDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 40,
  },
  cardsScrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardRevealWrapper: {
    width: 160,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRevealInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cardImageReversed: {
    transform: [{ rotate: '180deg' }],
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    opacity: 0.1,
  },
  interpretationContainer: {
    flex: 1,
    paddingTop: 80,
  },
  interpretationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  gridCardWrapper: {
    alignItems: 'center',
    width: '48%',
  },
  gridCardImage: {
    width: 100,
    height: 170,
    borderRadius: 8,
    marginBottom: 8,
  },
  gridCardImageReversed: {
    transform: [{ rotate: '180deg' }],
  },
  cardPositionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  reversedIndicator: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  interpretationScrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardInterpretationPair: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardWithLabel: {
    alignItems: 'center',
    marginBottom: 12,
  },
  pairCardImage: {
    width: 110,
    height: 175,
    borderRadius: 8,
    marginBottom: 12,
  },
  pairCardImageReversed: {
    transform: [{ rotate: '180deg' }],
  },
  cardInterpretationBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInterpretationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardInterpretationText: {
    fontSize: 13,
    lineHeight: 20,
  },
  summaryBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 22,
  },
  interpretationBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  interpretationText: {
    fontSize: 14,
    lineHeight: 24,
  },
  actionButtonsContainer: {
    gap: 12,
    paddingHorizontal: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
