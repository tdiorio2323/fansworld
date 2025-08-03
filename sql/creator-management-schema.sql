-- =============================================================================
-- CREATOR MANAGEMENT PLATFORM - DATABASE SCHEMA
-- PostgreSQL Schema with Supabase Integration
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================================================
-- CORE USER & AUTHENTICATION TABLES
-- =============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'admin', 'manager', 'brand')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMPTZ,
    privacy_accepted_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'other', 'prefer-not-to-say')),
    location JSONB, -- {country, state, city, timezone}
    website_url TEXT,
    social_links JSONB, -- {instagram, tiktok, youtube, twitter, etc.}
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    verification_documents JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CREATOR MANAGEMENT TABLES
-- =============================================================================

-- Creators table
CREATE TABLE public.creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'premium', 'elite')),
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 30.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    manager_id UUID REFERENCES public.users(id),
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_followers INTEGER DEFAULT 0,
    total_content_count INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    performance_score DECIMAL(5,2) DEFAULT 0.00,
    brand_safety_score DECIMAL(5,2) DEFAULT 100.00,
    last_active_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator platform connections
CREATE TABLE public.creator_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'onlyfans', 'twitter', 'twitch')),
    platform_user_id TEXT NOT NULL,
    platform_username TEXT NOT NULL,
    platform_display_name TEXT,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    connected BOOLEAN DEFAULT TRUE,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed')),
    sync_error TEXT,
    metrics JSONB DEFAULT '{}',
    platform_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_id, platform)
);

-- Creator tiers and pricing
CREATE TABLE public.creator_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    monthly_fee DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    limits JSONB NOT NULL DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CONTENT MANAGEMENT TABLES
-- =============================================================================

-- Content posts
CREATE TABLE public.content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'onlyfans', 'twitter', 'twitch')),
    platform_post_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'carousel', 'story', 'reel', 'live', 'short')),
    title TEXT,
    description TEXT,
    caption TEXT,
    media_urls JSONB DEFAULT '[]',
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived', 'deleted')),
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    hashtags TEXT[],
    mentions TEXT[],
    location JSONB,
    collaboration_id UUID,
    campaign_id UUID,
    metrics JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, platform_post_id)
);

-- Content metrics tracking
CREATE TABLE public.content_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    click_through_rate DECIMAL(5,2) DEFAULT 0.00,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    additional_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, metric_date)
);

-- Content categories and tags
CREATE TABLE public.content_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.content_categories(id),
    color TEXT,
    icon TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.content_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.content_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, category_id)
);

-- =============================================================================
-- CAMPAIGN MANAGEMENT TABLES
-- =============================================================================

-- Brands
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    industry TEXT,
    contact_email TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    billing_address JSONB,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'premium', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('sponsored_post', 'product_placement', 'brand_ambassador', 'event_promotion', 'giveaway')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'active', 'completed', 'cancelled', 'paused')),
    budget DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]',
    requirements JSONB DEFAULT '{}',
    guidelines JSONB DEFAULT '{}',
    approval_notes TEXT,
    completion_notes TEXT,
    metrics JSONB DEFAULT '{}',
    contract_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign deliverables
CREATE TABLE public.campaign_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.content(id),
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'carousel', 'story', 'reel', 'live', 'short')),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'onlyfans', 'twitter', 'twitch')),
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '{}',
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'rejected', 'revision_needed')),
    submission_url TEXT,
    feedback TEXT,
    approval_notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign milestones
CREATE TABLE public.campaign_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue', 'cancelled')),
    payment_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    completion_criteria JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FINANCIAL & PAYMENT TABLES
-- =============================================================================

-- Creator subscriptions
CREATE TABLE public.creator_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES public.creator_tiers(id),
    stripe_subscription_id TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'cancelled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator earnings
