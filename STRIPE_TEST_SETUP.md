# Stripe Test Payment Setup Guide

## Quick Start: Testing $1 Charge

### 1. Access the Test Payment Page
Navigate to: `http://localhost:5173/test-payment`

### 2. Before You Can Test

You need to set up Stripe in your Supabase project:

#### Step 1: Create a Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. You'll automatically be in test mode

#### Step 2: Get Your Test API Keys
1. In Stripe Dashboard, go to **Developers → API keys**
2. Copy your **Test Secret Key** (starts with `sk_test_`)
3. Copy your **Test Publishable Key** (starts with `pk_test_`)

#### Step 3: Configure Supabase Edge Functions
1. Go to your Supabase Dashboard
2. Navigate to **Settings → Edge Functions**
3. Add these environment variables:
   - `STRIPE_SECRET_KEY` = your test secret key
   - `STRIPE_PUBLISHABLE_KEY` = your test publishable key

#### Step 4: Set Up Webhooks (Optional for Testing)
1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Use URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for (at minimum: `checkout.session.completed`)
5. Copy the **Signing secret** and add to Supabase as `STRIPE_WEBHOOK_SECRET`

### 3. Test Card Numbers

Use these test cards in Stripe Checkout:

| Card Number | Scenario |
|------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Payment declined |
| 4000 0025 0000 3155 | Requires authentication |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### 4. Testing the Payment Flow

1. Go to `/test-payment`
2. Enter amount (minimum $0.50)
3. Click "Pay"
4. You'll be redirected to Stripe Checkout
5. Enter test card details
6. Complete the payment

### 5. Verify the Payment

1. Check Stripe Dashboard → **Payments** to see your test payment
2. Look for the payment in test mode
3. You can refund, capture, or perform other actions

## Alternative: Direct API Test

If the Edge Function isn't set up, you can test directly:

```javascript
// In browser console at your site
const testCharge = async () => {
  const response = await fetch('https://[your-project].supabase.co/functions/v1/create-tip-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session.access_token
    },
    body: JSON.stringify({
      amount: 100, // $1.00 in cents
      creatorId: 'test-creator-id',
      message: 'Test payment'
    })
  });
  
  const data = await response.json();
  console.log('Checkout URL:', data.url);
  
  if (data.url) {
    window.location.href = data.url;
  }
};

testCharge();
```

## Troubleshooting

### "Edge Function not found" Error
- Make sure you've deployed the Edge Functions to Supabase
- Run: `supabase functions deploy`

### "Missing Stripe API Key" Error
- Verify you've added `STRIPE_SECRET_KEY` to Supabase Edge Function secrets
- Check that you're using the test key (starts with `sk_test_`)

### Payment Succeeds but Nothing Happens
- Check if webhooks are configured
- Verify the webhook endpoint URL is correct
- Check Supabase logs for any errors

## Production Checklist

Before going live:
1. Switch to live API keys in Stripe
2. Update Supabase secrets with live keys
3. Update webhook endpoints to use live mode
4. Test with a real card (you can refund yourself)
5. Enable additional security features (3D Secure, etc.)

## Support

- Stripe Docs: https://stripe.com/docs/testing
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Test Cards Reference: https://stripe.com/docs/testing#cards