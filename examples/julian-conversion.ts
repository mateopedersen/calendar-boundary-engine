import { gregorianToJulian } from "../src/mod.ts";

console.log(gregorianToJulian({ year: 1582, month: 10, day: 15 }));
// { year: 1582, month: 10, day: 5 }
