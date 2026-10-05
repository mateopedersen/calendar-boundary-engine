# Security policy

The calendar engine does not execute dynamic code, access files or environment variables, make
network requests, or collect telemetry. Report security concerns privately to the repository
maintainers before public disclosure.

The package’s supported date-label range is CE years 1 through 9999. Inputs outside that range or
calendar conversions that would produce unsupported labels are rejected.
