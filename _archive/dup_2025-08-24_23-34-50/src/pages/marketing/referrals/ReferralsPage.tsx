import React, { useState } from 'react';
import { UserPlus, Share2, Gift, Award, TrendingUp, Users, DollarSign, Link2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ReferralsPage = () => {
  const topReferrers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c2f8b93e?w=150',
      referrals: 45,
      conversions: 28,
      conversionRate: 62.2,
      earnings: 2800,
      joinDate: '2024-01-15',
      tier: 'Gold'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      referrals: 34,
      conversions: 19,
      conversionRate: 55.9,
      earnings: 1900,
      joinDate: '2024-02-03',
      tier: 'Silver'
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      referrals: 52,
      conversions: 31,
      conversionRate: 59.6,
      earnings: 3100,
      joinDate: '2024-01-28',
      tier: 'Gold'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      referrals: 23,
      conversions: 12,
      conversionRate: 52.2,
      earnings: 1200,
      joinDate: '2024-03-12',
      tier: 'Bronze'
    }
  ];

  const referralTrends = [
    { month: 'Jan', referrals: 234, conversions: 145, earnings: 14500 },
    { month: 'Feb', referrals: 289, conversions: 178, earnings: 17800 },
    { month: 'Mar', referrals: 356, conversions: 201, earnings: 20100 },
    { month: 'Apr', referrals: 423, conversions: 267, earnings: 26700 }
  ];

  const referralSources = [
    { source: 'Social Media', count: 156, color: '#8B5CF6' },
    { source: 'Email', count: 89, color: '#EC4899' },
    { source: 'Direct Link', count: 67, color: '#3B82F6' },
    { source: 'Word of Mouth', count: 43, color: '#10B981' }
  ];

  const rewardTiers = [
    {
      tier: 'Bronze',
      requirement: '1-10 referrals',
      reward: '$5 per conversion',
      bonus: 'Welcome kit',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      tier: 'Silver',
      requirement: '11-25 referrals',
      reward: '$8 per conversion',
      bonus: 'Premium features',
      color: 'from-gray-500 to-gray-600'
    },
    {
      tier: 'Gold',
      requirement: '26-50 referrals',
      reward: '$12 per conversion',
      bonus: 'Priority support',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      tier: 'Platinum',
      requirement: '50+ referrals',
      reward: '$20 per conversion',
      bonus: 'VIP status',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Referral Program
          </h1>
          <p className="text-gray-600 text-lg">Grow your platform through word-of-mouth marketing</p>
        </div>

        {/* Referral Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Referrers</p>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-xs text-purple-500">+18 this week</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-blue-600">4,302</p>
                  <p className="text-xs text-blue-500">+12% this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-green-600">2,791</p>
                  <p className="text-xs text-green-500">64.9% rate</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rewards Paid</p>
                  <p className="text-2xl font-bold text-orange-600">$79.1K</p>
                  <p className="text-xs text-orange-500">This month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="referrers" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
            <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Program Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="referrers" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Performing Referrers</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Referrer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topReferrers.map((referrer) => (
                    <div key={referrer.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {referrer.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{referrer.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getTierColor(referrer.tier)}>{referrer.tier}</Badge>
                              <span className="text-sm text-gray-500">Joined {referrer.joinDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${referrer.earnings.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Total Earned</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Referrals</p>
                          <p className="font-semibold">{referrer.referrals}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{referrer.conversions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="font-semibold">{referrer.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Reward</p>
                          <p className="font-semibold">${(referrer.earnings / referrer.conversions).toFixed(0)}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tier Progress</span>
                          <span className="font-medium">{Math.min((referrer.referrals / 50) * 100, 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min((referrer.referrals / 50) * 100, 100)} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Pay Rewards
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Reward Tier Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewardTiers.map((tier, index) => (
                    <div key={index} className={`p-6 rounded-lg bg-gradient-to-r ${tier.color} text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl">{tier.tier} Tier</h3>
                            <p className="text-sm opacity-90">{tier.requirement}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm opacity-90">Reward per Conversion</p>
                          <p className="text-2xl font-bold">{tier.reward}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Special Bonus</p>
                          <p className="font-medium">{tier.bonus}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Referral Link Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Referral Campaign"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referrer ID</label>
                    <input
                      type="text"
                      placeholder="Enter referrer ID"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Link2 className="w-4 h-4 mr-2" />
                    Generate Link
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50/70 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-900">Bronze</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">892</span>
                        <span className="text-sm text-gray-500 block">referrers</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Silver</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-600">234</span>
                        <span className="text-sm text-gray-500 block">referrers</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50/70 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Gold</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-yellow-600">89</span>
                        <span className="text-sm text-gray-500 block">referrers</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50/70 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">Platinum</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600">32</span>
                        <span className="text-sm text-gray-500 block">referrers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Referral Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={referralTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="referrals" stroke="#8B5CF6" strokeWidth={3} name="Referrals" />
                    <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Referral Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={referralSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {referralSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {referralSources.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.source}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-900">Average Conversion Rate</p>
                      <p className="text-sm text-blue-700">Across all referrers</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">57.3%</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-900">Cost per Acquisition</p>
                      <p className="text-sm text-green-700">Via referral program</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">$28.35</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-purple-900">Lifetime Value</p>
                      <p className="text-sm text-purple-700">Referred customers</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">$284</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-orange-900">ROI</p>
                      <p className="text-sm text-orange-700">Return on referral investment</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">+342%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Program Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Reward Amount</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        defaultValue="10"
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">per conversion</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cookie Duration</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Allow Self-Referrals</p>
                      <p className="text-sm text-gray-600">Users can refer themselves with different emails</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Require Email Verification</p>
                      <p className="text-sm text-gray-600">New referrals must verify email before reward</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Auto-approve Rewards</p>
                      <p className="text-sm text-gray-600">Automatically approve and pay rewards</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                    </label>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralsPage;