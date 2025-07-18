# 🚀 TD Studios Database Setup Guide

## Quick Setup Instructions

### 1. Apply Database Migrations

Run these migrations in your Supabase SQL editor in order:

#### Migration 1: Agency Schema
```sql
-- Copy contents from: supabase/migrations/20250718000000-td-studios-agency-schema.sql
```

#### Migration 2: Stripe Integration
```sql
-- Copy contents from: supabase/migrations/20250718000001-stripe-payment-integration.sql
```

#### Migration 3: Waitlist & Invites
```sql
-- Copy contents from: supabase/migrations/20250718000002-waitlist-and-invites.sql
```

#### Migration 4: Referral Program
```sql
-- Copy contents from: supabase/migrations/20250718000003-referral-program.sql
```

### 2. Set Environment Variables

Create `.env.local` file with:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Add Stripe Secret to Vault

In Supabase SQL editor:

```sql
-- Enable vault extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "supabase_vault" SCHEMA vault;

-- Add your Stripe secret key
INSERT INTO vault.secrets (name, secret)
VALUES ('stripe_secret_key', 'sk_test_your_actual_stripe_secret_key')
ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
```

### 4. Create Stripe Products

In your Stripe Dashboard, create these products:

1. **TD Studios Starter Package**
   - Product ID: `prod_starter_tdstudios`
   - Price: $2,500/month
   - Price ID: `price_starter_monthly`

2. **TD Studios Premium Package**
   - Product ID: `prod_premium_tdstudios`
   - Price: $5,000/month
   - Price ID: `price_premium_monthly`

3. **TD Studios Elite Package**
   - Product ID: `prod_elite_tdstudios`
   - Price: $10,000/month
   - Price ID: `price_elite_monthly`

### 5. Configure Stripe Webhooks

Set up webhook endpoint at: `https://yourdomain.com/api/stripe/webhook`

Select these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`

### 6. Test the System

1. **Visit coming soon page**: `/coming-soon`
2. **Test waitlist signup**: Add email to waitlist
3. **Test invite codes**: Use codes `CREATOR01`, `CREATOR02`, etc.
4. **Test agency application**: Fill out creator application
5. **Test billing system**: Try subscription flow

## 🎯 What's Ready to Use

### ✅ Completed Features

- **Agency Landing Page** (`/agency`) - Service packages and pricing
- **Creator Application** (`/creator-application`) - Multi-step onboarding
- **Coming Soon Page** (`/coming-soon`) - Email waitlist + invite codes
- **HTML Generator** (`/html-generator`) - Custom HTML creation tool
- **Billing System** (`/billing`) - Subscription management
- **Admin Dashboard** (`/admin`) - Application management
- **Database Schema** - Complete agency operations setup
- **Stripe Integration** - Payment processing ready
- **Referral Program** - Commission tracking system
- **Webhook Handlers** - Automated payment processing

### 📋 Sample Data Included

The migrations include sample data:
- **Invite Codes**: `CREATOR01`, `CREATOR02`, `CREATOR03`, `EARLY001`, `EARLY002`
- **Referral Programs**: Creator referral, affiliate partner, influencer programs
- **Service Packages**: Starter ($2,500), Premium ($5,000), Elite ($10,000)

## 🔗 Key URLs

- **Agency Info**: `/agency`
- **Apply to Join**: `/creator-application`
- **Coming Soon**: `/coming-soon`
- **HTML Generator**: `/html-generator`
- **Billing Portal**: `/billing`
- **Admin Panel**: `/admin`

## 💰 Revenue Streams Ready

1. **Management Fees**: $2,500-$10,000/month
2. **Commission Structure**: 20-30% of creator earnings
3. **Referral Program**: 5-15% commission on referrals
4. **Setup Fees**: One-time charges
5. **Additional Services**: Legal, PR, consulting

## 🚀 Next Steps

1. **Apply migrations** to create database tables
2. **Configure Stripe** with your real keys and products
3. **Set up domain** and deploy to production
4. **Test all flows** end-to-end
5. **Launch marketing** campaigns
6. **Scale operations** as creators join

## 📞 Support

- Email: hello@tdstudiosny.com
- Documentation: All code is documented inline
- Monetization Guide: See `MONETIZATION_SETUP_GUIDE.md`

---

**Everything is ready to launch! 🎉**