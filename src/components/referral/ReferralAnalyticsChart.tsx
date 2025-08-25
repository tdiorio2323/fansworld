import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface AnalyticsData {
  period_type: string;
  period_start: string;
  period_end: string;
  total_clicks: number;
  conversions: number;
  conversion_rate: number;
  gross_revenue: number;
  commission_earned: number;
  network_growth_rate: number;
}

interface ReferralAnalyticsChartProps {
  analytics: AnalyticsData[];
}

export function ReferralAnalyticsChart({ analytics }: ReferralAnalyticsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('daily');
  const [selectedMetric, setSelectedMetric] = useState<string>('conversions');

  // Filter analytics by period
  const filteredAnalytics = analytics
    .filter(a => a.period_type === selectedPeriod)
    .sort((a, b) => new Date(a.period_start).getTime() - new Date(b.period_start).getTime())
    .slice(-30); // Last 30 periods

  // Prepare chart data
  const chartData = filteredAnalytics.map(item => ({
    date: new Date(item.period_start).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    conversions: item.conversions,
    revenue: item.gross_revenue / 100,
    commission: item.commission_earned / 100,
    conversionRate: item.conversion_rate,
    clicks: item.total_clicks
  }));

  // Calculate summary stats
  const summaryStats = {
    totalConversions: filteredAnalytics.reduce((sum, item) => sum + item.conversions, 0),
    totalRevenue: filteredAnalytics.reduce((sum, item) => sum + item.gross_revenue, 0),
    totalCommission: filteredAnalytics.reduce((sum, item) => sum + item.commission_earned, 0),
    avgConversionRate: filteredAnalytics.length > 0
      ? filteredAnalytics.reduce((sum, item) => sum + item.conversion_rate, 0) / filteredAnalytics.length
      : 0
  };

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'conversions':
        return {
          dataKey: 'conversions',
          color: '#3b82f6',
          label: 'Conversions',
          icon: Users,
          formatter: (value: number) => value.toString()
        };
      case 'revenue':
        return {
          dataKey: 'revenue',
          color: '#10b981',
          label: 'Revenue',
          icon: DollarSign,
          formatter: (value: number) => formatCurrency(value * 100)
        };
      case 'commission':
        return {
          dataKey: 'commission',
          color: '#f59e0b',
          label: 'Commission Earned',
          icon: TrendingUp,
          formatter: (value: number) => formatCurrency(value * 100)
        };
      case 'conversionRate':
        return {
          dataKey: 'conversionRate',
          color: '#8b5cf6',
          label: 'Conversion Rate',
          icon: Target,
          formatter: (value: number) => `${value.toFixed(2)}%`
        };
      default:
        return {
          dataKey: 'conversions',
          color: '#3b82f6',
          label: 'Conversions',
          icon: Users,
          formatter: (value: number) => value.toString()
        };
    }
  };

  const metricConfig = getMetricConfig();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalConversions}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From referrals</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalCommission)}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Click to conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your referral performance over time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="conversionRate">Conversion Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={metricConfig.formatter}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => metricConfig.formatter(value)}
                />
                <Line
                  type="monotone"
                  dataKey={metricConfig.dataKey}
                  stroke={metricConfig.color}
                  strokeWidth={2}
                  dot={{ fill: metricConfig.color, r: 4 }}
                  activeDot={{ r: 6 }}
                  name={metricConfig.label}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <p className="text-muted-foreground">No analytics data available for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Track your referral conversion journey</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" tick={{ fill: 'currentColor' }} />
              <YAxis 
                type="category" 
                dataKey="date" 
                tick={{ fill: 'currentColor' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="clicks" fill="#94a3b8" name="Clicks" />
              <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}