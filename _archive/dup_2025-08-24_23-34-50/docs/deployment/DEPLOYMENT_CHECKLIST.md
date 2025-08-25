# Cabana Deployment Checklist

## Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build successful (`npm run build`)
- [ ] Security audit completed
- [ ] Performance optimized

## Environment Variables Required

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Build Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Deployment Steps

1. Push to main branch
2. Vercel auto-deploys
3. Verify deployment
4. Test critical paths
5. Monitor for errors

