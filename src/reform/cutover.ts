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

/**
 * Define a jurisdiction-specific transition from a final Julian label to a first Gregorian label.
 *
 * @param lastJulianDate Final label interpreted with Julian rules.
 * @param firstGregorianDate First label interpreted with Gregorian rules.
 * @returns Frozen policy after checking that the two labels describe consecutive integer days.
 * @throws `RangeError` when labels are invalid, reversed, or not consecutive across systems.
 * @example `createCutoverPolicy({year:1582,month:10,day:4}, {year:1582,month:10,day:15})`.
 */
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

/**
 * Check whether a Gregorian date label lies inside the omitted label interval.
 *
 * @param date Candidate Gregorian date label.
 * @param policy Previously validated jurisdiction-specific cutover.
 * @returns `true` strictly between the final Julian and first Gregorian labels.
 * @throws `RangeError` when `date` is not a supported Gregorian date.
 */
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
 *
 * @param date Supported Gregorian-shaped date label to interpret.
 * @param policy Validated transition policy selecting Julian or Gregorian interpretation.
 * @returns The proleptic Gregorian label representing the interpreted day.
 * @throws `RangeError` when the label is skipped or the converted date is out of range.
 */
export function convertAcrossCutover(date: CivilDate, policy: CutoverPolicy): CivilDate {
  assertDateFields(date);
  if (isDateSkippedByCutover(date, policy)) {
    throw new RangeError("date label is skipped by the configured cutover");
  }
  const isJulianSide = compareCivilDateLabels(date, policy.lastJulianDate) <= 0;
  return isJulianSide ? julianToGregorian(date) : Object.freeze({ ...date });
}

/**
 * Example policy for the 1582 transition from Julian 1582-10-04 to Gregorian 1582-10-15.
 *
 * This is one historical transition example, not a universal adoption date or a jurisdiction
 * database. Adoption dates varied across countries and communities.
 */
export const GREGORIAN_REFORM_1582: CutoverPolicy = createCutoverPolicy(
  { year: 1582, month: 10, day: 4 },
  { year: 1582, month: 10, day: 15 },
);
