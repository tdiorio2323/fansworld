# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript app (pages, routes, hooks, lib). Example: `src/pages/HomePage.tsx`, `src/routes/AppRoutes.tsx`, `src/hooks/useAuth.tsx`.
- `api/`: Express server entry (`api/server.ts`) used during local dev.
- `public/`: Static assets and HTML (e.g., `public/auth/*.html`).
- `tests/`: E2E and smoke tests for Playwright; unit tests primarily live next to code in `src/` and in `src/__tests__/`.
- `supabase/`: Edge functions and SQL migrations.
- `scripts/`, `sql/`, `docs/`: Developer utilities, DB helpers, and docs.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server and watch the API (`tsx watch api/server.ts`).
- `npm run build`: Vite production build.
- `npm run preview`: Preview the built app locally.
- `npm run server:build`: Type-check/build server with `tsc`.
- `npm run lint`: ESLint + TypeScript typecheck.
- `npm run test`: Vitest run (excludes Playwright specs and `tests/`).
- `npm run test:unit`: Vitest for unit tests in `src/`.
- `npm run test:coverage`: Vitest with coverage.
- `npm run test:e2e`: Playwright tests in `tests/`.
- `npm run smoke`: Minimal Playwright smoke suite.

## Coding Style & Naming Conventions
- Language: TypeScript, React 18, Vite. Indentation: 2 spaces.
- Components: PascalCase files (e.g., `HomePage.tsx`). Hooks: `useX` in `src/hooks`.
- Utilities in `src/lib`; Supabase integration in `src/integrations/supabase`.
- Linting: `eslint.config.js` (React Hooks rules enabled; some TS rules relaxed). Run `npm run lint` before PRs.

## Testing Guidelines
- Unit: Vitest + JSDOM. Prefer `*.test.ts(x)` colocated with source or under `src/__tests__/`.
- E2E: Playwright specs as `*.spec.ts` under `tests/`. Local server auto-starts from config.
- Coverage: `npm run test:coverage` for reports. Keep meaningful assertions and avoid brittle selectors.

## Commit & Pull Request Guidelines
- Commits: Short, imperative summaries (e.g., "Add creator onboarding form"). Conventional Commits are welcome but not required.
- PRs: Clear description, linked issues, repro steps, and screenshots/GIFs for UI changes. Include test plan (`unit`, `e2e` if applicable) and note any migrations.

## Security & Configuration Tips
- Never commit secrets. Copy `.env.example` to `.env` and fill locally.
- Vercel deploy via `npm run deploy(:preview)`. Review `supabase/functions/*` and SQL migrations before merging.
