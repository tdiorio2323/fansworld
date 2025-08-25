-- ⚡ FLASH SALES - DATABASE MIGRATION
-- Run this migration to add Flash Sales tables to your Supabase database

-- ====================
-- FLASH SALES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (length(title) > 0 AND length(title) <= 200),
  description text CHECK (length(description) <= 1000),
  sale_type text NOT NULL CHECK (sale_type IN ('subscription', 'ppv_message', 'virtual_gift', 'bundle', 'custom')),
  
  -- Pricing
  original_price integer NOT NULL CHECK (original_price > 0), -- in cents
  sale_price integer NOT NULL CHECK (sale_price >= 0 AND sale_price <= original_price), -- in cents
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value integer NOT NULL CHECK (discount_value > 0),
  
  -- Timing
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  timezone text DEFAULT 'UTC',
  
  -- Limits
  max_purchases integer CHECK (max_purchases > 0),
  max_purchases_per_user integer CHECK (max_purchases_per_user > 0),
  current_purchases integer DEFAULT 0 CHECK (current_purchases >= 0),
  
  -- Visibility and status
  is_active boolean DEFAULT true,
  is_public boolean DEFAULT true,
  requires_subscription boolean DEFAULT false,
  
  -- Engagement metrics
  view_count integer DEFAULT 0 CHECK (view_count >= 0),
  conversion_rate numeric DEFAULT 0 CHECK (conversion_rate >= 0 AND conversion_rate <= 100),
  total_revenue integer DEFAULT 0 CHECK (total_revenue >= 0), -- in cents
  
  -- Social features
  allow_sharing boolean DEFAULT true,
  shareable_url text,
  
  -- Content
  tags text[] DEFAULT '{}',
  thumbnail_url text,
  banner_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CHECK (ends_at > starts_at),
  CHECK (max_purchases IS NULL OR max_purchases_per_user IS NULL OR max_purchases_per_user <= max_purchases)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flash_sales_creator ON flash_sales(creator_id);
