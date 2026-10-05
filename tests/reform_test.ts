import { createCivilDate } from "../src/date/civil-date.ts";
import { julianToJdn } from "../src/julian-day/jdn.ts";
import {
  convertAcrossCutover,
  createCutoverPolicy,
  GREGORIAN_REFORM_1582,
  isDateSkippedByCutover,
} from "../src/reform/mod.ts";
import { assert, dateText, equal, throws } from "./assert.ts";

Deno.test("1582 cutover skips labels while preserving consecutive integer days", () => {
  equal(julianToJdn(GREGORIAN_REFORM_1582.lastJulianDate) + 1, 2299161, "next day JDN");
  equal(
    isDateSkippedByCutover(createCivilDate(1582, 10, 10), GREGORIAN_REFORM_1582),
    true,
    "skipped date",
  );
  equal(
    isDateSkippedByCutover(createCivilDate(1582, 10, 4), GREGORIAN_REFORM_1582),
    false,
    "last Julian date",
  );
  equal(
    isDateSkippedByCutover(createCivilDate(1582, 10, 15), GREGORIAN_REFORM_1582),
    false,
    "first Gregorian date",
  );
  equal(
    dateText(convertAcrossCutover(createCivilDate(1582, 10, 4), GREGORIAN_REFORM_1582)),
    "1582-10-14",
    "Julian label to proleptic Gregorian",
  );
  throws(
    () => convertAcrossCutover(createCivilDate(1582, 10, 10), GREGORIAN_REFORM_1582),
    "skipped label throws",
  );
});

Deno.test("custom cutover validates physical-day adjacency, including Julian-only leap labels", () => {
  const policy = createCutoverPolicy(
    { year: 1900, month: 2, day: 29 },
    createCivilDate(1900, 3, 14),
  );
  assert(julianToJdn(policy.lastJulianDate) + 1 === 2415093, "Julian leap date fixture");
  throws(
    () => createCutoverPolicy({ year: 1900, month: 2, day: 29 }, createCivilDate(1900, 3, 1)),
    "nonconsecutive cutover rejected",
  );
});
