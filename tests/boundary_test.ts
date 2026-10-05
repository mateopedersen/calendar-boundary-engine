import { analyzeCalendarBoundary } from "../src/boundary/mod.ts";
import { createCivilDate } from "../src/date/civil-date.ts";
import { equal } from "./assert.ts";

Deno.test("boundary analysis derives year, ISO, month, and leap-day transitions", () => {
  const newYear = analyzeCalendarBoundary(
    createCivilDate(2026, 12, 31),
    createCivilDate(2027, 1, 1),
  );
  equal(newYear.dayDelta, 1, "consecutive day delta");
  equal(newYear.crossesYear, true, "civil year boundary");
  equal(newYear.crossesMonth, true, "month boundary");
  equal(newYear.crossesIsoWeekYear, false, "same ISO week-year");
  const isoYear = analyzeCalendarBoundary(createCivilDate(2021, 1, 3), createCivilDate(2021, 1, 4));
  equal(isoYear.crossesIsoWeek, true, "week boundary");
  equal(isoYear.crossesIsoWeekYear, true, "ISO week-year boundary");
  const leap = analyzeCalendarBoundary(createCivilDate(2024, 2, 28), createCivilDate(2024, 2, 29));
  equal(leap.crossesLeapDay, true, "leap-day entrance");
  equal(leap.julianGregorianOffsetChanged, false, "both calendars share the 2024 leap day");
  const century = analyzeCalendarBoundary(
    createCivilDate(1900, 2, 28),
    createCivilDate(1900, 3, 1),
  );
  equal(
    century.julianGregorianOffsetChanged,
    true,
    "Julian offset changes across the Gregorian century exception",
  );
});

Deno.test("boundary analysis also reports ordinary dates and reverse transitions", () => {
  const ordinary = analyzeCalendarBoundary(
    createCivilDate(2027, 3, 1),
    createCivilDate(2027, 3, 2),
  );
  equal(ordinary.crossesMonth, false, "ordinary month flag");
  equal(ordinary.crossesQuarter, false, "ordinary quarter flag");
  const reverse = analyzeCalendarBoundary(
    createCivilDate(2024, 3, 1),
    createCivilDate(2024, 2, 29),
  );
  equal(reverse.dayDelta, -1, "signed delta");
  equal(reverse.crossesLeapDay, true, "reverse leap-day transition");
});
