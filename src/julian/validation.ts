import type { CivilDate } from "../date/civil-date.ts";
import { isValidDateFields } from "../internal/calendar.ts";

/** A year-month-day tuple interpreted under the Julian calendar. */
export type JulianDate = CivilDate;

/**
 * Check whether fields form a Julian date in the supported CE range.
 *
 * @param date Candidate Julian year, month, and day fields.
 * @returns `true` when valid under the Julian leap rule; otherwise `false`.
 */
export function validateJulianDate(date: JulianDate): boolean {
  return isValidDateFields(date, true);
}
