// 🎁 VIRTUAL GIFTS - TYPE DEFINITIONS

export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number; // in cents
  category: 'hearts' | 'stars' | 'luxury' | 'seasonal' | 'custom';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  animation?: string;
  sound?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GiftTransaction {
  id: string;
  giftId: string;
  senderId: string;
  recipientId: string;
  amount: number; // in cents
  quantity: number;
  message?: string;
  isAnonymous: boolean;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  gift?: VirtualGift;
  sender?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  recipient?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface GiftStats {
  totalReceived: number;
  totalSent: number;
  totalEarnings: number; // in cents
  totalSpent: number; // in cents
  favoriteGift?: VirtualGift;
  topSender?: {
    id: string;
    username: string;
    totalSent: number;
  };
  recentGifts: GiftTransaction[];
}

export interface VirtualGiftsConfig {
  enabled: boolean;
  maxGiftsPerMessage: number;
  maxDailySpend: number; // in cents
  animationDuration: number; // in milliseconds
  soundEnabled: boolean;
  allowAnonymous: boolean;
  commissionRate: number; // platform commission (0.1 = 10%)
}

export interface GiftSendRequest {
  giftId: string;
  recipientId: string;
  quantity: number;
  message?: string;
  isAnonymous: boolean;
}

export interface GiftCatalogCategory {
  id: string;
  name: string;
  emoji: string;
  gifts: VirtualGift[];
}

// Event types for real-time updates
export interface GiftSentEvent {
  type: 'GIFT_SENT';
  transaction: GiftTransaction;
  timestamp: string;
}

export interface GiftReceivedEvent {
  type: 'GIFT_RECEIVED';
  transaction: GiftTransaction;
  timestamp: string;
}