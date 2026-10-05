import type { CivilDate } from "../date/civil-date.ts";
import {
  assertDateFields,
  assertJdn,
  assertSupportedOutput,
  gregorianToJdnUnchecked,
  jdnToGregorianUnchecked,
  jdnToJulianUnchecked,
  julianToJdnUnchecked,
} from "../internal/calendar.ts";
import type { JulianDate } from "../julian/validation.ts";

/** Convert a valid proleptic Gregorian CE date to an integer Julian Day Number. */
export function gregorianToJdn(date: CivilDate): number {
  assertDateFields(date);
  return gregorianToJdnUnchecked(date);
}

/** Convert an integer Julian Day Number to a Gregorian CE date (years 1..9999). */
export function jdnToGregorian(jdn: number): CivilDate {
  assertJdn(jdn);
  const result = jdnToGregorianUnchecked(jdn);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/** Convert a valid Julian CE date to an integer Julian Day Number. */
export function julianToJdn(date: JulianDate): number {
  assertDateFields(date, true);
  return julianToJdnUnchecked(date);
}

/** Convert an integer Julian Day Number to a Julian CE date (years 1..9999). */
export function jdnToJulian(jdn: number): JulianDate {
  assertJdn(jdn);
  const result = jdnToJulianUnchecked(jdn);
  assertSupportedOutput(result, true);
  return Object.freeze(result);
}

/** Convert a Gregorian date to its Julian-calendar label for the same integer day. */
export function gregorianToJulian(date: CivilDate): JulianDate {
  return jdnToJulian(gregorianToJdn(date));
}

/** Convert a Julian-calendar date to its Gregorian label for the same integer day. */
export function julianToGregorian(date: JulianDate): CivilDate {
  return jdnToGregorian(julianToJdn(date));
}
