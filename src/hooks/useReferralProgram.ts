import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Types
interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  commission_rate: number;
  commission_type: 'percentage' | 'fixed' | 'tiered';
  min_payout_amount: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ReferralCode {
  id: string;
  code: string;
  referrer_id: string;
  program_id: string;
  uses_remaining: number;
  total_uses: number;
  expires_at: string | null;
  active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface ReferralConversion {
  id: string;
  referral_code_id: string;
  referee_id: string;
  referrer_id: string;
  program_id: string;
  conversion_value: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  conversion_date: string;
  approval_date: string | null;
  payment_date: string | null;
  subscription_id: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ReferralPayout {
  id: string;
  referrer_id: string;
  program_id: string;
  total_amount: number;
  conversion_count: number;
  period_start: string;
  period_end: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_transfer_id: string | null;
  paid_at: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface ReferralStats {
  total_referrals: number;
  successful_conversions: number;
  pending_conversions: number;
  total_commission_earned: number;
  total_commission_paid: number;
  pending_commission: number;
}

// Hook to get all referral programs
export const useReferralPrograms = () => {
  return useQuery<ReferralProgram[]>({
    queryKey: ['referral-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_programs')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

// Hook to get user's referral codes
export const useUserReferralCodes = () => {
  const { user } = useAuth();

  return useQuery<ReferralCode[]>({
    queryKey: ['user-referral-codes', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook to get user's referral conversions
export const useUserReferralConversions = () => {
  const { user } = useAuth();

  return useQuery<ReferralConversion[]>({
    queryKey: ['user-referral-conversions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('referral_conversions')
        .select('*')
        .eq('referrer_id', user.id)
        .order('conversion_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook to get user's referral payouts
export const useUserReferralPayouts = () => {
  const { user } = useAuth();

  return useQuery<ReferralPayout[]>({
    queryKey: ['user-referral-payouts', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('referral_payouts')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook to get user's referral statistics
export const useUserReferralStats = () => {
  const { user } = useAuth();

  return useQuery<ReferralStats>({
    queryKey: ['user-referral-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_referral_stats', {
        user_id: user.id
      });

      if (error) throw error;
      return data || {
        total_referrals: 0,
        successful_conversions: 0,
        pending_conversions: 0,
        total_commission_earned: 0,
        total_commission_paid: 0,
        pending_commission: 0
      };
    },
    enabled: !!user?.id
  });
};

// Hook to create a referral code
export const useCreateReferralCode = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      programName = 'creator_referral', 
      codePrefix = 'CREATOR' 
    }: { 
      programName?: string; 
      codePrefix?: string; 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('create_user_referral_code', {
        user_id: user.id,
        program_name: programName,
        code_prefix: codePrefix
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-referral-codes'] });
    }
  });
};

// Hook to validate a referral code
export const useValidateReferralCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase
        .from('referral_codes')
        .select(`
          *,
          referral_programs (*)
        `)
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error) throw error;
      
      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Referral code has expired');
      }

      // Check if uses remaining
      if (data.uses_remaining === 0) {
        throw new Error('Referral code has no uses remaining');
      }

      return data;
    }
  });
};

// Hook to track a referral conversion
export const useTrackReferralConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referralCode,
      refereeUserId,
      conversionAmount
    }: {
      referralCode: string;
      refereeUserId: string;
      conversionAmount: number;
    }) => {
      const { data, error } = await supabase.rpc('track_referral_conversion', {
        referral_code: referralCode,
        referee_user_id: refereeUserId,
        conversion_amount: conversionAmount
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-referral-conversions'] });
      queryClient.invalidateQueries({ queryKey: ['user-referral-stats'] });
    }
  });
};

// Hook to update referral conversion status (admin only)
export const useUpdateReferralConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversionId,
      status,
      notes
    }: {
      conversionId: string;
      status: 'pending' | 'approved' | 'paid' | 'rejected';
      notes?: string;
    }) => {
      const updateData: any = { status };
      
      if (status === 'approved') {
        updateData.approval_date = new Date().toISOString();
      }
      
      if (status === 'paid') {
        updateData.payment_date = new Date().toISOString();
      }
      
      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('referral_conversions')
        .update(updateData)
        .eq('id', conversionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-referral-conversions'] });
      queryClient.invalidateQueries({ queryKey: ['user-referral-stats'] });
    }
  });
};

// Utility functions for formatting
export const formatCommissionAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100);
};

export const formatCommissionRate = (rate: number, type: string): string => {
  if (type === 'percentage') {
    return `${rate}%`;
  } else if (type === 'fixed') {
    return formatCommissionAmount(rate);
  }
  return String(rate);
};

export const getReferralCodeUrl = (code: string): string => {
  return `${window.location.origin}/register?ref=${code}`;
};

// Hook to get referral leaderboard (top referrers)
export const useReferralLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: ['referral-leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_conversions')
        .select(`
          referrer_id,
          count(*) as total_referrals,
          sum(commission_amount) as total_commission
        `)
        .eq('status', 'approved')
        .group('referrer_id')
        .order('total_commission', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }
  });
};