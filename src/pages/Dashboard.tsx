import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Plus,
  Settings,
  Bell,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ContentUpload } from "@/components/ContentUpload";
import { ContentManager } from "@/components/ContentManager";
import { supabase } from '@/integrations/supabase/supabase';
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
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CABANA</h1>
                <p className="text-xs text-gray-500">Creator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64 h-9 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => alert('Notifications feature coming soon! 🔔')}>
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/settings')}>
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.display_name || 'Creator'}! 👋
          </h2>
          <p className="text-gray-600">
            Here's how your content is performing today.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border border-gray-200 p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Upload Content
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Manage Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatCurrency(stats.totalEarnings)}
                  </div>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(stats.monthlyEarnings)} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Subscribers</CardTitle>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.subscribers.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-600">
                    +{stats.newSubscribers} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.totalViews > 0 ? (stats.totalViews / 1000000).toFixed(1) + 'M' : '2.4M'}
                  </div>
                  <p className="text-sm text-purple-600">
                    +12.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Content Posts</CardTitle>
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.totalPosts || 42}
                  </div>
                  <p className="text-sm text-amber-600">
                    +{stats.monthlyPosts || 8} this month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  onClick={() => alert('Photo upload feature coming soon! 📸')}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Upload Photo</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  onClick={() => alert('Video upload feature coming soon! 🎥')}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Upload Video</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  onClick={() => alert('Messaging feature coming soon! 💬')}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Send Message</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  onClick={() => alert('Analytics dashboard coming soon! 📊')}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">View Analytics</span>
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Earnings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      Recent Earnings
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your latest income from the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">No transactions yet</p>
                        <p className="text-gray-500 text-sm">Start creating content to earn!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Mock transaction data */}
                        {[
                          { id: '1', type: 'Content Purchase', amount: 2500, date: 'Today' },
                          { id: '2', type: 'Subscription', amount: 1500, date: 'Yesterday' },
                          { id: '3', type: 'Tip', amount: 500, date: '2 days ago' }
                        ].map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900">{transaction.type}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                +${(transaction.amount / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4 border-gray-300 hover:bg-gray-50">
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Performing Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      Top Performing Content
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Your highest earning posts this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock content data */}
                      {[
                        { id: '1', title: 'Behind the scenes photoshoot', views: 15240, earnings: 450, type: 'photo' },
                        { id: '2', title: 'Exclusive workout routine', views: 8960, earnings: 280, type: 'video' },
                        { id: '3', title: 'Q&A with fans', views: 6720, earnings: 180, type: 'live' }
                      ].map((content) => (
                        <div key={content.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {content.type === 'video' ? (
                              <Video className="w-6 h-6 text-gray-500" />
                            ) : content.type === 'live' ? (
                              <MessageCircle className="w-6 h-6 text-gray-500" />
                            ) : (
                              <Camera className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {content.views.toLocaleString()} views
                              </span>
                              <span className="text-green-600 font-medium">
                                ${content.earnings}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-gray-300 hover:bg-gray-50">
                      View All Content
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
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
  );
}