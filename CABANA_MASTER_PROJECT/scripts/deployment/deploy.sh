#!/bin/bash

# TD Studios Deployment Script
# This script will deploy your TD Studios platform to production

echo "🚀 Starting TD Studios Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application for production..."
npm run build

echo "✅ Build complete! Your app is ready for deployment."

# Display deployment options
echo ""
echo "📋 Next Steps - Choose your deployment method:"
echo ""
echo "1️⃣ Deploy to Vercel (Recommended):"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""
echo "2️⃣ Deploy to Netlify:"
echo "   npm install -g netlify-cli"
echo "   netlify deploy --prod --dir=dist"
echo ""
echo "3️⃣ Deploy to your own server:"
echo "   Upload the 'dist' folder to your web server"
echo ""
echo "🔑 Don't forget to:"
echo "   - Configure your environment variables on your hosting platform"
echo "   - Set up your custom domain (tdstudiosny.com)"
echo "   - Configure Stripe webhook endpoints"
echo ""
echo "💰 Your TD Studios platform is ready to start making money!"