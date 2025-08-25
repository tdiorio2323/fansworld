'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Clock, Target, Eye, Share2, Calendar, Award } from 'lucide-react';
import { FlashSaleStats, FlashSaleAnalytics as FlashSaleAnalyticsType, FlashSale } from '../types';
import { FlashSalesService } from '../services/flash-sales-service';
import { formatPrice, formatTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface FlashSaleAnalyticsProps {
  creatorId: string;
  timeRange?: '24h' | '7d' | '30d' | '90d';
  saleId?: string; // For individual sale analytics
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  format?: 'currency' | 'percentage' | 'number';
}

export default function FlashSaleAnalytics({ 
  creatorId, 
  timeRange = '30d',
  saleId 
}: FlashSaleAnalyticsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<FlashSaleStats | null>(null);
  const [analytics, setAnalytics] = useState<FlashSaleAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(timeRange);

  useEffect(() => {
    loadAnalytics();
  }, [creatorId, selectedPeriod, saleId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      if (saleId) {
        // Load individual sale analytics
        const [saleAnalytics] = await Promise.all([
          FlashSalesService.getFlashSaleAnalytics(saleId)
        ]);
        setAnalytics(saleAnalytics);
      } else {
        // Load creator overall stats
        const creatorStats = await FlashSalesService.getCreatorFlashSaleStats(creatorId);
        setStats(creatorStats);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number, format?: 'currency' | 'percentage' | 'number') => {
    switch (format) {
      case 'currency':
        return formatPrice(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getMetricCards = (): MetricCard[] => {
    if (saleId && analytics) {
      return [
        {
          title: 'Total Views',
          value: analytics.views,
          icon: <Eye size={20} />,
          color: 'blue',
          format: 'number'
        },
        {
          title: 'Unique Views',
          value: analytics.uniqueViews,
          icon: <Users size={20} />,
          color: 'purple',
          format: 'number'
        },
        {
          title: 'Purchases',
          value: analytics.purchases,
          icon: <Target size={20} />,
          color: 'green',
          format: 'number'
        },
        {
          title: 'Revenue',
          value: analytics.revenue,
          icon: <DollarSign size={20} />,
          color: 'green',
          format: 'currency'
        },
        {
          title: 'Conversion Rate',
          value: analytics.conversionRate,
          icon: <TrendingUp size={20} />,
          color: 'orange',
          format: 'percentage'
        },
        {
          title: 'Shares',
          value: analytics.shareCount,
          icon: <Share2 size={20} />,
          color: 'blue',
          format: 'number'
        }
      ];
    } else if (stats) {
      return [
        {
          title: 'Total Sales',
          value: stats.totalSales,
          icon: <Target size={20} />,
          color: 'blue',
          format: 'number'
        },
        {
          title: 'Total Revenue',
          value: stats.totalRevenue,
          icon: <DollarSign size={20} />,
          color: 'green',
          format: 'currency'
        },
        {
          title: 'Average Order',
          value: stats.averageOrderValue,
          icon: <BarChart3 size={20} />,
          color: 'purple',
          format: 'currency'
        },
        {
          title: 'Conversion Rate',
          value: stats.conversionRate,
          icon: <TrendingUp size={20} />,
          color: 'orange',
          format: 'percentage'
        },
        {
          title: 'Unique Buyers',
          value: stats.uniqueBuyers,
          icon: <Users size={20} />,
          color: 'blue',
          format: 'number'
        },
        {
          title: 'Repeat Buyers',
          value: stats.repeatBuyers,
          icon: <Award size={20} />,
          color: 'red',
          format: 'number'
        }
      ];
    }
    return [];
  };

  const MetricCard = ({ metric }: { metric: MetricCard }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatValue(Number(metric.value), metric.format)}
          </p>
          {metric.change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${
              metric.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={14} className="mr-1" />
              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% vs last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
          <div className={`text-${metric.color}-600`}>
            {metric.icon}
          </div>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const metrics = getMetricCards();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-red-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">
            {saleId ? 'Sale Analytics' : 'Flash Sales Analytics'}
          </h2>
        </div>
        
        {!saleId && (
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      {saleId && analytics ? (
        <>
          {/* Hourly Performance */}
          <ChartCard title="Hourly Performance">
            <div className="space-y-4">
              {analytics.hourlyBreakdown.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {new Date(hour.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600">{hour.views} views</span>
                    <span className="text-green-600 font-medium">{hour.purchases} sales</span>
                    <span className="text-blue-600 font-medium">{formatPrice(hour.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Traffic Sources */}
          <ChartCard title="Top Referrers">
            <div className="space-y-3">
              {analytics.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{referrer.source}</p>
                    <p className="text-sm text-gray-600">{referrer.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{referrer.conversions} conversions</p>
                    <p className="text-xs text-gray-500">
                      {((referrer.conversions / referrer.views) * 100).toFixed(1)}% rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Device & Geography Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Device Breakdown">
              <div className="space-y-3">
                {Object.entries(analytics.deviceStats).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="capitalize font-medium text-gray-900">{device}</span>
                    <span className="text-blue-600 font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Top Countries">
              <div className="space-y-3">
                {analytics.geographicStats.slice(0, 5).map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{country.country}</p>
                      <p className="text-sm text-gray-600">{country.views} views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatPrice(country.revenue)}</p>
                      <p className="text-xs text-gray-500">{country.purchases} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </>
      ) : stats ? (
        <>
          {/* Sales Performance Over Time */}
          <ChartCard title="Sales by Day">
            <div className="space-y-3">
              {stats.salesByDay.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600">{day.views} views</span>
                    <span className="text-green-600 font-medium">{day.sales} sales</span>
                    <span className="text-blue-600 font-medium">{formatPrice(day.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Peak Performance */}
          <ChartCard title="Performance Insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Peak Sales Hour</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock size={20} />
                    <span className="text-xl font-bold">{stats.peakSalesHour}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Highest performing hour</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">View-to-Sale Rate</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Target size={20} />
                    <span className="text-xl font-bold">{stats.viewToSaleConversion.toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Conversion efficiency</p>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Recent Purchases */}
          {stats.recentPurchases.length > 0 && (
            <ChartCard title="Recent Purchases">
              <div className="space-y-3">
                {stats.recentPurchases.slice(0, 5).map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {purchase.buyer?.avatarUrl && (
                        <img 
                          src={purchase.buyer.avatarUrl} 
                          alt={purchase.buyer.username}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          @{purchase.buyer?.username || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatPrice(purchase.totalAmount)}</p>
                      <p className="text-xs text-gray-500">
                        Saved {formatPrice(purchase.totalSavings)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Top Performing Sale */}
          {stats.topPerformingSale && (
            <ChartCard title="Top Performing Sale">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {stats.topPerformingSale.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {stats.topPerformingSale.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Sales</p>
                        <p className="text-xl font-bold text-blue-600">
                          {stats.topPerformingSale.currentPurchases}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatPrice(stats.topPerformingSale.totalRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversion</p>
                        <p className="text-xl font-bold text-purple-600">
                          {stats.topPerformingSale.conversionRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>
            </ChartCard>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">
            {saleId 
              ? 'Analytics data will appear once the sale receives some activity.'
              : 'Create your first flash sale to see analytics data.'
            }
          </p>
        </div>
      )}
    </div>
  );
}