CREATE INDEX IF NOT EXISTS idx_flash_sales_active ON flash_sales(is_active);
CREATE INDEX IF NOT EXISTS idx_flash_sales_timing ON flash_sales(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_flash_sales_type ON flash_sales(sale_type);
CREATE INDEX IF NOT EXISTS idx_flash_sales_public ON flash_sales(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_flash_sales_created_at ON flash_sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flash_sales_revenue ON flash_sales(total_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_flash_sales_tags ON flash_sales USING GIN(tags);

-- ====================
-- FLASH SALE ITEMS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sale_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('subscription_month', 'subscription_year', 'ppv_message', 'virtual_gift_bundle', 'custom_item')),
  item_id text, -- Reference to PPV message, subscription plan, etc.
  title text NOT NULL CHECK (length(title) > 0),
  description text,
  original_price integer NOT NULL CHECK (original_price > 0), -- in cents
  sale_price integer NOT NULL CHECK (sale_price >= 0 AND sale_price <= original_price), -- in cents
  quantity integer CHECK (quantity > 0), -- For gift bundles, etc.
  thumbnail_url text,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flash_sale_items_sale ON flash_sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_items_type ON flash_sale_items(item_type);
CREATE INDEX IF NOT EXISTS idx_flash_sale_items_order ON flash_sale_items(sale_id, "order");

-- ====================
-- FLASH SALE PURCHASES TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sale_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount integer NOT NULL CHECK (total_amount >= 0), -- in cents
  total_savings integer NOT NULL CHECK (total_savings >= 0), -- in cents
  payment_method text NOT NULL CHECK (payment_method IN ('stripe', 'wallet', 'credits')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  promo_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique purchase per user per sale (can purchase only once)
  UNIQUE(sale_id, buyer_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchases_sale ON flash_sale_purchases(sale_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchases_buyer ON flash_sale_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchases_status ON flash_sale_purchases(status);
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchases_created_at ON flash_sale_purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchases_payment_method ON flash_sale_purchases(payment_method);

-- ====================
-- FLASH SALE PURCHASED ITEMS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sale_purchased_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id uuid NOT NULL REFERENCES flash_sale_purchases(id) ON DELETE CASCADE,
  item_id text NOT NULL, -- References flash_sale_items.id
  item_type text NOT NULL,
  title text NOT NULL,
  original_price integer NOT NULL CHECK (original_price >= 0), -- in cents
  sale_price integer NOT NULL CHECK (sale_price >= 0), -- in cents
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  savings integer NOT NULL CHECK (savings >= 0), -- in cents
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchased_items_purchase ON flash_sale_purchased_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_purchased_items_type ON flash_sale_purchased_items(item_type);

-- ====================
-- FLASH SALE NOTIFICATIONS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sale_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_id uuid NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('sale_starting', 'sale_ending', 'sale_purchased', 'sale_created', 'reminder')),
  title text NOT NULL,
  message text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flash_sale_notifications_user ON flash_sale_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_notifications_sale ON flash_sale_notifications(sale_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_notifications_scheduled ON flash_sale_notifications(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_flash_sale_notifications_unread ON flash_sale_notifications(user_id, is_read) WHERE is_read = false;

-- ====================
-- FLASH SALE ANALYTICS TABLE
-- ====================

CREATE TABLE IF NOT EXISTS flash_sale_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  unique_views integer DEFAULT 0,
  purchases integer DEFAULT 0,
  revenue integer DEFAULT 0, -- in cents
  conversion_rate numeric DEFAULT 0,
  average_time_on_page integer DEFAULT 0, -- in seconds
  bounce_rate numeric DEFAULT 0,
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique constraint to prevent duplicates per sale per day
  UNIQUE(sale_id, date)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_flash_sale_analytics_sale ON flash_sale_analytics(sale_id);
CREATE INDEX IF NOT EXISTS idx_flash_sale_analytics_date ON flash_sale_analytics(date DESC);

-- ====================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================

-- Enable RLS on all tables
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_purchased_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_analytics ENABLE ROW LEVEL SECURITY;

-- Flash Sales policies
CREATE POLICY "Public can view active flash sales" ON flash_sales
  FOR SELECT USING (
    is_active = true 
    AND is_public = true 
    AND starts_at <= now() 
    AND ends_at > now()
  );

CREATE POLICY "Creators can manage their own flash sales" ON flash_sales
  FOR ALL USING (auth.uid() = creator_id);

-- Subscribers can view non-public sales if required
CREATE POLICY "Subscribers can view subscription-required sales" ON flash_sales
  FOR SELECT USING (
    requires_subscription = true 
    AND is_active = true 
    AND starts_at <= now() 
    AND ends_at > now()
    AND EXISTS (
      SELECT 1 FROM subscriptions 
      WHERE subscriptions.user_id = auth.uid() 
      AND subscriptions.creator_id = flash_sales.creator_id 
      AND subscriptions.status = 'active'
    )
  );

-- Flash Sale Items policies
CREATE POLICY "Items visible with sales" ON flash_sale_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flash_sales 
      WHERE flash_sales.id = flash_sale_items.sale_id 
      AND (
        -- Public active sales
        (flash_sales.is_public = true AND flash_sales.is_active = true) OR
        -- Creator's own sales
        flash_sales.creator_id = auth.uid() OR
        -- Subscriber-only sales
        (flash_sales.requires_subscription = true AND EXISTS (
          SELECT 1 FROM subscriptions 
          WHERE subscriptions.user_id = auth.uid() 
          AND subscriptions.creator_id = flash_sales.creator_id 
          AND subscriptions.status = 'active'
        ))
      )
    )
  );

CREATE POLICY "Creators can manage their sale items" ON flash_sale_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flash_sales 
      WHERE flash_sales.id = flash_sale_items.sale_id 
      AND flash_sales.creator_id = auth.uid()
    )
  );

-- Flash Sale Purchases policies
CREATE POLICY "Users can view their own purchases" ON flash_sale_purchases
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Creators can view purchases of their sales" ON flash_sale_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flash_sales 
      WHERE flash_sales.id = flash_sale_purchases.sale_id 
      AND flash_sales.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create purchases" ON flash_sale_purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own purchases" ON flash_sale_purchases
  FOR UPDATE USING (auth.uid() = buyer_id);

-- Flash Sale Purchased Items policies
CREATE POLICY "Users can view their purchased items" ON flash_sale_purchased_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flash_sale_purchases 
      WHERE flash_sale_purchases.id = flash_sale_purchased_items.purchase_id 
      AND flash_sale_purchases.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view sold items" ON flash_sale_purchased_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flash_sale_purchases 
      JOIN flash_sales ON flash_sales.id = flash_sale_purchases.sale_id
      WHERE flash_sale_purchases.id = flash_sale_purchased_items.purchase_id 
      AND flash_sales.creator_id = auth.uid()
    )
  );

