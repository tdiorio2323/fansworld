import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { MediaTile } from "@/components/MediaTile";
import { ContentUpload } from "@/components/ContentUpload";
import { ContentManager } from "@/components/ContentManager";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  subscribers: number;
  newSubscribers: number;
  totalViews: number;
  monthlyViews: number;
  totalPosts: number;
  monthlyPosts: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  created_at: string;
  status: string;
}

interface Content {
  id: string;
  title: string;
  content_type: string;
  file_url: string | null;
  created_at: string;
  is_premium: boolean | null;
  price: number | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    subscribers: 0,
    newSubscribers: 0,
    totalViews: 0,
    monthlyViews: 0,
    totalPosts: 0,
    monthlyPosts: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [topContent, setTopContent] = useState<Content[]>([]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load creator earnings
      const { data: earnings } = await supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', user.id)
        .single();

      // Load subscription count
      const { data: subscriptions, count: subscriberCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' })
        .eq('creator_id', user.id)
        .eq('status', 'active');

      // Load content count
      const { data: content, count: contentCount } = await supabase
        .from('creator_content')
        .select('*', { count: 'exact' })
        .eq('creator_id', user.id);

      // Load recent transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Load top performing content
      const { data: topPerformingContent } = await supabase
        .from('creator_content')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Calculate monthly stats (basic implementation)
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyTransactions = transactions?.filter(t => 
        new Date(t.created_at) >= monthStart
      ) || [];

      const monthlyContent = content?.filter(c => 
        new Date(c.created_at) >= monthStart
      ) || [];

      setStats({
        totalEarnings: earnings?.total_earnings || 0,
        monthlyEarnings: monthlyTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / 100,
        subscribers: subscriberCount || 0,
        newSubscribers: 0, // Would need more complex query to calculate
        totalViews: 0, // Would need analytics table
        monthlyViews: 0, // Would need analytics table
        totalPosts: contentCount || 0,
        monthlyPosts: monthlyContent.length
      });

      setRecentTransactions(transactions || []);
      setTopContent(topPerformingContent || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
            </div>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upload">Upload Content</TabsTrigger>
              <TabsTrigger value="manage">Manage Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">

            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="card-luxury">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="card-luxury">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <DollarSign className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gradient">
                      {formatCurrency(stats.totalEarnings)}
                    </div>
                    <p className="text-xs text-green-500">
                      +{formatCurrency(stats.monthlyEarnings)} this month
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
                      {stats.subscribers.toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500">
                      +{stats.newSubscribers} this month
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
                      {stats.totalViews > 0 ? (stats.totalViews / 1000000).toFixed(1) + 'M' : '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Analytics coming soon
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
                      {stats.totalPosts}
                    </div>
                    <p className="text-xs text-green-500">
                      +{stats.monthlyPosts} this month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

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
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet.</p>
                    <p className="text-sm">Start creating content to earn!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-2xl">
                        <div>
                          <p className="font-medium">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-500">
                            +{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : topContent.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content uploaded yet.</p>
                    <p className="text-sm">Upload your first content to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topContent.map((content) => (
                      <div key={content.id} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-2xl">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted">
                          {content.file_url ? (
                            <img 
                              src={content.file_url} 
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {content.content_type === 'video' ? (
                                <Video className="w-6 h-6 text-muted-foreground" />
                              ) : (
                                <Camera className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          {content.content_type === 'video' && (
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
                              Analytics coming soon
                            </span>
                            {content.is_premium && content.price && (
                              <span className="text-green-500">
                                ${(content.price / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(content.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded w-24 mx-auto"></div>
                    ) : (
                      stats.subscribers.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                </div>
                
                <div className="text-center p-6 bg-secondary/20 rounded-2xl">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded w-16 mx-auto"></div>
                    ) : (
                      `+${stats.newSubscribers}`
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">New This Month</p>
                </div>
                
                <div className="text-center p-6 bg-secondary/20 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded w-12 mx-auto"></div>
                    ) : (
                      '97%'
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="upload">
              <ContentUpload onUploadComplete={() => {
                setRefreshTrigger(prev => prev + 1);
                loadDashboardData();
              }} />
            </TabsContent>

            <TabsContent value="manage">
              <ContentManager refreshTrigger={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}