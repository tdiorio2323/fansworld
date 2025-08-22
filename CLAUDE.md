# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Development
- `npm run dev` - Start both frontend (Vite dev server on port 8080) and backend (Express API server)
- `npm run server:dev` - Start only the Express API server with hot reload using tsx
- `vite` - Start only the frontend development server

### Building & Deployment  
- `npm run build` - Build the frontend for production
- `npm run server:build` - Build the Express backend using TypeScript compiler
- `npm run preview` - Preview the production build locally
- `npm run deploy` - Deploy to Vercel production
- `npm run deploy:preview` - Deploy to Vercel preview environment

### Testing
- `npm test` - Run all unit tests (excludes /tests/ directory and *.spec.ts files)
- `npm run test:unit` - Run unit tests in src/ directory only
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run smoke` - Run smoke tests specifically

### Code Quality
- `npm run lint` - Run ESLint and TypeScript compiler checks
- `npm run typecheck` - Run TypeScript type checking only

### Utilities
- `npm run generate:vip-codes` - Generate VIP access codes using the script

## Architecture Overview

### Dual-Server Architecture
This is a **full-stack application** with two servers:
1. **Vite Dev Server** (port 8080) - Serves the React frontend with HMR
2. **Express API Server** (port 3001) - Handles backend API, AI integrations, and database operations

Both servers run concurrently during development via `npm run dev`.

### Frontend Architecture (React + Vite)
- **React 18** with TypeScript and React Router v6 for client-side routing
- **Vite** as build tool with SWC for fast compilation
- **Tailwind CSS** + **shadcn/ui** components for styling
- **Framer Motion** for animations and transitions
- **TanStack React Query** for data fetching and caching
- **Zod** for runtime type validation

### Backend Architecture (Express + AI)
- **Express.js** server with comprehensive security middleware (CORS, rate limiting, CSRF protection)
- **AI Integrations**: Anthropic Claude SDK and OpenAI SDK for content generation
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect integration
- **File Structure**: `/api/server.ts` contains the entire Express application

### Feature System - Modular Addon Architecture
The codebase implements a **sophisticated addon system** located in `src/features/addons/`:

#### Core Addon Components:
- **`addon-registry.ts`** - Central registry managing all features with lazy loading
- **`feature-flags.ts`** - Feature flag system for enabling/disabling addons
- **`AddonManager`** - Runtime management of addon loading and dependencies

#### Available Addons:
- **Virtual Gifts** (`/virtual-gifts/`) - Monetary gift system
- **PPV Messages** (`/ppv-messages/`) - Pay-per-view messaging
- **Flash Sales** (`/flash-sales/`) - Time-limited promotional campaigns
- **Stories & Highlights** (`/stories-highlights/`) - Instagram-style content
- **Polls & Voting** (`/polls-voting/`) - Interactive fan engagement
- **Custom Requests** (`/custom-requests/`) - Commissioned content system
- **AI Content Tagging** (`/ai-content-tagging/`) - Automated content analysis
- **One-Click Upsells** (`/one-click-upsells/`) - Smart upselling system
- **Loyalty Program** (`/loyalty-program/`) - Points and rewards system

Each addon follows a consistent structure:
```
/addon-name/
  ├── components/     # React components
  ├── services/      # Business logic and API calls  
  ├── types.ts       # TypeScript definitions
  ├── config.ts      # Configuration and settings
  └── index.ts       # Main export
```

### State Management Pattern
- **React Query** for server state and caching
- **Context Providers** for global state (Auth, Accessibility)
- **Local React State** with hooks for component state
- **Supabase Realtime** for live data updates (visitor tracking, signups)

### Security Architecture
Implements enterprise-grade security:
- **CSRF Protection** with token validation
- **Rate Limiting** (tiered: auth, payment, admin, general API)
- **Input Sanitization** for all requests
- **Security Headers** (HSTS, CSP, X-Frame-Options)
- **Environment Validation** using Zod schemas
- **API Key Validation** on server startup

### Performance Optimization
- **Code Splitting** with manual chunks for vendor libraries (React, UI, Stripe, Supabase)
- **Performance Monitoring** with Core Web Vitals tracking
- **Caching Strategy** with TTL-based AI response caching
- **Bundle Optimization** with tree shaking and dead code elimination

## Important Development Notes

### Path Resolution
- Uses `@/` alias pointing to `./src/` directory
- Configured in both Vite config and TypeScript config

### Environment Variables Required
```bash
# AI Services
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...

# Database
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

# Payments  
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Application
VITE_SITE_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### Testing Strategy
- **Unit Tests**: Vitest with Happy DOM environment for component testing
- **E2E Tests**: Playwright for full user journey testing  
- **Smoke Tests**: Quick production health checks
- **Test Exclusions**: Excludes `/tests/` directory and `*.spec.ts` files from unit test runs

### TypeScript Configuration
- **Relaxed Settings**: `strict: false`, `noImplicitAny: false` for rapid development
- **References Setup**: Uses project references with separate app config
- **Skip Lib Check**: Enabled for faster compilation

### Deployment Architecture
- **Frontend**: Static deployment to Vercel with automatic deployments
- **Backend**: Express server deployment (likely Vercel functions)
- **Database**: Hosted Supabase instance
- **CDN**: Vercel Edge Network for global distribution

## Claude Code Templates

This project is configured with advanced Claude Code templates and agents:

### Available Agents
- **`fullstack-developer`** - Expert in React + Express.js full-stack development
- **`security-auditor`** - Security specialist for vulnerability assessment
- **`file-system-organizer`** - Advanced file organization and project restructuring

### Available Commands
- **`generate-tests`** - Automatically generate comprehensive test suites
- Use standard commands: `/agents`, `/commands`, `/mcps` to explore more

### Template Usage
```bash
# Use specialized agents
/agent fullstack-developer
/agent security-auditor

# Generate comprehensive tests
/command generate-tests

# Organize project files
/agent file-system-organizer
```

## Community Guidelines

- **Code of Conduct**: `CODE_OF_CONDUCT.md` - Community behavior standards
- **Contributing**: `CONTRIBUTING.md` - Development and contribution guidelines
- **Issues**: Use GitHub Issues for bug reports and feature requests