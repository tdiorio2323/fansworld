# FansWorld AI Development Guide

> **⚠️ CRITICAL**: This is a $100K+ enterprise platform. Read this entire guide before making ANY changes.

## 🎯 Quick Context for AI Agents

### **What FansWorld Actually Is**
- **NOT** a simple React app or basic CRUD application
- **IS** an enterprise-grade creator monetization platform comparable to OnlyFans + Stripe Connect
- **HANDLES** real money transactions, creator livelihoods, and business operations
- **REQUIRES** enterprise-level security, compliance, and performance considerations

### **Business Impact of Changes**
- Code changes affect **real revenue streams**
- Database modifications impact **creator earnings**
- UI changes affect **user experience** and **conversion rates**
- Security issues could compromise **financial data** and **personal information**

## 🏗️ Project Structure for AI Agents

### **Primary Development Location**

```bash
# ALWAYS work from this directory
/Users/tylerdiorio/Documents/GitHub/fansworld-lux-starter/

# Contains multiple sub-projects:
├── fansworld-fresh-new/     # Latest React 19.1.0 version
├── fansworld-fresh/         # Standard React 18 version  
├── fansworld_source/        # Source files and assets
└── [extensive documentation] # Business and technical docs
```

### **Key Configuration Files**

```typescript
// Package.json locations and their purposes
├── fansworld-fresh-new/package.json  # Latest dependencies (React 19)
├── fansworld-fresh/package.json      # Production dependencies (React 18)
└── Root level documentation files    # Business context and guides
```

## 🔧 Development Workflow for AI Agents

### **BEFORE Making ANY Changes**

1. **Understand the Business Context**
   ```bash
   # Read these files FIRST:
   - FANSWORLD_AI_CONTEXT.md      # Platform overview
   - ENTERPRISE_FEATURES.md       # Business complexity  
   - TECHNICAL_ARCHITECTURE.md    # Technical deep dive
   - USER_WORKFLOWS.md            # Business processes
   ```

2. **Identify the Correct Sub-Project**
   ```bash
   # For new features: fansworld-fresh-new/ (React 19.1.0)
   # For production: fansworld-fresh/ (React 18.3.1)
   # Check package.json to confirm dependencies
   ```

3. **Assess Impact Level**
   ```typescript
   interface ChangeImpact {
     LOW: "UI text changes, styling updates, documentation";
     MEDIUM: "New components, form updates, page additions";
     HIGH: "Database changes, payment logic, user roles";
     CRITICAL: "Security, authentication, financial transactions";
   }
   ```

### **Development Process**

1. **Navigate to Correct Directory**
   ```bash
   cd /Users/tylerdiorio/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new
   # OR
   cd /Users/tylerdiorio/Documents/GitHub/fansworld-lux-starter/fansworld-fresh
   ```

2. **Install Dependencies (if needed)**
   ```bash
   npm install  # Installs 70+ production dependencies
   ```

3. **Start Development Server**
   ```bash
   npm run dev  # Vite development server
   ```

4. **Make Changes Following These Patterns**
   ```typescript
   // File structure patterns to follow
   ├── src/
   │   ├── components/ui/          # Shadcn/ui components
   │   ├── components/custom/      # Custom business components
   │   ├── pages/                  # Route components
   │   ├── hooks/                  # Custom React hooks
   │   ├── lib/                    # Utilities and configurations
   │   ├── types/                  # TypeScript type definitions
   │   └── styles/                 # CSS and styling
   ```

## 💡 Common Development Scenarios

### **Scenario 1: Adding a New Page**

```typescript
// Example: Adding a creator analytics page
// Location: src/pages/CreatorAnalytics.tsx

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatorEarningsChart } from '@/components/custom/CreatorEarningsChart';

export function CreatorAnalytics() {
  // Follow existing patterns for data fetching
  const { data: earnings } = useQuery({
    queryKey: ['creator-earnings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', userId);
      return data;
    }
  });

  return (
    <div className="luxury-glass-panel">
      <CreatorEarningsChart data={earnings} />
    </div>
  );
}
```

