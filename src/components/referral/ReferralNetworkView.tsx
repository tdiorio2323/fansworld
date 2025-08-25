import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface NetworkMember {
  id: string;
  referee: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  network_depth: number;
  activation_date: string;
  is_active: boolean;
}

interface ReferralNetworkViewProps {
  network: NetworkMember[];
}

export function ReferralNetworkView({ network }: ReferralNetworkViewProps) {
  // Group network by depth level
  const networkByDepth = network.reduce((acc, member) => {
    const depth = member.network_depth || 1;
    if (!acc[depth]) acc[depth] = [];
    acc[depth].push(member);
    return acc;
  }, {} as Record<number, NetworkMember[]>);

  const getDepthLabel = (depth: number) => {
    switch (depth) {
      case 1:
        return 'Direct Referrals';
      case 2:
        return 'Second Level';
      case 3:
        return 'Third Level';
      default:
        return `Level ${depth}`;
    }
  };

  const getDepthColor = (depth: number) => {
    switch (depth) {
      case 1:
        return 'bg-primary';
      case 2:
        return 'bg-blue-500';
      case 3:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Network</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{network.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Depth</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...network.map(m => m.network_depth || 1), 1)} Levels
            </div>
            <p className="text-xs text-muted-foreground">Multi-tier network</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {network.filter(m => {
                const joinDate = new Date(m.activation_date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return joinDate >= thirtyDaysAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Tree View */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Network Structure</CardTitle>
          <CardDescription>Your multi-level referral network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(networkByDepth)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([depth, members]) => (
                <div key={depth} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${getDepthColor(Number(depth))}`} />
                    <h3 className="font-medium text-sm">
                      {getDepthLabel(Number(depth))}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {members.length} members
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.referee.avatar_url} />
                          <AvatarFallback>
                            {member.referee.display_name?.[0] || member.referee.username?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {member.referee.display_name || member.referee.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(member.activation_date).toLocaleDateString()}
                          </p>
                        </div>
                        {member.is_active ? (
                          <Badge variant="outline" className="border-green-500/50 text-green-500">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-muted">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            
            {network.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Your network is empty. Start sharing your referral code to grow!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}