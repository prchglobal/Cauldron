import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

type CardSuit = 'major' | 'swords' | 'wands' | 'cups' | 'pentacles';

const MAJOR_ARCANA = [
  {
    id: 0,
    name: 'The Fool',
    image: require('../assets/cards/00-TheFool.png'),
    meaning: 'New beginnings, taking risks, innocence',
    reversed: 'Recklessness, naivety, poor judgment',
    description:
      'The Fool represents new beginnings and the willingness to take risks in order to move forward.',
  },
  {
    id: 1,
    name: 'The Magician',
    image: require('../assets/cards/01-TheMagician.png'),
    meaning: 'Manifestation, resourcefulness, power, inspired action',
    reversed: 'Manipulation, poor planning, untapped potential',
    description:
      'The Magician signifies resourcefulness and the power to manifest your desires through will and determination.',
  },
  {
    id: 2,
    name: 'The High Priestess',
    image: require('../assets/cards/02-TheHighPriestess.png'),
    meaning: 'Intuition, sacred knowledge, divine feminine, subconscious',
    reversed: 'Repressed intuition, hidden agendas, lack of reflection',
    description:
      'The High Priestess embodies intuition and wisdom. She reveals the secrets of the universe and the mysteries of the subconscious.',
  },
  {
    id: 3,
    name: 'The Empress',
    image: require('../assets/cards/03-TheEmpress.png'),
    meaning: 'Femininity, beauty, abundance, nature, sensuality',
    reversed: 'Self-doubt, lack of confidence, creative blocks',
    description:
      'The Empress represents abundance, fertility, and the sensual pleasures of life. She embodies nurturing energy and creative potential.',
  },
  {
    id: 4,
    name: 'The Emperor',
    image: require('../assets/cards/04-TheEmperor.png'),
    meaning: 'Authority, establishment, structure, leadership, father figure',
    reversed: 'Domination, excessive control, lack of discipline',
    description:
      'The Emperor represents authority, power, and leadership. He brings structure and order to chaos.',
  },
  {
    id: 5,
    name: 'The Hierophant',
    image: require('../assets/cards/05-TheHierophant.png'),
    meaning: 'Tradition, conformity, morality, ethics, education',
    reversed: 'Rebellion, subversion, heterodoxy, reexamination of beliefs',
    description:
      'The Hierophant is the keeper of tradition and spiritual doctrine. He represents teaching and moral guidance.',
  },
  {
    id: 6,
    name: 'The Lovers',
    image: require('../assets/cards/06-TheLovers.png'),
    meaning: 'Love, harmony, trust, alignment, values',
    reversed: 'Disharmony, misalignment of values, conflict',
    description:
      'The Lovers card symbolizes intimate relationships, personal beliefs and core values. It represents choice and alignment.',
  },
  {
    id: 7,
    name: 'The Chariot',
    image: require('../assets/cards/07-TheChariot.png'),
    meaning: 'Control, willpower, determination, self-discipline',
    reversed: 'Out of control, lack of direction, aggression',
    description:
      'The Chariot represents willpower and determination. Success comes through confidence and inner strength.',
  },
  {
    id: 8,
    name: 'Strength',
    image: require('../assets/cards/08-Strength.png'),
    meaning: 'Inner strength, courage, patience, control, compassion',
    reversed: 'Inner weakness, self-doubt, insecurity',
    description:
      'Strength is not physical power but inner strength and compassion. It represents patience and gentleness winning over brute force.',
  },
  {
    id: 9,
    name: 'The Hermit',
    image: require('../assets/cards/09-TheHermit.png'),
    meaning: 'Soul searching, introspection, inner guidance, soul-purpose',
    reversed: 'Isolation, loneliness, withdrawn, reclusive',
    description:
      'The Hermit represents the inward journey and the search for inner truth. He walks the path of self-discovery.',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    image: require('../assets/cards/10-WheelOfFortune.png'),
    meaning: 'Good luck, karma, life cycles, destiny, turning point',
    reversed: 'Bad luck, resistance to change, broken cycles',
    description:
      'The Wheel of Fortune symbolizes destiny and the cycles of life. What goes up must come down, and the wheel always turns.',
  },
  {
    id: 11,
    name: 'Justice',
    image: require('../assets/cards/11-Justice.png'),
    meaning: 'Justice, fairness, truth, cause and effect, accountability',
    reversed: 'Injustice, lack of accountability, dishonesty',
    description:
      'Justice represents truth, fairness, and the law of karma. Actions have consequences and balance will be restored.',
  },
  {
    id: 12,
    name: 'The Hanged Man',
    image: require('../assets/cards/12-TheHangedMan.png'),
    meaning: 'Pause, suspension, restriction, letting go, perspective shift',
    reversed: 'Stagnation, needless delays, indecision',
    description:
      'The Hanged Man suggests a pause in life. A new perspective can be gained by looking at situations from a different angle.',
  },
  {
    id: 13,
    name: 'Death',
    image: require('../assets/cards/13-Death.png'),
    meaning: 'Endings, beginnings, change, transformation, transition',
    reversed: 'Stagnation, resistance to change, personal transformation blocked',
    description:
      'Death represents transformation and change. It is not literal death but the end of one cycle and the beginning of another.',
  },
  {
    id: 14,
    name: 'Temperance',
    image: require('../assets/cards/14-Temperance.png'),
    meaning: 'Balance, moderation, patience, finding meaning, purpose',
    reversed: 'Imbalance, extremism, excess, lack of harmony',
    description:
      'Temperance represents balance and moderation. It encourages finding the middle path and exercising patience.',
  },
  {
    id: 15,
    name: 'The Devil',
    image: require('../assets/cards/15-TheDevil.png'),
    meaning: 'Bondage, materialism, playfulness, detachment, personal power',
    reversed: 'Detachment, release, restoring control, freedom',
    description:
      'The Devil represents bondage and obsession. It can also represent sexuality and raw energy when not controlled.',
  },
  {
    id: 16,
    name: 'The Tower',
    image: require('../assets/cards/16-TheTower.png'),
    meaning: 'Sudden change, upheaval, chaos, revelation, awakening',
    reversed: 'Averted disaster, delayed change, resisting change',
    description:
      'The Tower represents sudden and dramatic change. It is a necessary destructive force that clears away illusions.',
  },
  {
    id: 17,
    name: 'The Star',
    image: require('../assets/cards/17-TheStar.png'),
    meaning: 'Hope, faith, renewal, spirituality, healing, clarity',
    reversed: 'Lack of faith, despair, discouragement, abandonment',
    description:
      'The Star brings hope and healing. It represents faith, clarity and a bright future after difficult times.',
  },
  {
    id: 18,
    name: 'The Moon',
    image: require('../assets/cards/18-TheMoon.png'),
    meaning: 'Illusion, fear, anxiety, subconscious, intuition, dreams',
    reversed: 'Clarity, release of fear, truth prevailing, inner peace',
    description:
      'The Moon represents illusion and the subconscious. It suggests trusting your intuition as reality may not be what it seems.',
  },
  {
    id: 19,
    name: 'The Sun',
    image: require('../assets/cards/19-TheSun.png'),
    meaning: 'Success, vitality, warmth, happiness, achievement, joy',
    reversed: 'Temporary setback, clouded future, depression',
    description:
      'The Sun represents success, happiness, and clarity. It brings warmth, light, and positive energy to all situations.',
  },
  {
    id: 20,
    name: 'Judgement',
    image: require('../assets/cards/20-Judgement.png'),
    meaning: 'Awakening, renewal, reckoning, absolution, inner calling',
    reversed: 'Self-doubt, inner critic, inability to forgive',
    description:
      'Judgement represents awakening to a higher calling. It is a time of reckoning and major life decisions.',
  },
  {
    id: 21,
    name: 'The World',
    image: require('../assets/cards/21-TheWorld.png'),
    meaning: 'Completion, accomplishment, fulfillment, wholeness, unity',
    reversed: 'Incompleteness, lack of closure, seeking external validation',
    description:
      'The World represents completion and fulfillment. It symbolizes the end of one cycle and readiness for the next.',
  },
];

