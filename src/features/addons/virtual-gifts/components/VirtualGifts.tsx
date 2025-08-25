//  VIRTUAL GIFTS - MAIN COMPONENT

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '../../feature-flags';
import { Gift, Sparkles, Heart, Crown, Star, DollarSign, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { VirtualGiftsService } from '../services/virtual-gifts-service';
import { GiftCatalog } from './GiftCatalog';
import { GiftStats } from './GiftStats';
import { GiftNotifications } from './GiftNotifications';
import type { VirtualGift, GiftSendRequest, GiftTransaction } from '../types';
import { RARITY_COLORS, CATEGORY_CONFIG, QUICK_AMOUNTS } from '../config';

interface VirtualGiftsProps {
  recipientId?: string;
  recipientName?: string;
  currentUserId?: string;
  showStats?: boolean;
  embedded?: boolean;
}

export const VirtualGifts: React.FC<VirtualGiftsProps> = ({
  recipientId,
  recipientName,
  currentUserId,
  showStats = true,
  embedded = false
}) => {
  // Early return if disabled
  if (!ADDON_FLAGS.VIRTUAL_GIFTS) return null;

  const { toast } = useToast();
  
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<GiftTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'stats' | 'history'>('catalog');

  // Load gifts on component mount
  useEffect(() => {
    loadGifts();
    if (currentUserId) {
      loadRecentTransactions();
    }
  }, [currentUserId]);

  const loadGifts = async () => {
    try {
      const giftList = await VirtualGiftsService.getAllGifts();
      setGifts(giftList);
    } catch (error) {
      console.error('Failed to load gifts:', error);
      toast({
        title: 'Error loading gifts',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  const loadRecentTransactions = async () => {
    if (!currentUserId) return;
    
    try {
      const transactions = await VirtualGiftsService.getUserGiftTransactions(currentUserId, 'all', 10);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleSendGift = async () => {
    if (!selectedGift || !recipientId || !currentUserId) return;

    setIsLoading(true);
    
    try {
      const request: GiftSendRequest = {
        giftId: selectedGift.id,
        recipientId,
        quantity,
        message: message.trim() || undefined,
        isAnonymous
      };

      // Validate request
      const validation = await VirtualGiftsService.validateGiftSend(request, currentUserId);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Send the gift
      const transaction = await VirtualGiftsService.sendGift(request, currentUserId);
      
      // Success feedback
      toast({
        title: ' Gift sent successfully!',
        description: `Sent ${quantity}x ${selectedGift.name} to ${recipientName || 'recipient'}`,
      });

      // Reset form
      setSelectedGift(null);
      setQuantity(1);
      setMessage('');
      setIsAnonymous(false);
      setIsOpen(false);

      // Refresh transactions
      loadRecentTransactions();

    } catch (error: any) {
      console.error('Failed to send gift:', error);
      toast({
        title: 'Failed to send gift',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalCost = () => {
    if (!selectedGift) return 0;
    return selectedGift.price * quantity;
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getRarityStyles = (rarity: VirtualGift['rarity']) => {
    return RARITY_COLORS[rarity] || RARITY_COLORS.common;
  };

  const getCategoryStyles = (category: VirtualGift['category']) => {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.hearts;
  };

  // Embedded view (for chat/profile integration)
  if (embedded) {
    return (
      <div className=\"virtual-gifts-embedded\">
        <Button
          onClick={() => setIsOpen(true)}
          className=\"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white\"
          size=\"sm\"
        >
          <Gift className=\"w-4 h-4 mr-2\" />
          Send Gift
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className=\"bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto\">
            <DialogHeader>
              <DialogTitle className=\"text-2xl font-bold text-white flex items-center gap-2\">
                <Gift className=\"w-6 h-6\" />
                Send Gift to {recipientName}
              </DialogTitle>
            </DialogHeader>
            
            <GiftCatalog 
              gifts={gifts}
              onGiftSelect={setSelectedGift}
              selectedGift={selectedGift}
            />

            {selectedGift && (
              <GiftSendForm
                gift={selectedGift}
                quantity={quantity}
                message={message}
                isAnonymous={isAnonymous}
                isLoading={isLoading}
                onQuantityChange={setQuantity}
                onMessageChange={setMessage}
                onAnonymousChange={setIsAnonymous}
                onSend={handleSendGift}
                onCancel={() => setSelectedGift(null)}
                totalCost={getTotalCost()}
              />
            )}
          </DialogContent>
        </Dialog>

        <GiftNotifications userId={currentUserId} />
      </div>
    );
  }

  // Full component view
  return (
    <div className=\"virtual-gifts-container backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6\">
      {/* Header */}
      <div className=\"flex items-center justify-between mb-6\">
        <div className=\"flex items-center gap-3\">
          <div className=\"p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl\">
            <Gift className=\"w-6 h-6 text-white\" />
          </div>
          <div>
            <h2 className=\"text-2xl font-bold text-white\">Virtual Gifts</h2>
            <p className=\"text-purple-200\">Send gifts to show appreciation</p>
          </div>
        </div>
        
        {recipientId && (
          <Button
            onClick={() => setIsOpen(true)}
            className=\"bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white\"
          >
            <Send className=\"w-4 h-4 mr-2\" />
            Send Gift
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className=\"flex gap-2 mb-6\">
        <Button
          variant={activeTab === 'catalog' ? 'default' : 'outline'}
          onClick={() => setActiveTab('catalog')}
          className={activeTab === 'catalog' ? 'bg-purple-600 text-white' : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
        >
          <Gift className=\"w-4 h-4 mr-2\" />
          Catalog
        </Button>
        
        {showStats && currentUserId && (
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'bg-purple-600 text-white' : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
          >
            <Sparkles className=\"w-4 h-4 mr-2\" />
            Stats
          </Button>
        )}
        
        {currentUserId && (
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? 'bg-purple-600 text-white' : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
          >
            <DollarSign className=\"w-4 h-4 mr-2\" />
            History
          </Button>
        )}
      </div>

      {/* Tab Content */}
      <div className=\"tab-content\">
        {activeTab === 'catalog' && (
          <GiftCatalog 
            gifts={gifts}
            onGiftSelect={recipientId ? setSelectedGift : undefined}
            selectedGift={selectedGift}
          />
        )}
        
        {activeTab === 'stats' && currentUserId && (
          <GiftStats userId={currentUserId} />
        )}
        
        {activeTab === 'history' && (
          <GiftHistory transactions={recentTransactions} currentUserId={currentUserId} />
        )}
      </div>

      {/* Gift Sending Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className=\"bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto\">
          <DialogHeader>
            <DialogTitle className=\"text-2xl font-bold text-white flex items-center gap-2\">
              <Gift className=\"w-6 h-6\" />
              Send Gift {recipientName && `to ${recipientName}`}
            </DialogTitle>
          </DialogHeader>
          
          <GiftCatalog 
            gifts={gifts}
            onGiftSelect={setSelectedGift}
            selectedGift={selectedGift}
          />

          {selectedGift && (
            <GiftSendForm
              gift={selectedGift}
              quantity={quantity}
              message={message}
              isAnonymous={isAnonymous}
              isLoading={isLoading}
              onQuantityChange={setQuantity}
              onMessageChange={setMessage}
              onAnonymousChange={setIsAnonymous}
              onSend={handleSendGift}
              onCancel={() => setSelectedGift(null)}
              totalCost={getTotalCost()}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Real-time Notifications */}
      <GiftNotifications userId={currentUserId} />
    </div>
  );
};

// ==================== GIFT SEND FORM COMPONENT ====================

interface GiftSendFormProps {
  gift: VirtualGift;
  quantity: number;
  message: string;
  isAnonymous: boolean;
  isLoading: boolean;
  totalCost: number;
  onQuantityChange: (quantity: number) => void;
  onMessageChange: (message: string) => void;
  onAnonymousChange: (anonymous: boolean) => void;
  onSend: () => void;
  onCancel: () => void;
}

const GiftSendForm: React.FC<GiftSendFormProps> = ({
  gift,
  quantity,
  message,
  isAnonymous,
  isLoading,
  totalCost,
  onQuantityChange,
  onMessageChange,
  onAnonymousChange,
  onSend,
  onCancel
}) => {
  const rarityStyles = RARITY_COLORS[gift.rarity];
  const categoryStyles = CATEGORY_CONFIG[gift.category];

  return (
    <div className=\"mt-6 p-6 bg-black/20 rounded-2xl border border-white/10\">
      {/* Selected Gift Display */}
      <div className=\"flex items-center gap-4 mb-6\">
        <div className={`text-4xl p-4 rounded-2xl ${rarityStyles.bg} ${rarityStyles.border} border`}>
          {gift.emoji}
        </div>
        <div className=\"flex-1\">
          <h3 className=\"text-xl font-bold text-white\">{gift.name}</h3>
          <p className=\"text-gray-300\">{gift.description}</p>
          <div className=\"flex items-center gap-2 mt-2\">
            <Badge className={`${rarityStyles.bg} ${rarityStyles.text} border-0`}>
              {gift.rarity}
            </Badge>
            <Badge className={`${categoryStyles.bgColor} ${categoryStyles.color} border-0`}>
              {categoryStyles.icon} {gift.category}
            </Badge>
            <span className=\"text-green-400 font-semibold\">
              ${(gift.price / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className=\"mb-4\">
        <label className=\"block text-white font-semibold mb-2\">Quantity</label>
        <div className=\"flex items-center gap-2\">
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10\"
          >
            -
          </Button>
          <Input
            type=\"number\"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
            className=\"w-20 text-center bg-black/20 border-purple-500/30 text-white\"
            min={1}
            max={99}
          />
          <Button
            variant=\"outline\"
            size=\"sm\"
            onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
            disabled={quantity >= 99}
            className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10\"
          >
            +
          </Button>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className=\"mb-4\">
        <label className=\"block text-white font-semibold mb-2\">Quick Amounts</label>
        <div className=\"flex flex-wrap gap-2\">
          {QUICK_AMOUNTS.map(({ label, value }) => {
            const suggestedQuantity = Math.ceil(value / gift.price);
            return (
              <Button
                key={value}
                variant=\"outline\"
                size=\"sm\"
                onClick={() => onQuantityChange(suggestedQuantity)}
                className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10\"
              >
                {label} ({suggestedQuantity}x)
              </Button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div className=\"mb-4\">
        <label className=\"block text-white font-semibold mb-2\">Message (optional)</label>
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder=\"Add a personal message...\";
          className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
          maxLength={200}
        />
        <div className=\"text-right text-xs text-gray-400 mt-1\">
          {message.length}/200
        </div>
      </div>

      {/* Anonymous Option */}
      <div className=\"mb-6\">
        <label className=\"flex items-center gap-2 text-white cursor-pointer\">
          <input
            type=\"checkbox\"
            checked={isAnonymous}
            onChange={(e) => onAnonymousChange(e.target.checked)}
            className=\"rounded border-purple-500/30\"
          />
          Send anonymously
        </label>
      </div>

      {/* Total Cost */}
      <div className=\"mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30\">
        <div className=\"flex justify-between items-center\">
          <span className=\"text-white font-semibold\">Total Cost:</span>
          <span className=\"text-2xl font-bold text-green-400\">
            ${(totalCost / 100).toFixed(2)}
          </span>
        </div>
        <div className=\"text-sm text-purple-200 mt-1\">
          {quantity}x {gift.name} @ ${(gift.price / 100).toFixed(2)} each
        </div>
      </div>

      {/* Action Buttons */}
      <div className=\"flex gap-3\">
        <Button
          onClick={onSend}
          disabled={isLoading}
          className=\"flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12\"
        >
          {isLoading ? (
            <>
              <div className=\"w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2\" />
              Sending Gift...
            </>
          ) : (
            <>
              <Send className=\"w-5 h-5 mr-2\" />
              Send Gift (${(totalCost / 100).toFixed(2)})
            </>
          )}
        </Button>
        
        <Button
          onClick={onCancel}
          variant=\"outline\"
          className=\"border-gray-500/30 text-gray-400 hover:bg-gray-500/10\"
        >
          <X className=\"w-5 h-5\" />
        </Button>
      </div>
    </div>
  );
};

// ==================== GIFT HISTORY COMPONENT ====================

interface GiftHistoryProps {
  transactions: GiftTransaction[];
  currentUserId?: string;
}

const GiftHistory: React.FC<GiftHistoryProps> = ({ transactions, currentUserId }) => {
  if (transactions.length === 0) {
    return (
      <div className=\"text-center py-12\">
        <Gift className=\"w-16 h-16 text-gray-400 mx-auto mb-4\" />
        <h3 className=\"text-lg font-semibold text-white mb-2\">No gift history</h3>
        <p className=\"text-gray-400\">Your sent and received gifts will appear here</p>
      </div>
    );
  }

  return (
    <div className=\"space-y-4\">
      {transactions.map((transaction) => {
        const isSent = transaction.senderId === currentUserId;
        const otherUser = isSent ? transaction.recipient : transaction.sender;
        
        return (
          <div key={transaction.id} className=\"p-4 bg-black/20 rounded-xl border border-white/10\">
            <div className=\"flex items-center justify-between\">
              <div className=\"flex items-center gap-3\">
                <div className=\"text-2xl\">{transaction.gift?.emoji}</div>
                <div>
                  <div className=\"text-white font-semibold\">
                    {isSent ? 'Sent' : 'Received'} {transaction.quantity}x {transaction.gift?.name}
                  </div>
                  <div className=\"text-sm text-gray-400\">
                    {isSent ? 'To' : 'From'}: {transaction.isAnonymous ? 'Anonymous' : otherUser?.username}
                  </div>
                  {transaction.message && (
                    <div className=\"text-sm text-purple-200 mt-1 italic\">
                      \"{transaction.message}\"
                    </div>
                  )}
                </div>
              </div>
              
              <div className=\"text-right\">
                <div className={`font-semibold ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                  {isSent ? '-' : '+'}${(transaction.amount / 100).toFixed(2)}
                </div>
                <div className=\"text-xs text-gray-400\">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};