-- Flash Sale Notifications policies
CREATE POLICY "Users can view their own notifications" ON flash_sale_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON flash_sale_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Flash Sale Analytics policies (creators and admins only)
CREATE POLICY "Creators can view their sale analytics" ON flash_sale_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flash_sales 
      WHERE flash_sales.id = flash_sale_analytics.sale_id 
      AND flash_sales.creator_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage analytics" ON flash_sale_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ====================
-- FUNCTIONS & TRIGGERS
-- ====================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_flash_sales_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_flash_sales_updated_at 
  BEFORE UPDATE ON flash_sales
  FOR EACH ROW EXECUTE FUNCTION update_flash_sales_updated_at_column();

CREATE TRIGGER update_flash_sale_purchases_updated_at 
  BEFORE UPDATE ON flash_sale_purchases
  FOR EACH ROW EXECUTE FUNCTION update_flash_sales_updated_at_column();

CREATE TRIGGER update_flash_sale_analytics_updated_at 
  BEFORE UPDATE ON flash_sale_analytics
  FOR EACH ROW EXECUTE FUNCTION update_flash_sales_updated_at_column();

-- Function to validate flash sale constraints
CREATE OR REPLACE FUNCTION validate_flash_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate timing
  IF NEW.starts_at >= NEW.ends_at THEN
    RAISE EXCEPTION 'Flash sale end time must be after start time';
  END IF;

  -- Validate discount makes sense
  IF NEW.discount_type = 'percentage' AND NEW.discount_value > 100 THEN
    RAISE EXCEPTION 'Percentage discount cannot exceed 100%';
  END IF;

  -- Validate sale price matches discount
  DECLARE
    expected_sale_price integer;
  BEGIN
    IF NEW.discount_type = 'percentage' THEN
      expected_sale_price := NEW.original_price - (NEW.original_price * NEW.discount_value / 100);
    ELSE
      expected_sale_price := GREATEST(0, NEW.original_price - NEW.discount_value);
    END IF;
    
    -- Allow small rounding differences
    IF ABS(NEW.sale_price - expected_sale_price) > 1 THEN
      RAISE EXCEPTION 'Sale price does not match discount calculation';
    END IF;
  END;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add validation trigger
CREATE TRIGGER validate_flash_sale_trigger
  BEFORE INSERT OR UPDATE ON flash_sales
  FOR EACH ROW EXECUTE FUNCTION validate_flash_sale();

-- Function to validate purchase constraints
CREATE OR REPLACE FUNCTION validate_flash_sale_purchase()
RETURNS TRIGGER AS $$
DECLARE
  sale_record flash_sales%ROWTYPE;
  user_purchase_count integer;
