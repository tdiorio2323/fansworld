import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Calendar,
  Upload,
  Video,
  Camera,
  MessageCircle,
  Heart,
  Share,
  BarChart3,
  PieChart,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { MediaTile } from "@/components/MediaTile";

// Mock data
const dashboardData = {
  stats: {
    totalEarnings: 15240.50,
    monthlyEarnings: 3820.25,
    subscribers: 12500,
    newSubscribers: 245,
    totalViews: 2850000,
    monthlyViews: 187500,
    totalPosts: 342,
    monthlyPosts: 28
  },
  recentEarnings: [
    { date: '2024-01-15', amount: 125.50, type: 'Subscription' },
    { date: '2024-01-15', amount: 25.00, type: 'Tip' },
    { date: '2024-01-14', amount: 89.99, type: 'PPV Message' },
    { date: '2024-01-14', amount: 15.00, type: 'Tip' },
    { date: '2024-01-13', amount: 199.98, type: 'Subscription' }
  ],
  topPerformingContent: [
    {
      id: "1",
      type: "video" as const,
      src: "/placeholder-video1.jpg",
      title: "Behind the Scenes Workout",
      likes: 3200,
      comments: 234,
      views: 12000,
      earnings: 340.50,
      duration: "5:12"
    },
    {
      id: "2",
      type: "image" as const,
      src: "/placeholder-content1.jpg",
      title: "Summer Photoshoot",
      likes: 2850,
      comments: 189,
      views: 9800,
      earnings: 275.25
    },
    {
      id: "3",
      type: "video" as const,
      src: "/placeholder-video2.jpg",
      title: "Morning Routine",
      likes: 2100,
      comments: 156,
      views: 8900,
      earnings: 210.75,
      duration: "3:45"
    }
  ]
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="creator" username="Lilu" />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's how your content is performing.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              <Button className="btn-glass">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button className="btn-luxury">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-luxury">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient">
                  ${dashboardData.stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-green-500">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient">
                  {dashboardData.stats.subscribers.toLocaleString()}
                </div>
                <p className="text-xs text-green-500">
                  +{dashboardData.stats.newSubscribers} this month
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient">
                  {(dashboardData.stats.totalViews / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-green-500">
                  +{dashboardData.stats.monthlyViews.toLocaleString()} this month
                </p>
              </CardContent>
            </Card>

            <Card className="card-luxury">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Posts</CardTitle>
                <Camera className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient">
                  {dashboardData.stats.totalPosts}
                </div>
                <p className="text-xs text-green-500">
                  +{dashboardData.stats.monthlyPosts} this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Camera className="w-8 h-8" />
                Upload Photo
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Video className="w-8 h-8" />
                Upload Video
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <MessageCircle className="w-8 h-8" />
                Send Message
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="w-8 h-8" />
                View Fans
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Earnings */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Recent Earnings
                </CardTitle>
                <CardDescription>
                  Your latest income from the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentEarnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-2xl">
                      <div>
                        <p className="font-medium">{earning.type}</p>
                        <p className="text-sm text-muted-foreground">{earning.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">+${earning.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Performing Content
                </CardTitle>
                <CardDescription>
                  Your highest earning posts this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topPerformingContent.map((content) => (
                    <div key={content.id} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-2xl">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                        <img 
                          src={content.src} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                        {content.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-1">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{content.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {content.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {content.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-green-500">${content.earnings}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Stats */}
          <Card className="card-luxury mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Subscription Overview
              </CardTitle>
              <CardDescription>
                Track your subscriber growth and retention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-secondary/20 rounded-2xl">
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {dashboardData.stats.subscribers.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                </div>
                
                <div className="text-center p-6 bg-secondary/20 rounded-2xl">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    +{dashboardData.stats.newSubscribers}
                  </div>
                  <p className="text-sm text-muted-foreground">New This Month</p>
                </div>
                
                <div className="text-center p-6 bg-secondary/20 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    97%
                  </div>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}