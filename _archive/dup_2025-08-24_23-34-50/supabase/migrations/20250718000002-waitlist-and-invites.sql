-- Waitlist and Invites System for TD Studios Coming Soon Page
-- This migration creates tables for email waitlist and invitation codes

-- Waitlist Table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'coming_soon_page',
    metadata JSONB DEFAULT '{}',
    subscribed BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Invites Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    email TEXT,
    created_by UUID REFERENCES auth.users(id),
    used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES auth.users(id),
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    invite_type TEXT DEFAULT 'creator' CHECK (invite_type IN ('creator', 'admin', 'early_access')),
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entry" ON waitlist
    FOR SELECT USING (true); -- Public read for stats

CREATE POLICY "Admins can manage waitlist" ON waitlist
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for invites
CREATE POLICY "Anyone can validate invite codes" ON invites
    FOR SELECT USING (true); -- Public read for validation

CREATE POLICY "Admins can manage invites" ON invites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source);

CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_used ON invites(used);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at ON invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_invites_type ON invites(invite_type);

-- Add updated_at triggers
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invites_updated_at BEFORE UPDATE ON invites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create invite codes
CREATE OR REPLACE FUNCTION create_invite_code(
    invite_email TEXT DEFAULT NULL,
    invite_type TEXT DEFAULT 'creator',
    expires_days INTEGER DEFAULT 30
)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    attempts INTEGER := 0;
BEGIN
    LOOP
        new_code := generate_invite_code();
        attempts := attempts + 1;
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM invites WHERE code = new_code) THEN
            EXIT;
        END IF;
        
        -- Prevent infinite loops
        IF attempts > 100 THEN
            RAISE EXCEPTION 'Could not generate unique invite code';
        END IF;
    END LOOP;
    
    -- Insert the new invite
    INSERT INTO invites (code, email, invite_type, expires_at, created_by)
    VALUES (
        new_code,
        invite_email,
        invite_type,
        CURRENT_TIMESTAMP + INTERVAL '1 day' * expires_days,
        auth.uid()
    );
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use an invite code
CREATE OR REPLACE FUNCTION use_invite_code(invite_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    invite_record RECORD;
BEGIN
    -- Get the invite
    SELECT * INTO invite_record 
    FROM invites 
    WHERE code = UPPER(invite_code) 
    AND used = false 
    AND (expires_at IS NULL OR expires_at > NOW());
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Mark as used
    UPDATE invites 
    SET 
        used = true,
        used_by = auth.uid(),
        used_at = NOW()
    WHERE code = UPPER(invite_code);
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample invite codes for testing
INSERT INTO invites (code, invite_type, expires_at) VALUES
('CREATOR01', 'creator', NOW() + INTERVAL '30 days'),
('CREATOR02', 'creator', NOW() + INTERVAL '30 days'),
('CREATOR03', 'creator', NOW() + INTERVAL '30 days'),
('EARLY001', 'early_access', NOW() + INTERVAL '7 days'),
('EARLY002', 'early_access', NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;

-- Function to get waitlist stats
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_signups', COUNT(*),
        'recent_signups', COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days'),
        'sources', json_object_agg(source, count)
    ) INTO result
    FROM (
        SELECT 
            source,
            COUNT(*) as count
        FROM waitlist 
        WHERE subscribed = true
        GROUP BY source
    ) grouped,
    waitlist;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get invite stats
CREATE OR REPLACE FUNCTION get_invite_stats()
RETURNS JSON AS $$
BEGIN
    RETURN (
        SELECT json_build_object(
            'total_invites', COUNT(*),
            'used_invites', COUNT(*) FILTER (WHERE used = true),
            'expired_invites', COUNT(*) FILTER (WHERE expires_at < NOW()),
            'active_invites', COUNT(*) FILTER (WHERE used = false AND (expires_at IS NULL OR expires_at > NOW())),
            'by_type', json_object_agg(invite_type, count)
        )
        FROM (
            SELECT 
                invite_type,
                COUNT(*) as count
            FROM invites 
            GROUP BY invite_type
        ) grouped,
        invites
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;