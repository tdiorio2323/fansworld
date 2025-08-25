import React, { useState } from 'react';
import { 
  Users, Star, DollarSign, TrendingUp, Award, Crown,
  Search, Filter, MoreVertical, CheckCircle, Ban, Eye,
  MessageSquare, Calendar, UserPlus, Settings, Download,
  Heart, Share2, Clock, Gift, Zap, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
  subscribers: number;
  earnings: number;
  content: number;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'suspended' | 'pending';
  region: string;
  engagement: number;
}

interface CreatorStats {
  totalCreators: number;
  activeCreators: number;
  verifiedCreators: number;
  pendingApprovals: number;
  totalEarnings: number;
  avgEarnings: number;
}

const CreatorManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  const stats: CreatorStats = {
    totalCreators: 1247,
    activeCreators: 1089,
    verifiedCreators: 456,
    pendingApprovals: 23,
    totalEarnings: 2456789,
    avgEarnings: 1970
  };

  const creators: Creator[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahc_exclusive',
      avatar: '/api/placeholder/64/64',
      verified: true,
      tier: 'diamond',
      subscribers: 45670,
      earnings: 125480,
      content: 342,
      joinDate: 'Jan 2024',
      lastActive: '2 hours ago',
      status: 'active',
      region: 'US',
      engagement: 94.2
    },
    {
      id: '2',
      name: 'Alex Rivera',
      username: '@alex_fitness',
      avatar: '/api/placeholder/64/64',
      verified: true,
      tier: 'platinum',
      subscribers: 32140,
      earnings: 89650,
      content: 198,
      joinDate: 'Mar 2024',
      lastActive: '1 hour ago',
      status: 'active',
      region: 'CA',
      engagement: 87.5
    },
    {
      id: '3',
      name: 'Maya Johnson',
      username: '@maya_art',
      avatar: '/api/placeholder/64/64',
      verified: false,
      tier: 'gold',
      subscribers: 18900,
      earnings: 34780,
      content: 156,
      joinDate: 'Apr 2024',
      lastActive: '3 days ago',
      status: 'pending',
      region: 'UK',
      engagement: 76.8
    },
    {
      id: '4',
      name: 'Jordan Smith',
      username: '@jordan_lifestyle',
      avatar: '/api/placeholder/64/64',
      verified: true,
      tier: 'platinum',
      subscribers: 28500,
      earnings: 67890,
      content: 243,
      joinDate: 'Feb 2024',
      lastActive: '5 hours ago',
      status: 'active',
      region: 'AU',
      engagement: 91.3
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'platinum':
        return 'bg-gray-300/20 text-gray-300 border-gray-300/30';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'silver':
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      case 'bronze':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return <Crown className="h-4 w-4" />;
      case 'platinum':
        return <Award className="h-4 w-4" />;
      case 'gold':
        return <Star className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'suspended':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const CreatorCard: React.FC<{ creator: Creator }> = ({ creator }) => (
    <Card className="card-glass border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-luxury">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/30">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback className="bg-gradient-luxury text-white font-bold text-lg">
                  {creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {creator.verified && (
                <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary text-white rounded-full p-1" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-foreground">{creator.name}</h3>
                <Badge className={getTierColor(creator.tier)}>
                  {getTierIcon(creator.tier)}
                  <span className="ml-1 capitalize">{creator.tier}</span>
                </Badge>
              </div>
              <p className="text-sm text-primary font-medium mb-1">{creator.username}</p>
              <p className="text-xs text-muted-foreground">
                Joined {creator.joinDate} • {creator.region}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(creator.status)}>
              {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism border-primary/20">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Creator
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-yellow-400">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Account
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Subs</span>
            </div>
            <div className="text-lg font-bold text-gradient">{formatNumber(creator.subscribers)}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Earnings</span>
            </div>
            <div className="text-lg font-bold text-gradient">{formatCurrency(creator.earnings)}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-muted-foreground">Content</span>
            </div>
            <div className="text-lg font-bold text-gradient">{creator.content}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Engagement</span>
            </div>
            <div className="text-lg font-bold text-gradient">{creator.engagement}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Active {creator.lastActive}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="btn-glass">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button size="sm" className="btn-luxury">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            Creator Management
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage and support your premium content creators
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Creator
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="card-glass border-2 hover:border-primary/30">
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gradient">{formatNumber(stats.totalCreators)}</div>
              <div className="text-xs text-muted-foreground">Total Creators</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-gradient">{formatNumber(stats.activeCreators)}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-blue-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-gradient">{formatNumber(stats.verifiedCreators)}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-gradient">{stats.pendingApprovals}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-gradient">{formatCurrency(stats.totalEarnings)}</div>
              <div className="text-xs text-muted-foreground">Total Earnings</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-purple-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-gradient">{formatCurrency(stats.avgEarnings)}</div>
              <div className="text-xs text-muted-foreground">Avg Earnings</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-glass border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-morphism border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-32 glass-morphism border-white/20">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-primary/20">
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 glass-morphism border-white/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-primary/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button className="btn-glass">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creator Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 glass-morphism border-white/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-luxury">
            All Creators
          </TabsTrigger>
          <TabsTrigger value="diamond" className="data-[state=active]:bg-gradient-luxury">
            Diamond
          </TabsTrigger>
          <TabsTrigger value="platinum" className="data-[state=active]:bg-gradient-luxury">
            Platinum
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-luxury">
            Pending ({stats.pendingApprovals})
          </TabsTrigger>
          <TabsTrigger value="top" className="data-[state=active]:bg-gradient-luxury">
            Top Earners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diamond" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creators
              .filter(creator => creator.tier === 'diamond')
              .map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="platinum" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creators
              .filter(creator => creator.tier === 'platinum')
              .map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creators
              .filter(creator => creator.status === 'pending')
              .map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creators
              .sort((a, b) => b.earnings - a.earnings)
              .map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorManagementPage;