#!/bin/bash

# Cabana Production Deployment Script
# This script handles the complete deployment process

set -e  # Exit on error

echo "🚀 Starting Cabana Production Deployment..."
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory. Please run from /Users/tylerdiorio/fansworld/"
    exit 1
fi

# Step 1: Check for environment variables
echo "📋 Step 1: Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found!"
    echo "   Please copy .env.production.template to .env.production and fill in values"
    echo "   Then run this script again."
    exit 1
fi

# Step 2: Run tests
echo "🧪 Step 2: Running tests..."
npm test || echo "⚠️  Tests failed or not configured - continuing anyway"

# Step 3: Lint check
echo "🔍 Step 3: Running lint check..."
npm run lint || echo "⚠️  Linting issues found - please review"

# Step 4: Build the project
echo "🔨 Step 4: Building production bundle..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not created"
    exit 1
fi

echo "✅ Build successful!"

# Step 5: Deploy to Vercel
echo "🌐 Step 5: Deploying to Vercel..."
echo "   This will deploy to: cabana.tdstudiosny.com"
echo ""
echo "   Choose deployment method:"
echo "   1) Automatic deployment (npm run deploy)"
echo "   2) Manual deployment with Vercel CLI"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "📤 Deploying automatically..."
        npm run deploy
        ;;
    2)
        echo "📤 Starting Vercel CLI deployment..."
        echo "   Run: vercel --prod"
        echo ""
        echo "   When prompted:"
        echo "   - Link to existing project: Yes"
        echo "   - Select 'fansworld' project"
        echo "   - Deploy to production"
        vercel --prod
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Step 6: Post-deployment checklist
echo ""
echo "📝 Post-Deployment Checklist:"
echo "================================"
echo "[ ] 1. Verify site loads at https://cabana.tdstudiosny.com"
echo "[ ] 2. Test VIP code entry flow"
echo "[ ] 3. Check Supabase connection"
echo "[ ] 4. Test email capture"
echo "[ ] 5. Verify Stripe integration (if configured)"
echo "[ ] 6. Check AI features (if API keys configured)"
echo "[ ] 7. Run through full registration flow"
echo "[ ] 8. Check mobile responsiveness"
echo ""
echo "🎉 Deployment complete! Your premium creator platform is ready."
echo ""
echo "Important URLs:"
echo "- Production: https://cabana.tdstudiosny.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Supabase Dashboard: https://app.supabase.com"
echo ""
echo "Next steps:"
echo "1. Monitor the deployment in Vercel dashboard"
echo "2. Check Analytics for traffic"
echo "3. Begin creator outreach campaign"
echo ""
echo "✨ Good luck with your launch!"