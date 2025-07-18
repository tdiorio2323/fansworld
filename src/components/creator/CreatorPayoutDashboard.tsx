import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  Download,
  Settings,
  ExternalLink
} from 'lucide-react';
import {
  useStripeConnect,
  useCreatorEarnings,
  usePayoutRequests,
  usePayoutSchedule,
  useCommissionTracking,
  useCurrencyFormatter,
  usePayoutStatus
} from '@/hooks/useStripeConnect';
import { ConnectAccountOnboarding } from './ConnectAccountOnboarding';
import { PayoutRequestForm } from './PayoutRequestForm';
import { PayoutScheduleSettings } from './PayoutScheduleSettings';
import { EarningsChart } from './EarningsChart';
import { PayoutHistory } from './PayoutHistory';

export const CreatorPayoutDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPayoutRequest, setShowPayoutRequest] = useState(false);
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);

  const { formatCurrency, formatPercentage } = useCurrencyFormatter();
  const { getStatusColor, getStatusText } = usePayoutStatus();
  
  const {
    connectAccount,
    accountLoading,
    hasConnectAccount,
    isOnboardingComplete,
    isVerified,
    canReceivePayouts
  } = useStripeConnect();

  const {
    earnings,
    earningsLoading,
    totalEarnings,
    totalNet,
    totalCommissions,
    totalFees,
    pendingPayouts,
    hasPendingPayouts
  } = useCreatorEarnings();

  const {
    payoutRequests,
    pendingRequests,
    hasPendingRequests,
    createPayoutRequest
  } = usePayoutRequests();

  const {
    payoutSchedule,
    hasSchedule
  } = usePayoutSchedule();

  const {
    commissionTracking,
    averageCommissionRate
  } = useCommissionTracking();

  if (accountLoading || earningsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show onboarding if user doesn't have a Connect account
  if (!hasConnectAccount) {
    return (
      <ConnectAccountOnboarding 
        onComplete={() => setShowOnboarding(false)}
        onCancel={() => setShowOnboarding(false)}
      />
    );
  }

  // Show onboarding completion if account exists but not complete
  if (hasConnectAccount && !isOnboardingComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Complete Your Account Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your payout account has been created but needs to be completed before you can receive payments.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Account Setup Progress</span>
                <span>{isVerified ? '100%' : '50%'}</span>
              </div>
              <Progress value={isVerified ? 100 : 50} className="h-2" />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!isVerified && "Please complete your account verification to enable payouts."}
                {isVerified && !canReceivePayouts && "Your account is verified but payouts are still being processed."}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => setShowOnboarding(true)}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Complete Account Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMonthEarnings = earnings?.find(e => {
    const earningDate = new Date(e.period_start);
    const currentDate = new Date();
    return earningDate.getMonth() === currentDate.getMonth() && 
           earningDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creator Payouts</h1>
          <p className="text-muted-foreground">
            Manage your earnings and payout preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowScheduleSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Schedule Settings
          </Button>
          <Button
            onClick={() => setShowPayoutRequest(true)}
            disabled={!canReceivePayouts || !hasPendingPayouts}
          >
            <Download className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {!canReceivePayouts && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your account is still being set up. Payouts will be available once verification is complete.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              All time gross earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalNet)}</div>
            <p className="text-xs text-muted-foreground">
              After fees and commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pendingPayouts.reduce((sum, p) => sum + p.net_earnings, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayouts.length} pending period{pendingPayouts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(averageCommissionRate)}</div>
            <p className="text-xs text-muted-foreground">
              Average commission rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Earnings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnings?.slice(0, 3).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(earning.period_start).toLocaleDateString()} - {new Date(earning.period_end).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Gross: {formatCurrency(earning.gross_earnings)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(earning.payout_status) as any}>
                          {getStatusText(earning.payout_status)}
                        </Badge>
                        <span className="font-medium">{formatCurrency(earning.net_earnings)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {hasSchedule ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Frequency</span>
                      <span className="capitalize">{payoutSchedule?.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Next Payout</span>
                      <span>{payoutSchedule?.next_payout_date || 'Not scheduled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Minimum Amount</span>
                      <span>{formatCurrency(payoutSchedule?.minimum_payout_amount || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto Payout</span>
                      <Badge variant={payoutSchedule?.auto_payout ? 'default' : 'secondary'}>
                        {payoutSchedule?.auto_payout ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No payout schedule configured</p>
                    <Button onClick={() => setShowScheduleSettings(true)}>
                      Set Up Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsChart earnings={earnings || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earnings?.map((earning) => (
                  <div key={earning.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          {new Date(earning.period_start).toLocaleDateString()} - {new Date(earning.period_end).toLocaleDateString()}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Earnings Period
                        </p>
                      </div>
                      <Badge variant={getStatusColor(earning.payout_status) as any}>
                        {getStatusText(earning.payout_status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Gross Earnings</p>
                        <p className="font-medium">{formatCurrency(earning.gross_earnings)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Commission</p>
                        <p className="font-medium text-red-600">-{formatCurrency(earning.commission_amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Management Fee</p>
                        <p className="font-medium text-red-600">-{formatCurrency(earning.management_fee)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Earnings</p>
                        <p className="font-medium text-green-600">{formatCurrency(earning.net_earnings)}</p>
                      </div>
                    </div>

                    {earning.earnings_breakdown && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Revenue Sources</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {earning.earnings_breakdown.subscription_revenue > 0 && (
                            <div>
                              <span className="text-muted-foreground">Subscriptions: </span>
                              <span>{formatCurrency(earning.earnings_breakdown.subscription_revenue)}</span>
                            </div>
                          )}
                          {earning.earnings_breakdown.tip_revenue > 0 && (
                            <div>
                              <span className="text-muted-foreground">Tips: </span>
                              <span>{formatCurrency(earning.earnings_breakdown.tip_revenue)}</span>
                            </div>
                          )}
                          {earning.earnings_breakdown.ppv_revenue > 0 && (
                            <div>
                              <span className="text-muted-foreground">PPV: </span>
                              <span>{formatCurrency(earning.earnings_breakdown.ppv_revenue)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {hasPendingRequests ? (
                  <div className="space-y-3">
                    {pendingRequests?.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{formatCurrency(request.requested_amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(request.status) as any}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No pending requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowPayoutRequest(true)}
                  disabled={!canReceivePayouts || !hasPendingPayouts}
                  className="w-full"
                >
                  Request Payout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleSettings(true)}
                  className="w-full"
                >
                  Update Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('history')}
                  className="w-full"
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PayoutHistory requests={payoutRequests || []} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showOnboarding && (
        <ConnectAccountOnboarding
          onComplete={() => setShowOnboarding(false)}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

      {showPayoutRequest && (
        <PayoutRequestForm
          earnings={pendingPayouts}
          onSubmit={async (data) => {
            await createPayoutRequest.mutateAsync(data);
            setShowPayoutRequest(false);
          }}
          onCancel={() => setShowPayoutRequest(false)}
        />
      )}

      {showScheduleSettings && (
        <PayoutScheduleSettings
          schedule={payoutSchedule}
          onSave={() => setShowScheduleSettings(false)}
          onCancel={() => setShowScheduleSettings(false)}
        />
      )}
    </div>
  );
};