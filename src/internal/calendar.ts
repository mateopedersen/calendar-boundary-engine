import type { CivilDate } from "../date/civil-date.ts";

export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;

export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

export function isValidYearMonth(year: number, month: number): boolean {
  return isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR &&
    isInteger(month) && month >= 1 && month <= 12;
}

export function assertYearMonth(year: number, month: number): void {
  if (!isValidYearMonth(year, month)) {
    throw new RangeError(`year must be ${MIN_YEAR}..${MAX_YEAR} and month must be 1..12`);
  }
}

export function isGregorianLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export function isJulianLeapYear(year: number): boolean {
  return year % 4 === 0;
}

export function monthLength(year: number, month: number, julian: boolean): number {
  if (!isValidYearMonth(year, month)) return 0;
  switch (month) {
    case 2:
      return (julian ? isJulianLeapYear(year) : isGregorianLeapYear(year)) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

export function isValidDateFields(date: CivilDate, julian = false): boolean {
  if (!isValidYearMonth(date.year, date.month) || !isInteger(date.day)) return false;
  const length = monthLength(date.year, date.month, julian);
  return date.day >= 1 && date.day <= length;
}

export function assertDateFields(date: CivilDate, julian = false): void {
  if (!isValidDateFields(date, julian)) {
    const system = julian ? "Julian" : "Gregorian";
    throw new RangeError(`invalid ${system} date: ${date.year}-${date.month}-${date.day}`);
  }
}

export function compareCivilDateLabels(a: CivilDate, b: CivilDate): -1 | 0 | 1 {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/** Convert a Gregorian CE date to an integer Julian Day Number. */
export function gregorianToJdnUnchecked(date: CivilDate): number {
  const a = Math.floor((14 - date.month) / 12);
  const y = date.year + 4800 - a;
  const m = date.month + 12 * a - 3;
  return date.day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/** Convert a Julian CE date to an integer Julian Day Number. */
export function julianToJdnUnchecked(date: CivilDate): number {
  const a = Math.floor((14 - date.month) / 12);
  const y = date.year + 4800 - a;
  const m = date.month + 12 * a - 3;
  return date.day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - 32083;
}

export function jdnToGregorianUnchecked(jdn: number): CivilDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function jdnToJulianUnchecked(jdn: number): CivilDate {
  const c = jdn + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function assertJdn(jdn: number): void {
  if (!Number.isSafeInteger(jdn)) throw new RangeError("Julian Day Number must be a safe integer");
}

export function assertSupportedOutput(date: CivilDate, julian = false): void {
  if (date.year < MIN_YEAR || date.year > MAX_YEAR || !isValidDateFields(date, julian)) {
    throw new RangeError("conversion result is outside the supported CE year range 1..9999");
  }
}

export function weekdaySundayZero(jdn: number): number {
  return ((jdn + 1) % 7 + 7) % 7;
}

export function weekdayIso(jdn: number): number {
  return ((jdn % 7) + 7) % 7 + 1;
}
