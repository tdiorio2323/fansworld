# Repository Guidelines

## Project Structure & Module Organization
The Next.js app router lives in `app/`, covering marketing pages, the dashboard, and vanity routes under `[username]/`. Shared React building blocks stay in `components/`, while domain logic, hooks, and integrations live under `src/features`, `src/hooks`, and `src/integrations` with unit specs in `src/__tests__`. The Express entrypoint and OpenAPI contract sit in `api/server.ts` and `api/openapi.yml`. Static assets belong in `public/`, reusable scripts in `scripts/`, and end-to-end suites in `tests/` alongside Playwright smoke checks.

## Build, Test, and Development Commands
Install dependencies with `npm install` (or `pnpm install`). Use `npm run dev` for the local Next server, `npm run build` to compile, and `npm run start` to serve the production bundle. Guard quality with `npm run lint` (ESLint + Next rules), `npm run type-check` (strict TypeScript), and `npm run test` or `npm run test:watch` for Vitest. Run browser automation via `npx playwright test`, targeting individual specs when needed (`npx playwright test tests/e2e/auth.spec.ts`).

## Coding Style & Naming Conventions
Ship TypeScript functional components exported from PascalCase files (`CreatorHero.tsx`). Hooks use the `use` prefix; shared helpers belong in `src/lib` and domain modules inside their feature folders. Tailwind drives styling—group utilities logically rather than mixing ad hoc CSS. Match the prevailing two-space indentation and single quotes, and rely on `npm run lint -- --fix` for import ordering or minor formatting repairs.

## Testing Guidelines
Vitest powers fast unit coverage; mirror source structure when placing specs in `src/__tests__` or `tests/unit`, and mock Supabase, Stripe, AWS SDK, and other network calls. Playwright covers smoke and end-to-end journeys (`tests/e2e`, `tests/smoke.spec.ts`); focus on high-value flows and assert API responses where practical. Name tests descriptively (`should_redirect_guests`) and ensure both Vitest and Playwright suites pass before requesting review.

## Commit & Pull Request Guidelines
History favors Conventional Commits (`feat:`, `fix:`, `chore:`). Keep messages imperative and scoped, stacking small commits for clarity. PRs must describe the change, link issues or tickets, attach UI screenshots or recordings when visuals move, note any migrations or seeds, and confirm linting, type checks, Vitest, and Playwright have succeeded locally.

## Environment & Configuration
Start with `cp .env.example .env` and supply Supabase, Pusher, Stripe, Redis, and AWS credentials. Store shared secrets in Vercel rather than Git. FFmpeg features rely on `ffmpeg-static`; verify binaries by running `npm run dev` once after installing. Document new variables in `CLAUDE.md` and update helper scripts in `scripts/` when onboarding more services.

## Brand Assets
Primary logos and identity files live in `public/brand/`. The main mark is `public/brand/cabana-holo-logo.png`; keep this file name stable and update references if a new version ships. Additional hero treatments (`cabana-holo-circle.jpg`, `cabana-holo-stage.png`, `cabana-wordmark-spotlight.png`) and the visual guidelines sheet (`cabana-brand-kit.png`) support marketing pages and should be optimized before adding new variants.
