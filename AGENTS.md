# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/` (e.g., `components/`, `lib/`, `pages/` or `app/`, `styles/`).
- Tests colocated as `*.test.ts`/`*.spec.ts` or under `__tests__/`.
- Database schema/migrations in `prisma/`.
- Assets in `public/` or `assets/`; CI in `.github/workflows/`; scripts in `scripts/`.
- Shared packages in `packages/` or `libs/`. Prefer small, focused modules with clear exports.
- Use absolute imports where configured; avoid deep `../../..` chains.

## Build, Test, and Development Commands
- Install deps: `pnpm i` (fallback: `npm i`).
- Dev server: `pnpm dev` (default `http://localhost:3000`).
- Build app: `pnpm build`; production: `pnpm start`.
- Lint/format: `pnpm lint`, `pnpm format`.
- Unit tests: `pnpm test`; coverage: `pnpm test -- --coverage`.
- Prisma: `pnpm prisma generate`, `pnpm prisma migrate dev`.

## Coding Style & Naming Conventions
- Language: TypeScript; indent 2 spaces; Prettier config in `.prettierrc.json`.
- Files: `kebab-case.ts`; React components: `PascalCase.tsx`.
- Variables/functions: `camelCase`; constants: `UPPER_SNAKE_CASE`.

## Testing Guidelines
- Frameworks: Vitest/Jest for unit; Playwright for e2e (if configured).
- Name tests as above; keep near code or in `__tests__/`.
- Target >80% coverage on critical paths; include edge and error cases.
- Use factories/mocks in `tests/` or `src/test-utils/`.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- PRs include description, linked issues (e.g., `Closes #123`), screenshots for UI, and DB migration notes.
- Ensure CI is green; update tests; run `pnpm lint && pnpm format` before review.

## Security & Configuration
- Never commit secrets; use `.env.local`. Keep `.env*` in `.gitignore`.
- Rotate keys if exposed. Use `prisma migrate`; avoid manual SQL in production.

## Agent-Specific Instructions
- Keep diffs minimal and focused; update docs/tests when touching public APIs or CLI.
- Fix root causes, not symptoms; stay consistent with existing style and structure.

