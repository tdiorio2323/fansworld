# Nextgen Overlay System - Setup & Deployment Guide

## Overview

The Nextgen Overlay System is a comprehensive feature set for the FansWorld Creator Platform that includes:

- **VIP v2 System**: Enhanced VIP code redemption with analytics
- **Tip Goals System**: Progress tracking with milestone celebrations  
- **Offer Ribbon System**: Limited-time promotional offers
- **Moderation v2 System**: AI-assisted content moderation queue

All features are **feature-flagged** and **additive** - they won't break existing functionality and can be enabled gradually for safe rollout.

## 🚀 Quick Setup

### 1. Database Migration

Run the database migration to add all necessary tables:

```bash
# Apply the migration
npx supabase db push

# Or if using manual migrations
psql -h your-db-host -U your-username -d your-database -f supabase/migrations/20250811000001-nextgen-overlay-schema.sql
```

### 2. Environment Variables

Add feature flags to your environment:

```env
# .env.local or your deployment environment

# VIP v2 System
VITE_VIP_V2_ENABLED=false
VITE_VIP_V2_ADMIN_PANEL=false  
VITE_VIP_V2_ANALYTICS=false

# Tip Goals System
VITE_TIP_GOALS_ENABLED=false
VITE_TIP_GOALS_ANIMATIONS=false
VITE_TIP_GOALS_NOTIFICATIONS=false

# Offer Ribbon System  
VITE_OFFER_RIBBON_ENABLED=false
VITE_OFFER_RIBBON_ANIMATIONS=false
VITE_OFFER_RIBBON_SOUND=false

# Moderation v2 System
VITE_MODERATION_V2_ENABLED=false
VITE_MODERATION_V2_AUTO_RULES=false
VITE_MODERATION_V2_AI_ASSIST=false

# System-wide
VITE_NEXTGEN_OVERLAY_ENABLED=false
VITE_FEATURE_ANALYTICS=false
```

### 3. Install Dependencies

All required dependencies are already in `package.json`. Run:

```bash
npm install
# or
yarn install
```

### 4. Start Development

```bash
npm run dev
```

## 📊 Feature Rollout Strategy

### Phase 1: Internal Testing (Week 1)
```env
# Enable for testing with limited audience
VITE_VIP_V2_ENABLED=true
VITE_NEXTGEN_OVERLAY_ENABLED=true
VITE_FEATURE_ANALYTICS=true
```

### Phase 2: VIP System Launch (Week 2-3)
```env
# Enable VIP system for all users
VITE_VIP_V2_ENABLED=true
VITE_VIP_V2_ADMIN_PANEL=true
VITE_VIP_V2_ANALYTICS=true
```

### Phase 3: Tip Goals Launch (Week 4-5)  
```env
# Add tip goals functionality
VITE_TIP_GOALS_ENABLED=true
VITE_TIP_GOALS_ANIMATIONS=true
VITE_TIP_GOALS_NOTIFICATIONS=true
```

### Phase 4: Offers & Moderation (Week 6-8)
```env
# Full feature set
VITE_OFFER_RIBBON_ENABLED=true
VITE_OFFER_RIBBON_ANIMATIONS=true
VITE_MODERATION_V2_ENABLED=true
VITE_MODERATION_V2_AUTO_RULES=true
```

## 🧪 Testing

### Run E2E Tests
```bash
# Install Playwright if not already installed
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Run Unit Tests
```bash
npm run test
```

### Test with Feature Flags
```bash
# Set test environment flags
VITE_VIP_V2_ENABLED=true npm run dev
```

## 🔧 Configuration

### Database Configuration

The system uses these new Supabase tables:
- `vip_v2_codes` - VIP code management
- `vip_v2_redemptions` - Track redemptions  
- `vip_v2_analytics_events` - Analytics data
- `tip_goals` - Creator tip goals
- `tip_goal_contributions` - User contributions
- `tip_goal_milestones` - Progress milestones
- `offers` - Limited-time offers
- `offer_redemptions` - Offer usage tracking
- `offer_analytics_events` - Offer analytics
- `moderation_v2_rules` - Moderation rules
- `moderation_v2_queue` - Moderation queue
- `moderation_v2_actions` - Moderation actions

### Row Level Security (RLS)

All tables have appropriate RLS policies:
- Creators can manage their own content
- Users can view public content
- Users can interact with features (redeem codes, contribute to goals)

### API Integration

The system integrates with existing APIs:
- **Stripe**: For VIP code payments and tip goal contributions
- **Supabase**: For all database operations
- **AI Services**: For content moderation (placeholder implementation included)

## 🎛️ Admin Controls

### VIP Code Management
```typescript
// Access VIP admin panel
/creator-dashboard/vip-codes

// Create codes programmatically
import { vipV2Service } from '@/features/vip-v2/services/vipService';

await vipV2Service.createCode(creatorId, {
  code: 'LAUNCH2024',
  title: 'Launch Special', 
  priceCents: 999,
  maxUses: 100
});
```

### Tip Goals Management
```typescript
// Create tip goals
import { tipGoalsService } from '@/features/tip-goals/services/tipGoalsService';

