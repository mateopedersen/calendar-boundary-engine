/**
 * Deterministic, timezone-independent calendar mathematics for date-only software.
 *
 * The engine provides validated civil dates, Gregorian and Julian calendar rules,
 * Julian Day Number conversion, ISO week-years, presentation-neutral month grids,
 * boundary diagnostics, and explicit jurisdiction-neutral cutover policies.
 * Supported date labels use CE years 1 through 9999; astronomical year numbering
 * and a historical adoption database are intentionally out of scope.
 *
 * @example
 * ```ts
 * import { createCivilDate, toIsoWeekDate } from "@betacalendars/calendar-boundary-engine";
 * const week = toIsoWeekDate(createCivilDate(2027, 1, 1));
 * // { weekYear: 2026, week: 53, weekday: 5 }
 * ```
 * @module
 */
export {
  addDays,
  addMonths,
  addYears,
  compareCivilDates,
  createCivilDate,
  dayOfWeek,
  daysBetween,
  formatCivilDate,
  isValidCivilDate,
} from "./date/mod.ts";
export type { CivilDate } from "./date/mod.ts";
export {
  daysInGregorianMonth,
  gregorianDayOfYear,
  isGregorianLeapYear,
  validateGregorianDate,
} from "./gregorian/mod.ts";
export { daysInJulianMonth, isJulianLeapYear, validateJulianDate } from "./julian/mod.ts";
export { addJulianDays, daysBetweenJulianDates } from "./julian/mod.ts";
export type { JulianDate } from "./julian/mod.ts";
export {
  gregorianToJdn,
  gregorianToJulian,
  jdnToGregorian,
  jdnToJulian,
  julianToGregorian,
  julianToJdn,
} from "./julian-day/mod.ts";
export {
  endOfIsoWeek,
  fromIsoWeekDate,
  isoWeeksInYear,
  startOfIsoWeek,
  toIsoWeekDate,
} from "./iso-week/mod.ts";
export type { IsoWeekDate } from "./iso-week/mod.ts";
export { createMonthGrid } from "./grid/mod.ts";
export type { MonthGrid, MonthGridCell, MonthGridOptions } from "./grid/mod.ts";
export { analyzeCalendarBoundary } from "./boundary/mod.ts";
export type { CalendarBoundaryAnalysis } from "./boundary/mod.ts";
export {
  convertAcrossCutover,
  createCutoverPolicy,
  GREGORIAN_REFORM_1582,
  isDateSkippedByCutover,
} from "./reform/mod.ts";
export type { CutoverPolicy } from "./reform/mod.ts";
