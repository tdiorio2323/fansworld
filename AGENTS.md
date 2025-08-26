# Repository Guidelines

## Project Structure & Module Organization
- Source in `src/` (e.g., `components/`, `lib/`, `pages/` or `app/`, `styles/`).
- Tests colocated as `*.test.ts`/`*.spec.ts` or in `__tests__/`.
- Database schema/migrations in `prisma/`.
- Assets in `public/` or `assets/`; CI in `.github/workflows/`; scripts in `scripts/`.
- Shared packages in `packages/` or `libs/`. Prefer small, focused modules with clear exports.

## Build, Test, and Development Commands
- Install deps: `pnpm i` (fallback: `npm i`).
- Dev server: `pnpm dev` (typically `http://localhost:3000`).
- Build app: `pnpm build`; run production: `pnpm start`.
- Lint/format: `pnpm lint`, `pnpm format`.
- Unit tests: `pnpm test`; coverage: `pnpm test -- --coverage`.
- Prisma: `pnpm prisma generate`, `pnpm prisma migrate dev`.

## Coding Style & Naming Conventions
- Language: TypeScript; indent 2 spaces; Prettier config in `.prettierrc.json`.
- Files: `kebab-case.ts`; React components: `PascalCase.tsx`.
- Variables/functions: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Prefer absolute imports where configured; avoid deep `../../..` chains.

## Testing Guidelines
- Frameworks: Vitest/Jest for unit; Playwright for e2e (if configured).
- Name tests `*.test.ts`/`*.spec.ts`; place near code or in `__tests__/`.
- Target >80% coverage on critical paths; include edge and error cases.
- Use factories/mocks in `tests/` or `src/test-utils/`.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Write imperative, concise subjects; scope when useful (e.g., `feat(api): ...`).
- PRs include: clear description, linked issues (e.g., `Closes #123`), screenshots for UI, and DB migration notes.
- Ensure CI is green; update tests; run `pnpm lint && pnpm format` before requesting review.

## Security & Configuration
- Never commit secrets; use `.env.local`. Keep `.env*` in `.gitignore`.
- Rotate keys if exposed. Use `prisma migrate` for schema changes; avoid manual SQL in production.

## Agent-Specific Instructions
- Keep diffs minimal and focused. Update docs/tests when touching public APIs or CLI.
- Fix root causes, not symptoms. Stay consistent with existing style and structure.
