import type { CivilDate } from "../date/civil-date.ts";
import type { JulianDate } from "../julian/validation.ts";
import { assertDateFields, compareCivilDateLabels } from "../internal/calendar.ts";
import { gregorianToJdn, julianToGregorian, julianToJdn } from "../julian-day/jdn.ts";

/** A jurisdiction-specific change from a final Julian date to a first Gregorian date. */
export interface CutoverPolicy {
  /** Last label interpreted in the Julian calendar. */
  readonly lastJulianDate: JulianDate;
  /** First label interpreted in the Gregorian calendar. */
  readonly firstGregorianDate: CivilDate;
}

/** Create a cutover policy whose two dates are consecutive integer days. */
export function createCutoverPolicy(
  lastJulianDate: JulianDate,
  firstGregorianDate: CivilDate,
): CutoverPolicy {
  assertDateFields(lastJulianDate, true);
  assertDateFields(firstGregorianDate);
  if (compareCivilDateLabels(lastJulianDate, firstGregorianDate) >= 0) {
    throw new RangeError("first Gregorian date must follow the last Julian date as a civil label");
  }
  if (gregorianToJdn(firstGregorianDate) !== julianToJdn(lastJulianDate) + 1) {
    throw new RangeError(
      "cutover dates must be consecutive integer days across the calendar systems",
    );
  }
  return Object.freeze({
    lastJulianDate: Object.freeze({ ...lastJulianDate }),
    firstGregorianDate: Object.freeze({ ...firstGregorianDate }),
  });
}

/** Return whether a Gregorian-shaped date label is omitted by this cutover. */
export function isDateSkippedByCutover(date: CivilDate, policy: CutoverPolicy): boolean {
  assertDateFields(date);
  return compareCivilDateLabels(date, policy.lastJulianDate) > 0 &&
    compareCivilDateLabels(date, policy.firstGregorianDate) < 0;
}

/**
 * Interpret a date label on its policy-selected side and return its proleptic Gregorian label.
 *
 * Julian-side labels are converted by integer day number; Gregorian-side labels are returned
 * unchanged. A skipped label throws `RangeError`.
 */
export function convertAcrossCutover(date: CivilDate, policy: CutoverPolicy): CivilDate {
  assertDateFields(date);
  if (isDateSkippedByCutover(date, policy)) {
    throw new RangeError("date label is skipped by the configured cutover");
  }
  const isJulianSide = compareCivilDateLabels(date, policy.lastJulianDate) <= 0;
  return isJulianSide ? julianToGregorian(date) : Object.freeze({ ...date });
}

/** The commonly cited 1582 cutover for example and testing; real adoption was jurisdiction-specific. */
export const GREGORIAN_REFORM_1582: CutoverPolicy = createCutoverPolicy(
  { year: 1582, month: 10, day: 4 },
  { year: 1582, month: 10, day: 15 },
);
