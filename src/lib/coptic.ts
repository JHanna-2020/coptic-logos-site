/**
 * Coptic calendar helpers.
 *
 * The Coptic year is 13 months: twelve months of exactly 30 days, then a short
 * thirteenth month ("Pi Kogi Enavot", the little month) of 5 days — 6 in a leap
 * year. That structure is the whole visual idea of this page, so it is worth
 * getting exactly right rather than approximating.
 *
 * Dates come from Intl, which ships a real Coptic calendar implementation in
 * every modern browser and in Node. We do not hand-roll the conversion.
 */

export const COPTIC_MONTHS = [
  'Thout',
  'Paopi',
  'Hathor',
  'Koiak',
  'Tobi',
  'Meshir',
  'Paremhat',
  'Parmouti',
  'Pashons',
  'Paoni',
  'Epip',
  'Mesori',
  'Pi Kogi Enavot',
] as const;

export interface CopticDate {
  /** 1–13 */
  month: number;
  /** 1–30, or 1–5/6 in the thirteenth month */
  day: number;
  /** Anno Martyrum */
  year: number;
  monthName: string;
}

const partsFormatter = new Intl.DateTimeFormat('en-u-ca-coptic', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Convert a Gregorian date to its Coptic equivalent. */
export function toCoptic(date: Date): CopticDate {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map((p) => [p.type, p.value])
  );
  const month = Number(parts.month);
  return {
    month,
    day: Number(parts.day),
    year: Number(parts.year),
    monthName: COPTIC_MONTHS[month - 1],
  };
}

/**
 * A Coptic year is a leap year when `year mod 4 === 3`. The extra day lands in
 * the thirteenth month, giving it 6 days instead of 5.
 */
export function isLeapYear(copticYear: number): boolean {
  return copticYear % 4 === 3;
}

/** Days in each of the 13 months, for a given Coptic year. */
export function monthLengths(copticYear: number): number[] {
  return [...Array(12).fill(30), isLeapYear(copticYear) ? 6 : 5];
}

/** Which day of the Coptic year this is — 1 through 365 (or 366). */
export function dayOfYear(date: CopticDate): number {
  return (date.month - 1) * 30 + date.day;
}

export function daysInYear(copticYear: number): number {
  return isLeapYear(copticYear) ? 366 : 365;
}

/**
 * The Gregorian date a Coptic day falls on. Used for the grid's hover labels,
 * so every dot can say what day it actually is.
 */
export function toGregorian(
  copticYear: number,
  month: number,
  day: number
): Date {
  // 1 Thout of Coptic year Y falls on 11 or 12 September of Y + 283.
  // Rather than encode that rule, walk out from a known anchor: search the
  // Gregorian window that must contain it. Cheap, and it cannot drift.
  const approx = Date.UTC(copticYear + 283, 8, 11);
  for (let offset = -2; offset <= 2; offset++) {
    const candidate = new Date(approx + offset * 86_400_000);
    const c = toCoptic(candidate);
    if (c.year === copticYear && c.month === 1 && c.day === 1) {
      return new Date(candidate.getTime() + (dayOfYear({ month, day, year: copticYear, monthName: '' }) - 1) * 86_400_000);
    }
  }
  throw new Error(`Could not locate 1 Thout ${copticYear}`);
}

/** "Wednesday, 12 August 2026" */
export function formatGregorian(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "6 Mesori 1742 A.M." */
export function formatCoptic(date: CopticDate): string {
  return `${date.day} ${date.monthName} ${date.year} A.M.`;
}
