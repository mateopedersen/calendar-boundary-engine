import type { CivilDate } from "../date/civil-date.ts";

/** Options for generating a month grid without presentation or timezone concerns. */
export interface MonthGridOptions {
  /** Gregorian year from 1 through 9999. */
  readonly year: number;
  /** Month number, January 1 through December 12. */
  readonly month: number;
  /** First weekday: Sunday 0 through Saturday 6; defaults to Monday 1. */
  readonly weekStartsOn?: number;
  /** Use six rows (42 cells) when true; otherwise return the natural 4–6 rows. */
  readonly fixedWeeks?: boolean;
  /** Include adjacent-month date values; false leaves those cells as null. Defaults true. */
  readonly includeAdjacentDays?: boolean;
}

/** A single cell in a deterministic month grid. */
export interface MonthGridCell {
  /** Date of this cell, or null when adjacent days were omitted. */
  readonly date: CivilDate | null;
  /** Day-of-month number, or null when adjacent days were omitted. */
  readonly day: number | null;
  /** Relative month: -1 previous, 0 target, or 1 next. */
  readonly monthOffset: -1 | 0 | 1;
  /** Whether the cell is in the requested month. */
  readonly inCurrentMonth: boolean;
  /** Sunday 0 through Saturday 6. */
  readonly weekday: number;
  /** Zero-based row index. */
  readonly row: number;
  /** Zero-based column index. */
  readonly column: number;
}

/** Complete month-grid result and the requested layout settings. */
export interface MonthGrid {
  /** Requested Gregorian year. */
  readonly year: number;
  /** Requested Gregorian month. */
  readonly month: number;
  /** First weekday used for columns. */
  readonly weekStartsOn: number;
  /** Whether the result uses a fixed six-week layout. */
  readonly fixedWeeks: boolean;
  /** Rows of seven cells. */
  readonly rows: readonly (readonly MonthGridCell[])[];
  /** Flattened row-major cells, exactly rows × 7 entries. */
  readonly cells: readonly MonthGridCell[];
}
