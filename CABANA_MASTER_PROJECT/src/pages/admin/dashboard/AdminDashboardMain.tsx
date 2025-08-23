import React from 'react';
import { Users, DollarSign, TrendingUp, Shield, Eye, MessageSquare, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AdminDashboardMain = () => {
  const stats = [
    { title: 'Total Users', value: '24,853', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Revenue', value: '$142,389', change: '+18%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Creators', value: '3,247', change: '+8%', icon: Star, color: 'text-purple-600' },
    { title: 'Content Views', value: '2.4M', change: '+23%', icon: Eye, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { user: 'Sophie Chen', action: 'Created new content', time: '2 min ago', type: 'content' },
    { user: 'Alex Johnson', action: 'Reported content', time: '5 min ago', type: 'report' },
    { user: 'Maya Patel', action: 'Withdrew earnings', time: '12 min ago', type: 'payment' },
    { user: 'David Kim', action: 'New subscriber', time: '18 min ago', type: 'user' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with CABANA today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Server Health</span>
                  <span className="text-sm text-green-600">99.9%</span>
                </div>
                <Progress value={99.9} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-green-600">Optimal</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CDN Performance</span>
                  <span className="text-sm text-yellow-600">Good</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Alerts</span>
                </div>
                <p className="text-xs text-gray-600">2 pending security reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
                <Button className="h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-6 w-6" />
                  <span>Review Reports</span>
                </Button>
                <Button className="h-20 flex flex-col space-y-2 bg-green-600 hover:bg-green-700">
                  <DollarSign className="h-6 w-6" />
                  <span>Payments</span>
                </Button>
                <Button className="h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
                  <TrendingUp className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;