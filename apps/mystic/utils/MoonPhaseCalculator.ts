/**
 * Moon Phase Calculator
 * Accurate astronomical calculations for moon phases, illumination, and lunar zodiac
 */

export interface MoonPhaseInfo {
  phaseName: string;
  illumination: number; // 0-100%
  phaseEmoji: string;
  age: number; // days since new moon (0-29.53)
  zodiacSign: string;
  zodiacEmoji: string;
  daysUntilFullMoon: number;
  daysUntilNewMoon: number;
}

export interface NextPhaseDate {
  phaseName: string;
  date: Date;
  emoji: string;
}

// Constants
const LUNAR_CYCLE = 29.53058867; // Synodic month in days
const NEW_MOON_EPOCH = 2451549.5; // JDN for new moon nearest to epoch

// Zodiac signs with emojis
const ZODIAC_SIGNS = [
  { name: 'Aries', emoji: '♈', start: 0 },
  { name: 'Taurus', emoji: '♉', start: 30 },
  { name: 'Gemini', emoji: '♊', start: 60 },
  { name: 'Cancer', emoji: '♋', start: 90 },
  { name: 'Leo', emoji: '♌', start: 120 },
  { name: 'Virgo', emoji: '♍', start: 150 },
  { name: 'Libra', emoji: '♎', start: 180 },
  { name: 'Scorpio', emoji: '♏', start: 210 },
  { name: 'Sagittarius', emoji: '♐', start: 240 },
  { name: 'Capricorn', emoji: '♑', start: 270 },
  { name: 'Aquarius', emoji: '♒', start: 300 },
  { name: 'Pisces', emoji: '♓', start: 330 },
];

/**
 * Convert calendar date to Julian Day Number
 */
function dateToJDN(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + date.getUTCHours() / 24;

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  return jdn;
}

/**
 * Convert Julian Day Number to calendar date
 */
function jdnToDate(jdn: number): Date {
  const z = Math.floor(jdn + 0.5);
  const a = z < 2299161 ? z : z + 1 + Math.floor((z - 1867216.25) / 36524.25) - Math.floor((z - 1867216.25) / 146096.25);
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = c - (month > 2 ? 4716 : 4715);

  return new Date(Date.UTC(year, month - 1, Math.floor(day)));
}

/**
 * Calculate days since new moon for a given date
 */
function daysSinceNewMoon(date: Date): number {
  const jdn = dateToJDN(date);
  const daysSinceEpoch = jdn - NEW_MOON_EPOCH;
  const cycles = daysSinceEpoch / LUNAR_CYCLE;
  const dayInCycle = (cycles - Math.floor(cycles)) * LUNAR_CYCLE;

  return dayInCycle < 0 ? dayInCycle + LUNAR_CYCLE : dayInCycle;
}

/**
 * Get moon phase name based on age (days since new moon)
 */
