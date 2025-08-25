-- Stripe Connect Integration for Creator Payouts
-- This migration adds Stripe Connect functionality for creator payouts

-- Stripe Connect Accounts Table
CREATE TABLE IF NOT EXISTS stripe_connect_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_account_id TEXT UNIQUE NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('express', 'standard', 'custom')),
    country TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    
    -- Account status and capabilities
    charges_enabled BOOLEAN DEFAULT false,
    payouts_enabled BOOLEAN DEFAULT false,
    details_submitted BOOLEAN DEFAULT false,
    
    -- Onboarding and verification
    onboarding_completed BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Business information
    business_name TEXT,
    business_url TEXT,
    business_type TEXT,
    
    -- Individual information (for personal accounts)
    individual_first_name TEXT,
    individual_last_name TEXT,
    individual_email TEXT,
    individual_phone TEXT,
    individual_dob DATE,
    individual_ssn_last4 TEXT,
    
    -- Address information
    address_line1 TEXT,
    address_line2 TEXT,
    address_city TEXT,
    address_state TEXT,
    address_postal_code TEXT,
    address_country TEXT,
    
    -- Banking information
    external_account_id TEXT,
    external_account_type TEXT,
    external_account_last4 TEXT,
    external_account_bank_name TEXT,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stripe Connect Onboarding Sessions Table
CREATE TABLE IF NOT EXISTS stripe_connect_onboarding_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_account_id TEXT REFERENCES stripe_connect_accounts(stripe_account_id) ON DELETE CASCADE,
    session_url TEXT NOT NULL,
    return_url TEXT NOT NULL,
    refresh_url TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced Creator Earnings Table with Stripe Connect support
CREATE TABLE IF NOT EXISTS creator_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES creator_contracts(id) ON DELETE CASCADE,
    
    -- Earnings period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Revenue breakdown
    gross_earnings INTEGER NOT NULL DEFAULT 0, -- in cents
    management_fee INTEGER NOT NULL DEFAULT 0, -- in cents
    commission_amount INTEGER NOT NULL DEFAULT 0, -- in cents
    platform_fee INTEGER NOT NULL DEFAULT 0, -- in cents
    net_earnings INTEGER NOT NULL DEFAULT 0, -- in cents
    
    -- Payment processing
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed', 'on_hold')),
    scheduled_payout_date DATE,
    actual_payout_date DATE,
    
    -- Stripe Connect transfer information
    stripe_transfer_id TEXT,
    stripe_transfer_status TEXT,
    stripe_connect_account_id TEXT,
    
    -- Metadata
    earnings_breakdown JSONB, -- Detailed breakdown of earnings sources
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payout Schedules Table
CREATE TABLE IF NOT EXISTS payout_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Schedule configuration
    frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'bi_weekly', 'monthly', 'quarterly')),
    day_of_week INTEGER, -- 0-6 for weekly/bi-weekly (0 = Sunday)
    day_of_month INTEGER, -- 1-31 for monthly
    minimum_payout_amount INTEGER NOT NULL DEFAULT 10000, -- $100 minimum in cents
    
    -- Status
    active BOOLEAN DEFAULT true,
    next_payout_date DATE,
    
    -- Automatic vs manual
    auto_payout BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Payout Requests Table
CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    earnings_id UUID REFERENCES creator_earnings(id) ON DELETE CASCADE,
    
    -- Request details
    requested_amount INTEGER NOT NULL, -- in cents
    request_type TEXT NOT NULL CHECK (request_type IN ('automatic', 'manual', 'emergency')),
    
    -- Approval workflow
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Processing details
    processing_fee INTEGER DEFAULT 0, -- in cents
    net_payout_amount INTEGER NOT NULL, -- in cents
    
    -- Stripe information
    stripe_transfer_id TEXT,
    stripe_transfer_status TEXT,
    failure_reason TEXT,
    
    -- Metadata
    notes TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced Commission Tracking Table
CREATE TABLE IF NOT EXISTS commission_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES creator_contracts(id) ON DELETE CASCADE,
    
    -- Commission period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Revenue sources
    subscription_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    tip_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    ppv_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    brand_deal_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    other_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    total_gross_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    
    -- Fee calculations
    commission_rate DECIMAL(5,2) NOT NULL, -- e.g., 25.00 for 25%
    commission_amount INTEGER NOT NULL DEFAULT 0, -- in cents
    management_fee INTEGER NOT NULL DEFAULT 0, -- in cents
    processing_fee INTEGER NOT NULL DEFAULT 0, -- in cents
    
    -- Net calculations
    creator_net_payout INTEGER NOT NULL DEFAULT 0, -- in cents
    agency_net_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    
    -- Status
    status TEXT NOT NULL DEFAULT 'calculated' CHECK (status IN ('calculated', 'approved', 'paid', 'disputed')),
    
    -- Metadata
    revenue_breakdown JSONB,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE stripe_connect_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_connect_onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_connect_accounts
CREATE POLICY "Users can view their own connect accounts" ON stripe_connect_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own connect accounts" ON stripe_connect_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all connect accounts" ON stripe_connect_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for stripe_connect_onboarding_sessions
CREATE POLICY "Users can view their own onboarding sessions" ON stripe_connect_onboarding_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding sessions" ON stripe_connect_onboarding_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all onboarding sessions" ON stripe_connect_onboarding_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_earnings
CREATE POLICY "Creators can view their own earnings" ON creator_earnings
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all earnings" ON creator_earnings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for payout_schedules
CREATE POLICY "Users can manage their own payout schedules" ON payout_schedules
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Admins can view all payout schedules" ON payout_schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for payout_requests
CREATE POLICY "Creators can view their own payout requests" ON payout_requests
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can create their own payout requests" ON payout_requests
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all payout requests" ON payout_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for commission_tracking
CREATE POLICY "Creators can view their own commission tracking" ON commission_tracking
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all commission tracking" ON commission_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_connect_accounts_user_id ON stripe_connect_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_connect_accounts_stripe_id ON stripe_connect_accounts(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_stripe_connect_accounts_status ON stripe_connect_accounts(verification_status);

CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator_id ON creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_period ON creator_earnings(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_status ON creator_earnings(payout_status);

CREATE INDEX IF NOT EXISTS idx_payout_schedules_creator_id ON payout_schedules(creator_id);
CREATE INDEX IF NOT EXISTS idx_payout_schedules_active ON payout_schedules(active);
CREATE INDEX IF NOT EXISTS idx_payout_schedules_next_payout ON payout_schedules(next_payout_date);

CREATE INDEX IF NOT EXISTS idx_payout_requests_creator_id ON payout_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_created_at ON payout_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_commission_tracking_creator_id ON commission_tracking(creator_id);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_period ON commission_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_status ON commission_tracking(status);

-- Add updated_at triggers
CREATE TRIGGER update_stripe_connect_accounts_updated_at BEFORE UPDATE ON stripe_connect_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_earnings_updated_at BEFORE UPDATE ON creator_earnings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_schedules_updated_at BEFORE UPDATE ON payout_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_requests_updated_at BEFORE UPDATE ON payout_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_tracking_updated_at BEFORE UPDATE ON commission_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default payout schedule for new creators
CREATE OR REPLACE FUNCTION create_default_payout_schedule()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a default monthly payout schedule
    INSERT INTO payout_schedules (
        creator_id,
        frequency,
        day_of_month,
        minimum_payout_amount,
        active,
        auto_payout,
        requires_approval
    ) VALUES (
        NEW.creator_id,
        'monthly',
        1, -- First of the month
        10000, -- $100 minimum
        true,
        false, -- Manual approval initially
        true
    );
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for default payout schedule
CREATE TRIGGER create_default_payout_schedule_trigger
    AFTER INSERT ON creator_contracts
    FOR EACH ROW
    EXECUTE FUNCTION create_default_payout_schedule();

-- Function to calculate next payout date
CREATE OR REPLACE FUNCTION calculate_next_payout_date(
    frequency TEXT,
    day_of_week INTEGER DEFAULT NULL,
    day_of_month INTEGER DEFAULT NULL,
    from_date DATE DEFAULT CURRENT_DATE
)
RETURNS DATE AS $$
DECLARE
    next_date DATE;
BEGIN
    CASE frequency
        WHEN 'weekly' THEN
            next_date := from_date + INTERVAL '7 days';
        WHEN 'bi_weekly' THEN
            next_date := from_date + INTERVAL '14 days';
        WHEN 'monthly' THEN
            IF day_of_month IS NOT NULL THEN
                next_date := DATE_TRUNC('month', from_date) + INTERVAL '1 month' + (day_of_month - 1) * INTERVAL '1 day';
                IF next_date <= from_date THEN
                    next_date := DATE_TRUNC('month', from_date) + INTERVAL '2 months' + (day_of_month - 1) * INTERVAL '1 day';
                END IF;
            ELSE
                next_date := from_date + INTERVAL '1 month';
            END IF;
        WHEN 'quarterly' THEN
            next_date := from_date + INTERVAL '3 months';
        ELSE
            next_date := from_date + INTERVAL '1 month';
    END CASE;
    
    RETURN next_date;
END;
$$ language 'plpgsql';

-- Function to update creator earnings and trigger payout processing
CREATE OR REPLACE FUNCTION update_creator_earnings(
    creator_id UUID,
    period_start DATE,
    period_end DATE,
    subscription_revenue INTEGER DEFAULT 0,
    tip_revenue INTEGER DEFAULT 0,
    ppv_revenue INTEGER DEFAULT 0,
    brand_deal_revenue INTEGER DEFAULT 0,
    other_revenue INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    earnings_id UUID;
    contract_record RECORD;
    commission_rate DECIMAL(5,2);
    management_fee INTEGER;
    total_gross INTEGER;
    commission_amount INTEGER;
    net_earnings INTEGER;
BEGIN
    -- Get creator's contract information
    SELECT * INTO contract_record
    FROM creator_contracts
    WHERE creator_contracts.creator_id = update_creator_earnings.creator_id
    AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active contract found for creator %', creator_id;
    END IF;
    
    -- Determine commission rate based on package type
    CASE contract_record.package_type
        WHEN 'starter' THEN commission_rate := 30.00;
        WHEN 'premium' THEN commission_rate := 25.00;
        WHEN 'elite' THEN commission_rate := 20.00;
        WHEN 'enterprise' THEN commission_rate := 15.00;
        ELSE commission_rate := 25.00;
    END CASE;
    
    -- Calculate totals
    total_gross := subscription_revenue + tip_revenue + ppv_revenue + brand_deal_revenue + other_revenue;
    commission_amount := ROUND(total_gross * (commission_rate / 100));
    management_fee := contract_record.monthly_fee * 100; -- Convert to cents
    net_earnings := total_gross - commission_amount - management_fee;
    
    -- Insert or update earnings record
    INSERT INTO creator_earnings (
        creator_id,
        contract_id,
        period_start,
        period_end,
        gross_earnings,
        management_fee,
        commission_amount,
        net_earnings,
        payout_status,
        earnings_breakdown
    ) VALUES (
        update_creator_earnings.creator_id,
        contract_record.id,
        update_creator_earnings.period_start,
        update_creator_earnings.period_end,
        total_gross,
        management_fee,
        commission_amount,
        net_earnings,
        'pending',
        jsonb_build_object(
            'subscription_revenue', subscription_revenue,
            'tip_revenue', tip_revenue,
            'ppv_revenue', ppv_revenue,
            'brand_deal_revenue', brand_deal_revenue,
            'other_revenue', other_revenue
        )
    )
    ON CONFLICT (creator_id, period_start, period_end) 
    DO UPDATE SET
        gross_earnings = EXCLUDED.gross_earnings,
        management_fee = EXCLUDED.management_fee,
        commission_amount = EXCLUDED.commission_amount,
        net_earnings = EXCLUDED.net_earnings,
        earnings_breakdown = EXCLUDED.earnings_breakdown,
        updated_at = NOW()
    RETURNING id INTO earnings_id;
    
    -- Create commission tracking record
    INSERT INTO commission_tracking (
        creator_id,
        contract_id,
        period_start,
        period_end,
        subscription_revenue,
        tip_revenue,
        ppv_revenue,
        brand_deal_revenue,
        other_revenue,
        total_gross_revenue,
        commission_rate,
        commission_amount,
        management_fee,
        creator_net_payout,
        agency_net_revenue,
        status
    ) VALUES (
        update_creator_earnings.creator_id,
        contract_record.id,
        update_creator_earnings.period_start,
        update_creator_earnings.period_end,
        subscription_revenue,
        tip_revenue,
        ppv_revenue,
        brand_deal_revenue,
        other_revenue,
        total_gross,
        commission_rate,
        commission_amount,
        management_fee,
        net_earnings,
        commission_amount + management_fee,
        'calculated'
    )
    ON CONFLICT (creator_id, period_start, period_end) 
    DO UPDATE SET
        subscription_revenue = EXCLUDED.subscription_revenue,
        tip_revenue = EXCLUDED.tip_revenue,
        ppv_revenue = EXCLUDED.ppv_revenue,
        brand_deal_revenue = EXCLUDED.brand_deal_revenue,
        other_revenue = EXCLUDED.other_revenue,
        total_gross_revenue = EXCLUDED.total_gross_revenue,
        commission_amount = EXCLUDED.commission_amount,
        management_fee = EXCLUDED.management_fee,
        creator_net_payout = EXCLUDED.creator_net_payout,
        agency_net_revenue = EXCLUDED.agency_net_revenue,
        updated_at = NOW();
    
    RETURN earnings_id;
END;
$$ language 'plpgsql';