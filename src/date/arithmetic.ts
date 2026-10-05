import type { CivilDate } from "./civil-date.ts";
import {
  assertDateFields,
  assertSupportedOutput,
  gregorianToJdnUnchecked,
  jdnToGregorianUnchecked,
  monthLength,
} from "../internal/calendar.ts";

/**
 * Count Gregorian calendar days from one date to another.
 *
 * @param from Start date.
 * @param to End date.
 * @returns A signed integer: positive when `to` is later and negative when earlier.
 */
export function daysBetween(from: CivilDate, to: CivilDate): number {
  assertDateFields(from);
  assertDateFields(to);
  return gregorianToJdnUnchecked(to) - gregorianToJdnUnchecked(from);
}

/**
 * Add or subtract whole Gregorian calendar days.
 *
 * @param date Valid Gregorian starting date.
 * @param amount Safe integer day count; negative values move backward.
 * @returns A frozen date-only value.
 * @throws `RangeError` for a non-integer amount or a result outside years 1 through 9999.
 * @example `addDays({ year: 2026, month: 12, day: 31 }, 1)` returns 2027-01-01.
 */
export function addDays(date: CivilDate, amount: number): CivilDate {
  assertDateFields(date);
  if (!Number.isSafeInteger(amount)) throw new RangeError("day amount must be a safe integer");
  const result = jdnToGregorianUnchecked(gregorianToJdnUnchecked(date) + amount);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/**
 * Add or subtract calendar months, clamping an unavailable day to month end.
 *
 * @param date Valid Gregorian starting date.
 * @param amount Safe integer month count; negative values move backward.
 * @returns A frozen date-only value with its original day preserved when possible.
 * @throws `RangeError` for a non-integer amount or a result outside years 1 through 9999.
 * @example `addMonths({ year: 2027, month: 1, day: 31 }, 1)` returns 2027-02-28.
 */
export function addMonths(date: CivilDate, amount: number): CivilDate {
  assertDateFields(date);
  if (!Number.isSafeInteger(amount)) throw new RangeError("month amount must be a safe integer");
  const index = (date.year - 1) * 12 + (date.month - 1) + amount;
  if (index < 0 || index >= 9999 * 12) {
    throw new RangeError("result is outside the supported year range 1..9999");
  }
  const year = Math.floor(index / 12) + 1;
  const month = (index % 12) + 1;
  return Object.freeze({ year, month, day: Math.min(date.day, monthLength(year, month, false)) });
}

/**
 * Add or subtract calendar years, clamping February 29 to February 28 in common years.
 *
 * @param date Valid Gregorian starting date.
 * @param amount Safe integer year count; negative values move backward.
 * @returns A frozen date-only value.
 * @throws `RangeError` for a non-integer amount or a result outside years 1 through 9999.
 */
export function addYears(date: CivilDate, amount: number): CivilDate {
  assertDateFields(date);
  if (!Number.isSafeInteger(amount)) throw new RangeError("year amount must be a safe integer");
  const year = date.year + amount;
  if (year < 1 || year > 9999) {
    throw new RangeError("result is outside the supported year range 1..9999");
  }
  return Object.freeze({
    year,
    month: date.month,
    day: Math.min(date.day, monthLength(year, date.month, false)),
  });
}
