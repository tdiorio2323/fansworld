-- 🔒 PPV MESSAGES - DATABASE MIGRATION
-- Run this migration to add PPV Messages tables to your Supabase database

-- ====================
-- PPV MESSAGES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) > 0 AND length(title) <= 200),
  description text,
  price integer NOT NULL CHECK (price >= 99 AND price <= 99999), -- $0.99 to $999.99 in cents
  thumbnail_url text,
  preview_text text CHECK (length(preview_text) <= 200),
  is_active boolean DEFAULT true,
  expires_at timestamptz, -- Optional expiration date
  max_views integer CHECK (max_views > 0), -- Optional view limit
  current_views integer DEFAULT 0 CHECK (current_views >= 0),
  total_earnings integer DEFAULT 0 CHECK (total_earnings >= 0), -- Creator earnings in cents
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ppv_messages_creator ON ppv_messages(creator_id);
CREATE INDEX IF NOT EXISTS idx_ppv_messages_active ON ppv_messages(is_active);
CREATE INDEX IF NOT EXISTS idx_ppv_messages_price ON ppv_messages(price);
CREATE INDEX IF NOT EXISTS idx_ppv_messages_created_at ON ppv_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ppv_messages_expires_at ON ppv_messages(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ppv_messages_earnings ON ppv_messages(total_earnings DESC);

-- ====================
-- PPV MESSAGE CONTENT TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_message_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES ppv_messages(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('text', 'image', 'video', 'audio', 'file')),
  content text NOT NULL, -- Text content or file URL
  caption text,
  thumbnail text, -- Thumbnail URL for media
  duration integer CHECK (duration > 0), -- Duration in seconds for video/audio
  file_size bigint CHECK (file_size > 0), -- File size in bytes
  mime_type text,
  "order" integer DEFAULT 0, -- Display order
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ppv_content_message ON ppv_message_content(message_id);
CREATE INDEX IF NOT EXISTS idx_ppv_content_type ON ppv_message_content(type);
CREATE INDEX IF NOT EXISTS idx_ppv_content_order ON ppv_message_content(message_id, "order");

-- ====================
-- PPV PURCHASES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES ppv_messages(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount >= 0), -- Amount paid in cents
  payment_method text NOT NULL CHECK (payment_method IN ('stripe', 'wallet', 'credits')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  view_count integer DEFAULT 0 CHECK (view_count >= 0),
  last_viewed_at timestamptz,
  expires_at timestamptz, -- Time-limited access
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure buyer doesn't purchase same message twice
  UNIQUE(message_id, buyer_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ppv_purchases_buyer ON ppv_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_ppv_purchases_message ON ppv_purchases(message_id);
CREATE INDEX IF NOT EXISTS idx_ppv_purchases_status ON ppv_purchases(status);
CREATE INDEX IF NOT EXISTS idx_ppv_purchases_created_at ON ppv_purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ppv_purchases_payment_method ON ppv_purchases(payment_method);

-- ====================
-- PPV MESSAGE TAGS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_message_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES ppv_messages(id) ON DELETE CASCADE,
  tag text NOT NULL CHECK (length(tag) > 0 AND length(tag) <= 50),
  created_at timestamptz DEFAULT now(),
  
  -- Ensure no duplicate tags per message
  UNIQUE(message_id, tag)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ppv_tags_message ON ppv_message_tags(message_id);
CREATE INDEX IF NOT EXISTS idx_ppv_tags_tag ON ppv_message_tags(tag);

-- ====================
-- PPV PROMO CODES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_promo_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE CHECK (length(code) >= 3 AND length(code) <= 20),
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value integer NOT NULL CHECK (value > 0), -- Percentage (1-100) or cents for fixed
  is_active boolean DEFAULT true,
  usage_limit integer CHECK (usage_limit > 0),
  usage_count integer DEFAULT 0 CHECK (usage_count >= 0),
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz NOT NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL means global promo
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure valid_until is after valid_from
  CHECK (valid_until > valid_from),
  -- Ensure usage_count doesn't exceed usage_limit
  CHECK (usage_limit IS NULL OR usage_count <= usage_limit)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ppv_promo_codes_active ON ppv_promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_ppv_promo_codes_valid ON ppv_promo_codes(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_ppv_promo_codes_creator ON ppv_promo_codes(creator_id) WHERE creator_id IS NOT NULL;

-- ====================
-- PPV NOTIFICATIONS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS ppv_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase_completed', 'message_expired', 'earnings_milestone', 'new_purchase')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional notification data
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ppv_notifications_user ON ppv_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ppv_notifications_unread ON ppv_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_ppv_notifications_created_at ON ppv_notifications(created_at DESC);

-- ====================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================

-- Enable RLS on all tables
ALTER TABLE ppv_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppv_message_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppv_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppv_message_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppv_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppv_notifications ENABLE ROW LEVEL SECURITY;

-- PPV Messages policies
CREATE POLICY "Anyone can view active PPV messages" ON ppv_messages
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Creators can manage their own messages" ON ppv_messages
  FOR ALL USING (auth.uid() = creator_id);

-- PPV Message Content policies
CREATE POLICY "Content visible to message viewers" ON ppv_message_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ppv_messages 
      WHERE ppv_messages.id = ppv_message_content.message_id 
      AND (
        -- Creator can always see content
        ppv_messages.creator_id = auth.uid() OR
        -- Buyers who purchased can see content
        EXISTS (
          SELECT 1 FROM ppv_purchases 
          WHERE ppv_purchases.message_id = ppv_message_content.message_id 
          AND ppv_purchases.buyer_id = auth.uid() 
          AND ppv_purchases.status = 'completed'
        )
      )
    )
  );

CREATE POLICY "Creators can manage their message content" ON ppv_message_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ppv_messages 
      WHERE ppv_messages.id = ppv_message_content.message_id 
      AND ppv_messages.creator_id = auth.uid()
    )
  );

