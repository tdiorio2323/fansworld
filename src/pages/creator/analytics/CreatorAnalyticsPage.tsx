import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Eye, Heart, MessageCircle, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const CreatorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const revenueData = [
    { date: '2024-01-01', revenue: 1200, subscribers: 45, views: 8500 },
    { date: '2024-01-02', revenue: 1450, subscribers: 52, views: 9200 },
    { date: '2024-01-03', revenue: 1300, subscribers: 48, views: 8800 },
    { date: '2024-01-04', revenue: 1650, subscribers: 61, views: 10200 },
    { date: '2024-01-05', revenue: 1800, subscribers: 67, views: 11500 },
    { date: '2024-01-06', revenue: 2100, subscribers: 75, views: 12800 },
    { date: '2024-01-07', revenue: 2350, subscribers: 82, views: 13900 },
  ];

  const contentPerformance = [
    { type: 'Photos', engagement: 85, revenue: 45 },
    { type: 'Videos', engagement: 92, revenue: 65 },
    { type: 'Live Streams', engagement: 78, revenue: 78 },
    { type: 'Messages', engagement: 95, revenue: 25 },
  ];

  const audienceData = [
    { name: 'Tier 1 ($5)', value: 35, color: '#8B5CF6' },
    { name: 'Tier 2 ($15)', value: 28, color: '#A78BFA' },
    { name: 'Tier 3 ($25)', value: 22, color: '#C4B5FD' },
    { name: 'Tips', value: 15, color: '#E0E7FF' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Creator Analytics
          </h1>
          <p className="text-gray-600 text-lg">Track your performance and maximize your earnings</p>
        </div>

        {/* Time Range Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
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
              <Button variant="outline" className="ml-auto border-purple-200 text-purple-600 hover:bg-purple-50">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">$12,450</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.2% vs last period
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">Active Subscribers</p>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.7% vs last period
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
                  <p className="text-sm text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">89.5K</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.3% vs last period
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
                  <p className="text-2xl font-bold text-pink-600">92.4%</p>
                  <p className="text-xs text-pink-500 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3.1% vs last period
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Performance */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-700">{item.type}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-purple-600">{item.engagement}% engagement</div>
                        <div className="text-xs text-gray-500">${item.revenue}k revenue</div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${item.engagement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {audienceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorAnalyticsPage;