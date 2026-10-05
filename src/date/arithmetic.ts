import type { CivilDate } from "./civil-date.ts";
import {
  assertDateFields,
  assertSupportedOutput,
  gregorianToJdnUnchecked,
  jdnToGregorianUnchecked,
  monthLength,
} from "../internal/calendar.ts";

/** Return the number of whole Gregorian days from `from` to `to` (signed). */
export function daysBetween(from: CivilDate, to: CivilDate): number {
  assertDateFields(from);
  assertDateFields(to);
  return gregorianToJdnUnchecked(to) - gregorianToJdnUnchecked(from);
}

/** Add an integer number of Gregorian days without creating a timestamp. */
export function addDays(date: CivilDate, amount: number): CivilDate {
  assertDateFields(date);
  if (!Number.isSafeInteger(amount)) throw new RangeError("day amount must be a safe integer");
  const result = jdnToGregorianUnchecked(gregorianToJdnUnchecked(date) + amount);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/** Add months, clamping the day to the last day of the target month. */
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

/** Add years, clamping leap day to February 28 when the target year is common. */
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
