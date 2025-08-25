-- Stripe Payment Integration for TD Studios
-- This migration sets up secure payment processing and commission tracking

-- Ensure vault extension is enabled
CREATE EXTENSION IF NOT EXISTS "supabase_vault" SCHEMA vault;

-- Insert Stripe secret key into the vault (replace with your actual key)
INSERT INTO vault.secrets (name, secret)
VALUES ('stripe_secret_key', 'sk_test_your_stripe_secret_key_here')
ON CONFLICT (name) DO UPDATE 
SET secret = EXCLUDED.secret;

-- Create a function to retrieve the Stripe key securely
CREATE OR REPLACE FUNCTION get_stripe_secret_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stripe_key text;
BEGIN
    SELECT secret INTO stripe_key 
    FROM vault.secrets 
    WHERE name = 'stripe_secret_key';
    
    RETURN stripe_key;
END;
$$;

-- Stripe Customers Table
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stripe Subscriptions Table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES creator_contracts(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    type TEXT NOT NULL, -- card, bank_account, etc.
    brand TEXT, -- visa, mastercard, etc.
    last4 TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES creator_contracts(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_invoice_id TEXT,
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('management_fee', 'commission', 'refund', 'adjustment')),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Commission Payments Table
CREATE TABLE IF NOT EXISTS commission_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    earnings_period_id UUID REFERENCES creator_earnings(id) ON DELETE CASCADE,
    stripe_transfer_id TEXT UNIQUE,
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'reversed')),
    destination_account TEXT, -- Stripe Connect account ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stripe Products Table (for subscription plans)
CREATE TABLE IF NOT EXISTS stripe_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    package_type TEXT NOT NULL CHECK (package_type IN ('starter', 'premium', 'elite', 'custom')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stripe Prices Table (for subscription pricing)
CREATE TABLE IF NOT EXISTS stripe_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_price_id TEXT UNIQUE NOT NULL,
    stripe_product_id TEXT NOT NULL,
    unit_amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'usd',
    interval_type TEXT NOT NULL CHECK (interval_type IN ('month', 'year')),
    interval_count INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Webhook Events Table (for tracking Stripe webhooks)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_customers
CREATE POLICY "Users can view their own stripe customer data" ON stripe_customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stripe customer data" ON stripe_customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for stripe_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON stripe_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON stripe_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for payment_methods
CREATE POLICY "Users can manage their own payment methods" ON payment_methods
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment methods" ON payment_methods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view their own transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions" ON payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for commission_payments
CREATE POLICY "Creators can view their own commission payments" ON commission_payments
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all commission payments" ON commission_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for stripe_products and stripe_prices (public read, admin write)
CREATE POLICY "Anyone can view active products" ON stripe_products
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage products" ON stripe_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Anyone can view active prices" ON stripe_prices
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage prices" ON stripe_prices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- RLS Policies for stripe_webhook_events (admin only)
CREATE POLICY "Admins can manage webhook events" ON stripe_webhook_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_stripe_id ON stripe_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status ON stripe_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON payment_methods(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(is_default);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract_id ON payment_transactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_commission_payments_creator_id ON commission_payments(creator_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_status ON commission_payments(status);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed ON stripe_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type ON stripe_webhook_events(event_type);

-- Add updated_at triggers
CREATE TRIGGER update_stripe_customers_updated_at BEFORE UPDATE ON stripe_customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_subscriptions_updated_at BEFORE UPDATE ON stripe_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_payments_updated_at BEFORE UPDATE ON commission_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_products_updated_at BEFORE UPDATE ON stripe_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_prices_updated_at BEFORE UPDATE ON stripe_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default TD Studios subscription products
INSERT INTO stripe_products (stripe_product_id, name, description, package_type) VALUES
('prod_starter_tdstudios', 'TD Studios Starter Package', 'Perfect for emerging creators ready to scale', 'starter'),
('prod_premium_tdstudios', 'TD Studios Premium Package', 'For established creators seeking growth', 'premium'),
('prod_elite_tdstudios', 'TD Studios Elite Package', 'Complete business management for top creators', 'elite')
ON CONFLICT (stripe_product_id) DO NOTHING;

-- Insert default pricing (you'll need to create these in Stripe first)
INSERT INTO stripe_prices (stripe_price_id, stripe_product_id, unit_amount, interval_type) VALUES
('price_starter_monthly', 'prod_starter_tdstudios', 250000, 'month'), -- $2,500/month
('price_premium_monthly', 'prod_premium_tdstudios', 500000, 'month'), -- $5,000/month
('price_elite_monthly', 'prod_elite_tdstudios', 1000000, 'month') -- $10,000/month
ON CONFLICT (stripe_price_id) DO NOTHING;

-- Function to automatically create subscription when contract is approved
CREATE OR REPLACE FUNCTION create_subscription_on_contract_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when status changes to 'active'
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
        -- This would typically call a Stripe API function
        -- For now, we'll just create a placeholder record
        INSERT INTO stripe_subscriptions (
            user_id,
            contract_id,
            stripe_subscription_id,
            stripe_customer_id,
            status,
            current_period_start,
            current_period_end
        ) VALUES (
            NEW.creator_id,
            NEW.id,
            'sub_placeholder_' || NEW.id,
            'cus_placeholder_' || NEW.creator_id,
            'active',
            NEW.start_date,
            NEW.start_date + INTERVAL '1 month'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic subscription creation
CREATE TRIGGER create_subscription_on_approval
    AFTER UPDATE ON creator_contracts
    FOR EACH ROW
    EXECUTE FUNCTION create_subscription_on_contract_approval();

-- Function to calculate commission splits
CREATE OR REPLACE FUNCTION calculate_commission_split(
    gross_amount INTEGER,
    commission_rate DECIMAL(5,2),
    management_fee INTEGER
)
RETURNS TABLE(
    commission_amount INTEGER,
    creator_net INTEGER,
    agency_total INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT
        ROUND(gross_amount * (commission_rate / 100))::INTEGER as commission_amount,
        (gross_amount - ROUND(gross_amount * (commission_rate / 100))::INTEGER - management_fee)::INTEGER as creator_net,
        (ROUND(gross_amount * (commission_rate / 100))::INTEGER + management_fee)::INTEGER as agency_total;
END;
$$ language 'plpgsql';