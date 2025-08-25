import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Calendar,
  Target,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CreatorMetrics {
  id: string;
  name: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'onlyfans';
  followers: number;
  engagement_rate: number;
  monthly_revenue: number;
  growth_rate: number;
  content_performance: ContentMetric[];
  recent_posts: PostMetric[];
}

interface ContentMetric {
  type: 'video' | 'image' | 'story' | 'live';
  count: number;
  avg_views: number;
  avg_engagement: number;
  revenue_generated: number;
}

interface PostMetric {
  id: string;
  type: string;
  posted_date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
  engagement_score: number;
}

interface RevenueBreakdown {
  subscriptions: number;
  tips: number;
  merchandise: number;
  brand_deals: number;
  total: number;
}

export default function CreatorAnalyticsDashboard() {
  const [selectedCreator, setSelectedCreator] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [metrics, setMetrics] = useState<CreatorMetrics[]>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown>({
    subscriptions: 145000,
    tips: 23000,
    merchandise: 8500,
    brand_deals: 45000,
    total: 221500
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockMetrics: CreatorMetrics[] = [
      {
        id: '1',
        name: 'Jessica Parker',
        platform: 'instagram',
        followers: 125000,
        engagement_rate: 8.7,
        monthly_revenue: 45000,
        growth_rate: 15.2,
        content_performance: [
          { type: 'image', count: 45, avg_views: 12500, avg_engagement: 9.2, revenue_generated: 15000 },
          { type: 'video', count: 12, avg_views: 25000, avg_engagement: 12.5, revenue_generated: 25000 },
          { type: 'story', count: 89, avg_views: 8500, avg_engagement: 6.8, revenue_generated: 5000 }
        ],
        recent_posts: [
          {
            id: 'p1',
            type: 'video',
            posted_date: '2025-01-28',
            views: 35000,
            likes: 4200,
            comments: 340,
            shares: 180,
            revenue: 2500,
            engagement_score: 12.8
          }
        ]
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        platform: 'tiktok',
        followers: 89000,
        engagement_rate: 11.3,
        monthly_revenue: 32000,
        growth_rate: 22.1,
        content_performance: [
          { type: 'video', count: 28, avg_views: 45000, avg_engagement: 14.2, revenue_generated: 28000 },
          { type: 'live', count: 8, avg_views: 15000, avg_engagement: 18.5, revenue_generated: 4000 }
        ],
        recent_posts: []
      }
    ];
    setMetrics(mockMetrics);
  }, [timeframe]);

  const totalCreators = metrics.length;
  const totalFollowers = metrics.reduce((sum, creator) => sum + creator.followers, 0);
  const avgEngagement = metrics.reduce((sum, creator) => sum + creator.engagement_rate, 0) / totalCreators;
  const totalRevenue = metrics.reduce((sum, creator) => sum + creator.monthly_revenue, 0);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    prefix = '',
    suffix = '' 
  }: {
    title: string;
    value: number | string;
    change?: number;
    icon: any;
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card className="glass-morphism border-border/60 hover:scale-105 transition-transform">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {change !== undefined && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {change >= 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CreatorCard = ({ creator }: { creator: CreatorMetrics }) => (
    <Card className="glass-morphism border-border/60 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {creator.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <CardTitle className="text-lg">{creator.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {creator.platform}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {creator.followers.toLocaleString()} followers
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <p className="text-xl font-bold text-green-600">
              ${creator.monthly_revenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
            <p className="text-xl font-bold text-blue-600">
              {creator.engagement_rate}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
            <p className="text-xl font-bold text-purple-600">
              +{creator.growth_rate}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Content Posts</p>
            <p className="text-xl font-bold">
              {creator.content_performance.reduce((sum, content) => sum + content.count, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Creator Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive performance tracking and revenue analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Creators"
            value={totalCreators}
            change={8.2}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Total Followers"
            value={totalFollowers}
            change={12.5}
            icon={Eye}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <MetricCard
            title="Avg Engagement"
            value={avgEngagement.toFixed(1)}
            change={-2.1}
            icon={Heart}
            color="bg-gradient-to-r from-red-500 to-red-600"
            suffix="%"
          />
          <MetricCard
            title="Total Revenue"
            value={totalRevenue}
            change={18.3}
            icon={DollarSign}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            prefix="$"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-morphism border-border/60">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Creator performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart visualization</p>
                      <p className="text-xs text-muted-foreground mt-1">Integration with chart library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/60">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Highest earning creators this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.slice(0, 3).map((creator, index) => (
                      <div key={creator.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{creator.platform}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${creator.monthly_revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{creator.engagement_rate}% engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            <div className="grid gap-6">
              {metrics.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by source for {timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${revenueBreakdown.subscriptions.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Subscriptions</p>
                    <p className="text-xs text-green-600">+12.5%</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${revenueBreakdown.tips.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Tips</p>
                    <p className="text-xs text-green-600">+8.2%</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${revenueBreakdown.merchandise.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Merchandise</p>
                    <p className="text-xs text-red-600">-2.1%</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      ${revenueBreakdown.brand_deals.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Brand Deals</p>
                    <p className="text-xs text-green-600">+25.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="glass-morphism border-border/60">
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Best performing content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Video', 'Image', 'Story', 'Live'].map((type, index) => (
                    <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-gradient-to-t from-blue-400 to-purple-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">{type} Content</p>
                          <p className="text-sm text-muted-foreground">
                            {(Math.random() * 100 + 50).toFixed(0)} posts this month
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(Math.random() * 20 + 5).toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Avg engagement</p>
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
}