// Minor Arcana - Swords (Air, Intellect, Communication)
const SWORDS = [
  {
    id: 0,
    name: 'Ace of Swords',
    image: require('../assets/cards/Swords01.png'),
    meaning: 'Truth, clarity, new ideas, breakthrough',
    reversed: 'Confusion, deception, misunderstanding',
    description: 'A new idea or truth emerges. Mental clarity and breakthrough thinking.',
  },
  {
    id: 1,
    name: 'Two of Swords',
    image: require('../assets/cards/Swords02.png'),
    meaning: 'Stalemate, indecision, difficult choice',
    reversed: 'Resolution, acceptance, moving forward',
    description: 'A difficult decision or stalemate situation requiring balance.',
  },
  {
    id: 2,
    name: 'Three of Swords',
    image: require('../assets/cards/Swords03.png'),
    meaning: 'Heartbreak, sorrow, emotional pain',
    reversed: 'Healing, forgiveness, moving past pain',
    description: 'A period of sadness or difficult communication.',
  },
  {
    id: 3,
    name: 'Four of Swords',
    image: require('../assets/cards/Swords04.png'),
    meaning: 'Rest, recovery, contemplation, peace',
    reversed: 'Restlessness, unable to rest',
    description: 'A time for rest, recovery, and peaceful reflection.',
  },
  {
    id: 4,
    name: 'Five of Swords',
    image: require('../assets/cards/Swords05.png'),
    meaning: 'Conflict, defeat, humiliation',
    reversed: 'Reconciliation, truce, moving past conflict',
    description: 'A conflict or argument with lingering consequences.',
  },
  {
    id: 5,
    name: 'Six of Swords',
    image: require('../assets/cards/Swords06.png'),
    meaning: 'Transition, travel, moving away, progress',
    reversed: 'Stuck, unable to move forward',
    description: 'Movement toward calmer waters and new beginnings.',
  },
  {
    id: 6,
    name: 'Seven of Swords',
    image: require('../assets/cards/Swords07.png'),
    meaning: 'Deception, theft, betrayal, trickery',
    reversed: 'Honesty, coming clean, reckoning',
    description: 'Deception or secrecy that may need to be addressed.',
  },
  {
    id: 7,
    name: 'Eight of Swords',
    image: require('../assets/cards/Swords08.png'),
    meaning: 'Restriction, confusion, powerlessness',
    reversed: 'Freedom, release, breaking free',
    description: 'Feeling trapped or restricted by circumstances.',
  },
  {
    id: 8,
    name: 'Nine of Swords',
    image: require('../assets/cards/Swords09.png'),
    meaning: 'Anxiety, worry, nightmares, despair',
    reversed: 'Hope, easing worry, finding peace',
    description: 'Mental anguish and anxious thoughts.',
  },
  {
    id: 9,
    name: 'Ten of Swords',
    image: require('../assets/cards/Swords10.png'),
    meaning: 'Betrayal, ruin, deep cuts, endings',
    reversed: 'Recovery, beginning to heal, moving on',
    description: 'An ending or painful conclusion, but with hope for renewal.',
  },
  {
    id: 10,
    name: 'Page of Swords',
    image: require('../assets/cards/Swords11.png'),
    meaning: 'Curiosity, investigation, new ideas',
    reversed: 'Gossip, deception, frivolous',
    description: 'A messenger or young person representing ideas and communication.',
  },
  {
    id: 11,
    name: 'Knight of Swords',
    image: require('../assets/cards/Swords12.png'),
    meaning: 'Truth, logic, determination, action',
    reversed: 'Aggressive, reckless, impulsive',
    description: 'A defender of truth with keen intellect and directness.',
  },
  {
    id: 12,
    name: 'Queen of Swords',
    image: require('../assets/cards/Swords13.png'),
    meaning: 'Clarity, honesty, independence, perception',
    reversed: 'Bitterness, cold, harsh',
    description: 'A woman of intelligence, independence, and truth-seeking.',
  },
  {
    id: 13,
    name: 'King of Swords',
    image: require('../assets/cards/Swords14.png'),
    meaning: 'Authority, leadership, intellectual power, justice',
    reversed: 'Tyranny, manipulation, cold judgment',
    description: 'A leader of intellect and authority with keen judgment.',
  },
];

