import type { CivilDate } from "../date/civil-date.ts";
import { assertDateFields, monthLength } from "../internal/calendar.ts";

/** Return the one-based Gregorian ordinal day (January 1 is 1). */
export function gregorianDayOfYear(date: CivilDate): number {
  assertDateFields(date);
  let result = date.day;
  for (let month = 1; month < date.month; month++) result += monthLength(date.year, month, false);
  return result;
}
