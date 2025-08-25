import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, Users, CreditCard, Eye, MousePointer, ShoppingCart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ConversionAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const conversionFunnelData = [
    { stage: 'Profile Views', users: 15420, percentage: 100, dropoff: 0 },
    { stage: 'Content Views', users: 12350, percentage: 80.1, dropoff: 19.9 },
    { stage: 'Engagement', users: 8940, percentage: 58.0, dropoff: 27.6 },
    { stage: 'Subscription Intent', users: 3210, percentage: 20.8, dropoff: 64.1 },
    { stage: 'Free Trial', users: 1820, percentage: 11.8, dropoff: 43.3 },
    { stage: 'Paid Subscription', users: 890, percentage: 5.8, dropoff: 51.1 }
  ];

  const conversionTrendData = [
    { date: '2024-01-01', visitors: 1200, trials: 145, subscriptions: 67, rate: 5.58 },
    { date: '2024-01-08', visitors: 1350, trials: 162, subscriptions: 78, rate: 5.78 },
    { date: '2024-01-15', visitors: 1180, trials: 134, subscriptions: 62, rate: 5.25 },
    { date: '2024-01-22', visitors: 1420, trials: 189, subscriptions: 95, rate: 6.69 },
    { date: '2024-01-29', visitors: 1580, trials: 221, subscriptions: 112, rate: 7.09 },
    { date: '2024-02-05', visitors: 1640, trials: 246, subscriptions: 128, rate: 7.80 },
    { date: '2024-02-12', visitors: 1520, trials: 228, subscriptions: 119, rate: 7.83 }
  ];

  const conversionSourcesData = [
    { source: 'Direct', conversions: 234, rate: 8.2, revenue: 15680 },
    { source: 'Social Media', conversions: 189, rate: 6.7, revenue: 12650 },
    { source: 'Search', conversions: 156, rate: 9.1, revenue: 10440 },
    { source: 'Referral', conversions: 98, rate: 7.5, revenue: 6560 },
    { source: 'Email', conversions: 87, rate: 12.3, revenue: 5830 },
    { source: 'Ads', conversions: 72, rate: 5.4, revenue: 4820 }
  ];

  const subscriptionTiers = [
    { tier: 'Basic ($9.99)', subscribers: 445, revenue: 4449, color: '#8B5CF6' },
    { tier: 'Premium ($19.99)', subscribers: 289, revenue: 5779, color: '#EC4899' },
    { tier: 'VIP ($39.99)', subscribers: 156, revenue: 6239, color: '#F59E0B' }
  ];

  const optimizationOpportunities = [
    {
      area: 'Subscription Page',
      currentRate: 5.8,
      potentialRate: 8.2,
      impact: 'High',
      effort: 'Medium',
      estimatedIncrease: '+41%'
    },
    {
      area: 'Email Sequences',
      currentRate: 12.3,
      potentialRate: 16.1,
      impact: 'Medium',
      effort: 'Low',
      estimatedIncrease: '+31%'
    },
    {
      area: 'Content Previews',
      currentRate: 6.7,
      potentialRate: 9.4,
      impact: 'High',
      effort: 'High',
      estimatedIncrease: '+40%'
    },
    {
      area: 'Pricing Strategy',
      currentRate: 7.5,
      potentialRate: 9.8,
      impact: 'Medium',
      effort: 'Medium',
      estimatedIncrease: '+31%'
    }
  ];

  const keyMetrics = [
    {
      title: 'Overall Conversion Rate',
      value: '7.8%',
      change: '+0.8%',
      trend: 'up',
      description: 'Visitors to paid subscribers'
    },
    {
      title: 'Trial-to-Paid Rate',
      value: '48.9%',
      change: '+2.1%',
      trend: 'up',
      description: 'Free trials converting to paid'
    },
    {
      title: 'Average Order Value',
      value: '$24.50',
      change: '+$1.20',
      trend: 'up',
      description: 'Per subscription transaction'
    },
    {
      title: 'Customer Lifetime Value',
      value: '$342',
      change: '-$8',
      trend: 'down',
      description: 'Total value per customer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Conversion Analytics
          </h1>
          <p className="text-gray-600 text-lg">Track and optimize your subscription conversion funnel</p>
        </div>

        {/* Time Range Filter */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {['7d', '30d', '90d', '6m', '1y'].map((range) => (
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <div className={`flex items-center text-sm ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="funnel" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Subscription Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-gray-900">{stage.stage}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{stage.users.toLocaleString()} users</span>
                          <Badge variant="outline" className="text-purple-600">
                            {stage.percentage.toFixed(1)}%
                          </Badge>
                          {index > 0 && (
                            <Badge variant="secondary" className="text-red-600">
                              -{stage.dropoff.toFixed(1)}% drop
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={stage.percentage} className="h-8" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {stage.users.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Biggest Drop-off</p>
                      <p className="text-xl font-bold">Engagement → Intent</p>
                      <p className="text-green-200 text-sm">64.1% drop rate</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Best Performing Stage</p>
                      <p className="text-xl font-bold">Profile → Content</p>
                      <p className="text-blue-200 text-sm">80.1% retention</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Optimization Focus</p>
                      <p className="text-xl font-bold">Trial Experience</p>
                      <p className="text-purple-200 text-sm">51.1% trial to paid</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Conversion Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={conversionTrendData}>
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
                    <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2 }} name="Conversion Rate %" />
                    <Line type="monotone" dataKey="trials" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2 }} name="Free Trials" />
                    <Line type="monotone" dataKey="subscriptions" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', strokeWidth: 2 }} name="Paid Subscriptions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">7-Day Trend</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">+12.8%</p>
                  <p className="text-sm text-gray-600">Conversion improvement</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Peak Day</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">Tuesday</p>
                  <p className="text-sm text-gray-600">Best conversion day</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Monthly Goal</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">89%</p>
                  <p className="text-sm text-gray-600">Progress to target</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Conversion by Traffic Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionSourcesData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <MousePointer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{source.source}</h3>
                          <p className="text-sm text-gray-600">{source.conversions} conversions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{source.rate}%</div>
                        <div className="text-sm text-green-600">${source.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Source Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionSourcesData}>
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
                    <Bar dataKey="rate" fill="#8B5CF6" name="Conversion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Subscription Tier Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={subscriptionTiers}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="subscribers"
                      >
                        {subscriptionTiers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {subscriptionTiers.map((tier, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                          <span className="text-sm text-gray-600">{tier.tier}</span>
                        </div>
                        <span className="text-sm font-semibold">{tier.subscribers} users</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Tier Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {subscriptionTiers.map((tier, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{tier.tier}</h3>
                        <Badge style={{ backgroundColor: tier.color, color: 'white' }}>
                          ${tier.revenue.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Subscribers: </span>
                          <span className="font-medium">{tier.subscribers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Revenue: </span>
                          <span className="font-medium text-green-600">${tier.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                      <Progress 
                        value={(tier.subscribers / 890) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Most Popular Tier</h3>
                    <p className="text-2xl font-bold">Basic ($9.99)</p>
                    <p className="text-purple-100 text-sm">50% of all subscriptions</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Highest Revenue Tier</h3>
                    <p className="text-2xl font-bold">VIP ($39.99)</p>
                    <p className="text-purple-100 text-sm">$6,239 monthly revenue</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Growth Opportunity</h3>
                    <p className="text-2xl font-bold">Premium Tier</p>
                    <p className="text-purple-100 text-sm">+23% potential upgrade</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {optimizationOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{opportunity.area}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={opportunity.impact === 'High' ? 'default' : 'secondary'}>
                            {opportunity.impact} Impact
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.effort} Effort
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Current Rate</p>
                          <p className="text-lg font-bold text-gray-900">{opportunity.currentRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Potential Rate</p>
                          <p className="text-lg font-bold text-green-600">{opportunity.potentialRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Increase</p>
                          <p className="text-lg font-bold text-purple-600">{opportunity.estimatedIncrease}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={(opportunity.currentRate / opportunity.potentialRate) * 100} className="flex-1 h-2" />
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Wins</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50/70 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-1">A/B Test CTA Buttons</h3>
                    <p className="text-sm text-green-700 mb-2">Potential +15% conversion increase</p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Start Test</Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-1">Optimize Trial Length</h3>
                    <p className="text-sm text-blue-700 mb-2">7-day trial shows +22% conversion</p>
                    <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">Implement</Button>
                  </div>
                  
                  <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-1">Social Proof Integration</h3>
                    <p className="text-sm text-purple-700 mb-2">Show testimonials on signup</p>
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-600">Add</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Conversion Health Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">78/100</div>
                    <Badge className="bg-purple-100 text-purple-600 mb-4">Good Performance</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Funnel Efficiency</span>
                      <span className="text-sm font-semibold text-purple-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trial Quality</span>
                      <span className="text-sm font-semibold text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pricing Optimization</span>
                      <span className="text-sm font-semibold text-orange-600">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User Experience</span>
                      <span className="text-sm font-semibold text-purple-600">81%</span>
                    </div>
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

export default ConversionAnalyticsPage;