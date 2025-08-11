-- =====================================================
-- Nextgen Overlay System - Database Schema
-- FansWorld Creator Platform
-- =====================================================
-- This migration adds all tables for the nextgen overlay features:
-- - VIP v2 System (code redemption with analytics)
-- - Tip Goals System (progress tracking)
-- - Offer Ribbon System (limited-time offers)
-- - Moderation v2 Queue System (enhanced moderation)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =====================================================
-- VIP V2 SYSTEM TABLES
-- =====================================================

-- VIP v2 Codes table - Enhanced code system with analytics
CREATE TABLE vip_v2_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Code configuration
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    
    -- Pricing and benefits
    price_cents INTEGER NOT NULL DEFAULT 0,
    benefits JSONB DEFAULT '[]'::jsonb,
    
    -- Timing
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Status and analytics
    is_active BOOLEAN DEFAULT true,
    analytics JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT vip_v2_codes_max_uses_positive CHECK (max_uses > 0),
    CONSTRAINT vip_v2_codes_current_uses_valid CHECK (current_uses >= 0 AND current_uses <= max_uses)
);

-- VIP v2 Redemptions table - Track all redemptions with analytics
CREATE TABLE vip_v2_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id UUID REFERENCES vip_v2_codes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Redemption details
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    
    -- Payment integration
    payment_intent_id VARCHAR(255),
    amount_paid_cents INTEGER DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Analytics and tracking
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE(code_id, user_id)
);

-- VIP v2 Analytics Events table - Detailed event tracking
CREATE TABLE vip_v2_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id UUID REFERENCES vip_v2_codes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    -- Event details
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- TIP GOALS SYSTEM TABLES
-- =====================================================

-- Tip Goals table - Creator goals with progress tracking
CREATE TABLE tip_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Goal configuration
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount_cents INTEGER NOT NULL,
    current_amount_cents INTEGER DEFAULT 0,
    
    -- Visual configuration
    emoji VARCHAR(20),
    color_hex VARCHAR(7) DEFAULT '#FF6B35',
    image_url TEXT,
    
    -- Timing
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Status and settings
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    show_progress BOOLEAN DEFAULT true,
    celebration_message TEXT,
    
    -- Analytics
    total_contributors INTEGER DEFAULT 0,
    analytics JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT tip_goals_target_positive CHECK (target_amount_cents > 0),
    CONSTRAINT tip_goals_current_valid CHECK (current_amount_cents >= 0 AND current_amount_cents <= target_amount_cents)
);

-- Tip Goal Contributions table - Track individual contributions
CREATE TABLE tip_goal_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES tip_goals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Contribution details
    amount_cents INTEGER NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Payment integration
    payment_intent_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Timing
    contributed_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT tip_goal_contributions_amount_positive CHECK (amount_cents > 0)
);

-- Tip Goal Milestones table - Track milestone celebrations
CREATE TABLE tip_goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES tip_goals(id) ON DELETE CASCADE,
    
    -- Milestone configuration
    percentage INTEGER NOT NULL, -- e.g., 25, 50, 75, 100
    amount_cents INTEGER NOT NULL,
    title VARCHAR(255),
    message TEXT,
    
    -- Status
    is_reached BOOLEAN DEFAULT false,
    reached_at TIMESTAMPTZ,
    
    -- Celebration configuration
    celebration_type VARCHAR(50) DEFAULT 'confetti',
    celebration_config JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT tip_goal_milestones_percentage_valid CHECK (percentage > 0 AND percentage <= 100),
    UNIQUE(goal_id, percentage)
);

-- =====================================================
-- OFFER RIBBON SYSTEM TABLES
-- =====================================================

-- Offers table - Limited-time promotional offers
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Offer configuration
    title VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type VARCHAR(50) NOT NULL, -- discount, bundle, exclusive_content, etc.
    
    -- Pricing
    original_price_cents INTEGER,
    discounted_price_cents INTEGER,
    discount_percentage INTEGER,
    
    -- Limits and availability
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    min_purchase_cents INTEGER DEFAULT 0,
    
    -- Timing
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    
    -- Display configuration
    ribbon_text VARCHAR(100),
    ribbon_color_hex VARCHAR(7) DEFAULT '#FF0000',
    urgency_level INTEGER DEFAULT 5, -- 1-10 scale
    
    -- Targeting
    target_audience JSONB DEFAULT '{}'::jsonb, -- user segments, etc.
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    analytics JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT offers_pricing_valid CHECK (
        (original_price_cents IS NULL OR original_price_cents >= 0) AND
        (discounted_price_cents IS NULL OR discounted_price_cents >= 0) AND
        (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100))
    ),
    CONSTRAINT offers_redemptions_valid CHECK (current_redemptions >= 0 AND (max_redemptions IS NULL OR current_redemptions <= max_redemptions))
);

