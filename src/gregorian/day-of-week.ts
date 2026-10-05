import type { CivilDate } from "../date/civil-date.ts";
import {
  assertDateFields,
  gregorianToJdnUnchecked,
  weekdaySundayZero,
} from "../internal/calendar.ts";

/**
 * Calculate a Gregorian date's weekday index.
 *
 * @param date Valid Gregorian date.
 * @returns Sunday `0`, Monday `1`, ..., Saturday `6`.
 * @throws `RangeError` when `date` is invalid.
 */
export function dayOfWeek(date: CivilDate): number {
  assertDateFields(date);
  return weekdaySundayZero(gregorianToJdnUnchecked(date));
}

/**
 * Validate Gregorian date fields without throwing.
 *
 * @param date Candidate year, month, and day fields.
 * @returns `true` when the fields form a supported Gregorian date; otherwise `false`.
 */
export function validateGregorianDate(date: CivilDate): boolean {
  try {
    assertDateFields(date);
    return true;
  } catch {
    return false;
  }
}
