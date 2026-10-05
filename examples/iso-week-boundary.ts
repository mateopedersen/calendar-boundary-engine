import { createCivilDate, toIsoWeekDate } from "../src/mod.ts";

console.log(toIsoWeekDate(createCivilDate(2027, 1, 1)));
// { weekYear: 2026, week: 53, weekday: 5 }
