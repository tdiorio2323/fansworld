import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Gift,
  Target,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  commission_rate: number;
  commission_type: string;
  min_payout_amount: number;
  active: boolean;
  has_tiers: boolean;
  network_depth_limit: number;
}

interface ReferralCampaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  start_date: string;
  end_date: string;
  base_commission_multiplier: number;
  budget_limit?: number;
  current_spend: number;
  is_active: boolean;
}

interface ReferralPayout {
  id: string;
  referrer_id: string;
  program_id: string;
  total_amount: number;
  conversion_count: number;
  period_start: string;
  period_end: string;
  status: string;
  referrer?: {
    username: string;
    email: string;
  };
}

export function ReferralManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('programs');
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  // Fetch referral programs
  const { data: programs = [] } = useQuery({
    queryKey: ['admin-referral-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReferralProgram[];
    }
  });

  // Fetch active campaigns
  const { data: campaigns = [] } = useQuery({
    queryKey: ['admin-referral-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReferralCampaign[];
    }
  });

  // Fetch pending payouts
  const { data: pendingPayouts = [] } = useQuery({
    queryKey: ['admin-referral-payouts', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_payouts')
        .select(`
          *,
          referrer:referrer_id (
            username,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (ReferralPayout & { referrer: { username: string; email: string } })[];
    }
  });

  // Get referral stats
  const { data: referralStats } = useQuery({
    queryKey: ['admin-referral-stats'],
    queryFn: async () => {
      const { data: conversions, error: convError } = await supabase
        .from('referral_conversions')
        .select('commission_amount, status, conversion_date');
      
      if (convError) throw convError;

      const totalCommission = conversions?.reduce((sum, c) => 
        c.status === 'paid' ? sum + c.commission_amount : sum, 0
      ) || 0;

      const pendingCommission = conversions?.reduce((sum, c) => 
        c.status === 'pending' || c.status === 'approved' ? sum + c.commission_amount : sum, 0
      ) || 0;

      const thisMonth = conversions?.filter(c => {
        const date = new Date(c.conversion_date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length || 0;

      return {
        totalCommission,
        pendingCommission,
        thisMonthConversions: thisMonth,
        totalConversions: conversions?.length || 0
      };
    }
  });

  // Process payouts mutation
  const processPayouts = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .rpc('process_monthly_referral_payouts');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-referral-payouts'] });
      toast.success(`Processed ${count} payouts successfully`);
    },
    onError: (error) => {
      toast.error('Failed to process payouts');
      console.error('Error processing payouts:', error);
    }
  });

  // Update payout status
  const updatePayoutStatus = useMutation({
    mutationFn: async ({ payoutId, status }: { payoutId: string; status: string }) => {
      const { error } = await supabase
        .from('referral_payouts')
        .update({ 
          status,
          paid_at: status === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', payoutId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-referral-payouts'] });
      toast.success('Payout status updated');
    },
    onError: (error) => {
      toast.error('Failed to update payout status');
      console.error('Error updating payout:', error);
    }
  });

  // Toggle program active status
  const toggleProgramStatus = useMutation({
    mutationFn: async ({ programId, active }: { programId: string; active: boolean }) => {
      const { error } = await supabase
        .from('referral_programs')
        .update({ active })
        .eq('id', programId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-referral-programs'] });
      toast.success('Program status updated');
    },
    onError: (error) => {
      toast.error('Failed to update program status');
      console.error('Error:', error);
    }
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats?.totalConversions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {referralStats?.thisMonthConversions || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(referralStats?.totalCommission || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(referralStats?.pendingCommission || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payout</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.filter(p => p.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.is_active).length} campaigns running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Referral Programs</CardTitle>
                  <CardDescription>Manage referral program settings and tiers</CardDescription>
                </div>
                <Button onClick={() => setShowProgramForm(!showProgramForm)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="p-4 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {program.name}
                          {program.active ? (
                            <Badge variant="outline" className="border-green-500/50 text-green-500">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted">
                              Inactive
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>
                            {program.commission_rate}% {program.commission_type}
                          </span>
                          <span>•</span>
                          <span>
                            Min payout: {formatCurrency(program.min_payout_amount)}
                          </span>
                          {program.has_tiers && (
                            <>
                              <span>•</span>
                              <span className="text-primary">Tiered program</span>
                            </>
                          )}
                          {program.network_depth_limit > 1 && (
                            <>
                              <span>•</span>
                              <span>{program.network_depth_limit} levels deep</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProgramStatus.mutate({
                            programId: program.id,
                            active: !program.active
                          })}
                        >
                          {program.active ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Referral Campaigns</CardTitle>
                  <CardDescription>Limited-time promotional campaigns</CardDescription>
                </div>
                <Button onClick={() => setShowCampaignForm(!showCampaignForm)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {campaign.campaign_name}
                          {campaign.is_active && new Date(campaign.end_date) > new Date() ? (
                            <Badge variant="outline" className="border-green-500/50 text-green-500">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted">
                              Ended
                            </Badge>
                          )}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{campaign.base_commission_multiplier}x multiplier</span>
                          {campaign.budget_limit && (
                            <>
                              <span>•</span>
                              <span>
                                Budget: {formatCurrency(campaign.current_spend)} / {formatCurrency(campaign.budget_limit)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Payouts</CardTitle>
                  <CardDescription>Review and process referral payouts</CardDescription>
                </div>
                <Button 
                  onClick={() => processPayouts.mutate()}
                  disabled={processPayouts.isPending}
                >
                  Process Monthly Payouts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-4 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {payout.referrer?.username || 'Unknown User'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {payout.referrer?.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-medium">
                            {formatCurrency(payout.total_amount)}
                          </span>
                          <span>•</span>
                          <span>{payout.conversion_count} conversions</span>
                          <span>•</span>
                          <span>
                            Period: {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePayoutStatus.mutate({
                            payoutId: payout.id,
                            status: 'paid'
                          })}
                        >
                          Mark as Paid
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updatePayoutStatus.mutate({
                            payoutId: payout.id,
                            status: 'failed'
                          })}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {pendingPayouts.length === 0 && (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending payouts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Referral Analytics</CardTitle>
              <CardDescription>Track referral program performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}