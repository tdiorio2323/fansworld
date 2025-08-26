import React, { useState } from 'react';
import { Megaphone, TrendingUp, Target, Users, Calendar, DollarSign, Zap, BarChart3, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const MarketingCampaignsPage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const activeCampaigns = [
    {
      id: 1,
      name: 'Summer Creator Showcase',
      type: 'Seasonal',
      status: 'active',
      progress: 65,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      budget: 25000,
      spent: 16250,
      reach: 125000,
      conversions: 892,
      roi: '+215%'
    },
    {
      id: 2,
      name: 'New User Onboarding',
      type: 'Evergreen',
      status: 'active',
      progress: 100,
      startDate: '2024-01-01',
      endDate: 'Ongoing',
      budget: 10000,
      spent: 8900,
      reach: 45000,
      conversions: 523,
      roi: '+185%'
    },
    {
      id: 3,
      name: 'Premium Tier Launch',
      type: 'Product Launch',
      status: 'active',
      progress: 45,
      startDate: '2024-04-15',
      endDate: '2024-05-15',
      budget: 35000,
      spent: 15750,
      reach: 89000,
      conversions: 234,
      roi: '+92%'
    },
    {
      id: 4,
      name: 'Creator Referral Program',
      type: 'Referral',
      status: 'paused',
      progress: 78,
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      budget: 15000,
      spent: 11700,
      reach: 67000,
      conversions: 412,
      roi: '+167%'
    }
  ];

  const campaignPerformance = [
    { month: 'Jan', reach: 45000, conversions: 234, spend: 4500 },
    { month: 'Feb', reach: 52000, conversions: 289, spend: 5200 },
    { month: 'Mar', reach: 68000, conversions: 356, spend: 6100 },
    { month: 'Apr', reach: 89000, conversions: 523, spend: 7800 }
  ];

  const channelDistribution = [
    { channel: 'Social Media', value: 45, color: '#8B5CF6' },
    { channel: 'Email', value: 25, color: '#EC4899' },
    { channel: 'Paid Ads', value: 20, color: '#3B82F6' },
    { channel: 'Organic', value: 10, color: '#10B981' }
  ];

  const upcomingCampaigns = [
    { name: 'Fall Fashion Week', type: 'Seasonal', startDate: '2024-09-01', budget: 30000 },
    { name: 'Black Friday Special', type: 'Promotional', startDate: '2024-11-24', budget: 50000 },
    { name: 'Year-End Creator Awards', type: 'Event', startDate: '2024-12-15', budget: 40000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Marketing Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Plan, execute, and track marketing campaigns</p>
        </div>

        {/* Campaign Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-xs text-purple-500">3 launching soon</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                  <p className="text-2xl font-bold text-blue-600">2.3M</p>
                  <p className="text-xs text-blue-500">+18% this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-green-600">2,061</p>
                  <p className="text-xs text-green-500">+24% vs target</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average ROI</p>
                  <p className="text-2xl font-bold text-orange-600">+178%</p>
                  <p className="text-xs text-orange-500">Above industry avg</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Campaigns</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {campaign.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{campaign.startDate} - {campaign.endDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{campaign.roi}</p>
                          <p className="text-sm text-gray-500">ROI</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">${campaign.spent.toLocaleString()} spent</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="font-semibold">{(campaign.reach / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-green-500">+12% vs target</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{campaign.conversions}</p>
                          <p className="text-xs text-green-500">+8% vs target</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cost per Conversion</p>
                          <p className="font-semibold">${(campaign.spent / campaign.conversions).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Industry avg: $22.50</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Campaign Progress</span>
                          <span className="font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
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
                          Edit Campaign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Campaign Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={campaignPerformance}>
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
                    <Line type="monotone" dataKey="reach" stroke="#8B5CF6" strokeWidth={3} name="Reach" />
                    <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {channelDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.channel}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Top Performing Campaigns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeCampaigns.slice(0, 3).map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-600">{campaign.conversions} conversions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{campaign.roi}</p>
                        <p className="text-sm text-gray-500">ROI</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Campaigns</CardTitle>
                  <Button variant="outline" className="border-purple-200 text-purple-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingCampaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{campaign.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <span className="text-sm text-gray-500">Starts {campaign.startDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">${(campaign.budget / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-500">Budget</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Best Performing Channel</p>
                      <p className="text-2xl font-bold">Social Media</p>
                      <p className="text-purple-100 text-sm">45% of conversions</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Avg Cost per Acquisition</p>
                      <p className="text-2xl font-bold">$18.45</p>
                      <p className="text-blue-100 text-sm">-22% vs industry</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Campaign Success Rate</p>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-green-100 text-sm">Above 75% target</p>
                    </div>
                    <Target className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Monthly Campaign Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformance}>
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
                    <Bar dataKey="spend" fill="#8B5CF6" name="Spending ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingCampaignsPage;