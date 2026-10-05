import { createCivilDate } from "../src/date/civil-date.ts";
import {
  daysInGregorianMonth,
  gregorianDayOfYear,
  isGregorianLeapYear,
  validateGregorianDate,
} from "../src/gregorian/mod.ts";
import { dayOfWeek } from "../src/gregorian/day-of-week.ts";
import { equal } from "./assert.ts";

Deno.test("Gregorian leap years obey century exceptions", () => {
  equal(isGregorianLeapYear(1900), false, "1900");
  equal(isGregorianLeapYear(2000), true, "2000");
  equal(isGregorianLeapYear(2100), false, "2100");
  equal(isGregorianLeapYear(2400), true, "2400");
  equal(daysInGregorianMonth(2024, 2), 29, "leap February");
  equal(daysInGregorianMonth(2027, 4), 30, "April");
  equal(daysInGregorianMonth(2027, 1), 31, "January");
  equal(daysInGregorianMonth(2027, 13), 0, "invalid month sentinel");
});

Deno.test("Gregorian ordinals and weekdays use civil-day math", () => {
  equal(gregorianDayOfYear(createCivilDate(2024, 12, 31)), 366, "leap-year ordinal");
  equal(gregorianDayOfYear(createCivilDate(2027, 3, 1)), 60, "common-year ordinal");
  equal(dayOfWeek(createCivilDate(2027, 1, 1)), 5, "Friday is index 5");
  equal(validateGregorianDate({ year: 2027, month: 2, day: 29 }), false, "invalid date");
});
