-- VIP Waitlist Database Schema
-- Creates tables and indexes for the VIP waitlist feature

-- Create the waitlist entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  handle VARCHAR(100),
  phone VARCHAR(20),
  priority VARCHAR(10) DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'VIP')),
  status VARCHAR(20) DEFAULT 'WAITLISTED' CHECK (status IN ('WAITLISTED', 'APPROVED', 'INVITED', 'REJECTED')),
  source VARCHAR(50),
  referrer VARCHAR(50) CHECK (referrer IN ('instagram', 'twitter', 'site', 'friend', 'other')),
  notes TEXT,
  invite_code VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at ON waitlist_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_priority ON waitlist_entries(priority);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_invite_code ON waitlist_entries(invite_code);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_entries_updated_at 
    BEFORE UPDATE ON waitlist_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public signup (anyone can insert)
CREATE POLICY "Public can create waitlist entries" ON waitlist_entries
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Create policies for public read (only own entries)
CREATE POLICY "Users can read own waitlist entries" ON waitlist_entries
    FOR SELECT TO authenticated
    USING (auth.email() = email);

-- Create policies for admin access (service role can do everything)
CREATE POLICY "Service role can do everything" ON waitlist_entries
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO waitlist_entries (email, name, handle, referrer, notes, priority) VALUES
('test@example.com', 'Test User', 'testuser', 'site', 'Early beta tester', 'VIP'),
('creator@example.com', 'Jane Creator', 'janecreator', 'instagram', 'High follower count', 'NORMAL'),
('influencer@example.com', 'Mike Influencer', 'mikeinfluencer', 'twitter', 'Brand partner', 'VIP')
ON CONFLICT (email) DO NOTHING;