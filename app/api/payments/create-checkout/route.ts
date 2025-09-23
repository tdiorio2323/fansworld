import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      type, // 'subscription' | 'tip' | 'ppv' | 'content'
      amount,
      currency = 'usd',
      creatorId,
      contentId,
      customerId,
      successUrl,
      cancelUrl,
      metadata = {}
    } = body

    // Validate required fields
    if (!type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: type, amount' },
        { status: 400 }
      )
    }

    let sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/canceled`,
      customer_email: metadata.customerEmail,
      metadata: {
        type,
        creatorId: creatorId || '',
        contentId: contentId || '',
        customerId: customerId || '',
        ...metadata
      }
    }

    if (type === 'subscription') {
      // Create or get existing price
      let priceId = metadata.priceId
      
      if (!priceId) {
        const price = await stripe.prices.create({
          currency,
          unit_amount: amount, // amount in cents
          recurring: { interval: 'month' },
          product_data: {
            name: `Subscription to @${metadata.creatorUsername || 'creator'}`,
            description: `Monthly subscription for exclusive content and features`,
            metadata: {
              creatorId: creatorId || '',
              type: 'creator_subscription'
            }
          }
        })
        priceId = price.id
      }

      sessionConfig.line_items = [{
        price: priceId,
        quantity: 1
      }]
    } else {
      // One-time payment
      const productName = {
        tip: `Tip for @${metadata.creatorUsername || 'creator'}`,
        ppv: 'Premium Content Access',
        content: 'Exclusive Content Purchase'
      }[type] || 'Payment'

      sessionConfig.line_items = [{
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: productName,
            description: metadata.description || 'Premium platform purchase',
            metadata: {
              type,
              creatorId: creatorId || '',
              contentId: contentId || ''
            }
          }
        },
        quantity: 1
      }]
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Handle GET requests for session status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent', 'subscription']
    })

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        customer: session.customer,
        metadata: session.metadata,
        amount_total: session.amount_total,
        currency: session.currency
      }
    })

  } catch (error) {
    console.error('Session retrieval error:', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}