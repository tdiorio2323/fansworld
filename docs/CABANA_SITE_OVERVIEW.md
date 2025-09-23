# CABANA Site Overview

A concise map of what the CABANA experience contains inside the Fansworld repo: tech stack, features, route structure, and pragmatic wireframes to guide implementation and polish.

## Tech Stack
- Frontend: React 18 + Vite (SWC), TypeScript, React Router v6.
- UI: Tailwind CSS (configured), Radix UI primitives, Framer Motion, glassmorphism tokens.
- State/Data: TanStack Query for async/server state; local auth guards.
- Payments/Services: Stripe (`@stripe/stripe-js`), Supabase client, QR/UUID utils.
- Backend (dev): Express server under `api/` (run via `tsx` in dev).
- Tooling: ESLint, Vitest + Testing Library, Playwright, PostCSS, Prettier.

## Core Features
- Auth + Onboarding: Login, Register, Callback, simple guards, OTP-ready.
- Discovery & Feed: Discover, Feed, Reels; Creator profile pages.
- Monetization: Subscription plans, payment success, billing, referrals.
- Creator Tools: Dashboard, Content Manager, Analytics.
- Messaging: Protected messages area with threads/conversation stubs.
- Admin: Admin dashboard route + guard.
- Cabana Sub‑App: Isolated module mounted at `/cabana/*` (public, user, creator, admin areas).

## Active Routes (Top‑Level + Cabana)
```text
/                        → SimpleVipEntry
/test, /vip              → TestPage, VipEntry
/signin, /login          → SignIn
/register, /signup       → Register
/auth/callback           → SimpleAuthCallback
/discover, /feed, /reels (protected)
/creator/:username       → CreatorProfile
/agency, /creator-application (protected)
/analytics, /referrals (protected)
/admin (admin guard)
/creator-dashboard, /content-manager (protected)
/subscription-plans, /payment-success, /landing
/messages, /billing, /settings (protected)
/cabana/*                → Cabana sub‑router
```
Cabana sub‑routes:
```text
/cabana                  → Cabana Home
/cabana/about | features | pricing | creators
/cabana/discover | feed
/cabana/subscription-plans | payment-success | payment-failed
/cabana/signin | register
/cabana/user (protected) | /cabana/creator/dashboard (protected) | /cabana/admin (admin)
```

## Information Architecture (Wireframe Guidance)
- Global Shell
  - Header: logo, primary nav (Discover, Feed, Pricing), auth CTAs.
  - Layout: fluid 12‑column, 1200px max, 24px gutters; mobile‑first.
  - Theme: dark gradient background; glass cards (blur 18px, 1px hairline, deep shadow).
- Auth Screens
  - Centered card ≤ 420px; fields (email/pass), SSO placeholder, error text, success route to feed.
- Discover
  - Top filter bar: search, categories, sort; below, 3‑column card grid (creator/content cards with cover, price/badges, CTA).
- Feed
  - Two‑column stream (content left), right rail (recommended creators, trending tags, upsells); infinite scroll.
- Creator Profile
  - Hero (avatar, name, stats, Subscribe CTA), tabs: Posts | About | Bundles | Shop; sticky subscribe on mobile.
- Messaging
  - Three‑pane: threads (left 280px), chat (center), profile/actions (right 320px); responsive collapses.
- Creator Dashboard
  - KPI cards (MRR, ARPU, New Subs), revenue chart, recent purchases table; quick actions (post, discount, DM blast).
- Monetization
  - Plans page with 3 cards (Starter/Pro/Agency), benefits list, monthly/yearly toggle; Stripe modal flow → success.
- Admin
  - Left nav (Users, Creators, Payments, Content), top KPIs, moderation queues.

## Data & Integrations (practical)
- Auth: keep guards in Router; when ready, swap to real token/session hook and gate protected routes.
- Payments: use Stripe Checkout for MVP; store post‑success state client‑side, reconcile server‑side later.
- Content: start static/dummy; wire Supabase or API routes incrementally.

## Quality & Ops
- Performance: lazy‑load route groups, prefetch above‑the‑fold assets.
- Accessibility: color contrast on glass, focus rings, keyboard nav.
- Testing: Vitest for components, Playwright smoke for key flows (/signin → /payment-success).

## Next Steps
1) Pixel‑match Auth, Discover, Feed per brand PDF using Tailwind tokens.
2) Replace placeholder guards with real auth; add user menu and session state.
3) Implement plans → Stripe Checkout → success; capture plan in local state.
4) Add creator dashboard charts and content table; wire mock data.
5) Harden Lighthouse (A11y/Best Practices ≥ 95, Perf ≥ 85).

