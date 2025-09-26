# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Development
- `npm run dev` - Start the Next.js development server (default port 3000)
- `npm run build` - Build the Next.js application for production
- `npm run start` - Start the production Next.js server
- `npm run lint` - Run ESLint checks with Next.js configuration

### Testing
- `npm test` - Run unit tests using Vitest
- `npm run test:watch` - Run tests in watch mode with Vitest

### Code Quality
- `npm run type-check` - Run TypeScript type checking only

## Architecture Overview

### Hybrid Architecture: Next.js + Standalone Express API
This is a **hybrid full-stack application** with two distinct server components:

1. **Next.js Application** (port 3000) - Main frontend and App Router pages
2. **Standalone Express API Server** (`/api/server.ts`, port 3001) - Dedicated backend for AI services and complex operations

### Frontend Architecture (Next.js 14 + App Router)
- **Next.js 14** with App Router for file-based routing and server components
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with custom themes (noir, desert, neon)
- **Framer Motion** for animations and page transitions
- **Supabase Client** for database operations and authentication
- **Urbanist** Google Font for typography

### Backend Architecture (Express + AI Services)
- **Standalone Express Server** (`/api/server.ts`) with enterprise-grade security
- **AI Integrations**: 
  - Anthropic Claude SDK (claude-3-sonnet-20240229)
  - OpenAI SDK (GPT-4) for content generation
- **Security Features**: CSRF protection, rate limiting, input sanitization, security headers
- **Database**: Supabase (PostgreSQL) with service role key for server operations
- **Caching**: TTL-based AI response caching with SecureCache class
- **Rate Limiting**: Tiered rate limiting (auth: strictest, payments, admin, general API)

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
- **Local React State** with hooks for component state
- **Supabase Client** for database operations and real-time subscriptions  
- **Next.js App Router** state management patterns
- **Framer Motion** for animation state

### Security Architecture
Implements enterprise-grade security:
- **CSRF Protection** with token validation
- **Rate Limiting** (tiered: auth, payment, admin, general API)
- **Input Sanitization** for all requests
- **Security Headers** (HSTS, CSP, X-Frame-Options)
- **Environment Validation** using Zod schemas
- **API Key Validation** on server startup

### Performance Optimization
- **Next.js Optimizations** with App Router and automatic code splitting
- **AI Response Caching** with TTL-based SecureCache class (1000 item limit)
- **Static Assets** optimized through Next.js built-in optimizations
- **Theme System** with dynamic CSS class switching

## Important Development Notes

### Path Resolution
- Uses `@/` alias pointing to `./src/` directory
- Uses `app/*` alias pointing to `./app/` directory for App Router pages
- Configured in TypeScript config with path references

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
VITE_SITE_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

### Testing Strategy
- **Unit Tests**: Vitest with jsdom environment for React component testing
- **Test Configuration**: Custom vitest.config.ts with React SWC plugin and vite-tsconfig-paths for path resolution
- **Test Environment**: Includes mock Supabase environment variables and test globals
- **Test Timeout**: 10 second timeout for async operations
- **E2E Testing**: Playwright configuration available for end-to-end testing

### TypeScript Configuration
- **Relaxed Settings**: `strict: false`, `noImplicitAny: false`, `strictNullChecks: false` for rapid development
- **References Setup**: Uses project references with tsconfig.app.json for application-specific config
- **Skip Lib Check**: Enabled for faster compilation
- **Vitest Types**: Global vitest types enabled for testing

### Deployment Architecture
- **Frontend**: Next.js application deployed to Vercel with automatic deployments
- **Backend**: Standalone Express server (`/api/server.ts`) requires separate deployment
- **Database**: Hosted Supabase PostgreSQL instance
- **Static Assets**: Next.js optimized static files served via Vercel CDN

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