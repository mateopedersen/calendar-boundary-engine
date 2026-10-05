import {
  addDays,
  addMonths,
  addYears,
  compareCivilDates,
  createCivilDate,
  daysBetween,
  formatCivilDate,
  isValidCivilDate,
} from "../src/date/mod.ts";
import { assert, equal, throws } from "./assert.ts";

Deno.test("civil dates validate and compare without timestamp semantics", () => {
  const leapDay = createCivilDate(2000, 2, 29);
  equal(formatCivilDate(leapDay), "2000-02-29", "format");
  equal(
    compareCivilDates(createCivilDate(2027, 1, 1), createCivilDate(2026, 12, 31)),
    1,
    "ordering",
  );
  assert(!isValidCivilDate({ year: 1900, month: 2, day: 29 }), "1900-02-29 must be invalid");
  throws(() => createCivilDate(0, 1, 1), "year zero is outside the documented range");
  throws(() => createCivilDate(2027, 4, 31), "invalid month day must throw");
});

Deno.test("date arithmetic crosses month and year boundaries", () => {
  equal(formatCivilDate(addDays(createCivilDate(2026, 12, 31), 1)), "2027-01-01", "day add");
  equal(
    formatCivilDate(addDays(createCivilDate(2027, 1, 1), -1)),
    "2026-12-31",
    "negative day add",
  );
  equal(formatCivilDate(addMonths(createCivilDate(2027, 1, 31), 1)), "2027-02-28", "month clamp");
  equal(
    formatCivilDate(addMonths(createCivilDate(2027, 3, 31), -1)),
    "2027-02-28",
    "negative month clamp",
  );
  equal(formatCivilDate(addYears(createCivilDate(2024, 2, 29), 1)), "2025-02-28", "year clamp");
  equal(daysBetween(createCivilDate(2026, 12, 31), createCivilDate(2027, 1, 1)), 1, "day delta");
  throws(() => addDays(createCivilDate(2027, 1, 1), 0.5), "fractional days must throw");
});
