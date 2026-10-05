# Calendar Boundary Engine

[![JSR](https://jsr.io/badges/@betacalendars/calendar-boundary-engine)](https://jsr.io/@betacalendars/calendar-boundary-engine)
[![JSR Score](https://jsr.io/badges/@betacalendars/calendar-boundary-engine/score)](https://jsr.io/@betacalendars/calendar-boundary-engine)
[![CI](https://github.com/mateopedersen/calendar-boundary-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/mateopedersen/calendar-boundary-engine/actions/workflows/ci.yml)

Deterministic, date-only calendar mathematics for TypeScript. The package implements civil-date
arithmetic, proleptic Gregorian and Julian rules, integer Julian Day Number conversion, ISO 8601
week-years, presentation-neutral month grids, temporal boundary diagnostics, and explicit calendar
cutover policies.

> A calendar date is not a timestamp. The core uses integer day arithmetic and does not construct
> JavaScript `Date` objects, parse date strings as instants, inspect the machine timezone, or make
> network requests.

## Why

Calendar software routinely needs to answer questions that are easy to get subtly wrong: whether a
leap year follows the century rule, whether January 1 belongs to the prior ISO week-year, how many
cells a month grid needs, or which date label follows a historical calendar cutover. These are
calendar questions, not timezone questions.

This package represents date-only values explicitly and keeps date math independent of local time,
UTC offsets, and daylight-saving changes. Gregorian and Julian rules remain distinct, and calendar
reform is an explicit policy instead of an assumed worldwide event.

## Install

### Deno

```sh
deno add jsr:@betacalendars/calendar-boundary-engine
```

### Node.js, npm, and Bun

JSR’s current npm compatibility workflow uses the JSR CLI for npm and Bun:

```sh
npx jsr add @betacalendars/calendar-boundary-engine
bunx jsr add @betacalendars/calendar-boundary-engine
```

Recent pnpm versions support JSR directly:

```sh
pnpm add jsr:@betacalendars/calendar-boundary-engine
```

The JSR CLI creates the registry configuration needed by npm-compatible package managers. Keep the
generated `.npmrc` in the consuming project’s source control.

## Quick start

```ts
import {
  analyzeCalendarBoundary,
  createCivilDate,
  createMonthGrid,
  toIsoWeekDate,
} from "@betacalendars/calendar-boundary-engine";

const newYear = createCivilDate(2027, 1, 1);
console.log(toIsoWeekDate(newYear));
// { weekYear: 2026, week: 53, weekday: 5 }

const grid = createMonthGrid({ year: 2027, month: 1, weekStartsOn: 1, fixedWeeks: true });
console.log(grid.cells.length); // 42

console.log(analyzeCalendarBoundary(createCivilDate(2026, 12, 31), newYear));
```

## Civil dates

`CivilDate` contains only `year`, `month`, and `day`. `createCivilDate` validates a proleptic
Gregorian date and freezes the returned object. The supported public range is CE years 1
through 9999. Astronomical year numbering, BCE labels, leap seconds, local times, and time zones are
outside this initial release.

```ts
import {
  addDays,
  addMonths,
  createCivilDate,
  daysBetween,
} from "@betacalendars/calendar-boundary-engine/date";

const date = createCivilDate(2024, 2, 29);
addDays(date, 1); // { year: 2024, month: 3, day: 1 }
addMonths(date, 12); // { year: 2025, month: 2, day: 28 } — clamped
daysBetween(date, { year: 2024, month: 3, day: 1 }); // 1
```

Day addition requires a safe integer. Month and year additions clamp an unavailable day to the
target month’s last day. Invalid dates and results outside the documented range throw `RangeError`.

## Gregorian calendar

The Gregorian module includes leap-year checks, month lengths, date validation, ordinal day, and
Sunday-zero weekday numbers. The 400-year rule is applied: 1900 and 2100 are common years; 2000 and
2400 are leap years.

## Julian calendar and Julian Day Numbers

Julian leap years are every fourth CE year, including 1900. The `julian` module provides Julian day
arithmetic; the `julian-day` module converts both calendar systems to and from integer Julian Day
Numbers and converts labels while preserving the represented integer day. Conversion results outside
CE years 1 through 9999 throw rather than silently introducing year zero or BCE conventions.

## ISO 8601 week dates

`IsoWeekDate` uses Monday `1` through Sunday `7`. Its `weekYear` may differ from the Gregorian year.
For example, 2027-01-01 is Friday of week 53 in week-year 2026, while 2027-01-04 starts week 1
of 2027. Use `fromIsoWeekDate` to validate and convert back.

## Month grids

`createMonthGrid` returns structured cells and no HTML. Choose a first weekday from Sunday `0`
through Saturday `6`, natural rows or six fixed weeks, and whether adjacent-month date values should
be included. Each cell includes its weekday, row, column, month offset, and current-month flag, so a
renderer can choose its own markup and styling.

## Boundary analysis

`analyzeCalendarBoundary(from, to)` reports the signed day delta, consecutive-day status,
month/year/quarter changes, ISO week and week-year changes, leap-day transitions, leap-year
boundaries, and changes in the Julian-vs-Gregorian offset for the same date label. Results are
calculated from the calendar algorithms rather than inferred from timestamps.

## Gregorian reform policies

`GREGORIAN_REFORM_1582` is an example policy in which Julian 1582-10-04 is followed by Gregorian
1582-10-15. `createCutoverPolicy` accepts explicit jurisdiction-specific dates, verifies that their
JDNs are consecutive, and allows skipped date labels to be detected. The package does not claim that
every jurisdiction adopted the reform on the same day and is not a historical adoption database.

## Package exports

| Import path                               | Contents                    |
| ----------------------------------------- | --------------------------- |
| `@betacalendars/calendar-boundary-engine` | Combined public API         |
| `.../date`                                | Civil dates and arithmetic  |
| `.../gregorian`                           | Gregorian rules             |
| `.../julian`                              | Julian rules and validation |
| `.../julian-day`                          | JDN and calendar conversion |
| `.../iso-week`                            | ISO week-year conversion    |
| `.../grid`                                | Month-grid generation       |
| `.../boundary`                            | Boundary diagnostics        |
| `.../reform`                              | Cutover policies            |

## Runtime compatibility

The core uses TypeScript, ESM, integer arithmetic, and standard language features only. It has no
runtime dependencies, filesystem access, environment inspection, telemetry, analytics, or network
behavior. Runtime labels on the JSR package page will be set only after the corresponding smoke
checks have been completed.

## Development

Install Deno 2.x, then run:

```sh
deno task fmt:check
deno task lint
deno task check
deno task test
deno task doc:lint
deno task publish:dry-run
```

The deterministic invariant suite samples multiple centuries and calendar boundaries. `deno bench`
runs small operation benchmarks; they are intended for local comparison and are not used to make
unsupported speed claims.

## Project

Calendar Boundary Engine is maintained as part of the
[Beta Calendars](https://www.betacalendars.com/) calendar-engineering project. For printable
calendar examples, see the [monthly calendar](https://www.betacalendars.com/monthly-calendar).

## License

MIT. See [LICENSE](./LICENSE).
