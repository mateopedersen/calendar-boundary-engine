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

/** Create and validate a Gregorian civil date in the supported CE range. */
export function createCivilDate(year: number, month: number, day: number): CivilDate {
  const date: CivilDate = Object.freeze({ year, month, day });
  assertDateFields(date);
  return date;
}

/** Return whether a value has valid Gregorian date fields in the supported range. */
export function isValidCivilDate(date: CivilDate): boolean {
  return isValidDateFields(date);
}

/** Compare two civil dates lexicographically; return -1, 0, or 1. */
export function compareCivilDates(a: CivilDate, b: CivilDate): -1 | 0 | 1 {
  assertDateFields(a);
  assertDateFields(b);
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/** Format a civil date as an ISO-like, zero-padded `YYYY-MM-DD` string. */
export function formatCivilDate(date: CivilDate): string {
  assertDateFields(date);
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${
    String(date.day).padStart(2, "0")
  }`;
}
