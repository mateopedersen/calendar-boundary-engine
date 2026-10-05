import { assertYearMonth, isJulianLeapYear as leap, monthLength } from "../internal/calendar.ts";

/** Return whether a Julian CE year is divisible by four and has 366 days. */
export function isJulianLeapYear(year: number): boolean {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError("year must be an integer from 1 through 9999");
  }
  return leap(year);
}

/** Return the Julian month length, or zero when year or month is out of range. */
export function daysInJulianMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return 0;
  if (!Number.isInteger(month) || month < 1 || month > 12) return 0;
  assertYearMonth(year, month);
  return monthLength(year, month, true);
}
