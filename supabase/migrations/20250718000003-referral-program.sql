-- Referral Program System for TD Studios
-- This migration creates tables and functions for tracking referrals and affiliate programs

-- Referral Programs Table
CREATE TABLE IF NOT EXISTS referral_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    commission_rate DECIMAL(5,2) NOT NULL, -- e.g., 10.00 for 10%
    commission_type TEXT CHECK (commission_type IN ('percentage', 'fixed', 'tiered')) DEFAULT 'percentage',
    min_payout_amount INTEGER DEFAULT 5000, -- $50.00 minimum payout in cents
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Referral Codes Table
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    referrer_id UUID REFERENCES auth.users(id),
    program_id UUID REFERENCES referral_programs(id),
    uses_remaining INTEGER DEFAULT -1, -- -1 = unlimited
    total_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    
    -- Metadata for additional info
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Referral Conversions Table
CREATE TABLE IF NOT EXISTS referral_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code_id UUID REFERENCES referral_codes(id),
    referee_id UUID REFERENCES auth.users(id), -- The person who used the code
    referrer_id UUID REFERENCES auth.users(id), -- The person who owns the code
    program_id UUID REFERENCES referral_programs(id),
    
    -- Financial details
    conversion_value INTEGER NOT NULL, -- in cents, value of what was purchased
    commission_amount INTEGER NOT NULL, -- in cents, commission earned
    
    -- Status tracking
    status TEXT CHECK (status IN ('pending', 'approved', 'paid', 'rejected')) DEFAULT 'pending',
    
    -- Dates
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approval_date TIMESTAMP WITH TIME ZONE,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional tracking
    subscription_id TEXT, -- Link to Stripe subscription if applicable
    transaction_id TEXT, -- Link to payment transaction
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Referral Payouts Table
CREATE TABLE IF NOT EXISTS referral_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id),
    program_id UUID REFERENCES referral_programs(id),
    
    -- Payout details
    total_amount INTEGER NOT NULL, -- in cents
    conversion_count INTEGER NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Payment status
    status TEXT CHECK (status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending',
    stripe_transfer_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_programs
CREATE POLICY "Anyone can view active programs" ON referral_programs
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage programs" ON referral_programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_codes
CREATE POLICY "Users can view their own codes" ON referral_codes
    FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Users can create their own codes" ON referral_codes
    FOR INSERT WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "Anyone can validate codes" ON referral_codes
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage all codes" ON referral_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_conversions
CREATE POLICY "Users can view their referrals" ON referral_conversions
    FOR SELECT USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "System can insert conversions" ON referral_conversions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage conversions" ON referral_conversions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for referral_payouts
CREATE POLICY "Users can view their payouts" ON referral_payouts
    FOR SELECT USING (referrer_id = auth.uid());

CREATE POLICY "Admins can manage payouts" ON referral_payouts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_referrer ON referral_codes(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(active);
CREATE INDEX IF NOT EXISTS idx_referral_codes_expires ON referral_codes(expires_at);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_referrer ON referral_conversions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee ON referral_conversions(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_status ON referral_conversions(status);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_date ON referral_conversions(conversion_date);

CREATE INDEX IF NOT EXISTS idx_referral_payouts_referrer ON referral_payouts(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_status ON referral_payouts(status);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_period ON referral_payouts(period_start, period_end);

-- Add updated_at triggers
CREATE TRIGGER update_referral_programs_updated_at BEFORE UPDATE ON referral_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_codes_updated_at BEFORE UPDATE ON referral_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_conversions_updated_at BEFORE UPDATE ON referral_conversions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_payouts_updated_at BEFORE UPDATE ON referral_payouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(prefix TEXT DEFAULT '')
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Add prefix if provided
    IF prefix != '' THEN
        result := UPPER(prefix) || '_';
    END IF;
    
    -- Generate random part
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create a referral code for a user
CREATE OR REPLACE FUNCTION create_user_referral_code(
    user_id UUID,
    program_name TEXT DEFAULT 'creator_referral',
    code_prefix TEXT DEFAULT 'CREATOR'
)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    program_record RECORD;
    attempts INTEGER := 0;
BEGIN
    -- Get the program
    SELECT * INTO program_record 
    FROM referral_programs 
    WHERE name = program_name AND active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Referral program not found: %', program_name;
    END IF;
    
    -- Generate unique code
    LOOP
        new_code := generate_referral_code(code_prefix);
        attempts := attempts + 1;
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM referral_codes WHERE code = new_code) THEN
            EXIT;
        END IF;
        
        -- Prevent infinite loops
        IF attempts > 100 THEN
            RAISE EXCEPTION 'Could not generate unique referral code';
        END IF;
    END LOOP;
    
    -- Insert the new code
    INSERT INTO referral_codes (code, referrer_id, program_id)
    VALUES (new_code, user_id, program_record.id);
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track a referral conversion
CREATE OR REPLACE FUNCTION track_referral_conversion(
    referral_code TEXT,
    referee_user_id UUID,
    conversion_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    code_record RECORD;
    program_record RECORD;
    commission_amount INTEGER;
BEGIN
    -- Get the referral code info
    SELECT rc.*, rp.*
    INTO code_record
    FROM referral_codes rc
    JOIN referral_programs rp ON rc.program_id = rp.id
    WHERE rc.code = UPPER(referral_code) 
    AND rc.active = true 
    AND rp.active = true
    AND (rc.expires_at IS NULL OR rc.expires_at > NOW())
    AND (rc.uses_remaining = -1 OR rc.uses_remaining > 0);
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Calculate commission
    IF code_record.commission_type = 'percentage' THEN
        commission_amount := FLOOR(conversion_amount * code_record.commission_rate / 100);
    ELSE
        commission_amount := code_record.commission_rate::INTEGER;
    END IF;
    
    -- Record the conversion
    INSERT INTO referral_conversions (
        referral_code_id,
        referee_id,
        referrer_id,
        program_id,
        conversion_value,
        commission_amount,
        status
    ) VALUES (
        code_record.id,
        referee_user_id,
        code_record.referrer_id,
        code_record.program_id,
        conversion_amount,
        commission_amount,
        'pending'
    );
    
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

-- Function to get referral stats for a user
CREATE OR REPLACE FUNCTION get_referral_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_referrals', COALESCE(SUM(CASE WHEN rc.status != 'rejected' THEN 1 ELSE 0 END), 0),
        'successful_conversions', COALESCE(SUM(CASE WHEN rc.status = 'approved' OR rc.status = 'paid' THEN 1 ELSE 0 END), 0),
        'pending_conversions', COALESCE(SUM(CASE WHEN rc.status = 'pending' THEN 1 ELSE 0 END), 0),
        'total_commission_earned', COALESCE(SUM(CASE WHEN rc.status = 'approved' OR rc.status = 'paid' THEN rc.commission_amount ELSE 0 END), 0),
        'total_commission_paid', COALESCE(SUM(CASE WHEN rc.status = 'paid' THEN rc.commission_amount ELSE 0 END), 0),
        'pending_commission', COALESCE(SUM(CASE WHEN rc.status = 'pending' OR rc.status = 'approved' THEN rc.commission_amount ELSE 0 END), 0)
    ) INTO stats
    FROM referral_conversions rc
    WHERE rc.referrer_id = user_id;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default referral programs
INSERT INTO referral_programs (name, description, commission_rate, commission_type) VALUES
('creator_referral', 'Creator-to-Creator Referral Program', 10.00, 'percentage'),
('affiliate_partner', 'Affiliate Partner Program', 5.00, 'percentage'),
('influencer_program', 'Influencer Affiliate Program', 1500.00, 'fixed') -- $15.00 fixed
ON CONFLICT (name) DO NOTHING;

-- Function to process monthly referral payouts
CREATE OR REPLACE FUNCTION process_monthly_referral_payouts()
RETURNS INTEGER AS $$
DECLARE
    payout_record RECORD;
    payout_count INTEGER := 0;
BEGIN
    -- Get all users with approved commissions ready for payout
    FOR payout_record IN
        SELECT 
            rc.referrer_id,
            rc.program_id,
            SUM(rc.commission_amount) as total_amount,
            COUNT(*) as conversion_count,
            MIN(rc.conversion_date) as period_start,
            MAX(rc.conversion_date) as period_end
        FROM referral_conversions rc
        JOIN referral_programs rp ON rc.program_id = rp.id
        WHERE rc.status = 'approved'
        AND rc.conversion_date <= NOW() - INTERVAL '30 days' -- 30 day hold period
        GROUP BY rc.referrer_id, rc.program_id
        HAVING SUM(rc.commission_amount) >= (
            SELECT min_payout_amount FROM referral_programs WHERE id = rc.program_id
        )
    LOOP
        -- Create payout record
        INSERT INTO referral_payouts (
            referrer_id,
            program_id,
            total_amount,
            conversion_count,
            period_start,
            period_end,
            status
        ) VALUES (
            payout_record.referrer_id,
            payout_record.program_id,
            payout_record.total_amount,
            payout_record.conversion_count,
            payout_record.period_start,
            payout_record.period_end,
            'pending'
        );
        
        -- Mark conversions as paid
        UPDATE referral_conversions
        SET status = 'paid', payment_date = NOW()
        WHERE referrer_id = payout_record.referrer_id
        AND program_id = payout_record.program_id
        AND status = 'approved';
        
        payout_count := payout_count + 1;
    END LOOP;
    
    RETURN payout_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;