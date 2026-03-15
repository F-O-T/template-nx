# template-nx

`template-nx` is an Nx monorepo template for building modern TypeScript products with a clean separation between apps, shared packages, core platform modules, and repo-level tooling.

It ships with a web app, a Storybook workspace, a shared UI library, a type-safe API layer, database and auth foundations, and operational modules for analytics, logging, Redis, AI workflows, and security.

## What you get

- **Nx** for monorepo orchestration, task pipelines, and caching
- **Bun** as the package manager and script runner
- **React 19 + TanStack Start** for the main app
- **Tailwind CSS v4** for styling
- **Base UI-powered shared components** in `packages/ui`
- **oRPC + Zod** for end-to-end type-safe APIs
- **Drizzle + PostgreSQL** for the data layer
- **better-auth** for authentication
- **Storybook** for component development
- **Oxlint + Oxfmt** for linting and formatting

## Workspace structure

```text
template-nx/
├── apps/
│   ├── web/          # Main product app
│   └── storybook/    # UI development and component showcase
├── packages/
│   ├── ui/           # Shared UI primitives and app-facing components
│   └── api/          # Type-safe API layer built around oRPC
├── core/
│   ├── env/          # Environment validation and config loading
│   ├── auth/         # Authentication services and integration
│   ├── db/           # Database client, schema, and Drizzle workflows
│   ├── logging/      # Logging and OpenTelemetry integration
│   ├── posthog/      # Analytics clients
│   ├── redis/        # Redis connection utilities
│   ├── arcjet/       # Security and request protection helpers
│   └── mastra/       # AI and agent workflow integration
└── tooling/
    ├── css/          # Shared CSS and styling utilities
    ├── oxc/          # Lint and format configuration
    ├── boundary/     # Workspace boundary enforcement
    └── config/       # Shared configuration package
```

## Apps

### `apps/web`

The main application is built with React, Vite, and TanStack Start. It consumes shared UI from `packages/ui`, the API layer from `packages/api`, and platform modules from `core/*`.

### `apps/storybook`

Storybook is included as a dedicated app so you can develop and document the shared UI system in isolation.

## Packages

### `packages/ui`

This is the shared component library for the workspace. It contains reusable UI building blocks, hooks, and utilities that can be consumed by apps across the monorepo.

- Built around **Base UI** primitives
- Styled with **Tailwind CSS**
- Exported through typed workspace entrypoints such as `@packages/ui/components/*`
- Backed by Storybook for faster design system development

### `packages/api`

This package centralizes the application's type-safe API surface.

- Uses **oRPC** and **Zod**
- Connects the app to `core/auth`, `core/db`, `core/env`, and `core/arcjet`
- Keeps backend contracts reusable and composable across the workspace

## Core

The `core` directory contains platform-level modules that hold infrastructure and business-critical foundations.

- **`@core/env`**: validates and exposes environment variables
- **`@core/auth`**: wraps authentication with `better-auth`
- **`@core/db`**: manages Drizzle, PostgreSQL, and local database workflows
- **`@core/logging`**: provides logging and OpenTelemetry support
- **`@core/posthog`**: separates analytics for client and server usage
- **`@core/redis`**: provides Redis access utilities
- **`@core/arcjet`**: holds request protection and security helpers
- **`@core/mastra`**: supports AI and agent-related workflows

This structure makes it easier to keep product code, infrastructure concerns, and shared platform capabilities clearly separated.

## Tooling

The `tooling` layer keeps repo-wide conventions centralized.

- **`@tooling/css`**: shared global styles and styling dependencies
- **`@tooling/oxc`**: linting and formatting scripts powered by Oxlint and Oxfmt
- **`@tooling/boundary`**: workspace boundary checks to keep architecture clean
- **`@tooling/config`**: shared config package consumed across apps and libraries

Together, these packages make the template easier to scale without scattering config across the repository.

## Getting started

Install dependencies:

```bash
bun install
```

If you are using the database features, configure your environment in `apps/web/.env` and then apply the schema:

```bash
bun run db:push
```

Start development:

```bash
bun run dev
```

Start only the web app:

```bash
bun run dev:web
```

Start Storybook:

```bash
bun run dev:storybook
```

## Paraglide integration

This workspace already includes a full Paraglide setup for the `apps/web` application. The goal of the integration is to keep localization type-safe, easy to evolve, and tightly aligned with routing and server rendering.

At a high level, the stack is split across three places:

- `project.inlang/settings.json` defines the localization source of truth
- `messages/pt-br.json` stores the message catalog for the current locale
- `apps/web/src/paraglide/*` is generated by the Paraglide Vite plugin and consumed by the app at runtime

The current configuration uses `pt-br` as both the base locale and the only active locale:

```json
{
  "baseLocale": "pt-br",
  "locales": ["pt-br"]
}
```

Even with a single locale, this integration is valuable because it establishes the full i18n pipeline now instead of forcing a rewrite later when additional languages are introduced.

### How the integration is wired

Paraglide is registered in `apps/web/vite.config.ts` through `paraglideVitePlugin(...)`.

That plugin is responsible for:

- reading the inlang project from `../../project.inlang`
- compiling message files into generated runtime modules
- writing generated output to `apps/web/src/paraglide`
- configuring locale detection through URL, cookie, browser preference, and base locale fallback
- localizing routes using the configured URL patterns

The current Vite config uses this strategy order:

1. `url`
2. `cookie`
3. `preferredLanguage`
4. `baseLocale`

