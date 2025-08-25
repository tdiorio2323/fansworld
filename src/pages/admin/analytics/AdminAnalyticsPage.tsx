import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, DollarSign, TrendingUp, Eye, Heart, MessageSquare,
  UserPlus, Calendar, Award, Target, Globe, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
  month: string;
  revenue: number;
  users: number;
  engagement: number;
  creators: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const AdminAnalyticsPage: React.FC = () => {
  // Mock data for charts
  const revenueData: AnalyticsData[] = [
    { month: 'Jan', revenue: 125000, users: 2400, engagement: 78, creators: 145 },
    { month: 'Feb', revenue: 142000, users: 2850, engagement: 82, creators: 162 },
    { month: 'Mar', revenue: 168000, users: 3200, engagement: 85, creators: 189 },
    { month: 'Apr', revenue: 195000, users: 3650, engagement: 88, creators: 218 },
    { month: 'May', revenue: 224000, users: 4100, engagement: 92, creators: 245 },
    { month: 'Jun', revenue: 258000, users: 4500, engagement: 94, creators: 278 },
  ];

  const categoryData = [
    { name: 'Premium Content', value: 45, color: '#e91e63' },
    { name: 'Live Streams', value: 28, color: '#9c27b0' },
    { name: 'Tips & Gifts', value: 18, color: '#673ab7' },
    { name: 'Subscriptions', value: 9, color: '#3f51b5' },
  ];

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon }) => (
    <Card className="card-glass border-2 hover:border-primary/30 transition-all duration-500 hover:shadow-luxury">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-gradient">{value}</p>
            <Badge 
              variant={changeType === 'positive' ? 'default' : changeType === 'negative' ? 'destructive' : 'secondary'}
              className={`
                ${changeType === 'positive' ? 'bg-green-500/20 text-green-300 border-green-500/30' : ''}
                ${changeType === 'negative' ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''}
                ${changeType === 'neutral' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : ''}
              `}
            >
              {change}
            </Badge>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-luxury flex items-center justify-center shadow-luxury">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive insights into your premium platform performance
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <Calendar className="mr-2 h-4 w-4" />
            Time Range
          </Button>
          <Button className="btn-luxury">
            <TrendingUp className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$1.2M"
          change="+18.2%"
          changeType="positive"
          icon={<DollarSign className="h-7 w-7 text-white" />}
        />
        <MetricCard
          title="Active Users"
          value="24.5K"
          change="+12.8%"
          changeType="positive"
          icon={<Users className="h-7 w-7 text-white" />}
        />
        <MetricCard
          title="Engagement Rate"
          value="94.2%"
          change="+5.4%"
          changeType="positive"
          icon={<Heart className="h-7 w-7 text-white" />}
        />
        <MetricCard
          title="New Creators"
          value="278"
          change="+23.1%"
          changeType="positive"
          icon={<UserPlus className="h-7 w-7 text-white" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 card-glass border-2 hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <TrendingUp className="h-5 w-5" />
              Revenue Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(139, 69, 192, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e91e63" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#e91e63" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card className="card-glass border-2 hover:border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <Target className="h-5 w-5" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(139, 69, 192, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card className="card-glass border-2 hover:border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <Users className="h-5 w-5" />
              User Growth & Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(139, 69, 192, 0.3)',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#9c27b0" 
                  strokeWidth={3}
                  dot={{ fill: '#9c27b0', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#673ab7" 
                  strokeWidth={3}
                  dot={{ fill: '#673ab7', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Creator Statistics */}
        <Card className="card-glass border-2 hover:border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <Award className="h-5 w-5" />
              Creator Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(139, 69, 192, 0.3)',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="creators" 
                  fill="url(#creatorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="creatorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e91e63" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Stats */}
      <Card className="card-glass border-2 hover:border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-luxury">
            <Zap className="h-5 w-5" />
            Real-time Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gradient">1,247</div>
              <div className="text-sm text-muted-foreground">Live Viewers</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-gradient">892</div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-gradient">$45.2K</div>
              <div className="text-sm text-muted-foreground">Today's Revenue</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-gradient">156</div>
              <div className="text-sm text-muted-foreground">New Signups</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <Globe className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-gradient">89</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-glass border border-white/10">
              <Heart className="h-6 w-6 mx-auto mb-2 text-pink-400" />
              <div className="text-2xl font-bold text-gradient">97.8%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;