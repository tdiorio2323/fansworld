import React, { useState } from 'react';
import { Palette, Eye, TrendingUp, Users, Heart, Share2, Award, Target, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const BrandCampaignsPage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('brand-awareness');

  const brandCampaigns = [
    {
      id: 1,
      name: 'Summer Brand Awareness 2024',
      type: 'Brand Awareness',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      budget: 75000,
      spent: 42500,
      reach: 2340000,
      impressions: 8900000,
      engagement: 156000,
      brandLift: 23,
      objectives: ['Increase brand awareness', 'Drive engagement', 'Expand reach']
    },
    {
      id: 2,
      name: 'Creator Spotlight Campaign',
      type: 'Creator Focus',
      status: 'active',
      startDate: '2024-05-15',
      endDate: '2024-07-15',
      budget: 50000,
      spent: 35000,
      reach: 1890000,
      impressions: 5600000,
      engagement: 234000,
      brandLift: 18,
      objectives: ['Showcase creators', 'Build community', 'Generate UGC']
    },
    {
      id: 3,
      name: 'Platform Values Initiative',
      type: 'Brand Values',
      status: 'planning',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      budget: 60000,
      spent: 0,
      reach: 0,
      impressions: 0,
      engagement: 0,
      brandLift: 0,
      objectives: ['Communicate values', 'Build trust', 'Social responsibility']
    }
  ];

  const brandMetrics = [
    { month: 'Jan', awareness: 45, consideration: 32, preference: 28, loyalty: 25 },
    { month: 'Feb', awareness: 48, consideration: 35, preference: 31, loyalty: 27 },
    { month: 'Mar', awareness: 52, consideration: 38, preference: 33, loyalty: 29 },
    { month: 'Apr', awareness: 58, consideration: 42, preference: 37, loyalty: 32 },
    { month: 'May', awareness: 63, consideration: 46, preference: 40, loyalty: 35 },
    { month: 'Jun', awareness: 67, consideration: 49, preference: 43, loyalty: 38 }
  ];

  const channelPerformance = [
    { channel: 'Social Media', reach: 1200000, engagement: 89000, cost: 25000 },
    { channel: 'Influencer', reach: 890000, engagement: 67000, cost: 32000 },
    { channel: 'Display Ads', reach: 2100000, engagement: 45000, cost: 18000 },
    { channel: 'Video Content', reach: 560000, engagement: 78000, cost: 15000 }
  ];

  const brandSentiment = [
    { sentiment: 'Very Positive', value: 35, color: '#10B981' },
    { sentiment: 'Positive', value: 42, color: '#8B5CF6' },
    { sentiment: 'Neutral', value: 18, color: '#6B7280' },
    { sentiment: 'Negative', value: 5, color: '#EF4444' }
  ];

  const competitorComparison = [
    { metric: 'Brand Awareness', us: 67, competitor1: 72, competitor2: 58 },
    { metric: 'Brand Preference', us: 43, competitor1: 38, competitor2: 45 },
    { metric: 'Brand Trust', us: 78, competitor1: 65, competitor2: 71 },
    { metric: 'Purchase Intent', us: 34, competitor1: 29, competitor2: 37 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Brand Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Build and strengthen your brand through strategic campaigns</p>
        </div>

        {/* Brand Campaign Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Brand Awareness</p>
                  <p className="text-2xl font-bold text-purple-600">67%</p>
                  <p className="text-xs text-purple-500">+4% this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                  <p className="text-2xl font-bold text-blue-600">4.2M</p>
                  <p className="text-xs text-blue-500">Unique users</p>
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
                  <p className="text-sm text-gray-600 mb-1">Brand Sentiment</p>
                  <p className="text-2xl font-bold text-green-600">77%</p>
                  <p className="text-xs text-green-500">Positive sentiment</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Brand Lift</p>
                  <p className="text-2xl font-bold text-orange-600">+23%</p>
                  <p className="text-xs text-orange-500">Campaign impact</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="metrics">Brand Metrics</TabsTrigger>
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="sentiment">Brand Sentiment</TabsTrigger>
            <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Brand Campaigns</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {brandCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                              campaign.status === 'planning' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                              {campaign.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{campaign.startDate} - {campaign.endDate}</span>
                          </div>
                        </div>
                        {campaign.brandLift > 0 && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">+{campaign.brandLift}%</p>
                            <p className="text-sm text-gray-500">Brand Lift</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">${campaign.spent.toLocaleString()} spent</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="font-semibold">{(campaign.reach / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-green-500">Unique users</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Impressions</p>
                          <p className="font-semibold">{(campaign.impressions / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-blue-500">Total views</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-semibold">{(campaign.engagement / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-purple-500">Interactions</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CPM</p>
                          <p className="font-semibold">${((campaign.spent / campaign.impressions) * 1000).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Cost per mille</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Campaign Objectives:</p>
                        <div className="flex flex-wrap gap-2">
                          {campaign.objectives.map((objective, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                              {objective}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {campaign.status === 'active' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Budget Utilization</span>
                            <span className="font-medium">{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Edit Campaign
                        </Button>
                        {campaign.status === 'active' && (
                          <Button size="sm" variant="outline" className="border-orange-200 text-orange-600">
                            Optimize
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Brand Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={brandMetrics}>
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
                    <Line type="monotone" dataKey="awareness" stroke="#8B5CF6" strokeWidth={3} name="Brand Awareness" />
                    <Line type="monotone" dataKey="consideration" stroke="#EC4899" strokeWidth={3} name="Consideration" />
                    <Line type="monotone" dataKey="preference" stroke="#3B82F6" strokeWidth={3} name="Brand Preference" />
                    <Line type="monotone" dataKey="loyalty" stroke="#10B981" strokeWidth={3} name="Brand Loyalty" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Brand Awareness</h3>
                  <p className="text-3xl font-bold">67%</p>
                  <p className="text-purple-100">+4% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Consideration</h3>
                  <p className="text-3xl font-bold">49%</p>
                  <p className="text-blue-100">+3% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Preference</h3>
                  <p className="text-3xl font-bold">43%</p>
                  <p className="text-green-100">+3% this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Loyalty</h3>
                  <p className="text-3xl font-bold">38%</p>
                  <p className="text-orange-100">+3% this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Channel Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="channel" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="reach" fill="#8B5CF6" name="Reach" />
                    <Bar dataKey="engagement" fill="#EC4899" name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {channelPerformance.map((channel, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{channel.channel}</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="text-lg font-bold text-purple-600">{(channel.reach / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement Rate</p>
                          <p className="text-lg font-bold text-green-600">{((channel.engagement / channel.reach) * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cost</p>
                          <p className="text-lg font-bold text-orange-600">${(channel.cost / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Brand Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={brandSentiment}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {brandSentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {brandSentiment.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.sentiment}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Sentiment Analysis Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50/70 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Positive Highlights</h3>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Creator-centric platform praised</li>
                      <li>• User-friendly interface appreciated</li>
                      <li>• Strong community engagement</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50/70 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Share2 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Most Mentioned</h3>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• "Easy to use" - 1,234 mentions</li>
                      <li>• "Great creators" - 987 mentions</li>
                      <li>• "Quality content" - 756 mentions</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50/70 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Improvement Areas</h3>
                    </div>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Mobile app optimization</li>
                      <li>• Payment processing speed</li>
                      <li>• Customer support response</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Competitive Brand Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitorComparison} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="metric" type="category" stroke="#666" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="us" fill="#8B5CF6" name="CABANA" />
                    <Bar dataKey="competitor1" fill="#EC4899" name="Competitor A" />
                    <Bar dataKey="competitor2" fill="#3B82F6" name="Competitor B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Competitive Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50/70 rounded-lg">
                    <span className="font-medium text-green-900">Brand Trust</span>
                    <Badge className="bg-green-600 text-white">Leading</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50/70 rounded-lg">
                    <span className="font-medium text-purple-900">Creator Focus</span>
                    <Badge className="bg-purple-600 text-white">Unique</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-lg">
                    <span className="font-medium text-blue-900">User Experience</span>
                    <Badge className="bg-blue-600 text-white">Strong</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Improvement Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50/70 rounded-lg">
                    <span className="font-medium text-yellow-900">Brand Awareness</span>
                    <Badge variant="outline" className="border-yellow-600 text-yellow-600">Gap -5%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50/70 rounded-lg">
                    <span className="font-medium text-orange-900">Purchase Intent</span>
                    <Badge variant="outline" className="border-orange-600 text-orange-600">Gap -3%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50/70 rounded-lg">
                    <span className="font-medium text-red-900">Market Share</span>
                    <Badge variant="outline" className="border-red-600 text-red-600">Opportunity</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrandCampaignsPage;