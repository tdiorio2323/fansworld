import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';
import { 
  Gift, 
  Trophy, 
  Star, 
  Lock, 
  CheckCircle,
  Sparkles,
  Zap,
  ShoppingBag,
  Percent
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  reward_type: 'badge' | 'feature_access' | 'discount' | 'physical_item' | 'custom';
  reward_value: Record<string, string | number | boolean>;
  min_conversions: number;
  required_tier: number;
  is_active: boolean;
  quantity_available: number;
}

interface ReferralRewardsProps {
  availableRewards: Reward[];
  currentTier: number;
}

export function ReferralRewards({ availableRewards, currentTier }: ReferralRewardsProps) {
  const { claimReward, claimedRewards } = useAdvancedReferral();
  const { referralStats } = useReferralProgram();

  const currentConversions = referralStats?.successful_conversions || 0;

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return Trophy;
      case 'feature_access':
        return Zap;
      case 'discount':
        return Percent;
      case 'physical_item':
        return ShoppingBag;
      default:
        return Gift;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'badge':
        return 'text-yellow-500';
      case 'feature_access':
        return 'text-purple-500';
      case 'discount':
        return 'text-green-500';
      case 'physical_item':
        return 'text-blue-500';
      default:
        return 'text-primary';
    }
  };

  const isRewardClaimed = (rewardId: string) => {
    return claimedRewards?.some(r => r.reward_id === rewardId);
  };

  const canClaimReward = (reward: Reward) => {
    return (
      reward.is_active &&
      currentTier >= reward.required_tier &&
      currentConversions >= reward.min_conversions &&
      reward.quantity_available !== 0 &&
      !isRewardClaimed(reward.id)
    );
  };

  const groupedRewards = availableRewards.reduce((acc, reward) => {
    const key = reward.required_tier;
    if (!acc[key]) acc[key] = [];
    acc[key].push(reward);
    return acc;
  }, {} as Record<number, Reward[]>);

  return (
    <div className="space-y-6">
      {/* Rewards Progress */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Track your journey to unlock rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Conversions</span>
              <span className="text-2xl font-bold">{currentConversions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Tier</span>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-xl font-bold">Tier {currentTier}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rewards Claimed</span>
              <span className="text-lg font-bold">{claimedRewards?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claimed Rewards */}
      {claimedRewards && claimedRewards.length > 0 && (
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle>Claimed Rewards</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimedRewards.map((claimed) => (
                <div
                  key={claimed.id}
                  className="p-4 rounded-lg bg-background/50 border border-green-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-background ${getRewardColor(claimed.reward.reward_type)}`}>
                      <Gift className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{claimed.reward.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {claimed.reward.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="border-green-500/50 text-green-500">
                          Claimed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(claimed.claimed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Rewards by Tier */}
      {Object.entries(groupedRewards)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([tier, rewards]) => (
          <Card key={tier} className={`glass-morphism ${
            Number(tier) > currentTier ? 'opacity-75' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Number(tier) <= currentTier ? (
                    <Sparkles className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle>Tier {tier} Rewards</CardTitle>
                </div>
                {Number(tier) > currentTier && (
                  <Badge variant="outline" className="border-muted">
                    Locked
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => {
                  const Icon = getRewardIcon(reward.reward_type);
                  const claimed = isRewardClaimed(reward.id);
                  const canClaim = canClaimReward(reward);
                  const progress = (currentConversions / reward.min_conversions) * 100;

                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        claimed
                          ? 'bg-background/30 border-green-500/20'
                          : canClaim
                          ? 'bg-background/50 border-primary/50 hover:border-primary'
                          : 'bg-background/20 border-border/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-background ${getRewardColor(reward.reward_type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {reward.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {currentConversions} / {reward.min_conversions} conversions
                              </span>
                              <span className="font-medium">
                                {Math.min(100, Math.round(progress))}%
                              </span>
                            </div>
                            <Progress value={Math.min(100, progress)} className="h-2" />
                          </div>

                          {reward.quantity_available > 0 && reward.quantity_available < 100 && (
                            <p className="text-xs text-orange-500">
                              Only {reward.quantity_available} left!
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            {claimed ? (
                              <Badge variant="outline" className="border-green-500/50 text-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Claimed
                              </Badge>
                            ) : canClaim ? (
                              <Button
                                size="sm"
                                onClick={() => claimReward.mutate(reward.id)}
                                disabled={claimReward.isPending}
                              >
                                {claimReward.isPending ? 'Claiming...' : 'Claim Reward'}
                              </Button>
                            ) : (
                              <Badge variant="outline" className="border-muted">
                                {Number(tier) > currentTier
                                  ? `Requires Tier ${tier}`
                                  : `${reward.min_conversions - currentConversions} more conversions`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

      {availableRewards.length === 0 && (
        <Card className="glass-morphism">
          <CardContent className="text-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No rewards available at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}