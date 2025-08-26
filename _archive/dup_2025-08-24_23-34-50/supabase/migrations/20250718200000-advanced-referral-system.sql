-- Advanced Referral System Enhancement for TD Studios
-- This migration enhances the existing referral system with multi-tier support,
-- agency integration, and advanced tracking capabilities

-- Multi-Tier Referral Tracking Table
CREATE TABLE IF NOT EXISTS referral_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_id UUID REFERENCES referral_programs(id) ON DELETE CASCADE,
    tier_level INTEGER NOT NULL CHECK (tier_level >= 1 AND tier_level <= 5),
    commission_rate DECIMAL(5,2) NOT NULL,
    min_conversions INTEGER DEFAULT 0,
    min_revenue INTEGER DEFAULT 0, -- in cents
    
    -- Tier Benefits
    benefits JSONB DEFAULT '{}', -- {"bonus_rate": 2.5, "priority_support": true, etc.}
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(program_id, tier_level)
);

-- Referral Network Table (for multi-level tracking)
CREATE TABLE IF NOT EXISTS referral_network (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_referrer_id UUID REFERENCES auth.users(id), -- Who referred the referrer
    network_depth INTEGER DEFAULT 1 CHECK (network_depth >= 1 AND network_depth <= 5),
    
    -- Agency Integration
    agency_id UUID REFERENCES auth.users(id), -- TD Studios agency account
    creator_contract_id UUID REFERENCES creator_contracts(id),
    
    -- Network Status
    is_active BOOLEAN DEFAULT true,
    activation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deactivation_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(referrer_id, referee_id)
);

-- Enhanced Referral Campaigns Table
CREATE TABLE IF NOT EXISTS referral_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT CHECK (campaign_type IN ('seasonal', 'promotional', 'agency', 'creator', 'custom')) NOT NULL,
    
    -- Campaign Settings
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    budget_limit INTEGER, -- in cents, NULL for unlimited
    current_spend INTEGER DEFAULT 0, -- in cents
    
    -- Bonus Structure
    base_commission_multiplier DECIMAL(3,2) DEFAULT 1.00, -- 1.5 = 50% bonus
    new_user_bonus INTEGER DEFAULT 0, -- in cents
    milestone_bonuses JSONB DEFAULT '[]', -- [{"conversions": 10, "bonus": 5000}, ...]
    
    -- Targeting
    target_programs UUID[] DEFAULT '{}', -- Which referral programs this applies to
    target_users UUID[] DEFAULT '{}', -- Specific users, empty for all
    target_user_roles TEXT[] DEFAULT '{}', -- ['creator', 'agency', etc.]
    
    -- Performance
    total_conversions INTEGER DEFAULT 0,
    total_commission_paid INTEGER DEFAULT 0, -- in cents
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Referral Performance Analytics Table
CREATE TABLE IF NOT EXISTS referral_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES referral_programs(id),
    
    -- Time Period
    period_type TEXT CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metrics
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Financial Metrics
    gross_revenue INTEGER DEFAULT 0, -- in cents
    commission_earned INTEGER DEFAULT 0, -- in cents
    average_order_value INTEGER DEFAULT 0, -- in cents
    
    -- Network Metrics
    new_referrals INTEGER DEFAULT 0,
    network_growth_rate DECIMAL(5,2) DEFAULT 0.00,
    tier_advancement BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(user_id, program_id, period_type, period_start)
);

-- Referral Rewards Table (for non-monetary rewards)
CREATE TABLE IF NOT EXISTS referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    reward_type TEXT CHECK (reward_type IN ('badge', 'feature_access', 'discount', 'physical_item', 'custom')) NOT NULL,
    
    -- Reward Value
    reward_value JSONB NOT NULL, -- {"discount_percent": 20, "feature": "premium_analytics", etc.}
    
    -- Requirements
    min_conversions INTEGER DEFAULT 0,
    min_revenue INTEGER DEFAULT 0, -- in cents
    required_tier INTEGER DEFAULT 1,
    
    -- Availability
    is_active BOOLEAN DEFAULT true,
    quantity_available INTEGER DEFAULT -1, -- -1 for unlimited
    quantity_claimed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User Rewards Table
CREATE TABLE IF NOT EXISTS user_referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES referral_rewards(id) ON DELETE CASCADE,
    
    -- Claim Details
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT CHECK (status IN ('active', 'used', 'expired')) DEFAULT 'active',
    
    UNIQUE(user_id, reward_id)
);

