import { assertDateFields, isValidDateFields } from "../internal/calendar.ts";

/**
 * A calendar date without a time, time zone, or instant semantics.
 *
 * The supported public range is CE years 1 through 9999 under the proleptic
 * Gregorian calendar. Values are immutable plain data and never carry an offset.
 * @module
 */
export interface CivilDate {
  /** Proleptic Gregorian year, from 1 through 9999 CE. */
  readonly year: number;
  /** Gregorian month number, from 1 (January) through 12 (December). */
  readonly month: number;
  /** Day of the month, beginning at 1. */
  readonly day: number;
}

/**
 * Create a frozen Gregorian civil date.
 *
 * @param year Proleptic Gregorian year, from 1 through 9999 CE.
 * @param month Month number from 1 through 12.
 * @param day One-based day number valid for the requested Gregorian month.
 * @returns An immutable date-only value.
 * @throws `RangeError` when any field is non-integer, out of range, or not a real date.
 * @example `createCivilDate(2024, 2, 29)` creates leap day without making a timestamp.
 */
export function createCivilDate(year: number, month: number, day: number): CivilDate {
  const date: CivilDate = Object.freeze({ year, month, day });
  assertDateFields(date);
  return date;
}

/**
 * Check whether a date-shaped value is a valid Gregorian date in the supported range.
 *
 * @param date Candidate year, month, and day fields.
 * @returns `true` for valid Gregorian CE years 1 through 9999; otherwise `false`.
 */
export function isValidCivilDate(date: CivilDate): boolean {
  return isValidDateFields(date);
}

/**
 * Compare two valid civil dates by year, month, then day.
 *
 * @param a First Gregorian date.
 * @param b Second Gregorian date.
 * @returns `-1` when `a` is earlier, `0` when equal, or `1` when later.
 * @throws `RangeError` if either argument is not a valid supported Gregorian date.
 */
export function compareCivilDates(a: CivilDate, b: CivilDate): -1 | 0 | 1 {
  assertDateFields(a);
  assertDateFields(b);
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/**
 * Format a civil date as a zero-padded `YYYY-MM-DD` label.
 *
 * @param date Valid Gregorian date in the supported range.
 * @returns A stable calendar label; it is not an instant or timezone-bearing string.
 */
export function formatCivilDate(date: CivilDate): string {
  assertDateFields(date);
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${
    String(date.day).padStart(2, "0")
  }`;
}
