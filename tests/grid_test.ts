import { createMonthGrid } from "../src/grid/mod.ts";
import { daysInGregorianMonth } from "../src/gregorian/mod.ts";
import { assert, equal } from "./assert.ts";

Deno.test("month grids support natural and fixed layouts and both week starts", () => {
  const monday = createMonthGrid({ year: 2027, month: 1 });
  const sunday = createMonthGrid({ year: 2027, month: 1, weekStartsOn: 0 });
  const fixed = createMonthGrid({ year: 2027, month: 2, fixedWeeks: true });
  equal(monday.rows.length, 5, "January 2027 Monday rows");
  equal(sunday.rows.length, 6, "January 2027 Sunday rows");
  equal(fixed.cells.length, 42, "fixed grid size");
  equal(fixed.rows.length, 6, "fixed row count");
  equal(fixed.cells.filter((cell) => cell.inCurrentMonth).length, 28, "February 2027 days");
  equal(
    createMonthGrid({ year: 2024, month: 2 }).cells.filter((cell) => cell.inCurrentMonth).length,
    29,
    "leap February",
  );
  equal(
    createMonthGrid({ year: 2027, month: 4 }).cells.filter((cell) => cell.inCurrentMonth).length,
    30,
    "30-day month",
  );
  equal(
    createMonthGrid({ year: 2027, month: 1 }).cells.filter((cell) => cell.inCurrentMonth).length,
    31,
    "31-day month",
  );
  const omitted = createMonthGrid({ year: 2027, month: 1, includeAdjacentDays: false });
  assert(
    omitted.cells.some((cell) => !cell.inCurrentMonth && cell.date === null),
    "adjacent cells can be omitted",
  );
  for (const cell of monday.cells) {
    equal(cell.weekday, (cell.column + 1) % 7, "weekday maps to Monday-first column");
  }
  equal(
    createMonthGrid({ year: 1, month: 1, fixedWeeks: true }).cells.filter((cell) =>
      cell.inCurrentMonth
    ).length,
    31,
    "minimum-year grid",
  );
  equal(
    createMonthGrid({ year: 9999, month: 12, fixedWeeks: true }).cells.filter((cell) =>
      cell.inCurrentMonth
    ).length,
    31,
    "maximum-year grid",
  );
});

Deno.test("month-grid invariant holds for every month from 1900 through 2100", () => {
  for (let year = 1900; year <= 2100; year++) {
    for (let month = 1; month <= 12; month++) {
      for (const weekStartsOn of [0, 1]) {
        const grid = createMonthGrid({ year, month, weekStartsOn });
        const current = grid.cells.filter((cell) => cell.inCurrentMonth);
        equal(
          current.length,
          daysInGregorianMonth(year, month),
          `target month length ${year}-${month}`,
        );
        equal(
          new Set(current.map((cell) => `${cell.date?.year}-${cell.date?.month}-${cell.date?.day}`))
            .size,
          current.length,
          "unique target days",
        );
      }
    }
  }
});
