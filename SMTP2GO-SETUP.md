# 📧 SMTP2GO Email Setup Guide

## ✅ Files Created
- `src/lib/email.ts` - Email service functions
- `supabase/functions/send-email/index.ts` - Email edge function
- Environment variables added to `.env.production`

## 🚀 Quick Setup Steps

### 1. Create SMTP2GO Account (2 minutes)
```
1. Go to: https://www.smtp2go.com/signup
2. Sign up with your email
3. Verify email address
4. Choose FREE PLAN (1,000 emails/month)
```

### 2. Get API Key (1 minute)
```
1. Login to SMTP2GO dashboard
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name: "FansWorld-Production"
5. Copy the API key
```

### 3. Update Environment Variables
```bash
# In your .env.production file, replace:
SMTP2GO_API_KEY=your-actual-api-key-here
```

### 4. Deploy Email Function
```bash
# Deploy the email function to Supabase
npx supabase functions deploy send-email
```

### 5. Add Environment Variables to Vercel
```
1. Go to Vercel Dashboard
2. Select your project → Settings → Environment Variables
3. Add:
   - SMTP2GO_API_KEY: [your-api-key]
   - SMTP2GO_SENDER_EMAIL: noreply@cabana.tdstudiosny.com  
   - SMTP2GO_SENDER_NAME: FansWorld
```

## 📨 Email Templates Ready

### Waitlist Confirmation
- Luxury branded design
- VIP code display
- Call-to-action buttons

### Welcome Email
- User personalization
- Quick start guide
- Dashboard link

### Creator Application Status
- Approval/rejection notifications
- Next steps guidance

## 🧪 Test Emails

```javascript
// Test waitlist email
import { sendWaitlistEmail } from '@/lib/email';

await sendWaitlistEmail({
  email: 'test@example.com',
  vipCode: 'CREATOR-ABC123'
});

// Test welcome email
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  email: 'test@example.com',
  name: 'Tyler',
  inviteCode: 'REF-XYZ789'
});
```

## 📊 SMTP2GO Free Plan Limits
- **1,000 emails/month** (perfect for launch)
- **99%+ deliverability** 
- **Real-time analytics**
- **No setup fees**

## 🔧 Integration Points

### Waitlist Signup
- Automatically sends confirmation email
- Includes VIP access code if applicable

### User Registration  
- Welcome email with quick start guide
- Referral code for sharing

### Creator Applications
- Status update emails
- Approval/rejection notifications

## ⚡ Ready to Use!

Once you add your SMTP2GO API key, emails will start sending automatically for:
- Waitlist signups
- User registrations
- Creator applications
- VIP code redemptions

**Total Setup Time: ~5 minutes**