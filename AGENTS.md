# Repository Guidelines

## Project Structure & Module Organization
- **App Router** in `app/` with nested routes (`(marketing)`, `(auth)`, `(dashboard)`, `(admin)`).
- Reusable UI in `components/` and helpers in `lib/`.
- Backend utilities in `scripts/` and schema in `prisma/`.
- Static assets in `public/`. CI workflows in `.github/workflows/`.
- Tests colocated as `*.test.ts`/`*.spec.ts` or under `tests/`.

## Build, Test, and Development Commands
- Install deps: `pnpm i`.
- Run dev server: `pnpm dev` → http://localhost:3000.
- Production build: `pnpm build` then `pnpm start`.
- Lint/format: `pnpm lint` and `pnpm format`.
- Unit tests: `pnpm test` (Vitest). Coverage: `pnpm test -- --coverage`.
- Supabase migrations: `pnpm supabase db push` or `pnpm prisma migrate dev`.

## Coding Style & Naming Conventions
- Language: **TypeScript** with strict mode.
- Indent **2 spaces**. Use Prettier (`.prettierrc.json`).
- Files: `kebab-case.ts`. React components: `PascalCase.tsx`.
- Variables/functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`.
- Absolute imports (`@/lib/...`, `@/components/...`) instead of deep `../../`.

## Testing Guidelines
- **Frameworks**: Vitest for unit; Playwright optional for e2e.
- Name tests `*.test.ts[x]` or `*.spec.ts[x]`.
- Place near source or in `tests/`.
- Target **≥80% coverage** on core logic and routes.
- Use `src/test-utils/` for mocks/factories.

## Commit & Pull Request Guidelines
- Follow **Conventional Commits**:
  - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
  - Scope where helpful: `feat(auth): add reset-password`.
- PRs must include:
  - Clear description and linked issues (e.g., `Closes #123`).
  - Screenshots for UI changes.
  - Notes for DB migrations or API changes.
- Run `pnpm lint && pnpm test` before requesting review. Ensure CI is green.

## Security & Configuration
- Never commit secrets. Use `.env.local`. Ship `.env.example`.
- Rotate keys if exposed. All secrets must be injected via Vercel/CI.
- Schema changes go through migrations — no manual SQL in prod.

## Agent-Specific Instructions
- Keep diffs minimal and atomic.
- Update docs/tests when changing public APIs or CLI scripts.
- Fix root cause bugs, not just symptoms.
- Stay consistent with Next.js App Router patterns and Tailwind class conventions.
