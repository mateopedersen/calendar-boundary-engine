import { createCivilDate } from "../date/civil-date.ts";
import { dayOfWeek, daysInGregorianMonth } from "../gregorian/mod.ts";
import {
  gregorianToJdnUnchecked,
  jdnToGregorianUnchecked,
  weekdaySundayZero,
} from "../internal/calendar.ts";
import type { MonthGrid, MonthGridCell, MonthGridOptions } from "./types.ts";

/**
 * Generate a presentation-neutral month grid using integer calendar arithmetic.
 *
 * @param options Target Gregorian month, weekday start, row mode, and adjacent-cell options.
 * @returns Row-major cells with stable date, row, column, weekday, and month-offset metadata.
 * @throws `RangeError` for invalid year, month, or week-start index.
 * @example `createMonthGrid({ year: 2027, month: 1, fixedWeeks: true })` returns 42 cells.
 */
export function createMonthGrid(options: MonthGridOptions): MonthGrid {
  const { year, month } = options;
  const weekStartsOn = options.weekStartsOn ?? 1;
  const fixedWeeks = options.fixedWeeks ?? false;
  const includeAdjacentDays = options.includeAdjacentDays ?? true;
  const monthLength = daysInGregorianMonth(year, month);
  if (!monthLength) throw new RangeError("year must be 1..9999 and month must be 1..12");
  if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
    throw new RangeError("weekStartsOn must be an integer from 0 through 6");
  }

  const firstDate = createCivilDate(year, month, 1);
  const leading = (dayOfWeek(firstDate) - weekStartsOn + 7) % 7;
  const naturalCellCount = Math.ceil((leading + monthLength) / 7) * 7;
  const cellCount = fixedWeeks ? 42 : naturalCellCount;
  const firstJdn = gregorianToJdnUnchecked(firstDate) - leading;
  const rows: MonthGridCell[][] = [];
  const cells: MonthGridCell[] = [];

  for (let index = 0; index < cellCount; index++) {
    const row = Math.floor(index / 7);
    const column = index % 7;
    const jdn = firstJdn + index;
    const candidate = jdnToGregorianUnchecked(jdn);
    const date = candidate.year >= 1 && candidate.year <= 9999 ? candidate : null;
    const inCurrentMonth = index >= leading && index < leading + monthLength;
    const monthOffset: -1 | 0 | 1 = inCurrentMonth ? 0 : index < leading ? -1 : 1;
    const includeCellDate = inCurrentMonth || includeAdjacentDays;
    const cell: MonthGridCell = Object.freeze({
      date: includeCellDate ? date : null,
      day: includeCellDate ? date?.day ?? null : null,
      monthOffset,
      inCurrentMonth,
      weekday: weekdaySundayZero(jdn),
      row,
      column,
    });
    cells.push(cell);
    if (column === 0) rows.push([]);
    rows[row]!.push(cell);
  }

  return Object.freeze({
    year,
    month,
    weekStartsOn,
    fixedWeeks,
    rows: Object.freeze(rows.map((row) => Object.freeze(row))),
    cells: Object.freeze(cells),
  });
}
