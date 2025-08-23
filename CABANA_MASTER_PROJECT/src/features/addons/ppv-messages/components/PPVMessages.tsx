// 🔒 PPV MESSAGES - MAIN COMPONENT

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '../../feature-flags';
import { Lock, Plus, Eye, DollarSign, TrendingUp, Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { PPVMessagesService } from '../services/ppv-messages-service';
import { PPVMessageComposer } from './PPVMessageComposer';
import { PPVMessageViewer } from './PPVMessageViewer';
import { PPVAnalytics } from './PPVAnalytics';
import type { PPVMessage, PPVMessageFilter, PPVMessageStats } from '../types';
import { PPV_PRICING_TIERS, formatPrice, CONTENT_TYPE_CONFIG, PPV_STATUS_CONFIG } from '../config';

interface PPVMessagesProps {
  creatorId?: string;
  currentUserId?: string;
  viewMode?: 'creator' | 'consumer';
  embedded?: boolean;
  showStats?: boolean;
}

export const PPVMessages: React.FC<PPVMessagesProps> = ({
  creatorId,
  currentUserId,
  viewMode = 'consumer',
  embedded = false,
  showStats = true
}) => {
  // Early return if disabled
  if (!ADDON_FLAGS.PPV_MESSAGES) return null;

  const { toast } = useToast();
  
  // State management
  const [messages, setMessages] = useState<PPVMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<PPVMessage | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics' | 'earnings'>('messages');
  const [stats, setStats] = useState<PPVMessageStats | null>(null);
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');

  // Load data on component mount
  useEffect(() => {
    loadMessages();
    if (viewMode === 'creator' && currentUserId) {
      loadStats();
    }
  }, [creatorId, currentUserId, viewMode]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const filter: PPVMessageFilter = {
        creatorId: creatorId || undefined,
        sortBy: 'newest',
        limit: 50,
      };

      // Apply search filter
      if (searchQuery) {
        // Search would be handled server-side in a real implementation
      }

      // Apply price filter
      if (priceFilter !== 'all') {
        switch (priceFilter) {
          case 'low':
            filter.priceRange = { min: 99, max: 999 }; // $0.99 - $9.99
            break;
          case 'mid':
            filter.priceRange = { min: 1000, max: 4999 }; // $10 - $49.99
            break;
          case 'high':
            filter.priceRange = { min: 5000, max: 99999 }; // $50+
            break;
        }
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filter.isActive = statusFilter === 'active';
      }

      const fetchedMessages = await PPVMessagesService.getMessages(filter);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load PPV messages:', error);
      toast({
        title: 'Error loading messages',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!currentUserId) return;
    
    try {
      const creatorStats = await PPVMessagesService.getCreatorStats(currentUserId);
      setStats(creatorStats);
    } catch (error) {
      console.error('Failed to load creator stats:', error);
    }
  };

  const handleMessageCreated = (newMessage: PPVMessage) => {
    setMessages(prev => [newMessage, ...prev]);
    setIsComposerOpen(false);
    loadStats(); // Refresh stats
    
    toast({
      title: '🎉 PPV Message Created!',
      description: `Your message "${newMessage.title}" is now live`,
    });
  };

  const handleMessageClick = (message: PPVMessage) => {
    setSelectedMessage(message);
    setIsViewerOpen(true);
  };

  const handleMessagePurchased = (messageId: string) => {
    // Refresh messages to update purchase status
    loadMessages();
    setIsViewerOpen(false);
    
    toast({
      title: '🔓 Access Granted!',
      description: 'You now have access to this premium content',
    });
  };

  // Filter messages based on search and filters
  const filteredMessages = messages.filter(message => {
    if (searchQuery && !message.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Embedded view (for creator profiles/chat integration)
  if (embedded) {
    return (
      <div className=\"ppv-messages-embedded\">
        <div className=\"flex items-center gap-3 mb-4\">
          <div className=\"p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg\">
            <Lock className=\"w-5 h-5 text-white\" />
          </div>
          <div>
            <h3 className=\"text-lg font-semibold text-white\">Premium Messages</h3>
            <p className=\"text-purple-200 text-sm\">Exclusive content for purchase</p>
          </div>
        </div>

        {loading ? (
          <div className=\"grid grid-cols-2 gap-4\">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className=\"bg-black/20 rounded-xl p-4 animate-pulse\">
                <div className=\"h-24 bg-white/10 rounded-lg mb-3\"></div>
                <div className=\"h-4 bg-white/10 rounded mb-2\"></div>
                <div className=\"h-3 bg-white/10 rounded w-2/3\"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className=\"grid grid-cols-2 gap-4 max-h-96 overflow-y-auto\">
            {filteredMessages.slice(0, 6).map((message) => (
              <PPVMessageCard
                key={message.id}
                message={message}
                onClick={() => handleMessageClick(message)}
                compact={true}
              />
            ))}
          </div>
        )}

        {viewMode === 'creator' && (
          <Button
            onClick={() => setIsComposerOpen(true)}
            className=\"w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700\"
          >
            <Plus className=\"w-4 h-4 mr-2\" />
            Create PPV Message
          </Button>
        )}

        {/* Modal Components */}
        <PPVMessageComposer
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onMessageCreated={handleMessageCreated}
          creatorId={currentUserId!}
        />

        <PPVMessageViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          message={selectedMessage}
          currentUserId={currentUserId}
          onPurchased={handleMessagePurchased}
        />
      </div>
    );
  }

  // Full component view
  return (
    <div className=\"ppv-messages-container backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6\">
      {/* Header */}
      <div className=\"flex items-center justify-between mb-6\">
        <div className=\"flex items-center gap-3\">
          <div className=\"p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl\">
            <Lock className=\"w-6 h-6 text-white\" />
          </div>
          <div>
            <h2 className=\"text-2xl font-bold text-white\">PPV Messages</h2>
            <p className=\"text-purple-200\">
              {viewMode === 'creator' 
                ? 'Monetize your exclusive content' 
                : 'Premium content from creators'}
            </p>
          </div>
        </div>
        
        {viewMode === 'creator' && (
          <Button
            onClick={() => setIsComposerOpen(true)}
            className=\"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white\"
          >
            <Plus className=\"w-4 h-4 mr-2\" />
            Create Message
          </Button>
        )}
      </div>

      {/* Creator Stats Summary */}
      {viewMode === 'creator' && stats && (
        <div className=\"grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
          <StatCard
            icon={<DollarSign className=\"w-5 h-5\" />}
            title=\"Total Earnings\"
            value={formatPrice(stats.totalEarnings)}
            color=\"text-green-400\"
            bgColor=\"bg-green-500/10\"
          />
          <StatCard
            icon={<Lock className=\"w-5 h-5\" />}
            title=\"Messages\"
            value={stats.totalMessages.toString()}
            color=\"text-purple-400\"
            bgColor=\"bg-purple-500/10\"
          />
          <StatCard
            icon={<Eye className=\"w-5 h-5\" />}
            title=\"Total Views\"
            value={stats.totalViews.toString()}
            color=\"text-blue-400\"
            bgColor=\"bg-blue-500/10\"
          />
          <StatCard
            icon={<TrendingUp className=\"w-5 h-5\" />}
            title=\"Conversion\"
            value={`${stats.conversionRate.toFixed(1)}%`}
            color=\"text-yellow-400\"
            bgColor=\"bg-yellow-500/10\"
          />
        </div>
      )}

      {/* Navigation Tabs */}
      <div className=\"flex gap-2 mb-6\">
        <Button
          variant={activeTab === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveTab('messages')}
          className={activeTab === 'messages' 
            ? 'bg-purple-600 text-white' 
            : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
        >
          <Lock className=\"w-4 h-4 mr-2\" />
          Messages
        </Button>
        
        {viewMode === 'creator' && showStats && (
          <>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' 
                ? 'bg-purple-600 text-white' 
                : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
            >
              <TrendingUp className=\"w-4 h-4 mr-2\" />
              Analytics
            </Button>
            
            <Button
              variant={activeTab === 'earnings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('earnings')}
              className={activeTab === 'earnings' 
                ? 'bg-purple-600 text-white' 
                : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
            >
              <DollarSign className=\"w-4 h-4 mr-2\" />
              Earnings
            </Button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className=\"tab-content\">
        {activeTab === 'messages' && (
          <>
            {/* Search and Filters */}
            <div className=\"flex flex-wrap gap-4 items-center mb-6\">
              {/* Search */}
              <div className=\"relative flex-1 min-w-64\">
                <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400\" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=\"Search messages...\"
                  className=\"pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
                />
              </div>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm\"
              >
                <option value=\"all\">All Prices</option>
                <option value=\"low\">Under $10</option>
                <option value=\"mid\">$10 - $50</option>
                <option value=\"high\">Over $50</option>
              </select>

              {/* Status Filter (for creators) */}
              {viewMode === 'creator' && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm\"
                >
                  <option value=\"all\">All Status</option>
                  <option value=\"active\">Active</option>
                  <option value=\"inactive\">Inactive</option>
                  <option value=\"expired\">Expired</option>
                </select>
              )}

              {/* View Style Toggle */}
              <div className=\"flex border border-purple-500/30 rounded-lg overflow-hidden\">
                <Button
                  variant={viewStyle === 'grid' ? 'default' : 'ghost'}
                  size=\"sm\"
                  onClick={() => setViewStyle('grid')}
                  className={`rounded-none ${viewStyle === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:bg-purple-500/10'}`}
                >
                  <Grid className=\"w-4 h-4\" />
                </Button>
                <Button
                  variant={viewStyle === 'list' ? 'default' : 'ghost'}
                  size=\"sm\"
                  onClick={() => setViewStyle('list')}
                  className={`rounded-none ${viewStyle === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:bg-purple-500/10'}`}
                >
                  <List className=\"w-4 h-4\" />
                </Button>
              </div>
            </div>

            {/* Messages Grid/List */}
            {loading ? (
              <MessagesSkeleton viewStyle={viewStyle} />
            ) : filteredMessages.length === 0 ? (
              <EmptyState 
                viewMode={viewMode} 
                onCreateClick={() => setIsComposerOpen(true)} 
              />
            ) : (
              <div className={viewStyle === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'}>
                {filteredMessages.map((message) => (
                  <PPVMessageCard
                    key={message.id}
                    message={message}
                    onClick={() => handleMessageClick(message)}
                    viewStyle={viewStyle}
                    showCreatorInfo={!creatorId}
                    isCreator={viewMode === 'creator'}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'analytics' && viewMode === 'creator' && (
          <PPVAnalytics creatorId={currentUserId!} />
        )}
        
        {activeTab === 'earnings' && viewMode === 'creator' && stats && (
          <EarningsOverview stats={stats} />
        )}
      </div>

      {/* Modal Components */}
      <PPVMessageComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onMessageCreated={handleMessageCreated}
        creatorId={currentUserId!}
      />

      <PPVMessageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        message={selectedMessage}
        currentUserId={currentUserId}
        onPurchased={handleMessagePurchased}
      />
    </div>
  );
};

// ==================== MESSAGE CARD COMPONENT ====================

interface PPVMessageCardProps {
  message: PPVMessage;
  onClick: () => void;
  viewStyle?: 'grid' | 'list';
  showCreatorInfo?: boolean;
  isCreator?: boolean;
  compact?: boolean;
}

const PPVMessageCard: React.FC<PPVMessageCardProps> = ({
  message,
  onClick,
  viewStyle = 'grid',
  showCreatorInfo = false,
  isCreator = false,
  compact = false
}) => {
  const getStatusInfo = () => {
    if (!message.isActive) return PPV_STATUS_CONFIG.inactive;
    if (message.expiresAt && new Date(message.expiresAt) < new Date()) return PPV_STATUS_CONFIG.expired;
    if (message.maxViews && message.currentViews >= message.maxViews) return PPV_STATUS_CONFIG.sold_out;
    return PPV_STATUS_CONFIG.active;
  };

  const statusInfo = getStatusInfo();

  if (viewStyle === 'list' && !compact) {
    return (
      <div
        className=\"flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/10 hover:border-purple-500/30 cursor-pointer transition-all duration-200 hover:scale-105\"
        onClick={onClick}
      >
        {/* Thumbnail */}
        <div className=\"w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0\">
          {message.thumbnailUrl ? (
            <img 
              src={message.thumbnailUrl} 
              alt={message.title}
              className=\"w-full h-full object-cover rounded-xl\"
            />
          ) : (
            <Lock className=\"w-8 h-8 text-white\" />
          )}
        </div>

        {/* Content */}
        <div className=\"flex-1\">
          <div className=\"flex items-start justify-between mb-2\">
            <h3 className=\"text-lg font-semibold text-white line-clamp-1\">{message.title}</h3>
            <div className=\"text-xl font-bold text-green-400\">{formatPrice(message.price)}</div>
          </div>
          
          <p className=\"text-gray-300 text-sm line-clamp-2 mb-2\">{message.description}</p>
          
          <div className=\"flex items-center gap-3 text-xs text-gray-400\">
            {showCreatorInfo && message.creator && (
              <span>@{message.creator.username}</span>
            )}
            <span>{message.currentViews} views</span>
            <span>{formatPrice(message.totalEarnings)} earned</span>
            
            <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}>
              {statusInfo.icon} {statusInfo.label}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ppv-message-card p-4 rounded-xl border border-white/10 hover:border-purple-500/30 cursor-pointer transition-all duration-200 hover:scale-105 bg-black/20 ${compact ? 'h-auto' : 'h-full'}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-3 ${compact ? 'h-20' : 'h-32'}`}>
        {message.thumbnailUrl ? (
          <img 
            src={message.thumbnailUrl} 
            alt={message.title}
            className=\"w-full h-full object-cover rounded-xl\"
          />
        ) : (
          <Lock className={`text-white ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
        )}
      </div>

      {/* Content */}
      <div className=\"flex-1\">
        <div className=\"flex items-start justify-between mb-2\">
          <h3 className={`font-semibold text-white line-clamp-1 ${compact ? 'text-sm' : 'text-lg'}`}>
            {message.title}
          </h3>
          <div className={`font-bold text-green-400 ${compact ? 'text-sm' : 'text-lg'}`}>
            {formatPrice(message.price)}
          </div>
        </div>
        
        {!compact && message.description && (
          <p className=\"text-gray-300 text-sm line-clamp-2 mb-3\">{message.description}</p>
        )}
        
        <div className={`flex items-center justify-between ${compact ? 'text-xs' : 'text-sm'}`}>
          <div className=\"flex items-center gap-2 text-gray-400\">
            <Eye className=\"w-3 h-3\" />
            <span>{message.currentViews}</span>
          </div>
          
          <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}>
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>

        {isCreator && !compact && (
          <div className=\"mt-2 text-xs text-green-400\">
            {formatPrice(message.totalEarnings)} earned
          </div>
        )}
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
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, bgColor }) => (
  <div className={`p-4 ${bgColor} rounded-xl border border-white/10`}>
    <div className={`flex items-center gap-2 ${color} mb-2`}>
      {icon}
      <span className=\"text-sm font-medium\">{title}</span>
    </div>
    <div className=\"text-2xl font-bold text-white\">{value}</div>
  </div>
);

const MessagesSkeleton: React.FC<{ viewStyle: 'grid' | 'list' }> = ({ viewStyle }) => (
  <div className={viewStyle === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className={`bg-black/20 rounded-xl animate-pulse ${viewStyle === 'list' ? 'p-4 flex items-center gap-4' : 'p-4'}`}>
        <div className={viewStyle === 'list' ? 'w-20 h-20 bg-white/10 rounded-xl' : 'h-32 bg-white/10 rounded-xl mb-3'} />
        <div className=\"flex-1\">
          <div className=\"h-4 bg-white/10 rounded mb-2\" />
          <div className=\"h-3 bg-white/10 rounded w-2/3 mb-2\" />
          <div className=\"h-3 bg-white/10 rounded w-1/2\" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC<{ viewMode: 'creator' | 'consumer'; onCreateClick: () => void }> = ({ 
  viewMode, 
  onCreateClick 
}) => (
  <div className=\"text-center py-12\">
    <div className=\"text-6xl mb-6\">🔒</div>
    <h3 className=\"text-xl font-semibold text-white mb-2\">
      {viewMode === 'creator' ? 'No PPV messages yet' : 'No premium content available'}
    </h3>
    <p className=\"text-gray-400 mb-6\">
      {viewMode === 'creator' 
        ? 'Create your first premium message to start monetizing your content' 
        : 'Check back later for exclusive premium content'}
    </p>
    
    {viewMode === 'creator' && (
      <Button
        onClick={onCreateClick}
        className=\"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white\"
      >
        <Plus className=\"w-4 h-4 mr-2\" />
        Create Your First Message
      </Button>
    )}
  </div>
);

const EarningsOverview: React.FC<{ stats: PPVMessageStats }> = ({ stats }) => (
  <div className=\"space-y-6\">
    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
      <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
        <h3 className=\"text-lg font-semibold text-white mb-4\">Monthly Comparison</h3>
        <div className=\"space-y-3\">
          <div className=\"flex justify-between items-center\">
            <span className=\"text-gray-300\">This Month</span>
            <span className=\"text-green-400 font-semibold\">{formatPrice(stats.earningsThisMonth)}</span>
          </div>
          <div className=\"flex justify-between items-center\">
            <span className=\"text-gray-300\">Last Month</span>
            <span className=\"text-gray-400\">{formatPrice(stats.earningsLastMonth)}</span>
          </div>
          <div className=\"flex justify-between items-center pt-2 border-t border-white/10\">
            <span className=\"text-white font-semibold\">Change</span>
            <span className={stats.earningsThisMonth >= stats.earningsLastMonth ? 'text-green-400' : 'text-red-400'}>
              {stats.earningsLastMonth > 0 
                ? `${((stats.earningsThisMonth - stats.earningsLastMonth) / stats.earningsLastMonth * 100).toFixed(1)}%`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      
      <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
        <h3 className=\"text-lg font-semibold text-white mb-4\">Performance Metrics</h3>
        <div className=\"space-y-3\">
          <div className=\"flex justify-between items-center\">
            <span className=\"text-gray-300\">Average Price</span>
            <span className=\"text-white\">{formatPrice(stats.averagePrice)}</span>
          </div>
          <div className=\"flex justify-between items-center\">
            <span className=\"text-gray-300\">Conversion Rate</span>
            <span className=\"text-white\">{stats.conversionRate.toFixed(1)}%</span>
          </div>
          <div className=\"flex justify-between items-center\">
            <span className=\"text-gray-300\">Total Buyers</span>
            <span className=\"text-white\">{stats.totalBuyers}</span>
          </div>
        </div>
      </div>
    </div>
    
    {stats.topPerformingMessage && (
      <div className=\"p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30\">
        <h3 className=\"text-lg font-semibold text-white mb-3\">🏆 Top Performing Message</h3>
        <div className=\"flex items-center gap-4\">
          <div className=\"w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center\">
            <Lock className=\"w-8 h-8 text-white\" />
          </div>
          <div>
            <h4 className=\"text-white font-semibold\">{stats.topPerformingMessage.title}</h4>
            <div className=\"text-green-400 font-semibold\">{formatPrice(stats.topPerformingMessage.totalEarnings)} earned</div>
            <div className=\"text-sm text-gray-300\">{stats.topPerformingMessage.currentViews} views</div>
          </div>
        </div>
      </div>
    )}
  </div>
);