# 🔒 Pay-Per-View (PPV) Messages

A comprehensive premium messaging system that allows creators to monetize their content by requiring payment to view exclusive messages. This addon supports rich media content, flexible pricing, analytics, and seamless payment processing.

## 📋 Overview

The PPV Messages system enables creators to create premium content that users must purchase to access. Each message can contain multiple content types (text, images, videos, audio, files) and can be priced individually. The system handles payment processing, content delivery, analytics, and revenue tracking.

### ✨ Key Features

- **Rich Content Creation**: Support for text, images, videos, audio, and files
- **Flexible Pricing**: $0.99 to $999.99 with quick-select tiers
- **Payment Processing**: Stripe integration with multiple payment methods
- **Content Security**: Payment-gated access with preview capabilities
- **Advanced Analytics**: Earnings, conversion rates, and performance insights
- **Message Expiration**: Optional time-limited content access
- **View Limits**: Restrict number of views per message
- **Promo Codes**: Discount codes for marketing campaigns
- **Mobile Responsive**: Optimized for all device sizes
- **Content Moderation**: Built-in reporting and flagging system

## 🚀 Installation

### 1. Enable Feature Flag
```typescript
// src/features/addons/feature-flags.ts
export const ADDON_FLAGS = {
  PPV_MESSAGES: true, // Set to true
  // ... other flags
};
```

### 2. Run Database Migration
Execute the SQL migration file in your Supabase dashboard:
```bash
# Copy and run the contents of:
src/features/addons/ppv-messages/database/migrations.sql
```

### 3. Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Add required variables:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REDIS_URL=redis://localhost:6379
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
```

### 4. Install Background Job Processing
```bash
# Install required packages
npm install bullmq ioredis stripe body-parser

# Create worker directory
mkdir -p api/worker
```

### 5. Set Up Stripe Webhooks
```bash
# Add webhook endpoint to your Stripe dashboard:
https://yourdomain.com/webhooks/stripe

# Required webhook events:
- payment_intent.succeeded
- payment_intent.payment_failed
- invoice.payment_succeeded
- customer.subscription.updated
```

## 💻 Usage

### Basic Integration

```tsx
import { PPVMessages } from '@/features/addons/ppv-messages';

// Creator dashboard - full management interface
<PPVMessages
  viewMode="creator"
  creatorId="creator-123"
  currentUserId="creator-123"
  showStats={true}
/>

// Consumer view - browse and purchase messages
<PPVMessages
  viewMode="consumer"
  creatorId="creator-123"
  currentUserId="user-456"
/>

// Embedded mode (for profiles/chat)
<PPVMessages
  embedded={true}
  viewMode="consumer"
  creatorId="creator-123"
  currentUserId="user-456"
/>
```

### Individual Components

```tsx
import { 
  PPVMessageComposer, 
  PPVMessageViewer, 
  PPVAnalytics 
} from '@/features/addons/ppv-messages';

// Message creation interface
<PPVMessageComposer
  isOpen={showComposer}
  onClose={() => setShowComposer(false)}
  onMessageCreated={handleMessageCreated}
  creatorId="creator-123"
/>

// Message viewing with payment gate
<PPVMessageViewer
  isOpen={showViewer}
  onClose={() => setShowViewer(false)}
  message={selectedMessage}
  currentUserId="user-456"
  onPurchased={handlePurchased}
/>

// Creator analytics dashboard
<PPVAnalytics creatorId="creator-123" />
```

### Service Layer API

```tsx
import { PPVMessagesService } from '@/features/addons/ppv-messages';

// Create a new PPV message
const message = await PPVMessagesService.createMessage({
  title: "Exclusive Behind-the-Scenes Content",
  description: "Get access to unreleased footage and photos",
  price: 999, // $9.99 in cents
  content: [
    {
      type: 'text',
      content: 'Here\'s the exclusive content...',
      order: 0
    },
    {
      type: 'image',
      content: 'https://storage.example.com/image.jpg',
      caption: 'Behind the scenes photo',
      order: 1
    }
  ],
  previewText: "Get access to unreleased footage...",
  tags: ['behind-the-scenes', 'exclusive', 'photos']
}, 'creator-123');

// Purchase a message
const purchase = await PPVMessagesService.purchaseMessage({
  messageId: 'msg-456',
  paymentMethod: 'stripe',
  usePromoCode: 'SAVE20'
}, 'buyer-789');

// Get creator statistics
const stats = await PPVMessagesService.getCreatorStats('creator-123');

// Get user's purchased messages
const purchases = await PPVMessagesService.getUserPurchases('user-456');
```

## 🏗️ Background Processing

The system uses BullMQ for background job processing. Set up workers for:

```typescript
// api/worker/index.ts
import { Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!);

export const queues = {
  email: new Queue("email", { connection }),
  media: new Queue("media", { connection }),
  notify: new Queue("notify", { connection }),
  ppv: new Queue("ppv", { connection }), // PPV-specific jobs
};

// PPV-specific workers
new QueueScheduler("ppv", { connection });
new Worker("ppv", async (job) => {
  switch (job.name) {
    case 'process-purchase':
      await processPPVPurchase(job.data);
      break;
    case 'generate-thumbnail':
      await generateContentThumbnail(job.data);
      break;
    case 'send-purchase-notification':
      await sendPurchaseNotification(job.data);
      break;
    case 'process-refund':
      await processPPVRefund(job.data);
      break;
  }
}, { connection });
```

## 💳 Payment Integration

### Stripe Webhook Handler

```typescript
// api/webhooks/stripe.ts
import express from 'express';
import bodyParser from 'body-parser';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

app.post("/webhooks/stripe", 
  bodyParser.raw({ type: "application/json" }), 
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePPVPaymentSuccess(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await handlePPVPaymentFailure(event.data.object);
          break;
          
        case 'refund.created':
          await handlePPVRefund(event.data.object);
          break;
      }
      
      res.sendStatus(200);
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook error');
    }
  }
);
```

### Payment Processing Functions

```typescript
// services/ppv-payment-processor.ts
export async function processPPVPurchase(data: any) {
  const { purchaseId, amount, paymentMethod } = data;
  
  try {
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        type: 'ppv_purchase',
        purchase_id: purchaseId,
      },
    });

    // Update purchase record
    await supabase
      .from('ppv_purchases')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending'
      })
      .eq('id', purchaseId);
      
    return paymentIntent;
  } catch (error) {
    // Handle payment failure
    await supabase
      .from('ppv_purchases')
      .update({ status: 'failed' })
      .eq('id', purchaseId);
      
    throw error;
  }
}
```

## 📊 Analytics & Reporting

### Revenue Analytics

```typescript
// Get creator revenue breakdown
const revenueData = await supabase
  .from('ppv_creator_stats')
  .select('*')
  .eq('creator_id', creatorId);

// Calculate platform metrics
const platformStats = await supabase
  .rpc('get_platform_ppv_stats', {
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  });
```

### Content Performance

```typescript
// Get top performing messages
const topMessages = await PPVMessagesService.getMessages({
  creatorId,
  sortBy: 'earnings',
  limit: 10
});

// Get conversion rates by price range
const conversionData = await supabase
  .from('ppv_message_performance')
  .select('price, conversion_rate, total_earnings')
  .eq('creator_id', creatorId)
  .order('conversion_rate', { ascending: false });
```

## 🎨 Customization

### Pricing Configuration

```typescript
// config.ts - Modify pricing tiers
export const PPV_PRICING_TIERS = [
  { label: '$0.99', value: 99, description: 'Budget tier' },
  { label: '$4.99', value: 499, description: 'Premium content' },
  { label: '$9.99', value: 999, description: 'High-value content' },
  { label: '$19.99', value: 1999, description: 'Exclusive content' },
  // Add custom tiers
];

