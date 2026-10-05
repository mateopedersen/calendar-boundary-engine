import { assertYearMonth, isJulianLeapYear as leap, monthLength } from "../internal/calendar.ts";

/**
 * Apply the Julian calendar's every-fourth-year leap rule.
 *
 * @param year CE year from 1 through 9999.
 * @returns `true` when the year is divisible by four.
 * @throws `RangeError` for non-integer or out-of-range years.
 * @example 1900 is a Julian leap year even though it is not Gregorian leap year.
 */
export function isJulianLeapYear(year: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError("year must be an integer from 1 through 9999");
  }
  return leap(year);
}

/**
 * Get the number of days in a Julian-calendar month.
 *
 * @param year Integer CE year from 1 through 9999.
 * @param month Integer month number from 1 through 12.
 * @returns 28–31 for valid fields, or `0` when the year or month is out of range.
 */
export function daysInJulianMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return 0;
  if (!Number.isInteger(month) || month < 1 || month > 12) return 0;
  assertYearMonth(year, month);
  return monthLength(year, month, true);
}
