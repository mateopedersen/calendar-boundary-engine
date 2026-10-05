import {
  addJulianDays,
  daysBetweenJulianDates,
  daysInJulianMonth,
  isJulianLeapYear,
  validateJulianDate,
} from "../src/julian/mod.ts";
import { dateText, equal } from "./assert.ts";

Deno.test("Julian leap-year rule is divisible by four", () => {
  equal(isJulianLeapYear(1900), true, "1900 Julian leap year");
  equal(isJulianLeapYear(2000), true, "2000 Julian leap year");
  equal(daysInJulianMonth(1900, 2), 29, "Julian February");
  equal(daysInJulianMonth(2027, 4), 30, "April length");
  equal(validateJulianDate({ year: 1900, month: 2, day: 29 }), true, "Julian leap day");
  equal(validateJulianDate({ year: 1900, month: 2, day: 30 }), false, "invalid Julian day");
  equal(
    dateText(addJulianDays({ year: 1900, month: 2, day: 28 }, 1)),
    "1900-02-29",
    "Julian leap arithmetic",
  );
  equal(
    daysBetweenJulianDates({ year: 1900, month: 2, day: 28 }, { year: 1900, month: 3, day: 1 }),
    2,
    "Julian day span",
  );
});
