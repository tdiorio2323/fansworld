import React, { useState } from 'react';
import { Calendar, Snowflake, Sun, Leaf, Flower, Gift, Heart, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SeasonalCampaignsPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('current');

  const seasonalCampaigns = [
    {
      id: 1,
      name: 'Summer Creator Fest 2024',
      season: 'Summer',
      period: 'Jun - Aug 2024',
      status: 'active',
      budget: 125000,
      spent: 89000,
      reach: 3400000,
      conversions: 4567,
      revenue: 234000,
      icon: Sun,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 2,
      name: 'Back to School Campaign',
      season: 'Fall',
      period: 'Sep - Nov 2024',
      status: 'planned',
      budget: 95000,
      spent: 0,
      reach: 0,
      conversions: 0,
      revenue: 0,
      icon: Leaf,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 3,
      name: 'Holiday Magic Campaign',
      season: 'Winter',
      period: 'Dec 2024 - Feb 2025',
      status: 'planned',
      budget: 200000,
      spent: 0,
      reach: 0,
      conversions: 0,
      revenue: 0,
      icon: Snowflake,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 4,
      name: 'Spring Renewal Campaign',
      season: 'Spring',
      period: 'Mar - May 2025',
      status: 'draft',
      budget: 85000,
      spent: 0,
      reach: 0,
      conversions: 0,
      revenue: 0,
      icon: Flower,
      color: 'from-green-500 to-pink-500'
    }
  ];

  const holidayEvents = [
    { name: 'Valentine\'s Day', date: '2024-02-14', type: 'Romance', potential: 'High', icon: Heart },
    { name: 'Mother\'s Day', date: '2024-05-12', type: 'Family', potential: 'High', icon: Gift },
    { name: 'Halloween', date: '2024-10-31', type: 'Fun', potential: 'Medium', icon: Gift },
    { name: 'Black Friday', date: '2024-11-29', type: 'Shopping', potential: 'Very High', icon: Gift }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'Very High': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Seasonal Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Create timely campaigns that resonate with seasonal trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-xs text-purple-500">This quarter</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Seasonal Reach</p>
                  <p className="text-2xl font-bold text-blue-600">3.4M</p>
                  <p className="text-xs text-blue-500">Total impressions</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Seasonal Revenue</p>
                  <p className="text-2xl font-bold text-green-600">$234K</p>
                  <p className="text-xs text-green-500">Campaign revenue</p>
                </div>
                <Gift className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Uplift Rate</p>
                  <p className="text-2xl font-bold text-orange-600">+45%</p>
                  <p className="text-xs text-orange-500">vs baseline</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="campaigns">Seasonal Campaigns</TabsTrigger>
            <TabsTrigger value="calendar">Holiday Calendar</TabsTrigger>
            <TabsTrigger value="planning">Campaign Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Seasonal Campaigns</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {seasonalCampaigns.map((campaign) => {
                    const Icon = campaign.icon;
                    return (
                      <Card key={campaign.id} className={`border-0 bg-gradient-to-r ${campaign.color} text-white`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-8 h-8" />
                              <div>
                                <h3 className="font-semibold text-lg">{campaign.name}</h3>
                                <p className="text-sm opacity-90">{campaign.period}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(campaign.status)} text-gray-800`}>
                              {campaign.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm opacity-90">Budget</p>
                              <p className="font-semibold">${(campaign.budget / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-90">Reach</p>
                              <p className="font-semibold">{campaign.reach > 0 ? (campaign.reach / 1000000).toFixed(1) + 'M' : 'TBD'}</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-90">Conversions</p>
                              <p className="font-semibold">{campaign.conversions > 0 ? campaign.conversions.toLocaleString() : 'TBD'}</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-90">Revenue</p>
                              <p className="font-semibold">{campaign.revenue > 0 ? '$' + (campaign.revenue / 1000).toFixed(0) + 'K' : 'TBD'}</p>
                            </div>
                          </div>

                          {campaign.status === 'active' && campaign.budget > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="opacity-90">Budget Progress</span>
                                <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Upcoming Holiday Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {holidayEvents.map((holiday, index) => {
                    const Icon = holiday.icon;
                    return (
                      <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{holiday.name}</h3>
                              <p className="text-sm text-gray-600">{holiday.date}</p>
                            </div>
                          </div>
                          <Badge className={getPotentialColor(holiday.potential)}>
                            {holiday.potential}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{holiday.type}</Badge>
                          <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                            Plan Campaign
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Valentine's Day</h3>
                  <p className="text-red-100">Feb 14</p>
                  <p className="text-sm text-red-200 mt-2">Romance & Love themed content</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Flower className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Spring Launch</h3>
                  <p className="text-green-100">Mar 20</p>
                  <p className="text-sm text-green-200 mt-2">Fresh starts & new beginnings</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Fall Campaign</h3>
                  <p className="text-orange-100">Sep 22</p>
                  <p className="text-sm text-orange-200 mt-2">Cozy & warm atmosphere</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Snowflake className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Winter Holidays</h3>
                  <p className="text-blue-100">Dec 21</p>
                  <p className="text-sm text-blue-200 mt-2">Festive & celebratory mood</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Campaign Planning Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50/70 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">8 Weeks Before</h3>
                    <p className="text-sm text-blue-800">Campaign concept development, budget allocation, and initial planning</p>
                  </div>
                  
                  <div className="p-4 bg-green-50/70 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">6 Weeks Before</h3>
                    <p className="text-sm text-green-800">Content creation begins, influencer partnerships, creative asset development</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50/70 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">4 Weeks Before</h3>
                    <p className="text-sm text-orange-800">Campaign asset finalization, platform setup, audience targeting refinement</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50/70 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">2 Weeks Before</h3>
                    <p className="text-sm text-purple-800">Final testing, soft launch to small audience, campaign optimization</p>
                  </div>
                  
                  <div className="p-4 bg-red-50/70 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Campaign Launch</h3>
                    <p className="text-sm text-red-800">Full campaign deployment, real-time monitoring, and performance optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeasonalCampaignsPage;