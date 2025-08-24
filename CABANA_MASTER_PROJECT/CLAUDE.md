# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CABANA is a comprehensive creator economy platform built with React, TypeScript, and Node.js. It provides creators with tools for content management, fan engagement, revenue optimization, and analytics.

## Common Commands

### Development
- `npm run dev` - Start development server (runs both frontend Vite server on port 8080 and backend Express server)
- `npm run server:dev` - Start backend development server only (Express with tsx watch)
- `npm run build` - Build production frontend
- `npm run server:build` - Build production backend

### Code Quality
- `npm run lint` - Run ESLint and TypeScript checks
- `npm run typecheck` - Run TypeScript type checking only

### Testing
- `npm test` - Run unit tests
- `npm run test:unit` - Run unit tests in src/ directory
- `npm run test:integration` - Run integration tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run smoke` - Run smoke tests

### Utility Scripts
- `npm run export:html` - Export static HTML pages
- `npm run generate:vip-codes` - Generate VIP access codes
- `npm run generate:sitemap` - Generate sitemap

## Architecture Overview

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6 with nested layouts
- **State Management**: React Query for server state, Context API for UI state
- **UI Components**: shadcn/ui component library with Radix UI primitives

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with social providers
- **Payments**: Stripe Connect for creator payouts
- **AI Integration**: Anthropic Claude and OpenAI GPT APIs
- **Real-time**: Supabase real-time subscriptions

### Key Directories

#### `/src` - Frontend Source
- `/components` - React components organized by feature
  - `/ui` - Base UI components (buttons, inputs, etc.)
  - `/layout` - Layout components (MainLayout, AuthLayout, etc.)
  - `/auth` - Authentication components
  - `/creator` - Creator dashboard components
  - `/admin` - Admin panel components
- `/pages` - Route components organized hierarchically
- `/features` - Feature modules with addon system architecture
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/types` - TypeScript type definitions
- `/integrations` - Third-party service integrations

#### `/api` - Backend Source
- `server.ts` - Express server with comprehensive security middleware
- Rate limiting, CSRF protection, input sanitization implemented

#### `/supabase` - Database
- `/migrations` - Database schema migrations
- `/functions` - Edge functions for server-side logic

### Layout System
The application uses a nested layout system with React Router:
- `MainLayout` - Standard public/user pages
- `AuthLayout` - Authentication pages
- `CreatorLayout` - Creator dashboard
- `AdminLayout` - Admin panel

### Feature System
The codebase includes a modular addon system in `/src/features/addons/`:
- AI Content Tagging
- Loyalty Program  
- One-Click Upsells
- PPV Messages
- Stories & Highlights
- Virtual Gifts
- Flash Sales
- Custom Requests
- Polls & Voting

Each addon follows a consistent structure with components, services, types, and configuration.

## Development Guidelines

### TypeScript Configuration
- Strict mode disabled for gradual adoption
- Path aliases configured: `@/*` maps to `./src/*`
- Multiple tsconfig files for different build targets

### Code Patterns
- Use React functional components with hooks
- Implement proper error boundaries
- Follow the established component structure in `/src/components/ui`
- Use Tailwind CSS classes, avoid custom CSS unless necessary
- Implement proper loading states and error handling

### Security Practices
- All API keys are server-side only (never exposed to browser)
- CSRF protection implemented
- Rate limiting on all API endpoints
- Input validation with Zod schemas
- Content Security Policy headers

### Testing Strategy
- Unit tests with Vitest and React Testing Library
- Integration tests for user flows
- E2E tests with Playwright
- Test files located alongside components or in `__tests__` directories

### Performance Optimizations
- Code splitting configured in Vite with manual chunks
- Lazy loading for heavy components
- React Query for efficient data fetching and caching
- Optimized bundle size with vendor chunk splitting

## API Integration Patterns

### Supabase Integration
- Use the configured client from `/src/integrations/supabase/client.ts`
- Implement Row Level Security policies
- Use real-time subscriptions for live features

### Payment Integration
- Stripe Connect for creator payouts
- Secure webhook handling for payment events
- Payment verification through Supabase functions

### AI Features
- Server-side API routes for Claude and OpenAI integration
- Content generation and tagging services
- Proper error handling and rate limiting for AI requests

## Deployment

### Frontend
- Builds to `/dist` directory
- Vercel deployment configuration in `vercel.json`
- Environment variables configured for production

### Backend
- Express server builds with TypeScript compilation
- Supabase functions deployed separately
- Database migrations managed through Supabase CLI

## Important Notes

- The project is currently on the `nextjs-conversion` branch
- Development server runs on port 8080 (frontend) and 3001 (backend)
- All sensitive operations are handled server-side with proper validation
- The codebase includes comprehensive error handling and user feedback systems