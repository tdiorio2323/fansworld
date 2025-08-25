'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Fire, Users, Tag, TrendingUp, Plus, Filter, BarChart3 } from 'lucide-react';
import { FlashSale, FlashSaleFilter } from '../types';
import { FlashSalesService } from '../services/flash-sales-service';
import { formatPrice, formatTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FlashSalesProps {
  creatorId?: string;
  variant?: 'creator' | 'buyer' | 'public';
  limit?: number;
}

export default function FlashSales({ 
  creatorId, 
  variant = 'public', 
  limit = 20 
}: FlashSalesProps) {
  const { user } = useAuth();
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FlashSaleFilter>({
    status: 'active',
    sortBy: 'ending_soon',
    limit,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadSales = useCallback(async () => {
    try {
      setLoading(true);
      const filterWithCreator = creatorId 
        ? { ...filter, creatorId } 
        : filter;
      
      const data = await FlashSalesService.getFlashSales(filterWithCreator);
      setSales(data);
    } catch (error) {
      console.error('Failed to load flash sales:', error);
      toast.error('Failed to load flash sales');
    } finally {
      setLoading(false);
    }
  }, [filter, creatorId]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSales(prevSales => 
        prevSales.map(sale => ({
          ...sale,
          // Force re-render for countdown updates
          updatedAt: new Date().toISOString()
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilter: Partial<FlashSaleFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handlePurchase = async (saleId: string, itemIds: string[]) => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }

    try {
      await FlashSalesService.purchaseFlashSale({
        saleId,
        items: itemIds.map(id => ({ itemId: id })),
        paymentMethod: 'stripe'
      });
      
      toast.success('Purchase successful!');
      loadSales();
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Purchase failed. Please try again.');
    }
  };

  const getTimeRemaining = (endsAt: string) => {
    const now = new Date().getTime();
    const end = new Date(endsAt).getTime();
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return null;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, total: timeLeft };
  };

  const CountdownTimer = ({ endsAt }: { endsAt: string }) => {
    const timeLeft = getTimeRemaining(endsAt);
    
    if (!timeLeft) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <Clock size={16} />
          <span className="text-sm font-medium">Sale Ended</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-orange-500" />
        <div className="flex gap-1 text-sm font-mono">
          {timeLeft.days > 0 && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
              {timeLeft.days}d
            </span>
          )}
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            {timeLeft.hours.toString().padStart(2, '0')}h
          </span>
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            {timeLeft.minutes.toString().padStart(2, '0')}m
          </span>
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            {timeLeft.seconds.toString().padStart(2, '0')}s
          </span>
        </div>
      </div>
    );
  };

  const SaleCard = ({ sale }: { sale: FlashSale }) => {
    const timeLeft = getTimeRemaining(sale.endsAt);
    const isEnded = !timeLeft;
    const discountPercent = sale.discountType === 'percentage' 
      ? sale.discountValue 
      : Math.round((sale.discountValue / sale.originalPrice) * 100);

    return (
      <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
        isEnded ? 'border-gray-300 opacity-75' : 'border-red-200 hover:border-red-300'
      }`}>
        {sale.bannerUrl && (
          <div className="relative">
            <img 
              src={sale.bannerUrl} 
              alt={sale.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Fire size={14} />
                {discountPercent}% OFF
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{sale.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{sale.description}</p>
              
              {sale.creator && (
                <div className="flex items-center gap-2 mb-3">
                  {sale.creator.avatarUrl && (
                    <img 
                      src={sale.creator.avatarUrl} 
                      alt={sale.creator.username}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-500">
                    by @{sale.creator.username}
                  </span>
                </div>
              )}
            </div>
            
            {!isEnded && <CountdownTimer endsAt={sale.endsAt} />}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(sale.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(sale.originalPrice)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {sale.currentPurchases} sold
                </div>
                {sale.maxPurchases && (
                  <div className="text-xs">
                    {sale.maxPurchases - sale.currentPurchases} remaining
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {sale.tags.slice(0, 2).map((tag, i) => (
                <span 
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {sale.items.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {sale.items.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Tag size={12} />
                    {item.title}
                  </li>
                ))}
                {sale.items.length > 3 && (
                  <li className="text-xs text-gray-500">
                    +{sale.items.length - 3} more items
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {sale.viewCount} views • {sale.conversionRate.toFixed(1)}% conversion
            </div>
            
            <div className="flex gap-2">
              {variant === 'creator' && user?.id === sale.creatorId ? (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <BarChart3 size={14} />
                  Analytics
                </button>
              ) : (
                !isEnded && (
                  <button 
                    onClick={() => handlePurchase(sale.id, sale.items.map(i => i.id))}
                    disabled={sale.maxPurchases && sale.currentPurchases >= sale.maxPurchases}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Fire size={14} />
                    Buy Now
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fire className="text-red-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">
            {variant === 'creator' ? 'My Flash Sales' : 'Flash Sales'}
          </h2>
        </div>
        
        {variant === 'creator' && user?.id === creatorId && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Create Sale
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Filter size={16} className="text-gray-500" />
        
        <select
          value={filter.status || 'all'}
          onChange={(e) => handleFilterChange({ status: e.target.value as any })}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="all">All Sales</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="ended">Ended</option>
        </select>
        
        <select
          value={filter.sortBy || 'ending_soon'}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="ending_soon">Ending Soon</option>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="biggest_savings">Biggest Savings</option>
        </select>
        
        <select
          value={filter.saleType || ''}
          onChange={(e) => handleFilterChange({ saleType: e.target.value as any })}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="">All Types</option>
          <option value="subscription">Subscriptions</option>
          <option value="ppv_message">PPV Messages</option>
          <option value="virtual_gift">Virtual Gifts</option>
          <option value="bundle">Bundles</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Sales Grid */}
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <Fire size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {variant === 'creator' ? 'No sales created yet' : 'No flash sales available'}
          </h3>
          <p className="text-gray-500 mb-6">
            {variant === 'creator' 
              ? 'Create your first flash sale to boost engagement and revenue'
              : 'Check back soon for exciting flash sale deals'
            }
          </p>
          {variant === 'creator' && user?.id === creatorId && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Create Your First Sale
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}