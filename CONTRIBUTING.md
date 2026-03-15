# Contributing

Thanks for contributing to this workspace.

This repository is an Nx monorepo built around Bun, React, TanStack Start, Base UI, oRPC, Drizzle, and Paraglide. The easiest way to make changes safely is to follow the same structure and workflows the repo already uses.

## Prerequisites

Before contributing, make sure you have:

- Bun installed
- a working local Node-compatible development environment
- access to any required environment variables if your changes touch auth, database, or external services

## Initial setup

Install dependencies from the repository root:

```bash
bun install
```

If your work depends on the database, configure the appropriate environment file and apply the schema:

```bash
bun run db:push
```

Start the main app:

```bash
bun run dev:web
```

Start Storybook when working on shared UI:

```bash
bun run dev:storybook
```

## Repository structure

Follow the workspace boundaries when choosing where code should live:

- `apps/*` for runnable applications
- `packages/*` for shared product-facing packages
- `core/*` for platform and infrastructure modules
- `tooling/*` for repository-wide tooling, config, and guardrails

If code feels reusable across apps, it likely belongs in `packages/*`. If it provides foundational infrastructure such as auth, database, analytics, or environment handling, it likely belongs in `core/*`.

## Development workflow

Make changes from the repository root and prefer workspace-level commands.

Common commands:

```bash
bun run dev
bun run build
bun run check-types
bun run lint
bun run lint:fix
bun run format
bun run check
```

If you are working in a single area, you can still use Nx-targeted commands where appropriate, but the root scripts are the default workflow for most contributors.

## Validation expectations

Before asking for review, run the validation most relevant to your change.

At minimum, that usually means:

```bash
bun run lint
bun run check-types
```

For broader changes, also run:

```bash
bun run build
```

If your work touches database flows, auth, routing, localization, shared UI, or repo tooling, verify those areas directly in development rather than relying only on static checks.

## Pre-commit hooks

This repository uses Lefthook for pre-commit checks.

The current pre-commit pipeline runs:

- `oxlint` with autofix on staged files
- `check-boundaries`
- `oxfmt` on staged files

That means a commit may modify staged files automatically as part of formatting and lint fixing. Review the staged diff after hooks run if you see files changed during commit preparation.

## Code conventions

Follow the conventions already established in the repository:

- use Bun from the repo root for workspace commands
- keep module boundaries clean
- prefer existing patterns over introducing new ones unnecessarily
- keep code maintainable and explicit
- do not add comments to the code

### Base UI requirement

This project uses Base UI, not Radix UI.

- do not use `asChild`
- use the `render` prop when customizing rendered elements
- avoid Radix-specific composition patterns

If you are wrapping or extending shared UI components, keep that distinction in mind.

## Working with the web app

The main product app lives in `apps/web` and uses React, Vite, TanStack Start, and TanStack Router.

When contributing there:

- keep route-level concerns in route files when possible
- keep reusable UI in shared component modules
- reuse shared packages from `packages/*` and `core/*` instead of duplicating logic locally

## Working with Paraglide localization

This repository already includes a Paraglide integration for `apps/web`, and contributors should treat it as the standard path for user-facing strings.

### Source files you should edit

These are the important localization inputs:

- `project.inlang/settings.json`
- `messages/pt-br.json`

These are generated outputs and should not be edited manually:

- `apps/web/src/paraglide/*`

The generated Paraglide directory is gitignored on purpose.

### How to add a new translation

1. Add a new key to `messages/pt-br.json`
2. Start or restart the web app if needed so Paraglide regenerates runtime artifacts
3. Import and use the generated message function from `@/paraglide/messages`
4. Verify the UI renders the translated content correctly

Example usage:

```ts
import { m } from '@/paraglide/messages';

m.sign_in();
```

For interpolated messages:

```ts
m.welcome_user({ username: 'Ana' });
```

### Routing and locale behavior

Paraglide is integrated into:

- the Vite plugin configuration in `apps/web/vite.config.ts`
- the request middleware in `apps/web/src/server.ts`
- router URL rewriting in `apps/web/src/router.tsx`
- runtime usage across route and component files

If you change locale configuration, route patterns, or message structure, verify:

- localized URLs still resolve correctly
- the app renders with the expected locale
- `<html lang>` remains correct
- document metadata and UI labels still load through Paraglide

### Adding a new locale

If your contribution includes a new language:

1. add the locale in `project.inlang/settings.json`
2. create a matching file in `messages/`
3. update localized route mappings in `apps/web/vite.config.ts` if necessary
4. verify locale resolution through URL, cookie, and fallback behavior

## Working with shared packages

If you change code in `packages/ui`, `packages/api`, or `core/*`, think about downstream consumers.

Before requesting review:

- verify imports still resolve cleanly
- confirm public APIs are intentional
- avoid leaking app-specific assumptions into shared modules

## Pull request guidance

A good pull request should:

- describe the problem being solved
- summarize the approach taken
- call out any architectural or behavioral changes
- mention any setup, migration, or follow-up work reviewers should know about

If your changes affect user-visible behavior, include enough context for reviewers to understand how to verify it locally.

## When in doubt

If you are unsure where something belongs, prefer the existing repository structure over creating a new pattern. Small, consistent contributions are easier to review and maintain than clever one-off solutions.