// Minor Arcana - Wands (Fire, Passion, Energy)
const WANDS = [
  {
    id: 0,
    name: 'Ace of Wands',
    image: require('../assets/cards/Wands01.png'),
    meaning: 'Inspiration, new opportunities, growth, passion',
    reversed: 'Lack of inspiration, delays, hesitation',
    description: 'A burst of creative energy and new beginnings.',
  },
  {
    id: 1,
    name: 'Two of Wands',
    image: require('../assets/cards/Wands02.png'),
    meaning: 'Planning, making decisions, leaving home',
    reversed: 'Indecision, uncertainty, lack of planning',
    description: 'Contemplating future plans and possibilities.',
  },
  {
    id: 2,
    name: 'Three of Wands',
    image: require('../assets/cards/Wands03.png'),
    meaning: 'Foresight, leadership, growth, expansion',
    reversed: 'Lack of foresight, poor planning, setbacks',
    description: 'Progress and expansion of creative endeavors.',
  },
  {
    id: 3,
    name: 'Four of Wands',
    image: require('../assets/cards/Wands04.png'),
    meaning: 'Celebration, joy, harmony, community',
    reversed: 'Lack of closure, unfinished business',
    description: 'A time of celebration and positive achievements.',
  },
  {
    id: 4,
    name: 'Five of Wands',
    image: require('../assets/cards/Wands05.png'),
    meaning: 'Conflict, competition, tension, diversity',
    reversed: 'Harmony, peace, resolution',
    description: 'Competition or conflicting ideas that create tension.',
  },
  {
    id: 5,
    name: 'Six of Wands',
    image: require('../assets/cards/Wands06.png'),
    meaning: 'Success, recognition, praise, victory',
    reversed: 'Failure, lack of recognition, doubt',
    description: 'Achievement and public recognition.',
  },
  {
    id: 6,
    name: 'Seven of Wands',
    image: require('../assets/cards/Wands07.png'),
    meaning: 'Perseverance, protection, courage, challenge',
    reversed: 'Giving up, overwhelmed, defensive',
    description: 'Standing your ground despite opposition.',
  },
  {
    id: 7,
    name: 'Eight of Wands',
    image: require('../assets/cards/Wands08.png'),
    meaning: 'Speed, momentum, action, movement',
    reversed: 'Delays, slow progress, sluggish',
    description: 'Rapid progress and swift movement forward.',
  },
  {
    id: 8,
    name: 'Nine of Wands',
    image: require('../assets/cards/Wands09.png'),
    meaning: 'Resilience, courage, persistence, test of faith',
    reversed: 'Exhaustion, giving up, lack of persistence',
    description: 'Strength and determination to overcome challenges.',
  },
  {
    id: 9,
    name: 'Ten of Wands',
    image: require('../assets/cards/Wands10.png'),
    meaning: 'Burden, responsibility, hard work, completion',
    reversed: 'Lack of responsibility, inability to follow through',
    description: 'Heavy load of responsibilities nearing completion.',
  },
  {
    id: 10,
    name: 'Page of Wands',
    image: require('../assets/cards/Wands11.png'),
    meaning: 'Enthusiasm, exploration, discovery, free spirit',
    reversed: 'Lack of direction, scattered, unreliable',
    description: 'An enthusiastic explorer of creative possibilities.',
  },
  {
    id: 11,
    name: 'Knight of Wands',
    image: require('../assets/cards/Wands12.png'),
    meaning: 'Energy, passion, adventure, courage',
    reversed: 'Reckless, hasty, impulsive',
    description: 'A passionate adventurer full of creative fire.',
  },
  {
    id: 12,
    name: 'Queen of Wands',
    image: require('../assets/cards/Wands13.png'),
    meaning: 'Independence, confidence, charisma, passion',
    reversed: 'Jealousy, insecurity, overbearing',
    description: 'A confident, charismatic woman of creative power.',
  },
  {
    id: 13,
    name: 'King of Wands',
    image: require('../assets/cards/Wands14.png'),
    meaning: 'Leadership, vision, entrepreneurship, passion',
    reversed: 'Tyranny, excessive control, anger',
    description: 'A visionary leader of creative enterprise.',
  },
];