BEGIN
  -- Get sale details
  SELECT * INTO sale_record
  FROM flash_sales
  WHERE id = NEW.sale_id;

  -- Check if sale exists and is active
  IF NOT FOUND OR NOT sale_record.is_active THEN
    RAISE EXCEPTION 'Flash sale not found or inactive';
  END IF;

  -- Check timing
  IF now() < sale_record.starts_at THEN
    RAISE EXCEPTION 'Flash sale has not started yet';
  END IF;

  IF now() > sale_record.ends_at THEN
    RAISE EXCEPTION 'Flash sale has ended';
  END IF;

  -- Check total purchase limit
  IF sale_record.max_purchases IS NOT NULL AND sale_record.current_purchases >= sale_record.max_purchases THEN
    RAISE EXCEPTION 'Flash sale is sold out';
  END IF;

  -- Check per-user purchase limit
  IF sale_record.max_purchases_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO user_purchase_count
    FROM flash_sale_purchases
    WHERE sale_id = NEW.sale_id 
    AND buyer_id = NEW.buyer_id 
    AND status = 'completed';

    IF user_purchase_count >= sale_record.max_purchases_per_user THEN
      RAISE EXCEPTION 'Maximum purchases per user exceeded for this sale';
    END IF;
  END IF;

  -- Prevent self-purchase
  IF sale_record.creator_id = NEW.buyer_id THEN
    RAISE EXCEPTION 'Creators cannot purchase their own flash sales';
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add purchase validation trigger
CREATE TRIGGER validate_flash_sale_purchase_trigger
  BEFORE INSERT ON flash_sale_purchases
  FOR EACH ROW EXECUTE FUNCTION validate_flash_sale_purchase();

-- ====================
-- ANALYTICS VIEWS
-- ====================

-- Creator flash sale summary view
CREATE OR REPLACE VIEW flash_sale_creator_stats AS
SELECT 
  fs.creator_id,
  COUNT(DISTINCT fs.id) as total_sales,
  SUM(fs.total_revenue) as total_revenue,
  SUM(fs.view_count) as total_views,
  COUNT(DISTINCT fsp.buyer_id) as unique_buyers,
  AVG(fs.conversion_rate) as avg_conversion_rate,
  COUNT(CASE WHEN fs.ends_at > now() AND fs.is_active THEN 1 END) as active_sales,
  -- This month stats
  SUM(CASE WHEN fsp.created_at >= date_trunc('month', now()) AND fsp.status = 'completed' THEN fsp.total_amount ELSE 0 END) as revenue_this_month,
  COUNT(CASE WHEN fsp.created_at >= date_trunc('month', now()) AND fsp.status = 'completed' THEN 1 END) as sales_this_month,
  -- Last month stats
  SUM(CASE 
    WHEN fsp.created_at >= date_trunc('month', now()) - interval '1 month' 
    AND fsp.created_at < date_trunc('month', now()) 
    AND fsp.status = 'completed' 
    THEN fsp.total_amount 
    ELSE 0 
  END) as revenue_last_month,
  COUNT(CASE 
    WHEN fsp.created_at >= date_trunc('month', now()) - interval '1 month' 
    AND fsp.created_at < date_trunc('month', now()) 
    AND fsp.status = 'completed' 
    THEN 1 
  END) as sales_last_month
FROM 
  flash_sales fs
LEFT JOIN flash_sale_purchases fsp ON fs.id = fsp.sale_id
GROUP BY fs.creator_id;

-- Flash sale performance view
CREATE OR REPLACE VIEW flash_sale_performance AS
SELECT 
  fs.*,
  COUNT(DISTINCT fsp.buyer_id) as unique_buyers,
  COUNT(CASE WHEN fsp.status = 'completed' THEN 1 END) as successful_purchases,
  COUNT(CASE WHEN fsp.status = 'failed' THEN 1 END) as failed_purchases,
  COALESCE(AVG(CASE WHEN fsp.status = 'completed' THEN fsp.total_amount END), 0) as avg_purchase_amount,
  COALESCE(SUM(CASE WHEN fsp.status = 'completed' THEN fsp.total_savings END), 0) as total_savings_given,
  -- Status calculation
  CASE 
    WHEN NOT fs.is_active THEN 'paused'
    WHEN fs.max_purchases IS NOT NULL AND fs.current_purchases >= fs.max_purchases THEN 'sold_out'
    WHEN now() < fs.starts_at THEN 'upcoming'
    WHEN now() > fs.ends_at THEN 'ended'
    WHEN now() > (fs.ends_at - interval '4 hours') THEN 'ending_soon'
    ELSE 'active'
  END as status
FROM 
  flash_sales fs
