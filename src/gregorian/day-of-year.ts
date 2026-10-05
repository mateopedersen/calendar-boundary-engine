import type { CivilDate } from "../date/civil-date.ts";
import { assertDateFields, monthLength } from "../internal/calendar.ts";

/**
 * Calculate a Gregorian date's ordinal day within its year.
 *
 * @param date Valid Gregorian date.
 * @returns One-based day of year; January 1 is 1 and December 31 is 365 or 366.
 * @throws `RangeError` when `date` is invalid.
 */
export function gregorianDayOfYear(date: CivilDate): number {
  assertDateFields(date);
  let result = date.day;
  for (let month = 1; month < date.month; month++) result += monthLength(date.year, month, false);
  return result;
}