-- Add new columns to existing referral_codes table
ALTER TABLE referral_codes ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES referral_campaigns(id);
ALTER TABLE referral_codes ADD COLUMN IF NOT EXISTS custom_message TEXT;
ALTER TABLE referral_codes ADD COLUMN IF NOT EXISTS landing_page_url TEXT;
ALTER TABLE referral_codes ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Add new columns to existing referral_conversions table
ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES referral_campaigns(id);
ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS network_depth INTEGER DEFAULT 1;
ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS parent_conversion_id UUID REFERENCES referral_conversions(id);
ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS geo_location JSONB;

-- Add new columns to existing referral_programs table
ALTER TABLE referral_programs ADD COLUMN IF NOT EXISTS has_tiers BOOLEAN DEFAULT false;
ALTER TABLE referral_programs ADD COLUMN IF NOT EXISTS network_depth_limit INTEGER DEFAULT 1;
ALTER TABLE referral_programs ADD COLUMN IF NOT EXISTS cookie_duration_days INTEGER DEFAULT 30;
ALTER TABLE referral_programs ADD COLUMN IF NOT EXISTS attribution_model TEXT CHECK (attribution_model IN ('first_touch', 'last_touch', 'linear', 'time_decay')) DEFAULT 'last_touch';

-- Enable Row Level Security on new tables
ALTER TABLE referral_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_tiers
CREATE POLICY "Anyone can view tiers" ON referral_tiers
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage tiers" ON referral_tiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_network
CREATE POLICY "Users can view their network" ON referral_network
    FOR SELECT USING (
        referrer_id = auth.uid() OR 
        referee_id = auth.uid() OR
        parent_referrer_id = auth.uid()
    );

CREATE POLICY "System can manage network" ON referral_network
    FOR ALL USING (true);

-- RLS Policies for referral_campaigns
CREATE POLICY "Active campaigns are public" ON referral_campaigns
    FOR SELECT USING (
        is_active = true AND 
        start_date <= NOW() AND 
        end_date >= NOW()
    );

CREATE POLICY "Admins can manage campaigns" ON referral_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_analytics
CREATE POLICY "Users can view own analytics" ON referral_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all analytics" ON referral_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_rewards
CREATE POLICY "Active rewards are public" ON referral_rewards
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage rewards" ON referral_rewards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for user_referral_rewards
CREATE POLICY "Users can view own rewards" ON user_referral_rewards
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage user rewards" ON user_referral_rewards
    FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_tiers_program ON referral_tiers(program_id);
