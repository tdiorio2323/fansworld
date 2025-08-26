-- TD Studios Agency Management Schema
-- This migration creates the database structure for the TD Studios creator management agency

-- Creator Applications Table
CREATE TABLE IF NOT EXISTS creator_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    location TEXT NOT NULL,
    
    -- Platform Information
    primary_platform TEXT NOT NULL,
    instagram_handle TEXT,
    tiktok_handle TEXT,
    onlyfans_handle TEXT,
    twitch_handle TEXT,
    youtube_handle TEXT,
    
    -- Statistics
    total_followers INTEGER NOT NULL,
    monthly_earnings INTEGER NOT NULL,
    content_niche TEXT NOT NULL,
    
    -- Goals and Experience
    career_goals TEXT NOT NULL,
    current_challenges TEXT NOT NULL,
    previous_management TEXT NOT NULL,
    
    -- Package Selection
    interested_package TEXT NOT NULL,
    
    -- Legal Agreements
    over_18 BOOLEAN NOT NULL DEFAULT false,
    agrees_to_terms BOOLEAN NOT NULL DEFAULT false,
    agrees_to_background BOOLEAN NOT NULL DEFAULT false,
    
    -- Application Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'on_hold')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Review Information
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    -- Application Progress
    progress_stage INTEGER DEFAULT 1 CHECK (progress_stage >= 1 AND progress_stage <= 5),
    estimated_response_days INTEGER DEFAULT 5
);

-- Creator Contracts Table
CREATE TABLE IF NOT EXISTS creator_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES creator_applications(id) ON DELETE CASCADE,
    
    -- Contract Details
    package_type TEXT NOT NULL CHECK (package_type IN ('starter', 'premium', 'elite', 'custom')),
    monthly_fee INTEGER NOT NULL, -- in cents
    commission_rate DECIMAL(5,2) NOT NULL, -- e.g., 25.00 for 25%
    
    -- Contract Terms
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for indefinite contracts
    contract_length_months INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'active', 'terminated', 'expired')),
    
    -- Contract Files
    contract_file_url TEXT,
    signed_contract_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Termination
    terminated_at TIMESTAMP WITH TIME ZONE,
    termination_reason TEXT,
    
    UNIQUE(creator_id, status) -- Only one active contract per creator
);

-- Creator Earnings Table
CREATE TABLE IF NOT EXISTS creator_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES creator_contracts(id) ON DELETE CASCADE,
    
    -- Earnings Data
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_earnings INTEGER NOT NULL, -- in cents
    commission_amount INTEGER NOT NULL, -- in cents
    management_fee INTEGER NOT NULL, -- in cents
    net_earnings INTEGER NOT NULL, -- in cents
    
    -- Platform Breakdown
    platform_earnings JSONB, -- {"onlyfans": 50000, "instagram": 10000, etc.}
    
    -- Payment Status
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
    payment_date DATE,
    payment_method TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(creator_id, period_start, period_end)
);

-- Creator Goals Table
CREATE TABLE IF NOT EXISTS creator_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Goal Details
    title TEXT NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    
    -- Goal Type
    goal_type TEXT NOT NULL CHECK (goal_type IN ('subscribers', 'earnings', 'engagement', 'content', 'custom')),
    
    -- Timeline
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    completed_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Creator Milestones Table
CREATE TABLE IF NOT EXISTS creator_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES creator_applications(id) ON DELETE CASCADE,
    
    -- Milestone Details
    title TEXT NOT NULL,
    description TEXT,
    milestone_type TEXT NOT NULL CHECK (milestone_type IN ('application', 'onboarding', 'performance', 'contract', 'custom')),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    
    -- Timeline
    due_date DATE,
    completed_date DATE,
    
    -- Order
    display_order INTEGER NOT NULL DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Creator Notes Table (for account managers)
CREATE TABLE IF NOT EXISTS creator_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Note Content
    title TEXT,
    content TEXT NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'meeting', 'performance', 'issue', 'strategy')),
    
    -- Visibility
    is_internal BOOLEAN NOT NULL DEFAULT true,
    is_important BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Agency Stats Table (for dashboard metrics)
CREATE TABLE IF NOT EXISTS agency_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Stats Data
    total_creators INTEGER NOT NULL DEFAULT 0,
    total_revenue INTEGER NOT NULL DEFAULT 0, -- in cents
    total_applications INTEGER NOT NULL DEFAULT 0,
    average_growth_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(period_start, period_end)
);

-- Enable Row Level Security
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_applications
CREATE POLICY "Users can view their own applications" ON creator_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON creator_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON creator_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON creator_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update all applications" ON creator_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_contracts
CREATE POLICY "Users can view their own contracts" ON creator_contracts
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all contracts" ON creator_contracts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_earnings
CREATE POLICY "Users can view their own earnings" ON creator_earnings
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all earnings" ON creator_earnings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_goals
CREATE POLICY "Users can manage their own goals" ON creator_goals
    FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Admins can view all goals" ON creator_goals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_milestones
CREATE POLICY "Users can view their own milestones" ON creator_milestones
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all milestones" ON creator_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for creator_notes
CREATE POLICY "Users can view non-internal notes about them" ON creator_notes
    FOR SELECT USING (
        auth.uid() = creator_id AND is_internal = false
    );

CREATE POLICY "Admins can manage all notes" ON creator_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for agency_stats
CREATE POLICY "Admins can view agency stats" ON agency_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creator_applications_user_id ON creator_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_applications_status ON creator_applications(status);
CREATE INDEX IF NOT EXISTS idx_creator_applications_created_at ON creator_applications(created_at);

CREATE INDEX IF NOT EXISTS idx_creator_contracts_creator_id ON creator_contracts(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_contracts_status ON creator_contracts(status);
CREATE INDEX IF NOT EXISTS idx_creator_contracts_application_id ON creator_contracts(application_id);

CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator_id ON creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_period ON creator_earnings(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_payment_status ON creator_earnings(payment_status);

CREATE INDEX IF NOT EXISTS idx_creator_goals_creator_id ON creator_goals(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_goals_status ON creator_goals(status);

CREATE INDEX IF NOT EXISTS idx_creator_milestones_creator_id ON creator_milestones(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_milestones_application_id ON creator_milestones(application_id);

CREATE INDEX IF NOT EXISTS idx_creator_notes_creator_id ON creator_notes(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_notes_author_id ON creator_notes(author_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_creator_applications_updated_at BEFORE UPDATE ON creator_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_contracts_updated_at BEFORE UPDATE ON creator_contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_earnings_updated_at BEFORE UPDATE ON creator_earnings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_goals_updated_at BEFORE UPDATE ON creator_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_milestones_updated_at BEFORE UPDATE ON creator_milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_notes_updated_at BEFORE UPDATE ON creator_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_stats_updated_at BEFORE UPDATE ON agency_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default milestones for new applications
CREATE OR REPLACE FUNCTION create_default_milestones()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO creator_milestones (creator_id, application_id, title, milestone_type, display_order, status) VALUES
        (NEW.user_id, NEW.id, 'Application Submitted', 'application', 1, 'completed'),
        (NEW.user_id, NEW.id, 'Initial Review', 'application', 2, 'pending'),
        (NEW.user_id, NEW.id, 'Portfolio Assessment', 'application', 3, 'pending'),
        (NEW.user_id, NEW.id, 'Final Interview', 'application', 4, 'pending'),
        (NEW.user_id, NEW.id, 'Contract Signing', 'contract', 5, 'pending');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for default milestones
CREATE TRIGGER create_default_milestones_trigger AFTER INSERT ON creator_applications
    FOR EACH ROW EXECUTE FUNCTION create_default_milestones();

-- Function to calculate progress percentage for goals
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    NEW.progress_percentage = CASE 
        WHEN NEW.target_value = 0 THEN 0
        ELSE LEAST(100, ROUND((NEW.current_value::decimal / NEW.target_value::decimal) * 100))
    END;
    
    -- Mark as completed if target is reached
    IF NEW.progress_percentage >= 100 AND NEW.status = 'active' THEN
        NEW.status = 'completed';
        NEW.completed_date = CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for goal progress calculation
CREATE TRIGGER update_goal_progress_trigger BEFORE INSERT OR UPDATE ON creator_goals
    FOR EACH ROW EXECUTE FUNCTION update_goal_progress();