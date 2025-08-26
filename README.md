# CABANA Platform

[![Cabana CI](https://github.com/tdiorio2323/fansworld/actions/workflows/cabana-ci.yml/badge.svg?branch=main)](https://github.com/tdiorio2323/fansworld/actions/workflows/cabana-ci.yml)

A modern creator economy platform built with Vite + React + Supabase.

## Features

- **Creator Dashboard** - Complete content management and analytics
- **Fan Engagement** - Interactive features for creator-fan connections
- **Secure Payments** - Stripe integration for subscriptions and tips
- **Real-time Chat** - Direct messaging between creators and fans
- **Mobile Responsive** - Optimized for all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type check
npm run typecheck
```

## Deployment

This project is configured for deployment on Vercel with automatic builds from the main branch.

Environment variables required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Route Health Monitoring

The project includes automated route health checking:

```bash
# Generate route list
node scripts/list-routes.mjs

# Check route health
scripts/check-routes.sh

# Verify component mounting
node scripts/mount-check.mjs
```

Reports are generated in the `reports/` directory.

## Contributor Guide

See the Repository Guidelines in [AGENTS.md](./AGENTS.md) for project structure, build/test commands, coding style, testing expectations, commit/PR conventions, and security tips. Prefer `pnpm` for scripts where available.
