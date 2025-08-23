import React, { useState } from 'react';
import { Percent, Gift, Calendar, Target, TrendingUp, Users, DollarSign, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PromotionsPage = () => {
  const [selectedPromo, setSelectedPromo] = useState('active');

  const activePromotions = [
    {
      id: 1,
      name: 'Summer Creator Boost',
      type: 'percentage',
      discount: 25,
      code: 'SUMMER25',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      uses: 342,
      limit: 1000,
      revenue: 15600,
      status: 'active'
    },
    {
      id: 2,
      name: 'First Month Free',
      type: 'free_trial',
      discount: 100,
      code: 'FIRSTFREE',
      startDate: '2024-01-01',
      endDate: 'Ongoing',
      uses: 1289,
      limit: null,
      revenue: 34500,
      status: 'active'
    },
    {
      id: 3,
      name: 'Premium Upgrade Special',
      type: 'fixed_amount',
      discount: 10,
      code: 'UPGRADE10',
      startDate: '2024-04-01',
      endDate: '2024-05-31',
      uses: 156,
      limit: 500,
      revenue: 8900,
      status: 'active'
    },
    {
      id: 4,
      name: 'Student Discount',
      type: 'percentage',
      discount: 50,
      code: 'STUDENT50',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      uses: 89,
      limit: 200,
      revenue: 4560,
      status: 'active'
    }
  ];

  const promotionPerformance = [
    { date: '2024-04-01', uses: 45, revenue: 2340 },
    { date: '2024-04-02', uses: 62, revenue: 3120 },
    { date: '2024-04-03', uses: 78, revenue: 3890 },
    { date: '2024-04-04', uses: 89, revenue: 4230 },
    { date: '2024-04-05', uses: 95, revenue: 4560 },
    { date: '2024-04-06', uses: 112, revenue: 5670 },
    { date: '2024-04-07', uses: 128, revenue: 6340 }
  ];

  const promoTypes = [
    { type: 'Percentage', count: 8, color: '#8B5CF6' },
    { type: 'Fixed Amount', count: 5, color: '#EC4899' },
    { type: 'Free Trial', count: 3, color: '#3B82F6' },
    { type: 'BOGO', count: 2, color: '#10B981' }
  ];

  const upcomingPromotions = [
    { name: 'Black Friday Mega Sale', discount: '50% OFF', startDate: '2024-11-29', type: 'Sitewide' },
    { name: 'Holiday Creator Bundle', discount: '3 Months Free', startDate: '2024-12-15', type: 'Premium' },
    { name: 'New Year Fresh Start', discount: '30% OFF', startDate: '2025-01-01', type: 'New Users' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />;
      case 'fixed_amount': return <DollarSign className="w-4 h-4" />;
      case 'free_trial': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const formatDiscount = (type: string, discount: number) => {
    switch (type) {
      case 'percentage': return `${discount}% OFF`;
      case 'fixed_amount': return `$${discount} OFF`;
      case 'free_trial': return 'FREE TRIAL';
      default: return `${discount}% OFF`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Promotions & Discounts
          </h1>
          <p className="text-gray-600 text-lg">Create and manage promotional campaigns and discount codes</p>
        </div>

        {/* Promotion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Promotions</p>
                  <p className="text-2xl font-bold text-purple-600">18</p>
                  <p className="text-xs text-purple-500">3 expiring soon</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Uses</p>
                  <p className="text-2xl font-bold text-blue-600">1,876</p>
                  <p className="text-xs text-blue-500">+24% this month</p>
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
                  <p className="text-sm text-gray-600 mb-1">Revenue Impact</p>
                  <p className="text-2xl font-bold text-green-600">$63.6K</p>
                  <p className="text-xs text-green-500">Generated revenue</p>
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
                  <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-600">12.4%</p>
                  <p className="text-xs text-orange-500">+3.2% vs baseline</p>
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
            <TabsTrigger value="active">Active Promotions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Promotions</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Promotion
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePromotions.map((promo) => (
                    <div key={promo.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{promo.name}</h3>
                            {getTypeIcon(promo.type)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Code: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{promo.code}</span></p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(promo.status)}>{promo.status}</Badge>
                            <span className="text-xs text-gray-500">{promo.startDate} - {promo.endDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{formatDiscount(promo.type, promo.discount)}</p>
                          <p className="text-sm text-gray-500">Discount</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Uses</p>
                          <p className="font-semibold">{promo.uses.toLocaleString()}</p>
                          {promo.limit && <p className="text-xs text-gray-500">of {promo.limit.toLocaleString()}</p>}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold">${promo.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion</p>
                          <p className="font-semibold">{((promo.uses / promo.revenue * 1000) * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Order</p>
                          <p className="font-semibold">${(promo.revenue / promo.uses).toFixed(2)}</p>
                        </div>
                      </div>

                      {promo.limit && (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Usage Progress</span>
                            <span className="font-medium">{((promo.uses / promo.limit) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(promo.uses / promo.limit) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                          Pause
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Promotions</CardTitle>
                  <Button variant="outline" className="border-purple-200 text-purple-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPromotions.map((promo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{promo.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{promo.type}</Badge>
                            <span className="text-sm text-gray-500">Starts {promo.startDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{promo.discount}</p>
                        <p className="text-sm text-gray-500">Discount</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Seasonal Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Valentine's Day</h3>
                    <p className="text-sm text-red-700 mb-2">February 14, 2025</p>
                    <p className="text-xs text-red-600">Romantic themed promotions</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">St. Patrick's Day</h3>
                    <p className="text-sm text-green-700 mb-2">March 17, 2025</p>
                    <p className="text-xs text-green-600">Lucky discounts & deals</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Summer Kickoff</h3>
                    <p className="text-sm text-blue-700 mb-2">June 1, 2025</p>
                    <p className="text-xs text-blue-600">Summer-themed campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Promotion Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={promotionPerformance}>
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
                    <Line type="monotone" dataKey="uses" stroke="#8B5CF6" strokeWidth={3} name="Promo Uses" />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Promotion Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={promoTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {promoTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {promoTypes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.type}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Top Performing Promotions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activePromotions.slice(0, 3).map((promo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{promo.name}</p>
                        <p className="text-sm text-gray-600">{promo.uses} uses</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${promo.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Best Performing Code</p>
                      <p className="text-xl font-bold">FIRSTFREE</p>
                      <p className="text-purple-100 text-sm">1,289 uses</p>
                    </div>
                    <Gift className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Avg Revenue per Use</p>
                      <p className="text-2xl font-bold">$33.90</p>
                      <p className="text-blue-100 text-sm">+12% vs last month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Most Popular Type</p>
                      <p className="text-xl font-bold">Percentage Discount</p>
                      <p className="text-green-100 text-sm">8 active promotions</p>
                    </div>
                    <Percent className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Monthly Promotion Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={promotionPerformance}>
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
                    <Bar dataKey="uses" fill="#8B5CF6" name="Promotion Uses" />
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

export default PromotionsPage;