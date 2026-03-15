# @core/logging

`@core/logging` provides logging and observability primitives for the workspace.

## Purpose

This module centralizes logging setup and OpenTelemetry integration so services can emit structured logs and observability signals consistently.

## Highlights

- Uses **Pino** for logging
- Includes **OpenTelemetry** dependencies and exports
- Exports logs to **console** and **PostHog** by default
- Requires `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OTEL_SERVICE_NAME` to be defined in the environment
- Supports reusable logging and telemetry setup across services

## Source layout

- `src/index.ts` — logging entrypoint
- `src/otel.ts` — OpenTelemetry-specific integration

## When to use this module

Use this package for shared logger setup, telemetry wiring, and service-level observability primitives.

## Default export targets

`src/otel.ts` configures OpenTelemetry log export with these default targets:

- console output through `ConsoleLogRecordExporter`
- PostHog OTLP logs through `OTLPLogExporter`

PostHog configuration is not optional in this setup. Applications using this module must provide:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
- `OTEL_SERVICE_NAME`
