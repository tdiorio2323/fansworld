import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Link2, Award, Gift, Target, BarChart3, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AffiliatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const topAffiliates = [
    {
      id: 1,
      name: 'Sarah Marketing Pro',
      tier: 'Platinum',
      conversions: 456,
      revenue: 45600,
      commissionRate: 25,
      commissionEarned: 11400,
      clicks: 12500,
      conversionRate: 3.65,
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Digital Growth Hub',
      tier: 'Gold',
      conversions: 234,
      revenue: 28900,
      commissionRate: 20,
      commissionEarned: 5780,
      clicks: 8900,
      conversionRate: 2.63,
      joinDate: '2024-02-03',
      status: 'active'
    },
    {
      id: 3,
      name: 'Content Creators Network',
      tier: 'Platinum',
      conversions: 389,
      revenue: 38900,
      commissionRate: 25,
      commissionEarned: 9725,
      clicks: 15600,
      conversionRate: 2.49,
      joinDate: '2024-01-28',
      status: 'active'
    },
    {
      id: 4,
      name: 'Social Media Masters',
      tier: 'Silver',
      conversions: 123,
      revenue: 14760,
      commissionRate: 15,
      commissionEarned: 2214,
      clicks: 5670,
      conversionRate: 2.17,
      joinDate: '2024-03-12',
      status: 'active'
    }
  ];

  const affiliatePerformance = [
    { month: 'Jan', affiliates: 45, conversions: 234, revenue: 23400 },
    { month: 'Feb', affiliates: 52, conversions: 289, revenue: 28900 },
    { month: 'Mar', affiliates: 61, conversions: 356, revenue: 35600 },
    { month: 'Apr', affiliates: 68, conversions: 423, revenue: 42300 }
  ];

  const tierDistribution = [
    { tier: 'Platinum', count: 12, color: '#8B5CF6' },
    { tier: 'Gold', count: 28, color: '#F59E0B' },
    { tier: 'Silver', count: 45, color: '#6B7280' },
    { tier: 'Bronze', count: 89, color: '#B45309' }
  ];

  const commissionTiers = [
    { tier: 'Bronze', requirement: '0-10 sales', rate: '10%', benefits: 'Basic tracking, Monthly payments' },
    { tier: 'Silver', requirement: '11-50 sales', rate: '15%', benefits: 'Priority support, Bi-weekly payments' },
    { tier: 'Gold', requirement: '51-200 sales', rate: '20%', benefits: 'Dedicated manager, Weekly payments' },
    { tier: 'Platinum', requirement: '200+ sales', rate: '25%', benefits: 'VIP support, Instant payments, Exclusive offers' }
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
            Affiliate Program
          </h1>
          <p className="text-gray-600 text-lg">Manage and grow your affiliate marketing network</p>
        </div>

        {/* Affiliate Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Affiliates</p>
                  <p className="text-2xl font-bold text-purple-600">174</p>
                  <p className="text-xs text-purple-500">+12 this month</p>
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
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">$130.6K</p>
                  <p className="text-xs text-green-500">+18% vs last month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-blue-600">1,202</p>
                  <p className="text-xs text-blue-500">2.8% avg rate</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Commissions Paid</p>
                  <p className="text-2xl font-bold text-orange-600">$29.1K</p>
                  <p className="text-xs text-orange-500">This month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="affiliates" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="affiliates">Top Affiliates</TabsTrigger>
            <TabsTrigger value="tiers">Commission Tiers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="affiliates" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Performing Affiliates</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search affiliates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Affiliate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAffiliates.map((affiliate) => (
                    <div key={affiliate.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{affiliate.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getTierColor(affiliate.tier)}>{affiliate.tier}</Badge>
                            <span className="text-sm text-gray-500">Joined {affiliate.joinDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${affiliate.commissionEarned.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Earned</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{affiliate.conversions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold">${affiliate.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="font-semibold">{affiliate.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conv. Rate</p>
                          <p className="font-semibold">{affiliate.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Commission</p>
                          <p className="font-semibold">{affiliate.commissionRate}%</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Pay Commission
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
                <CardTitle>Commission Tier Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {commissionTiers.map((tier, index) => (
                    <div key={index} className="p-6 bg-gray-50/70 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{tier.tier} Tier</h3>
                            <p className="text-sm text-gray-600">{tier.requirement}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{tier.rate}</p>
                          <p className="text-sm text-gray-500">Commission</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Benefits:</p>
                        <p className="text-sm text-gray-600">{tier.benefits}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={tierDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {tierDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {tierDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.tier}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count} affiliates</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Tier Upgrade Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50/70 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">8 affiliates</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Near upgrade</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Close to reaching next tier</p>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="p-4 bg-green-50/70 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">5 affiliates</span>
                      <Badge className="bg-green-100 text-green-800">Upgraded</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Upgraded this month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Affiliate Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={affiliatePerformance}>
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
                    <Line type="monotone" dataKey="affiliates" stroke="#8B5CF6" strokeWidth={3} name="Active Affiliates" />
                    <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Top Performer</p>
                      <p className="text-xl font-bold">Sarah Marketing Pro</p>
                      <p className="text-purple-100 text-sm">456 conversions</p>
                    </div>
                    <Award className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Avg Conversion Rate</p>
                      <p className="text-2xl font-bold">2.8%</p>
                      <p className="text-blue-100 text-sm">+0.3% this month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Revenue per Affiliate</p>
                      <p className="text-2xl font-bold">$750</p>
                      <p className="text-green-100 text-sm">Monthly average</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pending Payouts</CardTitle>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    Process All Payouts
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topAffiliates.map((affiliate) => (
                    <div key={affiliate.id} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{affiliate.name}</p>
                          <p className="text-sm text-gray-600">Commission earned this period</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${affiliate.commissionEarned.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Pending</p>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AffiliatesPage;