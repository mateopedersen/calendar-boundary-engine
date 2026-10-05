import { createCivilDate } from "../src/date/civil-date.ts";
import {
  endOfIsoWeek,
  fromIsoWeekDate,
  isoWeeksInYear,
  startOfIsoWeek,
  toIsoWeekDate,
} from "../src/iso-week/mod.ts";
import { assert, dateText, equal, throws } from "./assert.ts";

Deno.test("ISO 8601 week-year boundaries include the 2027 fixture", () => {
  const jan1 = toIsoWeekDate(createCivilDate(2027, 1, 1));
  equal(jan1.weekYear, 2026, "week-year");
  equal(jan1.week, 53, "week number");
  equal(jan1.weekday, 5, "weekday");
  equal(
    dateText(fromIsoWeekDate({ weekYear: 2027, week: 1, weekday: 1 })),
    "2027-01-04",
    "week 1 Monday",
  );
  equal(isoWeeksInYear(2026), 53, "2026 has 53 weeks");
  equal(isoWeeksInYear(2027), 52, "2027 has 52 weeks");
  equal(dateText(startOfIsoWeek(createCivilDate(2027, 1, 1))), "2026-12-28", "week start");
  equal(dateText(endOfIsoWeek(createCivilDate(2027, 1, 1))), "2027-01-03", "week end");
  throws(() => fromIsoWeekDate({ weekYear: 2027, week: 53, weekday: 1 }), "invalid ISO week");
});

Deno.test("ISO week conversion round-trips sampled dates in several centuries", () => {
  for (let year = 1800; year <= 2400; year += 3) {
    for (const month of [1, 3, 6, 9, 12]) {
      const date = createCivilDate(year, month, 1);
      const result = fromIsoWeekDate(toIsoWeekDate(date));
      assert(dateText(result) === dateText(date), `ISO round-trip ${dateText(date)}`);
    }
  }
});