-- PPV Purchases policies
CREATE POLICY "Users can view their own purchases" ON ppv_purchases
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Creators can view purchases of their messages" ON ppv_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ppv_messages 
      WHERE ppv_messages.id = ppv_purchases.message_id 
      AND ppv_messages.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create purchases" ON ppv_purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own purchases" ON ppv_purchases
  FOR UPDATE USING (auth.uid() = buyer_id);

-- PPV Message Tags policies
CREATE POLICY "Tags visible with messages" ON ppv_message_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ppv_messages 
      WHERE ppv_messages.id = ppv_message_tags.message_id 
      AND ppv_messages.is_active = true
    )
  );

CREATE POLICY "Creators can manage message tags" ON ppv_message_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ppv_messages 
      WHERE ppv_messages.id = ppv_message_tags.message_id 
      AND ppv_messages.creator_id = auth.uid()
    )
  );

-- PPV Promo Codes policies
CREATE POLICY "Users can view active promo codes" ON ppv_promo_codes
  FOR SELECT USING (
    is_active = true 
    AND now() BETWEEN valid_from AND valid_until
    AND (usage_limit IS NULL OR usage_count < usage_limit)
  );

CREATE POLICY "Creators can manage their promo codes" ON ppv_promo_codes
  FOR ALL USING (auth.uid() = creator_id);

-- Admins can manage global promo codes
CREATE POLICY "Admins can manage global promo codes" ON ppv_promo_codes
  FOR ALL USING (
    creator_id IS NULL AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- PPV Notifications policies
CREATE POLICY "Users can view their own notifications" ON ppv_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON ppv_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ====================
-- FUNCTIONS & TRIGGERS
-- ====================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ppv_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_ppv_messages_updated_at 
  BEFORE UPDATE ON ppv_messages
  FOR EACH ROW EXECUTE FUNCTION update_ppv_updated_at_column();

CREATE TRIGGER update_ppv_purchases_updated_at 
  BEFORE UPDATE ON ppv_purchases
  FOR EACH ROW EXECUTE FUNCTION update_ppv_updated_at_column();

CREATE TRIGGER update_ppv_promo_codes_updated_at 
  BEFORE UPDATE ON ppv_promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_ppv_updated_at_column();

-- Function to increment promo code usage
CREATE OR REPLACE FUNCTION increment_promo_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment on successful purchases with promo codes
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update promo code usage (would need additional logic to track which promo was used)
    -- This is a simplified version - real implementation would need purchase_promo_codes junction table
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate message purchase constraints
CREATE OR REPLACE FUNCTION validate_message_purchase()
RETURNS TRIGGER AS $$
DECLARE
  message_record ppv_messages%ROWTYPE;
BEGIN
  -- Get message details
  SELECT * INTO message_record
  FROM ppv_messages
  WHERE id = NEW.message_id;

  -- Check if message exists and is active
  IF NOT FOUND OR NOT message_record.is_active THEN
    RAISE EXCEPTION 'Message not found or inactive';
  END IF;

  -- Check expiration
  IF message_record.expires_at IS NOT NULL AND message_record.expires_at < now() THEN
    RAISE EXCEPTION 'Message has expired';
  END IF;

  -- Check view limits
  IF message_record.max_views IS NOT NULL AND message_record.current_views >= message_record.max_views THEN
    RAISE EXCEPTION 'Message view limit reached';
  END IF;

  -- Prevent self-purchase
  IF message_record.creator_id = NEW.buyer_id THEN
    RAISE EXCEPTION 'Creators cannot purchase their own messages';
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add validation trigger
CREATE TRIGGER validate_ppv_purchase
  BEFORE INSERT ON ppv_purchases
  FOR EACH ROW EXECUTE FUNCTION validate_message_purchase();

-- ====================
-- ANALYTICS VIEWS
-- ====================

-- Creator earnings summary view
CREATE OR REPLACE VIEW ppv_creator_stats AS
SELECT 
  m.creator_id,
  COUNT(DISTINCT m.id) as total_messages,
  SUM(m.total_earnings) as total_earnings,
  SUM(m.current_views) as total_views,
  COUNT(DISTINCT p.buyer_id) as unique_buyers,
  AVG(m.price) as average_price,
  COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_purchases,
  -- This month earnings
  SUM(CASE WHEN p.created_at >= date_trunc('month', now()) AND p.status = 'completed' THEN p.amount ELSE 0 END) as earnings_this_month,
  -- Last month earnings
  SUM(CASE 
    WHEN p.created_at >= date_trunc('month', now()) - interval '1 month' 
    AND p.created_at < date_trunc('month', now()) 
    AND p.status = 'completed' 
    THEN p.amount 
    ELSE 0 
  END) as earnings_last_month
FROM 
  ppv_messages m
LEFT JOIN ppv_purchases p ON m.id = p.message_id
GROUP BY m.creator_id;

-- Message performance view
CREATE OR REPLACE VIEW ppv_message_performance AS
SELECT 
  m.*,
  COUNT(DISTINCT p.buyer_id) as unique_buyers,
  COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as successful_purchases,
  COUNT(CASE WHEN p.status = 'failed' THEN 1 END) as failed_purchases,
  COALESCE(AVG(CASE WHEN p.status = 'completed' THEN p.amount END), 0) as avg_purchase_amount,
  -- Calculate conversion rate (purchases / views)
  CASE 
    WHEN m.current_views > 0 THEN 
      (COUNT(CASE WHEN p.status = 'completed' THEN 1 END)::float / m.current_views) * 100
    ELSE 0 
  END as conversion_rate
FROM 
  ppv_messages m
LEFT JOIN ppv_purchases p ON m.id = p.message_id
GROUP BY m.id, m.creator_id, m.title, m.description, m.price, m.thumbnail_url, 
         m.preview_text, m.is_active, m.expires_at, m.max_views, m.current_views, 
         m.total_earnings, m.created_at, m.updated_at;

-- Popular tags view
CREATE OR REPLACE VIEW ppv_popular_tags AS
SELECT 
  t.tag,
  COUNT(DISTINCT t.message_id) as message_count,
  AVG(m.price) as avg_price,
  SUM(m.total_earnings) as total_earnings,
  COUNT(DISTINCT p.buyer_id) as unique_buyers
FROM 
  ppv_message_tags t
JOIN ppv_messages m ON t.message_id = m.id
LEFT JOIN ppv_purchases p ON m.id = p.message_id AND p.status = 'completed'
WHERE m.is_active = true
GROUP BY t.tag
ORDER BY message_count DESC, total_earnings DESC;

-- ====================
-- CLEANUP INSTRUCTIONS
-- ====================

/*
To remove PPV Messages feature completely:

1. Disable the feature flag:
   ADDON_FLAGS.PPV_MESSAGES = false

2. Drop the tables (WARNING: This will delete all data):
   DROP VIEW IF EXISTS ppv_popular_tags;
   DROP VIEW IF EXISTS ppv_message_performance;
   DROP VIEW IF EXISTS ppv_creator_stats;
   
   DROP TRIGGER IF EXISTS validate_ppv_purchase ON ppv_purchases;
   DROP TRIGGER IF EXISTS update_ppv_promo_codes_updated_at ON ppv_promo_codes;
   DROP TRIGGER IF EXISTS update_ppv_purchases_updated_at ON ppv_purchases;
   DROP TRIGGER IF EXISTS update_ppv_messages_updated_at ON ppv_messages;
   
   DROP FUNCTION IF EXISTS validate_message_purchase() CASCADE;
   DROP FUNCTION IF EXISTS increment_promo_code_usage() CASCADE;
   DROP FUNCTION IF EXISTS update_ppv_updated_at_column() CASCADE;
   
   DROP TABLE IF EXISTS ppv_notifications;
   DROP TABLE IF EXISTS ppv_promo_codes;
   DROP TABLE IF EXISTS ppv_message_tags;
   DROP TABLE IF EXISTS ppv_purchases;
   DROP TABLE IF EXISTS ppv_message_content;
   DROP TABLE IF EXISTS ppv_messages;

3. Remove the addon files:
   rm -rf src/features/addons/ppv-messages/

Note: Always backup your database before making destructive changes!
*/

-- ====================
-- PERFORMANCE NOTES
-- ====================

/*
For high-volume applications, consider:

1. Partitioning strategies:
   - Partition ppv_purchases by date (monthly/yearly)
   - Partition ppv_notifications by date
   - Archive old notifications to reduce table size

2. Additional indexes for common queries:
   - Composite index on (creator_id, created_at) for creator dashboards
   - Composite index on (buyer_id, status, created_at) for purchase history
   - Partial indexes on active messages with specific price ranges

3. Caching strategies:
   - Cache popular messages in Redis/Memcached
   - Cache creator statistics with periodic refresh
   - Use CDN for message thumbnails and media content

4. Real-time features:
   - Use Supabase realtime for purchase notifications
   - Implement message view tracking for better analytics
   - Set up webhook endpoints for payment processing

5. Content delivery:
   - Use Supabase Storage or S3 for media files
   - Implement progressive image loading
   - Add video streaming capabilities for long-form content
*/