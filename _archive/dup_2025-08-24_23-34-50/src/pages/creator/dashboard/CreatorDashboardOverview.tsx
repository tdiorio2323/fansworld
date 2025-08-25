import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, Users, Eye, Heart, TrendingUp, TrendingDown,
  Calendar, MessageCircle, Camera, Video, FileText, Gift,
  Bell, Settings, BarChart3, Target, Zap, Star
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CreatorDashboardOverview = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [notifications, setNotifications] = useState([])

  // Mock data - replace with real API calls
  const stats = {
    earnings: {
      total: 2850.50,
      change: +12.5,
      period: 'this month'
    },
    subscribers: {
      total: 1247,
      change: +8.2,
      period: 'this month'
    },
    views: {
      total: 45230,
      change: -2.1,
      period: 'this month'
    },
    engagement: {
      total: 89.5,
      change: +5.3,
      period: 'this month'
    }
  }

  const goals = [
    {
      title: '2000 Subscribers',
      current: 1247,
      target: 2000,
      deadline: '2025-03-01',
      progress: 62.35
    },
    {
      title: '$5000 Monthly Revenue',
      current: 2850.50,
      target: 5000,
      deadline: '2025-04-01',
      progress: 57.01
    },
    {
      title: '100K Total Views',
      current: 78650,
      target: 100000,
      deadline: '2025-02-15',
      progress: 78.65
    }
  ]

  const recentContent = [
    {
      id: 1,
      type: 'video',
      title: 'Behind the Scenes of My Latest Project',
      views: 1205,
      likes: 89,
      comments: 23,
      earnings: 45.20,
      publishedAt: '2025-01-20T10:00:00Z'
    },
    {
      id: 2,
      type: 'photo',
      title: 'Sunset Photography Session',
      views: 892,
      likes: 156,
      comments: 12,
      earnings: 32.10,
      publishedAt: '2025-01-19T14:30:00Z'
    },
    {
      id: 3,
      type: 'text',
      title: 'My Journey as a Creator',
      views: 634,
      likes: 78,
      comments: 34,
      earnings: 18.50,
      publishedAt: '2025-01-18T09:15:00Z'
    }
  ]

  const topFans = [
    { name: 'Sarah Johnson', avatar: 'SJ', totalSpent: 245.50, subscriptionMonths: 8 },
    { name: 'Mike Chen', avatar: 'MC', totalSpent: 189.30, subscriptionMonths: 6 },
    { name: 'Emily Rodriguez', avatar: 'ER', totalSpent: 156.80, subscriptionMonths: 4 },
    { name: 'David Kim', avatar: 'DK', totalSpent: 134.90, subscriptionMonths: 3 }
  ]

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'photo': return <Camera className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your performance overview.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/creator/content/new">
                  <Camera className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/creator/earnings">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Earnings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.earnings.total)}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.earnings.change}% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(stats.subscribers.total)}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.subscribers.change}% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(stats.views.total)}</div>
                  <div className="flex items-center text-xs text-red-600 mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {stats.views.change}% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Heart className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.engagement.total}%</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.engagement.change}% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{goal.title}</h3>
                      <Badge variant="outline">
                        {typeof goal.current === 'number' && goal.current > 1000 
                          ? formatCurrency(goal.current)
                          : formatNumber(goal.current)
                        } / {
                          typeof goal.target === 'number' && goal.target > 1000
                            ? formatCurrency(goal.target) 
                            : formatNumber(goal.target)
                        }
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{goal.progress.toFixed(1)}% complete</span>
                      <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Content Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        {getContentIcon(content.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{content.title}</h3>
                        <p className="text-sm text-gray-600">
                          Published {new Date(content.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm font-medium">{formatNumber(content.views)}</div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{content.likes}</div>
                          <div className="text-xs text-gray-600">Likes</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{formatCurrency(content.earnings)}</div>
                          <div className="text-xs text-gray-600">Earned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/creator/analytics">
                      View All Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/creator/content/new">
                    <Camera className="h-4 w-4 mr-2" />
                    Create New Post
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/creator/messaging">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Fans
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/creator/fans">
                    <Users className="h-4 w-4 mr-2" />
                    View Subscribers
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/creator/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Top Fans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Supporters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topFans.map((fan, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium text-sm">
                        {fan.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{fan.name}</h3>
                        <p className="text-xs text-gray-600">
                          {fan.subscriptionMonths} months • {formatCurrency(fan.totalSpent)} total
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/creator/messaging?user=${fan.name}`}>
                          <MessageCircle className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/fans">
                      View All Fans
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Sarah J.</span> subscribed to your content
                    <div className="text-xs text-gray-600">2 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Mike C.</span> sent you a tip of $25
                    <div className="text-xs text-gray-600">4 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Emily R.</span> liked your latest post
                    <div className="text-xs text-gray-600">6 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">David K.</span> commented on your video
                    <div className="text-xs text-gray-600">8 hours ago</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/creator/notifications">
                      View All Activity
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorDashboardOverview