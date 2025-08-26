# Product Requirements Document (PRD)

## 1. Purpose
Standardize contribution workflows to improve code quality, onboarding, and delivery speed.

## 2. Scope
Covers structure, commands, style, tests, commits/PRs, and security for this repo.

## 3. Users
- Core developers (maintainers, release).
- Contributors (features, fixes).
- Automation agents (Codex, CI bots).

## 4. Functional Requirements
- Clear layout: `/src`, `/tests`, `/scripts`, `/public`, `/docs`, `/.github`.
- Standard commands: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm fmt`.
- Lint/format via ESLint + Prettier.
- Tests: Vitest/Jest (+ Testing Library). e2e via Playwright if present. Coverage ≥80%.
- Conventional Commits; PR checklist with linked issues and screenshots for UI.
- Secrets in `.env.local`; provide `.env.example`.

## 5. Non-Functional Requirements
- Setup <10 minutes on Node ≥20 + pnpm.
- CI enforces build, lint, tests before merge.
- Docs concise (<400 words) and maintained with code.

## 6. Risks & Constraints
- Style or commit drift slows review.
- Secret leakage if env not respected.
- Dependency pinning required for critical packages.

## 7. Success Metrics
- Zero critical lint errors on `main`.
- >90% PRs merged without re-review.
- New contributor onboarding <1 day.