CREATE TABLE public.creator_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_earnings DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    commission_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    platform_fees DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_withheld DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    bonus_earnings DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    penalty_deductions DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    net_earnings DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    earnings_breakdown JSONB DEFAULT '{}',
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    payout_date DATE,
    payout_method TEXT CHECK (payout_method IN ('bank_transfer', 'paypal', 'stripe', 'crypto', 'check')),
    payout_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_id, period_type, period_start)
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.creators(id),
    campaign_id UUID REFERENCES public.campaigns(id),
    type TEXT NOT NULL CHECK (type IN ('subscription_payment', 'commission_payment', 'tip', 'brand_payment', 'bonus', 'penalty', 'refund', 'chargeback')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    description TEXT,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    processor_reference TEXT,
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'paypal')),
    brand TEXT,
    last4 TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    billing_address JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ANALYTICS & REPORTING TABLES
-- =============================================================================

-- Analytics reports
CREATE TABLE public.analytics_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    insights JSONB DEFAULT '{}',
    recommendations TEXT[],
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    generated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform metrics history
CREATE TABLE public.platform_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_platform_id UUID NOT NULL REFERENCES public.creator_platforms(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_likes INTEGER DEFAULT 0,
    avg_comments INTEGER DEFAULT 0,
    avg_shares INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    additional_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_platform_id, metric_date)
);

-- Performance benchmarks
CREATE TABLE public.performance_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'onlyfans', 'twitter', 'twitch')),
    follower_range TEXT NOT NULL, -- e.g., "10k-50k", "50k-100k"
    content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video', 'carousel', 'story', 'reel', 'live', 'short')),
    metric_name TEXT NOT NULL,
    percentile_25 DECIMAL(15,2),
    percentile_50 DECIMAL(15,2),
    percentile_75 DECIMAL(15,2),
    percentile_90 DECIMAL(15,2),
    percentile_95 DECIMAL(15,2),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, follower_range, content_type, metric_name)
);

-- =============================================================================
-- NOTIFICATION & COMMUNICATION TABLES
-- =============================================================================

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('milestone', 'payment', 'campaign', 'content', 'system', 'marketing')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication logs
CREATE TABLE public.communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    subject TEXT,
    content TEXT,
    template_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    provider TEXT,
    provider_id TEXT,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- AUTOMATION & WORKFLOW TABLES
-- =============================================================================

-- Automation rules
CREATE TABLE public.automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('content_published', 'milestone_reached', 'payment_received', 'schedule', 'engagement_threshold')),
    trigger_conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '[]',
    active BOOLEAN DEFAULT TRUE,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation execution logs
CREATE TABLE public.automation_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID NOT NULL REFERENCES public.automation_rules(id) ON DELETE CASCADE,
    trigger_data JSONB DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    execution_time_ms INTEGER,
    error_message TEXT,
    actions_executed JSONB DEFAULT '[]',
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- AUDIT & SECURITY TABLES
-- =============================================================================

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- API keys and access tokens
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================================================

-- User and Creator indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role_status ON public.users(role, status);
CREATE INDEX idx_creators_username ON public.creators(username);
CREATE INDEX idx_creators_tier_status ON public.creators(tier, user_id) WHERE tier IS NOT NULL;
CREATE INDEX idx_creator_platforms_creator_platform ON public.creator_platforms(creator_id, platform);
CREATE INDEX idx_creator_platforms_sync_status ON public.creator_platforms(sync_status, last_sync_at);

-- Content indexes
CREATE INDEX idx_content_creator_platform ON public.content(creator_id, platform);
CREATE INDEX idx_content_published_at ON public.content(published_at DESC);
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_content_hashtags ON public.content USING GIN(hashtags);
CREATE INDEX idx_content_metrics_date ON public.content_metrics(content_id, metric_date);

-- Campaign indexes
CREATE INDEX idx_campaigns_creator_status ON public.campaigns(creator_id, status);
CREATE INDEX idx_campaigns_dates ON public.campaigns(start_date, end_date);
CREATE INDEX idx_campaign_deliverables_campaign_status ON public.campaign_deliverables(campaign_id, status);

-- Financial indexes
CREATE INDEX idx_creator_earnings_creator_period ON public.creator_earnings(creator_id, period_start, period_end);
CREATE INDEX idx_transactions_creator_type ON public.transactions(creator_id, type);
CREATE INDEX idx_transactions_status_created ON public.transactions(status, created_at);

-- Analytics indexes
CREATE INDEX idx_platform_metrics_platform_date ON public.platform_metrics(creator_platform_id, metric_date);
CREATE INDEX idx_analytics_reports_creator_type ON public.analytics_reports(creator_id, report_type);

