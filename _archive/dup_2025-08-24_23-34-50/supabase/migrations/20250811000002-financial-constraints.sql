-- Financial Constraints and Enhancements Migration
-- Adds security and data integrity improvements for financial data

-- Add fees_cents column to creator_earnings
ALTER TABLE creator_earnings 
ADD COLUMN IF NOT EXISTS fees_cents INTEGER NOT NULL DEFAULT 0;

-- Add non-negative constraints on financial columns
ALTER TABLE creator_earnings 
ADD CONSTRAINT check_gross_earnings_non_negative 
CHECK (gross_earnings >= 0);

ALTER TABLE creator_earnings 
ADD CONSTRAINT check_commission_amount_non_negative 
CHECK (commission_amount >= 0);

ALTER TABLE creator_earnings 
ADD CONSTRAINT check_management_fee_non_negative 
CHECK (management_fee >= 0);

ALTER TABLE creator_earnings 
ADD CONSTRAINT check_net_earnings_non_negative 
CHECK (net_earnings >= 0);

ALTER TABLE creator_earnings 
ADD CONSTRAINT check_fees_cents_non_negative 
CHECK (fees_cents >= 0);

-- Enforce net = gross - fees relationship
ALTER TABLE creator_earnings 
ADD CONSTRAINT check_net_equals_gross_minus_fees 
CHECK (net_earnings = gross_earnings - commission_amount - management_fee - fees_cents);

-- Add foreign key constraints for better data integrity
ALTER TABLE creator_earnings 
ADD CONSTRAINT fk_creator_earnings_creator_id 
FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE creator_earnings 
ADD CONSTRAINT fk_creator_earnings_contract_id 
FOREIGN KEY (contract_id) REFERENCES creator_contracts(id) ON DELETE CASCADE;

-- Add similar constraints to creator_contracts
ALTER TABLE creator_contracts 
ADD CONSTRAINT check_monthly_fee_non_negative 
CHECK (monthly_fee >= 0);

ALTER TABLE creator_contracts 
ADD CONSTRAINT check_commission_rate_valid 
CHECK (commission_rate >= 0 AND commission_rate <= 100);

-- Add constraint to agency_stats
ALTER TABLE agency_stats 
ADD CONSTRAINT check_total_revenue_non_negative 
CHECK (total_revenue >= 0);

ALTER TABLE agency_stats 
ADD CONSTRAINT check_total_creators_non_negative 
CHECK (total_creators >= 0);

ALTER TABLE agency_stats 
ADD CONSTRAINT check_total_applications_non_negative 
CHECK (total_applications >= 0);

-- Create a function to validate financial calculations
CREATE OR REPLACE FUNCTION validate_earnings_calculation()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure net earnings calculation is correct
    IF NEW.net_earnings != (NEW.gross_earnings - NEW.commission_amount - NEW.management_fee - NEW.fees_cents) THEN
        RAISE EXCEPTION 'Net earnings must equal gross earnings minus commission, management fee, and other fees';
    END IF;
    
    -- Ensure all values are non-negative
    IF NEW.gross_earnings < 0 OR NEW.commission_amount < 0 OR 
       NEW.management_fee < 0 OR NEW.net_earnings < 0 OR NEW.fees_cents < 0 THEN
        RAISE EXCEPTION 'All financial values must be non-negative';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for earnings validation
CREATE TRIGGER validate_earnings_calculation_trigger 
    BEFORE INSERT OR UPDATE ON creator_earnings
    FOR EACH ROW EXECUTE FUNCTION validate_earnings_calculation();

-- Add indexes for better performance on financial queries
CREATE INDEX IF NOT EXISTS idx_creator_earnings_gross_earnings ON creator_earnings(gross_earnings);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_net_earnings ON creator_earnings(net_earnings);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_fees ON creator_earnings(fees_cents);

-- Create a stored procedure for transactional financial updates
CREATE OR REPLACE FUNCTION update_creator_earnings_transactional(
    p_creator_id UUID,
    p_contract_id UUID,
    p_period_start DATE,
    p_period_end DATE,
    p_gross_earnings INTEGER,
    p_commission_amount INTEGER,
    p_management_fee INTEGER,
    p_fees_cents INTEGER,
    p_platform_earnings JSONB DEFAULT NULL,
    p_payment_status TEXT DEFAULT 'pending'
)
RETURNS UUID AS $$
DECLARE
    calculated_net INTEGER;
    earnings_id UUID;
BEGIN
    -- Calculate net earnings
    calculated_net := p_gross_earnings - p_commission_amount - p_management_fee - p_fees_cents;
    
    -- Validate that net is non-negative
    IF calculated_net < 0 THEN
        RAISE EXCEPTION 'Calculated net earnings cannot be negative. Gross: %, Commission: %, Management: %, Fees: %', 
            p_gross_earnings, p_commission_amount, p_management_fee, p_fees_cents;
    END IF;
    
    -- Insert or update earnings record
    INSERT INTO creator_earnings (
        creator_id, 
        contract_id, 
        period_start, 
        period_end, 
        gross_earnings, 
        commission_amount, 
        management_fee, 
        fees_cents,
        net_earnings, 
        platform_earnings, 
        payment_status
    ) VALUES (
        p_creator_id, 
        p_contract_id, 
        p_period_start, 
        p_period_end, 
        p_gross_earnings, 
        p_commission_amount, 
        p_management_fee, 
        p_fees_cents,
        calculated_net, 
        p_platform_earnings, 
        p_payment_status
    )
    ON CONFLICT (creator_id, period_start, period_end)
    DO UPDATE SET
        contract_id = EXCLUDED.contract_id,
        gross_earnings = EXCLUDED.gross_earnings,
        commission_amount = EXCLUDED.commission_amount,
        management_fee = EXCLUDED.management_fee,
        fees_cents = EXCLUDED.fees_cents,
        net_earnings = EXCLUDED.net_earnings,
        platform_earnings = EXCLUDED.platform_earnings,
        payment_status = EXCLUDED.payment_status,
        updated_at = TIMEZONE('utc'::text, NOW())
    RETURNING id INTO earnings_id;
    
    RETURN earnings_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION update_creator_earnings_transactional IS 
'Safely updates creator earnings with automatic net calculation and validation. All financial operations should use this function to ensure data integrity.';

-- Create audit log for financial changes
CREATE TABLE IF NOT EXISTS financial_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on audit log
ALTER TABLE financial_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view financial audit logs" ON financial_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create audit trigger function
CREATE OR REPLACE FUNCTION log_financial_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO financial_audit_log (
        table_name,
        record_id,
        operation,
        old_values,
        new_values,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to financial tables
CREATE TRIGGER creator_earnings_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON creator_earnings
    FOR EACH ROW EXECUTE FUNCTION log_financial_changes();

CREATE TRIGGER creator_contracts_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON creator_contracts
    FOR EACH ROW EXECUTE FUNCTION log_financial_changes();

-- Create index on audit log for performance
CREATE INDEX IF NOT EXISTS idx_financial_audit_log_table_record ON financial_audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_financial_audit_log_changed_at ON financial_audit_log(changed_at);