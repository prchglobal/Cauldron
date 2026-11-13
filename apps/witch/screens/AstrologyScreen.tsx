import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppodealService from '../AppodealService';
import { ToastService } from '../services/ToastService';

const CELESTIAL_POINTS = [
  // Luminaries
  { name: 'Sun', symbol: '☉', category: 'luminary', meaning: 'Self, identity, core essence' },
  { name: 'Moon', symbol: '☽', category: 'luminary', meaning: 'Emotions, instincts, inner self' },

  // Inner Planets
  { name: 'Mercury', symbol: '☿', category: 'planet', meaning: 'Communication, intellect' },
  { name: 'Venus', symbol: '♀', category: 'planet', meaning: 'Love, beauty, values' },
  { name: 'Mars', symbol: '♂', category: 'planet', meaning: 'Action, passion, drive' },
  { name: 'Jupiter', symbol: '♃', category: 'planet', meaning: 'Expansion, luck, growth' },

  // Outer Planets
  { name: 'Saturn', symbol: '♄', category: 'planet', meaning: 'Discipline, structure, responsibility' },
  { name: 'Uranus', symbol: '♅', category: 'planet', meaning: 'Revolution, innovation, sudden change' },
  { name: 'Neptune', symbol: '♆', category: 'planet', meaning: 'Dreams, intuition, spirituality' },
  { name: 'Pluto', symbol: '♇', category: 'planet', meaning: 'Transformation, power, rebirth' },

  // Nodes & Points
  { name: 'North Node', symbol: '☊', category: 'point', meaning: 'Life purpose, karmic path forward' },
  { name: 'South Node', symbol: '☋', category: 'point', meaning: 'Past life, karmic talents' },
  { name: 'Midheaven', symbol: 'MC', category: 'point', meaning: 'Career, public image, aspirations' },
  { name: 'Imum Coeli', symbol: 'IC', category: 'point', meaning: 'Home, roots, private self' },
  { name: 'Vertex', symbol: 'Vx', category: 'point', meaning: 'Fated encounters, destiny points' },
  { name: 'Chiron', symbol: '⚷', category: 'point', meaning: 'Wound, healing, teacher' },
  { name: 'Part of Fortune', symbol: '⊗', category: 'point', meaning: 'Luck, success, natural talents' },
  { name: 'Descendant', symbol: 'Dsc', category: 'point', meaning: 'Relationships, partnerships' },
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

// Time Zones
const TIMEZONES = [
  { label: 'UTC-12:00', value: -12, name: 'Baker Island' },
  { label: 'UTC-11:00', value: -11, name: 'American Samoa' },
  { label: 'UTC-10:00', value: -10, name: 'Hawaii' },
  { label: 'UTC-09:30', value: -9.5, name: 'Marquesas' },
  { label: 'UTC-09:00', value: -9, name: 'Alaska' },
  { label: 'UTC-08:00', value: -8, name: 'Pacific Time' },
  { label: 'UTC-07:00', value: -7, name: 'Mountain Time' },
  { label: 'UTC-06:00', value: -6, name: 'Central Time' },
  { label: 'UTC-05:00', value: -5, name: 'Eastern Time' },
  { label: 'UTC-04:30', value: -4.5, name: 'Venezuela' },
  { label: 'UTC-04:00', value: -4, name: 'Atlantic Time' },
  { label: 'UTC-03:30', value: -3.5, name: 'Newfoundland' },
  { label: 'UTC-03:00', value: -3, name: 'Argentina' },
  { label: 'UTC-02:00', value: -2, name: 'Mid-Atlantic' },
  { label: 'UTC-01:00', value: -1, name: 'Azores' },
  { label: 'UTC±00:00', value: 0, name: 'GMT/London' },
  { label: 'UTC+01:00', value: 1, name: 'Central European' },
  { label: 'UTC+02:00', value: 2, name: 'Eastern European' },
  { label: 'UTC+03:00', value: 3, name: 'Moscow' },
  { label: 'UTC+03:30', value: 3.5, name: 'Iran' },
  { label: 'UTC+04:00', value: 4, name: 'Gulf' },
  { label: 'UTC+04:30', value: 4.5, name: 'Afghanistan' },
  { label: 'UTC+05:00', value: 5, name: 'Pakistan' },
  { label: 'UTC+05:30', value: 5.5, name: 'India' },
  { label: 'UTC+05:45', value: 5.75, name: 'Nepal' },
  { label: 'UTC+06:00', value: 6, name: 'Bangladesh' },
  { label: 'UTC+06:30', value: 6.5, name: 'Myanmar' },
  { label: 'UTC+07:00', value: 7, name: 'Indochina' },
  { label: 'UTC+08:00', value: 8, name: 'Singapore' },
  { label: 'UTC+08:45', value: 8.75, name: 'Eucla' },
  { label: 'UTC+09:00', value: 9, name: 'Japan/Korea' },
  { label: 'UTC+09:30', value: 9.5, name: 'Australia Central' },
  { label: 'UTC+10:00', value: 10, name: 'Sydney' },
  { label: 'UTC+10:30', value: 10.5, name: 'Australia South' },
  { label: 'UTC+11:00', value: 11, name: 'Solomon Islands' },
  { label: 'UTC+12:00', value: 12, name: 'New Zealand' },
  { label: 'UTC+12:45', value: 12.75, name: 'Chatham Islands' },
  { label: 'UTC+13:00', value: 13, name: 'Samoa' },
  { label: 'UTC+14:00', value: 14, name: 'Kiribati' },
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

// Birth Chart Calculation Functions
const calculateSunSign = (date: Date, isSidereal: boolean): string => {
  // Adjust date for sidereal (shift back by ~24 days)
  const adjustedDate = new Date(date);
  if (isSidereal) {
    adjustedDate.setDate(adjustedDate.getDate() - 24);
  }

  const month = adjustedDate.getMonth() + 1;
  const day = adjustedDate.getDate();

  // Tropical zodiac dates
  const tropicalSigns: Array<{name: string; start: [number, number]; end: [number, number]}> = [
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', start: [6, 21], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
    { name: 'Capricorn', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
  ];

  for (const sign of tropicalSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign.name;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }
  }
  return 'Pisces';
};

const calculateMoonSign = (date: Date, isSidereal: boolean): string => {
  // Simplified moon sign calculation based on lunar cycle
  const adjustedDate = new Date(date);
  if (isSidereal) {
    adjustedDate.setDate(adjustedDate.getDate() - 24);
  }

  const yearStart = new Date(adjustedDate.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((adjustedDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  const lunarDay = (dayOfYear * 12.37) % 29.5; // Approximate lunar cycle
  const moonSignIndex = Math.floor((lunarDay / 29.5) * 12);

  const moonSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  return moonSigns[moonSignIndex];
};

const calculateRisingSign = (birthTime: Date | null, isSidereal: boolean): string => {
  if (!birthTime) {
    return 'Requires birth time (noon estimate)';
  }

  // Simplified rising sign based on birth time
  let risingIndex = Math.floor((birthTime.getHours() / 24) * 12);

  // Apply sidereal shift (shift by 2 signs)
  if (isSidereal) {
    risingIndex = (risingIndex - 2 + 12) % 12;
  }

  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  return signs[risingIndex % 12];
};

const calculateHouses = (birthTime: Date | null, isSidereal: boolean): Record<number, string> => {
  const houses: Record<number, string> = {};

  if (!birthTime) {
    for (let i = 1; i <= 12; i++) {
      houses[i] = 'Aries'; // Placeholder
    }
    return houses;
  }

  const hour = birthTime.getHours();
  let baseHouseIndex = Math.floor((hour / 24) * 12);

  // Apply sidereal shift (shift by 2 signs)
  if (isSidereal) {
    baseHouseIndex = (baseHouseIndex - 2 + 12) % 12;
  }

  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  for (let i = 1; i <= 12; i++) {
    const signIndex = (baseHouseIndex + i - 1) % 12;
    houses[i] = signs[signIndex];
  }

  return houses;
};

// Helper function to get day of year (1-366)
const getDayOfYear = (date: Date): number => {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// Helper function to get zodiac sign index (0-11) from date
const calculateSunSignIndex = (date: Date, isSidereal: boolean): number => {
  const adjustedDate = new Date(date);
  if (isSidereal) {
    adjustedDate.setDate(adjustedDate.getDate() - 24);
  }

  const month = adjustedDate.getMonth() + 1;
  const day = adjustedDate.getDate();

  const tropicalSigns: Array<{ name: string; start: [number, number]; end: [number, number] }> = [
    { name: 'Aries', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', start: [6, 21], end: [7, 22] },
    { name: 'Leo', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
    { name: 'Capricorn', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', start: [2, 19], end: [3, 20] },
  ];

  for (let i = 0; i < tropicalSigns.length; i++) {
    const sign = tropicalSigns[i];
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return i;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return i;
      }
    }
  }
  return 11; // Pisces
};

// Helper function to get moon sign index (0-11)
const calculateMoonSignIndex = (date: Date, isSidereal: boolean): number => {
  const adjustedDate = new Date(date);
  if (isSidereal) {
    adjustedDate.setDate(adjustedDate.getDate() - 24);
  }

  const dayOfYear = getDayOfYear(adjustedDate);
  const lunarDay = (dayOfYear * 12.37) % 29.5;
  return Math.floor((lunarDay / 29.5) * 12) % 12;
};

// Calculate any celestial point sign based on name and birth data
const calculateCelestialPoint = (
  pointName: string,
  birthDate: Date,
  birthTime: Date | null,
  isSidereal: boolean
): string => {
  const dayOfYear = getDayOfYear(birthDate);
  const hours = birthTime ? birthTime.getHours() + birthTime.getMinutes() / 60 : 12;
  const year = birthDate.getFullYear();

  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  let signIndex = 0;

  switch (pointName) {
    // Luminaries (already handled separately, but included for completeness)
    case 'Sun':
      return calculateSunSign(birthDate, isSidereal);

    case 'Moon':
      return calculateMoonSign(birthDate, isSidereal);

    // Inner Planets
    case 'Mercury':
      // Mercury moves ~1° per day, completes zodiac in ~88 days
      signIndex = Math.floor((dayOfYear * 4.09) % 12);
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Venus':
      // Venus moves ~1.6° per day, completes zodiac in ~225 days
      signIndex = Math.floor((dayOfYear * 1.6) % 12);
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Mars':
      // Mars moves ~0.5° per day, completes zodiac in ~687 days
      signIndex = Math.floor((dayOfYear * 0.52) % 12);
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Jupiter':
      // Jupiter stays ~1 year per sign
      signIndex = Math.floor((dayOfYear / 30) % 12);
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    // Outer Planets
    case 'Saturn':
      // Saturn stays ~2.5 years per sign
      signIndex = Math.floor(((year % 30) / 2.5)) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Uranus':
      // Uranus stays ~7 years per sign
      signIndex = Math.floor((year % 84) / 7) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Neptune':
      // Neptune stays ~14 years per sign
      signIndex = Math.floor((year % 165) / 14) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'Pluto':
      // Pluto stays 12-30 years per sign
      signIndex = Math.floor((year % 248) / 21) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    // Lunar Nodes
    case 'North Node':
      // North Node moves backwards, ~18.6 year cycle
      signIndex = 11 - Math.floor((dayOfYear * 0.053) % 12);
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    case 'South Node':
      // Opposite of North Node
      const northIndex = 11 - Math.floor((dayOfYear * 0.053) % 12);
      signIndex = (northIndex + 6) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    // Chiron
    case 'Chiron':
      // Chiron has irregular orbit, ~50 year cycle
      signIndex = Math.floor((year % 50) / 4.2) % 12;
      return signs[(signIndex + (isSidereal ? 11 : 0)) % 12];

    // Angle Points (require birth time)
    case 'Midheaven':
      if (!birthTime) return 'Requires birth time';
      signIndex = Math.floor((hours / 2) % 12);
      return signs[(signIndex + (isSidereal ? 10 : 0)) % 12];

    case 'Imum Coeli':
      if (!birthTime) return 'Requires birth time';
      signIndex = Math.floor((hours / 2) % 12);
      const icIndex = (signIndex + 6) % 12;
      return signs[(icIndex + (isSidereal ? 10 : 0)) % 12];

    case 'Descendant':
      if (!birthTime) return 'Requires birth time';
      const risingIndex = Math.floor((hours / 24) * 12);
      signIndex = (risingIndex + 6) % 12;
      return signs[(signIndex + (isSidereal ? 10 : 0)) % 12];

    case 'Vertex':
      if (!birthTime) return 'Requires birth time';
      signIndex = Math.floor(((hours + 4) / 2) % 12);
      return signs[(signIndex + (isSidereal ? 10 : 0)) % 12];

    // Part of Fortune
    case 'Part of Fortune':
      if (!birthTime) return 'Requires birth time';
      const sunIdx = calculateSunSignIndex(birthDate, isSidereal);
      const moonIdx = calculateMoonSignIndex(birthDate, isSidereal);
      const ascIdx = Math.floor((hours / 24) * 12);
      signIndex = (ascIdx + moonIdx - sunIdx + 12) % 12;
      return signs[signIndex];

    default:
      return 'Unknown';
  }
};

// Planetary effects by house and sign
const getPlanetaryEffect = (houseNumber: number, sign: string): string => {
  const effects: Record<number, Record<string, string>> = {
    1: {
      aries: 'Direct, courageous, and pioneering. You project confidence and leadership energy wherever you go.',
      taurus: 'Grounded and stable. You present yourself as reliable, practical, and possessing a calm demeanor.',
      gemini: 'Communicative and curious. You appear adaptable, witty, and intellectually engaged with the world.',
      cancer: 'Sensitive and intuitive. You come across as nurturing, emotional, and deeply connected to your roots.',
      leo: 'Charismatic and bold. You naturally command attention with warmth, creativity, and self-assurance.',
      virgo: 'Analytical and meticulous. You appear organized, detail-oriented, and dependable in all matters.',
      libra: 'Charming and diplomatic. You present yourself as fair, social, and aesthetically aware.',
      scorpio: 'Intense and magnetic. You project mystery, passion, and a powerful presence.',
      sagittarius: 'Optimistic and adventurous. You appear enthusiastic, open-minded, and eager to explore.',
      capricorn: 'Serious and ambitious. You come across as responsible, disciplined, and goal-oriented.',
      aquarius: 'Innovative and independent. You appear progressive, unique, and unconventional.',
      pisces: 'Dreamy and artistic. You seem compassionate, imaginative, and spiritually inclined.',
    },
    2: {
      aries: 'You pursue wealth and possessions with courage and boldness. Financial ventures are direct and aggressive.',
      taurus: 'Stable financial foundation with steady accumulation. You attract material security and comfort.',
      gemini: 'Flexible with finances but can scatter resources. Multiple income sources appeal to you.',
      cancer: 'Protective of assets for emotional security. Homes and family possessions hold great value.',
      leo: 'Generous with money, enjoying luxury and status symbols. Financial gains come through creative pursuits.',
      virgo: 'Careful and practical with finances. You budget wisely and attention to detail protects your wealth.',
      libra: 'Money comes through partnerships and aesthetics. You value beautiful possessions and social investments.',
      scorpio: 'Deep financial acumen with transformative wealth cycles. You excel at managing complex finances.',
      sagittarius: 'Expansive with money, optimistic about abundance. Luck often favors your financial ventures.',
      capricorn: 'Strategic and long-term focused with finances. Steady, disciplined wealth building is your strength.',
      aquarius: 'Unusual approaches to money and resources. Technology and innovation bring financial gains.',
      pisces: 'Intuitive but sometimes unrealistic about finances. Charitable giving matters more than accumulation.',
    },
    3: {
      aries: 'Direct, decisive communication. You speak with passion and confidence, often persuasive.',
      taurus: 'Steady communication style. You speak with authority and others trust your measured words.',
      gemini: 'Excellent communicators with varied interests. You enjoy learning and sharing diverse knowledge.',
      cancer: 'Emotional communication style, sensitive to others\' feelings. Family connections matter deeply.',
      leo: 'Expressive and dramatic in communication. You love to tell stories and hold the floor.',
      virgo: 'Precise and analytical communicators. You excel at explaining complex ideas clearly.',
      libra: 'Diplomatic and balanced in discussion. You easily mediate and find common ground.',
      scorpio: 'Intense, probing communication. You ask penetrating questions and uncover hidden truths.',
      sagittarius: 'Philosophical and expansive in conversation. You inspire with big ideas and optimism.',
      capricorn: 'Serious and practical in communication. Your words carry weight and authority.',
      aquarius: 'Progressive thinkers with innovative ideas. You communicate about the future and ideals.',
      pisces: 'Imaginative and poetic communication. You express yourself through intuition and creativity.',
    },
    4: {
      aries: 'Home is your retreat and power base. You defend family with fierceness and passion.',
      taurus: 'Deep roots and strong family ties. Your home is a sanctuary of comfort and beauty.',
      gemini: 'Multiple homes or moves throughout life. Family communication is frequent and important.',
      cancer: 'Extremely close family bonds. Home and family are the core of your emotional identity.',
      leo: 'Proud of family legacy. Your home reflects your status and you lead the family.',
      virgo: 'Home organized and practical. Family relationships are based on mutual service.',
      libra: 'Harmonious home environment with refined aesthetics. Social family gatherings are common.',
      scorpio: 'Deep family secrets and intense dynamics. Inheritance and family assets hold significance.',
      sagittarius: 'Diverse family connections and home moves. Family values emphasize freedom and growth.',
      capricorn: 'Strong family traditions and legacy. You honor ancestors and family responsibilities.',
      aquarius: 'Unconventional family arrangements. Your home is a hub for friends and community.',
      pisces: 'Emotional family ties and intuitive family bonds. Your home is a spiritual sanctuary.',
    },
    5: {
      aries: 'You love bold creative expression and risk-taking. Romance is passionate and direct.',
      taurus: 'Steady, loyal romantic connections. Children bring stability and joy to your life.',
      gemini: 'Playful, flirtatious approach to romance. Multiple creative interests and hobbies.',
      cancer: 'Deep emotional investment in romance and children. Protective of loved ones.',
      leo: 'Dramatic, expressive romance. Children bring pride and you love being in the spotlight.',
      virgo: 'Thoughtful approach to romance. Creative expression is practical and helpful.',
      libra: 'Harmonious romantic relationships. You appreciate beauty and artistic pursuits.',
      scorpio: 'Intense, transformative romance. Deep connections and hidden creative depths.',
      sagittarius: 'Free-spirited romance and adventurous love life. Children inspire philosophical growth.',
      capricorn: 'Serious, committed relationships. Creative ambitions are strategic and career-focused.',
      aquarius: 'Unconventional approach to romance. Creative expression is innovative and unique.',
      pisces: 'Romantic idealism and artistic sensitivity. Love is spiritual and transcendent.',
    },
    6: {
      aries: 'Active approach to health. Work is pursued with passion and competitive energy.',
      taurus: 'Steady health routines and practical wellness. Work provides stable income and comfort.',
      gemini: 'Varied work and health interests. You juggle multiple responsibilities with flexibility.',
      cancer: 'Emotional connection to work and health matters. Caretaking work appeals to you.',
      leo: 'Work involves leadership and creativity. Health reflects your status and vitality.',
      virgo: 'Meticulous about health and work. You excel in detail-oriented, service-oriented roles.',
      libra: 'Harmonious work relationships. Health improves through balance and partnership.',
      scorpio: 'Deep focus and research work. Hidden ailments require investigation and treatment.',
      sagittarius: 'Optimistic about health and work expansion. Multiple jobs or careers.',
      capricorn: 'Disciplined work approach with long-term career goals. Health through structure.',
      aquarius: 'Innovative work approaches. Health through progressive, unconventional methods.',
      pisces: 'Intuitive approach to work and health. Service work and creative healing appeal.',
    },
    7: {
      aries: 'Passionate partnerships with equal partners. Marriage brings adventure and excitement.',
      taurus: 'Stable, committed partnerships. You attract loyal, dependable partners.',
      gemini: 'Communicative partnerships. Multiple relationships or partners with similar intellects.',
      cancer: 'Emotionally intimate partnerships. Family-oriented relationships are essential.',
      leo: 'Bold, public partnerships. Your partner is admired and shares your spotlight.',
      virgo: 'Practical partnership focused on service and mutual improvement.',
      libra: 'Harmonious partnerships with balance and beauty. Marriage is important to you.',
      scorpio: 'Intense, transformative partnerships. Deep emotional and physical connections.',
      sagittarius: 'Adventurous partnerships with shared growth and exploration.',
      capricorn: 'Serious, long-term committed partnerships. Marriage is a career priority.',
      aquarius: 'Unconventional partnerships and marriages. Friendship is the foundation.',
      pisces: 'Spiritual, romantic partnerships. Your partner is idealized and deeply loved.',
    },
    8: {
      aries: 'Fearless approach to shared resources and transformation. Bold financial partnerships.',
      taurus: 'Inheritance and shared resources bring stability. You manage others\' money well.',
      gemini: 'Multiple financial partnerships. Inheritance brings communication opportunities.',
      cancer: 'Deep emotional bonds through shared resources. Family inheritances are significant.',
      leo: 'Shared resources bring pride and status. You manage others\' wealth generously.',
      virgo: 'Meticulous with other people\'s money. Tax and inheritance matters are handled well.',
      libra: 'Fair management of shared resources. Inheritances promote partnership and balance.',
      scorpio: 'Mastery of hidden wealth and shared resources. Inheritance transforms your life.',
      sagittarius: 'Expansive through inheritance and shared resources. Multiple financial partnerships.',
      capricorn: 'Strategic use of inheritance. Long-term wealth building through partnerships.',
      aquarius: 'Unusual inheritance or shared resources. Collective wealth management appeals.',
      pisces: 'Intuitive with shared resources. Inheritance brings spiritual or artistic opportunities.',
    },
    9: {
      aries: 'Bold pursuit of higher learning and adventure. Travel fuels your spirit.',
      taurus: 'Slow, steady pursuit of wisdom. Spiritual and philosophical roots run deep.',
      gemini: 'Love of learning and travel to gather knowledge. Multiple spiritual interests.',
      cancer: 'Intuitive spirituality and roots in ancestral wisdom. Travel is emotionally meaningful.',
      leo: 'Philosophical expression through teaching and travel. You inspire others.',
      virgo: 'Analytical approach to spirituality and higher learning. Practical wisdom matters.',
      libra: 'Fair-minded spirituality and cultural exploration. Travel broadens perspective.',
      scorpio: 'Deep spiritual exploration and hidden wisdom. Transformative travel experiences.',
      sagittarius: 'Born traveler and spiritual seeker. Higher learning is a life passion.',
      capricorn: 'Serious spiritual pursuits and long-term learning. Travel is career-focused.',
      aquarius: 'Progressive spirituality and innovative learning. Travel to unique destinations.',
      pisces: 'Mystical spirituality and imaginative learning. Transcendent travel experiences.',
    },
    10: {
      aries: 'Ambitious career with bold leadership. You pursue professional goals aggressively.',
      taurus: 'Stable career with long-term growth. You build reputation steadily and reliably.',
      gemini: 'Multiple careers or diverse professional roles. Communication skills advance career.',
      cancer: 'Career in caretaking fields. Public is like family to you professionally.',
      leo: 'Leadership and creative careers. Public recognition is important to your career.',
      virgo: 'Meticulous professional work and detailed expertise. Service-oriented career success.',
      libra: 'Public appeal and diplomatic careers. Your reputation is important and favorable.',
      scorpio: 'Powerful, transformative career impact. Hidden work brings prestige and power.',
      sagittarius: 'Expansive career with diverse opportunities. Teaching and travel benefit career.',
      capricorn: 'Serious, ambitious career with authority. You reach the top of your field.',
      aquarius: 'Innovative career breakthroughs. Your work benefits the collective.',
      pisces: 'Creative, artistic, or healing career. Your work touches hearts deeply.',
    },
    11: {
      aries: 'Bold friendships and passionate group participation. You lead friend groups.',
      taurus: 'Loyal, enduring friendships. You attract stable, dependable friends.',
      gemini: 'Many friends from diverse backgrounds. Networking comes naturally.',
      cancer: 'Close-knit friend groups like family. You nurture your friendships.',
      leo: 'Popular in groups. Friends admire your warmth and generosity.',
      virgo: 'Selective friendships based on shared values. You support friends practically.',
      libra: 'Harmonious friend groups. You mediate and create balance in friendships.',
      scorpio: 'Intense, loyal friendships with few trusted confidants.',
      sagittarius: 'Adventurous friend groups with shared growth. Many social circles.',
      capricorn: 'Long-lasting friendships built on shared goals and loyalty.',
      aquarius: 'Unique friendships and group involvement in causes. Community service.',
      pisces: 'Compassionate, spiritual friendships. You intuitively support friends.',
    },
    12: {
      aries: 'Hidden strengths emerge from solitude. You tackle secret challenges boldly.',
      taurus: 'Grounded spirituality and hidden resources. Retreat brings peace.',
      gemini: 'Hidden knowledge and mystical learning. Solitude enhances intuition.',
      cancer: 'Deep subconscious and spiritual connection. Intuition guides your shadow work.',
      leo: 'Hidden creative depths. Spiritual retreat enhances your public presence.',
      virgo: 'Practical spirituality and service from the shadows. Healing work behind scenes.',
      libra: 'Spiritual balance through retreat. Hidden grace and karmic beauty.',
      scorpio: 'Deep spiritual transformation. Hidden powers and psychic abilities.',
      sagittarius: 'Spiritual exploration and hidden wisdom. Retreat nurtures faith.',
      capricorn: 'Spiritual discipline and karmic responsibility. Hidden legacy.',
      aquarius: 'Progressive spiritual ideals and hidden humanitarian work.',
      pisces: 'Naturally mystical and intuitive. Spiritual gifts and psychic abilities.',
    },
  };

  return (
    effects[houseNumber]?.[sign.toLowerCase()] ||
    'Explore how this sign influences this house of your life.'
  );
};

// Comprehensive celestial point in sign interpretations
const getCelestialPointInterpretation = (pointName: string, sign: string): string => {
  const interpretations: Record<string, Record<string, string>> = {
    'Sun': {
      'aries': 'Your core identity radiates boldness and pioneering spirit. You\'re driven by passion and the desire to lead, with natural confidence in new situations. Your essence demands action, independence, and the freedom to chart your own course.',
      'taurus': 'Your essence is grounded, practical, and deeply connected to the material world. You value stability, loyalty, and sensory pleasures, approaching life with patience and reliability. Security and beauty in your surroundings are fundamental to your sense of self.',
      'gemini': 'Your core nature is intellectual, communicative, and endlessly curious. You thrive on mental stimulation, variety, and connection with others. Adaptability and the exchange of ideas are central to your identity and personal power.',
      'cancer': 'Your essence is emotional, nurturing, and deeply intuitive. You\'re driven by the need for emotional security and meaningful connections with family and loved ones. Your identity is rooted in your sensitivity and protective instincts.',
      'leo': 'Your core identity is creative, charismatic, and naturally confident. You shine brightest when expressing yourself authentically and receiving recognition. Drama, generosity, and self-expression are fundamental to your sense of purpose.',
      'virgo': 'Your essence is analytical, practical, and service-oriented. You find meaning in precision, organization, and helping others improve. Your identity is built on competence, reliability, and the pursuit of perfection in your craft.',
      'libra': 'Your core nature values balance, harmony, and meaningful relationships. You\'re driven by the desire for peace and beauty, excelling in diplomacy and partnership. Your identity flourishes through connection and aesthetic appreciation.',
      'scorpio': 'Your essence is intense, transformative, and deeply mysterious. You possess powerful intuition and the drive to uncover hidden truths. Your identity is defined by your emotional depth, resilience, and ability to transform challenges into strength.',
      'sagittarius': 'Your core identity is expansive, optimistic, and adventure-seeking. You\'re driven by the need for freedom, exploration, and wisdom. Your essence thrives on philosophical exploration and the pursuit of meaning in all experiences.',
      'capricorn': 'Your essence is ambitious, disciplined, and responsibility-driven. You\'re naturally drawn to structure, tradition, and working toward long-term goals. Your identity is built on competence, authority, and the pursuit of lasting achievement.',
      'aquarius': 'Your core nature is innovative, independent, and humanitarian. You\'re driven by ideals, unconventional thinking, and the desire to contribute to collective progress. Your identity thrives on uniqueness and intellectual freedom.',
      'pisces': 'Your essence is compassionate, artistic, and spiritually attuned. You\'re deeply intuitive and imaginative, with a natural connection to the unseen realms. Your identity is defined by empathy, creativity, and a mystical understanding of life.',
    },
    'Moon': {
      'aries': 'Your emotional nature is fiery and reactive, needing immediate expression. You feel intensely in the moment and act on gut instincts. Emotional fulfillment comes through excitement, challenge, and independence in your private life.',
      'taurus': 'Your emotional nature is steady, loyal, and sensually aware. You need physical comfort, stability, and consistency to feel secure. Emotional fulfillment comes through loyalty, beauty, and predictable routines that ground you.',
      'gemini': 'Your emotional nature is communicative and mentally stimulated. You process feelings through talking and require variety to feel satisfied. Emotional fulfillment comes through conversation, learning, and mental connection with others.',
      'cancer': 'Your emotional nature is deeply sensitive and nurturing. You have strong instinctive needs for emotional security and family connection. Your moods fluctuate with lunar cycles, requiring safe spaces to express vulnerability.',
      'leo': 'Your emotional nature seeks recognition and warm, expressive outlets. You need to feel valued and appreciated in your relationships. Emotional fulfillment comes through creative expression, playfulness, and being at the center of attention.',
      'virgo': 'Your emotional nature is analytical and perfectionist. You process feelings through logic and detail, needing to understand your emotions intellectually. Emotional fulfillment comes through service, organization, and helping others.',
      'libra': 'Your emotional nature seeks balance, harmony, and partnership. You\'re uncomfortable with conflict and need peaceful environments. Emotional fulfillment comes through relationships, aesthetic beauty, and social connection.',
      'scorpio': 'Your emotional nature is intense, secretive, and powerfully intuitive. You feel everything deeply but protect your vulnerabilities fiercely. Emotional fulfillment requires trust, deep bonding, and psychological exploration.',
      'sagittarius': 'Your emotional nature is optimistic and freedom-loving. You resist emotional constraint and need independence in relationships. Emotional fulfillment comes through adventure, optimism, and philosophical exploration of feelings.',
      'capricorn': 'Your emotional nature is reserved, responsible, and controlled. You don\'t easily show vulnerability but have steadfast loyalty. Emotional fulfillment comes through proving your worth and maintaining emotional boundaries.',
      'aquarius': 'Your emotional nature is detached, intellectual, and humanitarian. You process feelings through logic rather than sentiment. Emotional fulfillment comes through friendship, freedom, and belonging to a community with shared ideals.',
      'pisces': 'Your emotional nature is deeply intuitive, empathetic, and sometimes escapist. You absorb others\' emotions easily and need solitude to process. Emotional fulfillment comes through spiritual connection, creativity, and compassionate service.',
    },
    'Mercury': {
      'aries': 'Your communication is direct, passionate, and sometimes aggressive. You think fast and speak quickly, often before thinking things through. Your mind is pioneering and competitive, excelling in debate and quick decision-making.',
      'taurus': 'Your communication is slow, deliberate, and thoroughly thoughtful. You speak with authority and prefer facts to theories. Your mind works steadily, and once decided, you rarely change course.',
      'gemini': 'Your communication is witty, versatile, and endlessly curious. You excel at discussing multiple topics and enjoy intellectual sparring. Your mind is quick, adaptable, and hungry for information and connection.',
      'cancer': 'Your communication is emotional, intuitive, and protective. You listen deeply and remember personal details. Your thinking is influenced by feelings, and you\'re skilled at understanding others\' emotional needs.',
      'leo': 'Your communication is dramatic, confident, and attention-seeking. You speak with flair and conviction, making your ideas memorable. Your mind is creative, and you enjoy being heard and appreciated for your thoughts.',
      'virgo': 'Your communication is precise, analytical, and detail-oriented. You excel at finding logical flaws and improving systems. Your mind is meticulous, and you\'re skilled at breaking complex ideas into understandable components.',
      'libra': 'Your communication is diplomatic, balanced, and relationship-focused. You excel at seeing multiple perspectives and finding compromise. Your mind seeks harmony in ideas, and you\'re skilled at mediating discussions.',
      'scorpio': 'Your communication is intense, probing, and strategic. You listen for hidden meanings and ask penetrating questions. Your mind is investigative, and you\'re skilled at uncovering truths others miss.',
      'sagittarius': 'Your communication is expansive, philosophical, and sometimes tactless. You love discussing big ideas and exploring diverse perspectives. Your mind is freedom-loving, and you excel at inspiring others with optimism.',
      'capricorn': 'Your communication is serious, authoritative, and practical. You speak with purpose and focus on results. Your mind is strategic, and you\'re skilled at planning and explaining complex systems.',
      'aquarius': 'Your communication is innovative, intellectual, and unconventional. You introduce unique ideas and challenge conventional thinking. Your mind is progressive, and you excel at group discussion and collective planning.',
      'pisces': 'Your communication is intuitive, poetic, and sometimes vague. You express feelings and impressions rather than facts. Your mind is imaginative, and you\'re skilled at conveying dreams and spiritual concepts.',
    },
    'Venus': {
      'aries': 'Your love nature is passionate, direct, and adventurous. You pursue what you want without hesitation and value independence in relationships. You\'re attracted to exciting, confident partners who match your intensity.',
      'taurus': 'Your love nature is sensual, loyal, and devoted. You value long-term security and physical affection. You\'re attracted to stable, reliable partners and build solid, lasting relationships.',
      'gemini': 'Your love nature is light, playful, and intellectually stimulated. You need variety and mental connection in relationships. You\'re attracted to intelligent, communicative partners with whom you can laugh and learn.',
      'cancer': 'Your love nature is tender, protective, and emotionally committed. You crave deep emotional intimacy and family values in relationships. You\'re attracted to nurturing partners who understand your need for emotional security.',
      'leo': 'Your love nature is generous, passionate, and seeking adoration. You want to be cherished and admired by your partner. You\'re attracted to confident, creative partners who appreciate your warmth and generosity.',
      'virgo': 'Your love nature is devoted, practical, and service-oriented. You show love through helpful actions and loyalty. You\'re attracted to intelligent, reliable partners whom you can support and improve alongside.',
      'libra': 'Your love nature is romantic, beautiful, and partnership-oriented. You thrive in relationships and seek aesthetic harmony. You\'re attracted to artistic, charming partners with whom you can create a beautiful life.',
      'scorpio': 'Your love nature is intense, magnetic, and deeply transformative. You demand emotional and physical depth in relationships. You\'re attracted to mysterious, powerful partners who can match your passion and commitment.',
      'sagittarius': 'Your love nature is freedom-loving, optimistic, and expansive. You resist being tied down and need independence in relationships. You\'re attracted to adventurous, philosophical partners who share your love of exploration.',
      'capricorn': 'Your love nature is serious, committed, and long-term focused. You approach relationships strategically and value practical compatibility. You\'re attracted to ambitious, reliable partners with whom you can build a secure future.',
      'aquarius': 'Your love nature is friendly, unconventional, and idealistic. You value intellectual connection over emotional dependency. You\'re attracted to unique, progressive partners who share your humanitarian vision.',
      'pisces': 'Your love nature is romantic, empathetic, and spiritually connected. You seek soulmate connections and deep emotional merging. You\'re attracted to creative, sensitive partners who understand your dreamy, intuitive nature.',
    },
    'Mars': {
      'aries': 'Your drive is intense, competitive, and action-oriented. You move fast, take risks, and go after what you want. You\'re energized by challenge and thrive in situations requiring courage and direct confrontation.',
      'taurus': 'Your drive is steady, persistent, and sensually motivated. You work patiently toward physical and material goals. You have incredible staying power, though you can become stubborn or possessive when threatened.',
      'gemini': 'Your drive is mental, communicative, and scattered across multiple interests. You\'re motivated by intellectual challenge and variety. Your energy is best directed toward projects requiring quick thinking and adaptability.',
      'cancer': 'Your drive is emotional, protective, and moody. You\'re motivated by the need to protect loved ones and secure emotional safety. Your energy fluctuates with your emotional state.',
      'leo': 'Your drive is creative, passionate, and seeking recognition. You\'re motivated by the desire to shine and leave a mark. You have fierce pride and courage, especially when defending what you love.',
      'virgo': 'Your drive is analytical, service-oriented, and perfectionistic. You\'re motivated by the desire to improve and solve problems. Your energy is best directed toward detailed work requiring precision and skill.',
      'libra': 'Your drive is social, diplomatic, and conflict-averse. You\'re motivated by the need for harmony and partnership. You can struggle with passive-aggressiveness when forced into confrontation.',
      'scorpio': 'Your drive is intense, strategic, and powerfully determined. You\'re motivated by the need to uncover truth and achieve transformation. You have incredible willpower and ability to overcome obstacles.',
      'sagittarius': 'Your drive is expansive, adventurous, and philosophical. You\'re motivated by freedom and the pursuit of knowledge. You have infectious enthusiasm, though you can be reckless about consequences.',
      'capricorn': 'Your drive is ambitious, disciplined, and strategically focused. You\'re motivated by the desire for success and authority. You have steady, reliable energy that builds toward long-term goals.',
      'aquarius': 'Your drive is intellectual, revolutionary, and collectively motivated. You\'re motivated by ideals and the desire to create change. Your energy is best directed toward causes serving the greater good.',
      'pisces': 'Your drive is intuitive, creative, and sometimes scattered. You\'re motivated by imagination and spiritual purpose. Your energy works best when aligned with something meaningful.',
    },
    'Jupiter': {
      'aries': 'Your luck manifests through boldness and pioneering action. You\'re blessed with courage and optimism. Expansion comes through taking risks and initiating new ventures with confidence.',
      'taurus': 'Your luck manifests through steady accumulation and material increase. You\'re blessed with abundance and sensual pleasure. Expansion comes through patience, loyalty, and building solid foundations.',
      'gemini': 'Your luck manifests through communication and intellectual pursuits. You\'re blessed with good timing in business and learning. Expansion comes through writing, speaking, travel, and networking.',
      'cancer': 'Your luck manifests through family and emotional security. You\'re blessed with intuition and nurturing opportunities. Expansion comes through supporting others and creating warm, welcoming spaces.',
      'leo': 'Your luck manifests through creativity and self-expression. You\'re blessed with charisma and recognition. Expansion comes through generous sharing of your gifts and leading others.',
      'virgo': 'Your luck manifests through service and practical improvements. You\'re blessed with helpful synchronicities. Expansion comes through refining your skills and serving the greater good.',
      'libra': 'Your luck manifests through relationships and partnerships. You\'re blessed with social grace and harmony-making. Expansion comes through collaboration and creating beautiful shared experiences.',
      'scorpio': 'Your luck manifests through transformation and hidden opportunities. You\'re blessed with access to power and secrets. Expansion comes through deep exploration and psychological understanding.',
      'sagittarius': 'Your luck manifests through adventure and expansion. You\'re blessed with optimism and frequent fortunate opportunities. Expansion comes through travel, learning, and sharing your enthusiasm.',
      'capricorn': 'Your luck manifests through achievement and public recognition. You\'re blessed with business acumen and strategic advantage. Expansion comes through hard work, discipline, and long-term planning.',
      'aquarius': 'Your luck manifests through friendship and collective endeavors. You\'re blessed with sudden opportunities and group success. Expansion comes through collaboration on humanitarian causes.',
      'pisces': 'Your luck manifests through creativity and spiritual growth. You\'re blessed with inspiration and mystical insight. Expansion comes through artistic expression and compassionate service.',
    },
    'Saturn': {
      'aries': 'Your growth comes through learning patience and strategic planning. You face challenges requiring careful consideration before action. Mastery comes through disciplining your impulses and building lasting foundations.',
      'taurus': 'Your growth comes through material responsibility and persistence. You face tests of your loyalty and stability. Mastery comes through building solid wealth and respecting natural limits.',
      'gemini': 'Your growth comes through focused communication and intellectual discipline. You face challenges in maintaining consistency. Mastery comes through developing expertise in chosen areas.',
      'cancer': 'Your growth comes through emotional boundaries and family responsibility. You face challenges requiring emotional maturity. Mastery comes through creating secure, structured homes and loving deeply.',
      'leo': 'Your growth comes through learning humility and creative discipline. You face challenges to your pride and need for recognition. Mastery comes through expressing yourself with integrity and helping others shine.',
      'virgo': 'Your growth comes through perfecting your craft and serving effectively. You face perfectionistic challenges and self-criticism. Mastery comes through accepting that progress is better than perfection.',
      'libra': 'Your growth comes through relationship commitment and personal responsibility. You face challenges making difficult choices. Mastery comes through building lasting partnerships based on genuine commitment.',
      'scorpio': 'Your growth comes through emotional depth and psychological understanding. You face challenges integrating your shadow self. Mastery comes through transforming pain into wisdom.',
      'sagittarius': 'Your growth comes through channeling expansion into meaningful direction. You face challenges with recklessness and overconfidence. Mastery comes through disciplined pursuit of higher knowledge.',
      'capricorn': 'Your growth comes through achieving genuine authority and integrity. You face challenges of ambition and loneliness at the top. Mastery comes through earning respect through authentic accomplishment.',
      'aquarius': 'Your growth comes through grounding ideals into practical reality. You face challenges balancing individuality with community. Mastery comes through creating sustainable change.',
      'pisces': 'Your growth comes through spiritual discipline and creative structure. You face challenges with escapism and clarity. Mastery comes through grounding spirituality in the material world.',
    },
    'Uranus': {
      'aries': 'You bring revolutionary change and bold innovation. Your influence awakens courage in others. You\'re driven to shatter old patterns and pioneer entirely new approaches.',
      'taurus': 'You bring radical change to material structures and values. Your influence disrupts comfortable stagnation. You reform traditions while maintaining groundedness in the practical world.',
      'gemini': 'You bring revolutionary communication breakthroughs and intellectual innovation. Your influence awakens minds to new possibilities. You revolutionize learning and connection methods.',
      'cancer': 'You bring radical emotional and family restructuring. Your influence disrupts emotional security to force growth. You revolutionize how we nurture and create home.',
      'leo': 'You bring revolutionary creative expression and individual liberation. Your influence awakens others to their unique gifts. You disrupt expectations about power and authority.',
      'virgo': 'You bring innovative improvements to systems and routines. Your influence reforms work and health practices. You revolutionize how we serve and improve efficiency.',
      'libra': 'You bring revolutionary relationship structures and social change. Your influence awakens equality consciousness. You disrupt traditional partnership patterns.',
      'scorpio': 'You bring radical psychological and transformative breakthroughs. Your influence awakens hidden power and truth. You revolutionize how we understand hidden forces.',
      'sagittarius': 'You bring innovative expansion and liberation of belief systems. Your influence awakens spiritual and intellectual freedom. You revolutionize philosophy and higher learning.',
      'capricorn': 'You bring radical restructuring of authority and institutions. Your influence disrupts outdated power structures. You revolutionize how we organize collective effort.',
      'aquarius': 'You bring visionary collective innovation and humanitarian breakthroughs. Your influence awakens group consciousness. You revolutionize technology and social systems.',
      'pisces': 'You bring mystical revelation and spiritual breakthrough. Your influence awakens transcendent consciousness. You revolutionize spirituality and creative expression.',
    },
    'Neptune': {
      'aries': 'Your presence dissolves boundaries in pursuit and action. You inspire idealism in others but can blur practical focus. Your influence is mystical courage and spiritual pioneering.',
      'taurus': 'Your presence softens material attachment and dissolves boundaries in values. You inspire spiritual abundance consciousness. Your influence is ethereal beauty in the material world.',
      'gemini': 'Your presence dissolves communication boundaries and blurs ideas. You inspire poetic expression and imagination. Your influence is magical thinking and mystical communication.',
      'cancer': 'Your presence deepens emotional sensitivity and intuitive connection. You inspire compassion and mystical family bonds. Your influence is transcendent nurturing.',
      'leo': 'Your presence softens boundaries in creative expression and ego. You inspire idealistic artistry. Your influence is dissolution of false self into authentic presence.',
      'virgo': 'Your presence dissolves practical boundaries and softens criticism. You inspire compassion in service. Your influence is mystical healing and transcendent helping.',
      'libra': 'Your presence dissolves boundaries in relationships and ideals partnership. You inspire unconditional love. Your influence is mystical connection and spiritual union.',
      'scorpio': 'Your presence deepens mystical understanding and dissolves psychological boundaries. You inspire spiritual transformation. Your influence is transcendent depth and hidden truth-seeking.',
      'sagittarius': 'Your presence dissolves boundaries in belief and expands spiritually. You inspire universal consciousness. Your influence is mystical philosophy and transcendent meaning-seeking.',
      'capricorn': 'Your presence softens ambition and dissolves rigid structure. You inspire spiritual responsibility and idealistic achievement. Your influence is transcendent integrity.',
      'aquarius': 'Your presence dissolves individual boundaries into collective consciousness. You inspire universal humanitarian vision. Your influence is mystical collective awakening.',
      'pisces': 'Your presence amplifies sensitivity and mystical awareness. You inspire spiritual devotion and transcendence. Your influence is profound connection to divine consciousness.',
    },
    'Pluto': {
      'aries': 'Your presence brings intense transformation through courageous confrontation. You catalyze others\' metamorphosis. Your influence is death and rebirth of identity and courage.',
      'taurus': 'Your presence brings intense transformation of values and possessions. You catalyze others\' release of attachments. Your influence is death and rebirth of what we hold dear.',
      'gemini': 'Your presence brings intense transformation of communication and thinking. You catalyze others\' truth-speaking. Your influence is death and rebirth of voice and understanding.',
      'cancer': 'Your presence brings intense emotional and family transformation. You catalyze others\' emotional depth. Your influence is death and rebirth of home and nurturing.',
      'leo': 'Your presence brings intense creative and ego transformation. You catalyze others\' authentic power. Your influence is death and rebirth of creative expression.',
      'virgo': 'Your presence brings intense transformation through service and mastery. You catalyze others\' healing. Your influence is death and rebirth of wholeness and effectiveness.',
      'libra': 'Your presence brings intense relationship and power transformation. You catalyze others\' authentic relating. Your influence is death and rebirth of partnership.',
      'scorpio': 'Your presence brings intense psychological and spiritual transformation. You catalyze others\' shadow integration. Your influence is death and rebirth of consciousness.',
      'sagittarius': 'Your presence brings intense transformation of belief and meaning. You catalyze others\' spiritual awakening. Your influence is death and rebirth of faith and expansion.',
      'capricorn': 'Your presence brings intense transformation of power and legacy. You catalyze others\' authentic authority. Your influence is death and rebirth of achievement and integrity.',
      'aquarius': 'Your presence brings intense collective and ideological transformation. You catalyze others\' collective consciousness. Your influence is death and rebirth of vision.',
      'pisces': 'Your presence brings intense spiritual and mystical transformation. You catalyze others\' transcendence. Your influence is death and rebirth of consciousness itself.',
    },
    'North Node': {
      'aries': 'Your life path calls you toward courage, independence, and pioneering spirit. You\'re learning to trust your instincts and take bold action. Growth comes through initiating new ventures and developing authentic confidence.',
      'taurus': 'Your life path calls you toward stability, material mastery, and grounding. You\'re learning patience and the value of consistent effort. Growth comes through building lasting security and appreciating sensory beauty.',
      'gemini': 'Your life path calls you toward intellectual growth and meaningful communication. You\'re learning to share your ideas and connect with others. Growth comes through curiosity, learning, and exploring diverse perspectives.',
      'cancer': 'Your life path calls you toward emotional wisdom and nurturing connection. You\'re learning to honor your feelings and vulnerability. Growth comes through building safe, loving relationships and family bonds.',
      'leo': 'Your life path calls you toward authentic self-expression and creative power. You\'re learning to shine without needing approval. Growth comes through developing genuine confidence and generous leadership.',
      'virgo': 'Your life path calls you toward service, discernment, and practical improvement. You\'re learning to refine your skills and help others. Growth comes through detailed focus and contributing meaningful service.',
      'libra': 'Your life path calls you toward relationship mastery and authentic partnership. You\'re learning to balance self with others. Growth comes through genuine connection and creating harmony.',
      'scorpio': 'Your life path calls you toward emotional depth and psychological transformation. You\'re learning to embrace your power and intuition. Growth comes through authentic vulnerability and integrating your shadow.',
      'sagittarius': 'Your life path calls you toward wisdom-seeking and spiritual expansion. You\'re learning meaning and faith. Growth comes through exploration, learning, and sharing your inspiration with others.',
      'capricorn': 'Your life path calls you toward responsibility and authentic authority. You\'re learning to build lasting achievement. Growth comes through disciplined effort and creating meaningful legacy.',
      'aquarius': 'Your life path calls you toward progressive vision and collective service. You\'re learning to contribute to group consciousness. Growth comes through humanitarian ideals and innovative thinking.',
      'pisces': 'Your life path calls you toward spiritual awareness and creative compassion. You\'re learning to connect with higher consciousness. Growth comes through surrendering to inspiration and serving others.',
    },
    'South Node': {
      'aries': 'You carry natural courage but tend toward recklessness. Your gift is pioneering spirit, but you\'re learning to balance action with wisdom. Integration comes through controlled assertion.',
      'taurus': 'You carry natural stability but can become overly attached. Your gift is grounding, but you\'re learning to embrace change. Integration comes through flexible adaptability.',
      'gemini': 'You carry natural communication gifts but scatter your energy. Your gift is intelligence, but you\'re learning depth over breadth. Integration comes through focused mastery.',
      'cancer': 'You carry natural emotional sensitivity but can be overly dependent. Your gift is nurturing, but you\'re learning independence. Integration comes through healthy boundaries.',
      'leo': 'You carry natural charisma but may be attention-seeking. Your gift is creative expression, but you\'re learning humility. Integration comes through genuine service.',
      'virgo': 'You carry natural analytical ability but can be overly critical. Your gift is improvement, but you\'re learning acceptance. Integration comes through self-compassion.',
      'libra': 'You carry natural diplomacy but may avoid necessary conflict. Your gift is harmony-making, but you\'re learning authentic self-assertion. Integration comes through standing up for yourself.',
      'scorpio': 'You carry natural intensity but tend toward control. Your gift is transformation awareness, but you\'re learning trust. Integration comes through releasing attachments.',
      'sagittarius': 'You carry natural optimism but can ignore practical reality. Your gift is inspiration, but you\'re learning grounding. Integration comes through balanced expansion.',
      'capricorn': 'You carry natural responsibility but can be overly serious. Your gift is building legacy, but you\'re learning joy. Integration comes through lightened perspective.',
      'aquarius': 'You carry natural progressive thinking but can be detached. Your gift is collective vision, but you\'re learning emotion. Integration comes through authentic connection.',
      'pisces': 'You carry natural spirituality but can be escapist. Your gift is mystical awareness, but you\'re learning discernment. Integration comes through grounding spirituality.',
    },
    'Midheaven': {
      'aries': 'Your career path calls you toward leadership and pioneering ventures. You\'re seen as courageous and independent in the public eye. Success comes through initiating bold new directions.',
      'taurus': 'Your career path calls you toward building lasting material security. You\'re respected for reliability and steady progress. Success comes through consistent effort and practical mastery.',
      'gemini': 'Your career path calls you toward communication, writing, or teaching roles. You\'re seen as intelligent and versatile. Success comes through intellectual contributions and networking.',
      'cancer': 'Your career path calls you toward nurturing, family, or service-based work. You\'re seen as caring and emotionally intelligent. Success comes through supporting others\' growth.',
      'leo': 'Your career path calls you toward creative, leadership, or public-facing roles. You\'re seen as charismatic and confident. Success comes through authentic self-expression and generosity.',
      'virgo': 'Your career path calls you toward service, analysis, or improvement-based work. You\'re seen as competent and reliable. Success comes through detailed expertise and practical solutions.',
      'libra': 'Your career path calls you toward partnership, diplomacy, or artistic work. You\'re seen as fair and socially gracious. Success comes through collaboration and creating harmony.',
      'scorpio': 'Your career path calls you toward research, psychology, or transformative work. You\'re seen as intense and insightful. Success comes through deep investigation and powerful influence.',
      'sagittarius': 'Your career path calls you toward teaching, travel, or philosophical work. You\'re seen as inspiring and expansive. Success comes through sharing wisdom and global vision.',
      'capricorn': 'Your career path calls you toward executive, managerial, or authoritative roles. You\'re seen as competent and responsible. Success comes through earned authority and lasting achievement.',
      'aquarius': 'Your career path calls you toward innovative, humanitarian, or group-oriented work. You\'re seen as progressive and visionary. Success comes through contributing to collective progress.',
      'pisces': 'Your career path calls you toward artistic, healing, or spiritual work. You\'re seen as compassionate and inspired. Success comes through creative expression and serving humanity.',
    },
    'Descendant': {
      'aries': 'You\'re attracted to confident, passionate, and direct partners. Relationships thrive on excitement and mutual independence. You learn about self through bold, courageous connection.',
      'taurus': 'You\'re attracted to stable, reliable, and sensual partners. Relationships thrive on loyalty and security. You learn about self through building lasting, tangible bonds.',
      'gemini': 'You\'re attracted to intelligent, communicative, and adaptable partners. Relationships thrive on conversation and shared learning. You learn about self through mental stimulation and variety.',
      'cancer': 'You\'re attracted to emotionally available, nurturing, and intuitive partners. Relationships thrive on emotional depth and family values. You learn about self through intimate, vulnerable connection.',
      'leo': 'You\'re attracted to creative, confident, and generous partners. Relationships thrive on warmth and mutual admiration. You learn about self through playful, expressive connection.',
      'virgo': 'You\'re attracted to intelligent, practical, and helpful partners. Relationships thrive on mutual improvement and service. You learn about self through supportive, grounded connection.',
      'libra': 'You\'re attracted to fair-minded, artistic, and socially gracious partners. Relationships thrive on balance and beauty. You learn about self through harmonious partnership.',
      'scorpio': 'You\'re attracted to intense, mysterious, and psychologically deep partners. Relationships thrive on passionate honesty. You learn about self through transformative, magnetic connection.',
      'sagittarius': 'You\'re attracted to adventurous, philosophical, and freedom-loving partners. Relationships thrive on exploration and growth. You learn about self through expansive, inspiring connection.',
      'capricorn': 'You\'re attracted to ambitious, responsible, and accomplished partners. Relationships thrive on mutual respect and achievement. You learn about self through serious, committed connection.',
      'aquarius': 'You\'re attracted to unique, progressive, and intellectual partners. Relationships thrive on friendship and shared ideals. You learn about self through unconventional, stimulating connection.',
      'pisces': 'You\'re attracted to compassionate, artistic, and spiritually aligned partners. Relationships thrive on mutual understanding and fantasy. You learn about self through tender, mystical connection.',
    },
    'Vertex': {
      'aries': 'Fated encounters bring bold, courageous people into your life. These connections ignite your passion and leadership potential. Destiny calls you toward courageous self-assertion.',
      'taurus': 'Fated encounters bring stable, reliable people who ground you. These connections build lasting security and stability. Destiny calls you toward committed stability.',
      'gemini': 'Fated encounters bring communicative, intelligent people into your sphere. These connections expand your knowledge and connections. Destiny calls you toward intellectual mastery.',
      'cancer': 'Fated encounters bring emotionally aware, nurturing people. These connections deepen your capacity for vulnerability. Destiny calls you toward emotional wisdom.',
      'leo': 'Fated encounters bring creative, confident people into your life. These connections amplify your self-expression and joy. Destiny calls you toward authentic radiance.',
      'virgo': 'Fated encounters bring helpful, skilled people into your sphere. These connections refine your expertise and service. Destiny calls you toward practical mastery.',
      'libra': 'Fated encounters bring harmonious, artistic people into your life. These connections balance and beautify your world. Destiny calls you toward relational harmony.',
      'scorpio': 'Fated encounters bring intense, insightful people into your sphere. These connections unlock hidden truths and power. Destiny calls you toward psychological transformation.',
      'sagittarius': 'Fated encounters bring adventurous, wise people into your life. These connections expand your horizons and faith. Destiny calls you toward spiritual expansion.',
      'capricorn': 'Fated encounters bring accomplished, responsible people into your sphere. These connections support your ambitions. Destiny calls you toward earned authority.',
      'aquarius': 'Fated encounters bring visionary, progressive people into your life. These connections align with your ideals. Destiny calls you toward collective contribution.',
      'pisces': 'Fated encounters bring compassionate, creative people into your sphere. These connections deepen spiritual awareness. Destiny calls you toward transcendent service.',
    },
    'Chiron': {
      'aries': 'Your deepest wound involves assertion and courage. Through healing others\' fear and powerlessness, you find your strength. Your gift is teaching authentic courage and pioneering.',
      'taurus': 'Your deepest wound involves security and self-worth. Through healing others\' insecurity, you anchor peace. Your gift is teaching grounded stability and material wisdom.',
      'gemini': 'Your deepest wound involves communication and knowledge. Through healing others\' confusion, you find clarity. Your gift is teaching understanding and meaningful exchange.',
      'cancer': 'Your deepest wound involves belonging and emotional safety. Through healing others\' abandonment, you learn nurturing. Your gift is teaching emotional wisdom and safe connection.',
      'leo': 'Your deepest wound involves self-worth and expression. Through healing others\' shame, you find your light. Your gift is teaching authentic self-expression and creative power.',
      'virgo': 'Your deepest wound involves perfection and self-criticism. Through healing others\' inadequacy, you find acceptance. Your gift is teaching practical wisdom and wholeness.',
      'libra': 'Your deepest wound involves relationship and self-worth. Through healing others\' relational pain, you balance. Your gift is teaching harmonious connection and fair relating.',
      'scorpio': 'Your deepest wound involves trust and transformation. Through healing others\' betrayal, you find power. Your gift is teaching psychological truth and authentic empowerment.',
      'sagittarius': 'Your deepest wound involves faith and meaning. Through healing others\' despair, you find wisdom. Your gift is teaching spiritual meaning and expansive faith.',
      'capricorn': 'Your deepest wound involves worthiness and authority. Through healing others\' unworthiness, you find mastery. Your gift is teaching authentic achievement and integrity.',
      'aquarius': 'Your deepest wound involves belonging and uniqueness. Through healing others\' alienation, you find connection. Your gift is teaching visionary belonging and authentic difference.',
      'pisces': 'Your deepest wound involves surrendering and reality. Through healing others\' escapism, you find transcendence. Your gift is teaching spiritual grounding and mystical wisdom.',
    },
    'Part of Fortune': {
      'aries': 'Your natural talent is pioneering and courageous action. Luck flows when you boldly assert yourself. Your fortune comes through initiating and taking decisive action.',
      'taurus': 'Your natural talent is building and accumulating. Luck flows through patient, steady effort. Your fortune comes through material security and sensual pleasure.',
      'gemini': 'Your natural talent is communicating and learning. Luck flows through sharing ideas and making connections. Your fortune comes through intellectual exchange and networking.',
      'cancer': 'Your natural talent is nurturing and creating security. Luck flows through emotional honesty and family bonds. Your fortune comes through building safe, loving spaces.',
      'leo': 'Your natural talent is creative self-expression and leadership. Luck flows when you shine authentically. Your fortune comes through generous sharing of your gifts.',
      'virgo': 'Your natural talent is improving and serving. Luck flows through helpful action and practical mastery. Your fortune comes through refinement and meaningful service.',
      'libra': 'Your natural talent is creating harmony and partnership. Luck flows through balanced relationships. Your fortune comes through collaboration and aesthetic creation.',
      'scorpio': 'Your natural talent is transformation and truth-seeking. Luck flows through depth and authentic power. Your fortune comes through psychological and spiritual understanding.',
      'sagittarius': 'Your natural talent is expansion and inspiration. Luck flows through adventurous optimism. Your fortune comes through exploration and sharing wisdom.',
      'capricorn': 'Your natural talent is building lasting achievement. Luck flows through strategic discipline. Your fortune comes through earned success and responsible authority.',
      'aquarius': 'Your natural talent is visionary thinking and collective contribution. Luck flows through humanitarian action. Your fortune comes through progressive innovation.',
      'pisces': 'Your natural talent is mystical awareness and compassion. Luck flows through spiritual alignment and creativity. Your fortune comes through inspired service and transcendent connection.',
    },
  };

  return (
    interpretations[pointName]?.[sign.toLowerCase()] ||
    `${pointName} in ${sign} brings its unique influence to your birth chart. This placement shapes how you express the qualities of ${pointName} through the lens of ${sign}'s characteristics.`
  );
};

export function AstrologyScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [tab, setTab] = useState<'calculator' | 'zodiac' | 'planets' | 'houses'>('calculator');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<(typeof ZODIAC_SIGNS)[0] | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<(typeof HOUSES)[0] | null>(null);
  const [selectedHouseWithSign, setSelectedHouseWithSign] = useState<{
    house: (typeof HOUSES)[0];
    sign: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showHouseDetailsModal, setShowHouseDetailsModal] = useState(false);

  // Calculator state
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[15]); // Default: GMT
  const [isSidereal, setIsSidereal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [birthChart, setBirthChart] = useState<{
    sunSign: string;
    moonSign: string;
    risingSign: string;
    houses: Record<number, string>;
    celestialPoints: Record<string, string>;
  } | null>(null);

  const [selectedCelestialPoint, setSelectedCelestialPoint] = useState<{
    pointName: string;
    sign: string;
    symbol: string;
    meaning: string;
  } | null>(null);
  const [showCelestialPointModal, setShowCelestialPointModal] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const selectedPlanetData = CELESTIAL_POINTS.find((p) => p.name === selectedPlanet);

  // Load saved birth chart on component mount
  useEffect(() => {
    const loadSavedChart = async () => {
      try {
        const savedChart = await AsyncStorage.getItem('birthChart');
        if (savedChart) {
          const chartData = JSON.parse(savedChart);
          setBirthChart(chartData);
          console.log('[Astrology] Loaded saved birth chart from AsyncStorage');
        }
      } catch (error) {
        console.error('[Astrology] Error loading birth chart:', error);
      }
    };
    loadSavedChart();
  }, []);

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

  const handleSaveBirthChart = async () => {
    if (!birthDate) {
      Alert.alert('Missing Information', 'Please enter your birth date.');
      return;
    }

    // Show rewarded video ad first and wait for it to complete
    try {
      console.log('[Astrology] Attempting to show rewarded video before calculating birth chart');
      const adWatched = await AppodealService.showRewardedVideo();
      console.log(`[Astrology] Video ad completed. Watched: ${adWatched}`);
    } catch (error) {
      console.error('[Astrology] Error showing video ad:', error);
    }

    // Calculate birth chart after ad completes
    // Calculate all celestial points
    const celestialPoints: Record<string, string> = {};
    CELESTIAL_POINTS.forEach((point) => {
      celestialPoints[point.name] = calculateCelestialPoint(
        point.name,
        birthDate,
        birthTime,
        isSidereal
      );
    });

    const chart = {
      sunSign: celestialPoints['Sun'],
      moonSign: celestialPoints['Moon'],
      risingSign: celestialPoints['Descendant'] ? calculateRisingSign(birthTime, isSidereal) : 'Requires birth time',
      houses: calculateHouses(birthTime, isSidereal),
      celestialPoints,
    };

    setBirthChart(chart);

    // Save chart to AsyncStorage for persistence
    try {
      await AsyncStorage.setItem('birthChart', JSON.stringify(chart));
      console.log('[Astrology] Birth chart saved to AsyncStorage');
    } catch (error) {
      console.error('[Astrology] Error saving birth chart to AsyncStorage:', error);
    }

    // Show success message as toast instead of alert
    ToastService.show('Your personalized astrology chart has been generated!', 'long');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleClearChart = async () => {
    try {
      await AsyncStorage.removeItem('birthChart');
      setBirthChart(null);
      console.log('[Astrology] Birth chart cleared from AsyncStorage');
      ToastService.show('Birth chart cleared', 'short');
    } catch (error) {
      console.error('[Astrology] Error clearing birth chart:', error);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper function to render celestial point card
  const renderCelestialPoint = (
    name: string,
    sign: string,
    symbol: string,
    color: string,
    isCentered: boolean = false
  ) => {
    const pointData = CELESTIAL_POINTS.find((p) => p.name === name);

    return (
      <TouchableOpacity
        style={[
          styles.celestialPointCard,
          { backgroundColor: cardBg, borderColor: color },
          isCentered && styles.celestialPointCardCentered,
        ]}
        onPress={() => {
          setSelectedCelestialPoint({
            pointName: name,
            sign,
            symbol,
            meaning: pointData?.meaning || '',
          });
          setShowCelestialPointModal(true);
        }}
        key={name}
      >
        <Text style={[styles.celestialSymbol, { color }]}>{symbol}</Text>
        <Text style={[styles.celestialLabel, { color: mutedColor }]}>{name}</Text>
        <Text style={[styles.celestialSign, { color: textColor }]}>{sign}</Text>
      </TouchableOpacity>
    );
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
              borderBottomColor: tab === 'calculator' ? '#8b5cf6' : 'transparent',
            },
          ]}
          onPress={() => setTab('calculator')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: tab === 'calculator' ? '#8b5cf6' : mutedColor,
                fontWeight: tab === 'calculator' ? '700' : '500',
              },
            ]}
          >
            Chart
          </Text>
        </TouchableOpacity>
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
      {tab === 'calculator' && (
        // Birth Chart Calculator View
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={[styles.calculatorCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.calculatorTitle, { color: textColor }]}>Birth Chart Calculator</Text>
            <Text style={[styles.calculatorSubtitle, { color: mutedColor }]}>
              Discover your sun, moon, and rising signs
            </Text>

            {/* Birth Date Input */}
            <TouchableOpacity
              style={[styles.inputButton, { backgroundColor: cardBg, borderColor: '#8b5cf6' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.inputButtonContent}>
                <Text style={[styles.inputLabel, { color: mutedColor }]}>Birth Date</Text>
                <Text style={[styles.inputValue, { color: textColor }]}>
                  📅 {formatDate(birthDate)}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Birth Time Input */}
            <TouchableOpacity
              style={[styles.inputButton, { backgroundColor: cardBg, borderColor: '#8b5cf6' }]}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.inputButtonContent}>
                <Text style={[styles.inputLabel, { color: mutedColor }]}>Birth Time (Optional)</Text>
                <Text style={[styles.inputValue, { color: textColor }]}>
                  🕐 {formatTime(birthTime)}
                </Text>
              </View>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={birthTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}

            {/* Birth Location (Time Zone) Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>Birth Location (time zone)</Text>
              <TouchableOpacity
                style={[styles.inputButton, { backgroundColor: cardBg, borderColor: '#8b5cf6' }]}
                onPress={() => setShowTimezoneModal(true)}
              >
                <View style={styles.inputButtonContent}>
                  <Text style={[styles.inputValue, { color: textColor }]}>
                    🌍 {selectedTimezone.name} • {selectedTimezone.label}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Zodiac System Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: mutedColor }]}>Zodiac System</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.selectorButton,
                    {
                      backgroundColor: !isSidereal ? '#8b5cf6' : (isDarkMode ? '#3a3a3a' : '#e0e0e0'),
                      borderColor: '#8b5cf6',
                    },
                  ]}
                  onPress={() => setIsSidereal(false)}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      { color: !isSidereal ? '#fff' : textColor },
                    ]}
                  >
                    ♈ Tropical
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.selectorButton,
                    {
                      backgroundColor: isSidereal ? '#8b5cf6' : (isDarkMode ? '#3a3a3a' : '#e0e0e0'),
                      borderColor: '#8b5cf6',
                    },
                  ]}
                  onPress={() => setIsSidereal(true)}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      { color: isSidereal ? '#fff' : textColor },
                    ]}
                  >
                    ⚜ Sidereal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#8b5cf6' }]}
              onPress={handleSaveBirthChart}
            >
              <Text style={styles.saveButtonText}>Calculate Birth Chart</Text>
            </TouchableOpacity>

            {/* Birth Chart Results */}
            {birthChart && (
              <View style={[styles.resultsCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                <Text style={[styles.resultsTitle, { color: textColor }]}>Your Birth Chart</Text>
                <Text style={[styles.resultsLocation, { color: mutedColor }]}>
                  🌍 {selectedTimezone.name} ({selectedTimezone.label}) • {formatDate(birthDate)}
                </Text>

                {/* Paired Celestial Points */}
                <View style={styles.celestialGrid}>
                  {birthChart.celestialPoints ? (
                    <>
                      {/* Sun / Moon */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Sun', birthChart.celestialPoints.Sun, '☉', '#f59e0b')}
                        {renderCelestialPoint('Moon', birthChart.celestialPoints.Moon, '☽', '#ec4899')}
                      </View>

                      {/* Rising / Descendant */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Rising', birthChart.risingSign, '↑', '#06b6d4')}
                        {renderCelestialPoint('Descendant', birthChart.celestialPoints.Descendant, 'Dsc', '#8b5cf6')}
                      </View>

                      {/* North Node / South Node */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('North Node', birthChart.celestialPoints['North Node'], '☊', '#10b981')}
                        {renderCelestialPoint('South Node', birthChart.celestialPoints['South Node'], '☋', '#f97316')}
                      </View>

                      {/* Midheaven / Vertex */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Midheaven', birthChart.celestialPoints.Midheaven, 'MC', '#3b82f6')}
                        {renderCelestialPoint('Vertex', birthChart.celestialPoints.Vertex, 'Vx', '#a855f7')}
                      </View>

                      {/* Chiron / Imum Coeli */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Chiron', birthChart.celestialPoints.Chiron, '⚷', '#ef4444')}
                        {renderCelestialPoint('Imum Coeli', birthChart.celestialPoints['Imum Coeli'], 'IC', '#14b8a6')}
                      </View>

                      {/* Part of Fortune (centered) */}
                      <View style={styles.singleRow}>
                        {renderCelestialPoint('Part of Fortune', birthChart.celestialPoints['Part of Fortune'], '⊗', '#fbbf24', true)}
                      </View>

                      {/* Planetary Placements Header */}
                      <Text style={[styles.sectionHeader, { color: textColor }]}>Planetary Placements</Text>

                      {/* Mercury / Venus */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Mercury', birthChart.celestialPoints.Mercury, '☿', '#64748b')}
                        {renderCelestialPoint('Venus', birthChart.celestialPoints.Venus, '♀', '#f472b6')}
                      </View>

                      {/* Mars / Jupiter */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Mars', birthChart.celestialPoints.Mars, '♂', '#dc2626')}
                        {renderCelestialPoint('Jupiter', birthChart.celestialPoints.Jupiter, '♃', '#f59e0b')}
                      </View>

                      {/* Saturn / Uranus */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Saturn', birthChart.celestialPoints.Saturn, '♄', '#475569')}
                        {renderCelestialPoint('Uranus', birthChart.celestialPoints.Uranus, '♅', '#06b6d4')}
                      </View>

                      {/* Neptune / Pluto */}
                      <View style={styles.pairRow}>
                        {renderCelestialPoint('Neptune', birthChart.celestialPoints.Neptune, '♆', '#8b5cf6')}
                        {renderCelestialPoint('Pluto', birthChart.celestialPoints.Pluto, '♇', '#64748b')}
                      </View>
                    </>
                  ) : (
                    <Text style={{ color: mutedColor, textAlign: 'center', marginVertical: 16 }}>
                      Please generate a birth chart to view celestial points
                    </Text>
                  )}
                </View>

                {/* House Placements */}
                <View style={styles.housesSection}>
                  <Text style={[styles.housesTitle, { color: textColor }]}>House Placements</Text>
                  <View style={styles.housesGrid}>
                    {Object.entries(birthChart.houses).map(([houseNum, sign]) => {
                      const houseData = HOUSES.find((h) => h.number === parseInt(houseNum));
                      return (
                        <TouchableOpacity
                          key={houseNum}
                          style={[styles.houseButton, { backgroundColor: cardBg, borderColor: '#8b5cf6' }]}
                          onPress={() => {
                            if (houseData) {
                              setSelectedHouseWithSign({ house: houseData, sign });
                              setShowHouseDetailsModal(true);
                            }
                          }}
                        >
                          <Text style={[styles.houseButtonNumber, { color: '#8b5cf6' }]}>
                            {houseNum}
                          </Text>
                          <Text style={[styles.houseButtonSign, { color: textColor }]}>
                            {sign}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <Text style={[styles.disclaimerText, { color: mutedColor }]}>
                  Note: For accurate rising sign and house placements, provide your exact birth time.
                </Text>

                <TouchableOpacity
                  style={[styles.clearButton, { backgroundColor: isDarkMode ? '#3a3a3a' : '#e0e0e0' }]}
                  onPress={handleClearChart}
                >
                  <Text style={[styles.clearButtonText, { color: '#ef4444' }]}>🗑️ Clear Chart</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
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
            {CELESTIAL_POINTS.filter((p) => p.category === 'luminary' || p.category === 'planet').map((planet) => (
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
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
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

      {/* Custom House Details Modal */}
      <Modal visible={showHouseDetailsModal} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowHouseDetailsModal(false);
                setSelectedHouseWithSign(null);
              }}
            >
              <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedHouseWithSign && (
                <>
                  <Text style={[styles.detailTitle, { color: '#8b5cf6', marginBottom: 8 }]}>
                    House {selectedHouseWithSign.house.number}
                  </Text>
                  <Text style={[styles.detailTitle, { color: textColor, fontSize: 24, marginBottom: 20 }]}>
                    {selectedHouseWithSign.house.name}
                  </Text>

                  {/* House Meaning */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      House Meaning
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedHouseWithSign.house.meaning}
                    </Text>
                  </View>

                  {/* House Description */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      House Description
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedHouseWithSign.house.description}
                    </Text>
                  </View>

                  {/* Sign in House Effects */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>
                      {selectedHouseWithSign.sign} in House {selectedHouseWithSign.house.number}
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {getPlanetaryEffect(
                        selectedHouseWithSign.house.number,
                        selectedHouseWithSign.sign
                      )}
                    </Text>
                  </View>

                  {/* Additional Info */}
                  <View
                    style={[
                      styles.section,
                      { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: '#06b6d4' }]}>
                      ✨ Key Insight
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedHouseWithSign.sign} in your House {selectedHouseWithSign.house.number} expresses the themes of this life area through {selectedHouseWithSign.sign}'s natural qualities. This placement significantly influences how you experience and navigate matters governed by this house.
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Celestial Point Detail Modal */}
      <Modal visible={showCelestialPointModal} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowCelestialPointModal(false);
                setSelectedCelestialPoint(null);
              }}
            >
              <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedCelestialPoint && (
                <>
                  <Text style={[styles.detailSymbol, { color: '#8b5cf6' }]}>
                    {selectedCelestialPoint.symbol}
                  </Text>
                  <Text style={[styles.detailTitle, { color: textColor }]}>
                    {selectedCelestialPoint.pointName}
                  </Text>
                  <Text style={[styles.detailSubtitle, { color: mutedColor }]}>
                    in {selectedCelestialPoint.sign}
                  </Text>

                  {/* General Meaning */}
                  <View style={[styles.section, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                    <Text style={[styles.sectionTitle, { color: '#8b5cf6' }]}>
                      General Meaning
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {selectedCelestialPoint.meaning}
                    </Text>
                  </View>

                  {/* Sign-Specific Interpretation */}
                  <View style={[styles.section, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                    <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>
                      {selectedCelestialPoint.pointName} in {selectedCelestialPoint.sign}
                    </Text>
                    <Text style={[styles.sectionText, { color: mutedColor }]}>
                      {getCelestialPointInterpretation(
                        selectedCelestialPoint.pointName,
                        selectedCelestialPoint.sign
                      )}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Timezone Selector Modal */}
      <Modal visible={showTimezoneModal} transparent animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <View style={[styles.timezoneModalContent, { backgroundColor: cardBg }]}>
            <View style={styles.timezoneHeader}>
              <Text style={[styles.timezoneTitle, { color: textColor }]}>Select Time Zone</Text>
              <TouchableOpacity onPress={() => setShowTimezoneModal(false)}>
                <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={TIMEZONES}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timezoneItem,
                    {
                      backgroundColor: selectedTimezone.label === item.label ? '#8b5cf6' : (isDarkMode ? '#2a2a2a' : '#f5f5f5'),
                      borderColor: '#8b5cf6',
                    },
                  ]}
                  onPress={() => {
                    setSelectedTimezone(item);
                    setShowTimezoneModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timezoneItemText,
                      {
                        color: selectedTimezone.label === item.label ? '#fff' : textColor,
                        fontWeight: selectedTimezone.label === item.label ? '700' : '500',
                      },
                    ]}
                  >
                    {item.label} • {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
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
  // Calculator Styles
  calculatorCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculatorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  calculatorSubtitle: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputButtonContent: {
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginTop: 8,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    flex: 1,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleSubtext: {
    fontSize: 12,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsCard: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultsLocation: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  chartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  chartItem: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  chartValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  housesSection: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  housesTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  housesSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  housesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  houseButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 90,
  },
  houseButtonNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  houseButtonSign: {
    fontSize: 13,
    fontWeight: '600',
  },
  houseItem: {
    width: '23%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 11,
    marginTop: 12,
    lineHeight: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  celestialGrid: {
    marginTop: 16,
    gap: 12,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  singleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  celestialPointCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  celestialPointCardCentered: {
    maxWidth: '60%',
  },
  celestialSymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  celestialLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  celestialSign: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailSymbol: {
    fontSize: 72,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timezoneModalContent: {
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  timezoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  timezoneTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  timezoneItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    borderRadius: 0,
  },
  timezoneItemText: {
    fontSize: 14,
  },
});
