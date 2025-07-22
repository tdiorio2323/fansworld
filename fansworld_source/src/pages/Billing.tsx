import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Receipt, 
  Download,
  Plus,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Crown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { 
  useStripeCustomer, 
  useStripeSubscriptions, 
  usePaymentMethods, 
  usePaymentTransactions,
  useCommissionPayments,
  useStripeActions 
} from "@/hooks/useStripePayments";
import { useToast } from "@/hooks/use-toast";

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { customer } = useStripeCustomer();
  const { subscriptions } = useStripeSubscriptions();
  const { paymentMethods, setDefaultPaymentMethod, removePaymentMethod } = usePaymentMethods();
  const { transactions } = usePaymentTransactions();
  const { commissionPayments } = useCommissionPayments();
  const { createCheckoutSession } = useStripeActions();
  const { toast } = useToast();

  const plans = [
    {
      id: 'starter',
      name: 'Starter Package',
      price: '$2,500',
      period: 'per month',
      commission: '30%',
      features: [
        'Account management & optimization',
        'Content planning & strategy', 
        'Basic promotion & marketing',
        'Weekly performance reports',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: '$5,000',
      period: 'per month',
      commission: '25%',
      features: [
        'Full content creation & management',
        'Cross-platform management',
        'Brand partnership coordination',
        'Social media management',
        '24/7 priority support',
        'Legal consultation',
        'Custom branding assets'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite Package',
      price: '$10,000',
      period: 'per month',
      commission: '20%',
      features: [
        'Complete business management',
        'Personal brand development',
        'Legal & contract support',
        'PR & media relations',
        'Investment advisory',
        'Tax planning assistance',
        'Personal assistant services',
        'Executive coaching'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      const result = await createCheckoutSession.mutateAsync({
        priceId: `price_${planId}_monthly`,
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/billing?canceled=true`
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: "Subscription Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod.mutateAsync(paymentMethodId);
      toast({
        title: "Payment Method Updated",
        description: "Default payment method has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update default payment method.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    try {
      await removePaymentMethod.mutateAsync(paymentMethodId);
      toast({
        title: "Payment Method Removed",
        description: "Payment method has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Failed to remove payment method.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
      case 'paid':
      case 'active':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
      case 'canceled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const currentSubscription = subscriptions?.find(sub => sub.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Billing & Payments</h1>
              <p className="text-muted-foreground">
                Manage your subscription, payment methods, and view transaction history
              </p>
            </div>
          </div>

          {/* Current Subscription Status */}
          {currentSubscription && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <CardTitle>Current Subscription</CardTitle>
                  </div>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Plan</Label>
                    <p className="font-semibold capitalize">Premium Package</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Next Payment</Label>
                    <p className="font-semibold">
                      {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Amount</Label>
                    <p className="font-semibold">$5,000/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="payments">Payment Methods</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Management Package</CardTitle>
                  <CardDescription>
                    Select the perfect package for your creator journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card 
                        key={plan.id}
                        className={`relative cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                        } ${plan.popular ? 'border-primary' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                            Most Popular
                          </Badge>
                        )}
                        
                        <CardHeader className="text-center">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <div className="mt-4">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground ml-2">{plan.period}</span>
                          </div>
                          <p className="text-sm text-primary">{plan.commission} commission rate</p>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className="w-full"
                            variant={currentSubscription ? "outline" : "default"}
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={createCheckoutSession.isPending}
                          >
                            {currentSubscription ? 'Change Plan' : 'Subscribe Now'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment methods</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods?.map((method) => (
                      <Card key={method.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {method.brand?.toUpperCase()} •••• {method.last4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.exp_month}/{method.exp_year}
                              </p>
                            </div>
                            {method.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!method.is_default && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(method.id)}
                                disabled={setDefaultPaymentMethod.isPending}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              disabled={removePaymentMethod.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {(!paymentMethods || paymentMethods.length === 0) && (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                        <p className="text-muted-foreground mb-4">
                          Add a payment method to start your subscription
                        </p>
                        <Button>Add Your First Payment Method</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View all your payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions?.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium">{transaction.description || 'TD Studios Management Fee'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()} • 
                              <span className="capitalize ml-1">{transaction.transaction_type.replace('_', ' ')}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(transaction.amount)}</p>
                          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {(!transactions || transactions.length === 0) && (
                      <div className="text-center py-8">
                        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                        <p className="text-muted-foreground">
                          Your transaction history will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,230</div>
                    <div className="text-sm text-green-500">+15% from last month</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Commission Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$11,307</div>
                    <div className="text-sm text-blue-500">25% commission rate</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      Next Payout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Jan 31</div>
                    <div className="text-sm text-purple-500">$3,450 pending</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Commission Payments</CardTitle>
                  <CardDescription>Your commission payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commissionPayments?.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium">Commission Payment</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(payment.amount)}</p>
                          <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {(!commissionPayments || commissionPayments.length === 0) && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Commission Payments</h3>
                        <p className="text-muted-foreground">
                          Commission payments will appear here once you start earning
                        </p>
                      </div>
                    )}
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