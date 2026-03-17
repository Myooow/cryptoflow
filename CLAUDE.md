# CLAUDE.md — CryptoFlow Project Rules

## Language & Communication
- Always respond in **French**.
- All code (variables, functions, file names, commits) must be written in **English**.
- No comments in the code. Zero. The code must be self-documenting through clear naming conventions.

## Pedagogical Workflow (CRITICAL)
This project is a **learning exercise**. After creating each file:
1. **STOP** — Do not move to the next file.
2. **Explain in French**, line by line (or block by block), what you just wrote and why. Cover:
   - What this file's role is in the overall architecture.
   - Why each import is needed.
   - What each function/component does and the technical reasoning behind the approach.
   - Any Next.js, React, or WebSocket concept involved (Suspense, "use cache", streaming, server components, proxy.ts, etc.).
3. **Wait for my explicit confirmation** ("ok", "next", "continue", "c'est bon") before creating the next file.

Never batch-create multiple files at once. One file at a time, explain, wait.

## Tech Stack
- **Framework**: Next.js 16.1 (App Router, Turbopack default)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 consumed exclusively via `@apply` inside SCSS modules — zero Tailwind classes in JSX
- **UI Components**: shadcn/ui
- **Charts**: Recharts (candlestick / OHLC)
- **Real-time**: Binance Public WebSocket API (wss://stream.binance.com:9443)
- **Static/Cold Data**: CoinGecko REST API (free Demo plan)
- **Cache**: Next.js 16 `"use cache"` directive (replaces legacy ISR/revalidate)
- **Package Manager**: pnpm
- **React**: 19.2 (bundled with Next.js 16.1)

## Styling Rules (CRITICAL — STRICT SCSS ONLY IN JSX)
- **ZERO Tailwind classes in TSX/JSX files. Ever.** No `className="flex items-center"`. No exceptions.
- Every component has a colocated `.module.scss` file. Every single one.
- Tailwind is installed and configured but used **only** via `@apply` inside `.module.scss` files.
- TSX files only reference SCSS module classes: `className={styles.deleteButton}`.
- The SCSS file is the **single source of truth** for all visual styling.

### Example pattern:
```
// Button.tsx
import styles from './Button.module.scss';

export function Button() {
  return <button className={styles.deleteButton}>Delete</button>;
}
```
```
// Button.module.scss
.deleteButton {
  @apply bg-red-500 text-white font-semibold py-2 px-4 rounded;

  &:hover {
    @apply bg-red-600;
  }
}
```

### File structure per component:
```
components/shared/
├── TokenCard.tsx
├── TokenCard.module.scss
├── Header.tsx
├── Header.module.scss
└── ...
```

### Additional SCSS rules:
- Global styles in `/app/globals.scss` — imports Tailwind directives and global resets.
- SCSS variables for custom design tokens in `/styles/_variables.scss`.
- SCSS mixins for responsive breakpoints and reusable patterns in `/styles/_mixins.scss`.
- Use `@apply` for Tailwind utilities. Use native SCSS for complex logic (nesting, loops, conditionals, animations).
- No inline styles. No CSS-in-JS. No `style={}` prop.
- Class names in SCSS modules are camelCase (`.tokenCard`, `.priceUp`, `.chartContainer`).

## Architecture Rules
- Use the App Router (`/app`) exclusively — no `/pages` directory.
- Maximize Server Components by default. Only use `"use client"` when strictly necessary (interactivity, hooks, WebSocket, browser APIs).
- Use `proxy.ts` instead of `middleware.ts` (Next.js 16 convention).
- Colocate related files: each route folder contains its `page.tsx`, `loading.tsx`, and route-specific components.
- Shared components go in `/components`, split into `/components/ui` (shadcn primitives) and `/components/shared` (project-level reusable components).
- All API calls and data-fetching logic live in `/lib/api/` — never fetch directly inside components.
- Types/interfaces go in `/types/` — one file per domain (`token.ts`, `market.ts`, `websocket.ts`).
- Environment variables in `.env.local` — never hardcode API keys or URLs.
- Custom hooks in `/hooks/` (e.g., `useBinanceStream.ts`, `useDebounce.ts`).
- Constants and config in `/lib/constants.ts` and `/lib/config.ts`.
- SCSS partials in `/styles/` (`_variables.scss`, `_mixins.scss`).

## Data Architecture
- **CoinGecko REST (free)**: Token lists, categories, trending, OHLC history, search. Cached via `"use cache"` directive with appropriate cache profiles. Respect rate limit (~30 req/min).
- **Binance WebSocket (free)**: Real-time price ticker (`<symbol>@ticker`), kline/candlestick stream (`<symbol>@kline_<interval>`), individual trades (`<symbol>@trade`). Managed client-side with auto-reconnect and ping/pong handling.
- Mapping layer in `/lib/api/mapper.ts` to normalize CoinGecko symbol IDs to Binance trading pairs (e.g., `bitcoin` → `BTCUSDT`).

## Code Quality
- No `any` type. Ever. Use `unknown` + type guards if needed.
- No default exports except for Next.js pages/layouts (required by framework).
- Prefer named exports for everything else.
- Use `async/await` — no raw `.then()` chains.
- Error handling: every fetch wrapped in try/catch with typed error responses.
- Use Zod for API response validation when data shape is critical.

## File Naming Conventions
- **Components**: `PascalCase.tsx` (e.g., `TokenCard.tsx`, `PriceTicker.tsx`, `CandlestickChart.tsx`)
- **Styles**: `PascalCase.module.scss` matching component name (e.g., `TokenCard.module.scss`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useBinanceStream.ts`, `useDebounce.ts`)
- **Utils/lib**: `camelCase.ts` (e.g., `coingecko.ts`, `mapper.ts`, `constants.ts`)
- **Types**: `camelCase.ts` in `/types/` (e.g., `token.ts`, `market.ts`, `websocket.ts`)
- **Next.js special files**: lowercase as required by framework (`page.tsx`, `layout.tsx`, `loading.tsx`, `proxy.ts`)

## Security
- All API keys in environment variables.
- Server-side data fetching only for CoinGecko (hide API key).
- WebSocket connections client-side only (Binance public streams require no auth).
- Input sanitization on search queries.
- CSP headers configured in `next.config.ts`.

## GitHub Repository
- Initialize a git repo at project start with `git init`.
- Create the remote repo on GitHub named `cryptoflow` using the GitHub CLI (`gh repo create`).
- Add a proper `.gitignore` for Next.js projects.
- Add a `README.md` with project description, stack, and setup instructions.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`
- One feature per commit, atomic and descriptive.
- Push to `main` branch after each major milestone.

## Next.js 16 Specific Patterns
- Use `"use cache"` directive instead of legacy `revalidate` / ISR for caching.
- Use `proxy.ts` instead of `middleware.ts` — export a named `proxy` function.
- Turbopack is the default bundler — no `--turbopack` flag needed in scripts.
- React Compiler available via `reactCompiler: true` in next.config.ts.
- Scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`.
