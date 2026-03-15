# @core/mastra

`@core/mastra` contains AI and agent workflow integration for the workspace.

## Purpose

This module provides a home for Mastra-based agents, tools, and related orchestration code.

## Highlights

- Uses **Mastra**
- Includes agent and tool examples
- Depends on `@core/env`
- Exports Mastra observability data to **PostHog** by default
- Requires `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OTEL_SERVICE_NAME` to be defined in the environment
- Supports local development with a dedicated `dev` script

## Source layout

- `src/index.ts` — package entrypoint
- `src/mastra/index.ts` — Mastra composition entrypoint
- `src/mastra/agents/` — agent implementations
- `src/mastra/tools/` — tool implementations

## Development

This module includes a local development script powered by environment values from `apps/web/.env`.

## Observability defaults

`src/mastra/index.ts` configures Mastra observability with PostHog as the default exporter.

Applications using this module must provide:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
- `OTEL_SERVICE_NAME`
