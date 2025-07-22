import { supabase } from '@/integrations/supabase/client';

// Stripe webhook event types
interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

// Handle customer subscription created
export const handleSubscriptionCreated = async (subscription: any) => {
  console.log('Processing subscription created:', subscription.id);
  
  try {
    // Update customer's subscription status
    const { error } = await supabase
      .from('stripe_customers')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', subscription.customer);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    // Create subscription record
    await supabase
      .from('stripe_subscriptions')
      .insert({
        subscription_id: subscription.id,
        customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_id: subscription.items.data[0]?.price?.id || null,
        metadata: subscription.metadata || {}
      });

    console.log('Subscription created successfully');
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error);
    throw error;
  }
};

// Handle successful payment
export const handlePaymentSucceeded = async (paymentIntent: any) => {
  console.log('Processing payment succeeded:', paymentIntent.id);
  
  try {
    // Get customer info
    const { data: customer } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('stripe_customer_id', paymentIntent.customer)
      .single();

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Record transaction
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        transaction_id: paymentIntent.id,
        user_id: customer.user_id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        transaction_type: 'subscription_payment',
        stripe_payment_intent_id: paymentIntent.id,
        description: paymentIntent.description || 'TD Studios Management Fee',
        metadata: paymentIntent.metadata || {}
      });

    if (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }

    // If this is a subscription payment, calculate and record commission
    if (paymentIntent.metadata?.subscription_id) {
      await calculateAndRecordCommission(customer.user_id, paymentIntent);
    }

    console.log('Payment processed successfully');
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error);
    throw error;
  }
};

// Calculate commission based on package and record it
const calculateAndRecordCommission = async (userId: string, paymentIntent: any) => {
  try {
    // Get user's package info from their subscription
    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('*')
      .eq('subscription_id', paymentIntent.metadata.subscription_id)
      .single();

    if (!subscription) return;

    // Determine commission rate based on plan
    let commissionRate = 0.25; // Default 25%
    if (subscription.plan_id?.includes('starter')) commissionRate = 0.30;
    if (subscription.plan_id?.includes('elite')) commissionRate = 0.20;
    if (subscription.plan_id?.includes('enterprise')) commissionRate = 0.15;

    // For now, we'll simulate creator earnings
    // In reality, this would come from actual creator platform data
    const simulatedCreatorEarnings = Math.floor(Math.random() * 50000) + 10000; // $100-$500
    const commissionAmount = Math.floor(simulatedCreatorEarnings * commissionRate);

    // Record commission
    await supabase
      .from('commission_tracking')
      .insert({
        creator_id: userId,
        period_start: new Date().toISOString(),
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        creator_gross_earnings: simulatedCreatorEarnings,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        management_fee: paymentIntent.amount,
        creator_net_payout: simulatedCreatorEarnings - commissionAmount,
        status: 'calculated'
      });

  } catch (error) {
    console.error('Error calculating commission:', error);
  }
};

// Handle subscription updated
export const handleSubscriptionUpdated = async (subscription: any) => {
  console.log('Processing subscription updated:', subscription.id);
  
  try {
    const { error } = await supabase
      .from('stripe_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_id: subscription.items.data[0]?.price?.id || null,
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    console.log('Subscription updated successfully');
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
    throw error;
  }
};

// Handle subscription deleted/canceled
export const handleSubscriptionDeleted = async (subscription: any) => {
  console.log('Processing subscription deleted:', subscription.id);
  
  try {
    const { error } = await supabase
      .from('stripe_subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id);

    if (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }

    console.log('Subscription canceled successfully');
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
    throw error;
  }
};

// Handle payment failed
export const handlePaymentFailed = async (paymentIntent: any) => {
  console.log('Processing payment failed:', paymentIntent.id);
  
  try {
    const { data: customer } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('stripe_customer_id', paymentIntent.customer)
      .single();

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Record failed transaction
    await supabase
      .from('payment_transactions')
      .insert({
        transaction_id: paymentIntent.id,
        user_id: customer.user_id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        transaction_type: 'subscription_payment',
        stripe_payment_intent_id: paymentIntent.id,
        description: paymentIntent.description || 'TD Studios Management Fee (Failed)',
        metadata: paymentIntent.metadata || {}
      });

    console.log('Failed payment recorded');
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
    throw error;
  }
};

// Main webhook handler
export const handleStripeWebhook = async (event: StripeWebhookEvent) => {
  console.log('Processing Stripe webhook:', event.type);
  
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: error.message };
  }
};

// Utility function to verify webhook signature (for production)
export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  // This would use Stripe's webhook signature verification in production
  // For now, we'll return true for development
  console.log('Webhook signature verification (development mode)');
  return true;
};