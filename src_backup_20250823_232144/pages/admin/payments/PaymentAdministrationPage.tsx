import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, TrendingUp, AlertTriangle, CheckCircle,
  RefreshCw, Download, Search, Filter, MoreVertical, Calendar,
  Users, Crown, ArrowUpRight, ArrowDownLeft, Clock, Eye,
  Ban, FileText, Zap, Shield, Target, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  type: 'subscription' | 'tip' | 'ppv' | 'refund' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'disputed';
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  creator?: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  description: string;
  paymentMethod: string;
}

interface PaymentStats {
  totalRevenue: number;
  revenueGrowth: number;
  pendingPayouts: number;
  completedTransactions: number;
  disputedTransactions: number;
  averageTransaction: number;
}

const PaymentAdministrationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats: PaymentStats = {
    totalRevenue: 2456789,
    revenueGrowth: 18.2,
    pendingPayouts: 89450,
    completedTransactions: 15678,
    disputedTransactions: 23,
    averageTransaction: 127.50
  };

  const revenueData = [
    { day: 'Mon', revenue: 45000, transactions: 320, payouts: 12000 },
    { day: 'Tue', revenue: 52000, transactions: 380, payouts: 15000 },
    { day: 'Wed', revenue: 48000, transactions: 350, payouts: 13000 },
    { day: 'Thu', revenue: 61000, transactions: 420, payouts: 18000 },
    { day: 'Fri', revenue: 55000, transactions: 390, payouts: 16000 },
    { day: 'Sat', revenue: 73000, transactions: 520, payouts: 22000 },
    { day: 'Sun', revenue: 68000, transactions: 480, payouts: 20000 }
  ];

  const transactions: Transaction[] = [
    {
      id: 'tx_001',
      type: 'subscription',
      amount: 29.99,
      status: 'completed',
      user: {
        name: 'John Doe',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      creator: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40'
      },
      timestamp: '2 hours ago',
      description: 'Monthly VIP subscription',
      paymentMethod: 'Visa ****1234'
    },
    {
      id: 'tx_002',
      type: 'tip',
      amount: 150.00,
      status: 'completed',
      user: {
        name: 'Alex Rivera',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      creator: {
        name: 'Maya Johnson',
        avatar: '/api/placeholder/40/40'
      },
      timestamp: '4 hours ago',
      description: 'Premium content tip',
      paymentMethod: 'Mastercard ****5678'
    },
    {
      id: 'tx_003',
      type: 'payout',
      amount: 2450.00,
      status: 'pending',
      user: {
        name: 'Creator Payout',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      timestamp: '6 hours ago',
      description: 'Weekly creator payout',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'disputed':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <Crown className="h-4 w-4 text-purple-400" />;
      case 'tip':
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'ppv':
        return <Eye className="h-4 w-4 text-blue-400" />;
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-red-400" />;
      case 'payout':
        return <ArrowUpRight className="h-4 w-4 text-orange-400" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <Card className="card-glass border-2 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{transaction.description}</h4>
              <p className="text-sm text-muted-foreground">{transaction.paymentMethod}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient">
              {formatCurrency(transaction.amount)}
            </div>
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={transaction.user.avatar} />
              <AvatarFallback>{transaction.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{transaction.user.name}</p>
              <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism border-primary/20">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Download Receipt
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <Ban className="h-4 w-4 mr-2" />
                Dispute Transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            Payment Administration
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor and manage all platform transactions and payouts
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-gradient">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-blue-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-gradient">+{stats.revenueGrowth}%</div>
            <div className="text-xs text-muted-foreground">Growth</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-gradient">{formatCurrency(stats.pendingPayouts)}</div>
            <div className="text-xs text-muted-foreground">Pending Payouts</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-gradient">{stats.completedTransactions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-red-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <div className="text-2xl font-bold text-gradient">{stats.disputedTransactions}</div>
            <div className="text-xs text-muted-foreground">Disputed</div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-gradient">{formatCurrency(stats.averageTransaction)}</div>
            <div className="text-xs text-muted-foreground">Avg Transaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="card-glass border-2 hover:border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-luxury">
            <Activity className="h-5 w-5" />
            Revenue & Transaction Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(139, 69, 192, 0.3)',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="revenue" fill="#e91e63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="card-glass border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, users, or payment methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-morphism border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 glass-morphism border-white/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-primary/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
              <Button className="btn-glass">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-morphism border-white/20">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-luxury">
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-luxury">
            Pending
          </TabsTrigger>
          <TabsTrigger value="payouts" className="data-[state=active]:bg-gradient-luxury">
            Payouts
          </TabsTrigger>
          <TabsTrigger value="disputes" className="data-[state=active]:bg-gradient-luxury">
            Disputes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {transactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {transactions
              .filter(t => t.status === 'pending')
              .map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Payout Management</h3>
            <p className="text-muted-foreground mb-4">Manage creator payouts and withdrawals</p>
            <Button className="btn-luxury">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payouts
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="disputes">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Dispute Resolution</h3>
            <p className="text-muted-foreground mb-4">Handle transaction disputes and chargebacks</p>
            <Button className="btn-luxury">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Disputes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentAdministrationPage;