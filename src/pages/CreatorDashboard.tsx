import React, { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  Eye, 
  Heart, 
  TrendingUp, 
  Calendar,
  Star,
  Download,
  Plus,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Crown,
  Zap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuthSystem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AnalyticsData {
  totalFollowers: number
  totalEarnings: number
  totalViews: number
  totalLikes: number
  growthRate: number
  engagement: number
  vipMembers: number
  contentCount: number
}

interface RecentActivity {
  id: string
  type: 'subscription' | 'like' | 'comment' | 'tip' | 'message'
  user: string
  amount?: number
  content?: string
  timestamp: string
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFollowers: 12847,
    totalEarnings: 28450,
    totalViews: 456789,
    totalLikes: 23456,
    growthRate: 15.2,
    engagement: 8.7,
    vipMembers: 234,
    contentCount: 89
  })

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'subscription',
      user: 'jessica_m',
      amount: 29.99,
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'tip',
      user: 'mike_creator',
      amount: 50,
      content: 'Amazing content!',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      type: 'like',
      user: 'sarah_vip',
      content: 'Liked your latest post',
      timestamp: '32 minutes ago'
    },
    {
      id: '4',
      type: 'message',
      user: 'alex_fan',
      content: 'Sent you a VIP message',
      timestamp: '1 hour ago'
    }
  ])

  const StatCard = ({ title, value, change, icon: Icon, color }: {
    title: string
    value: string | number
    change?: string
    icon: any
    color: string
  }) => (
    <Card className="glass-morphism border-border/60 hover:scale-105 transition-transform">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'subscription':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'tip':
        return <DollarSign className="w-4 h-4 text-green-500" />
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />
      case 'message':
        return <Zap className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Creator Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || 'Creator'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Content
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Followers"
            value={analytics.totalFollowers.toLocaleString()}
            change={`+${analytics.growthRate}%`}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Earnings"
            value={`$${analytics.totalEarnings.toLocaleString()}`}
            change="+23.5%"
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Content Views"
            value={analytics.totalViews.toLocaleString()}
            change="+12.3%"
            icon={Eye}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="VIP Members"
            value={analytics.vipMembers}
            change="+8.1%"
            icon={Crown}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Analytics */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Performance Chart */}
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Overview
                    </CardTitle>
                    <CardDescription>Your content performance over the last 30 days</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                    <p className="text-xs text-muted-foreground mt-1">Integration with chart library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Your most popular posts this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Behind the Scenes: Studio Tour", views: "12.5K", likes: "1.2K", type: "Video" },
                    { title: "VIP Q&A Session", views: "8.3K", likes: "890", type: "Live" },
                    { title: "Exclusive Photo Collection", views: "15.7K", likes: "2.1K", type: "Gallery" },
                    { title: "Personal Message to Fans", views: "6.2K", likes: "780", type: "Post" }
                  ].map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{content.title}</h4>
                          <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {content.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {content.likes}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <span className="font-semibold">{analytics.engagement}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Content Count</span>
                  <span className="font-semibold">{analytics.contentCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Daily Views</span>
                  <span className="font-semibold">2.1K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-semibold">< 2 hrs</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest interactions with your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                      <ActivityIcon type={activity.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{activity.user}</span>
                          {activity.amount && (
                            <Badge variant="secondary" className="text-xs">
                              ${activity.amount}
                            </Badge>
                          )}
                        </div>
                        {activity.content && (
                          <p className="text-xs text-muted-foreground truncate">{activity.content}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage VIP Members
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Content
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  View Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}