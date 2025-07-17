-- Add Stripe-related fields to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN amount INTEGER, -- Amount in cents
ADD COLUMN currency TEXT DEFAULT 'usd',
ADD COLUMN interval_type TEXT DEFAULT 'month'; -- month, year

-- Create transactions table for tips and pay-per-view purchases
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  creator_id UUID NOT NULL, 
  type TEXT NOT NULL, -- 'tip', 'ppv', 'subscription'
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  content_id UUID, -- For PPV purchases
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create creator_earnings table for tracking revenue
CREATE TABLE public.creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  total_earnings INTEGER DEFAULT 0, -- Total in cents
  subscription_earnings INTEGER DEFAULT 0,
  tip_earnings INTEGER DEFAULT 0,
  ppv_earnings INTEGER DEFAULT 0,
  last_payout_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add pricing fields to profiles for creators
ALTER TABLE public.profiles 
ADD COLUMN subscription_price INTEGER, -- Monthly price in cents
ADD COLUMN is_creator_verified BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

CREATE POLICY "Insert transactions" ON public.transactions
FOR INSERT WITH CHECK (true);

-- RLS Policies for creator_earnings  
CREATE POLICY "Creators can view their own earnings" ON public.creator_earnings
FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Update creator earnings" ON public.creator_earnings
FOR ALL USING (true);

-- Update triggers
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_earnings_updated_at
BEFORE UPDATE ON public.creator_earnings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();