LEFT JOIN flash_sale_purchases fsp ON fs.id = fsp.sale_id
GROUP BY fs.id, fs.creator_id, fs.title, fs.description, fs.sale_type, fs.original_price, 
         fs.sale_price, fs.discount_type, fs.discount_value, fs.starts_at, fs.ends_at, 
         fs.timezone, fs.max_purchases, fs.max_purchases_per_user, fs.current_purchases,
         fs.is_active, fs.is_public, fs.requires_subscription, fs.view_count, 
         fs.conversion_rate, fs.total_revenue, fs.allow_sharing, fs.shareable_url,
         fs.tags, fs.thumbnail_url, fs.banner_url, fs.created_at, fs.updated_at;

-- Popular flash sale tags view
CREATE OR REPLACE VIEW flash_sale_popular_tags AS
SELECT 
  unnest(fs.tags) as tag,
  COUNT(*) as usage_count,
  AVG(fs.conversion_rate) as avg_conversion_rate,
  SUM(fs.total_revenue) as total_revenue,
  COUNT(DISTINCT fs.creator_id) as unique_creators
FROM 
  flash_sales fs
WHERE fs.is_active = true
GROUP BY unnest(fs.tags)
HAVING COUNT(*) > 1
ORDER BY usage_count DESC, total_revenue DESC;

-- ====================
-- CLEANUP INSTRUCTIONS
-- ====================

/*
To remove Flash Sales feature completely:

1. Disable the feature flag:
   ADDON_FLAGS.FLASH_SALES = false

2. Drop the tables (WARNING: This will delete all data):
   DROP VIEW IF EXISTS flash_sale_popular_tags;
   DROP VIEW IF EXISTS flash_sale_performance;
   DROP VIEW IF EXISTS flash_sale_creator_stats;
   
   DROP TRIGGER IF EXISTS validate_flash_sale_purchase_trigger ON flash_sale_purchases;
   DROP TRIGGER IF EXISTS validate_flash_sale_trigger ON flash_sales;
   DROP TRIGGER IF EXISTS update_flash_sale_analytics_updated_at ON flash_sale_analytics;
   DROP TRIGGER IF EXISTS update_flash_sale_purchases_updated_at ON flash_sale_purchases;
   DROP TRIGGER IF EXISTS update_flash_sales_updated_at ON flash_sales;
   
   DROP FUNCTION IF EXISTS validate_flash_sale_purchase() CASCADE;
   DROP FUNCTION IF EXISTS validate_flash_sale() CASCADE;
   DROP FUNCTION IF EXISTS update_flash_sales_updated_at_column() CASCADE;
   
   DROP TABLE IF EXISTS flash_sale_analytics;
   DROP TABLE IF EXISTS flash_sale_notifications;
   DROP TABLE IF EXISTS flash_sale_purchased_items;
   DROP TABLE IF EXISTS flash_sale_purchases;
   DROP TABLE IF EXISTS flash_sale_items;
   DROP TABLE IF EXISTS flash_sales;

3. Remove the addon files:
   rm -rf src/features/addons/flash-sales/

Note: Always backup your database before making destructive changes!
*/

-- ====================
-- PERFORMANCE NOTES
-- ====================

/*
For high-volume applications, consider:

1. Partitioning strategies:
   - Partition flash_sale_purchases by date (monthly/yearly)
   - Partition flash_sale_analytics by date
   - Archive ended sales to separate tables

2. Additional indexes for common queries:
   - Composite index on (creator_id, starts_at, ends_at) for creator dashboards
   - Composite index on (is_public, starts_at, ends_at) for public sale listings
   - Partial indexes on active sales with specific statuses

3. Caching strategies:
   - Cache active public sales in Redis/Memcached
   - Cache creator statistics with periodic refresh
   - Use CDN for sale images and static content

4. Real-time features:
   - Use Supabase realtime for purchase notifications
   - Implement sale countdown updates via WebSocket
   - Set up webhook endpoints for payment processing

5. Background job processing:
   - Schedule sale start/end notifications
   - Process expired sale cleanup
   - Generate daily analytics reports
   - Send reminder notifications

6. Monitoring and alerting:
   - Monitor sale conversion rates
   - Alert on failed payments
   - Track sale performance metrics
   - Monitor system load during high-traffic sales
*/