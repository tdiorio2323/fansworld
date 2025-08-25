'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Fire, Users, Share2, Heart, ShoppingCart, Zap, TrendingUp, Gift, Star } from 'lucide-react';
import { FlashSale, FlashSalePurchaseRequest } from '../types';
import { FlashSalesService } from '../services/flash-sales-service';
import { formatPrice, formatTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FlashSaleDisplayProps {
  sale: FlashSale;
  onPurchase?: () => void;
  showFullDetails?: boolean;
  enablePurchase?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function FlashSaleDisplay({ 
  sale, 
  onPurchase, 
  showFullDetails = true, 
  enablePurchase = true 
}: FlashSaleDisplayProps) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const end = new Date(sale.endsAt).getTime();
    const difference = end - now;

    if (difference <= 0) {
      setTimeLeft(null);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds, total: difference });
  }, [sale.endsAt]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    // Pre-select all items by default
    setSelectedItems(sale.items.map(item => item.id));
  }, [sale.items]);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    try {
      setLoading(true);
      
      const purchaseRequest: FlashSalePurchaseRequest = {
        saleId: sale.id,
        items: selectedItems.map(itemId => ({ itemId })),
        paymentMethod: 'stripe'
      };

      await FlashSalesService.purchaseFlashSale(purchaseRequest);
      toast.success('Purchase successful! 🎉');
      onPurchase?.();
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && sale.shareableUrl) {
      try {
        await navigator.share({
          title: sale.title,
          text: sale.description,
          url: sale.shareableUrl
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(sale.shareableUrl);
        toast.success('Link copied to clipboard!');
      }
    } else if (sale.shareableUrl) {
      navigator.clipboard.writeText(sale.shareableUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const selectedItemsData = sale.items.filter(item => selectedItems.includes(item.id));
  const selectedOriginalTotal = selectedItemsData.reduce((sum, item) => sum + item.originalPrice, 0);
  const selectedSaleTotal = selectedItemsData.reduce((sum, item) => sum + item.salePrice, 0);
  const selectedSavings = selectedOriginalTotal - selectedSaleTotal;

  const discountPercentage = sale.discountType === 'percentage' 
    ? sale.discountValue 
    : Math.round((sale.discountValue / sale.originalPrice) * 100);

  const isEnded = !timeLeft;
  const isAlmostSoldOut = sale.maxPurchases && (sale.currentPurchases / sale.maxPurchases) >= 0.8;
  const isSoldOut = sale.maxPurchases && sale.currentPurchases >= sale.maxPurchases;

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${
      isEnded ? 'border-gray-300 opacity-75' : 'border-red-200'
    }`}>
      {/* Header with badges */}
      <div className="relative">
        {sale.bannerUrl && (
          <div className="h-64 bg-gradient-to-r from-red-500 to-pink-500 relative overflow-hidden">
            <img 
              src={sale.bannerUrl} 
              alt={sale.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <Fire size={16} />
            {discountPercentage}% OFF
          </div>
          {isAlmostSoldOut && !isSoldOut && (
            <div className="bg-orange-600 text-white px-3 py-2 rounded-full font-medium text-sm shadow-lg">
              Almost Gone!
            </div>
          )}
          {isSoldOut && (
            <div className="bg-gray-600 text-white px-3 py-2 rounded-full font-medium text-sm shadow-lg">
              Sold Out
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Title and Creator */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{sale.title}</h1>
          <p className="text-gray-600 mb-4">{sale.description}</p>
          
          {sale.creator && (
            <div className="flex items-center gap-3 mb-4">
              {sale.creator.avatarUrl && (
                <img 
                  src={sale.creator.avatarUrl} 
                  alt={sale.creator.username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {sale.creator.displayName || sale.creator.username}
                </p>
                <p className="text-sm text-gray-500">@{sale.creator.username}</p>
              </div>
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        {!isEnded && timeLeft && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="text-red-600" size={20} />
                  <span className="font-semibold text-red-800">Sale Ends In:</span>
                </div>
                <span className="text-sm text-red-600 font-medium">
                  {timeLeft.total < 60000 ? 'Last minute!' : 'Limited time!'}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map(({ value, label }) => (
                  <div key={label} className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-red-600">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sale Items */}
        {showFullDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h3>
            <div className="space-y-3">
              {sale.items.map((item) => (
                <div 
                  key={item.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedItems.includes(item.id)
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => enablePurchase && handleItemToggle(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {enablePurchase && (
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => {}}
                          className="rounded text-red-600"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(item.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        Save {formatPrice(item.originalPrice - item.salePrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats and Social Proof */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Users size={16} />
              </div>
              <div className="font-bold text-gray-900">{sale.currentPurchases}</div>
              <div className="text-xs text-gray-500">Sold</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <TrendingUp size={16} />
              </div>
              <div className="font-bold text-gray-900">{sale.conversionRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Conversion</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                <Star size={16} />
              </div>
              <div className="font-bold text-gray-900">{sale.viewCount}</div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {sale.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {sale.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Section */}
        {enablePurchase && !isEnded && (
          <div className="border-t pt-6">
            {selectedItems.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Original Price</div>
                    <div className="font-bold text-gray-900">{formatPrice(selectedOriginalTotal)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Sale Price</div>
                    <div className="font-bold text-green-600">{formatPrice(selectedSaleTotal)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">You Save</div>
                    <div className="font-bold text-red-600">{formatPrice(selectedSavings)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePurchase}
                disabled={loading || selectedItems.length === 0 || isSoldOut}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : isSoldOut ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Buy Now - {formatPrice(selectedSaleTotal)}
                  </>
                )}
              </button>
              
              {sale.allowSharing && (
                <button
                  onClick={handleShare}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Ended Sale Message */}
        {isEnded && (
          <div className="border-t pt-6">
            <div className="bg-gray-100 text-center py-8 rounded-lg">
              <Clock size={48} className="text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sale Has Ended</h3>
              <p className="text-gray-600">
                This flash sale ended on {new Date(sale.endsAt).toLocaleDateString()} at{' '}
                {new Date(sale.endsAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Sale Stats Footer */}
        {showFullDetails && (
          <div className="border-t pt-4 mt-6">
            <div className="text-xs text-gray-500 text-center">
              Sale created on {new Date(sale.createdAt).toLocaleDateString()} • 
              Total revenue: {formatPrice(sale.totalRevenue)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}