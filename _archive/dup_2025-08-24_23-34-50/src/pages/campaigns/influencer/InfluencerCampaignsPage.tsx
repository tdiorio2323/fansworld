import React, { useState } from 'react';
import { Users, Star, TrendingUp, DollarSign, Instagram, Youtube, Twitter, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const InfluencerCampaignsPage = () => {
  const influencerCampaigns = [
    {
      id: 1,
      name: 'Summer Creator Collab',
      influencers: 12,
      reach: 2340000,
      engagement: 234000,
      conversions: 1567,
      budget: 85000,
      spent: 67000,
      status: 'active',
      platform: 'Multi-platform'
    },
    {
      id: 2,
      name: 'Instagram Fashion Week',
      influencers: 8,
      reach: 1890000,
      engagement: 189000,
      conversions: 892,
      budget: 50000,
      spent: 45000,
      status: 'active',
      platform: 'Instagram'
    }
  ];

  const topInfluencers = [
    {
      name: 'Sarah Style',
      handle: '@sarahstyle',
      platform: 'Instagram',
      followers: 850000,
      engagement: 4.2,
      conversions: 234,
      revenue: 15600,
      tier: 'Mega'
    },
    {
      name: 'Tech Mike',
      handle: '@techmike',
      platform: 'YouTube',
      followers: 1200000,
      engagement: 6.1,
      conversions: 567,
      revenue: 28900,
      tier: 'Mega'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Influencer Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Partner with influencers to amplify your brand reach</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                  <p className="text-2xl font-bold text-purple-600">6</p>
                  <p className="text-xs text-purple-500">Running now</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                  <p className="text-2xl font-bold text-blue-600">4.2M</p>
                  <p className="text-xs text-blue-500">Unique impressions</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-green-600">423K</p>
                  <p className="text-xs text-green-500">Total interactions</p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Campaign ROI</p>
                  <p className="text-2xl font-bold text-orange-600">+285%</p>
                  <p className="text-xs text-orange-500">Return on investment</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="influencers">Top Influencers</TabsTrigger>
            <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
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
                  {influencerCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <Badge className="bg-green-100 text-green-800">{campaign.status}</Badge>
                            <Badge variant="outline">{campaign.platform}</Badge>
                            <span className="text-sm text-gray-500">{campaign.influencers} influencers</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">+{(((campaign.conversions * 50) / campaign.spent) * 100).toFixed(0)}%</p>
                          <p className="text-sm text-gray-500">ROI</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="font-semibold">{(campaign.reach / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-semibold">{(campaign.engagement / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{campaign.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CPE</p>
                          <p className="font-semibold">${(campaign.spent / campaign.engagement).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget Utilization</span>
                          <span className="font-medium">{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencers" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Top Performing Influencers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topInfluencers.map((influencer, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
                            <p className="text-sm text-gray-600">{influencer.handle} • {influencer.platform}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">{(influencer.followers / 1000000).toFixed(1)}M followers</span>
                              <Badge className="text-xs">{influencer.tier}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${influencer.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{influencer.conversions} conversions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Instagram className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <p className="text-2xl font-bold">2.1M</p>
                  <p className="text-pink-100">Total reach</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Youtube className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">YouTube</h3>
                  <p className="text-2xl font-bold">1.8M</p>
                  <p className="text-red-100">Total reach</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Twitter className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Twitter</h3>
                  <p className="text-2xl font-bold">670K</p>
                  <p className="text-blue-100">Total reach</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InfluencerCampaignsPage;