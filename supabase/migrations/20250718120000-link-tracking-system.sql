-- Link Tracking System for TD Studios/Fansworld
-- This migration creates tables for tracking outbound links and analytics

-- Link Tracking Table
CREATE TABLE IF NOT EXISTS link_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Link Details
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    custom_alias TEXT UNIQUE,
    
    -- Tracking Info
    campaign_name TEXT,
    source TEXT, -- email, social, direct, etc.
    medium TEXT, -- cpm, cpc, banner, etc. 
    content TEXT, -- specific ad or content identifier
    term TEXT, -- keywords
    
    -- Creator/User Association
    created_by UUID REFERENCES auth.users(id),
    creator_id UUID, -- for tracking specific creator links
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Link Clicks/Analytics Table
CREATE TABLE IF NOT EXISTS link_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Link Reference
    link_id UUID REFERENCES link_tracking(id) ON DELETE CASCADE,
    short_code TEXT NOT NULL,
    
    -- Click Details
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    
    -- Geographic Data
    country TEXT,
    region TEXT,
    city TEXT,
    
    -- Device/Browser Info
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT,
    os TEXT,
    
    -- UTM Parameters (if any)
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    
    -- User Association (if logged in)
    user_id UUID REFERENCES auth.users(id),
    
    -- Session Info
    session_id TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamp
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- VIP Access Links Table (for tracking VIP code distribution)
CREATE TABLE IF NOT EXISTS vip_link_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Link Details
    vip_code TEXT NOT NULL REFERENCES invites(code),
    tracking_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    
    -- Distribution Info
    sent_to TEXT, -- email or identifier
    sent_via TEXT, -- email, sms, social, etc.
    campaign_name TEXT,
    
    -- Creator/Sender Info
    sent_by UUID REFERENCES auth.users(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE link_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_link_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for link_tracking
CREATE POLICY "Users can view their own links" ON link_tracking
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create links" ON link_tracking
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own links" ON link_tracking
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all links" ON link_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for link_clicks
CREATE POLICY "Public can record clicks" ON link_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view clicks for their links" ON link_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM link_tracking 
            WHERE link_tracking.id = link_clicks.link_id 
            AND link_tracking.created_by = auth.uid()
        )
    );

CREATE POLICY "Admins can view all clicks" ON link_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for vip_link_tracking
CREATE POLICY "Users can view their own VIP links" ON vip_link_tracking
    FOR SELECT USING (sent_by = auth.uid());

CREATE POLICY "Users can create VIP links" ON vip_link_tracking
    FOR INSERT WITH CHECK (sent_by = auth.uid());

CREATE POLICY "Admins can manage all VIP links" ON vip_link_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_link_tracking_short_code ON link_tracking(short_code);
CREATE INDEX IF NOT EXISTS idx_link_tracking_created_by ON link_tracking(created_by);
CREATE INDEX IF NOT EXISTS idx_link_tracking_active ON link_tracking(is_active);
CREATE INDEX IF NOT EXISTS idx_link_tracking_expires_at ON link_tracking(expires_at);

CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_short_code ON link_clicks(short_code);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_link_clicks_ip_address ON link_clicks(ip_address);
CREATE INDEX IF NOT EXISTS idx_link_clicks_device_type ON link_clicks(device_type);

CREATE INDEX IF NOT EXISTS idx_vip_link_tracking_vip_code ON vip_link_tracking(vip_code);
CREATE INDEX IF NOT EXISTS idx_vip_link_tracking_short_code ON vip_link_tracking(short_code);
CREATE INDEX IF NOT EXISTS idx_vip_link_tracking_sent_by ON vip_link_tracking(sent_by);

