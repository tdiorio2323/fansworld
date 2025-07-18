import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Gift, 
  Trophy,
  Share2,
  ChevronRight,
  Star,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ReferralNetworkView } from './ReferralNetworkView';
import { ReferralAnalyticsChart } from './ReferralAnalyticsChart';
import { ReferralCodeGenerator } from './ReferralCodeGenerator';
import { ReferralRewards } from './ReferralRewards';

export function ReferralDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    currentTier,
    tierInfo,
    allTiers,
    activeCampaigns,
    referralNetwork,
    networkGrowth,
    analytics,
    availableRewards,
    tierLoading
  } = useAdvancedReferral();

  const { referralStats, referralCodes } = useReferralProgram();

  // Calculate next tier progress
  const getNextTierProgress = () => {
    if (!currentTier || !allTiers || !referralStats) return null;
    
    const nextTier = allTiers.find(t => t.tier_level === (currentTier + 1));
    if (!nextTier) return null;

    const currentConversions = referralStats.successful_conversions || 0;
    const progress = (currentConversions / nextTier.min_conversions) * 100;

    return {
      nextTier,
      progress: Math.min(progress, 100),
      remaining: Math.max(nextTier.min_conversions - currentConversions, 0)
    };
  };

  const nextTierData = getNextTierProgress();

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">Tier {currentTier || 1}</div>
              {tierInfo && (
                <Badge variant="secondary" className="bg-primary/10">
                  {tierInfo.commission_rate}% Commission
                </Badge>
              )}
            </div>
            {tierInfo?.benefits && tierInfo.benefits.priority_support && (
              <p className="text-xs text-muted-foreground mt-1">Priority Support</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Size</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkGrowth.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              {networkGrowth.growth > 0 ? '+' : ''}{networkGrowth.growth}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(referralStats?.total_commission_earned || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(referralStats?.pending_commission || 0)} pending
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referralStats?.successful_conversions && referralStats?.total_referrals
                ? Math.round((referralStats.successful_conversions / referralStats.total_referrals) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {referralStats?.successful_conversions || 0} conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns && activeCampaigns.length > 0 && (
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Active Campaigns</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-primary/10">
                {activeCampaigns.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div>
                    <h4 className="font-medium">{campaign.campaign_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.base_commission_multiplier}x commission multiplier
                    </p>
                  </div>
                  <Badge variant="outline" className="border-primary/50">
                    {campaign.campaign_type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Tier Progress */}
      {nextTierData && (
        <Card className="glass-morphism">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Next Tier Progress</CardTitle>
                <CardDescription>
                  {nextTierData.remaining} more conversions to reach Tier {nextTierData.nextTier.tier_level}
                </CardDescription>
              </div>
              <Award className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={nextTierData.progress} className="h-3" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">Tier {nextTierData.nextTier.tier_level} Benefits:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• {nextTierData.nextTier.commission_rate}% commission rate</li>
                  {nextTierData.nextTier.benefits?.bonus_rate && (
                    <li>• {nextTierData.nextTier.benefits.bonus_rate}% bonus rate</li>
                  )}
                  {nextTierData.nextTier.benefits?.exclusive_campaigns && (
                    <li>• Access to exclusive campaigns</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="codes">Codes</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Referrals */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Your latest network additions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referralNetwork?.slice(0, 5).map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {referral.referee?.display_name || referral.referee?.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(referral.activation_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {referral.network_depth > 1 && (
                        <Badge variant="outline">Level {referral.network_depth}</Badge>
                      )}
                    </div>
                  ))}
                  {(!referralNetwork || referralNetwork.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No referrals yet. Share your code to get started!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tier Progression */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Tier Progression</CardTitle>
                <CardDescription>Your journey through the referral tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allTiers?.map((tier) => (
                    <div
                      key={tier.tier_level}
                      className={`p-3 rounded-lg border transition-colors ${
                        tier.tier_level === currentTier
                          ? 'border-primary bg-primary/5'
                          : tier.tier_level < (currentTier || 1)
                          ? 'border-border/50 bg-background/30'
                          : 'border-border/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            tier.tier_level <= (currentTier || 1)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {tier.tier_level <= (currentTier || 1) ? (
                              <Star className="h-4 w-4" />
                            ) : (
                              <span className="text-sm">{tier.tier_level}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Tier {tier.tier_level}</p>
                            <p className="text-sm text-muted-foreground">
                              {tier.commission_rate}% commission • {tier.min_conversions} conversions
                            </p>
                          </div>
                        </div>
                        {tier.tier_level === currentTier && (
                          <Badge className="bg-primary">Current</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <ReferralNetworkView network={referralNetwork || []} />
        </TabsContent>

        <TabsContent value="analytics">
          <ReferralAnalyticsChart analytics={analytics || []} />
        </TabsContent>

        <TabsContent value="codes">
          <ReferralCodeGenerator existingCodes={referralCodes || []} />
        </TabsContent>

        <TabsContent value="rewards">
          <ReferralRewards 
            availableRewards={availableRewards || []} 
            currentTier={currentTier || 1}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}