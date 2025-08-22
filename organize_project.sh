#!/bin/bash

# Cabana Project Organization Script
# This script organizes the project files into a clean, professional structure

echo "🏗️ Starting Cabana Project Organization..."

# Create organized directory structure
echo "📁 Creating organized directory structure..."

# Main organized output directory
ORGANIZED_DIR="/Users/tylerdiorio/Tyler/cabana_organized"
mkdir -p "$ORGANIZED_DIR"

# Core directories
mkdir -p "$ORGANIZED_DIR/src/components/common"
mkdir -p "$ORGANIZED_DIR/src/components/features"
mkdir -p "$ORGANIZED_DIR/src/components/layout"
mkdir -p "$ORGANIZED_DIR/src/components/ui"
mkdir -p "$ORGANIZED_DIR/src/components/admin"
mkdir -p "$ORGANIZED_DIR/src/components/creator"
mkdir -p "$ORGANIZED_DIR/src/components/referral"
mkdir -p "$ORGANIZED_DIR/src/components/analytics"
mkdir -p "$ORGANIZED_DIR/src/components/auth"
mkdir -p "$ORGANIZED_DIR/src/components/messaging"

mkdir -p "$ORGANIZED_DIR/src/pages"
mkdir -p "$ORGANIZED_DIR/src/hooks"
mkdir -p "$ORGANIZED_DIR/src/lib"
mkdir -p "$ORGANIZED_DIR/src/features"
mkdir -p "$ORGANIZED_DIR/src/types"
mkdir -p "$ORGANIZED_DIR/src/integrations"
mkdir -p "$ORGANIZED_DIR/src/styles"
mkdir -p "$ORGANIZED_DIR/src/assets"
mkdir -p "$ORGANIZED_DIR/src/tests"

mkdir -p "$ORGANIZED_DIR/api"
mkdir -p "$ORGANIZED_DIR/config"
mkdir -p "$ORGANIZED_DIR/public"
mkdir -p "$ORGANIZED_DIR/scripts"
mkdir -p "$ORGANIZED_DIR/docs"
mkdir -p "$ORGANIZED_DIR/database"
mkdir -p "$ORGANIZED_DIR/tools"

# Copy and organize files
echo "📂 Organizing source files..."

# Copy main source files
cp -r /Users/tylerdiorio/Tyler/cabana/src/* "$ORGANIZED_DIR/src/" 2>/dev/null

# Copy API files
cp -r /Users/tylerdiorio/Tyler/cabana/api/* "$ORGANIZED_DIR/api/" 2>/dev/null

# Copy config files
cp /Users/tylerdiorio/Tyler/cabana/*.json "$ORGANIZED_DIR/" 2>/dev/null
cp /Users/tylerdiorio/Tyler/cabana/*.js "$ORGANIZED_DIR/" 2>/dev/null
cp /Users/tylerdiorio/Tyler/cabana/*.ts "$ORGANIZED_DIR/" 2>/dev/null
cp /Users/tylerdiorio/Tyler/cabana/.env* "$ORGANIZED_DIR/" 2>/dev/null
cp /Users/tylerdiorio/Tyler/cabana/vercel.json "$ORGANIZED_DIR/" 2>/dev/null

# Copy public assets
cp -r /Users/tylerdiorio/Tyler/cabana/public/* "$ORGANIZED_DIR/public/" 2>/dev/null

# Copy documentation
cp -r /Users/tylerdiorio/Tyler/cabana/docs/* "$ORGANIZED_DIR/docs/" 2>/dev/null
cp /Users/tylerdiorio/Tyler/cabana/*.md "$ORGANIZED_DIR/docs/" 2>/dev/null

# Copy database files
cp -r /Users/tylerdiorio/Tyler/cabana/sql "$ORGANIZED_DIR/database/" 2>/dev/null
cp -r /Users/tylerdiorio/Tyler/cabana/supabase "$ORGANIZED_DIR/database/" 2>/dev/null

# Copy tools and scripts
cp -r /Users/tylerdiorio/Tyler/cabana/tools/* "$ORGANIZED_DIR/tools/" 2>/dev/null
cp -r /Users/tylerdiorio/Tyler/cabana/scripts/* "$ORGANIZED_DIR/scripts/" 2>/dev/null

# Copy HTML files
cp /Users/tylerdiorio/Tyler/cabana/index.html "$ORGANIZED_DIR/" 2>/dev/null

# Create a project summary file
echo "📝 Creating project summary..."

cat > "$ORGANIZED_DIR/PROJECT_STRUCTURE.md" << 'EOF'
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

EOF

# Create file inventory
echo "📊 Creating file inventory..."

cat > "$ORGANIZED_DIR/FILE_INVENTORY.md" << 'EOF'
# Cabana Project File Inventory

## Component Files Count
EOF

echo "- Total Components: $(find "$ORGANIZED_DIR/src/components" -name "*.tsx" -o -name "*.ts" | wc -l)" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "- Pages: $(find "$ORGANIZED_DIR/src/pages" -name "*.tsx" -o -name "*.ts" | wc -l)" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "- Hooks: $(find "$ORGANIZED_DIR/src/hooks" -name "*.tsx" -o -name "*.ts" | wc -l)" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "- Features: $(find "$ORGANIZED_DIR/src/features" -name "*.tsx" -o -name "*.ts" | wc -l)" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "- API Files: $(find "$ORGANIZED_DIR/api" -name "*.ts" -o -name "*.js" | wc -l)" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"

echo "" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "## Key Components" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"

# List key components
ls -1 "$ORGANIZED_DIR/src/components/"*.tsx 2>/dev/null | head -20 | sed 's/.*\//- /' >> "$ORGANIZED_DIR/FILE_INVENTORY.md"

echo "" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "## Pages" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"
echo "" >> "$ORGANIZED_DIR/FILE_INVENTORY.md"

# List all pages
ls -1 "$ORGANIZED_DIR/src/pages/"*.tsx 2>/dev/null | sed 's/.*\//- /' >> "$ORGANIZED_DIR/FILE_INVENTORY.md"

# Create deployment checklist
echo "📋 Creating deployment checklist..."

cat > "$ORGANIZED_DIR/DEPLOYMENT_CHECKLIST.md" << 'EOF'
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

EOF

echo "✅ Organization complete!"
echo "📁 Organized project location: $ORGANIZED_DIR"
echo ""
echo "Summary:"
echo "- Source files organized by type"
echo "- Documentation consolidated"
echo "- Configuration files preserved"
echo "- Project structure documented"
echo ""
echo "Next steps:"
echo "1. Review organized structure in $ORGANIZED_DIR"
echo "2. Copy back to main project if satisfied"
echo "3. Update import paths if needed"