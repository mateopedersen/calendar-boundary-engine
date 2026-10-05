import {
  createCivilDate,
  createMonthGrid,
  gregorianToJdn,
  jdnToGregorian,
  toIsoWeekDate,
} from "../src/mod.ts";

Deno.bench("Gregorian date to JDN", () => {
  gregorianToJdn({ year: 2027, month: 1, day: 1 });
});

Deno.bench("JDN to Gregorian date", () => {
  jdnToGregorian(2461407);
});

Deno.bench("ISO week conversion", () => {
  toIsoWeekDate(createCivilDate(2027, 1, 1));
});

Deno.bench("fixed 42-cell month grid", () => {
  createMonthGrid({ year: 2027, month: 1, fixedWeeks: true });
});