await tipGoalsService.createGoal(creatorId, {
  title: 'New Equipment',
  targetAmountCents: 50000, // $500
  isPublic: true
});
```

### Moderation Rules
```typescript  
// Set up moderation
import { moderationV2Service } from '@/features/moderation-v2/services/moderationService';

await moderationV2Service.createRule(creatorId, {
  name: 'Toxicity Filter',
  ruleType: 'content_filter',
  conditions: { toxicityThreshold: 0.8 },
  actions: { autoRemove: true }
});
```

## 📈 Analytics & Monitoring

### Feature Usage Analytics
```typescript
// Track feature usage
import { useFlagAnalytics } from '@/hooks/useFlag';

const { trackFlagUsage } = useFlagAnalytics();
trackFlagUsage('VIP_V2_ENABLED', 'code_created');
```

### Performance Monitoring
- Monitor database query performance
- Track feature adoption rates
- Monitor error rates for new features

### Business Metrics
- VIP code conversion rates
- Tip goal completion rates  
- Offer redemption rates
- Moderation queue processing times

## 🚨 Troubleshooting

### Common Issues

**Feature flags not working:**
```bash
# Check environment variables are loaded
console.log(import.meta.env.VITE_VIP_V2_ENABLED)

# Clear browser cache and reload
# Check for JavaScript errors in console
```

**Database migration failed:**
```bash
# Check Supabase connection
npx supabase status

# Manually verify migration
npx supabase db diff --schema public
```

**E2E tests failing:**
```bash
# Update test data-testid attributes
# Ensure feature flags are enabled in tests
# Check test database is clean
```

### Support & Debugging

**Enable debug mode:**
```env
VITE_DEBUG=true
VITE_FEATURE_ANALYTICS=true
```

**Database queries:**
```sql
-- Check feature usage
SELECT COUNT(*) FROM vip_v2_codes WHERE is_active = true;
SELECT COUNT(*) FROM tip_goals WHERE is_active = true;
SELECT COUNT(*) FROM offers WHERE is_active = true;

-- Check analytics
SELECT event_type, COUNT(*) as count 
FROM vip_v2_analytics_events 
GROUP BY event_type;
```

## 🔐 Security Considerations

### Data Protection
- All user data is encrypted at rest
- PII is handled according to privacy policy
- Analytics data is anonymized where possible

### API Security
- All API endpoints require authentication
- Rate limiting is applied to prevent abuse
- Input validation on all user inputs

### Feature Flag Security
- Feature flags can't be overridden in production
- Admin features require proper permissions
- Sensitive configuration is server-side only

## 📚 Documentation

### Component Usage

**VIP Code Generator:**
```jsx
import { VipCodeGenerator } from '@/features/vip-v2/components/VipCodeGenerator';

<VipCodeGenerator onCodeCreated={(code) => console.log('New code:', code)} />
```

**Tip Goal Progress:**
```jsx
import { TipGoalProgress } from '@/features/tip-goals/components/TipGoalProgress';

<TipGoalProgress 
  goalId="goal-uuid"
  showContributions={true}
  onContribute={handleContribute}
/>
```

**Offer Ribbon:**
```jsx
import { OfferRibbon } from '@/features/offers/components/OfferRibbon';

<OfferRibbon 
  offer={offerData}
  variant="banner" 
  position="top"
  onClaim={handleClaim}
/>
```

### API Reference

See individual service files for complete API documentation:
- `/src/features/vip-v2/services/vipService.ts`
- `/src/features/tip-goals/services/tipGoalsService.ts`
- `/src/features/offers/services/offersService.ts`
- `/src/features/moderation-v2/services/moderationService.ts`

## 🔄 Deployment

### Production Checklist

- [ ] Database migrations applied
- [ ] Feature flags configured
- [ ] E2E tests passing
- [ ] Performance testing completed
- [ ] Security review completed
- [ ] Analytics configured
- [ ] Monitoring alerts set up
- [ ] Documentation updated
- [ ] Team training completed

### Rollback Plan

If issues occur, features can be instantly disabled:

```env
# Emergency disable
VITE_VIP_V2_ENABLED=false
VITE_TIP_GOALS_ENABLED=false
VITE_OFFER_RIBBON_ENABLED=false
VITE_MODERATION_V2_ENABLED=false
VITE_NEXTGEN_OVERLAY_ENABLED=false
```

Database changes are additive and don't affect existing functionality.

## 🤝 Contributing

### Code Standards
- TypeScript strict mode enabled
- All components have proper TypeScript interfaces
- Error handling is comprehensive
- Tests are required for all new features

### Pull Request Process
1. Feature branch from `feature/nextgen-overlay-system`
2. Implement changes with tests
3. Update documentation
4. Submit PR with detailed description
5. Code review and testing
6. Merge to main branch

---

## 🎉 Success!

Your Nextgen Overlay System is now ready for deployment. The system is designed to be:
- **Production-ready** but safely disabled by default
- **Incrementally rollable** with feature flags
- **Fully tested** with comprehensive E2E coverage
- **Well-documented** for easy maintenance

For support or questions, refer to the individual service documentation or create an issue in the project repository.

**Happy building! 🚀**