// Minor Arcana - Cups (Water, Emotion, Intuition)
const CUPS = [
  {
    id: 0,
    name: 'Ace of Cups',
    image: require('../assets/cards/Cups01.png'),
    meaning: 'Love, joy, new relationship, compassion',
    reversed: 'Heartbreak, emotional loss, blocked feelings',
    description: 'An outpouring of love and emotional fulfillment.',
  },
  {
    id: 1,
    name: 'Two of Cups',
    image: require('../assets/cards/Cups02.png'),
    meaning: 'Partnership, mutual attraction, unity, balance',
    reversed: 'Separation, discord, imbalance',
    description: 'A deep emotional connection and mutual respect.',
  },
  {
    id: 2,
    name: 'Three of Cups',
    image: require('../assets/cards/Cups03.png'),
    meaning: 'Celebration, friendship, community, gatherings',
    reversed: 'Loneliness, isolation, disconnection',
    description: 'Joy, celebration, and positive social connections.',
  },
  {
    id: 3,
    name: 'Four of Cups',
    image: require('../assets/cards/Cups04.png'),
    meaning: 'Apathy, meditation, reevaluation, contemplation',
    reversed: 'Acceptance, new opportunity, moving forward',
    description: 'A period of reflection or dissatisfaction.',
  },
  {
    id: 4,
    name: 'Five of Cups',
    image: require('../assets/cards/Cups05.png'),
    meaning: 'Grief, loss, sadness, mourning, regret',
    reversed: 'Healing, forgiveness, moving past loss',
    description: 'Emotional loss and the process of mourning.',
  },
  {
    id: 5,
    name: 'Six of Cups',
    image: require('../assets/cards/Cups06.png'),
    meaning: 'Nostalgia, innocence, kindness, reunion',
    reversed: 'Sadness, resentment, holding onto the past',
    description: 'Happy memories and emotional innocence.',
  },
  {
    id: 6,
    name: 'Seven of Cups',
    image: require('../assets/cards/Cups07.png'),
    meaning: 'Choices, illusion, wishful thinking, temptation',
    reversed: 'Clarity, focus, seeing through illusions',
    description: 'Many options but some may be illusions.',
  },
  {
    id: 7,
    name: 'Eight of Cups',
    image: require('../assets/cards/Cups08.png'),
    meaning: 'Abandonment, withdrawal, leaving, moving on',
    reversed: 'Inability to let go, stagnation',
    description: 'Walking away from something that no longer serves.',
  },
  {
    id: 8,
    name: 'Nine of Cups',
    image: require('../assets/cards/Cups09.png'),
    meaning: 'Satisfaction, contentment, pleasure, wish fulfillment',
    reversed: 'Dissatisfaction, greed, lack of gratitude',
    description: 'Emotional fulfillment and satisfaction.',
  },
  {
    id: 9,
    name: 'Ten of Cups',
    image: require('../assets/cards/Cups10.png'),
    meaning: 'Harmony, happiness, family, home, completion',
    reversed: 'Conflict, broken family, disharmony',
    description: 'Emotional harmony and family contentment.',
  },
  {
    id: 10,
    name: 'Page of Cups',
    image: require('../assets/cards/Cups11.png'),
    meaning: 'Creativity, idealism, sensitivity, new feelings',
    reversed: 'Immaturity, irresponsibility, emotional instability',
    description: 'An artistic, sensitive soul open to new emotions.',
  },
  {
    id: 11,
    name: 'Knight of Cups',
    image: require('../assets/cards/Cups12.png'),
    meaning: 'Romance, charm, idealism, sensitivity',
    reversed: 'Unrealistic, deceptive, dishonest',
    description: 'A romantic dreamer of emotional depth.',
  },
  {
    id: 12,
    name: 'Queen of Cups',
    image: require('../assets/cards/Cups13.png'),
    meaning: 'Intuition, nurturing, compassion, calm',
    reversed: 'Emotional insecurity, dependency, coldness',
    description: 'An intuitive, nurturing woman of emotional wisdom.',
  },
  {
    id: 13,
    name: 'King of Cups',
    image: require('../assets/cards/Cups14.png'),
    meaning: 'Emotional balance, diplomacy, control, power',
    reversed: 'Emotional turmoil, lack of control',
    description: 'A balanced, wise leader of emotional intelligence.',
  },
];