function getPhaseNameAndEmoji(age: number): { name: string; emoji: string } {
  const normalizedAge = age % LUNAR_CYCLE;

  if (normalizedAge < 1.84) return { name: 'New Moon', emoji: '🌑' };
  if (normalizedAge < 7.38) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (normalizedAge < 9.23) return { name: 'First Quarter', emoji: '🌓' };
  if (normalizedAge < 14.77) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (normalizedAge < 16.61) return { name: 'Full Moon', emoji: '🌕' };
  if (normalizedAge < 22.15) return { name: 'Waning Gibbous', emoji: '🌖' };
  if (normalizedAge < 23.99) return { name: 'Last Quarter', emoji: '🌗' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

/**
 * Calculate moon illumination percentage
 */
function calculateIllumination(age: number): number {
  const normalizedAge = age % LUNAR_CYCLE;
  const phase = (normalizedAge / LUNAR_CYCLE) * Math.PI * 2;
  const illumination = (1 - Math.cos(phase)) / 2;
  return Math.round(illumination * 100);
}

/**
 * Determine lunar zodiac sign
 */
function getLunarZodiac(date: Date): { sign: string; emoji: string } {
  const age = daysSinceNewMoon(date);
  const dayInZodiac = (age / LUNAR_CYCLE) * 360; // Degree in lunar month

  for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
    const current = ZODIAC_SIGNS[i];
    const next = ZODIAC_SIGNS[(i + 1) % ZODIAC_SIGNS.length];
    const nextStart = next.start === 0 ? 360 : next.start;

    if (dayInZodiac >= current.start && dayInZodiac < nextStart) {
      return { sign: current.name, emoji: current.emoji };
    }
  }

  return { sign: 'Pisces', emoji: '♓' };
}

/**
 * Calculate moon phase information for a given date
 */
export function calculateMoonPhase(date: Date): MoonPhaseInfo {
  const age = daysSinceNewMoon(date);
  const { name, emoji } = getPhaseNameAndEmoji(age);
  const illumination = calculateIllumination(age);
  const { sign: zodiacSign, emoji: zodiacEmoji } = getLunarZodiac(date);

  // Calculate days until next full and new moon
  const daysInCycle = age % LUNAR_CYCLE;
  const fullMoonDay = LUNAR_CYCLE / 2; // ~14.76 days
  const daysUntilFullMoon = daysInCycle > fullMoonDay ? LUNAR_CYCLE - daysInCycle + fullMoonDay : fullMoonDay - daysInCycle;
  const daysUntilNewMoon = LUNAR_CYCLE - daysInCycle;

  return {
    phaseName: name,
    illumination,
    phaseEmoji: emoji,
    age: Math.round(age * 100) / 100,
    zodiacSign,
    zodiacEmoji,
    daysUntilFullMoon: Math.round(daysUntilFullMoon * 10) / 10,
    daysUntilNewMoon: Math.round(daysUntilNewMoon * 10) / 10,
  };
}

/**
 * Get next phase dates from a given date
 */
export function getNextPhaseDates(fromDate: Date, count: number = 4): NextPhaseDate[] {
  const results: NextPhaseDate[] = [];
  const jdn = dateToJDN(fromDate);
  let searchJdn = jdn;

  const phaseTargets = [0, 7.38, 14.76, 22.15]; // New, 1st Quarter, Full, Last Quarter
  let foundPhases = new Set<number>();

  while (results.length < count && searchJdn < jdn + 180) {
    const dayInCycle = ((searchJdn - NEW_MOON_EPOCH) % LUNAR_CYCLE) / LUNAR_CYCLE;
    const phase = dayInCycle * LUNAR_CYCLE;

    for (let target of phaseTargets) {
      const tolerance = 0.2;
      if (Math.abs(phase - target) < tolerance && !foundPhases.has(target)) {
        foundPhases.add(target);
        const resultDate = jdnToDate(searchJdn);

        let phaseName = '';
        let emoji = '';

        if (target < 1) {
          phaseName = 'New Moon';
          emoji = '🌑';
        } else if (target < 8) {
          phaseName = 'First Quarter';
          emoji = '🌓';
        } else if (target < 15) {
          phaseName = 'Full Moon';
          emoji = '🌕';
        } else {
          phaseName = 'Last Quarter';
          emoji = '🌗';
        }

        if (resultDate >= fromDate) {
          results.push({ phaseName, date: resultDate, emoji });
        }
        break;
      }
    }
    searchJdn += 0.5;
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count);
}

/**
 * Get calendar of moon phases for specified days
 */
export function getMonthCalendar(startDate: Date, days: number = 14): MoonPhaseInfo[] {
  const calendar: MoonPhaseInfo[] = [];
  const currentDate = new Date(startDate);
  currentDate.setUTCHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    calendar.push(calculateMoonPhase(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return calendar;
}

/**
 * Format date for display
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format date with day of week
 */
export function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