CREATE INDEX IF NOT EXISTS idx_referral_network_referrer ON referral_network(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_network_referee ON referral_network(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_network_agency ON referral_network(agency_id);
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_dates ON referral_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_active ON referral_campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_referral_analytics_user_period ON referral_analytics(user_id, period_type, period_start);
CREATE INDEX IF NOT EXISTS idx_user_referral_rewards_user ON user_referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referral_rewards_status ON user_referral_rewards(status);

-- Add triggers for updated_at
CREATE TRIGGER update_referral_tiers_updated_at BEFORE UPDATE ON referral_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_network_updated_at BEFORE UPDATE ON referral_network
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_campaigns_updated_at BEFORE UPDATE ON referral_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_analytics_updated_at BEFORE UPDATE ON referral_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_rewards_updated_at BEFORE UPDATE ON referral_rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user tier
CREATE OR REPLACE FUNCTION calculate_user_referral_tier(
    p_user_id UUID,
    p_program_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    user_stats RECORD;
    current_tier INTEGER;
BEGIN
    -- Get user's referral stats
    SELECT 
        COUNT(DISTINCT rc.referee_id) as total_conversions,
        COALESCE(SUM(rc.conversion_value), 0) as total_revenue
    INTO user_stats
    FROM referral_conversions rc
    WHERE rc.referrer_id = p_user_id
    AND rc.program_id = p_program_id
    AND rc.status IN ('approved', 'paid');
    
    -- Determine tier based on program tiers
    SELECT MAX(tier_level) INTO current_tier
    FROM referral_tiers rt
    WHERE rt.program_id = p_program_id
    AND rt.min_conversions <= user_stats.total_conversions
    AND rt.min_revenue <= user_stats.total_revenue;
    
    RETURN COALESCE(current_tier, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to track multi-level referral
CREATE OR REPLACE FUNCTION track_multilevel_referral(
    p_referral_code TEXT,
    p_referee_id UUID,
    p_conversion_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    code_record RECORD;
    network_record RECORD;
    parent_referrer_id UUID;
    network_depth INTEGER := 1;
    commission_amount INTEGER;
    campaign_record RECORD;
    tier_rate DECIMAL(5,2);
BEGIN
    -- Get referral code details
    SELECT rc.*, rp.*
    INTO code_record
    FROM referral_codes rc
    JOIN referral_programs rp ON rc.program_id = rp.id
    WHERE rc.code = UPPER(p_referral_code)
    AND rc.active = true
    AND rp.active = true;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check for active campaign
    SELECT * INTO campaign_record
    FROM referral_campaigns
    WHERE is_active = true
    AND NOW() BETWEEN start_date AND end_date
    AND (code_record.program_id = ANY(target_programs) OR cardinality(target_programs) = 0)
    AND (code_record.referrer_id = ANY(target_users) OR cardinality(target_users) = 0);
    
    -- Calculate tier-based commission rate
    tier_rate := code_record.commission_rate;
    IF code_record.has_tiers THEN
        SELECT commission_rate INTO tier_rate
        FROM referral_tiers
        WHERE program_id = code_record.program_id
        AND tier_level = calculate_user_referral_tier(code_record.referrer_id, code_record.program_id);
    END IF;
    
    -- Apply campaign multiplier if exists
    IF campaign_record.id IS NOT NULL THEN
        tier_rate := tier_rate * campaign_record.base_commission_multiplier;
    END IF;
    
    -- Calculate commission
    IF code_record.commission_type = 'percentage' THEN
        commission_amount := FLOOR(p_conversion_amount * tier_rate / 100);
    ELSE
        commission_amount := tier_rate::INTEGER;
    END IF;
    
    -- Create primary conversion record
    INSERT INTO referral_conversions (
        referral_code_id,
        referee_id,
        referrer_id,
        program_id,
        conversion_value,
        commission_amount,
        campaign_id,
        network_depth,
        status
    ) VALUES (
        code_record.id,
        p_referee_id,
        code_record.referrer_id,
        code_record.program_id,
        p_conversion_amount,
        commission_amount,
        campaign_record.id,
        1,
        'pending'
    );
    
    -- Create network relationship
    INSERT INTO referral_network (
        referrer_id,
        referee_id,
        network_depth
    ) VALUES (
        code_record.referrer_id,
        p_referee_id,
        1
    ) ON CONFLICT (referrer_id, referee_id) DO NOTHING;
    
    -- Process multi-level commissions if enabled
    IF code_record.network_depth_limit > 1 THEN
        parent_referrer_id := code_record.referrer_id;
        
        FOR network_depth IN 2..code_record.network_depth_limit LOOP
            -- Find parent referrer
            SELECT referrer_id INTO parent_referrer_id
            FROM referral_network
            WHERE referee_id = parent_referrer_id
            AND is_active = true
            LIMIT 1;
            
            EXIT WHEN parent_referrer_id IS NULL;
            
            -- Calculate diminishing commission for higher levels
            commission_amount := FLOOR(commission_amount * 0.5); -- 50% of previous level
            
            IF commission_amount > 0 THEN
                INSERT INTO referral_conversions (
                    referral_code_id,
                    referee_id,
                    referrer_id,
                    program_id,
                    conversion_value,
                    commission_amount,
                    campaign_id,
                    network_depth,
                    parent_conversion_id,
                    status
                ) VALUES (
                    code_record.id,
                    p_referee_id,
                    parent_referrer_id,
                    code_record.program_id,
                    p_conversion_amount,
                    commission_amount,
                    campaign_record.id,
                    network_depth,
                    (SELECT id FROM referral_conversions WHERE referee_id = p_referee_id ORDER BY created_at DESC LIMIT 1),
                    'pending'
                );
            END IF;
        END LOOP;
    END IF;
    
    -- Update campaign spend if applicable
    IF campaign_record.id IS NOT NULL THEN
        UPDATE referral_campaigns
        SET 
            current_spend = current_spend + commission_amount,
            total_conversions = total_conversions + 1
        WHERE id = campaign_record.id;
    END IF;
    
    -- Update code usage
    UPDATE referral_codes
    SET 
        total_uses = total_uses + 1,
        uses_remaining = CASE 
            WHEN uses_remaining = -1 THEN -1 
            ELSE uses_remaining - 1 
        END
    WHERE id = code_record.id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate analytics snapshot
CREATE OR REPLACE FUNCTION generate_referral_analytics_snapshot(
    p_period_type TEXT DEFAULT 'daily'
)
RETURNS INTEGER AS $$
DECLARE
    period_start DATE;
    period_end DATE;
    processed_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Calculate period dates
    CASE p_period_type
        WHEN 'daily' THEN
            period_start := CURRENT_DATE - INTERVAL '1 day';
            period_end := CURRENT_DATE - INTERVAL '1 day';
        WHEN 'weekly' THEN
            period_start := date_trunc('week', CURRENT_DATE - INTERVAL '1 week');
            period_end := date_trunc('week', CURRENT_DATE - INTERVAL '1 week') + INTERVAL '6 days';
        WHEN 'monthly' THEN
            period_start := date_trunc('month', CURRENT_DATE - INTERVAL '1 month');
            period_end := (date_trunc('month', CURRENT_DATE - INTERVAL '1 month') + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        ELSE
            RAISE EXCEPTION 'Invalid period type: %', p_period_type;
    END CASE;
    
    -- Generate analytics for each active referrer
    FOR user_record IN
        SELECT DISTINCT referrer_id, program_id
        FROM referral_conversions
        WHERE conversion_date >= period_start
        AND conversion_date <= period_end + INTERVAL '1 day'
    LOOP
        INSERT INTO referral_analytics (
            user_id,
            program_id,
            period_type,
            period_start,
            period_end,
            conversions,
            gross_revenue,
            commission_earned,
            average_order_value,
            new_referrals
        )
        SELECT 
            user_record.referrer_id,
            user_record.program_id,
            p_period_type,
            period_start,
            period_end,
            COUNT(*),
            SUM(conversion_value),
            SUM(commission_amount),
            AVG(conversion_value)::INTEGER,
            COUNT(DISTINCT referee_id)
        FROM referral_conversions
        WHERE referrer_id = user_record.referrer_id
        AND program_id = user_record.program_id
        AND conversion_date >= period_start
        AND conversion_date <= period_end + INTERVAL '1 day'
        ON CONFLICT (user_id, program_id, period_type, period_start) 
        DO UPDATE SET
            conversions = EXCLUDED.conversions,
            gross_revenue = EXCLUDED.gross_revenue,
            commission_earned = EXCLUDED.commission_earned,
            average_order_value = EXCLUDED.average_order_value,
            new_referrals = EXCLUDED.new_referrals,
            updated_at = NOW();
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default referral tiers
INSERT INTO referral_tiers (program_id, tier_level, commission_rate, min_conversions, min_revenue, benefits)
SELECT 
    id,
    1,
    commission_rate,
    0,
    0,
    '{"base_tier": true}'::JSONB
FROM referral_programs
WHERE name = 'creator_referral'
ON CONFLICT DO NOTHING;

-- Add higher tiers for creator referral program
INSERT INTO referral_tiers (program_id, tier_level, commission_rate, min_conversions, min_revenue, benefits)
SELECT 
    id,
    tier_level,
    commission_rate,
    min_conversions,
    min_revenue,
    benefits
FROM referral_programs
CROSS JOIN (
    VALUES 
        (2, 12.00, 5, 10000, '{"bonus_rate": 2, "priority_support": true}'::JSONB),
        (3, 15.00, 10, 50000, '{"bonus_rate": 5, "priority_support": true, "exclusive_campaigns": true}'::JSONB),
        (4, 18.00, 25, 100000, '{"bonus_rate": 8, "priority_support": true, "exclusive_campaigns": true, "vip_events": true}'::JSONB),
        (5, 20.00, 50, 250000, '{"bonus_rate": 10, "priority_support": true, "exclusive_campaigns": true, "vip_events": true, "dedicated_manager": true}'::JSONB)
) AS tiers(tier_level, commission_rate, min_conversions, min_revenue, benefits)
WHERE name = 'creator_referral'
ON CONFLICT DO NOTHING;

-- Update referral programs to enable tiers
UPDATE referral_programs 
SET has_tiers = true, network_depth_limit = 3
WHERE name = 'creator_referral';

-- Create initial rewards
INSERT INTO referral_rewards (name, description, reward_type, reward_value, min_conversions, required_tier)
VALUES 
    ('Early Bird Badge', 'Special badge for first 100 referrers', 'badge', '{"badge_id": "early_bird", "icon": "🦅"}'::JSONB, 1, 1),
    ('Premium Analytics Access', 'Access to advanced referral analytics', 'feature_access', '{"feature": "premium_analytics", "duration_days": 30}'::JSONB, 5, 2),
    ('VIP Creator Discount', '20% off premium features', 'discount', '{"discount_percent": 20, "applicable_to": ["premium_subscription"]}'::JSONB, 10, 3),
    ('Exclusive Merch', 'Limited edition TD Studios merchandise', 'physical_item', '{"item": "td_studios_hoodie", "shipping": "free"}'::JSONB, 25, 4)
ON CONFLICT DO NOTHING;