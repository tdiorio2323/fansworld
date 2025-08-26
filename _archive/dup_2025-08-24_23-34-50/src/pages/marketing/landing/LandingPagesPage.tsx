import React, { useState } from 'react';
import { Layout, Eye, MousePointer, TrendingUp, Edit, Copy, Plus, BarChart3, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const LandingPagesPage = () => {
  const [selectedPage, setSelectedPage] = useState('all');

  const landingPages = [
    {
      id: 1,
      name: 'Creator Signup - Summer Campaign',
      url: '/signup/summer-2024',
      status: 'active',
      views: 45678,
      conversions: 892,
      conversionRate: 1.95,
      bounceRate: 42.3,
      avgTime: '2:34',
      lastModified: '2024-04-10',
      abTest: true
    },
    {
      id: 2,
      name: 'Premium Membership Promo',
      url: '/premium-offer',
      status: 'active',
      views: 34521,
      conversions: 1234,
      conversionRate: 3.57,
      bounceRate: 38.2,
      avgTime: '3:12',
      lastModified: '2024-04-08',
      abTest: true
    },
    {
      id: 3,
      name: 'New User Welcome',
      url: '/welcome',
      status: 'active',
      views: 67890,
      conversions: 2456,
      conversionRate: 3.62,
      bounceRate: 35.8,
      avgTime: '2:56',
      lastModified: '2024-04-05',
      abTest: false
    },
    {
      id: 4,
      name: 'Black Friday Special',
      url: '/black-friday-2024',
      status: 'draft',
      views: 0,
      conversions: 0,
      conversionRate: 0,
      bounceRate: 0,
      avgTime: '0:00',
      lastModified: '2024-04-15',
      abTest: false
    }
  ];

  const performanceData = [
    { date: '2024-04-01', views: 2340, conversions: 45 },
    { date: '2024-04-02', views: 2890, conversions: 62 },
    { date: '2024-04-03', views: 3210, conversions: 78 },
    { date: '2024-04-04', views: 3560, conversions: 89 },
    { date: '2024-04-05', views: 3890, conversions: 95 },
    { date: '2024-04-06', views: 4230, conversions: 112 },
    { date: '2024-04-07', views: 4560, conversions: 128 }
  ];

  const templates = [
    { name: 'Hero Banner', category: 'Header', usage: 12 },
    { name: 'Feature Grid', category: 'Content', usage: 8 },
    { name: 'Testimonials', category: 'Social Proof', usage: 15 },
    { name: 'Pricing Table', category: 'Conversion', usage: 10 },
    { name: 'CTA Section', category: 'Action', usage: 18 }
  ];

  const abTests = [
    {
      name: 'Headline Variation Test',
      pages: 3,
      status: 'running',
      winner: null,
      improvement: '+12%',
      confidence: 85
    },
    {
      name: 'CTA Button Color',
      pages: 2,
      status: 'completed',
      winner: 'Variant B',
      improvement: '+8%',
      confidence: 95
    },
    {
      name: 'Pricing Display Format',
      pages: 2,
      status: 'running',
      winner: null,
      improvement: '+5%',
      confidence: 72
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Landing Pages
          </h1>
          <p className="text-gray-600 text-lg">Create and optimize high-converting landing pages</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Pages</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-purple-500">3 in draft</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Layout className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">148K</p>
                  <p className="text-xs text-blue-500">+24% this month</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Conversion</p>
                  <p className="text-2xl font-bold text-green-600">3.04%</p>
                  <p className="text-xs text-green-500">+0.8% vs target</p>
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
                  <p className="text-sm text-gray-600 mb-1">A/B Tests</p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                  <p className="text-xs text-orange-500">3 running</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="pages">Landing Pages</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="testing">A/B Testing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Landing Pages</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Page
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {landingPages.map((page) => (
                    <div key={page.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{page.name}</h3>
                          <p className="text-sm text-gray-600">{page.url}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={page.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {page.status}
                            </Badge>
                            {page.abTest && (
                              <Badge className="bg-blue-100 text-blue-800">A/B Testing</Badge>
                            )}
                            <span className="text-xs text-gray-500">Modified {page.lastModified}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{page.conversionRate}%</p>
                          <p className="text-sm text-gray-500">Conversion Rate</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Views</p>
                          <p className="font-semibold">{page.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold">{page.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Bounce Rate</p>
                          <p className="font-semibold">{page.bounceRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Time</p>
                          <p className="font-semibold">{page.avgTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Device Split</p>
                          <div className="flex space-x-1">
                            <Monitor className="w-4 h-4 text-gray-600" />
                            <span className="text-xs">65%</span>
                            <Smartphone className="w-4 h-4 text-gray-600 ml-1" />
                            <span className="text-xs">35%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-200 text-orange-600">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Page Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg hover:shadow-lg transition-shadow">
                      <div className="h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg mb-4"></div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Used {template.usage} times</span>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>A/B Tests</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abTests.map((test, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{test.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={test.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {test.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{test.pages} pages</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{test.improvement}</p>
                          <p className="text-sm text-gray-500">Improvement</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Statistical Confidence</span>
                          <span className="font-medium">{test.confidence}%</span>
                        </div>
                        <Progress value={test.confidence} className="h-2" />
                      </div>

                      {test.winner && (
                        <div className="mt-3 p-2 bg-green-50 rounded">
                          <p className="text-sm text-green-800">
                            Winner: <span className="font-semibold">{test.winner}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Landing Page Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={3} name="Page Views" />
                    <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <MousePointer className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Best Converting Page</h3>
                  <p className="text-2xl font-bold">Premium Membership</p>
                  <p className="text-purple-100">3.57% conversion rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <Eye className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Most Viewed Page</h3>
                  <p className="text-2xl font-bold">New User Welcome</p>
                  <p className="text-blue-100">67.9K views this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">Biggest Improvement</h3>
                  <p className="text-2xl font-bold">Creator Signup</p>
                  <p className="text-green-100">+45% conversion increase</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPagesPage;