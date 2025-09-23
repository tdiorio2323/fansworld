import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)
  
  const { type, creatorId, contentId, customerId } = session.metadata || {}

  try {
    // Update database based on payment type
    switch (type) {
      case 'subscription':
        await processSubscriptionPayment(session, creatorId!, customerId!)
        break
      case 'tip':
        await processTipPayment(session, creatorId!, customerId!)
        break
      case 'ppv':
      case 'content':
        await processContentPayment(session, creatorId!, contentId!, customerId!)
        break
    }

    // Send confirmation notifications
    await sendPaymentConfirmation(session)

  } catch (error) {
    console.error('Error processing completed checkout:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)
  
  try {
    // Store subscription in database
    const metadata = subscription.metadata
    
    // TODO: Replace with actual database operations
    console.log('Creating subscription record:', {
      stripeSubscriptionId: subscription.id,
      customerId: subscription.customer,
      creatorId: metadata.creatorId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    })

    // Grant subscriber access
    await grantSubscriberAccess(metadata.customerId!, metadata.creatorId!)
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  try {
    // Update subscription record in database
    console.log('Updating subscription:', {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    })

    // Handle status changes
    if (subscription.status === 'active') {
      await grantSubscriberAccess(subscription.metadata.customerId!, subscription.metadata.creatorId!)
    } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
      await revokeSubscriberAccess(subscription.metadata.customerId!, subscription.metadata.creatorId!)
    }
    
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Subscription canceled:', subscription.id)
  
  try {
    // Update database
    console.log('Canceling subscription:', subscription.id)
    
    // Revoke access
    await revokeSubscriberAccess(subscription.metadata.customerId!, subscription.metadata.creatorId!)
    
  } catch (error) {
    console.error('Error handling subscription canceled:', error)
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  try {
    const metadata = paymentIntent.metadata
    
    // Process based on payment type
    if (metadata.type === 'tip') {
      await processTipPayment(paymentIntent, metadata.creatorId!, metadata.customerId!)
    }
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    // Send failure notification
    await sendPaymentFailureNotification(paymentIntent)
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  try {
    // Handle subscription renewal
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      await handleSubscriptionRenewal(subscription)
    }
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)
  
  try {
    // Handle failed subscription payment
    if (invoice.subscription) {
      await handleFailedSubscriptionPayment(invoice)
    }
    
  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}

// Helper functions - replace with actual implementations
async function processSubscriptionPayment(session: Stripe.Checkout.Session, creatorId: string, customerId: string) {
  // TODO: Implement subscription processing logic
  console.log('Processing subscription payment:', { creatorId, customerId, amount: session.amount_total })
}

async function processTipPayment(payment: Stripe.Checkout.Session | Stripe.PaymentIntent, creatorId: string, customerId: string) {
  // TODO: Implement tip processing logic
  const amount = 'amount_total' in payment ? payment.amount_total : payment.amount
  console.log('Processing tip payment:', { creatorId, customerId, amount })
}

async function processContentPayment(session: Stripe.Checkout.Session, creatorId: string, contentId: string, customerId: string) {
  // TODO: Implement content access granting logic
  console.log('Processing content payment:', { creatorId, contentId, customerId, amount: session.amount_total })
}

async function grantSubscriberAccess(customerId: string, creatorId: string) {
  // TODO: Implement subscriber access granting
  console.log('Granting subscriber access:', { customerId, creatorId })
}

async function revokeSubscriberAccess(customerId: string, creatorId: string) {
  // TODO: Implement subscriber access revocation
  console.log('Revoking subscriber access:', { customerId, creatorId })
}

async function sendPaymentConfirmation(session: Stripe.Checkout.Session) {
  // TODO: Implement email/notification sending
  console.log('Sending payment confirmation for session:', session.id)
}

async function sendPaymentFailureNotification(paymentIntent: Stripe.PaymentIntent) {
  // TODO: Implement failure notification
  console.log('Sending payment failure notification for:', paymentIntent.id)
}

async function handleSubscriptionRenewal(subscription: Stripe.Subscription) {
  // TODO: Implement subscription renewal logic
  console.log('Handling subscription renewal:', subscription.id)
}

async function handleFailedSubscriptionPayment(invoice: Stripe.Invoice) {
  // TODO: Implement failed subscription payment handling
  console.log('Handling failed subscription payment:', invoice.id)
}