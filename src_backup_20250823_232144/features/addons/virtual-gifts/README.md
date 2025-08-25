# 🎁 Virtual Gifts System

A complete virtual gifting system that allows users to send virtual gifts to creators with real monetary value. This addon provides a rich catalog of animated gifts, real-time notifications, analytics, and seamless payment processing.

## 📋 Overview

The Virtual Gifts System enables creators to monetize their content through a fun, engaging virtual gifting mechanism. Users can purchase and send virtual gifts ranging from simple hearts to luxury items, with each gift having real monetary value that translates to creator earnings.

### ✨ Key Features

- **Rich Gift Catalog**: 10+ pre-defined gifts across multiple categories (Hearts, Stars, Luxury, Seasonal)
- **Real-time Notifications**: Live gift alerts with animations and sound effects
- **Payment Processing**: Integrated Stripe payment handling with automatic payouts
- **Gift Analytics**: Comprehensive statistics for both senders and recipients
- **Rarity System**: Common, Rare, Epic, and Legendary gift tiers
- **Anonymous Gifting**: Option to send gifts anonymously
- **Personal Messages**: Attach messages to gifts
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Installation

### 1. Enable Feature Flag
```typescript
// src/features/addons/feature-flags.ts
export const ADDON_FLAGS = {
  VIRTUAL_GIFTS: true, // Set to true
  // ... other flags
};
```

### 2. Run Database Migration
Execute the SQL migration file in your Supabase dashboard:
```bash
# Copy and run the contents of:
src/features/addons/virtual-gifts/database/migrations.sql
```

### 3. Set Up Payment Processing
Ensure your Stripe Connect integration is configured for handling gift payments.

### 4. Add Sound Files (Optional)
Place gift sound effects in `/public/sounds/gifts/`:
- `heart-beat.mp3`
- `star-chime.mp3`
- `crystal-ding.mp3`
- `royal-fanfare.mp3`
- And other sounds listed in `config.ts`

## 💻 Usage

### Basic Integration

```tsx
import { VirtualGifts } from '@/features/addons/virtual-gifts';

// Full component with all features
<VirtualGifts
  currentUserId="user-123"
  recipientId="creator-456"
  recipientName="CreatorName"
  showStats={true}
/>

// Embedded mode (for chat integration)
<VirtualGifts
  embedded={true}
  currentUserId="user-123"
  recipientId="creator-456"
  recipientName="CreatorName"
/>
```

### Individual Components

```tsx
import { GiftCatalog, GiftStats, GiftNotifications } from '@/features/addons/virtual-gifts';

// Gift catalog only
<GiftCatalog
  gifts={gifts}
  onGiftSelect={handleGiftSelect}
  selectedGift={selectedGift}
/>

// User statistics
<GiftStats userId="user-123" />

// Real-time notifications
<GiftNotifications
  userId="user-123"
  soundEnabled={true}
  showAnimation={true}
  position="top-right"
/>
```

### Service Layer

```tsx
import { VirtualGiftsService } from '@/features/addons/virtual-gifts';

// Send a gift
const transaction = await VirtualGiftsService.sendGift({
  giftId: 'heart-big',
  recipientId: 'creator-456',
  quantity: 3,
  message: 'Love your content!',
  isAnonymous: false
}, 'sender-user-id');

// Get user statistics
const stats = await VirtualGiftsService.getUserGiftStats('user-123');

// Get all gifts
const gifts = await VirtualGiftsService.getAllGifts();
```

## 🎨 Customization

### Adding New Gifts

Add new gifts to the catalog in `config.ts`:

```typescript
export const DEFAULT_GIFT_CATALOG: VirtualGift[] = [
  // ... existing gifts
  {
    id: 'custom-gift',
    name: 'Custom Gift',
    emoji: '🎨',
    description: 'A unique custom gift',
    price: 1000, // $10.00 in cents
    category: 'custom',
    rarity: 'epic',
    animation: 'sparkle-rotate',
    sound: 'custom-sound',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
```

### Custom Animations

Add new animations in `config.ts`:

```typescript
export const GIFT_ANIMATIONS = {
  'custom-animation': `
    @keyframes customAnimation {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.5) rotate(180deg); }
      100% { transform: scale(1) rotate(360deg); }
    }
  `
};
```

### Styling Customization

The component uses Tailwind CSS classes and follows the glassmorphism theme. Customize colors and styles by modifying:

- `RARITY_COLORS` in `config.ts` for rarity-based styling
- `CATEGORY_CONFIG` in `config.ts` for category colors and icons
- Component CSS classes in the component files

## 📊 Analytics & Reporting

### Available Metrics

The system tracks comprehensive analytics:

- **Gift Statistics**: Total gifts sent/received, earnings, spending
- **Popular Gifts**: Most gifted items, favorite gifts by user
- **Top Supporters**: Users who send the most gifts
- **Revenue Analytics**: Gift revenue, platform commissions
- **Engagement Metrics**: Gift frequency, user interactions

### Database Views

A `user_gift_stats` view provides optimized analytics queries:

```sql
-- Get user statistics
SELECT * FROM user_gift_stats WHERE user_id = 'user-123';

-- Top earners from gifts
SELECT user_id, total_earnings 
FROM user_gift_stats 
ORDER BY total_earnings DESC 
LIMIT 10;
```

## 🔧 Configuration

### Gift Limits & Settings

Modify limits in `config.ts`:

```typescript
export const GIFT_LIMITS = {
  maxQuantityPerGift: 99,        // Max gifts per transaction
  maxTotalValue: 100000,         // $1000 max per transaction
  cooldownPeriod: 1000,          // 1 second between gifts
  maxMessageLength: 200,         // Character limit for messages
};
```

### Feature Configuration

```typescript
export const DEFAULT_VIRTUAL_GIFTS_CONFIG: VirtualGiftsConfig = {
  enabled: true,
  maxGiftsPerMessage: 5,         // Max gifts per chat message
  maxDailySpend: 50000,          // $500 daily spending limit
  animationDuration: 3000,       // 3 second animations
  soundEnabled: true,
  allowAnonymous: true,
  commissionRate: 0.1,           // 10% platform commission
};
```

## 🔒 Security & Permissions

### Row Level Security (RLS)

The addon implements comprehensive RLS policies:

- Users can only view their own gift transactions
- Virtual gifts catalog is publicly readable
- Only authenticated users can send gifts
- Admins can manage the gift catalog

### Payment Security

- All payments processed through Stripe
- Payment intents created server-side
- Transaction validation before processing
- Automatic refund handling for failed transactions

### Rate Limiting

- Cooldown periods between gift sends
- Daily spending limits per user
- Maximum transaction value limits
- Quantity limits per gift type

## 🚨 Troubleshooting

### Common Issues

1. **Gifts not loading**
   - Check if database migration was run successfully
   - Verify feature flag is enabled
   - Check Supabase connection

2. **Payment failures**
   - Ensure Stripe Connect is properly configured
   - Check webhook endpoints are set up
   - Verify API keys are correct

3. **Real-time notifications not working**
   - Check Supabase realtime is enabled
   - Verify channel subscription setup
   - Check browser websocket connection

4. **Sounds not playing**
   - Verify sound files exist in `/public/sounds/gifts/`
   - Check browser autoplay policies
   - Ensure sound is enabled in component

### Debug Mode

Enable debug logging:

```typescript
// Add to your app initialization
if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('debug-virtual-gifts', 'true');
}
```

## 📈 Performance Considerations

### Database Optimization

For high-volume applications:

1. **Partition transactions table** by date
2. **Add composite indexes** for common query patterns
3. **Archive old transactions** to separate tables
4. **Use materialized views** for complex analytics

### Real-time Optimization

- Limit notification subscribers per channel
- Implement message queuing for high volumes
- Use connection pooling for database queries
- Cache gift catalog in memory/Redis

### Client-side Optimization

- Lazy load components when addon is disabled
- Implement virtual scrolling for large gift lists
- Debounce search and filter operations
- Preload critical sound files

## 🔄 Removal Instructions

### 1. Disable Feature Flag
```typescript
export const ADDON_FLAGS = {
  VIRTUAL_GIFTS: false, // Set to false
  // ... other flags
};
```

### 2. Remove Database Tables (⚠️ Destructive)
```sql
-- WARNING: This will delete all gift data
DROP VIEW IF EXISTS user_gift_stats;
DROP TABLE IF EXISTS gift_transactions;
DROP TABLE IF EXISTS virtual_gifts;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### 3. Remove Files (Optional)
```bash
rm -rf src/features/addons/virtual-gifts/
```

### 4. Clean Up Imports
Remove any imports of virtual gifts components from your application code.

## 🤝 Contributing

When extending this addon:

1. Follow the existing TypeScript patterns
2. Maintain backward compatibility
3. Add comprehensive tests for new features
4. Update this documentation
5. Follow the modular architecture principles

## 📄 License

This addon is part of the Cabana platform and follows the same license terms.

---

**Need Help?** Check the troubleshooting section or reach out to the development team for assistance with installation and customization.