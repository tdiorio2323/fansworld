import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { 
  stripeConnectService, 
  StripeConnectAccount, 
  StripeConnectOnboardingSession,
  CreatorEarnings,
  PayoutRequest,
  PayoutSchedule,
  CommissionTracking 
} from '@/lib/stripe-connect';

/**
 * Hook for managing Stripe Connect account
 */
export const useStripeConnect = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: connectAccount,
    isLoading: accountLoading,
    error: accountError
  } = useQuery({
    queryKey: ['stripe-connect-account', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await stripeConnectService.getConnectAccount(user.id);
    },
    enabled: !!user?.id,
  });

  const createConnectAccount = useMutation({
    mutationFn: async (accountData: {
      email: string;
      country: string;
      business_type?: string;
      individual?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        dob?: {
          day: number;
          month: number;
          year: number;
        };
        ssn_last_4?: string;
        address?: {
          line1: string;
          line2?: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
        };
      };
      business_profile?: {
        name?: string;
        url?: string;
        mcc?: string;
        product_description?: string;
      };
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await stripeConnectService.createConnectAccount(user.id, accountData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-connect-account'] });
    },
  });

  const createOnboardingSession = useMutation({
    mutationFn: async ({ 
      stripeAccountId, 
      returnUrl, 
      refreshUrl 
    }: {
      stripeAccountId: string;
      returnUrl: string;
      refreshUrl: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await stripeConnectService.createOnboardingSession(
        user.id,
        stripeAccountId,
        returnUrl,
        refreshUrl
      );
    },
  });

  return {
    connectAccount,
    accountLoading,
    accountError,
    createConnectAccount,
    createOnboardingSession,
    hasConnectAccount: !!connectAccount?.stripe_account_id,
    isOnboardingComplete: connectAccount?.onboarding_completed || false,
    isVerified: connectAccount?.verification_status === 'verified',
    canReceivePayouts: connectAccount?.payouts_enabled || false,
  };
};

/**
 * Hook for managing creator earnings
 */
export const useCreatorEarnings = (periodStart?: string, periodEnd?: string) => {
  const { user } = useAuth();

  const {
    data: earnings,
    isLoading: earningsLoading,
    error: earningsError
  } = useQuery({
    queryKey: ['creator-earnings', user?.id, periodStart, periodEnd],
    queryFn: async () => {
      if (!user?.id) return [];
      return await stripeConnectService.getCreatorEarnings(user.id, periodStart, periodEnd);
    },
    enabled: !!user?.id,
  });

  const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.gross_earnings, 0) || 0;
  const totalNet = earnings?.reduce((sum, earning) => sum + earning.net_earnings, 0) || 0;
  const totalCommissions = earnings?.reduce((sum, earning) => sum + earning.commission_amount, 0) || 0;
  const totalFees = earnings?.reduce((sum, earning) => sum + earning.management_fee, 0) || 0;
  const pendingPayouts = earnings?.filter(earning => earning.payout_status === 'pending') || [];

  return {
    earnings,
    earningsLoading,
    earningsError,
    totalEarnings,
    totalNet,
    totalCommissions,
    totalFees,
    pendingPayouts,
    hasPendingPayouts: pendingPayouts.length > 0,
  };
};

/**
 * Hook for managing payout requests
 */
