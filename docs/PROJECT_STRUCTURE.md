# Cabana Project Structure

## Directory Organization

### `/src` - Source Code
- **`/components`** - React components
  - `/common` - Reusable common components
  - `/features` - Feature-specific components
  - `/layout` - Layout components (Navbar, Footer, etc.)
  - `/ui` - UI library components
  - `/admin` - Admin dashboard components
  - `/creator` - Creator-related components
  - `/referral` - Referral system components
  - `/analytics` - Analytics components
  - `/auth` - Authentication components
  - `/messaging` - Messaging components
- **`/pages`** - Page components (routes)
- **`/hooks`** - Custom React hooks
- **`/lib`** - Utility libraries and helpers
- **`/features`** - Feature modules (addons system)
- **`/types`** - TypeScript type definitions
- **`/integrations`** - Third-party integrations (Supabase, Stripe)
- **`/styles`** - Global styles and CSS
- **`/assets`** - Static assets (images, fonts)
- **`/tests`** - Test files

### `/api` - Backend API
- Express server and API endpoints

### `/config` - Configuration
- Build configs, environment configs

### `/public` - Public Assets
- Static files served directly

### `/database` - Database
- SQL schemas, migrations, Supabase config

### `/docs` - Documentation
- Project documentation and README files

### `/tools` - Development Tools
- Build tools, generators, debug utilities

### `/scripts` - Scripts
- Build scripts, deployment scripts

## Key Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env` - Environment variables
- `index.html` - Main HTML entry point

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect
- **AI**: Anthropic Claude, OpenAI GPT
- **Deployment**: Vercel

## Features

1. **Creator Platform** - Content creator management
2. **Subscription System** - Paid subscriptions
3. **Messaging** - Real-time messaging
4. **Analytics** - Creator analytics dashboard
5. **Referral System** - Multi-level referral program
6. **Admin Dashboard** - Platform administration
7. **AI Tools** - Content generation and tagging
8. **Payment Processing** - Stripe integration
9. **Social Proof** - Live visitor tracking
10. **Conversion Optimization** - Exit intent, countdown timers