// Minor Arcana - Pentacles (Earth, Material, Physical)
const PENTACLES = [
  {
    id: 0,
    name: 'Ace of Pentacles',
    image: require('../assets/cards/Pentacles01.png'),
    meaning: 'New opportunity, prosperity, abundance, luck',
    reversed: 'Loss, scarcity, missed opportunity',
    description: 'A new material opportunity or financial blessing.',
  },
  {
    id: 1,
    name: 'Two of Pentacles',
    image: require('../assets/cards/Pentacles02.png'),
    meaning: 'Balance, juggling, adaptability, time management',
    reversed: 'Imbalance, confusion, overwhelmed',
    description: 'Balancing multiple responsibilities.',
  },
  {
    id: 2,
    name: 'Three of Pentacles',
    image: require('../assets/cards/Pentacles03.png'),
    meaning: 'Collaboration, teamwork, learning, skill',
    reversed: 'Lack of teamwork, poor craftsmanship, mediocrity',
    description: 'Skilled collaboration and shared success.',
  },
  {
    id: 3,
    name: 'Four of Pentacles',
    image: require('../assets/cards/Pentacles04.png'),
    meaning: 'Stability, security, control, possession',
    reversed: 'Greed, stinginess, selfishness',
    description: 'Holding onto security and material possessions.',
  },
  {
    id: 4,
    name: 'Five of Pentacles',
    image: require('../assets/cards/Pentacles05.png'),
    meaning: 'Hardship, poverty, abandonment, material loss',
    reversed: 'Recovery, endurance, assistance',
    description: 'A period of material difficulty or hardship.',
  },
  {
    id: 5,
    name: 'Six of Pentacles',
    image: require('../assets/cards/Pentacles06.png'),
    meaning: 'Generosity, charity, sharing, fairness',
    reversed: 'Selfishness, stinginess, unfairness',
    description: 'Generosity and fair distribution of resources.',
  },
  {
    id: 6,
    name: 'Seven of Pentacles',
    image: require('../assets/cards/Pentacles07.png'),
    meaning: 'Assessment, investment, patience, growth',
    reversed: 'Lack of investment, impatience, no progress',
    description: 'Evaluating progress and investments.',
  },
  {
    id: 7,
    name: 'Eight of Pentacles',
    image: require('../assets/cards/Pentacles08.png'),
    meaning: 'Mastery, apprenticeship, learning, skill development',
    reversed: 'Lack of focus, procrastination, laziness',
    description: 'Dedication to learning and mastering a craft.',
  },
  {
    id: 8,
    name: 'Nine of Pentacles',
    image: require('../assets/cards/Pentacles09.png'),
    meaning: 'Luxury, abundance, self-sufficiency, beauty',
    reversed: 'Financial loss, dependence, emptiness',
    description: 'Material comfort and self-sufficiency achieved.',
  },
  {
    id: 9,
    name: 'Ten of Pentacles',
    image: require('../assets/cards/Pentacles10.png'),
    meaning: 'Wealth, legacy, family, security, inheritance',
    reversed: 'Loss of wealth, family discord, instability',
    description: 'Lasting wealth and family prosperity.',
  },
  {
    id: 10,
    name: 'Page of Pentacles',
    image: require('../assets/cards/Pentacles11.png'),
    meaning: 'Ambition, curiosity, studious, motivated',
    reversed: 'Lack of discipline, laziness, lack of ambition',
    description: 'An ambitious student eager to learn and improve.',
  },
  {
    id: 11,
    name: 'Knight of Pentacles',
    image: require('../assets/cards/Pentacles12.png'),
    meaning: 'Diligence, hard work, responsibility, conservatism',
    reversed: 'Laziness, irresponsibility, lack of progress',
    description: 'A hardworking, responsible person of steady progress.',
  },
  {
    id: 12,
    name: 'Queen of Pentacles',
    image: require('../assets/cards/Pentacles13.png'),
    meaning: 'Nurturing, abundance, practicality, security',
    reversed: 'Insecurity, instability, lack of support',
    description: 'A practical, nurturing woman of abundance.',
  },
  {
    id: 13,
    name: 'King of Pentacles',
    image: require('../assets/cards/Pentacles14.png'),
    meaning: 'Wealth, abundance, leadership, security',
    reversed: 'Greed, corruption, financial loss',
    description: 'A successful, abundant leader of material power.',
  },
];

