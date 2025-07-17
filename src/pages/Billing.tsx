import { useState, useEffect } from "react";
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
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface DatabaseTransaction {
  id: string;
  type: string;
  amount: number;
  status: string | null;
  created_at: string;
  creator_id: string;
  content_id: string | null;
  currency: string | null;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
}

interface DatabaseSubscription {
  id: string;
  creator_id: string;
  subscriber_id: string;
  amount: number | null;
  status: string | null;
  created_at: string;
  expires_at: string | null;
  currency: string | null;
  interval_type: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

interface CreatorProfile {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface ProcessedTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  description: string;
  creator?: CreatorProfile;
}

interface ProcessedSubscription {
  id: string;
  creator: CreatorProfile;
  price: number;
  status: string;
  nextBilling: string | null;
  startDate: string;
  currency: string;
}

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<ProcessedSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load transactions for the current user
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Error loading transactions:', transactionError);
      }

      // Load subscriptions where user is the subscriber
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('subscriber_id', user?.id)
        .order('created_at', { ascending: false });

      if (subscriptionError) {
        console.error('Error loading subscriptions:', subscriptionError);
      }

      // Get creator profiles for transactions and subscriptions
      const creatorIds = new Set([
        ...(transactionData?.map(t => t.creator_id) || []),
        ...(subscriptionData?.map(s => s.creator_id) || [])
      ]);

      const { data: creatorProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .in('user_id', Array.from(creatorIds));

      if (profileError) {
        console.error('Error loading creator profiles:', profileError);
      }

      // Create creator map for quick lookup
      const creatorMap = new Map<string, CreatorProfile>();
      creatorProfiles?.forEach(profile => {
        creatorMap.set(profile.user_id, profile);
      });

      // Process transactions
      const processedTransactions: ProcessedTransaction[] = (transactionData || []).map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount / 100, // Convert from cents
        status: transaction.status || 'pending',
        date: new Date(transaction.created_at).toLocaleDateString(),
        description: getTransactionDescription(transaction.type, creatorMap.get(transaction.creator_id)),
        creator: creatorMap.get(transaction.creator_id)
      }));

      // Process subscriptions
      const processedSubscriptions: ProcessedSubscription[] = (subscriptionData || []).map(subscription => {
        const creator = creatorMap.get(subscription.creator_id);
        return {
          id: subscription.id,
          creator: creator || {
            user_id: subscription.creator_id,
            username: 'Unknown',
            display_name: 'Unknown Creator',
            avatar_url: null
          },
          price: (subscription.amount || 0) / 100, // Convert from cents
          status: subscription.status || 'active',
          nextBilling: subscription.expires_at,
          startDate: new Date(subscription.created_at).toLocaleDateString(),
          currency: subscription.currency || 'usd'
        };
      });

      setTransactions(processedTransactions);
      setSubscriptions(processedSubscriptions);

    } catch (err) {
      console.error('Error loading billing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load billing data');
      toast({
        title: "Error",
        description: "Failed to load billing information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionDescription = (type: string, creator?: CreatorProfile): string => {
    const creatorName = creator?.display_name || creator?.username || 'Unknown Creator';
    
    switch (type) {
      case 'subscription':
        return `Monthly subscription to ${creatorName}`;
      case 'tip':
        return `Tip sent to ${creatorName}`;
      case 'ppv':
        return `Premium content from ${creatorName}`;
      case 'refund':
        return 'Subscription refund';
      default:
        return `Payment to ${creatorName}`;
    }
  };

  const totalSpent = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const monthlySpending = activeSubscriptions.reduce((sum, s) => sum + s.price, 0);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="lg:pl-64 pb-20 lg:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-luxury p-8">
              <CardContent className="flex flex-col items-center space-y-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground text-center">
                  Please log in to view your billing information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="lg:pl-64 pb-20 lg:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-luxury p-8">
              <CardContent className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading billing information...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="lg:pl-64 pb-20 lg:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-luxury p-8">
              <CardContent className="flex flex-col items-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-semibold">Error Loading Data</h2>
                <p className="text-muted-foreground text-center">{error}</p>
                <Button onClick={loadBillingData} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                          {transaction.creator && (
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={transaction.creator.avatar_url || undefined} />
                                <AvatarFallback>{(transaction.creator.display_name || transaction.creator.username)[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {transaction.creator.display_name || transaction.creator.username}
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
                            {transaction.creator && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={transaction.creator.avatar_url || undefined} />
                                  <AvatarFallback>{(transaction.creator.display_name || transaction.creator.username)[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{transaction.creator.display_name || transaction.creator.username}</span>
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
                            <AvatarImage src={subscription.creator.avatar_url || undefined} />
                            <AvatarFallback>{(subscription.creator.display_name || subscription.creator.username)[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-semibold">{subscription.creator.display_name || subscription.creator.username}</h3>
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
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Payment Methods</h3>
                    <p className="text-muted-foreground mb-6">
                      Add a payment method to make purchases and subscribe to creators.
                    </p>
                    <Button className="btn-luxury">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}