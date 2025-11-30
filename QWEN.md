# QWEN.md - Cabana Creator Platform

## Project Overview

Cabana is a comprehensive creator economy platform (formerly named fansworld) designed as a luxury link-in-bio solution for content creators. It provides sophisticated monetization tools, including subscriptions, pay-per-view content, VIP access, and tip goals. The platform includes both a modern Next.js frontend and a secure Express.js backend with advanced security features, AI integration, and real-time messaging capabilities.

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management

### Backend
- **Express.js** with TypeScript
- **Supabase** for database and authentication
- **Stripe** for payment processing
- **OpenAI & Anthropic** for AI features
- **Socket.IO** for real-time communication
- **Redis** for caching and rate limiting

### Security & Infrastructure
- **Helmet** for security headers
- **Rate limiting** and brute force protection
- **CORS** with environment-specific configuration
- **Compression** and optimized caching
- **Pino** for structured logging

## Project Structure

```
fansworld/                          # Main project directory
├── api/                           # Express.js backend server
│   ├── server.ts                  # Main server file with security middleware
│   └── openapi.yml                # API specification
├── app/                           # Next.js App Router pages
│   └── page.tsx                   # Home page
├── components/                    # React UI components
├── lib/                           # Shared utilities and services
│   └── security-enhanced.ts       # Security middleware and configuration
├── src/                           # Source code
│   ├── lib/                       # Additional libraries
│   ├── routes/                    # API route handlers
│   └── features/                  # Feature-specific code
├── config/                        # Configuration files
├── public/                        # Static assets
├── mocks/                         # Mock data and JSON files
├── supabase/                      # Supabase configuration
├── tests/                         # Test files
├── docker-compose.yml             # Docker configuration
└── package.json                   # Dependencies and scripts
```

## Building and Running

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm (or bun, as packageManager is pnpm@10.15.1)
- Supabase project
- Stripe account
- OpenAI and Anthropic API keys

### Environment Setup
1. Copy `.env.example` to `.env` and fill in your credentials
2. Configure Supabase URL and service role key
3. Set up Stripe keys for payment processing
4. Add OpenAI and Anthropic API keys

### Development Commands
```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start development server (Next.js)
node api/server.ts              # Start backend API server
pnpm test                       # Run unit tests
pnpm test:e2e                   # Run end-to-end tests
pnpm type-check                 # Type checking
```

### Production Commands
```bash
pnpm build                      # Build the Next.js application
pnpm start                      # Start production server
```

## Key Features

### Creator Economy Infrastructure
- Subscription management system
- Pay-per-view (PPV) content monetization
- VIP access and exclusive content delivery
- Creator dashboard with analytics
- Tip goal functionality
- Content scheduling and management

### AI Integration
- Claude (Anthropic) and GPT (OpenAI) integration
- Content generation for bios, social media, and marketing materials
- Caching system for AI responses
- Rate limiting for AI endpoints

### Security Features
- Comprehensive security headers (CSP, HSTS, etc.)
- Rate limiting per endpoint type
- Brute force protection for authentication
- Input validation and sanitization
- CORS configuration with origin validation
- CSRF protection
- Request correlation IDs for security auditing

### Real-time Features
- Socket.IO integration for messaging
- Real-time notifications
- Live content updates
- Presence indicators

## Development Conventions

### Code Style
- TypeScript with strict mode (where possible)
- ESLint with Next.js recommended rules
- Tailwind CSS utility-first approach
- Component-based architecture with clear separation of concerns

### Security Best Practices
- Client-side exposed environment variables prefixed with `VITE_`
- Server-side secrets never exposed to client
- Environment validation with Zod
- Input validation for all user inputs
- Proper error handling without information leakage

### API Design
- RESTful API design with consistent naming
- Versioned endpoints (api/v1/)
- Comprehensive error responses with correlation IDs
- Rate limiting applied appropriately to endpoints

## Notable Files

- `api/server.ts`: Main Express.js server with comprehensive security middleware
- `src/lib/security-enhanced.ts`: Security utilities and middleware
- `package.json`: Scripts and dependencies for the full-stack application
- `COMPREHENSIVE_ARCHITECTURE_SUMMARY.md`: Detailed page architecture documentation
- `PRODUCTION_READINESS_AUDIT.md`: Production readiness assessment with critical issues
- `next.config.mjs`: Next.js configuration with security headers
- `tsconfig.json`: TypeScript configuration with path aliases

## Production Readiness

The platform has a solid foundation but requires attention to several production readiness aspects:
- Mock data integration needs to be replaced with real API calls
- Environment configuration needs production-hardened defaults
- Some API keys may be exposed in client-side builds
- TODO items in code need completion for full functionality

## Testing

- Unit tests with Vitest
- E2E tests with Playwright
- API testing for backend endpoints
- Component testing for UI elements

## Deployment

The platform is designed for deployment on platforms like Vercel (for Next.js) and can be containerized with the provided Docker configuration. Environment-specific configurations for CORS, rate limiting, and security headers are implemented.

## Architecture Notes

The platform is designed as a multi-tenant system with separate creator profiles, admin dashboards, and user interfaces. The backend is designed to scale with Redis for caching, real-time features, and rate limiting. The security implementation is enterprise-grade with security headers, rate limiting, and audit logging.