-- Notification indexes
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User access policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Creator access policies
CREATE POLICY "Creators can view their own data" ON public.creators
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Creators can update their own data" ON public.creators
    FOR UPDATE USING (user_id = auth.uid());

-- Content access policies
CREATE POLICY "Creators can manage their own content" ON public.content
    FOR ALL USING (creator_id IN (
        SELECT id FROM public.creators WHERE user_id = auth.uid()
    ));

-- Admin access policies
CREATE POLICY "Admins can access all data" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.creators FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.creator_platforms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.creator_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.creator_earnings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function to calculate creator performance score
CREATE OR REPLACE FUNCTION public.calculate_creator_performance_score(creator_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    engagement_score DECIMAL DEFAULT 0;
    revenue_score DECIMAL DEFAULT 0;
    consistency_score DECIMAL DEFAULT 0;
    growth_score DECIMAL DEFAULT 0;
    final_score DECIMAL DEFAULT 0;
BEGIN
    -- Calculate engagement score (0-25 points)
    SELECT COALESCE(AVG(avg_engagement_rate), 0) * 2.5 INTO engagement_score
    FROM public.creator_platforms 
    WHERE creator_id = creator_uuid;
    
    -- Calculate revenue score (0-25 points)
    SELECT CASE 
        WHEN total_earnings >= 100000 THEN 25
        WHEN total_earnings >= 50000 THEN 20
        WHEN total_earnings >= 25000 THEN 15
        WHEN total_earnings >= 10000 THEN 10
        WHEN total_earnings >= 5000 THEN 5
        ELSE 0
    END INTO revenue_score
    FROM public.creators 
    WHERE id = creator_uuid;
    
    -- Calculate consistency score (0-25 points)
    SELECT CASE 
        WHEN COUNT(*) >= 30 THEN 25
        WHEN COUNT(*) >= 20 THEN 20
        WHEN COUNT(*) >= 15 THEN 15
        WHEN COUNT(*) >= 10 THEN 10
        WHEN COUNT(*) >= 5 THEN 5
        ELSE 0
    END INTO consistency_score
    FROM public.content 
    WHERE creator_id = creator_uuid 
    AND published_at >= NOW() - INTERVAL '30 days';
    
    -- Calculate growth score (0-25 points)
    WITH follower_growth AS (
        SELECT 
            (MAX(followers) - MIN(followers))::DECIMAL / NULLIF(MIN(followers), 0) * 100 as growth_rate
        FROM public.platform_metrics pm
        JOIN public.creator_platforms cp ON pm.creator_platform_id = cp.id
        WHERE cp.creator_id = creator_uuid
        AND pm.metric_date >= NOW() - INTERVAL '90 days'
    )
    SELECT CASE 
        WHEN growth_rate >= 50 THEN 25
        WHEN growth_rate >= 25 THEN 20
        WHEN growth_rate >= 15 THEN 15
        WHEN growth_rate >= 10 THEN 10
        WHEN growth_rate >= 5 THEN 5
        ELSE 0
    END INTO growth_score
    FROM follower_growth;
    
    final_score := LEAST(100, engagement_score + revenue_score + consistency_score + growth_score);
    
    -- Update the creator's performance score
    UPDATE public.creators 
    SET performance_score = final_score, updated_at = NOW()
    WHERE id = creator_uuid;
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Function to sync platform metrics
CREATE OR REPLACE FUNCTION public.sync_platform_metrics()
RETURNS VOID AS $$
BEGIN
    -- Update total followers count for each creator
    UPDATE public.creators 
    SET total_followers = (
        SELECT COALESCE(SUM(follower_count), 0)
        FROM public.creator_platforms 
        WHERE creator_id = creators.id AND connected = true
    );
    
    -- Update total content count for each creator
    UPDATE public.creators 
    SET total_content_count = (
        SELECT COUNT(*)
        FROM public.content 
        WHERE creator_id = creators.id AND status = 'published'
    );
    
    -- Update average engagement rate
    UPDATE public.creators 
    SET avg_engagement_rate = (
        SELECT COALESCE(AVG(
            CASE 
                WHEN (metrics->>'engagement_rate')::DECIMAL > 0 
                THEN (metrics->>'engagement_rate')::DECIMAL 
                ELSE 0 
            END
        ), 0)
        FROM public.creator_platforms 
        WHERE creator_id = creators.id AND connected = true
    );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SEED DATA FOR CREATOR TIERS
-- =============================================================================

INSERT INTO public.creator_tiers (name, description, monthly_fee, commission_rate, features, limits) VALUES
('Starter Package', 'Perfect for emerging creators', 2500.00, 30.00, 
 '["Account management & optimization", "Content planning & strategy", "Basic promotion & marketing", "Weekly performance reports", "Email support"]',
 '{"max_platforms": 2, "max_content_per_month": 50, "analytics_retention_days": 90}'
),
('Premium Package', 'Complete creator management solution', 5000.00, 25.00,
 '["Full content creation & management", "Cross-platform management", "Brand partnership coordination", "Social media management", "24/7 priority support", "Legal consultation", "Custom branding assets"]',
 '{"max_platforms": 5, "max_content_per_month": 200, "analytics_retention_days": 365}'
),
('Elite Package', 'White-glove service for top creators', 10000.00, 20.00,
 '["Complete business management", "Personal brand development", "Legal & contract support", "PR & media relations", "Investment advisory", "Tax planning assistance", "Personal assistant services", "Executive coaching"]',
 '{"max_platforms": 10, "max_content_per_month": 500, "analytics_retention_days": 1095}'
);

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Creator dashboard summary view
CREATE VIEW public.creator_dashboard_summary AS
SELECT 
    c.id,
    c.username,
    c.tier,
    c.total_earnings,
    c.total_followers,
    c.total_content_count,
    c.avg_engagement_rate,
    c.performance_score,
    COUNT(DISTINCT cp.platform) as connected_platforms,
    COUNT(DISTINCT CASE WHEN cam.status = 'active' THEN cam.id END) as active_campaigns,
    COALESCE(SUM(CASE WHEN t.created_at >= NOW() - INTERVAL '30 days' THEN t.amount ELSE 0 END), 0) as earnings_30d
FROM public.creators c
LEFT JOIN public.creator_platforms cp ON c.id = cp.creator_id AND cp.connected = true
LEFT JOIN public.campaigns cam ON c.id = cam.creator_id
LEFT JOIN public.transactions t ON c.id = t.creator_id AND t.status = 'completed'
GROUP BY c.id, c.username, c.tier, c.total_earnings, c.total_followers, c.total_content_count, c.avg_engagement_rate, c.performance_score;

-- Content performance view
CREATE VIEW public.content_performance AS
SELECT 
    co.id,
    co.creator_id,
    co.platform,
    co.type,
    co.title,
    co.published_at,
    COALESCE((co.metrics->>'views')::INTEGER, 0) as views,
    COALESCE((co.metrics->>'likes')::INTEGER, 0) as likes,
    COALESCE((co.metrics->>'comments')::INTEGER, 0) as comments,
    COALESCE((co.metrics->>'shares')::INTEGER, 0) as shares,
    COALESCE((co.metrics->>'engagement_rate')::DECIMAL, 0) as engagement_rate,
    COALESCE((co.metrics->>'revenue_generated')::DECIMAL, 0) as revenue_generated
FROM public.content co
WHERE co.status = 'published';

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.creators IS 'Main creator profiles with tier information and performance metrics';
COMMENT ON TABLE public.creator_platforms IS 'Platform connections for each creator with sync status and metrics';
COMMENT ON TABLE public.content IS 'All content posts across platforms with metadata and performance tracking';
COMMENT ON TABLE public.campaigns IS 'Brand campaigns and collaborations with deliverables and payments';
COMMENT ON TABLE public.creator_earnings IS 'Periodic earnings calculations with commission and payout tracking';
COMMENT ON TABLE public.transactions IS 'All financial transactions including payments, commissions, and tips';
COMMENT ON TABLE public.analytics_reports IS 'Generated analytics reports with insights and recommendations';
COMMENT ON TABLE public.automation_rules IS 'User-defined automation rules for content and engagement';

-- =============================================================================
-- FINAL GRANTS AND PERMISSIONS
-- =============================================================================

-- Grant necessary permissions for Supabase
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated, service_role;
