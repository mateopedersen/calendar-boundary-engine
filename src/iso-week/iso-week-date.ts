import type { CivilDate } from "../date/civil-date.ts";
import {
  assertDateFields,
  assertJdn,
  assertSupportedOutput,
  gregorianToJdnUnchecked,
  jdnToGregorianUnchecked,
  weekdayIso,
} from "../internal/calendar.ts";

/** ISO 8601 week-year, week number, and Monday-based weekday. */
export interface IsoWeekDate {
  /** ISO week-year, which may differ from the Gregorian year near New Year. */
  readonly weekYear: number;
  /** ISO week number, from 1 through 52 or 53. */
  readonly week: number;
  /** ISO weekday: Monday 1 through Sunday 7. */
  readonly weekday: number;
}

function mondayOfWeek(jdn: number): number {
  return jdn - (weekdayIso(jdn) - 1);
}

function jan4Jdn(year: number): number {
  return gregorianToJdnUnchecked({ year, month: 1, day: 4 });
}

/**
 * Convert a Gregorian date to its ISO 8601 week date.
 *
 * Throws when the corresponding ISO week-year falls outside CE years 1 through 9999.
 */
export function toIsoWeekDate(date: CivilDate): IsoWeekDate {
  assertDateFields(date);
  const jdn = gregorianToJdnUnchecked(date);
  const weekday = weekdayIso(jdn);
  let weekYear = date.year;
  if (date.month === 1 && date.day <= 3 && weekday >= 5) weekYear--;
  else if (date.month === 12 && date.day >= 29 && weekday <= 3) weekYear++;
  if (weekYear < 1 || weekYear > 9999) {
    throw new RangeError("ISO week-year is outside the supported range 1..9999");
  }
  const firstMonday = mondayOfWeek(jan4Jdn(weekYear));
  return Object.freeze({ weekYear, week: Math.floor((jdn - firstMonday) / 7) + 1, weekday });
}

/**
 * Convert an ISO week date to a Gregorian date after validating week and weekday.
 *
 * Throws when the resulting Gregorian date is outside CE years 1 through 9999.
 */
export function fromIsoWeekDate(value: IsoWeekDate): CivilDate {
  if (!Number.isInteger(value.weekYear) || value.weekYear < 1 || value.weekYear > 9999) {
    throw new RangeError("weekYear must be an integer from 1 through 9999");
  }
  if (
    !Number.isInteger(value.week) || value.week < 1 || value.week > isoWeeksInYear(value.weekYear)
  ) throw new RangeError("week is invalid for the requested ISO week-year");
  if (!Number.isInteger(value.weekday) || value.weekday < 1 || value.weekday > 7) {
    throw new RangeError("weekday must be an integer from 1 through 7");
  }
  const jdn = mondayOfWeek(jan4Jdn(value.weekYear)) + (value.week - 1) * 7 + value.weekday - 1;
  const result = jdnToGregorianUnchecked(jdn);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/** Return 52 or 53, according to the ISO week-year rules. */
export function isoWeeksInYear(year: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError("year must be an integer from 1 through 9999");
  }
  const dec28 = gregorianToJdnUnchecked({ year, month: 12, day: 28 });
  const weekYear = toIsoWeekDate(jdnToGregorianUnchecked(dec28)).weekYear;
  return Math.floor((dec28 - mondayOfWeek(jan4Jdn(weekYear))) / 7) + 1;
}

/** Return the Monday at the start of the ISO week containing `date`. */
export function startOfIsoWeek(date: CivilDate): CivilDate {
  assertDateFields(date);
  const result = jdnToGregorianUnchecked(mondayOfWeek(gregorianToJdnUnchecked(date)));
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/** Return the Sunday at the end of the ISO week containing `date`. */
export function endOfIsoWeek(date: CivilDate): CivilDate {
  assertDateFields(date);
  const result = jdnToGregorianUnchecked(mondayOfWeek(gregorianToJdnUnchecked(date)) + 6);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/** Validate an arbitrary integer day value before using it as an ISO week source. */
export function assertIsoJdn(jdn: number): void {
  assertJdn(jdn);
}
