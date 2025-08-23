import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, CreditCard, Wallet, PiggyBank, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const CreatorEarningsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedTab, setSelectedTab] = useState('overview');

  const earningsData = [
    { date: 'Jan 1', total: 1200, subscriptions: 800, tips: 300, content: 100 },
    { date: 'Jan 2', total: 1450, subscriptions: 900, tips: 400, content: 150 },
    { date: 'Jan 3', total: 1600, subscriptions: 1000, tips: 450, content: 150 },
    { date: 'Jan 4', total: 1350, subscriptions: 850, tips: 350, content: 150 },
    { date: 'Jan 5', total: 1800, subscriptions: 1100, tips: 500, content: 200 },
    { date: 'Jan 6', total: 1950, subscriptions: 1200, tips: 550, content: 200 },
    { date: 'Jan 7', total: 2100, subscriptions: 1300, tips: 600, content: 200 }
  ];

  const revenueBreakdown = [
    { name: 'Subscriptions', value: 7150, color: '#8B5CF6' },
    { name: 'Tips & Donations', value: 3150, color: '#EC4899' },
    { name: 'Content Sales', value: 1350, color: '#10B981' },
    { name: 'Merchandise', value: 800, color: '#F59E0B' }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'subscription',
      description: 'Premium Subscription - @user123',
      amount: 29.99,
      date: '2024-01-15 14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'tip',
      description: 'Tip on "Morning Routine" post',
      amount: 15.00,
      date: '2024-01-15 13:15',
      status: 'completed'
    },
    {
      id: 3,
      type: 'content',
      description: 'Exclusive Photo Set Purchase',
      amount: 19.99,
      date: '2024-01-15 12:45',
      status: 'completed'
    },
    {
      id: 4,
      type: 'payout',
      description: 'Weekly Payout to Bank',
      amount: -850.50,
      date: '2024-01-15 10:00',
      status: 'pending'
    },
    {
      id: 5,
      type: 'subscription',
      description: 'VIP Subscription - @fan456',
      amount: 49.99,
      date: '2024-01-15 09:20',
      status: 'completed'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'tip': return <Gift className="w-4 h-4 text-pink-400" />;
      case 'content': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'payout': return <Wallet className="w-4 h-4 text-blue-400" />;
      default: return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const totalEarnings = earningsData.reduce((sum, day) => sum + day.total, 0);
  const previousPeriod = 8900; // Mock previous period data
  const growthRate = ((totalEarnings - previousPeriod) / previousPeriod * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Earnings Dashboard</h1>
            <p className="text-purple-200">Track your revenue and financial performance</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div className={`flex items-center ${growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="text-sm font-medium">{Math.abs(growthRate).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Total Earnings (7 days)</p>
                <p className="text-3xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-purple-400" />
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">12.3%</span>
                </div>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">From Subscriptions</p>
                <p className="text-3xl font-bold text-white">$7,150</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Gift className="w-8 h-8 text-pink-400" />
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">8.7%</span>
                </div>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">From Tips</p>
                <p className="text-3xl font-bold text-white">$3,150</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <PiggyBank className="w-8 h-8 text-blue-400" />
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">15.2%</span>
                </div>
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-white">$2,450</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Range Selector */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  className={timeRange === range 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                  onClick={() => setTimeRange(range)}
                >
                  {range === '7d' ? 'Last 7 days' : 
                   range === '30d' ? 'Last 30 days' : 
                   range === '90d' ? 'Last 90 days' : 'Last year'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Chart */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#EC4899" strokeWidth={3} />
                  <Line type="monotone" dataKey="subscriptions" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="tips" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-purple-200 text-xs">${item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-purple-200 text-sm">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusBadge(transaction.status)} border`}>
                      {transaction.status}
                    </Badge>
                    <span className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Information */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Payout Information</h3>
                <p className="text-purple-200">Next payout: Monday, January 22nd • Minimum: $100</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="text-center">
                  <p className="text-purple-200 text-sm">Current Balance</p>
                  <p className="text-2xl font-bold text-white">$2,450.00</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorEarningsPage;