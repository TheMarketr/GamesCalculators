# GamesCalculators

A production-oriented static gaming utility platform built with Astro, TypeScript, Tailwind CSS, Preact, MDX and Vitest. All calculators run in the browser; no database or account system is required.

## Running locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:4321`.

## Quality checks

```bash
npm run safety:check
npm run typecheck
npm run test
npm run build
```

Run all checks in order with `npm run check`. Preview static production output with `npm run preview`.

The managed Sites deployment uses `npm run build:sites` to wrap the same static output in a Cloudflare Worker-compatible artifact. Normal Cloudflare Pages and Netlify builds continue to use `npm run build` and the root `dist` directory.

## Project structure

```text
src/
  components/       Shared Astro and Preact UI
  config/           Site-wide settings
  data/             Editable game values and route configuration
  games/            Calculator formulas, tests, and Preact interfaces
  layouts/          Page shells and metadata
  pages/            Astro routes, hubs, guides, and policies
  styles/           Global Tailwind entry and design system
  utils/            Formatting and shared helpers
scripts/            Content safety checks
public/             Static files, robots.txt, and hosting headers
```

## Adding a game

1. Add a `GameConfig` entry in `src/data/games.ts` with a unique slug, accent, description and glyph.
2. Create `src/data/<game>/` for editable values or statistics.
3. Register completed tools in the game’s `tools` array. The dynamic hub is generated automatically.
4. Add relevant search keywords to the tool configuration.
5. Add the calculator implementation under `src/games/<game>/<tool>/`.

The global search, homepage update feed, sitemap routes and game hub read from the central configuration. Only completed, linked tools belong in `tools`.

## Adding a calculator

Use this small, explicit structure:

```text
src/games/<game>/<tool>/
  calculate.ts
  calculate.test.ts
  Calculator.tsx
```

Keep formulas in `calculate.ts`, interface state in `Calculator.tsx`, and representative edge cases in `calculate.test.ts`. Add route metadata to `src/data/games.ts`, then map the `kind` to the component in `src/pages/[game]/[tool].astro`.

Each tool receives canonical, Open Graph, breadcrumb, WebApplication and FAQ metadata from the page shell. Query parameters may recreate calculator state, but the canonical stays on the clean route.

## Updating game data

Game values live in `src/data/<game>/`. Current examples:

- `src/data/blox-fruits/items.ts`
- `src/data/grow-a-garden/items.ts`
- `src/data/adopt-me/pets.ts`
- `src/data/steal-a-brainrot/items.ts`
- `src/data/fortnite/hardware.ts`

Update item values and their `updated` dates together. Also update the matching tool date in `src/data/games.ts`. These values are normalized planning references and must not be presented as official prices.

## Guides

Guides use MDX under `src/pages/<game>/` with `GuideLayout.astro`. Register searchable guide metadata in `src/data/guides.ts`. Keep guide URLs shallow and supporting copy concise. Interactive Preact calculators can be imported into MDX when they materially help.

## Search and local data

The search index is assembled at build time from game, tool and guide configuration and passed to a small hydrated Preact component. No external search service is used.

Saved calculator state uses namespaced browser storage keys (`gc:*`). The Privacy Settings dialog can clear calculator data, favorites, progress and map history independently.

## Deployment

The build output is the static `dist` directory.

### Cloudflare Pages

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 22.13 or newer

No Worker is required. `public/_headers` supplies baseline security and immutable asset caching headers.

### Netlify

`netlify.toml` sets:

- Build command: `npm run build`
- Publish directory: `dist`

Set the production domain to `gamescalculators.com` so canonical and sitemap URLs match `astro.config.mjs`.

## Content and privacy expectations

- The intended audience is 13+.
- No accounts, comments, direct messaging or email capture are included.
- Do not add unverified individual item pages or empty tool routes.
- Run `npm run safety:check` before publishing new copy.
- Update the privacy and cookie policies before enabling non-essential analytics or advertising cookies.
