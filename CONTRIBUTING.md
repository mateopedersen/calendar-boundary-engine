# Contributing

Contributions should preserve the package’s date-only model and documented CE year range. Calendar
algorithms must not depend on local time, host timezone, locale, or `Date` parsing.

Before opening a pull request, run `deno task fmt`, `deno task lint`, `deno task check`,
`deno task test`, and `deno task doc:lint`. Add fixtures for algorithmic edge cases and document any
public API behavior. Keep runtime dependencies at zero unless a concrete need is discussed in an
issue first.

For historical calendar behavior, distinguish mathematical conversion from jurisdiction-specific
adoption policy. Do not imply a single worldwide Gregorian adoption date.
