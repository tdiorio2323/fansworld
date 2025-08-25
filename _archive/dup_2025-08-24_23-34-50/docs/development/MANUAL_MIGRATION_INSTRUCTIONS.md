# 🚨 MANUAL DATABASE MIGRATION REQUIRED

**Your CABANA database needs schema setup to function.**

## 📍 **MANUAL STEPS TO COMPLETE DATABASE:**

### **Step 1: Open Supabase SQL Editor**
1. Go to: https://supabase.com/dashboard/project/dotfloiygvhsujlwzqgv
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

### **Step 2: Run Core Schema Migration**
Copy and paste this SQL into the editor and click **Run**:

```sql
-- CABANA Core Tables Creation
-- Run this entire block in Supabase SQL Editor

-- Creator Applications Table
CREATE TABLE IF NOT EXISTS creator_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    location TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    instagram_handle TEXT,
    tiktok_handle TEXT,
    onlyfans_handle TEXT,
    twitch_handle TEXT,
    youtube_handle TEXT,
    total_followers INTEGER NOT NULL,
    monthly_earnings INTEGER NOT NULL,
    content_niche TEXT NOT NULL,
    career_goals TEXT NOT NULL,
    current_challenges TEXT NOT NULL,
    previous_management TEXT NOT NULL,
    interested_package TEXT NOT NULL,
    over_18 BOOLEAN NOT NULL DEFAULT false,
    agrees_to_terms BOOLEAN NOT NULL DEFAULT false,
    agrees_to_background BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'on_hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Creator Earnings Table
CREATE TABLE IF NOT EXISTS creator_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gross_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    platform_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')),
    payout_date DATE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    plan_type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Content Table  
CREATE TABLE IF NOT EXISTS content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'text', 'audio')),
    file_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Referral Codes Table
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    uses_remaining INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);
```

### **Step 3: Enable Row Level Security**
Run this second block:

```sql
-- Enable RLS on all tables
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view own applications" ON creator_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON creator_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can view own earnings" ON creator_earnings FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can view own messages" ON messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

CREATE POLICY "Creators can manage own content" ON content FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view active referral codes" ON referral_codes FOR SELECT USING (is_active = true);
```

## ✅ **After Running Both Blocks:**

1. **Refresh** your Supabase dashboard
2. Go to **Table Editor** - you should see all the new tables
3. **Test the connection** by running CABANA locally

## 🚀 **Once Complete:**
Your CABANA database will be fully functional with all critical tables!

**❓ Let me know when you've completed these steps and I'll verify the schema is working.**