// Modify commission rates
export const PPV_REVENUE_SHARE: PPVRevenueShare = {
  platformFee: 0.15, // 15% platform fee
  creatorShare: 0.82, // 82% to creator
  processingFee: 0.03, // 3% payment processing
};
```

### Content Types

```typescript
// Add custom content types
export const CONTENT_TYPE_CONFIG = {
  // ... existing types
  livestream: {
    icon: '📡',
    label: 'Live Stream',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    maxSize: 0, // No size limit for streams
    description: 'Live streaming content',
  },
};
```

### UI Styling

```typescript
// Customize component styling
export const PPV_THEME_CONFIG = {
  colors: {
    primary: 'purple-600',
    secondary: 'pink-600',
    success: 'green-500',
    error: 'red-500',
    warning: 'yellow-500',
  },
  gradients: {
    primary: 'from-purple-600 to-pink-600',
    card: 'from-purple-900/95 to-pink-900/95',
  },
};
```

## 🔒 Security & Compliance

### Content Protection

- **Row Level Security (RLS)** - Database-level access control
- **Payment Verification** - Content only accessible after successful payment
- **Content Watermarking** - Optional watermarks for media content
- **Access Logging** - Track all content access attempts
- **Expiration Enforcement** - Automatic content expiration

### Privacy & Compliance

```typescript
// GDPR compliance helpers
export const PPVPrivacyUtils = {
  // Export user's PPV data
  async exportUserData(userId: string) {
    const purchases = await supabase
      .from('ppv_purchases')
      .select('*')
      .eq('buyer_id', userId);
      
    const messages = await supabase
      .from('ppv_messages')
      .select('*')
      .eq('creator_id', userId);
      
    return { purchases, messages };
  },

  // Delete user's PPV data
  async deleteUserData(userId: string) {
    await supabase.from('ppv_purchases').delete().eq('buyer_id', userId);
    await supabase.from('ppv_messages').delete().eq('creator_id', userId);
  },
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Payment failures**
   - Check Stripe webhook configuration
   - Verify API keys and webhook secrets
   - Check payment method restrictions

2. **Content not loading**
   - Verify file upload and storage configuration
   - Check Supabase storage policies
   - Ensure proper CORS settings

3. **Purchase validation errors**
   - Check database constraints and triggers
   - Verify user authentication
   - Check message availability and expiration

### Debug Commands

```bash
# Check Redis connection
redis-cli ping

# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/webhooks/stripe

# Check database connections
npm run db:check

# View background job status
npm run jobs:status
```

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_ppv_messages_creator_earnings 
ON ppv_messages(creator_id, total_earnings DESC);

CREATE INDEX CONCURRENTLY idx_ppv_purchases_buyer_created 
ON ppv_purchases(buyer_id, created_at DESC);

-- Partition large tables by date
CREATE TABLE ppv_purchases_2024 PARTITION OF ppv_purchases
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Caching Strategy

```typescript
// Cache frequently accessed data
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Cache creator stats
export async function getCachedCreatorStats(creatorId: string) {
  const cacheKey = `creator:stats:${creatorId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await PPVMessagesService.getCreatorStats(creatorId);
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 minute cache
  
  return stats;
}
```

## 🔄 Removal Instructions

### 1. Disable Feature Flag
```typescript
export const ADDON_FLAGS = {
  PPV_MESSAGES: false, // Set to false
};
```

### 2. Stop Background Workers
```bash
# Stop all PPV-related workers
pm2 stop ppv-worker
pm2 delete ppv-worker
```

### 3. Remove Database Tables (⚠️ Destructive)
```sql
-- WARNING: This will delete all PPV data
DROP VIEW IF EXISTS ppv_popular_tags;
DROP VIEW IF EXISTS ppv_message_performance;
DROP VIEW IF EXISTS ppv_creator_stats;

DROP TABLE IF EXISTS ppv_notifications;
DROP TABLE IF EXISTS ppv_promo_codes;
DROP TABLE IF EXISTS ppv_message_tags;
DROP TABLE IF EXISTS ppv_purchases;
DROP TABLE IF EXISTS ppv_message_content;
DROP TABLE IF EXISTS ppv_messages;
```

### 4. Clean Up Files
```bash
rm -rf src/features/addons/ppv-messages/
rm -rf api/worker/ppv-*
```

## 📄 API Reference

### PPVMessagesService

#### `createMessage(request, creatorId)`
Creates a new PPV message with content.

#### `purchaseMessage(request, buyerId)`
Processes a message purchase with payment.

#### `getMessages(filter)`
Retrieves messages with optional filtering and sorting.

#### `getCreatorStats(creatorId)`
Gets comprehensive analytics for a creator.

#### `getUserPurchases(buyerId)`
Gets purchase history for a user.

### React Components

#### `<PPVMessages>`
Main component with full interface for creators and consumers.

#### `<PPVMessageComposer>`
Message creation interface with rich content support.

#### `<PPVMessageViewer>`
Message viewing interface with payment gate.

#### `<PPVAnalytics>`
Analytics dashboard with performance insights.

## 🤝 Contributing

When extending this addon:

1. Follow the existing TypeScript patterns
2. Maintain payment security standards
3. Add comprehensive error handling
4. Update analytics tracking
5. Follow content moderation guidelines
6. Update this documentation

## 📄 License

This addon is part of the Cabana platform and follows the same license terms.

---

**Need Help?** Check the troubleshooting section or reach out to the development team for assistance with setup and customization.