import { isGregorianLeapYear as leap } from "../internal/calendar.ts";

/** Return whether a proleptic Gregorian year has 366 days. */
export function isGregorianLeapYear(year: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError("year must be an integer from 1 through 9999");
  }
  return leap(year);
}

/** Return the Gregorian month length, or zero when year or month is out of range. */
export function daysInGregorianMonth(year: number, month: number): number {
  return (year >= 1 && year <= 9999 && Number.isInteger(year))
    ? (month >= 1 && month <= 12 && Number.isInteger(month)
      ? (month === 2 ? (leap(year) ? 29 : 28) : ([4, 6, 9, 11].includes(month) ? 30 : 31))
      : 0)
    : 0;
}
