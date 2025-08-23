// 🎁 GIFT STATISTICS - Analytics Dashboard

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Gift, DollarSign, Users, Star, Crown, Heart, Sparkles, Calendar, Award } from 'lucide-react';
import { VirtualGiftsService } from '../services/virtual-gifts-service';
import type { GiftStats as GiftStatsType, VirtualGift, GiftTransaction } from '../types';
import { RARITY_COLORS } from '../config';

interface GiftStatsProps {
  userId: string;
}

export const GiftStats: React.FC<GiftStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<GiftStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');

  useEffect(() => {
    loadStats();
  }, [userId, timeframe]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const userStats = await VirtualGiftsService.getUserGiftStats(userId);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load gift stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=\"flex items-center justify-center py-12\">
        <div className=\"w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin\"></div>
        <span className=\"ml-3 text-white\">Loading statistics...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className=\"text-center py-12\">
        <Gift className=\"w-16 h-16 text-gray-400 mx-auto mb-4\" />
        <h3 className=\"text-lg font-semibold text-white mb-2\">Unable to load statistics</h3>
        <p className=\"text-gray-400\">Please try again later</p>
      </div>
    );
  }

  const hasActivity = stats.totalReceived > 0 || stats.totalSent > 0;

  if (!hasActivity) {
    return (
      <div className=\"text-center py-12\">
        <div className=\"text-6xl mb-6\">📊</div>
        <h3 className=\"text-xl font-semibold text-white mb-2\">No gift activity yet</h3>
        <p className=\"text-gray-400 mb-4\">Start sending or receiving gifts to see your statistics</p>
        <div className=\"text-sm text-purple-200\">
          Your gift stats will include earnings, favorite gifts, top senders, and more!
        </div>
      </div>
    );
  }

  return (
    <div className=\"gift-stats space-y-6\">
      {/* Timeframe Selector */}
      <div className=\"flex justify-between items-center\">
        <h3 className=\"text-xl font-bold text-white flex items-center gap-2\">
          <TrendingUp className=\"w-5 h-5\" />
          Gift Statistics
        </h3>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm\"
        >
          <option value=\"week\">Last 7 days</option>
          <option value=\"month\">Last 30 days</option>
          <option value=\"year\">Last year</option>
          <option value=\"all\">All time</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4\">
        <StatCard
          icon={<Gift className=\"w-6 h-6\" />}
          title=\"Gifts Received\"
          value={stats.totalReceived.toLocaleString()}
          color=\"text-green-400\"
          bgColor=\"bg-green-500/10\"
          borderColor=\"border-green-500/20\"
        />
        
        <StatCard
          icon={<DollarSign className=\"w-6 h-6\" />}
          title=\"Total Earnings\"
          value={`$${(stats.totalEarnings / 100).toFixed(2)}`}
          color=\"text-green-400\"
          bgColor=\"bg-green-500/10\"
          borderColor=\"border-green-500/20\"
        />
        
        <StatCard
          icon={<Gift className=\"w-6 h-6\" />}
          title=\"Gifts Sent\"
          value={stats.totalSent.toLocaleString()}
          color=\"text-blue-400\"
          bgColor=\"bg-blue-500/10\"
          borderColor=\"border-blue-500/20\"
        />
        
        <StatCard
          icon={<DollarSign className=\"w-6 h-6\" />}
          title=\"Total Spent\"
          value={`$${(stats.totalSpent / 100).toFixed(2)}`}
          color=\"text-blue-400\"
          bgColor=\"bg-blue-500/10\"
          borderColor=\"border-blue-500/20\"
        />
      </div>

      {/* Detailed Analytics */}
      <div className=\"grid lg:grid-cols-2 gap-6\">
        {/* Favorite Gift */}
        {stats.favoriteGift && (
          <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
            <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
              <Star className=\"w-5 h-5 text-yellow-400\" />
              Favorite Gift
            </h4>
            
            <div className=\"flex items-center gap-4\">
              <div className=\"text-4xl p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30\">
                {stats.favoriteGift.emoji}
              </div>
              <div>
                <h5 className=\"text-xl font-bold text-white\">{stats.favoriteGift.name}</h5>
                <p className=\"text-gray-300\">{stats.favoriteGift.description}</p>
                <div className=\"flex items-center gap-2 mt-2\">
                  <span className={`text-sm ${RARITY_COLORS[stats.favoriteGift.rarity].text}`}>
                    {stats.favoriteGift.rarity}
                  </span>
                  <span className=\"text-green-400 font-semibold\">
                    ${(stats.favoriteGift.price / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Sender */}
        {stats.topSender && (
          <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
            <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
              <Crown className=\"w-5 h-5 text-yellow-400\" />
              Top Supporter
            </h4>
            
            <div className=\"flex items-center gap-4\">
              <div className=\"w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center\">
                <Users className=\"w-6 h-6 text-white\" />
              </div>
              <div>
                <h5 className=\"text-lg font-bold text-white\">@{stats.topSender.username}</h5>
                <p className=\"text-purple-200\">
                  {stats.topSender.totalSent} gift{stats.topSender.totalSent !== 1 ? 's' : ''} sent
                </p>
                <div className=\"text-sm text-gray-400\">Your biggest supporter! 🎉</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {stats.recentGifts.length > 0 && (
        <div className=\"bg-black/20 rounded-xl border border-white/10 p-6\">
          <h4 className=\"text-lg font-semibold text-white mb-4 flex items-center gap-2\">
            <Calendar className=\"w-5 h-5 text-purple-400\" />
            Recent Gift Activity
          </h4>
          
          <div className=\"space-y-3 max-h-80 overflow-y-auto\">
            {stats.recentGifts.slice(0, 10).map((transaction) => (
              <RecentGiftItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
          
          {stats.recentGifts.length > 10 && (
            <div className=\"text-center mt-4\">
              <div className=\"text-sm text-gray-400\">
                Showing 10 of {stats.recentGifts.length} recent gifts
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Insights */}
      <div className=\"grid lg:grid-cols-3 gap-4\">
        <InsightCard
          icon={<TrendingUp className=\"w-5 h-5\" />}
          title=\"Earning Rate\"
          value={calculateEarningRate(stats)}
          description=\"Average per gift received\"
          trend=\"positive\"
        />
        
        <InsightCard
          icon={<Gift className=\"w-5 h-5\" />}
          title=\"Gift Ratio\"
          value={calculateGiftRatio(stats)}
          description=\"Received vs Sent\"
          trend={stats.totalReceived >= stats.totalSent ? 'positive' : 'neutral'}
        />
        
        <InsightCard
          icon={<Award className=\"w-5 h-5\" />}
          title=\"Generosity Score\"
          value={calculateGenerosityScore(stats)}
          description=\"Based on giving patterns\"
          trend=\"positive\"
        />
      </div>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  bgColor,
  borderColor
}) => (
  <div className={`p-4 ${bgColor} rounded-xl border ${borderColor}`}>
    <div className={`flex items-center gap-2 ${color} mb-2`}>
      {icon}
      <span className=\"text-sm font-medium\">{title}</span>
    </div>
    <div className=\"text-2xl font-bold text-white\">{value}</div>
  </div>
);

interface RecentGiftItemProps {
  transaction: GiftTransaction;
}

const RecentGiftItem: React.FC<RecentGiftItemProps> = ({ transaction }) => (
  <div className=\"flex items-center justify-between p-3 bg-white/5 rounded-lg\">
    <div className=\"flex items-center gap-3\">
      <div className=\"text-lg\">{transaction.gift?.emoji}</div>
      <div>
        <div className=\"text-white text-sm font-medium\">
          Received {transaction.quantity}x {transaction.gift?.name}
        </div>
        <div className=\"text-gray-400 text-xs\">
          From: {transaction.isAnonymous ? 'Anonymous' : `@${transaction.sender?.username}`}
        </div>
        {transaction.message && (
          <div className=\"text-purple-200 text-xs mt-1 italic\">
            \"{transaction.message}\"
          </div>
        )}
      </div>
    </div>
    
    <div className=\"text-right\">
      <div className=\"text-green-400 font-semibold text-sm\">
        +${(transaction.amount / 100).toFixed(2)}
      </div>
      <div className=\"text-gray-400 text-xs\">
        {new Date(transaction.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  trend: 'positive' | 'negative' | 'neutral';
}

const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  title,
  value,
  description,
  trend
}) => {
  const trendColor = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  }[trend];

  const trendIcon = {
    positive: <TrendingUp className=\"w-4 h-4\" />,
    negative: <TrendingDown className=\"w-4 h-4\" />,
    neutral: null
  }[trend];

  return (
    <div className=\"p-4 bg-black/20 rounded-xl border border-white/10\">
      <div className=\"flex items-center gap-2 text-purple-400 mb-2\">
        {icon}
        <span className=\"text-sm font-medium\">{title}</span>
      </div>
      
      <div className=\"flex items-center gap-2 mb-1\">
        <div className=\"text-xl font-bold text-white\">{value}</div>
        <div className={trendColor}>
          {trendIcon}
        </div>
      </div>
      
      <div className=\"text-xs text-gray-400\">{description}</div>
    </div>
  );
};

// ==================== UTILITY FUNCTIONS ====================

const calculateEarningRate = (stats: GiftStatsType): string => {
  if (stats.totalReceived === 0) return '$0.00';
  const rate = stats.totalEarnings / stats.totalReceived;
  return `$${(rate / 100).toFixed(2)}`;
};

const calculateGiftRatio = (stats: GiftStatsType): string => {
  if (stats.totalSent === 0 && stats.totalReceived === 0) return '0:0';
  if (stats.totalSent === 0) return `${stats.totalReceived}:0`;
  if (stats.totalReceived === 0) return `0:${stats.totalSent}`;
  
  const ratio = stats.totalReceived / stats.totalSent;
  return `${ratio.toFixed(1)}:1`;
};

const calculateGenerosityScore = (stats: GiftStatsType): string => {
  // Simple scoring based on gifts sent and amount spent
  const baseScore = Math.min(stats.totalSent * 10, 100);
  const spendingBonus = Math.min((stats.totalSpent / 100) * 2, 100);
  const totalScore = Math.min(baseScore + spendingBonus, 1000);
  
  return Math.round(totalScore).toLocaleString();
};