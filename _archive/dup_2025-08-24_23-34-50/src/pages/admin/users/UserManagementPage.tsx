import React, { useState } from 'react';
import { 
  Users, Search, Filter, MoreVertical, Ban, Eye,
  UserPlus, Crown, CheckCircle, AlertTriangle, Clock,
  Mail, Phone, Globe, Calendar, Shield, Settings,
  Download, RefreshCw, Star, Award, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  tier: 'free' | 'premium' | 'vip' | 'diamond';
  joinDate: string;
  lastActive: string;
  totalSpent: number;
  region: string;
  verified: boolean;
  subscriptions: number;
}

const UserManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  const userStats = {
    totalUsers: 24567,
    activeUsers: 18450,
    premiumUsers: 8934,
    suspendedUsers: 234
  };

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'active',
      tier: 'premium',
      joinDate: 'Jan 2024',
      lastActive: '2 hours ago',
      totalSpent: 459.99,
      region: 'US',
      verified: true,
      subscriptions: 3
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'active',
      tier: 'vip',
      joinDate: 'Feb 2024',
      lastActive: '1 hour ago',
      totalSpent: 1299.99,
      region: 'UK',
      verified: true,
      subscriptions: 5
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: '/api/placeholder/40/40',
      status: 'suspended',
      tier: 'free',
      joinDate: 'Mar 2024',
      lastActive: '2 days ago',
      totalSpent: 0,
      region: 'CA',
      verified: false,
      subscriptions: 0
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'vip':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'premium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'free':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'suspended':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'banned':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <Card className="card-glass border-2 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/30">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-luxury text-white font-bold text-lg">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {user.verified && (
                <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary text-white rounded-full p-1" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-foreground">{user.name}</h3>
                <Badge className={getTierColor(user.tier)}>
                  {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
              <p className="text-xs text-muted-foreground">Joined {user.joinDate} • {user.region}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(user.status)}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="text-lg font-bold text-gradient">${user.totalSpent.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="text-lg font-bold text-gradient">{user.subscriptions}</div>
            <div className="text-xs text-muted-foreground">Subscriptions</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="text-lg font-bold text-gradient">{user.region}</div>
            <div className="text-xs text-muted-foreground">Region</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-glass border border-white/10">
            <div className="text-lg font-bold text-gradient">{user.lastActive}</div>
            <div className="text-xs text-muted-foreground">Last Active</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active {user.lastActive}</span>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            User Management
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage platform users and their account settings
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass border-2 hover:border-primary/30">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <div className="text-3xl font-bold text-gradient mb-2">
              {userStats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <div className="text-3xl font-bold text-gradient mb-2">
              {userStats.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <div className="text-3xl font-bold text-gradient mb-2">
              {userStats.premiumUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Premium Users</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-red-500/30">
          <CardContent className="p-6 text-center">
            <Ban className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <div className="text-3xl font-bold text-gradient mb-2">
              {userStats.suspendedUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Suspended</div>
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
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-morphism border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 glass-morphism border-white/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-primary/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
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

      {/* User Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 glass-morphism border-white/20">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="new">New Users</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.filter(u => u.tier === 'premium' || u.tier === 'vip' || u.tier === 'diamond').map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.filter(u => u.status === 'active').map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suspended" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.filter(u => u.status === 'suspended').map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">New User Onboarding</h3>
            <p className="text-muted-foreground mb-4">Welcome and onboard new platform members</p>
            <Button className="btn-luxury">
              <UserPlus className="mr-2 h-4 w-4" />
              View New Users
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;