//  PPV ANALYTICS - Creator Dashboard & Insights

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Eye, Users, MessageSquare, Calendar, Target, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PPVMessagesService } from '../services/ppv-messages-service';
import type { PPVMessageStats, PPVMessage, PPVPurchase } from '../types';
import { formatPrice, ANALYTICS_PERIODS } from '../config';

interface PPVAnalyticsProps {
  creatorId: string;
}

export const PPVAnalytics: React.FC<PPVAnalyticsProps> = ({ creatorId }) => {
  const [stats, setStats] = useState<PPVMessageStats | null>(null);
  const [topMessages, setTopMessages] = useState<PPVMessage[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<PPVPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    loadAnalytics();
  }, [creatorId, selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load creator statistics
      const creatorStats = await PPVMessagesService.getCreatorStats(creatorId);
      setStats(creatorStats);

      // Load top performing messages
      const messages = await PPVMessagesService.getMessages({
        creatorId,
        sortBy: 'earnings',
        limit: 5,
      });
      setTopMessages(messages);

      // Load recent purchases
      const purchases = await PPVMessagesService.getCreatorRecentPurchases(creatorId, 10);
      setRecentPurchases(purchases);

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading analytics...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className=\"text-center py-12\">
        <BarChart3 className=\"w-16 h-16 text-gray-400 mx-auto mb-4\" />
        <h3 className=\"text-lg font-semibold text-white mb-2\">Unable to load analytics</h3>
        <p className=\"text-gray-400\">Please try again later</p>
      </div>
    );
  }

  const hasData = stats.totalMessages > 0 || stats.totalEarnings > 0;

  if (!hasData) {
    return (
      <div className=\"text-center py-12\">
        <div className=\"text-6xl mb-6\"></div>
        <h3 className=\"text-xl font-semibold text-white mb-2\">No analytics data yet</h3>
        <p className=\"text-gray-400 mb-4\">Create your first PPV message to start seeing analytics</p>
        <div className=\"text-sm text-purple-200\">
          Analytics will include earnings, views, conversion rates, and buyer insights!
        </div>
      </div>
    );
  }

  // Calculate growth metrics
  const earningsGrowth = stats.earningsLastMonth > 0 
    ? ((stats.earningsThisMonth - stats.earningsLastMonth) / stats.earningsLastMonth * 100)
    : stats.earningsThisMonth > 0 ? 100 : 0;

  const viewsGrowth = stats.viewsLastMonth > 0 
    ? ((stats.viewsThisMonth - stats.viewsLastMonth) / stats.viewsLastMonth * 100)
    : stats.viewsThisMonth > 0 ? 100 : 0;

  return (
    <div className=\"ppv-analytics space-y-6\">
      {/* Period Selector */}
      <div className=\"flex justify-between items-center\">
        <h3 className=\"text-xl font-bold text-white flex items-center gap-2\">
          <TrendingUp className=\"w-5 h-5\" />
          PPV Analytics
        </h3>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm\"
        >
          {ANALYTICS_PERIODS.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics Overview */}
      <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4\">
        <MetricCard
          icon={<DollarSign className=\"w-6 h-6\" />}
          title=\"Total Earnings\"
          value={formatPrice(stats.totalEarnings)}
          growth={earningsGrowth}
          color=\"text-green-400\"
          bgColor=\"bg-green-500/10\"
          borderColor=\"border-green-500/20\"
        />
        
        <MetricCard
          icon={<MessageSquare className=\"w-6 h-6\" />}
          title=\"PPV Messages\"
          value={stats.totalMessages.toString()}
          color=\"text-purple-400\"
          bgColor=\"bg-purple-500/10\"
          borderColor=\"border-purple-500/20\"
        />
        
        <MetricCard
          icon={<Eye className=\"w-6 h-6\" />}
          title=\"Total Views\"
          value={stats.totalViews.toString()}
          growth={viewsGrowth}
          color=\"text-blue-400\"
          bgColor=\"bg-blue-500/10\"
          borderColor=\"border-blue-500/20\"
        />
        
        <MetricCard
          icon={<Users className=\"w-6 h-6\" />}
          title=\"Unique Buyers\"
          value={stats.totalBuyers.toString()}
          color=\"text-yellow-400\"
          bgColor=\"bg-yellow-500/10\"
          borderColor=\"border-yellow-500/20\"
        />
      </div>

      {/* Performance Insights */}
      <div className=\"grid lg:grid-cols-2 gap-6\">
        {/* Monthly Comparison */}
        <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
          <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
            <Calendar className=\"w-5 h-5 text-purple-400\" />
            Monthly Performance
          </h4>
          
          <div className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div className=\"text-center p-4 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl border border-green-500/30\">
                <div className=\"text-sm text-green-300 mb-1\">This Month</div>
                <div className=\"text-xl font-bold text-green-400\">{formatPrice(stats.earningsThisMonth)}</div>
                <div className=\"text-xs text-green-300\">{stats.viewsThisMonth} views</div>
              </div>
              
              <div className=\"text-center p-4 bg-black/20 rounded-xl border border-white/10\">
                <div className=\"text-sm text-gray-400 mb-1\">Last Month</div>
                <div className=\"text-xl font-bold text-white\">{formatPrice(stats.earningsLastMonth)}</div>
                <div className=\"text-xs text-gray-400\">{stats.viewsLastMonth} views</div>
              </div>
            </div>
            
            <div className=\"flex items-center justify-between pt-4 border-t border-white/10\">
              <span className=\"text-gray-300\">Earnings Growth</span>
              <div className={`flex items-center gap-1 font-semibold ${
                earningsGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {earningsGrowth >= 0 ? (
                  <TrendingUp className=\"w-4 h-4\" />
                ) : (
                  <TrendingDown className=\"w-4 h-4\" />
                )}
                <span>{Math.abs(earningsGrowth).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
          <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
            <Target className=\"w-5 h-5 text-purple-400\" />
            Conversion Insights
          </h4>
          
          <div className=\"space-y-4\">
            <div className=\"flex justify-between items-center\">
              <span className=\"text-gray-300\">Conversion Rate</span>
              <span className=\"text-2xl font-bold text-purple-400\">
                {stats.conversionRate.toFixed(1)}%
              </span>
            </div>
            
            <div className=\"flex justify-between items-center\">
              <span className=\"text-gray-300\">Average Price</span>
              <span className=\"text-white font-semibold\">{formatPrice(stats.averagePrice)}</span>
            </div>
            
            <div className=\"flex justify-between items-center\">
              <span className=\"text-gray-300\">Revenue per View</span>
              <span className=\"text-white font-semibold\">
                {stats.totalViews > 0 
                  ? formatPrice(Math.round(stats.totalEarnings / stats.totalViews))
                  : '$0.00'}
              </span>
            </div>
            
            <div className=\"pt-4 border-t border-white/10\">
              <div className=\"text-sm text-gray-400 mb-2\">Performance Level</div>
              <PerformanceBadge conversionRate={stats.conversionRate} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Messages */}
      {topMessages.length > 0 && (
        <div className=\"bg-black/20 rounded-xl border border-white/10 p-6\">
          <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
            <Award className=\"w-5 h-5 text-yellow-400\" />
            Top Performing Messages
          </h4>
          
          <div className=\"space-y-3\">
            {topMessages.map((message, index) => (
              <div key={message.id} className=\"flex items-center gap-4 p-4 bg-white/5 rounded-lg\">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-black' :
                  'bg-purple-600 text-white'
                }`}>
                  {index + 1}
                </div>
                
                <div className=\"flex-1 min-w-0\">
                  <h5 className=\"text-white font-semibold truncate\">{message.title}</h5>
                  <div className=\"flex items-center gap-4 text-sm text-gray-400\">
                    <span>{message.currentViews} views</span>
                    <span>{formatPrice(message.price)} price</span>
                  </div>
                </div>
                
                <div className=\"text-right\">
                  <div className=\"text-green-400 font-bold\">{formatPrice(message.totalEarnings)}</div>
                  <div className=\"text-xs text-gray-400\">earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Purchase Activity */}
      {recentPurchases.length > 0 && (
        <div className=\"bg-black/20 rounded-xl border border-white/10 p-6\">
          <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
            <Users className=\"w-5 h-5 text-purple-400\" />
            Recent Purchase Activity
          </h4>
          
          <div className=\"space-y-3 max-h-80 overflow-y-auto\">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className=\"flex items-center justify-between p-3 bg-white/5 rounded-lg\">
                <div className=\"flex items-center gap-3\">
                  <div className=\"w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center\">
                    {purchase.buyer?.avatarUrl ? (
                      <img 
                        src={purchase.buyer.avatarUrl} 
                        alt={purchase.buyer.username}
                        className=\"w-full h-full rounded-full object-cover\"
                      />
                    ) : (
                      <span className=\"text-white text-sm font-semibold\">
                        {purchase.buyer?.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <div className=\"text-white font-semibold\">@{purchase.buyer?.username}</div>
                    <div className=\"text-gray-400 text-sm truncate max-w-48\">
                      {purchase.message?.title}
                    </div>
                  </div>
                </div>
                
                <div className=\"text-right\">
                  <div className=\"text-green-400 font-semibold\">{formatPrice(purchase.amount)}</div>
                  <div className=\"text-xs text-gray-400\">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className=\"flex flex-wrap gap-3\">
        <Button
          onClick={loadAnalytics}
          className=\"bg-purple-600 hover:bg-purple-700 text-white\"
        >
          <TrendingUp className=\"w-4 h-4 mr-2\" />
          Refresh Data
        </Button>
        
        <Button
          variant=\"outline\"
          className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10\"
        >
          <BarChart3 className=\"w-4 h-4 mr-2\" />
          Export Report
        </Button>
        
        <Button
          variant=\"outline\"
          className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10\"
        >
          <Target className=\"w-4 h-4 mr-2\" />
          Set Goals
        </Button>
      </div>
    </div>
  );
};

// ==================== METRIC CARD COMPONENT ====================

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  growth?: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  growth,
  color,
  bgColor,
  borderColor
}) => (
  <div className={`p-4 ${bgColor} rounded-xl border ${borderColor}`}>
    <div className={`flex items-center gap-2 ${color} mb-2`}>
      {icon}
      <span className=\"text-sm font-medium\">{title}</span>
    </div>
    
    <div className=\"flex items-end justify-between\">
      <div className=\"text-2xl font-bold text-white\">{value}</div>
      
      {growth !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          growth >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {growth >= 0 ? (
            <TrendingUp className=\"w-3 h-3\" />
          ) : (
            <TrendingDown className=\"w-3 h-3\" />
          )}
          <span>{Math.abs(growth).toFixed(1)}%</span>
        </div>
      )}
    </div>
  </div>
);

// ==================== PERFORMANCE BADGE COMPONENT ====================

interface PerformanceBadgeProps {
  conversionRate: number;
}

const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({ conversionRate }) => {
  const getPerformanceLevel = (rate: number) => {
    if (rate >= 15) return { label: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
    if (rate >= 10) return { label: 'Great', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
    if (rate >= 5) return { label: 'Good', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
    if (rate >= 2) return { label: 'Fair', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
    return { label: 'Needs Improvement', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
  };

  const performance = getPerformanceLevel(conversionRate);

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${performance.bgColor} border ${performance.borderColor}`}>
      <div className={`w-2 h-2 rounded-full ${performance.color.replace('text-', 'bg-')} mr-2`}></div>
      <span className={`text-sm font-semibold ${performance.color}`}>
        {performance.label}
      </span>
    </div>
  );
};