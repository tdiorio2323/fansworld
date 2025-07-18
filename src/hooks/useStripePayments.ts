import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface StripeSubscription {
  id: string;
  user_id: string;
  contract_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  stripe_customer_id: string;
  type: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  contract_id?: string;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface StripeProduct {
  id: string;
  stripe_product_id: string;
  name: string;
  description?: string;
  package_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StripePrice {
  id: string;
  stripe_price_id: string;
  stripe_product_id: string;
  unit_amount: number;
  currency: string;
  interval_type: string;
  interval_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStripeCustomer = () => {
  const { user } = useAuth();

  const {
    data: customer,
    isLoading,
    error
  } = useQuery({
    queryKey: ['stripe-customer', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('stripe_customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as StripeCustomer | null;
    },
    enabled: !!user?.id,
  });

  return {
    customer,
    isLoading,
    error,
  };
};

export const useStripeSubscriptions = () => {
  const { user } = useAuth();

  const {
    data: subscriptions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['stripe-subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StripeSubscription[];
    },
    enabled: !!user?.id,
  });

  return {
    subscriptions,
    isLoading,
    error,
  };
};

export const usePaymentMethods = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: paymentMethods,
    isLoading,
    error
  } = useQuery({
    queryKey: ['payment-methods', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data as PaymentMethod[];
    },
    enabled: !!user?.id,
  });

  const setDefaultPaymentMethod = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // First, unset all other default payment methods
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the new default
      const { data, error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });

  const removePaymentMethod = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });

  return {
    paymentMethods,
    isLoading,
    error,
    setDefaultPaymentMethod,
    removePaymentMethod,
  };
};

export const usePaymentTransactions = () => {
  const { user } = useAuth();

  const {
    data: transactions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['payment-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PaymentTransaction[];
    },
    enabled: !!user?.id,
  });

  return {
    transactions,
    isLoading,
    error,
  };
};

export const useStripeProducts = () => {
  const {
    data: products,
    isLoading,
    error
  } = useQuery({
    queryKey: ['stripe-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_products')
        .select(`
          *,
          prices:stripe_prices(*)
        `)
        .eq('active', true)
        .order('package_type');

      if (error) throw error;
      return data;
    },
  });

  return {
    products,
    isLoading,
    error,
  };
};

// Mock Stripe functions - replace with actual Stripe API calls
export const useStripeActions = () => {
  const queryClient = useQueryClient();

  const createCheckoutSession = useMutation({
    mutationFn: async ({ priceId, successUrl, cancelUrl }: {
      priceId: string;
      successUrl: string;
      cancelUrl: string;
    }) => {
      // This would call your Stripe API endpoint
      // For now, returning a mock URL
      return {
        url: `https://checkout.stripe.com/pay/cs_mock_${priceId}#fidkdWxOYHwnPyd1blpxYHZxWjA0TVNgPGF8QkNiPUNfVmJkXFBra3JWZ2J1fnJKMn1kQ`
      };
    },
  });

  const createSetupIntent = useMutation({
    mutationFn: async () => {
      // This would create a Stripe SetupIntent for saving payment methods
      return {
        client_secret: 'seti_mock_client_secret',
        setup_intent_id: 'seti_mock_id'
      };
    },
  });

  const processPayment = useMutation({
    mutationFn: async ({ amount, paymentMethodId, description }: {
      amount: number;
      paymentMethodId: string;
      description: string;
    }) => {
      // This would create and confirm a PaymentIntent
      return {
        payment_intent_id: 'pi_mock_id',
        status: 'succeeded',
        amount: amount
      };
    },
  });

  return {
    createCheckoutSession,
    createSetupIntent,
    processPayment,
  };
};

// Commission and earnings functions
export const useCommissionPayments = () => {
  const { user } = useAuth();

  const {
    data: commissionPayments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['commission-payments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('commission_payments')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    commissionPayments,
    isLoading,
    error,
  };
};

// Admin functions for managing payments
export const useAdminPayments = () => {
  const queryClient = useQueryClient();

  const {
    data: allTransactions,
    isLoading: transactionsLoading
  } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          user:auth.users(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const {
    data: allSubscriptions,
    isLoading: subscriptionsLoading
  } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select(`
          *,
          user:auth.users(email),
          contract:creator_contracts(package_type, monthly_fee)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const processCommissionPayment = useMutation({
    mutationFn: async ({ creatorId, earningsId, amount }: {
      creatorId: string;
      earningsId: string;
      amount: number;
    }) => {
      // This would create a Stripe transfer to the creator's connected account
      const { data, error } = await supabase
        .from('commission_payments')
        .insert({
          creator_id: creatorId,
          earnings_period_id: earningsId,
          amount: amount,
          status: 'paid',
          stripe_transfer_id: `tr_mock_${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
    },
  });

  return {
    allTransactions,
    allSubscriptions,
    transactionsLoading,
    subscriptionsLoading,
    processCommissionPayment,
  };
};