type Card = (typeof MAJOR_ARCANA)[0] | (typeof SWORDS)[0] | (typeof WANDS)[0] | (typeof CUPS)[0] | (typeof PENTACLES)[0];

export { MAJOR_ARCANA, SWORDS, WANDS, CUPS, PENTACLES };
export type { Card };

export function TarotScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [selectedSuit, setSelectedSuit] = useState<CardSuit>('major');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showModal, setShowModal] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = isDarkMode ? '#ef4444' : '#3b82f6';

  const getCardData = () => {
    switch (selectedSuit) {
      case 'swords':
        return SWORDS;
      case 'wands':
        return WANDS;
      case 'cups':
        return CUPS;
      case 'pentacles':
        return PENTACLES;
      default:
        return MAJOR_ARCANA;
    }
  };

  const getSuitName = () => {
    switch (selectedSuit) {
      case 'swords':
        return '⚔️ Swords';
      case 'wands':
        return '🔥 Wands';
      case 'cups':
        return '🍷 Cups';
      case 'pentacles':
        return '💎 Pentacles';
      default:
        return 'Major Arcana';
    }
  };

  const handleCardPress = (card: Card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const cards = getCardData();

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>Tarot</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          {getSuitName()}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabBar, { backgroundColor: cardBg, borderBottomColor: mutedColor }]}>
        {(['major', 'swords', 'wands', 'cups', 'pentacles'] as const).map((suit) => (
          <TouchableOpacity
            key={suit}
            style={[
              styles.tab,
              selectedSuit === suit && { borderBottomColor: '#8b5cf6', borderBottomWidth: 3 },
            ]}
            onPress={() => setSelectedSuit(suit)}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: selectedSuit === suit ? '#8b5cf6' : mutedColor },
              ]}
            >
              {suit === 'major' ? '✨' : suit === 'swords' ? '⚔️' : suit === 'wands' ? '🔥' : suit === 'cups' ? '🍷' : '💎'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards Grid */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardGridItem, { backgroundColor: cardBg }]}
              onPress={() => handleCardPress(card)}
              activeOpacity={0.7}
            >
              {'image' in card && (
                <Image
                  source={(card as any).image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}
              {!('image' in card) && (
                <View style={styles.cardPlaceholder}>
                  <Text style={styles.cardPlaceholderText}>{selectedSuit === 'swords' ? '⚔️' : selectedSuit === 'wands' ? '🔥' : selectedSuit === 'cups' ? '🍷' : '💎'}</Text>
                </View>
              )}
              <Text style={[styles.cardLabel, { color: textColor }]} numberOfLines={2}>
                {card.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Card Detail Modal */}
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
              {selectedCard && (
                <>
                  {/* Card Image */}
                  <Image
                    source={selectedCard.image}
                    style={styles.detailCardImage}
                    resizeMode="contain"
                  />

                  {/* Card Name */}
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    {selectedCard.name}
                  </Text>

                  {/* Card Number */}
                  <Text style={[styles.cardNumber, { color: mutedColor }]}>
                    Card {selectedCard.id}
                  </Text>

                  {/* Description */}
                  <View style={[styles.section, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Meaning
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedCard.description}
                    </Text>
                  </View>

                  {/* Upright Meaning */}
                  <View style={[styles.section, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      ⬆ Upright
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedCard.meaning}
                    </Text>
                  </View>

                  {/* Reversed Meaning */}
                  <View style={[styles.section, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                    <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>
                      ⬇ Reversed
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedCard.reversed}
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
    padding: 12,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardGridItem: {
    width: '32%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardLabel: {
    padding: 8,
    fontSize: 11,
    fontWeight: '600',
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
  detailCardImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 12,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardNumber: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardPlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholderText: {
    fontSize: 40,
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
