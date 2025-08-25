import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  FileText, Download, Calendar, TrendingUp, Users, DollarSign,
  Eye, MessageSquare, Heart, Star, Filter, Search, Clock,
  AlertTriangle, CheckCircle, Award, Crown, Target, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  const reportData = [
    { month: 'Jan', revenue: 125000, users: 2400, creators: 145, content: 3200 },
    { month: 'Feb', revenue: 142000, users: 2850, creators: 162, content: 3850 },
    { month: 'Mar', revenue: 168000, users: 3200, creators: 189, content: 4200 },
    { month: 'Apr', revenue: 195000, users: 3650, creators: 218, content: 4800 },
    { month: 'May', revenue: 224000, users: 4100, creators: 245, content: 5200 },
    { month: 'Jun', revenue: 258000, users: 4500, creators: 278, content: 5800 }
  ];

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            Admin Reports
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive platform analytics and reporting
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass border-2 hover:border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold text-gradient">247</p>
              </div>
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Generated Today</p>
                <p className="text-3xl font-bold text-gradient">12</p>
              </div>
              <Activity className="h-12 w-12 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold text-gradient">8</p>
              </div>
              <Clock className="h-12 w-12 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Gen Time</p>
                <p className="text-3xl font-bold text-gradient">2.3s</p>
              </div>
              <Target className="h-12 w-12 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-glass border-2 hover:border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-luxury">
            <TrendingUp className="h-5 w-5" />
            Platform Growth Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(139, 69, 192, 0.3)',
                  borderRadius: '12px'
                }}
              />
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e63" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9c27b0" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="#e91e63" fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="users" stroke="#9c27b0" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass border-2">
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="btn-glass w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              User Activity Report
            </Button>
            <Button className="btn-glass w-full justify-start">
              <Crown className="mr-2 h-4 w-4" />
              Creator Performance
            </Button>
            <Button className="btn-glass w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue Analysis
            </Button>
            <Button className="btn-glass w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              Content Engagement
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2">
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">Weekly Revenue</h4>
                  <p className="text-sm text-muted-foreground">Every Monday 9:00 AM</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">Monthly Analytics</h4>
                  <p className="text-sm text-muted-foreground">1st of each month</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportsPage;