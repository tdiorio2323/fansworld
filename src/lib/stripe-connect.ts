import { supabase } from '@/integrations/supabase/client';

export interface StripeConnectAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  account_type: string;
  country: string;
  currency: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  onboarding_completed: boolean;
  verification_status: string;
  business_name?: string;
  business_url?: string;
  business_type?: string;
  individual_first_name?: string;
  individual_last_name?: string;
  individual_email?: string;
  individual_phone?: string;
  individual_dob?: string;
  individual_ssn_last4?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  address_country?: string;
  external_account_id?: string;
  external_account_type?: string;
  external_account_last4?: string;
  external_account_bank_name?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface StripeConnectOnboardingSession {
  id: string;
  user_id: string;
  stripe_account_id: string;
  session_url: string;
  return_url: string;
  refresh_url: string;
  expires_at: string;
  completed: boolean;
  created_at: string;
}

export interface CreatorEarnings {
  id: string;
  creator_id: string;
  contract_id: string;
  period_start: string;
  period_end: string;
  gross_earnings: number;
  management_fee: number;
  commission_amount: number;
  platform_fee: number;
  net_earnings: number;
  payout_status: string;
  scheduled_payout_date?: string;
  actual_payout_date?: string;
  stripe_transfer_id?: string;
  stripe_transfer_status?: string;
  stripe_connect_account_id?: string;
  earnings_breakdown?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayoutRequest {
  id: string;
  creator_id: string;
  earnings_id: string;
  requested_amount: number;
  request_type: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  processing_fee: number;
  net_payout_amount: number;
  stripe_transfer_id?: string;
  stripe_transfer_status?: string;
  failure_reason?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PayoutSchedule {
  id: string;
  creator_id: string;
  frequency: string;
  day_of_week?: number;
  day_of_month?: number;
  minimum_payout_amount: number;
  active: boolean;
  next_payout_date?: string;
  auto_payout: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommissionTracking {
  id: string;
  creator_id: string;
  contract_id: string;
  period_start: string;
  period_end: string;
  subscription_revenue: number;
  tip_revenue: number;
  ppv_revenue: number;
  brand_deal_revenue: number;
  other_revenue: number;
  total_gross_revenue: number;
  commission_rate: number;
  commission_amount: number;
  management_fee: number;
  processing_fee: number;
  creator_net_payout: number;
  agency_net_revenue: number;
  status: string;
  revenue_breakdown?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class StripeConnectService {
  private static instance: StripeConnectService;
  
  public static getInstance(): StripeConnectService {
    if (!StripeConnectService.instance) {
      StripeConnectService.instance = new StripeConnectService();
    }
    return StripeConnectService.instance;
  }

  /**
   * Create a new Stripe Connect account for a creator
   */
  async createConnectAccount(
    userId: string,
    accountData: {
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
    }
  ): Promise<StripeConnectAccount> {
    try {
      // Call Supabase Edge Function to create Stripe Connect account
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: {
          user_id: userId,
          account_data: accountData
        }
      });

      if (error) throw error;
      
      // Store the account in our database
      const { data: dbData, error: dbError } = await supabase
        .from('stripe_connect_accounts')
        .insert({
          user_id: userId,
          stripe_account_id: data.stripe_account_id,
          account_type: 'express',
          country: accountData.country,
          currency: 'usd',
          charges_enabled: data.charges_enabled || false,
          payouts_enabled: data.payouts_enabled || false,
          details_submitted: data.details_submitted || false,
          onboarding_completed: false,
          verification_status: 'pending',
          business_name: accountData.business_profile?.name,
          business_url: accountData.business_profile?.url,
          business_type: accountData.business_type,
          individual_first_name: accountData.individual?.first_name,
          individual_last_name: accountData.individual?.last_name,
          individual_email: accountData.individual?.email,
          individual_phone: accountData.individual?.phone,
          individual_dob: accountData.individual?.dob 
            ? `${accountData.individual.dob.year}-${accountData.individual.dob.month.toString().padStart(2, '0')}-${accountData.individual.dob.day.toString().padStart(2, '0')}`
            : null,
          individual_ssn_last4: accountData.individual?.ssn_last_4,
          address_line1: accountData.individual?.address?.line1,
          address_line2: accountData.individual?.address?.line2,
          address_city: accountData.individual?.address?.city,
          address_state: accountData.individual?.address?.state,
          address_postal_code: accountData.individual?.address?.postal_code,
          address_country: accountData.individual?.address?.country,
          metadata: {
            created_via: 'fansworld_platform',
            user_id: userId
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;
      
      return dbData as StripeConnectAccount;
    } catch (error) {
      console.error('Error creating Stripe Connect account:', error);
      throw error;
    }
  }

  /**
   * Create an onboarding session for a creator
   */
  async createOnboardingSession(
    userId: string,
    stripeAccountId: string,
    returnUrl: string,
    refreshUrl: string
  ): Promise<StripeConnectOnboardingSession> {
    try {
      // Call Supabase Edge Function to create onboarding session
      const { data, error } = await supabase.functions.invoke('create-onboarding-session', {
        body: {
          stripe_account_id: stripeAccountId,
          return_url: returnUrl,
          refresh_url: refreshUrl
        }
      });

      if (error) throw error;
      
      // Store the session in our database
      const { data: dbData, error: dbError } = await supabase
        .from('stripe_connect_onboarding_sessions')
        .insert({
          user_id: userId,
          stripe_account_id: stripeAccountId,
          session_url: data.url,
          return_url: returnUrl,
          refresh_url: refreshUrl,
          expires_at: data.expires_at,
          completed: false
        })
        .select()
        .single();

      if (dbError) throw dbError;
      
      return dbData as StripeConnectOnboardingSession;
    } catch (error) {
      console.error('Error creating onboarding session:', error);
      throw error;
    }
  }

  /**
   * Get creator's Connect account
   */
  async getConnectAccount(userId: string): Promise<StripeConnectAccount | null> {
    try {
      const { data, error } = await supabase
        .from('stripe_connect_accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data as StripeConnectAccount | null;
    } catch (error) {
      console.error('Error getting Connect account:', error);
      throw error;
    }
  }

  /**
   * Update Connect account status (usually called from webhooks)
   */
  async updateConnectAccountStatus(
    stripeAccountId: string,
    updates: Partial<StripeConnectAccount>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('stripe_connect_accounts')
        .update(updates)
        .eq('stripe_account_id', stripeAccountId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating Connect account status:', error);
      throw error;
    }
  }

  /**
   * Get creator's earnings for a specific period
   */
  async getCreatorEarnings(
    creatorId: string,
    periodStart?: string,
    periodEnd?: string
  ): Promise<CreatorEarnings[]> {
    try {
      let query = supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', creatorId)
        .order('period_start', { ascending: false });

      if (periodStart) {
        query = query.gte('period_start', periodStart);
      }
      
      if (periodEnd) {
        query = query.lte('period_end', periodEnd);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as CreatorEarnings[];
    } catch (error) {
      console.error('Error getting creator earnings:', error);
      throw error;
    }
  }

  /**
   * Create a payout request
   */
  async createPayoutRequest(
    creatorId: string,
    earningsId: string,
    requestedAmount: number,
    requestType: 'automatic' | 'manual' | 'emergency' = 'manual',
    notes?: string
  ): Promise<PayoutRequest> {
    try {
      const processingFee = this.calculateProcessingFee(requestedAmount);
      const netPayoutAmount = requestedAmount - processingFee;

      const { data, error } = await supabase
        .from('payout_requests')
        .insert({
          creator_id: creatorId,
          earnings_id: earningsId,
          requested_amount: requestedAmount,
          request_type: requestType,
          status: 'pending',
          processing_fee: processingFee,
          net_payout_amount: netPayoutAmount,
          notes: notes
        })
        .select()
        .single();

      if (error) throw error;
      
      return data as PayoutRequest;
    } catch (error) {
      console.error('Error creating payout request:', error);
      throw error;
    }
  }

  /**
   * Process a payout request (admin function)
   */
  async processPayoutRequest(
    requestId: string,
    approvedBy: string,
    approved: boolean,
    rejectionReason?: string
  ): Promise<PayoutRequest> {
    try {
      if (!approved) {
        const { data, error } = await supabase
          .from('payout_requests')
          .update({
            status: 'rejected',
            approved_by: approvedBy,
            approved_at: new Date().toISOString(),
            rejection_reason: rejectionReason
          })
          .eq('id', requestId)
          .select()
          .single();

        if (error) throw error;
        return data as PayoutRequest;
      }

      // If approved, update status and process transfer
      const { data: request, error: requestError } = await supabase
        .from('payout_requests')
        .update({
          status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (requestError) throw requestError;

      // Get creator's Connect account
      const connectAccount = await this.getConnectAccount(request.creator_id);
      if (!connectAccount) {
        throw new Error('Creator does not have a Connect account');
      }

      // Create Stripe transfer
      const transferResult = await this.createStripeTransfer(
        connectAccount.stripe_account_id,
        request.net_payout_amount,
        `Payout for earnings period - Request ${requestId}`
      );

      // Update request with transfer information
      const { data: updatedRequest, error: updateError } = await supabase
        .from('payout_requests')
        .update({
          status: 'processing',
          stripe_transfer_id: transferResult.transfer_id,
          stripe_transfer_status: transferResult.status
        })
        .eq('id', requestId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      return updatedRequest as PayoutRequest;
    } catch (error) {
      console.error('Error processing payout request:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe transfer to creator's Connect account
   */
  private async createStripeTransfer(
    destinationAccountId: string,
    amount: number,
    description: string
  ): Promise<{ transfer_id: string; status: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-transfer', {
        body: {
          destination_account_id: destinationAccountId,
          amount: amount,
          description: description
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating Stripe transfer:', error);
      throw error;
    }
  }

  /**
   * Calculate processing fee for payout
   */
  private calculateProcessingFee(amount: number): number {
    // Standard processing fee: 2.9% + $0.30
    return Math.round(amount * 0.029 + 30);
  }

  /**
   * Get payout schedule for creator
   */
  async getPayoutSchedule(creatorId: string): Promise<PayoutSchedule | null> {
    try {
      const { data, error } = await supabase
        .from('payout_schedules')
        .select('*')
        .eq('creator_id', creatorId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data as PayoutSchedule | null;
    } catch (error) {
      console.error('Error getting payout schedule:', error);
      throw error;
    }
  }

  /**
   * Update payout schedule
   */
  async updatePayoutSchedule(
    creatorId: string,
    schedule: Partial<PayoutSchedule>
  ): Promise<PayoutSchedule> {
    try {
      const { data, error } = await supabase
        .from('payout_schedules')
        .update(schedule)
        .eq('creator_id', creatorId)
        .select()
        .single();

      if (error) throw error;
      
      return data as PayoutSchedule;
    } catch (error) {
      console.error('Error updating payout schedule:', error);
      throw error;
    }
  }

  /**
   * Get commission tracking for creator
   */
  async getCommissionTracking(
    creatorId: string,
    periodStart?: string,
    periodEnd?: string
  ): Promise<CommissionTracking[]> {
    try {
      let query = supabase
        .from('commission_tracking')
        .select('*')
        .eq('creator_id', creatorId)
        .order('period_start', { ascending: false });

      if (periodStart) {
        query = query.gte('period_start', periodStart);
      }
      
      if (periodEnd) {
        query = query.lte('period_end', periodEnd);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as CommissionTracking[];
    } catch (error) {
      console.error('Error getting commission tracking:', error);
      throw error;
    }
  }

  /**
   * Get pending payout requests
   */
  async getPendingPayoutRequests(creatorId?: string): Promise<PayoutRequest[]> {
    try {
      let query = supabase
        .from('payout_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (creatorId) {
        query = query.eq('creator_id', creatorId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as PayoutRequest[];
    } catch (error) {
      console.error('Error getting pending payout requests:', error);
      throw error;
    }
  }

  /**
   * Get creator's payout history
   */
  async getPayoutHistory(creatorId: string): Promise<PayoutRequest[]> {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as PayoutRequest[];
    } catch (error) {
      console.error('Error getting payout history:', error);
      throw error;
    }
  }
}

export const stripeConnectService = StripeConnectService.getInstance();