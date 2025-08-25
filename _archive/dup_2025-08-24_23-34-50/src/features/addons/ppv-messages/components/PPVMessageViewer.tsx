//  PPV MESSAGE VIEWER - View and Purchase Premium Content

import React, { useState, useEffect } from 'react';
import { Lock, Eye, DollarSign, Clock, Users, Share2, Flag, X, CreditCard, Wallet, Coins, Play, Download, Image as ImageIcon, FileText, Music, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { PPVMessagesService } from '../services/ppv-messages-service';
import type { PPVMessage, PPVPurchase, PPVPurchaseRequest } from '../types';
import { 
  formatPrice, 
  calculateCreatorEarnings, 
  CONTENT_TYPE_CONFIG, 
  PAYMENT_METHODS,
  PPV_STATUS_CONFIG 
} from '../config';

interface PPVMessageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  message: PPVMessage | null;
  currentUserId?: string;
  onPurchased: (messageId: string) => void;
}

export const PPVMessageViewer: React.FC<PPVMessageViewerProps> = ({
  isOpen,
  onClose,
  message,
  currentUserId,
  onPurchased
}) => {
  const { toast } = useToast();

  // State management
  const [purchase, setPurchase] = useState<PPVPurchase | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'wallet' | 'credits'>('stripe');
  const [promoCode, setPromoCode] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [contentLoading, setContentLoading] = useState<Set<string>>(new Set());

  // Load purchase status when message changes
  useEffect(() => {
    if (message && currentUserId && currentUserId !== message.creatorId) {
      loadPurchaseStatus();
    } else {
      setPurchase(null);
    }
  }, [message, currentUserId]);

  const loadPurchaseStatus = async () => {
    if (!message || !currentUserId) return;

    setLoading(true);
    try {
      const existingPurchase = await PPVMessagesService.getUserPurchase(message.id, currentUserId);
      setPurchase(existingPurchase);
    } catch (error) {
      console.error('Failed to load purchase status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!message || !currentUserId) return;

    setPurchasing(true);
    try {
      const request: PPVPurchaseRequest = {
        messageId: message.id,
        paymentMethod: selectedPaymentMethod,
        usePromoCode: promoCode.trim() || undefined,
      };

      const newPurchase = await PPVMessagesService.purchaseMessage(request, currentUserId);
      setPurchase(newPurchase);
      setShowPaymentOptions(false);
      onPurchased(message.id);

    } catch (error: any) {
      toast({
        title: 'Purchase failed',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleShare = async () => {
    if (!message) return;

    try {
      await navigator.share({
        title: message.title,
        text: message.description,
        url: window.location.href + `?ppv=${message.id}`,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href + `?ppv=${message.id}`);
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard',
      });
    }
  };

  const handleContentView = (contentId: string) => {
    // Track content view for analytics
    setContentLoading(prev => new Set([...prev, contentId]));
    
    // Simulate content loading
    setTimeout(() => {
      setContentLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }, 1000);
  };

  const getStatusInfo = (msg: PPVMessage) => {
    if (!msg.isActive) return PPV_STATUS_CONFIG.inactive;
    if (msg.expiresAt && new Date(msg.expiresAt) < new Date()) return PPV_STATUS_CONFIG.expired;
    if (msg.maxViews && msg.currentViews >= msg.maxViews) return PPV_STATUS_CONFIG.sold_out;
    return PPV_STATUS_CONFIG.active;
  };

  if (!message) return null;

  const isCreator = currentUserId === message.creatorId;
  const hasPurchased = purchase && purchase.status === 'completed';
  const canView = isCreator || hasPurchased;
  const statusInfo = getStatusInfo(message);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=\"bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto\">
        <DialogHeader>
          <DialogTitle className=\"text-2xl font-bold text-white flex items-center justify-between\">
            <div className=\"flex items-center gap-3\">
              <Lock className=\"w-6 h-6\" />
              {canView ? 'Premium Content' : 'Locked Content'}
            </div>
            
            <div className=\"flex items-center gap-2\">
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                {statusInfo.icon} {statusInfo.label}
              </Badge>
              
              <Button
                variant=\"outline\"
                size=\"sm\"
                onClick={handleShare}
                className=\"border-white/20 text-white hover:bg-white/10\"
              >
                <Share2 className=\"w-4 h-4\" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className=\"space-y-6\">
          {/* Message Header */}
          <div className=\"space-y-4\">
            {/* Title and Creator */}
            <div>
              <h1 className=\"text-2xl font-bold text-white mb-2\">{message.title}</h1>
              {message.creator && (
                <div className=\"flex items-center gap-3 text-purple-200\">
                  <div className=\"w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center\">
                    {message.creator.avatarUrl ? (
                      <img 
                        src={message.creator.avatarUrl} 
                        alt={message.creator.username}
                        className=\"w-full h-full rounded-full object-cover\"
                      />
                    ) : (
                      <span className=\"text-white text-sm font-semibold\">
                        {message.creator.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className=\"font-semibold\">@{message.creator.username}</div>
                    {message.creator.displayName && (
                      <div className=\"text-sm text-gray-300\">{message.creator.displayName}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {message.description && (
              <p className=\"text-gray-300 text-lg\">{message.description}</p>
            )}

            {/* Preview Text */}
            {message.previewText && !canView && (
              <div className=\"p-4 bg-black/20 rounded-xl border border-white/10\">
                <div className=\"text-white text-sm mb-2\">Preview:</div>
                <div className=\"text-purple-200 italic\">"{message.previewText}..."</div>
              </div>
            )}

            {/* Stats and Info */}
            <div className=\"flex flex-wrap gap-4 text-sm text-gray-400\">
              <div className=\"flex items-center gap-1\">
                <Eye className=\"w-4 h-4\" />
                <span>{message.currentViews} views</span>
              </div>
              
              <div className=\"flex items-center gap-1\">
                <Clock className=\"w-4 h-4\" />
                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
              </div>
              
              {message.expiresAt && (
                <div className=\"flex items-center gap-1 text-red-400\">
                  <Clock className=\"w-4 h-4\" />
                  <span>Expires {new Date(message.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
              
              {message.maxViews && (
                <div className=\"flex items-center gap-1\">
                  <Users className=\"w-4 h-4\" />
                  <span>{message.currentViews}/{message.maxViews} views</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {message.tags && message.tags.length > 0 && (
              <div className=\"flex flex-wrap gap-2\">
                {message.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant=\"secondary\"
                    className=\"bg-purple-500/20 text-purple-300 border-purple-500/30\"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className=\"space-y-4\">
            {canView ? (
              // Show actual content for authorized users
              <div className=\"space-y-6\">
                <div className=\"text-white font-semibold text-lg\">Premium Content</div>
                
                {message.content && message.content.length > 0 ? (
                  <div className=\"space-y-4\">
                    {message.content
                      .sort((a, b) => a.order - b.order)
                      .map((content, index) => (
                        <ContentItem
                          key={content.id || index}
                          content={content}
                          loading={contentLoading.has(content.id || index.toString())}
                          onView={() => handleContentView(content.id || index.toString())}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <div className=\"text-center py-8 text-gray-400\">
                    No content available
                  </div>
                )}
              </div>
            ) : (
              // Show purchase interface for locked content
              <div className=\"space-y-6\">
                {/* Pricing */}
                <div className=\"text-center p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30\">
                  <Lock className=\"w-16 h-16 text-purple-400 mx-auto mb-4\" />
                  <div className=\"text-3xl font-bold text-white mb-2\">{formatPrice(message.price)}</div>
                  <div className=\"text-purple-200 mb-4\">Unlock premium content</div>
                  
                  <div className=\"text-sm text-gray-400 mb-6\">
                    Creator earns: <span className=\"text-green-400\">{formatPrice(calculateCreatorEarnings(message.price))}</span>
                  </div>

                  {!showPaymentOptions ? (
                    <Button
                      onClick={() => setShowPaymentOptions(true)}
                      disabled={!currentUserId || statusInfo.label !== 'Active'}
                      className=\"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold\"
                    >
                      <DollarSign className=\"w-5 h-5 mr-2\" />
                      Purchase Access
                    </Button>
                  ) : (
                    <div className=\"space-y-4 max-w-md mx-auto\">
                      {/* Payment Method Selection */}
                      <div className=\"space-y-3\">
                        <div className=\"text-white font-semibold text-left\">Payment Method</div>
                        {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                          <label
                            key={key}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              selectedPaymentMethod === key
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/20 bg-black/20 hover:border-purple-500/50'
                            }`}
                          >
                            <input
                              type=\"radio\"
                              name=\"payment-method\"
                              value={key}
                              checked={selectedPaymentMethod === key}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                              className=\"sr-only\"
                            />
                            <div className=\"text-2xl\">{method.icon}</div>
                            <div className=\"flex-1 text-left\">
                              <div className=\"text-white font-semibold\">{method.label}</div>
                              <div className=\"text-gray-400 text-sm\">{method.description}</div>
                            </div>
                            {method.processingFee > 0 && (
                              <div className=\"text-xs text-gray-400\">
                                +{(method.processingFee * 100).toFixed(1)}%
                              </div>
                            )}
                          </label>
                        ))}
                      </div>

                      {/* Promo Code */}
                      <div className=\"space-y-2\">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder=\"Promo code (optional)\"
                          className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
                        />
                      </div>

                      {/* Purchase Button */}
                      <div className=\"flex gap-3\">
                        <Button
                          onClick={handlePurchase}
                          disabled={purchasing}
                          className=\"flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12\"
                        >
                          {purchasing ? (
                            <>
                              <div className=\"w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2\" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {React.createElement(
                                selectedPaymentMethod === 'stripe' ? CreditCard :
                                selectedPaymentMethod === 'wallet' ? Wallet :
                                Coins,
                                { className: 'w-5 h-5 mr-2' }
                              )}
                              Pay {formatPrice(message.price)}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => setShowPaymentOptions(false)}
                          variant=\"outline\"
                          className=\"border-gray-500/30 text-gray-400 hover:bg-gray-500/10\"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Preview */}
                {message.content && message.content.length > 0 && (
                  <div className=\"space-y-4\">
                    <div className=\"text-white font-semibold\">
                      Content Preview ({message.content.length} item{message.content.length !== 1 ? 's' : ''})
                    </div>
                    
                    <div className=\"grid grid-cols-2 md:grid-cols-3 gap-4\">
                      {message.content.slice(0, 6).map((content, index) => (
                        <ContentPreview key={content.id || index} content={content} />
                      ))}
                      
                      {message.content.length > 6 && (
                        <div className=\"bg-black/40 rounded-xl p-4 flex items-center justify-center border border-white/10\">
                          <div className=\"text-center text-gray-400\">
                            <div className=\"text-lg font-semibold\">+{message.content.length - 6}</div>
                            <div className=\"text-sm\">more items</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Purchase History (for users who bought) */}
          {purchase && purchase.status === 'completed' && (
            <div className=\"p-4 bg-green-500/10 rounded-xl border border-green-500/20\">
              <div className=\"flex items-center justify-between\">
                <div className=\"text-green-400 font-semibold\"> Purchased</div>
                <div className=\"text-sm text-gray-400\">
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className=\"text-sm text-green-300 mt-1\">
                Paid {formatPrice(purchase.amount)}  Viewed {purchase.viewCount} time{purchase.viewCount !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Creator Actions */}
          {isCreator && (
            <div className=\"p-4 bg-blue-500/10 rounded-xl border border-blue-500/20\">
              <div className=\"text-blue-400 font-semibold mb-2\">Creator Statistics</div>
              <div className=\"grid grid-cols-2 gap-4 text-sm\">
                <div>
                  <div className=\"text-gray-400\">Total Views</div>
                  <div className=\"text-white font-semibold\">{message.currentViews}</div>
                </div>
                <div>
                  <div className=\"text-gray-400\">Total Earnings</div>
                  <div className=\"text-green-400 font-semibold\">{formatPrice(message.totalEarnings)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Report Button (for non-creators) */}
          {!isCreator && (
            <div className=\"text-center\">
              <Button
                variant=\"outline\"
                size=\"sm\"
                className=\"border-red-500/30 text-red-400 hover:bg-red-500/10\"
              >
                <Flag className=\"w-4 h-4 mr-2\" />
                Report Content
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==================== CONTENT ITEM COMPONENT ====================

interface ContentItemProps {
  content: any; // PPVMessageContent
  loading: boolean;
  onView: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ content, loading, onView }) => {
  const typeConfig = CONTENT_TYPE_CONFIG[content.type];

  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return (
          <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
            <div className=\"flex items-center gap-2 mb-4\">
              <FileText className=\"w-5 h-5 text-blue-400\" />
              <span className=\"text-blue-400 font-semibold\">Text Content</span>
            </div>
            <div className=\"text-white whitespace-pre-wrap\">{content.content}</div>
          </div>
        );

      case 'image':
        return (
          <div className=\"bg-black/20 rounded-xl border border-white/10 overflow-hidden\">
            <div className=\"p-4 border-b border-white/10\">
              <div className=\"flex items-center gap-2\">
                <ImageIcon className=\"w-5 h-5 text-green-400\" />
                <span className=\"text-green-400 font-semibold\">Image</span>
              </div>
              {content.caption && (
                <div className=\"text-gray-300 text-sm mt-2\">{content.caption}</div>
              )}
            </div>
            <div className=\"relative\">
              {loading ? (
                <div className=\"h-64 bg-white/5 animate-pulse flex items-center justify-center\">
                  <div className=\"text-gray-400\">Loading image...</div>
                </div>
              ) : (
                <img 
                  src={content.content} 
                  alt={content.caption || 'Premium image'}
                  className=\"w-full h-auto max-h-96 object-contain\"
                  onLoad={onView}
                />
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className=\"bg-black/20 rounded-xl border border-white/10 overflow-hidden\">
            <div className=\"p-4 border-b border-white/10\">
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center gap-2\">
                  <Play className=\"w-5 h-5 text-red-400\" />
                  <span className=\"text-red-400 font-semibold\">Video</span>
                </div>
                {content.duration && (
                  <Badge variant=\"secondary\" className=\"bg-black/20 text-gray-300\">
                    {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                  </Badge>
                )}
              </div>
              {content.caption && (
                <div className=\"text-gray-300 text-sm mt-2\">{content.caption}</div>
              )}
            </div>
            <div className=\"relative\">
              {loading ? (
                <div className=\"h-64 bg-white/5 animate-pulse flex items-center justify-center\">
                  <div className=\"text-gray-400\">Loading video...</div>
                </div>
              ) : (
                <video 
                  src={content.content}
                  controls
                  className=\"w-full h-auto max-h-96\"
                  poster={content.thumbnail}
                  onLoadStart={onView}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
            <div className=\"flex items-center justify-between mb-4\">
              <div className=\"flex items-center gap-2\">
                <Music className=\"w-5 h-5 text-purple-400\" />
                <span className=\"text-purple-400 font-semibold\">Audio</span>
              </div>
              {content.duration && (
                <Badge variant=\"secondary\" className=\"bg-black/20 text-gray-300\">
                  {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
            {content.caption && (
              <div className=\"text-gray-300 text-sm mb-4\">{content.caption}</div>
            )}
            {loading ? (
              <div className=\"h-16 bg-white/5 animate-pulse flex items-center justify-center rounded\">
                <div className=\"text-gray-400\">Loading audio...</div>
              </div>
            ) : (
              <audio 
                src={content.content}
                controls
                className=\"w-full\"
                onLoadStart={onView}
              >
                Your browser does not support the audio tag.
              </audio>
            )}
          </div>
        );

      case 'file':
        return (
          <div className=\"p-6 bg-black/20 rounded-xl border border-white/10\">
            <div className=\"flex items-center justify-between mb-4\">
              <div className=\"flex items-center gap-2\">
                <File className=\"w-5 h-5 text-yellow-400\" />
                <span className=\"text-yellow-400 font-semibold\">File</span>
              </div>
              {content.fileSize && (
                <Badge variant=\"secondary\" className=\"bg-black/20 text-gray-300\">
                  {(content.fileSize / 1024 / 1024).toFixed(1)} MB
                </Badge>
              )}
            </div>
            {content.caption && (
              <div className=\"text-gray-300 text-sm mb-4\">{content.caption}</div>
            )}
            <Button
              onClick={() => {
                onView();
                window.open(content.content, '_blank');
              }}
              className=\"bg-yellow-600 hover:bg-yellow-700 text-white\"
            >
              <Download className=\"w-4 h-4 mr-2\" />
              Download File
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

// ==================== CONTENT PREVIEW COMPONENT ====================

interface ContentPreviewProps {
  content: any; // PPVMessageContent
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  const typeConfig = CONTENT_TYPE_CONFIG[content.type];

  return (
    <div className=\"bg-black/40 rounded-xl p-4 border border-white/10 relative\">
      {/* Lock Overlay */}
      <div className=\"absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm\">
        <Lock className=\"w-8 h-8 text-white\" />
      </div>

      {/* Content Preview */}
      <div className=\"flex items-center gap-2 mb-2\">
        {React.createElement(typeConfig.icon.type, { 
          className: `w-4 h-4 ${typeConfig.color}` 
        })}
        <span className={`text-sm font-semibold ${typeConfig.color}`}>
          {typeConfig.label}
        </span>
      </div>

      <div className=\"h-16 bg-white/5 rounded\" />
      
      {content.caption && (
        <div className=\"text-gray-400 text-xs mt-2 line-clamp-2\">
          {content.caption}
        </div>
      )}
    </div>
  );
};