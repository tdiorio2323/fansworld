#!/bin/bash
set -euo pipefail

# CABANA Next.js App Router Scaffold Script
# Creates ~50 routes using dynamic segments instead of hundreds of static files

echo "🚀 Starting CABANA route scaffolding..."

# Template for marketing pages
MARKETING_TPL='import MarketingPage from "../_templates/MarketingPage";
export default function Page() {
    return <MarketingPage title="Replace with page title" subtitle="Replace with page description" />;
}'

# Template for dashboard pages
DASHBOARD_TPL='import DashboardTwoCol from "../../_templates/DashboardTwoCol";
export default function Page() {
    return <DashboardTwoCol title="Dashboard" />;
}'

# Template for form pages
FORM_TPL='import FormPage from "../../_templates/FormPage";
export default function Page() {
    return <FormPage title="Form Page" />;
}'

# Template for dynamic pages
DYNAMIC_TPL='import MarketingPage from "../../_templates/MarketingPage";
export default function Page({ params }: { params: { slug: string } }) {
    return <MarketingPage title={`Page: ${params.slug}`} subtitle="Dynamic content based on slug" />;
}'

# Template for catch-all pages
CATCHALL_TPL='import MarketingPage from "../../../_templates/MarketingPage";
export default function Page({ params }: { params: { slug: string[] } }) {
    const path = params.slug.join("/");
    return <MarketingPage title={`${path}`} subtitle="Dynamic catch-all content" />;
}'

# Function to create page if it doesn't exist
mk() {
    local path="$1"
    local template="$2"

    if [ ! -f "app/$path/page.tsx" ]; then
        mkdir -p "app/$path"
        echo "$template" > "app/$path/page.tsx"
        echo "✅ Created app/$path/page.tsx"
    else
        echo "⏭️  Skipped app/$path/page.tsx (already exists)"
    fi
}

echo "📄 Creating core marketing pages..."
# Core marketing pages
for p in "about" "pricing" "creators" "security" "press" "careers" "contact" "demo" "waitlist" "affiliate" "partner" "api" "roadmap" "status" "brand" "events" "beta" "coming-soon"; do
    mk "$p" "$MARKETING_TPL"
done

echo "🔐 Creating auth pages..."
# Auth pages
for p in "auth/sign-in" "auth/register" "auth/forgot-password" "auth/reset-password" "auth/verify-email" "auth/verify-phone"; do
    mk "$p" "$FORM_TPL"
done

echo "🎯 Creating onboarding flow..."
# Onboarding pages
for p in "onboarding/choose-account-type" "onboarding/creator-application" "onboarding/age-verification" "onboarding/id-verification" "onboarding/address-verification" "onboarding/payment-setup" "onboarding/profile-setup" "onboarding/welcome"; do
    mk "$p" "$FORM_TPL"
done

echo "🎨 Creating creator dashboard..."
# Creator dashboard pages
for p in "creator/dashboard" "creator/messages" "creator/earnings" "creator/store" "creator/live" "creator/link-bio" "creator/marketing" "creator/analytics" "creator/settings"; do
    mk "$p" "$DASHBOARD_TPL"
done

# Creator profile pages
for p in "creator/profile/edit" "creator/profile/pricing-tiers" "creator/profile/preferences" "creator/profile/privacy" "creator/profile/notifications"; do
    mk "$p" "$FORM_TPL"
done

# Creator content pages
for p in "creator/content/upload" "creator/content/library" "creator/content/calendar" "creator/content/templates"; do
    mk "$p" "$DASHBOARD_TPL"
done

# Creator subscriber pages
for p in "creator/subscribers/list" "creator/subscribers/tiers" "creator/subscribers/analytics"; do
    mk "$p" "$DASHBOARD_TPL"
done

echo "👤 Creating user dashboard..."
# User dashboard pages
for p in "user/home" "user/subscriptions" "user/content" "user/messages" "user/purchases" "user/wallet" "user/profile" "user/live" "user/support"; do
    mk "$p" "$DASHBOARD_TPL"
done

echo "⚡ Creating admin panel..."
# Admin pages
for p in "admin/dashboard" "admin/creators" "admin/users" "admin/content" "admin/payments" "admin/platform" "admin/marketing" "admin/settings" "admin/reports"; do
    mk "$p" "$DASHBOARD_TPL"
done

echo "📱 Creating core app pages..."
# Core app pages
for p in "discover" "feed" "reels" "plans" "billing" "settings" "messages" "referrals" "content-manager" "analytics" "agency" "test"; do
    mk "$p" "$MARKETING_TPL"
done

# Payment success page
mk "payment/success" "$MARKETING_TPL"

echo "🔗 Creating dynamic route segments..."
# Dynamic segments
mkdir -p "app/features/[slug]" && echo "$DYNAMIC_TPL" > "app/features/[slug]/page.tsx"
mkdir -p "app/legal/[slug]" && echo "$DYNAMIC_TPL" > "app/legal/[slug]/page.tsx"
mkdir -p "app/safety/[slug]" && echo "$DYNAMIC_TPL" > "app/safety/[slug]/page.tsx"
mkdir -p "app/vs/[slug]" && echo "$DYNAMIC_TPL" > "app/vs/[slug]/page.tsx"
mkdir -p "app/tools/[slug]" && echo "$DYNAMIC_TPL" > "app/tools/[slug]/page.tsx"
mkdir -p "app/errors/[code]" && echo "$DYNAMIC_TPL" > "app/errors/[code]/page.tsx"
mkdir -p "app/m/[slug]" && echo "$DYNAMIC_TPL" > "app/m/[slug]/page.tsx"
mkdir -p "app/app/[slug]" && echo "$DYNAMIC_TPL" > "app/app/[slug]/page.tsx"
mkdir -p "app/status/[slug]" && echo "$DYNAMIC_TPL" > "app/status/[slug]/page.tsx"
mkdir -p "app/utils/[slug]" && echo "$DYNAMIC_TPL" > "app/utils/[slug]/page.tsx"

echo "🌐 Creating catch-all routes..."
# Catch-all segments
mkdir -p "app/help/[...slug]" && echo "$CATCHALL_TPL" > "app/help/[...slug]/page.tsx"
mkdir -p "app/learn/[...slug]" && echo "$CATCHALL_TPL" > "app/learn/[...slug]/page.tsx"
mkdir -p "app/blog/[...slug]" && echo "$CATCHALL_TPL" > "app/blog/[...slug]/page.tsx"
mkdir -p "app/campaigns/[...slug]" && echo "$CATCHALL_TPL" > "app/campaigns/[...slug]/page.tsx"
mkdir -p "app/track/[...slug]" && echo "$CATCHALL_TPL" > "app/track/[...slug]/page.tsx"

# Blog index page
mk "blog" "$MARKETING_TPL"

echo ""
echo "🎉 CABANA route scaffolding complete!"
echo "📊 Created comprehensive route structure with:"
echo "   • Marketing pages with CABANA gradient styling"
echo "   • Dashboard pages with glass morphism"
echo "   • Form pages with premium inputs"
echo "   • Dynamic segments for scalability"
echo "   • Catch-all routes for flexible content"
echo ""
echo "🚀 Ready to run: npm run dev"
