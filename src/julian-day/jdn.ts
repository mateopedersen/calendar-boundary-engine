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

/**
 * Convert a proleptic Gregorian date label to an integer Julian Day Number.
 *
 * @param date Valid Gregorian date in CE years 1 through 9999.
 * @returns Integer JDN for the represented day; no fractional noon-based JDN is used.
 * @throws `RangeError` when the input is not a supported Gregorian date.
 */
export function gregorianToJdn(date: CivilDate): number {
  assertDateFields(date);
  return gregorianToJdnUnchecked(date);
}

/**
 * Convert an integer Julian Day Number to its Gregorian date label.
 *
 * @param jdn Safe integer day number.
 * @returns Frozen Gregorian date in CE years 1 through 9999.
 * @throws `RangeError` for non-integers or conversion results outside the supported range.
 */
export function jdnToGregorian(jdn: number): CivilDate {
  assertJdn(jdn);
  const result = jdnToGregorianUnchecked(jdn);
  assertSupportedOutput(result);
  return Object.freeze(result);
}

/**
 * Convert a Julian-calendar date label to an integer Julian Day Number.
 *
 * @param date Valid Julian date in CE years 1 through 9999.
 * @returns Integer JDN for the represented day.
 * @throws `RangeError` when the fields are invalid under Julian rules.
 */
export function julianToJdn(date: JulianDate): number {
  assertDateFields(date, true);
  return julianToJdnUnchecked(date);
}

/**
 * Convert an integer Julian Day Number to its Julian-calendar date label.
 *
 * @param jdn Safe integer day number.
 * @returns Frozen Julian date in CE years 1 through 9999.
 * @throws `RangeError` for non-integers or conversion results outside the supported range.
 */
export function jdnToJulian(jdn: number): JulianDate {
  assertJdn(jdn);
  const result = jdnToJulianUnchecked(jdn);
  assertSupportedOutput(result, true);
  return Object.freeze(result);
}

/**
 * Convert a Gregorian label to the Julian label for the same integer day.
 *
 * @param date Valid Gregorian date.
 * @returns Corresponding Julian date label.
 * @throws `RangeError` when the Julian label falls outside CE years 1 through 9999.
 */
export function gregorianToJulian(date: CivilDate): JulianDate {
  return jdnToJulian(gregorianToJdn(date));
}

/**
 * Convert a Julian label to the Gregorian label for the same integer day.
 *
 * @param date Valid Julian date.
 * @returns Corresponding Gregorian date label.
 * @throws `RangeError` when the Gregorian label falls outside CE years 1 through 9999.
 */
export function julianToGregorian(date: JulianDate): CivilDate {
  return jdnToGregorian(julianToJdn(date));
}
