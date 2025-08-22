-- 🎁 VIRTUAL GIFTS - DATABASE MIGRATION
-- Run this migration to add virtual gifts tables to your Supabase database

-- ====================
-- VIRTUAL GIFTS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS virtual_gifts (
  id text PRIMARY KEY,
  name text NOT NULL,
  emoji text NOT NULL,
  description text,
  price integer NOT NULL CHECK (price >= 0), -- price in cents
  category text NOT NULL CHECK (category IN ('hearts', 'stars', 'luxury', 'seasonal', 'custom')),
  rarity text NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  animation text,
  sound text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_virtual_gifts_category ON virtual_gifts(category);
CREATE INDEX IF NOT EXISTS idx_virtual_gifts_rarity ON virtual_gifts(rarity);
CREATE INDEX IF NOT EXISTS idx_virtual_gifts_price ON virtual_gifts(price);
CREATE INDEX IF NOT EXISTS idx_virtual_gifts_active ON virtual_gifts(is_active);

-- ====================
-- GIFT TRANSACTIONS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS gift_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id text NOT NULL REFERENCES virtual_gifts(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount >= 0), -- total amount in cents
  quantity integer NOT NULL CHECK (quantity > 0),
  message text,
  is_anonymous boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure sender and recipient are different
  CONSTRAINT different_sender_recipient CHECK (sender_id != recipient_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gift_transactions_sender ON gift_transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_recipient ON gift_transactions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_gift ON gift_transactions(gift_id);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_status ON gift_transactions(status);
CREATE INDEX IF NOT EXISTS idx_gift_transactions_created_at ON gift_transactions(created_at DESC);

-- ====================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================

-- Enable RLS on both tables
ALTER TABLE virtual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

-- Virtual Gifts policies (public read access)
CREATE POLICY "Anyone can view active virtual gifts" ON virtual_gifts
  FOR SELECT USING (is_active = true);

-- Only admins can modify virtual gifts (you can adjust this based on your admin system)
CREATE POLICY "Admins can manage virtual gifts" ON virtual_gifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Gift Transactions policies
CREATE POLICY "Users can view their own gift transactions" ON gift_transactions
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

CREATE POLICY "Users can create gift transactions as sender" ON gift_transactions
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent transactions" ON gift_transactions
  FOR UPDATE USING (auth.uid() = sender_id);

-- ====================
-- FUNCTIONS & TRIGGERS
-- ====================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_virtual_gifts_updated_at 
  BEFORE UPDATE ON virtual_gifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gift_transactions_updated_at 
  BEFORE UPDATE ON gift_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- SEED DEFAULT GIFT CATALOG
-- ====================

INSERT INTO virtual_gifts (id, name, emoji, description, price, category, rarity, animation, sound, is_active) VALUES
-- Hearts Category
('heart-small', 'Little Heart', '💗', 'A sweet little heart to show you care', 100, 'hearts', 'common', 'float-up', 'heart-beat', true),
('heart-big', 'Big Heart', '❤️', 'A big heart filled with love', 300, 'hearts', 'common', 'pulse-grow', 'heart-beat', true),
('heart-fire', 'Fire Heart', '❤️‍🔥', 'A passionate burning heart', 500, 'hearts', 'rare', 'fire-effect', 'fire-crackle', true),

-- Stars Category
('star-small', 'Twinkle Star', '⭐', 'A bright twinkling star', 200, 'stars', 'common', 'twinkle', 'star-chime', true),
('shooting-star', 'Shooting Star', '🌟', 'Make a wish on this shooting star', 800, 'stars', 'epic', 'shooting-across', 'whoosh-sparkle', true),

-- Luxury Category
('diamond', 'Diamond', '💎', 'A rare and precious diamond', 1500, 'luxury', 'epic', 'sparkle-rotate', 'crystal-ding', true),
('crown', 'Royal Crown', '👑', 'Fit for royalty - the ultimate gift', 5000, 'luxury', 'legendary', 'golden-glow', 'royal-fanfare', true),
('yacht', 'Luxury Yacht', '🛥️', 'The ultimate luxury gift', 10000, 'luxury', 'legendary', 'sail-by', 'ocean-waves', true),

-- Seasonal Category
('rose', 'Red Rose', '🌹', 'A classic romantic gesture', 400, 'seasonal', 'common', 'bloom', 'nature-chime', true),
('champagne', 'Champagne', '🍾', 'Celebrate in style', 1200, 'seasonal', 'rare', 'pop-fizz', 'champagne-pop', true)

ON CONFLICT (id) DO NOTHING; -- Don't overwrite existing gifts

-- ====================
-- GIFT STATS VIEW
-- ====================

CREATE OR REPLACE VIEW user_gift_stats AS
SELECT 
  u.id as user_id,
  -- Received gifts stats
  COALESCE(received.total_received, 0) as total_received,
  COALESCE(received.total_earnings, 0) as total_earnings,
  -- Sent gifts stats
  COALESCE(sent.total_sent, 0) as total_sent,
  COALESCE(sent.total_spent, 0) as total_spent,
  -- Recent activity
  GREATEST(
    COALESCE(received.last_received, '1970-01-01'::timestamptz),
    COALESCE(sent.last_sent, '1970-01-01'::timestamptz)
  ) as last_activity
FROM 
  auth.users u
LEFT JOIN (
  SELECT 
    recipient_id,
    COUNT(*) as total_received,
    SUM(amount) as total_earnings,
    MAX(created_at) as last_received
  FROM gift_transactions 
  WHERE status = 'completed'
  GROUP BY recipient_id
) received ON u.id = received.recipient_id
LEFT JOIN (
  SELECT 
    sender_id,
    COUNT(*) as total_sent,
    SUM(amount) as total_spent,
    MAX(created_at) as last_sent
  FROM gift_transactions 
  WHERE status = 'completed'
  GROUP BY sender_id
) sent ON u.id = sent.sender_id;

-- ====================
-- CLEANUP INSTRUCTIONS
-- ====================

/*
To remove virtual gifts feature completely:

1. Disable the feature flag:
   ADDON_FLAGS.VIRTUAL_GIFTS = false

2. Drop the tables (WARNING: This will delete all data):
   DROP VIEW IF EXISTS user_gift_stats;
   DROP TABLE IF EXISTS gift_transactions;
   DROP TABLE IF EXISTS virtual_gifts;
   DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

3. Remove the addon files:
   rm -rf src/features/addons/virtual-gifts/

Note: Always backup your database before making destructive changes!
*/

-- ====================
-- PERFORMANCE NOTES
-- ====================

/*
For high-volume applications, consider:

1. Partitioning gift_transactions by date:
   - Monthly or yearly partitions
   - Archive old transactions to separate tables

2. Additional indexes for common queries:
   - Composite index on (recipient_id, created_at) for recipient gift history
   - Composite index on (sender_id, created_at) for sender gift history
   - Partial index on high-value transactions

3. Materialized views for analytics:
   - Daily/monthly gift statistics
   - Top gifts and users
   - Revenue analytics

4. Consider using Supabase Edge Functions for:
   - Complex gift processing logic
   - Payment webhook handling
   - Analytics calculations
*/