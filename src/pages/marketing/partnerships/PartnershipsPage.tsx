import React, { useState } from 'react';
import { Handshake, Building, TrendingUp, Users, DollarSign, Calendar, Star, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PartnershipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const activePartners = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      type: 'Technology',
      tier: 'Platinum',
      status: 'active',
      startDate: '2024-01-15',
      revenue: 125000,
      users: 2340,
      conversionRate: 4.8,
      logo: 'TC',
      description: 'Leading technology solutions provider'
    },
    {
      id: 2,
      name: 'CreativeMedia Group',
      type: 'Content',
      tier: 'Gold',
      status: 'active',
      startDate: '2024-02-03',
      revenue: 89000,
      users: 1890,
      conversionRate: 3.7,
      logo: 'CM',
      description: 'Creative content and media agency'
    },
    {
      id: 3,
      name: 'Digital Marketing Pro',
      type: 'Marketing',
      tier: 'Silver',
      status: 'active',
      startDate: '2024-01-28',
      revenue: 67000,
      users: 1450,
      conversionRate: 2.9,
      logo: 'DM',
      description: 'Full-service digital marketing agency'
    },
    {
      id: 4,
      name: 'Social Influencers Hub',
      type: 'Influencer',
      tier: 'Gold',
      status: 'pending',
      startDate: '2024-03-12',
      revenue: 45000,
      users: 890,
      conversionRate: 5.2,
      logo: 'SI',
      description: 'Influencer marketing platform'
    }
  ];

  const partnershipPerformance = [
    { month: 'Jan', revenue: 45000, partners: 8, conversions: 234 },
    { month: 'Feb', revenue: 67000, partners: 12, conversions: 356 },
    { month: 'Mar', revenue: 89000, partners: 15, conversions: 445 },
    { month: 'Apr', revenue: 126000, partners: 18, conversions: 567 }
  ];

  const partnerTypes = [
    { type: 'Technology', count: 8, revenue: 245000 },
    { type: 'Content', count: 6, revenue: 189000 },
    { type: 'Marketing', count: 5, revenue: 134000 },
    { type: 'Influencer', count: 4, revenue: 98000 }
  ];

  const opportunityPipeline = [
    { name: 'Global Media Network', stage: 'Negotiation', value: 200000, probability: 75 },
    { name: 'Creative Studios Inc', stage: 'Proposal', value: 150000, probability: 60 },
    { name: 'Brand Partners Co', stage: 'Discovery', value: 100000, probability: 40 },
    { name: 'Content Creators LLC', stage: 'Initial Contact', value: 75000, probability: 25 }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Strategic Partnerships
          </h1>
          <p className="text-gray-600 text-lg">Build and manage strategic business partnerships</p>
        </div>

        {/* Partnership Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Partners</p>
                  <p className="text-2xl font-bold text-purple-600">23</p>
                  <p className="text-xs text-purple-500">5 pending review</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Partner Revenue</p>
                  <p className="text-2xl font-bold text-green-600">$326K</p>
                  <p className="text-xs text-green-500">+18% this quarter</p>
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
                  <p className="text-sm text-gray-600 mb-1">Partner Users</p>
                  <p className="text-2xl font-bold text-blue-600">8,570</p>
                  <p className="text-xs text-blue-500">From partnerships</p>
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
                  <p className="text-sm text-gray-600 mb-1">Avg Conversion</p>
                  <p className="text-2xl font-bold text-orange-600">4.15%</p>
                  <p className="text-xs text-orange-500">Partner traffic</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="partners">Active Partners</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="types">Partner Types</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Partnerships</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Partner
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePartners.map((partner) => (
                    <div key={partner.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {partner.logo}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                            <p className="text-sm text-gray-600">{partner.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getTierColor(partner.tier)}>{partner.tier}</Badge>
                              <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
                              <Badge variant="outline">{partner.type}</Badge>
                              <span className="text-sm text-gray-500">Since {partner.startDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${partner.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Total Revenue</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Users Acquired</p>
                          <p className="font-semibold">{partner.users.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="font-semibold">{partner.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue per User</p>
                          <p className="font-semibold">${(partner.revenue / partner.users).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Partnership Score</p>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.{Math.floor(Math.random() * 9) + 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-200 text-orange-600">
                          Renew Contract
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Partnership Pipeline</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Opportunity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunityPipeline.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{opportunity.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{opportunity.stage}</Badge>
                            <span className="text-sm text-gray-500">
                              ${opportunity.value.toLocaleString()} potential value
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{opportunity.probability}%</p>
                          <p className="text-sm text-gray-500">Win Probability</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Deal Progress</span>
                          <span className="font-medium">{opportunity.probability}%</span>
                        </div>
                        <Progress value={opportunity.probability} className="h-2" />
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          Update Stage
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Schedule Meeting
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Send Proposal
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <Building className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Total Pipeline Value</h3>
                  <p className="text-2xl font-bold">$525K</p>
                  <p className="text-blue-100">4 opportunities</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Expected Close Rate</h3>
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-green-100">Above industry average</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Avg Deal Cycle</h3>
                  <p className="text-2xl font-bold">45 Days</p>
                  <p className="text-purple-100">From contact to close</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Partnership Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={partnershipPerformance}>
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
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
                    <Line type="monotone" dataKey="partners" stroke="#8B5CF6" strokeWidth={3} name="Active Partners" />
                    <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={3} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Top Performing Partners</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activePartners.slice(0, 3).map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {partner.logo}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{partner.name}</p>
                          <p className="text-sm text-gray-600">{partner.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${(partner.revenue / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Partnership ROI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-900">Average ROI</p>
                      <p className="text-sm text-green-700">Across all partnerships</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">+285%</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-blue-900">Cost per Acquisition</p>
                      <p className="text-sm text-blue-700">Via partnerships</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">$38.50</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-purple-900">Lifetime Value</p>
                      <p className="text-sm text-purple-700">Partnership customers</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">$342</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50/70 rounded-lg">
                    <div>
                      <p className="font-semibold text-orange-900">Revenue Share</p>
                      <p className="text-sm text-orange-700">Average partnership fee</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">15%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Partnership Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnerTypes.map((type, index) => (
                    <div key={index} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{type.type} Partners</h3>
                            <p className="text-sm text-gray-600">{type.count} active partnerships</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Revenue</span>
                          <span className="font-semibold">${type.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg per Partner</span>
                          <span className="font-semibold">${(type.revenue / type.count / 1000).toFixed(0)}K</span>
                        </div>
                        <Progress value={(type.revenue / 245000) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Partnership Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={partnerTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="type" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue ($)" />
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

export default PartnershipsPage;