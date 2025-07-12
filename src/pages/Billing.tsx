import { useState } from "react";
import { 
  CreditCard, 
  Download, 
  Eye, 
  Plus, 
  Calendar,
  DollarSign,
  TrendingUp,
  Wallet,
  Mail,
  Banknote,
  MoreHorizontal,
  Check,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/Navbar";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
  bankName?: string;
  accountNumber?: string;
}

interface Transaction {
  id: string;
  type: 'subscription' | 'tip' | 'ppv' | 'withdrawal' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  from?: {
    username: string;
    displayName: string;
    avatar: string;
  };
}

interface Subscription {
  id: string;
  creator: {
    username: string;
    displayName: string;
    avatar: string;
  };
  price: number;
  status: 'active' | 'expired' | 'cancelled';
  nextBilling: string;
  startDate: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true
  },
  {
    id: "2",
    type: "paypal",
    email: "tyler@example.com",
    isDefault: false
  },
  {
    id: "3",
    type: "bank",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    isDefault: false
  }
];

const transactions: Transaction[] = [
  {
    id: "1",
    type: "subscription",
    amount: 12.99,
    status: "completed",
    date: "2024-01-15",
    description: "Monthly subscription",
    from: {
      username: "lilu_f",
      displayName: "Lilu ✨",
      avatar: "/placeholder-avatar.jpg"
    }
  },
  {
    id: "2",
    type: "tip",
    amount: 25.00,
    status: "completed",
    date: "2024-01-14",
    description: "Tip for amazing content",
    from: {
      username: "olivia_b",
      displayName: "Olivia 💖",
      avatar: "/placeholder-avatar.jpg"
    }
  },
  {
    id: "3",
    type: "ppv",
    amount: 7.99,
    status: "completed",
    date: "2024-01-13",
    description: "Premium photo set",
    from: {
      username: "milky_di",
      displayName: "Milky Di ✨",
      avatar: "/placeholder-avatar.jpg"
    }
  },
  {
    id: "4",
    type: "refund",
    amount: -5.00,
    status: "completed",
    date: "2024-01-12",
    description: "Refund for cancelled subscription"
  }
];

const subscriptions: Subscription[] = [
  {
    id: "1",
    creator: {
      username: "lilu_f",
      displayName: "Lilu ✨",
      avatar: "/placeholder-avatar.jpg"
    },
    price: 12.99,
    status: "active",
    nextBilling: "2024-02-15",
    startDate: "2024-01-15"
  },
  {
    id: "2",
    creator: {
      username: "olivia_b",
      displayName: "Olivia 💖",
      avatar: "/placeholder-avatar.jpg"
    },
    price: 9.99,
    status: "active",
    nextBilling: "2024-02-10",
    startDate: "2024-01-10"
  },
  {
    id: "3",
    creator: {
      username: "sarah_creator",
      displayName: "Sarah M",
      avatar: "/placeholder-avatar.jpg"
    },
    price: 14.99,
    status: "cancelled",
    nextBilling: "2024-01-28",
    startDate: "2023-12-28"
  }
];

export default function Billing() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalSpent = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const monthlySpending = activeSubscriptions.reduce((sum, s) => sum + s.price, 0);

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'paypal':
        return <Mail className="w-5 h-5" />;
      case 'bank':
        return <Banknote className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <Calendar className="w-4 h-4" />;
      case 'tip':
        return <DollarSign className="w-4 h-4" />;
      case 'ppv':
        return <Eye className="w-4 h-4" />;
      case 'withdrawal':
        return <TrendingUp className="w-4 h-4" />;
      case 'refund':
        return <X className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
      case 'cancelled':
        return 'text-red-500';
      case 'expired':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="fan" username="Tyler" />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Billing & Payments</h1>
              <p className="text-muted-foreground">
                Manage your payment methods, subscriptions, and transaction history
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="btn-luxury">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-luxury">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <DollarSign className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gradient">
                      ${totalSpent.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lifetime spending
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-luxury">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                    <Calendar className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gradient">
                      ${monthlySpending.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Per month recurring
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-luxury">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gradient">
                      {activeSubscriptions.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently subscribed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest spending activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center gap-4 p-3 bg-secondary/20 rounded-2xl">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium capitalize">{transaction.type}</p>
                            <Badge variant="outline" className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          {transaction.from && (
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={transaction.from.avatar} />
                                <AvatarFallback>{transaction.from.displayName[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {transaction.from.displayName}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-bold ${transaction.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {transaction.amount > 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Complete history of all your payments and refunds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium capitalize">{transaction.type}</p>
                              <Badge variant="outline" className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            {transaction.from && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={transaction.from.avatar} />
                                  <AvatarFallback>{transaction.from.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{transaction.from.displayName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {transaction.amount > 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>Your Subscriptions</CardTitle>
                  <CardDescription>Manage your creator subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={subscription.creator.avatar} />
                            <AvatarFallback>{subscription.creator.displayName[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold">{subscription.creator.displayName}</h3>
                            <p className="text-sm text-muted-foreground">@{subscription.creator.username}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Started: {subscription.startDate}</span>
                              {subscription.status === 'active' && (
                                <span>Next billing: {subscription.nextBilling}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold">${subscription.price}/month</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getStatusColor(subscription.status)}>
                              {subscription.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment-methods" className="space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            {getPaymentIcon(method)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold capitalize">
                                {method.type === 'card' ? `${method.brand} •••• ${method.last4}` :
                                 method.type === 'paypal' ? method.email :
                                 `${method.bankName} •••• ${method.accountNumber}`}
                              </h3>
                              {method.isDefault && (
                                <Badge variant="default">Default</Badge>
                              )}
                            </div>
                            {method.type === 'card' && (
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button variant="outline" size="sm">
                              Set Default
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="btn-luxury w-full mt-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Payment Method
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}