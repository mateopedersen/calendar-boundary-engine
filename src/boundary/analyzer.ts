import type { CivilDate } from "../date/civil-date.ts";
import { daysBetween } from "../date/arithmetic.ts";
import { gregorianToJdn, julianToJdn } from "../julian-day/jdn.ts";
import { isGregorianLeapYear } from "../gregorian/leap-year.ts";
import { toIsoWeekDate } from "../iso-week/iso-week-date.ts";
import type { CalendarBoundaryAnalysis } from "./types.ts";

/** Analyze month, year, quarter, ISO-week, leap-day, and Julian offset transitions. */
export function analyzeCalendarBoundary(from: CivilDate, to: CivilDate): CalendarBoundaryAnalysis {
  const dayDelta = daysBetween(from, to);
  const fromWeek = toIsoWeekDate(from);
  const toWeek = toIsoWeekDate(to);
  const fromOffset = julianToJdn(from) - gregorianToJdn(from);
  const toOffset = julianToJdn(to) - gregorianToJdn(to);
  const fromQuarter = Math.floor((from.month - 1) / 3);
  const toQuarter = Math.floor((to.month - 1) / 3);
  const adjacentLeapDay = dayDelta === 1 &&
    ((from.month === 2 && from.day === 28 && to.month === 2 && to.day === 29) ||
      (from.month === 2 && from.day === 29 && to.month === 3 && to.day === 1));
  const reverseLeapDay = dayDelta === -1 &&
    ((to.month === 2 && to.day === 28 && from.month === 2 && from.day === 29) ||
      (to.month === 2 && to.day === 29 && from.month === 3 && from.day === 1));
  const crossesYear = from.year !== to.year;

  return Object.freeze({
    from: Object.freeze({ ...from }),
    to: Object.freeze({ ...to }),
    dayDelta,
    consecutive: dayDelta === 1,
    crossesMonth: from.year !== to.year || from.month !== to.month,
    crossesYear,
    crossesQuarter: from.year !== to.year || fromQuarter !== toQuarter,
    crossesIsoWeek: fromWeek.weekYear !== toWeek.weekYear || fromWeek.week !== toWeek.week,
    crossesIsoWeekYear: fromWeek.weekYear !== toWeek.weekYear,
    crossesLeapDay: adjacentLeapDay || reverseLeapDay,
    touchesLeapYearBoundary: crossesYear &&
      (isGregorianLeapYear(from.year) || isGregorianLeapYear(to.year)),
    isoWeek: Object.freeze({ from: fromWeek, to: toWeek }),
    julianGregorianOffsetDays: Object.freeze({ from: fromOffset, to: toOffset }),
    julianGregorianOffsetChanged: fromOffset !== toOffset,
  });
}
