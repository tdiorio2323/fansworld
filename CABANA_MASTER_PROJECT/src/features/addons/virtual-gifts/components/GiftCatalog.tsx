//  GIFT CATALOG - Browse and Select Gifts

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, Crown, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VirtualGiftsService } from '../services/virtual-gifts-service';
import type { VirtualGift, GiftCatalogCategory } from '../types';
import { RARITY_COLORS, CATEGORY_CONFIG } from '../config';

interface GiftCatalogProps {
  gifts: VirtualGift[];
  onGiftSelect?: (gift: VirtualGift) => void;
  selectedGift?: VirtualGift | null;
  viewMode?: 'grid' | 'list';
}

export const GiftCatalog: React.FC<GiftCatalogProps> = ({
  gifts,
  onGiftSelect,
  selectedGift,
  viewMode: initialViewMode = 'grid'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [categories, setCategories] = useState<GiftCatalogCategory[]>([]);

  // Load categorized gifts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catalogCategories = await VirtualGiftsService.getCatalogByCategories();
        setCategories(catalogCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    if (gifts.length > 0) {
      loadCategories();
    }
  }, [gifts]);

  // Filter gifts based on search and filters
  const filteredGifts = gifts.filter(gift => {
    // Search filter
    if (searchQuery && !gift.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !gift.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && gift.category !== selectedCategory) {
      return false;
    }

    // Rarity filter
    if (selectedRarity !== 'all' && gift.rarity !== selectedRarity) {
      return false;
    }

    // Price range filter
    if (priceRange !== 'all') {
      const price = gift.price;
      switch (priceRange) {
        case 'low':
          if (price > 500) return false; // Under $5
          break;
        case 'mid':
          if (price <= 500 || price > 2000) return false; // $5-$20
          break;
        case 'high':
          if (price <= 2000) return false; // Over $20
          break;
      }
    }

    return true;
  });

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case 'low': return 'Under $5';
      case 'mid': return '$5 - $20';
      case 'high': return 'Over $20';
      default: return 'All Prices';
    }
  };

  const getRarityIcon = (rarity: VirtualGift['rarity']) => {
    switch (rarity) {
      case 'common': return <div className=\"w-2 h-2 bg-gray-400 rounded-full\" />;
      case 'rare': return <div className=\"w-2 h-2 bg-blue-400 rounded-full\" />;
      case 'epic': return <Star className=\"w-3 h-3 text-purple-400\" />;
      case 'legendary': return <Crown className=\"w-3 h-3 text-yellow-400\" />;
    }
  };

  const getCategoryIcon = (category: VirtualGift['category']) => {
    switch (category) {
      case 'hearts': return <Heart className=\"w-4 h-4\" />;
      case 'stars': return <Sparkles className=\"w-4 h-4\" />;
      case 'luxury': return <Crown className=\"w-4 h-4\" />;
      case 'seasonal': return <div className=\"text-pink-400\"></div>;
      case 'custom': return <div className=\"text-indigo-400\"></div>;
    }
  };

  return (
    <div className=\"gift-catalog\">
      {/* Search and Filters */}
      <div className=\"mb-6 space-y-4\">
        {/* Search Bar */}
        <div className=\"relative\">
          <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400\" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=\"Search gifts...\";
            className=\"pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
          />
        </div>

        {/* Filter Controls */}
        <div className=\"flex flex-wrap gap-3 items-center\">
          <div className=\"flex items-center gap-2\">
            <Filter className=\"w-4 h-4 text-gray-400\" />
            <span className=\"text-sm text-gray-400\">Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-1 text-white text-sm\"
          >
            <option value=\"all\">All Categories</option>
            <option value=\"hearts\"> Hearts</option>
            <option value=\"stars\"> Stars</option>
            <option value=\"luxury\"> Luxury</option>
            <option value=\"seasonal\"> Seasonal</option>
            <option value=\"custom\"> Custom</option>
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-1 text-white text-sm\"
          >
            <option value=\"all\">All Rarities</option>
            <option value=\"common\">Common</option>
            <option value=\"rare\">Rare</option>
            <option value=\"epic\">Epic</option>
            <option value=\"legendary\">Legendary</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as any)}
            className=\"bg-black/20 border border-purple-500/30 rounded-lg px-3 py-1 text-white text-sm\"
          >
            <option value=\"all\">All Prices</option>
            <option value=\"low\">Under $5</option>
            <option value=\"mid\">$5 - $20</option>
            <option value=\"high\">Over $20</option>
          </select>

          {/* View Mode Toggle */}
          <div className=\"flex border border-purple-500/30 rounded-lg overflow-hidden ml-auto\">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size=\"sm\"
              onClick={() => setViewMode('grid')}
              className={`rounded-none ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-purple-500/10'}`}
            >
              <Grid className=\"w-4 h-4\" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size=\"sm\"
              onClick={() => setViewMode('list')}
              className={`rounded-none ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-purple-500/10'}`}
            >
              <List className=\"w-4 h-4\" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'all' || selectedRarity !== 'all' || priceRange !== 'all') && (
          <div className=\"flex flex-wrap gap-2 items-center\">
            <span className=\"text-sm text-gray-400\">Active filters:</span>
            
            {searchQuery && (
              <Badge variant=\"secondary\" className=\"bg-purple-500/20 text-purple-300\">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className=\"ml-2 text-purple-400 hover:text-white\"
                >
                  
                </button>
              </Badge>
            )}
            
            {selectedCategory !== 'all' && (
              <Badge variant=\"secondary\" className=\"bg-purple-500/20 text-purple-300\">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className=\"ml-2 text-purple-400 hover:text-white\"
                >
                  
                </button>
              </Badge>
            )}
            
            {selectedRarity !== 'all' && (
              <Badge variant=\"secondary\" className=\"bg-purple-500/20 text-purple-300\">
                Rarity: {selectedRarity}
                <button
                  onClick={() => setSelectedRarity('all')}
                  className=\"ml-2 text-purple-400 hover:text-white\"
                >
                  
                </button>
              </Badge>
            )}
            
            {priceRange !== 'all' && (
              <Badge variant=\"secondary\" className=\"bg-purple-500/20 text-purple-300\">
                Price: {getPriceRangeLabel(priceRange)}
                <button
                  onClick={() => setPriceRange('all')}
                  className=\"ml-2 text-purple-400 hover:text-white\"
                >
                  
                </button>
              </Badge>
            )}

            <Button
              variant=\"ghost\"
              size=\"sm\"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRarity('all');
                setPriceRange('all');
              }}
              className=\"text-gray-400 hover:text-white\"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className=\"flex justify-between items-center mb-4\">
        <div className=\"text-sm text-gray-400\">
          {filteredGifts.length} {filteredGifts.length === 1 ? 'gift' : 'gifts'} found
        </div>
      </div>

      {/* Gift Grid/List */}
      {filteredGifts.length === 0 ? (
        <div className=\"text-center py-12\">
          <div className=\"text-6xl mb-4\"></div>
          <h3 className=\"text-lg font-semibold text-white mb-2\">No gifts found</h3>
          <p className=\"text-gray-400\">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={`gift-display ${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'space-y-3'}`}>
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              isSelected={selectedGift?.id === gift.id}
              onSelect={() => onGiftSelect?.(gift)}
              viewMode={viewMode}
              selectable={!!onGiftSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== INDIVIDUAL GIFT CARD COMPONENT ====================

interface GiftCardProps {
  gift: VirtualGift;
  isSelected: boolean;
  onSelect?: () => void;
  viewMode: 'grid' | 'list';
  selectable: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  isSelected,
  onSelect,
  viewMode,
  selectable
}) => {
  const rarityStyles = RARITY_COLORS[gift.rarity];
  const categoryStyles = CATEGORY_CONFIG[gift.category];

  if (viewMode === 'list') {
    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
          selectable ? 'cursor-pointer hover:scale-105' : ''
        } ${
          isSelected
            ? `${rarityStyles.bg} ${rarityStyles.border} border-2 ${rarityStyles.glow} shadow-lg`
            : 'bg-black/20 border-white/10 hover:border-purple-500/30'
        }`}
        onClick={selectable ? onSelect : undefined}
      >
        {/* Gift Emoji */}
        <div className={`text-3xl p-3 rounded-xl ${rarityStyles.bg} ${rarityStyles.border} border`}>
          {gift.emoji}
        </div>

        {/* Gift Info */}
        <div className=\"flex-1\">
          <h3 className=\"text-lg font-semibold text-white\">{gift.name}</h3>
          <p className=\"text-sm text-gray-300 mb-2\">{gift.description}</p>
          
          <div className=\"flex items-center gap-2\">
            <Badge className={`${rarityStyles.bg} ${rarityStyles.text} border-0 text-xs`}>
              {getRarityIcon(gift.rarity)}
              <span className=\"ml-1\">{gift.rarity}</span>
            </Badge>
            <Badge className={`${categoryStyles.bgColor} ${categoryStyles.color} border-0 text-xs`}>
              {getCategoryIcon(gift.category)}
              <span className=\"ml-1\">{gift.category}</span>
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className=\"text-right\">
          <div className=\"text-xl font-bold text-green-400\">
            ${(gift.price / 100).toFixed(2)}
          </div>
          <div className=\"text-xs text-gray-400\">per gift</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gift-card p-4 rounded-xl border transition-all duration-200 ${
        selectable ? 'cursor-pointer hover:scale-105' : ''
      } ${
        isSelected
          ? `${rarityStyles.bg} ${rarityStyles.border} border-2 ${rarityStyles.glow} shadow-lg`
          : 'bg-black/20 border-white/10 hover:border-purple-500/30'
      }`}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Gift Emoji */}
      <div className={`text-4xl text-center p-3 rounded-xl mb-3 ${rarityStyles.bg} ${rarityStyles.border} border`}>
        {gift.emoji}
      </div>

      {/* Gift Info */}
      <div className=\"text-center\">
        <h3 className=\"font-semibold text-white text-sm mb-1\">{gift.name}</h3>
        <p className=\"text-xs text-gray-300 mb-3 line-clamp-2\">{gift.description}</p>
        
        {/* Badges */}
        <div className=\"flex flex-col gap-1 mb-3\">
          <Badge className={`${rarityStyles.bg} ${rarityStyles.text} border-0 text-xs justify-center`}>
            {getRarityIcon(gift.rarity)}
            <span className=\"ml-1\">{gift.rarity}</span>
          </Badge>
          <Badge className={`${categoryStyles.bgColor} ${categoryStyles.color} border-0 text-xs justify-center`}>
            {getCategoryIcon(gift.category)}
            <span className=\"ml-1\">{gift.category}</span>
          </Badge>
        </div>

        {/* Price */}
        <div className=\"text-center\">
          <div className=\"text-lg font-bold text-green-400\">
            ${(gift.price / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

const getRarityIcon = (rarity: VirtualGift['rarity']) => {
  switch (rarity) {
    case 'common': return <div className=\"w-2 h-2 bg-gray-400 rounded-full\" />;
    case 'rare': return <div className=\"w-2 h-2 bg-blue-400 rounded-full\" />;
    case 'epic': return <Star className=\"w-3 h-3 text-purple-400\" />;
    case 'legendary': return <Crown className=\"w-3 h-3 text-yellow-400\" />;
  }
};

const getCategoryIcon = (category: VirtualGift['category']) => {
  switch (category) {
    case 'hearts': return <Heart className=\"w-3 h-3\" />;
    case 'stars': return <Sparkles className=\"w-3 h-3\" />;
    case 'luxury': return <Crown className=\"w-3 h-3\" />;
    case 'seasonal': return <span className=\"text-xs\"></span>;
    case 'custom': return <span className=\"text-xs\"></span>;
  }
};