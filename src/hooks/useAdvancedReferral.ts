import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ReferralTier {
  tier_level: number;
  commission_rate: number;
  min_conversions: number;
  min_revenue: number;
  benefits: Record<string, string | number | boolean>;
}

interface ReferralCampaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  start_date: string;
  end_date: string;
  base_commission_multiplier: number;
  milestone_bonuses: { conversions: number; bonus: number }[];
  is_active: boolean;
}

interface ReferralAnalytics {
  period_type: string;
  period_start: string;
  period_end: string;
  total_clicks: number;
  conversions: number;
  conversion_rate: number;
  gross_revenue: number;
  commission_earned: number;
  network_growth_rate: number;
}

interface ReferralNetwork {
  referee_id: string;
  referee_name: string;
  network_depth: number;
  activation_date: string;
  total_conversions: number;
  total_revenue: number;
}

interface ReferralReward {
  id: string;
  name: string;
  description: string;
  reward_type: string;
  reward_value: Record<string, string | number | boolean>;
  min_conversions: number;
  required_tier: number;
  is_active: boolean;
  quantity_available: number;
}

export function useAdvancedReferral() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's current referral tier
  const { data: currentTier, isLoading: tierLoading } = useQuery({
    queryKey: ['referral-tier', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: program } = await supabase
        .from('referral_programs')
        .select('id')
        .eq('name', 'creator_referral')
        .single();

      if (!program) return null;

      const { data, error } = await supabase
        .rpc('calculate_user_referral_tier', {
          p_user_id: user.id,
          p_program_id: program.id
        });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Get tier information
  const { data: tierInfo, isLoading: tierInfoLoading } = useQuery({
    queryKey: ['referral-tier-info', currentTier],
    queryFn: async () => {
      if (!currentTier) return null;

      const { data: program } = await supabase
        .from('referral_programs')
        .select('id')
        .eq('name', 'creator_referral')
        .single();

      if (!program) return null;

      const { data, error } = await supabase
        .from('referral_tiers')
        .select('*')
        .eq('program_id', program.id)
        .eq('tier_level', currentTier)
        .single();

      if (error) throw error;
      return data as ReferralTier;
    },
    enabled: !!currentTier
  });

  // Get all tiers for progression display
  const { data: allTiers } = useQuery({
    queryKey: ['referral-all-tiers'],
    queryFn: async () => {
      const { data: program } = await supabase
        .from('referral_programs')
        .select('id')
        .eq('name', 'creator_referral')
        .single();

      if (!program) return [];

      const { data, error } = await supabase
        .from('referral_tiers')
        .select('*')
        .eq('program_id', program.id)
        .order('tier_level', { ascending: true });

      if (error) throw error;
      return data as ReferralTier[];
    }
  });

  // Get active campaigns
  const { data: activeCampaigns } = useQuery({
    queryKey: ['referral-campaigns', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_campaigns')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReferralCampaign[];
    }
  });

  // Get user's referral network
  const { data: referralNetwork } = useQuery({
    queryKey: ['referral-network', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('referral_network')
        .select(`
          *,
          referee:referee_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('referrer_id', user.id)
        .eq('is_active', true)
        .order('activation_date', { ascending: false });

      if (error) throw error;
      return data as (ReferralNetwork & {
        referee: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string;
        };
      })[];
    },
    enabled: !!user
  });

  // Get referral analytics
  const { data: analytics } = useQuery({
    queryKey: ['referral-analytics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('referral_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as ReferralAnalytics[];
    },
    enabled: !!user
  });

  // Get available rewards
  const { data: availableRewards } = useQuery({
    queryKey: ['referral-rewards', currentTier],
    queryFn: async () => {
      if (!currentTier) return [];

      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('is_active', true)
        .lte('required_tier', currentTier)
        .gt('quantity_available', 0);

      if (error) throw error;
      return data as ReferralReward[];
    },
    enabled: !!currentTier
  });

  // Get user's claimed rewards
  const { data: claimedRewards } = useQuery({
    queryKey: ['user-referral-rewards', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_referral_rewards')
        .select(`
          *,
          reward:reward_id (
            id,
            name,
            description,
            reward_type,
            reward_value
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as {
        id: string;
        user_id: string;
        reward_id: string;
        claimed_at: string;
        expires_at?: string;
        used_at?: string;
        status: string;
        reward: {
          id: string;
          name: string;
          description: string;
          reward_type: string;
          reward_value: Record<string, string | number | boolean>;
        };
      }[];
    },
    enabled: !!user
  });

  // Generate custom referral code
  const generateCustomCode = useMutation({
    mutationFn: async ({ prefix, message, landingPage }: {
      prefix?: string;
      message?: string;
      landingPage?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: program } = await supabase
        .from('referral_programs')
        .select('id')
        .eq('name', 'creator_referral')
        .single();

      if (!program) throw new Error('Program not found');

      // Generate unique code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_referral_code', { prefix: prefix || 'CUSTOM' });

      if (codeError) throw codeError;

      // Create the referral code
      const { data, error } = await supabase
        .from('referral_codes')
        .insert({
          code: codeData,
          referrer_id: user.id,
          program_id: program.id,
          custom_message: message,
          landing_page_url: landingPage,
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-codes'] });
      toast.success('Custom referral code created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create referral code');
      console.error('Error creating referral code:', error);
    }
  });

  // Claim reward
  const claimReward = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_referral_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-referral-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      toast.success('Reward claimed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to claim reward');
      console.error('Error claiming reward:', error);
    }
  });

  // Get network growth stats
  const getNetworkGrowth = () => {
    if (!referralNetwork) return { total: 0, thisMonth: 0, growth: 0 };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthReferrals = referralNetwork.filter(ref => 
      new Date(ref.activation_date) >= startOfMonth
    ).length;

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const lastMonthReferrals = referralNetwork.filter(ref => {
      const date = new Date(ref.activation_date);
      return date >= lastMonth && date <= lastMonthEnd;
    }).length;

    const growth = lastMonthReferrals > 0 
      ? ((thisMonthReferrals - lastMonthReferrals) / lastMonthReferrals) * 100 
      : 0;

    return {
      total: referralNetwork.length,
      thisMonth: thisMonthReferrals,
      growth: Math.round(growth)
    };
  };

  return {
    // Tier data
    currentTier,
    tierInfo,
    allTiers,
    tierLoading: tierLoading || tierInfoLoading,

    // Campaign data
    activeCampaigns,

    // Network data
    referralNetwork,
    networkGrowth: getNetworkGrowth(),

    // Analytics
    analytics,

    // Rewards
    availableRewards,
    claimedRewards,

    // Actions
    generateCustomCode,
    claimReward
  };
}