### **Scenario 2: Database Schema Changes**

```sql
-- CRITICAL: Database changes affect live data
-- Always test in development first
-- Consider migration scripts for production

-- Example: Adding a new column
ALTER TABLE creator_applications 
ADD COLUMN portfolio_review_status TEXT DEFAULT 'pending';

-- Update Row Level Security policies
CREATE POLICY "Users can view own applications" 
ON creator_applications FOR SELECT 
USING (auth.uid() = applicant_id);
```

### **Scenario 3: Payment Integration Updates**

```typescript
// CRITICAL: Payment changes affect real money
// Always test with Stripe test keys first

import { stripe } from '@/lib/stripe';

async function createSubscription(customerId: string, priceId: string) {
  // Follow existing error handling patterns
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    
    // Update database with subscription details
    await supabase.from('stripe_subscriptions').insert({
      subscription_id: subscription.id,
      customer_id: customerId,
      status: subscription.status,
      current_period_end: subscription.current_period_end
    });
    
    return subscription;
  } catch (error) {
    // Log error for monitoring
    console.error('Subscription creation failed:', error);
    throw error;
  }
}
```

## ⚠️ Critical Safety Guidelines

### **DO NOT Modify Without Understanding**
- Payment processing logic
- User authentication and authorization
- Database Row Level Security policies
- Creator earnings calculations
- Subscription management workflows

### **ALWAYS Test These Areas**
- Payment flows (use Stripe test mode)
- User role permissions
- Data access controls
- Real-time features (messaging, notifications)
- Mobile responsiveness

### **Security Checklist**
- [ ] No hardcoded secrets or API keys
- [ ] Proper input validation and sanitization
- [ ] Row Level Security (RLS) policies maintained
- [ ] User role permissions enforced
- [ ] HTTPS and secure cookie handling
- [ ] Adult content age verification

## 🚀 Deployment Considerations

### **Pre-deployment Checklist**

```bash
# Build verification
npm run build          # Ensure clean build
npm run type-check     # TypeScript validation
npm run lint           # ESLint checks

# Test critical paths
- User registration and login
- Creator application process  
- Payment processing (test mode)
- Real-time messaging
- Admin dashboard access
```

### **Environment Variables Required**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email Service
SMTP2GO_API_KEY=
```

## 📊 Performance Monitoring

### **Key Metrics to Watch**
- Page load times (target: <3 seconds)
- API response times (target: <200ms)
- Payment processing success rate (target: >99%)
- Real-time message delivery (target: <1 second)
- Creator dashboard analytics load (target: <5 seconds)

### **Common Performance Issues**
- Large image/video uploads without compression
- Unoptimized database queries (missing indexes)
- Excessive re-renders in React components
- Inefficient TanStack Query configurations
- Missing pagination on large data sets

## 🆘 Emergency Procedures

### **If Something Breaks in Production**
1. **Assess Impact**: Users, creators, or payments affected?
2. **Immediate Response**: Rollback if possible
3. **Communication**: Notify stakeholders if revenue impacted
4. **Fix and Test**: Address root cause thoroughly
5. **Post-mortem**: Document lessons learned

### **Common Emergency Scenarios**
- Payment processing failures → Check Stripe webhook status
- User authentication issues → Verify Supabase connection
- Creator dashboard errors → Check database permissions
- Mobile app crashes → Test responsive design

## 📚 Additional Resources

### **Key Documentation to Reference**
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Shadcn/ui Components](https://ui.shadcn.com/)

### **FansWorld-Specific Guides**
- Database schema documentation
- API endpoint specifications  
- User role and permission matrix
- Payment flow diagrams
- Creator onboarding checklist

---

**Remember: Every line of code you write affects real creators' livelihoods and real users' experiences. Code with enterprise-level responsibility and attention to detail.**