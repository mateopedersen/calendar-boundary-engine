import type { CivilDate } from "../date/civil-date.ts";
import {
  assertDateFields,
  gregorianToJdnUnchecked,
  weekdaySundayZero,
} from "../internal/calendar.ts";

/** Return weekday as an integer: Sunday 0, Monday 1, ..., Saturday 6. */
export function dayOfWeek(date: CivilDate): number {
  assertDateFields(date);
  return weekdaySundayZero(gregorianToJdnUnchecked(date));
}

/** Validate Gregorian fields; return false instead of throwing for invalid fields. */
export function validateGregorianDate(date: CivilDate): boolean {
  try {
    assertDateFields(date);
    return true;
  } catch {
    return false;
  }
}
