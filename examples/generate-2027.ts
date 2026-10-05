import { createMonthGrid, formatCivilDate } from "../src/mod.ts";

const grid = createMonthGrid({ year: 2027, month: 1, weekStartsOn: 1, fixedWeeks: true });
for (const row of grid.rows) {
  console.log(row.map((cell) => cell.date ? formatCivilDate(cell.date) : "          ").join("  "));
}
