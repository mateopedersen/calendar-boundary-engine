import {
  gregorianToJdn,
  gregorianToJulian,
  jdnToGregorian,
  jdnToJulian,
  julianToGregorian,
  julianToJdn,
} from "../src/julian-day/mod.ts";
import { assert, dateText, equal, throws } from "./assert.ts";

Deno.test("known JDN fixtures and Gregorian-Julian conversions", () => {
  equal(gregorianToJdn({ year: 2000, month: 1, day: 1 }), 2451545, "J2000 Gregorian JDN");
  equal(julianToJdn({ year: 2000, month: 1, day: 1 }), 2451558, "Julian JDN");
  equal(dateText(jdnToGregorian(2451545)), "2000-01-01", "Gregorian inverse");
  equal(dateText(jdnToJulian(2451545)), "1999-12-19", "Julian inverse");
  equal(
    dateText(gregorianToJulian({ year: 1582, month: 10, day: 15 })),
    "1582-10-05",
    "reform offset fixture",
  );
  equal(
    dateText(julianToGregorian({ year: 1582, month: 10, day: 4 })),
    "1582-10-14",
    "Julian conversion fixture",
  );
  throws(() => gregorianToJdn({ year: 1900, month: 2, day: 29 }), "invalid Gregorian input");
});

Deno.test("Gregorian JDN conversions round-trip over a broad deterministic sample", () => {
  const first = gregorianToJdn({ year: 1, month: 1, day: 1 });
  const last = gregorianToJdn({ year: 9999, month: 12, day: 31 });
  for (let jdn = first; jdn <= last; jdn += 997) {
    const date = jdnToGregorian(jdn);
    assert(gregorianToJdn(date) === jdn, `Gregorian JDN round-trip at ${jdn}`);
  }
});

Deno.test("Julian JDN conversions round-trip over leap and century samples", () => {
  for (let year = 1; year <= 9999; year += 37) {
    for (let month = 1; month <= 12; month++) {
      const date = { year, month, day: month === 2 && year % 4 === 0 ? 29 : 1 };
      const jdn = julianToJdn(date);
      equal(julianToJdn(jdnToJulian(jdn)), jdn, `Julian round-trip ${year}/${month}`);
    }
  }
});
