import { isGregorianLeapYear as leap } from "../internal/calendar.ts";

/**
 * Apply the Gregorian 4/100/400 leap-year rule.
 *
 * @param year CE year from 1 through 9999.
 * @returns `true` when the year has February 29.
 * @throws `RangeError` for non-integer or out-of-range years.
 * @example 1900 is common, 2000 is leap, and 2100 is common.
 */
export function isGregorianLeapYear(year: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError("year must be an integer from 1 through 9999");
  }
  return leap(year);
}

/**
 * Get the number of days in a proleptic Gregorian month.
 *
 * @param year Integer CE year from 1 through 9999.
 * @param month Integer month number from 1 through 12.
 * @returns 28–31 for valid fields, or `0` when the year or month is out of range.
 */
export function daysInGregorianMonth(year: number, month: number): number {
  return (year >= 1 && year <= 9999 && Number.isInteger(year))
    ? (month >= 1 && month <= 12 && Number.isInteger(month)
      ? (month === 2 ? (leap(year) ? 29 : 28) : ([4, 6, 9, 11].includes(month) ? 30 : 31))
      : 0)
    : 0;
}
