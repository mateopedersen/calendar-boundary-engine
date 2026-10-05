import type { CivilDate } from "../date/civil-date.ts";
import type { IsoWeekDate } from "../iso-week/iso-week-date.ts";

/** Diagnostic facts derived from two Gregorian dates. */
export interface CalendarBoundaryAnalysis {
  /** Starting date supplied to the analyzer. */
  readonly from: CivilDate;
  /** Ending date supplied to the analyzer. */
  readonly to: CivilDate;
  /** Signed number of Gregorian days from `from` to `to`. */
  readonly dayDelta: number;
  /** Whether `to` is exactly one day after `from`. */
  readonly consecutive: boolean;
  /** Whether the labels differ by month. */
  readonly crossesMonth: boolean;
  /** Whether the labels differ by civil year. */
  readonly crossesYear: boolean;
  /** Whether the labels differ by calendar quarter. */
  readonly crossesQuarter: boolean;
  /** Whether their ISO week number differs. */
  readonly crossesIsoWeek: boolean;
  /** Whether their ISO week-year differs. */
  readonly crossesIsoWeekYear: boolean;
  /** Whether the transition enters or leaves February 29. */
  readonly crossesLeapDay: boolean;
  /** Whether a year changes and either endpoint year is a Gregorian leap year. */
  readonly touchesLeapYearBoundary: boolean;
  /** ISO week dates for both endpoints. */
  readonly isoWeek: Readonly<{ from: IsoWeekDate; to: IsoWeekDate }>;
  /** Difference in Julian-vs-Gregorian day labels at each endpoint. */
  readonly julianGregorianOffsetDays: Readonly<{ from: number; to: number }>;
  /** Whether the calendar offset differs between endpoints. */
  readonly julianGregorianOffsetChanged: boolean;
}
