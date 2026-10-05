import type { JulianDate } from "./validation.ts";
import {
  assertDateFields,
  assertSupportedOutput,
  jdnToJulianUnchecked,
  julianToJdnUnchecked,
} from "../internal/calendar.ts";

/**
 * Add or subtract whole days using Julian calendar labels.
 *
 * @param date Valid Julian date label.
 * @param amount Safe integer day count; negative values move backward.
 * @returns A frozen Julian date label.
 * @throws `RangeError` for invalid dates, non-integer amounts, or results outside years 1..9999.
 */
export function addJulianDays(date: JulianDate, amount: number): JulianDate {
  assertDateFields(date, true);
  if (!Number.isSafeInteger(amount)) throw new RangeError("day amount must be a safe integer");
  const result = jdnToJulianUnchecked(julianToJdnUnchecked(date) + amount);
  assertSupportedOutput(result, true);
  return Object.freeze(result);
}

/**
 * Count integer calendar days between Julian date labels.
 *
 * @param from Starting Julian date label.
 * @param to Ending Julian date label.
 * @returns Signed day count from `from` to `to`.
 * @throws `RangeError` if either label is invalid under Julian rules.
 */
export function daysBetweenJulianDates(from: JulianDate, to: JulianDate): number {
  assertDateFields(from, true);
  assertDateFields(to, true);
  return julianToJdnUnchecked(to) - julianToJdnUnchecked(from);
}
