import { createMonthGrid } from "../src/mod.ts";

const grid = createMonthGrid({ year: 2024, month: 2, weekStartsOn: 0, fixedWeeks: false });
console.log(`${grid.year}-${String(grid.month).padStart(2, "0")}: ${grid.rows.length} rows`);
