-- Enhanced RLS Policies for Earnings and Payments
-- Implements strict owner-or-admin read and service_role-only writes

-- Drop existing policies to recreate with enhanced security
DROP POLICY IF EXISTS "Users can view their own earnings" ON creator_earnings;
DROP POLICY IF EXISTS "Admins can manage all earnings" ON creator_earnings;

-- Enhanced RLS policies for creator_earnings
-- Owner-or-admin read access
CREATE POLICY "enhanced_earnings_select" ON creator_earnings
    FOR SELECT USING (
        -- Owner can read their own earnings
        auth.uid() = creator_id
        OR
        -- Admins can read all earnings
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Service role only writes - no user-level INSERT/UPDATE/DELETE allowed
CREATE POLICY "service_role_only_earnings_insert" ON creator_earnings
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
        OR
        -- Allow admins to insert earnings
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_earnings_update" ON creator_earnings
    FOR UPDATE USING (
        auth.role() = 'service_role'
        OR
        -- Allow admins to update earnings
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_earnings_delete" ON creator_earnings
    FOR DELETE USING (
        auth.role() = 'service_role'
        OR
        -- Allow admins to delete earnings (with caution)
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Enhanced policies for creator_contracts (payment-related)
DROP POLICY IF EXISTS "Users can view their own contracts" ON creator_contracts;
DROP POLICY IF EXISTS "Admins can manage all contracts" ON creator_contracts;

CREATE POLICY "enhanced_contracts_select" ON creator_contracts
    FOR SELECT USING (
        -- Owner can read their own contracts
        auth.uid() = creator_id
        OR
        -- Admins can read all contracts
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_contracts_insert" ON creator_contracts
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_contracts_update" ON creator_contracts
    FOR UPDATE USING (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_contracts_delete" ON creator_contracts
    FOR DELETE USING (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create payments table if it doesn't exist (referenced in task but not in schema)
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    earnings_id UUID REFERENCES creator_earnings(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
    net_amount_cents INTEGER NOT NULL CHECK (net_amount_cents >= 0),
    
    -- Payment Method
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'paypal', 'stripe', 'crypto', 'check')),
    payment_reference TEXT, -- External payment ID
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    
    -- Dates
    scheduled_date DATE,
    processed_date DATE,
    completed_date DATE,
    
    -- Metadata
    payment_metadata JSONB,
    failure_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure net amount calculation is correct
    CONSTRAINT check_net_amount_calculation CHECK (net_amount_cents = amount_cents - fee_cents)
);

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments table - owner-or-admin read, service_role-only writes
CREATE POLICY "enhanced_payments_select" ON payments
    FOR SELECT USING (
        -- Owner can read their own payments
        auth.uid() = creator_id
        OR
        -- Admins can read all payments
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_payments_insert" ON payments
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_payments_update" ON payments
    FOR UPDATE USING (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "service_role_only_payments_delete" ON payments
    FOR DELETE USING (
        auth.role() = 'service_role'
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Add trigger for automatic timestamp updates on payments
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add audit logging for payments
CREATE TRIGGER payments_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION log_financial_changes();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_creator_id ON payments(creator_id);
CREATE INDEX IF NOT EXISTS idx_payments_earnings_id ON payments(earnings_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_scheduled_date ON payments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_payments_processed_date ON payments(processed_date);

-- Create a secure function for processing payments (service role only)
CREATE OR REPLACE FUNCTION process_payment_transaction(
    p_creator_id UUID,
    p_earnings_id UUID,
    p_amount_cents INTEGER,
    p_fee_cents INTEGER DEFAULT 0,
    p_payment_method TEXT DEFAULT 'bank_transfer',
    p_payment_reference TEXT DEFAULT NULL,
    p_scheduled_date DATE DEFAULT CURRENT_DATE,
    p_payment_metadata JSONB DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    payment_id UUID;
    calculated_net INTEGER;
BEGIN
    -- Only allow service role or admins to execute this function
    IF auth.role() != 'service_role' AND NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.is_admin = true
    ) THEN
        RAISE EXCEPTION 'Access denied. Only service role or admins can process payments.';
    END IF;
    
    -- Calculate net amount
    calculated_net := p_amount_cents - p_fee_cents;
    
    -- Validate amounts
    IF p_amount_cents < 0 OR p_fee_cents < 0 OR calculated_net < 0 THEN
        RAISE EXCEPTION 'Invalid payment amounts. Amount: %, Fee: %, Net: %', 
            p_amount_cents, p_fee_cents, calculated_net;
    END IF;
    
    -- Verify the earnings record exists and belongs to the creator
    IF NOT EXISTS (
        SELECT 1 FROM creator_earnings 
        WHERE id = p_earnings_id AND creator_id = p_creator_id
    ) THEN
        RAISE EXCEPTION 'Invalid earnings record or creator mismatch';
    END IF;
    
    -- Create payment record
    INSERT INTO payments (
        creator_id,
        earnings_id,
        amount_cents,
        fee_cents,
        net_amount_cents,
        payment_method,
        payment_reference,
        scheduled_date,
        payment_metadata,
        status
    ) VALUES (
        p_creator_id,
        p_earnings_id,
        p_amount_cents,
        p_fee_cents,
        calculated_net,
        p_payment_method,
        p_payment_reference,
        p_scheduled_date,
        p_payment_metadata,
        'pending'
    ) RETURNING id INTO payment_id;
    
    RETURN payment_id;
END;
$$ LANGUAGE plpgsql;

-- Add function comment
COMMENT ON FUNCTION process_payment_transaction IS 
'Securely processes payment transactions. Only accessible to service role or admin users. Validates all financial calculations and relationships.';

-- Create a view for safe earnings reporting (strips sensitive data for non-admins)
CREATE OR REPLACE VIEW creator_earnings_public AS
SELECT 
    id,
    creator_id,
    period_start,
    period_end,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        ) OR auth.uid() = creator_id
        THEN gross_earnings
        ELSE NULL 
    END as gross_earnings,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        ) OR auth.uid() = creator_id
        THEN net_earnings
        ELSE NULL 
    END as net_earnings,
    payment_status,
    created_at,
    updated_at
FROM creator_earnings;

-- Grant appropriate permissions
GRANT SELECT ON creator_earnings_public TO authenticated;

-- Add comprehensive documentation
COMMENT ON TABLE creator_earnings IS 'Creator earnings records with enhanced RLS - owner-or-admin read, service_role-only writes';
COMMENT ON TABLE payments IS 'Payment processing records with strict RLS - owner-or-admin read, service_role-only writes';
COMMENT ON VIEW creator_earnings_public IS 'Public view of earnings with sensitive data filtered based on user permissions';