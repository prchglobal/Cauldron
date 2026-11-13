/**
 * Zodiac Sign Service
 * Calculates zodiac signs from birth dates
 */

export interface ZodiacSign {
  sign: string;
  name: string;
  emoji: string;
  dateRange: string;
}

const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: {
    sign: 'aries',
    name: 'Aries',
    emoji: '♈',
    dateRange: 'Mar 21 - Apr 19',
  },
  taurus: {
    sign: 'taurus',
    name: 'Taurus',
    emoji: '♉',
    dateRange: 'Apr 20 - May 20',
  },
  gemini: {
    sign: 'gemini',
    name: 'Gemini',
    emoji: '♊',
    dateRange: 'May 21 - Jun 20',
  },
  cancer: {
    sign: 'cancer',
    name: 'Cancer',
    emoji: '♋',
    dateRange: 'Jun 21 - Jul 22',
  },
  leo: {
    sign: 'leo',
    name: 'Leo',
    emoji: '♌',
    dateRange: 'Jul 23 - Aug 22',
  },
  virgo: {
    sign: 'virgo',
    name: 'Virgo',
    emoji: '♍',
    dateRange: 'Aug 23 - Sep 22',
  },
  libra: {
    sign: 'libra',
    name: 'Libra',
    emoji: '♎',
    dateRange: 'Sep 23 - Oct 22',
  },
  scorpio: {
    sign: 'scorpio',
    name: 'Scorpio',
    emoji: '♏',
    dateRange: 'Oct 23 - Nov 21',
  },
  sagittarius: {
    sign: 'sagittarius',
    name: 'Sagittarius',
    emoji: '♐',
    dateRange: 'Nov 22 - Dec 21',
  },
  capricorn: {
    sign: 'capricorn',
    name: 'Capricorn',
    emoji: '♑',
    dateRange: 'Dec 22 - Jan 19',
  },
  aquarius: {
    sign: 'aquarius',
    name: 'Aquarius',
    emoji: '♒',
    dateRange: 'Jan 20 - Feb 18',
  },
  pisces: {
    sign: 'pisces',
    name: 'Pisces',
    emoji: '♓',
    dateRange: 'Feb 19 - Mar 20',
  },
};

/**
 * Get zodiac sign from birth date
 */
export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // 1-12
  const day = birthDate.getDate(); // 1-31

  let zodiacSign: string;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    zodiacSign = 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    zodiacSign = 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    zodiacSign = 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    zodiacSign = 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    zodiacSign = 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    zodiacSign = 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    zodiacSign = 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    zodiacSign = 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    zodiacSign = 'sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    zodiacSign = 'capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    zodiacSign = 'aquarius';
  } else {
    zodiacSign = 'pisces'; // Feb 19 - Mar 20
  }

  return ZODIAC_SIGNS[zodiacSign];
}

/**
 * Get all zodiac signs
 */
export function getAllZodiacSigns(): ZodiacSign[] {
  return Object.values(ZODIAC_SIGNS);
}

/**
 * Get zodiac sign by name
 */
export function getZodiacByName(name: string): ZodiacSign | undefined {
  return Object.values(ZODIAC_SIGNS).find(
    (z) => z.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get zodiac sign by sign key
 */
export function getZodiacBySign(sign: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS[sign.toLowerCase()];
}
