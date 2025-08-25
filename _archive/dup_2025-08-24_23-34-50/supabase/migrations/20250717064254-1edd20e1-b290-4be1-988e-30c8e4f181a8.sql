-- Create function to update creator earnings
CREATE OR REPLACE FUNCTION update_creator_earnings(
  creator_id UUID,
  amount INTEGER,
  earning_type TEXT
) RETURNS VOID AS $$
BEGIN
  -- Insert or update creator earnings
  INSERT INTO creator_earnings (creator_id, total_earnings, subscription_earnings, tip_earnings, ppv_earnings)
  VALUES (
    creator_id,
    amount,
    CASE WHEN earning_type = 'subscription' THEN amount ELSE 0 END,
    CASE WHEN earning_type = 'tip' THEN amount ELSE 0 END,
    CASE WHEN earning_type = 'ppv' THEN amount ELSE 0 END
  )
  ON CONFLICT (creator_id) DO UPDATE SET
    total_earnings = creator_earnings.total_earnings + amount,
    subscription_earnings = creator_earnings.subscription_earnings + 
      CASE WHEN earning_type = 'subscription' THEN amount ELSE 0 END,
    tip_earnings = creator_earnings.tip_earnings + 
      CASE WHEN earning_type = 'tip' THEN amount ELSE 0 END,
    ppv_earnings = creator_earnings.ppv_earnings + 
      CASE WHEN earning_type = 'ppv' THEN amount ELSE 0 END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;