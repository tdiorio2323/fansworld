# 🚀 TD Studios Complete Monetization & Financial Setup Guide

## 📋 **Table of Contents**
1. [Stripe Integration Setup](#stripe-integration-setup)
2. [Revenue Streams & Pricing](#revenue-streams--pricing)
3. [Referral/Affiliate Program](#referralaffiliate-program)
4. [Legal & Compliance](#legal--compliance)
5. [Financial Tracking & Analytics](#financial-tracking--analytics)
6. [Tax & Accounting Setup](#tax--accounting-setup)
7. [Implementation Checklist](#implementation-checklist)

---

## 🏦 **Stripe Integration Setup**

### **Step 1: Create Stripe Account**
1. Go to [stripe.com](https://stripe.com) and create business account
2. Complete business verification with:
   - Business license (LLC/Corp documents)
   - EIN (Employer Identification Number)
   - Bank account details
   - Identity verification

### **Step 2: Get Your API Keys**
```bash
# Test Keys (for development)
Publishable Key: pk_test_...
Secret Key: sk_test_...

# Live Keys (for production)
Publishable Key: pk_live_...
Secret Key: sk_live_...
```

### **Step 3: Update Database with Real Keys**
```sql
-- Replace with your actual Stripe secret key
UPDATE vault.secrets 
SET secret = 'sk_live_YOUR_ACTUAL_STRIPE_SECRET_KEY' 
WHERE name = 'stripe_secret_key';

-- Add publishable key
INSERT INTO vault.secrets (name, secret)
VALUES ('stripe_publishable_key', 'pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY')
ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
```

### **Step 4: Create Products in Stripe Dashboard**
1. **TD Studios Starter Package**
   - Name: "TD Studios Starter Package"
   - Price: $2,500/month
   - Product ID: `prod_starter_tdstudios`

2. **TD Studios Premium Package**
   - Name: "TD Studios Premium Package"  
   - Price: $5,000/month
   - Product ID: `prod_premium_tdstudios`

3. **TD Studios Elite Package**
   - Name: "TD Studios Elite Package"
   - Price: $10,000/month
   - Product ID: `prod_elite_tdstudios`

### **Step 5: Set Up Webhook Endpoints**
Create webhook endpoint at: `https://yourdomain.com/api/stripe/webhook`

Listen for these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`

---

## 💰 **Revenue Streams & Pricing**

### **Primary Revenue Streams**

#### **1. Management Fees (Recurring)**
```
Starter Package: $2,500/month + 30% commission
Premium Package: $5,000/month + 25% commission  
Elite Package: $10,000/month + 20% commission
Custom Enterprise: $15,000+/month + 15% commission
```

#### **2. Commission Structure**
```javascript
const calculateCommission = (creatorEarnings, package) => {
  const rates = {
    starter: 0.30,   // 30%
    premium: 0.25,   // 25%
    elite: 0.20,     // 20%
    enterprise: 0.15 // 15%
  };
  
  return creatorEarnings * rates[package];
};
```

#### **3. Additional Revenue Streams**
- **Setup Fees**: $1,000-$5,000 one-time
- **Brand Partnership Commission**: 10-15% of deal value
- **Legal Services**: $500/hour
- **Custom Content Creation**: $2,000-$10,000/project
- **Training/Workshops**: $500-$2,000/session

### **4. Referral/Affiliate Revenue**
- **Creator Referrals**: 10% of first year revenue
- **Agency Partnerships**: 5% ongoing commission
- **Software Tool Commissions**: 20-50% of sales

---

## 🤝 **Referral/Affiliate Program**

### **Database Schema for Referrals**
```sql
-- Referral Program Tables
CREATE TABLE referral_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    commission_rate DECIMAL(5,2) NOT NULL, -- e.g., 10.00 for 10%
    commission_type TEXT CHECK (commission_type IN ('percentage', 'fixed', 'tiered')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    referrer_id UUID REFERENCES auth.users(id),
    program_id UUID REFERENCES referral_programs(id),
    uses_remaining INTEGER DEFAULT -1, -- -1 = unlimited
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE referral_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code_id UUID REFERENCES referral_codes(id),
    referee_id UUID REFERENCES auth.users(id),
    referrer_id UUID REFERENCES auth.users(id),
    conversion_value INTEGER NOT NULL, -- in cents
    commission_amount INTEGER NOT NULL, -- in cents
    status TEXT CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_date TIMESTAMP WITH TIME ZONE
);
```

### **Referral Program Types**

#### **1. Creator-to-Creator Referrals**
- **Commission**: 10% of first year revenue from referred creator
- **Payout**: Monthly after 90-day retention period
- **Code Format**: `CREATOR_[USERNAME]_2024`

#### **2. Affiliate Partner Program**
- **Commission**: 5% ongoing for agencies/consultants
- **Payout**: Monthly
- **Code Format**: `PARTNER_[COMPANY]_2024`

#### **3. Influencer Affiliate Program**
- **Commission**: $500-$2,000 per successful referral
- **Payout**: 30 days after signup
- **Code Format**: `INFLUENCER_[NAME]_2024`

### **Referral Tracking Implementation**
```typescript
// Example referral tracking hook
export const useReferralTracking = () => {
  const trackReferral = async (code: string, userId: string) => {
    const { data, error } = await supabase
      .from('referral_conversions')
      .insert({
        referral_code_id: code,
        referee_id: userId,
        conversion_value: 0, // Updated when they subscribe
        status: 'pending'
      });
    
    return { data, error };
  };
  
  return { trackReferral };
};
```

---

## ⚖️ **Legal & Compliance**

### **Required Legal Documents**
1. **Terms of Service**
2. **Privacy Policy** 
3. **Creator Management Agreement**
4. **Commission Payment Terms**
5. **Referral Program Terms**
6. **Data Processing Agreement (GDPR)**

### **Business Licenses & Registration**
- [ ] **LLC/Corporation Registration** (New York)
- [ ] **Talent Agency License** (if required in NY)
- [ ] **Business License** (NYC)
- [ ] **Sales Tax Permit** (NY State)
- [ ] **EIN from IRS**

### **Payment Processing Compliance**
- [ ] **PCI DSS Compliance** (handled by Stripe)
- [ ] **AML/KYC Procedures** for high-value clients
- [ ] **1099 Tax Reporting** for creators earning >$600

---

## 📊 **Financial Tracking & Analytics**

### **Key Metrics Dashboard**
```typescript
interface FinancialMetrics {
  // Revenue Metrics
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  totalCommissionEarned: number;
  averageRevenuePerCreator: number;
  
  // Growth Metrics
  creatorChurnRate: number;
  revenueGrowthRate: number;
  lifetimeValue: number;
  customerAcquisitionCost: number;
  
  // Referral Metrics
  referralConversionRate: number;
  referralRevenue: number;
  topReferrers: ReferrerStats[];
}
```

### **Financial Reporting Tables**
```sql
-- Monthly Revenue Reports
CREATE TABLE monthly_revenue_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month DATE NOT NULL,
    management_fees INTEGER NOT NULL,
    commission_revenue INTEGER NOT NULL,
    referral_payouts INTEGER NOT NULL,
    net_revenue INTEGER NOT NULL,
    creator_count INTEGER NOT NULL,
    new_signups INTEGER NOT NULL,
    churn_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission Tracking
CREATE TABLE commission_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    creator_gross_earnings INTEGER NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount INTEGER NOT NULL,
    management_fee INTEGER NOT NULL,
    creator_net_payout INTEGER NOT NULL,
    status TEXT CHECK (status IN ('calculated', 'approved', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧾 **Tax & Accounting Setup**

### **Accounting Software Integration**
**Recommended**: QuickBooks Online or Xero
- Automatic Stripe transaction import
- 1099 generation for creators
- Revenue recognition automation
- Tax reporting

### **Tax Considerations**
1. **Sales Tax**: Required for services in some states
2. **Income Tax**: Corporate/LLC tax obligations
3. **Payroll Tax**: If hiring employees
4. **1099 Reporting**: For creators earning >$600/year

### **Bank Account Structure**
```
Business Checking (Primary Operations)
├── High-Yield Savings (Emergency Fund)
├── Tax Savings Account (25% of revenue)
├── Payroll Account (If employees)
└── Commission Holding Account (Creator payouts)
```

---

## ✅ **Implementation Checklist**

### **Phase 1: Foundation (Week 1-2)**
- [ ] Set up business bank accounts
- [ ] Register business entity (LLC/Corp)
- [ ] Get EIN from IRS
- [ ] Create Stripe account
- [ ] Implement basic payment processing
- [ ] Set up webhook endpoints

### **Phase 2: Core Features (Week 3-4)**
- [ ] Deploy subscription management
- [ ] Implement commission tracking
- [ ] Set up automatic billing
- [ ] Create financial dashboard
- [ ] Test payment flows end-to-end

### **Phase 3: Advanced Features (Week 5-6)**
- [ ] Launch referral program
- [ ] Implement affiliate tracking
- [ ] Set up automated tax reporting
- [ ] Create financial analytics
- [ ] Deploy coming soon page

### **Phase 4: Legal & Compliance (Week 7-8)**
- [ ] Draft legal documents
- [ ] Implement GDPR compliance
- [ ] Set up accounting software
- [ ] Configure tax systems
- [ ] Launch publicly

---

## 💡 **Pro Tips for Success**

### **Revenue Optimization**
1. **Upsell Strategy**: Start creators on Starter, upgrade to Premium/Elite
2. **Annual Discounts**: 10-15% off for annual payments
3. **Enterprise Custom**: $15,000+ packages for top creators
4. **Add-on Services**: Legal, PR, brand partnerships

### **Referral Program Best Practices**
1. **Track Everything**: UTM parameters, referral codes, conversion funnels
2. **Automate Payouts**: Monthly commission payments via Stripe
3. **Gamification**: Leaderboards, bonus tiers for top referrers
4. **Marketing Materials**: Provide banners, copy, tracking links

### **Financial Management**
1. **Cash Flow**: Maintain 6-month operating expenses in reserve
2. **Revenue Recognition**: Recognize subscription revenue monthly
3. **Commission Reserves**: Hold 30% of commissions for chargebacks
4. **Growth Investment**: Reinvest 20-30% of profits into marketing

---

## 🚀 **Next Steps**

1. **Start with Stripe setup** - Get your payment processing live
2. **Implement basic subscriptions** - Test with a few clients
3. **Add commission tracking** - Automate creator payouts
4. **Launch referral program** - Drive organic growth
5. **Scale and optimize** - Add advanced features

**Remember**: Start simple, test everything, then scale! 🎯