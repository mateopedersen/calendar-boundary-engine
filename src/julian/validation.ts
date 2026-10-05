import type { CivilDate } from "../date/civil-date.ts";
import { isValidDateFields } from "../internal/calendar.ts";

/** A year-month-day tuple interpreted under the Julian calendar. */
export type JulianDate = CivilDate;

/** Return whether fields form a valid Julian date in CE years 1 through 9999. */
export function validateJulianDate(date: JulianDate): boolean {
  return isValidDateFields(date, true);
}
