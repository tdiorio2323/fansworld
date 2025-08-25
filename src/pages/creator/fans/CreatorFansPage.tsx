import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Heart, MessageCircle, Gift, Crown, Star, Calendar, TrendingUp, Mail, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CreatorFansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const fans = [
    {
      id: 1,
      username: 'sarah_fan_23',
      displayName: 'Sarah M.',
      avatar: '/api/placeholder/40/40',
      tier: 'vip',
      totalSpent: 445.50,
      subscriptionStart: '2023-08-15',
      lastActive: '2 hours ago',
      messageCount: 47,
      likes: 156,
      tips: 12,
      isOnline: true,
      favoriteContent: 'fitness'
    },
    {
      id: 2,
      username: 'mike_supporter',
      displayName: 'Mike J.',
      avatar: '/api/placeholder/40/40',
      tier: 'premium',
      totalSpent: 289.75,
      subscriptionStart: '2023-09-22',
      lastActive: '1 day ago',
      messageCount: 23,
      likes: 89,
      tips: 8,
      isOnline: false,
      favoriteContent: 'lifestyle'
    },
    {
      id: 3,
      username: 'jenny_loves_art',
      displayName: 'Jennifer K.',
      avatar: '/api/placeholder/40/40',
      tier: 'standard',
      totalSpent: 89.99,
      subscriptionStart: '2023-11-05',
      lastActive: '3 hours ago',
      messageCount: 12,
      likes: 45,
      tips: 3,
      isOnline: true,
      favoriteContent: 'art'
    },
    {
      id: 4,
      username: 'alex_longtime_fan',
      displayName: 'Alex R.',
      avatar: '/api/placeholder/40/40',
      tier: 'vip',
      totalSpent: 678.25,
      subscriptionStart: '2023-03-10',
      lastActive: '5 minutes ago',
      messageCount: 89,
      likes: 234,
      tips: 25,
      isOnline: true,
      favoriteContent: 'exclusive'
    },
    {
      id: 5,
      username: 'lisa_photography',
      displayName: 'Lisa H.',
      avatar: '/api/placeholder/40/40',
      tier: 'premium',
      totalSpent: 156.50,
      subscriptionStart: '2023-10-12',
      lastActive: '6 hours ago',
      messageCount: 34,
      likes: 78,
      tips: 6,
      isOnline: false,
      favoriteContent: 'photography'
    },
    {
      id: 6,
      username: 'david_fitness_guy',
      displayName: 'David L.',
      avatar: '/api/placeholder/40/40',
      tier: 'standard',
      totalSpent: 45.99,
      subscriptionStart: '2024-01-08',
      lastActive: '2 days ago',
      messageCount: 8,
      likes: 22,
      tips: 1,
      isOnline: false,
      favoriteContent: 'fitness'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'premium': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'standard': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      case 'standard': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const filteredFans = fans.filter(fan => {
    const matchesSearch = fan.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fan.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'online') return matchesSearch && fan.isOnline;
    if (filterBy === 'tier') return matchesSearch && (fan.tier === 'vip' || fan.tier === 'premium');
    return matchesSearch && fan.tier === filterBy;
  });

  const sortedFans = [...filteredFans].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'spending': return b.totalSpent - a.totalSpent;
      case 'engagement': return (b.likes + b.messageCount) - (a.likes + a.messageCount);
      case 'joined': return new Date(a.subscriptionStart).getTime() - new Date(b.subscriptionStart).getTime();
      default: return 0;
    }
  });

  const totalFans = fans.length;
  const vipFans = fans.filter(f => f.tier === 'vip').length;
  const onlineFans = fans.filter(f => f.isOnline).length;
  const totalRevenue = fans.reduce((sum, fan) => sum + fan.totalSpent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Fan Management</h1>
            <p className="text-purple-200">Connect with and manage your fanbase</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Gift className="w-4 h-4 mr-2" />
              Send Rewards
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Fans</p>
                  <p className="text-2xl font-bold text-white">{totalFans.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">VIP Members</p>
                  <p className="text-2xl font-bold text-white">{vipFans}</p>
                </div>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Online Now</p>
                  <p className="text-2xl font-bold text-white">{onlineFans}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search fans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="all">All Fans</option>
                  <option value="online">Online</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="recent">Recent Activity</option>
                  <option value="spending">Top Spending</option>
                  <option value="engagement">Most Engaged</option>
                  <option value="joined">Date Joined</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fan List */}
        <div className="grid gap-4">
          {sortedFans.map((fan) => (
            <Card key={fan.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={fan.avatar}
                        alt={fan.displayName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      {fan.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white">{fan.displayName}</h3>
                        <Badge className={`${getTierColor(fan.tier)} border flex items-center space-x-1`}>
                          {getTierIcon(fan.tier)}
                          <span>{fan.tier.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <p className="text-purple-200 text-sm">@{fan.username}</p>
                      <p className="text-purple-300 text-xs mt-1">
                        Member since {new Date(fan.subscriptionStart).toLocaleDateString()} • Last active {fan.lastActive}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Stats */}
                    <div className="hidden lg:flex space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-white font-semibold">${fan.totalSpent.toFixed(0)}</p>
                        <p className="text-purple-200 text-xs">Spent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold">{fan.messageCount}</p>
                        <p className="text-purple-200 text-xs">Messages</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold">{fan.likes}</p>
                        <p className="text-purple-200 text-xs">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold">{fan.tips}</p>
                        <p className="text-purple-200 text-xs">Tips</p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Heart className="w-3 h-3 mr-1" />
                        Thank
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="lg:hidden mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-white font-semibold">${fan.totalSpent.toFixed(0)}</p>
                    <p className="text-purple-200 text-xs">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{fan.messageCount}</p>
                    <p className="text-purple-200 text-xs">Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{fan.likes}</p>
                    <p className="text-purple-200 text-xs">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{fan.tips}</p>
                    <p className="text-purple-200 text-xs">Tips</p>
                  </div>
                </div>

                {/* Favorite Content */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Favorite Content:</span>
                    <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                      {fan.favoriteContent}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedFans.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No fans found</h3>
              <p className="text-purple-200 mb-4">Try adjusting your search or filter criteria</p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite New Fans
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {sortedFans.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-purple-200 text-sm">
                  Showing {sortedFans.length} of {totalFans} fans
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" size="sm" disabled>
                    Previous
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                    1
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreatorFansPage;