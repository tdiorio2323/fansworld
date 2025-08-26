import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, Users, Heart, MessageCircle, DollarSign, Clock, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const PerformanceAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const performanceData = [
    { date: '2024-01-01', views: 12500, engagement: 8.5, revenue: 1250, subscribers: 45 },
    { date: '2024-01-02', views: 13200, engagement: 9.2, revenue: 1450, subscribers: 52 },
    { date: '2024-01-03', views: 11800, engagement: 7.8, revenue: 1100, subscribers: 38 },
    { date: '2024-01-04', views: 15600, engagement: 10.1, revenue: 1850, subscribers: 67 },
    { date: '2024-01-05', views: 14900, engagement: 9.7, revenue: 1650, subscribers: 58 },
    { date: '2024-01-06', views: 16800, engagement: 11.2, revenue: 2100, subscribers: 72 },
    { date: '2024-01-07', views: 18200, engagement: 12.5, revenue: 2350, subscribers: 84 }
  ];

  const contentPerformance = [
    { type: 'Photos', views: 45600, likes: 3420, comments: 567, shares: 234, ctr: 7.5 },
    { type: 'Videos', views: 67800, likes: 5890, comments: 892, shares: 445, ctr: 8.7 },
    { type: 'Stories', views: 23400, likes: 1890, comments: 234, shares: 123, ctr: 8.1 },
    { type: 'Live Streams', views: 34500, likes: 4560, comments: 1234, shares: 334, ctr: 13.2 }
  ];

  const audienceMetrics = [
    { segment: '18-24', value: 28, color: '#8B5CF6' },
    { segment: '25-34', value: 42, color: '#A78BFA' },
    { segment: '35-44', value: 22, color: '#C4B5FD' },
    { segment: '45+', value: 8, color: '#E0E7FF' }
  ];

  const topContent = [
    { title: 'Behind the Scenes: Photoshoot Day', views: 23450, engagement: 12.5, revenue: 450 },
    { title: 'Q&A with Fans Live Stream', views: 18900, engagement: 15.2, revenue: 380 },
    { title: 'Travel Vlog: NYC Adventures', views: 16700, engagement: 9.8, revenue: 320 },
    { title: 'Fashion Haul & Try-On', views: 14200, engagement: 11.3, revenue: 290 },
    { title: 'Makeup Tutorial: Evening Look', views: 12800, engagement: 8.7, revenue: 250 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Performance Analytics
          </h1>
          <p className="text-gray-600 text-lg">Deep insights into your content performance and audience engagement</p>
        </div>

        {/* Time Range Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {['24h', '7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? 
                    "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : 
                    "border-purple-200 text-purple-600 hover:bg-purple-50"
                  }
                >
                  {range}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">234.5K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18.5% vs last period
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                  <p className="text-2xl font-bold text-purple-600">9.8%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3% vs last period
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Session Time</p>
                  <p className="text-2xl font-bold text-green-600">4m 32s</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.8% vs last period
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-600">3.2%</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -0.5% vs last period
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Trends */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceData}>
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
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="engagement" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{content.title}</h3>
                          <p className="text-sm text-gray-500">{content.views.toLocaleString()} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-purple-600">{content.engagement}% engagement</div>
                        <div className="text-sm text-green-600">${content.revenue} revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentPerformance}>
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
                    <Bar dataKey="views" fill="#8B5CF6" />
                    <Bar dataKey="likes" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentPerformance.map((content, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{content.type}</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{content.views.toLocaleString()}</span> views
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{content.ctr}%</span> CTR
                        </div>
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {content.likes.toLocaleString()} likes
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={audienceMetrics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {audienceMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {audienceMetrics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.segment}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Audience Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Peak Activity Time</span>
                      <span className="text-sm text-purple-600 font-semibold">8:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Top Location</span>
                      <span className="text-sm text-purple-600 font-semibold">United States (45%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Primary Device</span>
                      <span className="text-sm text-purple-600 font-semibold">Mobile (78%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Avg. Sessions/User</span>
                      <span className="text-sm text-purple-600 font-semibold">3.4</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Engagement Patterns</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Highest engagement on weekends</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Live content performs 40% better</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Story completion rate: 65%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Revenue Performance</CardTitle>
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
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="subscribers" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Revenue per View</p>
                      <p className="text-2xl font-bold">$0.085</p>
                      <p className="text-xs text-green-200 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.2% vs last period
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Subscriber Value</p>
                      <p className="text-2xl font-bold">$24.50</p>
                      <p className="text-xs text-purple-200 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8.1% vs last period
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Conversion Value</p>
                      <p className="text-2xl font-bold">$78.90</p>
                      <p className="text-xs text-blue-200 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.3% vs last period
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-200" />
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

export default PerformanceAnalyticsPage;