-- Offer Redemptions table - Track offer usage
CREATE TABLE offer_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Redemption details
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    amount_saved_cents INTEGER DEFAULT 0,
    
    -- Payment integration
    payment_intent_id VARCHAR(255),
    original_amount_cents INTEGER,
    final_amount_cents INTEGER,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE(offer_id, user_id)
);

-- Offer Analytics Events table - Detailed offer interaction tracking
CREATE TABLE offer_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    -- Event details
    event_type VARCHAR(50) NOT NULL, -- view, click, hover, dismiss, redeem
    event_data JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Context
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Session tracking
    session_id VARCHAR(255),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- MODERATION V2 SYSTEM TABLES
-- =====================================================

-- Moderation Rules v2 table - Enhanced rule system
CREATE TABLE moderation_v2_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Rule configuration
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- content_filter, user_behavior, payment_threshold, etc.
    
    -- Rule logic
    conditions JSONB NOT NULL, -- Complex rule conditions
    actions JSONB NOT NULL, -- Actions to take when rule triggered
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    
    -- Status and settings
    is_active BOOLEAN DEFAULT true,
    is_auto_enforce BOOLEAN DEFAULT false,
    requires_human_review BOOLEAN DEFAULT true,
    
    -- AI Integration
    ai_confidence_threshold DECIMAL(3,2) DEFAULT 0.85,
    ai_model_version VARCHAR(50),
    
    -- Performance tracking
    trigger_count INTEGER DEFAULT 0,
    false_positive_count INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Moderation Queue v2 table - Enhanced queue system
CREATE TABLE moderation_v2_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content reference
    content_type VARCHAR(50) NOT NULL, -- message, post, media, profile, etc.
    content_id VARCHAR(255) NOT NULL,
    content_data JSONB,
    
    -- User reference
    reported_user_id UUID REFERENCES auth.users(id),
    reporter_user_id UUID REFERENCES auth.users(id),
    
    -- Rule reference
    triggered_rule_id UUID REFERENCES moderation_v2_rules(id),
    
    -- Queue status
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewing, approved, rejected, escalated
    priority INTEGER DEFAULT 5, -- 1-10 scale
    
    -- AI Analysis
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    ai_confidence DECIMAL(3,2),
    ai_recommendation VARCHAR(50), -- approve, reject, escalate
    
    -- Human review
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_decision VARCHAR(50),
    review_notes TEXT,
    
    -- Actions taken
    actions_taken JSONB DEFAULT '[]'::jsonb,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    auto_resolve_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Moderation Actions v2 table - Track all moderation actions
CREATE TABLE moderation_v2_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_item_id UUID REFERENCES moderation_v2_queue(id),
    rule_id UUID REFERENCES moderation_v2_rules(id),
    
    -- Action details
    action_type VARCHAR(50) NOT NULL, -- warn, mute, timeout, ban, content_remove, etc.
    action_data JSONB DEFAULT '{}'::jsonb,
    
    -- Target
    target_user_id UUID REFERENCES auth.users(id),
    target_content_type VARCHAR(50),
    target_content_id VARCHAR(255),
    
    -- Execution
    executed_by VARCHAR(50) DEFAULT 'system', -- system, human, ai
    executor_user_id UUID REFERENCES auth.users(id),
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Duration and reversal
    duration_seconds INTEGER,
    expires_at TIMESTAMPTZ,
    is_reversed BOOLEAN DEFAULT false,
    reversed_at TIMESTAMPTZ,
    reversed_by UUID REFERENCES auth.users(id),
    reversal_reason TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- VIP v2 System indexes
CREATE INDEX idx_vip_v2_codes_creator_active ON vip_v2_codes(creator_id, is_active);
CREATE INDEX idx_vip_v2_codes_code_active ON vip_v2_codes(code, is_active);
CREATE INDEX idx_vip_v2_redemptions_code_user ON vip_v2_redemptions(code_id, user_id);
CREATE INDEX idx_vip_v2_analytics_code_type ON vip_v2_analytics_events(code_id, event_type);

-- Tip Goals indexes
CREATE INDEX idx_tip_goals_creator_active ON tip_goals(creator_id, is_active);
CREATE INDEX idx_tip_goals_public_active ON tip_goals(is_public, is_active) WHERE is_public = true;
CREATE INDEX idx_tip_goal_contributions_goal ON tip_goal_contributions(goal_id);
CREATE INDEX idx_tip_goal_milestones_goal_percentage ON tip_goal_milestones(goal_id, percentage);

-- Offers indexes
CREATE INDEX idx_offers_creator_active ON offers(creator_id, is_active);
CREATE INDEX idx_offers_active_timeframe ON offers(is_active, starts_at, ends_at);
CREATE INDEX idx_offer_redemptions_offer_user ON offer_redemptions(offer_id, user_id);
CREATE INDEX idx_offer_analytics_offer_type ON offer_analytics_events(offer_id, event_type);

-- Moderation v2 indexes
CREATE INDEX idx_moderation_rules_creator_active ON moderation_v2_rules(creator_id, is_active);
CREATE INDEX idx_moderation_queue_status_priority ON moderation_v2_queue(status, priority);
CREATE INDEX idx_moderation_queue_creator_status ON moderation_v2_queue(creator_id, status);
CREATE INDEX idx_moderation_actions_target ON moderation_v2_actions(target_user_id, action_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE vip_v2_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_v2_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_v2_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_v2_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_v2_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_v2_actions ENABLE ROW LEVEL SECURITY;

-- VIP v2 RLS Policies
CREATE POLICY "Creators can manage their VIP codes" ON vip_v2_codes
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view active VIP codes" ON vip_v2_codes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create redemptions" ON vip_v2_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their redemptions" ON vip_v2_redemptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Creators can view their code redemptions" ON vip_v2_redemptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vip_v2_codes 
            WHERE id = code_id AND creator_id = auth.uid()
        )
    );

-- Tip Goals RLS Policies
CREATE POLICY "Creators can manage their tip goals" ON tip_goals
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view public tip goals" ON tip_goals
    FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Users can contribute to active goals" ON tip_goal_contributions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tip_goals 
            WHERE id = goal_id AND is_active = true
        )
    );

-- Offers RLS Policies
CREATE POLICY "Creators can manage their offers" ON offers
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view active offers" ON offers
    FOR SELECT USING (is_active = true AND NOW() BETWEEN starts_at AND ends_at);

CREATE POLICY "Users can redeem offers" ON offer_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Moderation v2 RLS Policies
CREATE POLICY "Creators can manage their moderation rules" ON moderation_v2_rules
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Creators can manage their moderation queue" ON moderation_v2_queue
    FOR ALL USING (auth.uid() = creator_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_vip_v2_codes_updated_at BEFORE UPDATE ON vip_v2_codes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tip_goals_updated_at BEFORE UPDATE ON tip_goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_moderation_v2_rules_updated_at BEFORE UPDATE ON moderation_v2_rules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_moderation_v2_queue_updated_at BEFORE UPDATE ON moderation_v2_queue FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update tip goal progress
CREATE OR REPLACE FUNCTION update_tip_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current amount and contributor count
    UPDATE tip_goals 
    SET 
        current_amount_cents = (
            SELECT COALESCE(SUM(amount_cents), 0)
            FROM tip_goal_contributions 
            WHERE goal_id = NEW.goal_id 
            AND payment_status = 'completed'
        ),
        total_contributors = (
            SELECT COUNT(DISTINCT user_id)
            FROM tip_goal_contributions 
            WHERE goal_id = NEW.goal_id 
            AND payment_status = 'completed'
        ),
        completed_at = CASE 
            WHEN current_amount_cents >= target_amount_cents THEN NOW() 
            ELSE completed_at 
        END
    WHERE id = NEW.goal_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update tip goal progress when contribution is made
CREATE TRIGGER update_tip_goal_progress_trigger 
    AFTER INSERT OR UPDATE ON tip_goal_contributions 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_tip_goal_progress();

-- =====================================================
-- INITIAL DATA AND CONFIGURATION
-- =====================================================

-- Insert default moderation rules for new creators
-- This will be handled by the application logic

-- Comments for documentation
COMMENT ON TABLE vip_v2_codes IS 'Enhanced VIP code system with analytics and flexible redemption options';
COMMENT ON TABLE tip_goals IS 'Creator tip goals with progress tracking and milestone celebrations';
COMMENT ON TABLE offers IS 'Limited-time promotional offers with ribbon display';
COMMENT ON TABLE moderation_v2_queue IS 'Enhanced moderation queue with AI assistance and automated workflows';

-- Migration completed successfully
SELECT 'Nextgen Overlay System schema migration completed successfully!' as status;