import { createCivilDate } from "../src/date/civil-date.ts";
import { addDays, daysBetween } from "../src/date/arithmetic.ts";
import { gregorianToJdn, jdnToGregorian, jdnToJulian, julianToJdn } from "../src/julian-day/mod.ts";
import { fromIsoWeekDate, toIsoWeekDate } from "../src/iso-week/mod.ts";
import { equal } from "./assert.ts";

Deno.test("deterministic calendar invariants hold over a broad date sample", () => {
  for (let year = 1800; year <= 2200; year += 2) {
    for (let month = 1; month <= 12; month++) {
      const date = createCivilDate(year, month, 1);
      const jdn = gregorianToJdn(date);
      equal(gregorianToJdn(jdnToGregorian(jdn)), jdn, "Gregorian JDN invariant");
      const julian = jdnToJulian(jdn);
      equal(julianToJdn(julian), jdn, "Julian JDN invariant");
      equal(gregorianToJdn(fromIsoWeekDate(toIsoWeekDate(date))), jdn, "ISO round-trip invariant");
      equal(daysBetween(date, addDays(date, 1)), 1, "consecutive-day invariant");
    }
  }
});
