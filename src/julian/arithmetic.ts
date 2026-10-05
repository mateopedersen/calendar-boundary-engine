import type { JulianDate } from "./validation.ts";
import {
  assertDateFields,
  assertSupportedOutput,
  jdnToJulianUnchecked,
  julianToJdnUnchecked,
} from "../internal/calendar.ts";

/** Add an integer number of days under Julian calendar rules. */
export function addJulianDays(date: JulianDate, amount: number): JulianDate {
  assertDateFields(date, true);
  if (!Number.isSafeInteger(amount)) throw new RangeError("day amount must be a safe integer");
  const result = jdnToJulianUnchecked(julianToJdnUnchecked(date) + amount);
  assertSupportedOutput(result, true);
  return Object.freeze(result);
}

/** Return the signed whole-day difference from one Julian date label to another. */
export function daysBetweenJulianDates(from: JulianDate, to: JulianDate): number {
  assertDateFields(from, true);
  assertDateFields(to, true);
  return julianToJdnUnchecked(to) - julianToJdnUnchecked(from);
}