-- Add updated_at triggers
CREATE TRIGGER update_link_tracking_updated_at BEFORE UPDATE ON link_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vip_link_tracking_updated_at BEFORE UPDATE ON vip_link_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate short codes
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create a tracked link
CREATE OR REPLACE FUNCTION create_tracked_link(
    original_url TEXT,
    campaign_name TEXT DEFAULT NULL,
    source TEXT DEFAULT NULL,
    medium TEXT DEFAULT NULL,
    content TEXT DEFAULT NULL,
    term TEXT DEFAULT NULL,
    custom_alias TEXT DEFAULT NULL,
    expires_days INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_short_code TEXT;
    attempts INTEGER := 0;
    link_id UUID;
    base_url TEXT := 'https://fansworld.lux/l/';
BEGIN
    -- Generate unique short code
    LOOP
        IF custom_alias IS NOT NULL AND custom_alias != '' THEN
            new_short_code := custom_alias;
        ELSE
            new_short_code := generate_short_code();
        END IF;
        
        attempts := attempts + 1;
        
        -- Check if code already exists
        IF NOT EXISTS (SELECT 1 FROM link_tracking WHERE short_code = new_short_code) THEN
            EXIT;
        END IF;
        
        -- If custom alias exists, error out
        IF custom_alias IS NOT NULL THEN
            RAISE EXCEPTION 'Custom alias already exists: %', custom_alias;
        END IF;
        
        -- Prevent infinite loops
        IF attempts > 100 THEN
            RAISE EXCEPTION 'Could not generate unique short code';
        END IF;
    END LOOP;
    
    -- Insert the new link
    INSERT INTO link_tracking (
        original_url, 
        short_code, 
        custom_alias,
        campaign_name, 
        source, 
        medium, 
        content, 
        term,
        expires_at,
        created_by
    )
    VALUES (
        original_url,
        new_short_code,
        custom_alias,
        campaign_name,
        source,
        medium,
        content,
        term,
        CASE 
            WHEN expires_days IS NOT NULL THEN CURRENT_TIMESTAMP + INTERVAL '1 day' * expires_days
            ELSE NULL
        END,
        auth.uid()
    )
    RETURNING id INTO link_id;
    
    RETURN json_build_object(
        'id', link_id,
        'short_code', new_short_code,
        'short_url', base_url || new_short_code,
        'original_url', original_url,
        'campaign_name', campaign_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create VIP access link
CREATE OR REPLACE FUNCTION create_vip_access_link(
    vip_code TEXT,
    sent_to TEXT DEFAULT NULL,
    sent_via TEXT DEFAULT 'manual',
    campaign_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_short_code TEXT;
    attempts INTEGER := 0;
    link_id UUID;
    base_url TEXT := 'https://fansworld.lux/vip/';
    tracking_url TEXT;
BEGIN
    -- Verify VIP code exists
    IF NOT EXISTS (SELECT 1 FROM invites WHERE code = UPPER(vip_code) AND used = false) THEN
        RAISE EXCEPTION 'VIP code does not exist or has been used: %', vip_code;
    END IF;
    
    -- Generate unique short code
    LOOP
        new_short_code := generate_short_code();
        attempts := attempts + 1;
        
        IF NOT EXISTS (SELECT 1 FROM vip_link_tracking WHERE short_code = new_short_code) THEN
            EXIT;
        END IF;
        
        IF attempts > 100 THEN
            RAISE EXCEPTION 'Could not generate unique short code';
        END IF;
    END LOOP;
    
    -- Create tracking URL
    tracking_url := 'https://fansworld.lux/?vip=' || UPPER(vip_code) || '&ref=' || new_short_code;
    
    -- Insert the new VIP link
    INSERT INTO vip_link_tracking (
        vip_code,
        tracking_url,
        short_code,
        sent_to,
        sent_via,
        campaign_name,
        sent_by
    )
    VALUES (
        UPPER(vip_code),
        tracking_url,
        new_short_code,
        sent_to,
        sent_via,
        campaign_name,
        auth.uid()
    )
    RETURNING id INTO link_id;
    
    RETURN json_build_object(
        'id', link_id,
        'short_code', new_short_code,
        'short_url', base_url || new_short_code,
        'tracking_url', tracking_url,
        'vip_code', UPPER(vip_code),
        'sent_to', sent_to
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a link click
CREATE OR REPLACE FUNCTION record_link_click(
    short_code TEXT,
    ip_address INET DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    referer TEXT DEFAULT NULL,
    country TEXT DEFAULT NULL,
    region TEXT DEFAULT NULL,
    city TEXT DEFAULT NULL,
    device_type TEXT DEFAULT NULL,
    browser TEXT DEFAULT NULL,
    os TEXT DEFAULT NULL,
    session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    link_record RECORD;
BEGIN
    -- Get the link
    SELECT * INTO link_record 
    FROM link_tracking 
    WHERE link_tracking.short_code = record_link_click.short_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW());
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Record the click
    INSERT INTO link_clicks (
        link_id,
        short_code,
        ip_address,
        user_agent,
        referer,
        country,
        region,
        city,
        device_type,
        browser,
        os,
        user_id,
        session_id
    )
    VALUES (
        link_record.id,
        record_link_click.short_code,
        ip_address,
        user_agent,
        referer,
        country,
        region,
        city,
        device_type,
        browser,
        os,
        auth.uid(),
        session_id
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get link analytics
CREATE OR REPLACE FUNCTION get_link_analytics(link_id UUID DEFAULT NULL, user_filter UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
    result JSON;
    where_clause TEXT := '';
BEGIN
    -- Build where clause
    IF link_id IS NOT NULL THEN
        where_clause := where_clause || ' AND lt.id = ''' || link_id || '''';
    END IF;
    
    IF user_filter IS NOT NULL THEN
        where_clause := where_clause || ' AND lt.created_by = ''' || user_filter || '''';
    ELSE
        where_clause := where_clause || ' AND lt.created_by = ''' || auth.uid() || '''';
    END IF;
    
    EXECUTE '
    SELECT json_build_object(
        ''total_links'', COUNT(DISTINCT lt.id),
        ''total_clicks'', COUNT(lc.id),
        ''unique_clicks'', COUNT(DISTINCT lc.ip_address),
        ''recent_clicks'', COUNT(lc.id) FILTER (WHERE lc.clicked_at > NOW() - INTERVAL ''7 days''),
        ''top_links'', (
            SELECT json_agg(link_stats)
            FROM (
                SELECT 
                    lt.short_code,
                    lt.original_url,
                    lt.campaign_name,
                    COUNT(lc.id) as clicks,
                    COUNT(DISTINCT lc.ip_address) as unique_clicks,
                    lt.created_at
                FROM link_tracking lt
                LEFT JOIN link_clicks lc ON lt.id = lc.link_id
                WHERE 1=1 ' || where_clause || '
                GROUP BY lt.id, lt.short_code, lt.original_url, lt.campaign_name, lt.created_at
                ORDER BY clicks DESC
                LIMIT 10
            ) link_stats
        ),
        ''device_breakdown'', (
            SELECT json_object_agg(device_type, count)
            FROM (
                SELECT 
                    COALESCE(lc.device_type, ''unknown'') as device_type,
                    COUNT(*) as count
                FROM link_clicks lc
                JOIN link_tracking lt ON lt.id = lc.link_id
                WHERE 1=1 ' || where_clause || '
                GROUP BY device_type
            ) device_stats
        ),
        ''geographic_breakdown'', (
            SELECT json_object_agg(country, count)
            FROM (
                SELECT 
                    COALESCE(lc.country, ''unknown'') as country,
                    COUNT(*) as count
                FROM link_clicks lc
                JOIN link_tracking lt ON lt.id = lc.link_id
                WHERE 1=1 ' || where_clause || '
                GROUP BY country
                ORDER BY count DESC
                LIMIT 10
            ) geo_stats
        )
    )
    FROM link_tracking lt
    LEFT JOIN link_clicks lc ON lt.id = lc.link_id
    WHERE 1=1 ' || where_clause
    INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing
INSERT INTO link_tracking (original_url, short_code, campaign_name, source, created_by) VALUES
('https://fansworld.lux', 'tdstud', 'TD Studios Launch', 'email', '00000000-0000-0000-0000-000000000000'),
('https://fansworld.lux/creators', 'create', 'Creator Signup', 'social', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (short_code) DO NOTHING;