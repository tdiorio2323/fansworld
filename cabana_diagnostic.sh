#!/bin/bash

# CABANA PROJECT DIAGNOSTIC SCRIPT
echo "🔍 CABANA PROJECT DIAGNOSTIC"
echo "=========================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Not in a Node.js project directory"
    exit 1
fi

PROJECT_NAME=$(grep -o '"name": "[^"]*' package.json | cut -d'"' -f4)
echo "📁 Project: $PROJECT_NAME"
echo ""

# 1. Check Node.js and npm versions
echo "🟢 ENVIRONMENT CHECK"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# 2. Check package.json for problematic dependencies
echo "🟡 DEPENDENCY CHECK"
if grep -q "express-rate-limit" package.json; then
    VERSION=$(grep -o '"express-rate-limit": "[^"]*' package.json | cut -d'"' -f4)
    echo "express-rate-limit: $VERSION"
    if [[ "$VERSION" < "7.0.0" ]]; then
        echo "⚠️  express-rate-limit is outdated (has deprecated onLimitReached)"
    else
        echo "✅ express-rate-limit is up to date"
    fi
else
    echo "❓ express-rate-limit not found"
fi
echo ""

# 3. Check for problematic files
echo "🔴 ISSUE CHECK"

if [[ -f "src/lib/rate-limit.ts" ]]; then
    if grep -q "onLimitReached" src/lib/rate-limit.ts; then
        echo "❌ rate-limit.ts contains deprecated onLimitReached"
    else
        echo "✅ rate-limit.ts is clean"
    fi
else
    echo "❓ rate-limit.ts not found"
fi

if [[ -f "vite.config.ts" ]]; then
    if grep -q "process.env" vite.config.ts; then
        echo "⚠️  vite.config.ts may expose environment variables"
    else
        echo "✅ vite.config.ts is secure"
    fi
else
    echo "❓ vite.config.ts not found"
fi

# Check for ambiguous Tailwind classes
if find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs grep -l "duration-\[3000ms\]" >/dev/null 2>&1; then
    echo "⚠️  Found ambiguous Tailwind duration classes"
else
    echo "✅ No ambiguous Tailwind classes found"
fi

# Check crypto imports
if [[ -f "src/lib/security.ts" ]]; then
    if grep -q "import.*crypto" src/lib/security.ts && grep -q "window\.crypto" src/lib/security.ts; then
        echo "⚠️  security.ts has mixed crypto imports"
    else
        echo "✅ security.ts crypto imports are clean"
    fi
else
    echo "❓ security.ts not found"
fi

echo ""

# 4. Check build artifacts
echo "🏗️  BUILD ARTIFACTS"
if [[ -d "dist" ]]; then
    echo "✅ dist directory exists"
    if find dist -name "*.js" >/dev/null 2>&1; then
        LARGEST_CHUNK=$(find dist -name "*.js" -exec ls -la {} \; | sort -k5 -nr | head -1 | awk '{print $9, $5}')
        echo "📦 Largest chunk: $LARGEST_CHUNK"
    fi
else
    echo "❓ No dist directory found"
fi

if [[ -d "exported_pages" ]]; then
    echo "✅ exported_pages directory exists"
    PAGE_COUNT=$(find exported_pages -name "*.html" | wc -l)
    echo "📄 Exported pages: $PAGE_COUNT"
else
    echo "❓ No exported_pages directory found"
fi

echo ""

# 5. Development server status
echo "🚀 SERVER STATUS"
if lsof -ti:3001 >/dev/null 2>&1; then
    echo "✅ API server running on port 3001"
else
    echo "❌ API server not running on port 3001"
fi

if lsof -ti:8080 >/dev/null 2>&1; then
    echo "✅ Vite dev server running on port 8080"
else
    echo "❌ Vite dev server not running on port 8080"
fi

echo ""

# 6. Recommendations
echo "💡 RECOMMENDATIONS"
echo "1. Run the fixes script if you see any ❌ or ⚠️  above"
echo "2. Update dependencies: npm update"
echo "3. Clear cache if issues persist: rm -rf node_modules package-lock.json && npm install"
echo "4. Consider bundle analysis: npm run build -- --analyze"
echo ""

echo "✅ Diagnostic complete!"