That means the app resolves locale using the request URL first, then the Paraglide cookie, then the browser language, and finally falls back to the configured base locale if nothing else matches.

### Localized routing behavior

The web app is configured to localize all routes with this pattern:

- default route form: `/:path(.*)?`
- localized `pt-br` route form: `/pt-br/:path(.*)?`

In practice, Paraglide gives the app a consistent way to move between localized and de-localized paths.

Inside `apps/web/src/router.tsx`:

- `deLocalizeUrl(url)` normalizes incoming URLs for TanStack Router matching
- `localizeUrl(url)` rewrites outgoing URLs back into the localized format

This is important because it lets the router work with a single route tree while still presenting locale-aware URLs externally.

### Server integration

The web server entrypoint wraps the TanStack Start handler with Paraglide middleware:

```ts
return paraglideMiddleware(req, () => handler.fetch(req));
```

This happens in `apps/web/src/server.ts` and is what allows locale resolution to happen at the request layer instead of only in the client. It ensures the locale is available during server rendering, routing, and HTML generation.

### Runtime usage in the app

Application code imports Paraglide messages from the generated module:

```ts
import { m } from '@/paraglide/messages';
```

Message access is function-based, so UI code calls translation keys like:

```ts
m.sign_in();
m.dashboard();
m.not_found();
```

This gives a few concrete benefits:

- translation keys are referenced through generated, typed functions
- missing or renamed keys are easier to catch during development
- interpolation stays explicit at the callsite
- UI code remains readable without hand-written translation wrappers

You can see this pattern throughout the app, including:

- `apps/web/src/routes/__root.tsx` for document metadata and `<html lang>`
- `apps/web/src/routes/index.tsx` for page content
- `apps/web/src/components/header.tsx` for navigation labels
- `apps/web/src/components/sign-in-form.tsx` and `sign-up-form.tsx` for form labels, validation, and toasts
- `apps/web/src/components/user-menu.tsx` for authenticated navigation

### HTML language and document metadata

The root route uses Paraglide runtime helpers directly:

- `getLocale()` sets the `<html lang>` attribute
- `m.app_title()` sets the document title

That means the rendered document language and metadata are driven by the same locale resolution flow as the rest of the app.

### Message storage and source of truth

Message files live in the repo root `messages/` directory, not inside `apps/web`.

Right now the active catalog is:

- `messages/pt-br.json`

This location matters because the inlang project is repository-level configuration, not app-local configuration. Keeping messages near `project.inlang` makes it easier to:

- share locale configuration across future apps
- centralize translation management
- avoid duplicating i18n setup if more frontends are added later

### Generated files

Paraglide writes generated runtime files into:

- `apps/web/src/paraglide/`

Those files are intentionally ignored by git:

- root `.gitignore` ignores `**/paraglide/`
- `apps/web/.gitignore` ignores `src/paraglide/`

Do not hand-edit generated Paraglide output. Treat `project.inlang/settings.json` and `messages/*.json` as the editable inputs, and let the plugin regenerate the runtime layer.

### Adding or updating translations

When you need to add a new translated string:

1. Add the message key to `messages/pt-br.json`
2. Use the generated function in app code via `m.your_key()`
3. Run the web app so Vite regenerates the Paraglide output
4. Verify the string appears in the correct route or component

For example, adding:

```json
{
  "profile_title": "Perfil"
}
```

would allow usage like:

```ts
m.profile_title();
```

If you later introduce interpolation, Paraglide keeps that usage explicit. A message such as:

```json
{
  "welcome_user": "Bem-vindo {username}"
}
```

is consumed as:

```ts
m.welcome_user({ username: session.user.name });
```

### Adding a new locale later

The current setup is already structured for expansion. To add another locale in the future, the typical workflow is:

1. Add the locale to `project.inlang/settings.json`
2. Create a new message file in `messages/`, such as `messages/en.json`
3. Add localized route mappings in `apps/web/vite.config.ts` if needed
4. Start the app and verify generated Paraglide output updates correctly
5. Test localized URLs, locale detection, and document metadata

Because the router, middleware, and runtime hooks are already integrated, adding languages should mostly be a content and configuration task rather than an architectural rewrite.

### Why this setup works well in this monorepo

Paraglide fits this workspace especially well because it keeps concerns separated cleanly:

- repo-level locale configuration lives in `project.inlang`
- human-edited translations live in `messages/`
- generated runtime artifacts stay inside the consuming app
- app code only imports typed runtime helpers

That separation matches the broader Nx monorepo structure used throughout this repository: source inputs stay explicit, generated output stays disposable, and application code depends on stable typed interfaces instead of ad hoc string lookups.

## Common commands

```bash
bun run dev
bun run build
bun run check-types
bun run lint
bun run lint:fix
bun run format
bun run check
```

Database commands:

```bash
bun run db:start
bun run db:push
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:stop
bun run db:down
```

## Conventions

- Use **Bun** from the repo root for workspace commands
- Use **Nx targets** for app and package workflows
- Shared product code belongs in `packages/*`
- Platform and infrastructure code belongs in `core/*`
- Repo-wide config and guardrails belong in `tooling/*`
- This project uses **Base UI**, not Radix UI; use the `render` prop instead of `asChild`
- Do not edit generated Paraglide files in `apps/web/src/paraglide`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor setup, workflow, validation expectations, and guidance for working with the Paraglide localization pipeline.

## Why this template

`template-nx` is designed for teams that want more than a starter app. It gives you a structured foundation for shipping production software with clear module boundaries, reusable packages, and tooling that scales with the codebase.
