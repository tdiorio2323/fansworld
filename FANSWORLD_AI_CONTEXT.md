# FansWorld Platform - AI Agent Context Documentation

> **CRITICAL**: This is a MASSIVE enterprise-level platform. Do not underestimate its complexity.

## 🏢 Business Overview

**FansWorld is a premium creator management platform** - think OnlyFans meets talent agency management with enterprise-grade features. This is not "just another React app."

### Business Value: $100K+ Development Project
- **Revenue Model**: 25% platform commission + subscription fees
- **Target Market**: Premium adult content creators
- **Business Type**: B2B2C SaaS platform with payment processing
- **Comparable Platforms**: OnlyFans, Patreon, but with agency management features

## 📊 Project Scale & Complexity

### **7 Active Project Versions**
- Primary: `/Users/tylerdiorio/Documents/GitHub/fansworld-lux-starter`
- Secondary: `/Users/tylerdiorio/Projects/JavaScript/fansworld-lux-starter`
- Multiple sub-versions and backups across filesystem

### **72+ Production Dependencies**
- React 19.1.0 + TypeScript 5.8.3
- Supabase (database, auth, storage, edge functions)
- Stripe Connect (complex payment processing)
- 20+ Radix UI components
- Advanced state management (TanStack Query)
- Real-time messaging system
- Analytics and reporting tools

### **15+ Database Tables with Complex Relationships**
```
User Management: profiles, invites, waitlist
Creator System: creator_applications, creator_content, creator_earnings, creator_contracts, creator_goals, creator_milestones, creator_notes
Payment System: stripe_customers, stripe_subscriptions, payment_transactions, commission_payments
Analytics: link_tracking, link_clicks, vip_link_tracking, referral_conversions, agency_stats
```

## 🏗️ Technical Architecture

### **Multi-Tenant SaaS Platform**
- **3 User Types**: Regular Users, Creators, Administrators
- **Role-Based Access Control** with Row Level Security
- **Real-time Features**: Messaging, notifications, live analytics
- **Payment Processing**: Subscriptions, one-time purchases, creator payouts
- **File Management**: Image/video upload, processing, CDN delivery

### **Enterprise Features**
- **Creator Onboarding Pipeline**: Multi-step application, verification, contract signing
- **Financial Management**: Commission tracking, payout processing, tax handling
- **Analytics Dashboard**: Revenue analytics, user metrics, campaign tracking
- **Marketing Tools**: Referral program, link tracking, VIP access codes
- **Admin Panel**: User management, creator approval, financial oversight

### **Security & Compliance**
- Invite-only registration system
- GDPR compliance features
- IP tracking and rate limiting
- Encrypted data transmission
- Adult content age verification

## 🎯 Core Business Workflows

### **Creator Management Agency Features**
1. **Application Process**: Portfolio review, background checks, contract negotiation
2. **Content Management**: Upload systems, content moderation, pricing strategies
3. **Earnings Management**: Commission tracking, goal setting, payout processing
4. **Performance Analytics**: Subscriber growth, revenue optimization, milestone tracking

### **User Experience Flows**
1. **Fan Journey**: Registration → Creator discovery → Subscription → Content access → Messaging
2. **Creator Journey**: Application → Onboarding → Content creation → Earnings tracking → Payout requests
3. **Admin Journey**: Creator approval → Financial oversight → Platform analytics → Campaign management

### **Monetization Streams**
- Creator subscriptions (recurring revenue)
- One-time content purchases
- Tip/donation system
- Platform commission (25%)
- Referral program (10% lifetime)
- VIP access premium features

## 📱 Platform Capabilities

### **User-Facing Features**
- Instagram-style content feed
- Advanced messaging system
- Subscription management
- Payment processing
- Mobile-responsive luxury UI
- Creator discovery and search

### **Creator Dashboard**
- Comprehensive analytics (earnings, subscribers, engagement)
- Content upload and management tools
- Goal setting and milestone tracking
- Subscriber communication tools
- Payout request system
- Performance optimization insights

### **Admin Panel**
- Creator application review and approval workflow
- Financial oversight and payout management
- Platform-wide analytics and reporting
- User and content moderation tools
- Marketing campaign management
- VIP access and invite code generation

## 🚀 Current Development Status

### **75% Launch Ready**
- Core functionality: ✅ Complete
- Payment processing: ✅ Configured
- Database schema: ✅ Complete
- UI/UX: ✅ Production-ready luxury theme
- Testing framework: ✅ Implemented
- Deployment pipeline: ✅ Vercel-ready

### **Remaining Development**
- Production domain configuration
- Email notification system completion
- Advanced content moderation tools
- Load testing and performance optimization

## 🔧 Development Context for AI Agents

### **When Working on FansWorld:**

1. **Recognize the Scale**: This is equivalent to building OnlyFans + Stripe + Analytics platform
2. **Business Context Matters**: Every feature impacts revenue, creator relationships, and user retention
3. **Security is Critical**: Adult content platform with financial transactions
4. **Performance is Essential**: Real-time messaging, video streaming, payment processing
5. **Compliance Required**: Age verification, payment regulations, content policies

### **Common Development Areas**
- **Payment Integration**: Complex Stripe Connect setup with multi-party transactions
- **Creator Tools**: Advanced analytics, content management, earning optimization
- **Admin Oversight**: Creator approval workflows, financial reporting, user management
- **User Experience**: Luxury UI/UX with mobile-first design
- **Analytics**: Revenue tracking, user engagement, creator performance metrics

### **Architecture Patterns Used**
- **Row Level Security**: Database-level access control
- **Real-time Subscriptions**: Live updates for messaging and notifications
- **Microservices Pattern**: Supabase Edge Functions for business logic
- **Event-Driven Architecture**: Payment webhooks, notification systems
- **Multi-tenant SaaS**: Isolated data with shared infrastructure

## ⚠️ Critical Considerations

### **Data Sensitivity**
- Adult content requires special handling
- Financial data with PCI compliance
- Personal creator information and contracts
- User payment and subscription data

### **Business Impact**
- Creator earnings depend on platform stability
- Payment processing affects real money transactions
- User experience directly impacts retention and revenue
- Admin tools affect business operations and creator relationships

### **Technical Debt Awareness**
- Multiple project versions require careful merging
- Complex state management across user types
- Payment processing edge cases and error handling
- Mobile optimization for content consumption

---

**Remember: FansWorld is not a simple web app. It's a comprehensive business platform managing real creators, real money, and real business relationships. Treat every change with appropriate enterprise-level consideration.**