export const usePayoutRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: payoutRequests,
    isLoading: requestsLoading,
    error: requestsError
  } = useQuery({
    queryKey: ['payout-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await stripeConnectService.getPayoutHistory(user.id);
    },
    enabled: !!user?.id,
  });

  const {
    data: pendingRequests,
    isLoading: pendingLoading,
    error: pendingError
  } = useQuery({
    queryKey: ['pending-payout-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await stripeConnectService.getPendingPayoutRequests(user.id);
    },
    enabled: !!user?.id,
  });

  const createPayoutRequest = useMutation({
    mutationFn: async ({
      earningsId,
      requestedAmount,
      requestType,
      notes
    }: {
      earningsId: string;
      requestedAmount: number;
      requestType?: 'automatic' | 'manual' | 'emergency';
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await stripeConnectService.createPayoutRequest(
        user.id,
        earningsId,
        requestedAmount,
        requestType,
        notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payout-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payout-requests'] });
    },
  });

  const processPayoutRequest = useMutation({
    mutationFn: async ({
      requestId,
      approved,
      rejectionReason
    }: {
      requestId: string;
      approved: boolean;
      rejectionReason?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await stripeConnectService.processPayoutRequest(
        requestId,
        user.id,
        approved,
        rejectionReason
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payout-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payout-requests'] });
    },
  });

  return {
    payoutRequests,
    requestsLoading,
    requestsError,
    pendingRequests,
    pendingLoading,
    pendingError,
    createPayoutRequest,
    processPayoutRequest,
    hasPendingRequests: (pendingRequests?.length || 0) > 0,
  };
};

/**
 * Hook for managing payout schedule
 */
export const usePayoutSchedule = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: payoutSchedule,
    isLoading: scheduleLoading,
    error: scheduleError
  } = useQuery({
    queryKey: ['payout-schedule', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await stripeConnectService.getPayoutSchedule(user.id);
    },
    enabled: !!user?.id,
  });

  const updatePayoutSchedule = useMutation({
    mutationFn: async (schedule: Partial<PayoutSchedule>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await stripeConnectService.updatePayoutSchedule(user.id, schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payout-schedule'] });
    },
  });

  return {
    payoutSchedule,
    scheduleLoading,
    scheduleError,
    updatePayoutSchedule,
    hasSchedule: !!payoutSchedule?.id,
  };
};

/**
 * Hook for managing commission tracking
 */
export const useCommissionTracking = (periodStart?: string, periodEnd?: string) => {
  const { user } = useAuth();

  const {
    data: commissionTracking,
    isLoading: commissionLoading,
    error: commissionError
  } = useQuery({
    queryKey: ['commission-tracking', user?.id, periodStart, periodEnd],
    queryFn: async () => {
      if (!user?.id) return [];
      return await stripeConnectService.getCommissionTracking(user.id, periodStart, periodEnd);
    },
    enabled: !!user?.id,
  });

  const totalCommissionEarned = commissionTracking?.reduce(
    (sum, tracking) => sum + tracking.agency_net_revenue, 0
  ) || 0;
  
  const totalCreatorPayouts = commissionTracking?.reduce(
    (sum, tracking) => sum + tracking.creator_net_payout, 0
  ) || 0;

  const averageCommissionRate = commissionTracking?.length 
    ? commissionTracking.reduce((sum, tracking) => sum + tracking.commission_rate, 0) / commissionTracking.length
    : 0;

  return {
    commissionTracking,
    commissionLoading,
    commissionError,
    totalCommissionEarned,
    totalCreatorPayouts,
    averageCommissionRate,
  };
};

/**
 * Hook for admin payout management
 */
export const useAdminPayouts = () => {
  const queryClient = useQueryClient();

  const {
    data: allPendingRequests,
    isLoading: allPendingLoading,
    error: allPendingError
  } = useQuery({
    queryKey: ['admin-pending-payouts'],
    queryFn: async () => {
      return await stripeConnectService.getPendingPayoutRequests();
    },
  });

  const processRequest = useMutation({
    mutationFn: async ({
      requestId,
      approved,
      rejectionReason,
      adminUserId
    }: {
      requestId: string;
      approved: boolean;
      rejectionReason?: string;
      adminUserId: string;
    }) => {
      return await stripeConnectService.processPayoutRequest(
        requestId,
        adminUserId,
        approved,
        rejectionReason
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-payouts'] });
    },
  });

  return {
    allPendingRequests,
    allPendingLoading,
    allPendingError,
    processRequest,
    totalPendingAmount: allPendingRequests?.reduce(
      (sum, request) => sum + request.requested_amount, 0
    ) || 0,
    pendingCount: allPendingRequests?.length || 0,
  };
};

/**
 * Utility hook for formatting currency
 */
export const useCurrencyFormatter = () => {
  const formatCurrency = (amountInCents: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amountInCents / 100);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  return {
    formatCurrency,
    formatPercentage,
  };
};

/**
 * Hook for getting payout status information
 */
export const usePayoutStatus = () => {
  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'processing': return 'outline';
      case 'completed': return 'default';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      case 'paid': return 'Paid';
      case 'failed': return 'Failed';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return {
    getStatusColor,
    getStatusText,
  };
};