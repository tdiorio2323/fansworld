import React, { useState } from 'react';
import { MousePointer, Eye, Users, Clock, Smartphone, Monitor, Tablet, Globe, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const TrackingAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const pageViewsData = [
    { date: '2024-01-01', pageviews: 8500, uniqueVisitors: 3200, bounceRate: 42, avgDuration: 185 },
    { date: '2024-01-02', pageviews: 9200, uniqueVisitors: 3450, bounceRate: 38, avgDuration: 201 },
    { date: '2024-01-03', pageviews: 8800, uniqueVisitors: 3350, bounceRate: 45, avgDuration: 176 },
    { date: '2024-01-04', pageviews: 10200, uniqueVisitors: 3680, bounceRate: 35, avgDuration: 223 },
    { date: '2024-01-05', pageviews: 11500, uniqueVisitors: 4200, bounceRate: 32, avgDuration: 245 },
    { date: '2024-01-06', pageviews: 12800, uniqueVisitors: 4650, bounceRate: 28, avgDuration: 267 },
    { date: '2024-01-07', pageviews: 13900, uniqueVisitors: 5100, bounceRate: 25, avgDuration: 289 }
  ];

  const deviceData = [
    { device: 'Mobile', users: 12450, percentage: 62.3, color: '#8B5CF6' },
    { device: 'Desktop', users: 5890, percentage: 29.5, color: '#EC4899' },
    { device: 'Tablet', users: 1640, percentage: 8.2, color: '#3B82F6' }
  ];

  const topPages = [
    { page: '/creator/dashboard', views: 23450, uniqueViews: 12300, avgTime: 245, bounceRate: 15.2 },
    { page: '/browse/creators', views: 18900, uniqueViews: 14200, avgTime: 189, bounceRate: 28.5 },
    { page: '/user/profile', views: 16700, uniqueViews: 8900, avgTime: 156, bounceRate: 42.1 },
    { page: '/subscription/plans', views: 14200, uniqueViews: 11800, avgTime: 134, bounceRate: 35.7 },
    { page: '/content/feed', views: 12800, uniqueViews: 9400, avgTime: 298, bounceRate: 22.3 }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 8450, percentage: 42.1, color: '#8B5CF6' },
    { source: 'Social Media', visitors: 5890, percentage: 29.3, color: '#EC4899' },
    { source: 'Search Engines', visitors: 3210, percentage: 16.0, color: '#3B82F6' },
    { source: 'Referrals', visitors: 1680, percentage: 8.4, color: '#10B981' },
    { source: 'Email', visitors: 850, percentage: 4.2, color: '#F59E0B' }
  ];

  const geoData = [
    { country: 'United States', users: 8920, sessions: 15640, percentage: 44.5 },
    { country: 'United Kingdom', users: 3450, sessions: 6180, percentage: 17.2 },
    { country: 'Canada', users: 2180, sessions: 3890, percentage: 10.9 },
    { country: 'Australia', users: 1560, sessions: 2780, percentage: 7.8 },
    { country: 'Germany', users: 1240, sessions: 2210, percentage: 6.2 },
    { country: 'France', users: 980, sessions: 1750, percentage: 4.9 },
    { country: 'Other', users: 1670, sessions: 2980, percentage: 8.3 }
  ];

  const userFlow = [
    { step: 'Landing Page', users: 10000, dropoff: 0 },
    { step: 'Browse Content', users: 7500, dropoff: 25 },
    { step: 'View Profile', users: 5200, dropoff: 30.7 },
    { step: 'Subscribe Intent', users: 2800, dropoff: 46.2 },
    { step: 'Payment Page', users: 1680, dropoff: 40 },
    { step: 'Subscription Complete', users: 1260, dropoff: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Tracking Analytics
          </h1>
          <p className="text-gray-600 text-lg">Monitor user behavior and website performance metrics</p>
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

        {/* Key Tracking Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Page Views</p>
                  <p className="text-2xl font-bold text-blue-600">234.5K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.8% vs last period
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
                  <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
                  <p className="text-2xl font-bold text-purple-600">89.2K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.4% vs last period
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
                  <p className="text-2xl font-bold text-green-600">4m 32s</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.2% vs last period
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
                  <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
                  <p className="text-2xl font-bold text-orange-600">32.8%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                    -5.1% vs last period
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Traffic Trends */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={pageViewsData}>
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
                    <Area type="monotone" dataKey="pageviews" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="uniqueVisitors" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Flow */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>User Journey Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userFlow.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-gray-900">{step.step}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{step.users.toLocaleString()} users</span>
                          {index > 0 && (
                            <Badge variant="secondary" className="text-red-600">
                              -{step.dropoff}% drop
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${(step.users / userFlow[0].users) * 100}%` }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {step.users.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="users"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {deviceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.device}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{item.percentage}%</span>
                          <span className="text-xs text-gray-500 block">{item.users.toLocaleString()} users</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Device Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {deviceData.map((device, index) => {
                    const Icon = device.device === 'Mobile' ? Smartphone : device.device === 'Desktop' ? Monitor : Tablet;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{device.device}</p>
                            <p className="text-sm text-gray-600">{device.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{device.percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Top Performing Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{page.page}</p>
                          <p className="text-sm text-gray-600">{page.views.toLocaleString()} views</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Unique</p>
                          <p className="font-semibold text-purple-600">{page.uniqueViews.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg. Time</p>
                          <p className="font-semibold text-green-600">{page.avgTime}s</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Bounce</p>
                          <p className="font-semibold text-orange-600">{page.bounceRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="visitors"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {trafficSources.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.source}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{item.percentage}%</span>
                          <span className="text-xs text-gray-500 block">{item.visitors.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Source Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={trafficSources}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="source" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255,255,255,0.95)', 
                          border: 'none', 
                          borderRadius: '8px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Bar dataKey="visitors" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geoData.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{country.country}</p>
                          <p className="text-sm text-gray-600">{country.users.toLocaleString()} users • {country.sessions.toLocaleString()} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{country.percentage}%</p>
                        <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${country.percentage * 2}%` }}
                          />
                        </div>
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

export default TrackingAnalyticsPage;