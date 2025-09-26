# Repository Guidelines

## Project Structure & Module Organization
FansWorld ships a Next.js app router under `app/` for marketing, dashboard, and `[username]/` vanity routes. Shared UI lives in `components/`, while feature logic, hooks, and integrations stay in `src/features`, `src/hooks`, and `src/integrations`; cross-cutting helpers belong in `src/lib`. The Express backend starts at `api/server.ts` with the contract in `api/openapi.yml`. Place static assets in `public/`, shared scripts in `scripts/`, and end-to-end suites in `tests/` alongside Playwright smoke specs. Unit specs mirror source folders inside `src/__tests__`.

## Build, Test, and Development Commands
- `npm install` (or `pnpm install`) syncs dependencies.
- `npm run dev` launches the Next.js dev server; run once to verify `ffmpeg-static` binaries.
- `npm run build` compiles the production bundle, and `npm run start` serves it.
- Quality gates: `npm run lint`, `npm run type-check`, `npm run test`, and `npx playwright test` for browser automation.

## Coding Style & Naming Conventions
Author TypeScript functional components in PascalCase files (`CreatorHero.tsx`) and prefix hooks with `use`. Favor Tailwind utility groupings over ad hoc CSS, observing the existing two-space indentation and single quotes. Use `npm run lint -- --fix` for import ordering or small formatting corrections.

## Testing Guidelines
Vitest handles fast unit coverage; colocate specs under `src/__tests__` or `tests/unit` and mock Supabase, Stripe, and AWS calls. Playwright lives in `tests/e2e` and `tests/smoke.spec.ts`; focus on high-value user journeys, asserting API responses when possible. Name tests descriptively (e.g. `should_redirect_guests`) and ensure both Vitest and Playwright suites pass before requesting review.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) with imperative, scoped messages. PRs should describe the change, link issues or tickets, include UI screenshots or recordings when visuals shift, and call out migrations or seeds. Confirm lint, type-check, Vitest, and Playwright all pass locally, and document new environment variables in `CLAUDE.md`.

## Environment Notes
Start by copying `.env.example` to `.env` and supply Supabase, Pusher, Stripe, Redis, and AWS credentials. Store shared secrets in Vercel, not Git, and update helper scripts under `scripts/` when you add new services.
