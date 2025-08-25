import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Stripe secret key from vault
    const { data: secretData, error: secretError } = await supabase
      .from('vault.secrets')
      .select('secret')
      .eq('name', 'stripe_secret_key')
      .single()

    if (secretError) {
      throw new Error('Failed to retrieve Stripe secret key')
    }

    const stripe = new Stripe(secretData.secret, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { message_id, payment_method_id } = await req.json()

    // Get message details
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select(`
        *,
        conversation:conversations(
          *,
          participants:conversation_participants(
            user_id,
            user:auth.users(email)
          )
        ),
        sender:auth.users(email)
      `)
      .eq('id', message_id)
      .single()

    if (messageError || !message) {
      throw new Error('Message not found')
    }

    // Verify message is paid and user is not the sender
    if (!message.is_paid || message.sender_id === user.id) {
      throw new Error('Invalid paid message request')
    }

    // Verify user is participant in conversation
    const isParticipant = message.conversation.participants.some(
      p => p.user_id === user.id
    )

    if (!isParticipant) {
      throw new Error('User is not a participant in this conversation')
    }

    // Check if user has already paid for this message
    const { data: existingPayment, error: paymentCheckError } = await supabase
      .from('message_payments')
      .select('*')
      .eq('message_id', message_id)
      .eq('payer_id', user.id)
      .eq('status', 'succeeded')
      .single()

    if (existingPayment) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Message already unlocked',
          payment: existingPayment
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: message.price_cents,
      currency: message.currency,
      payment_method: payment_method_id,
      confirm: true,
      return_url: `${req.headers.get('origin')}/messages`,
      metadata: {
        message_id: message_id,
        payer_id: user.id,
        recipient_id: message.sender_id,
        platform: 'fansworld',
        type: 'paid_message'
      }
    })

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('message_payments')
      .insert({
        message_id: message_id,
        payer_id: user.id,
        recipient_id: message.sender_id,
        amount_cents: message.price_cents,
        currency: message.currency,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_method_id: payment_method_id,
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
        paid_at: paymentIntent.status === 'succeeded' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error('Failed to create payment record')
    }

    // If payment succeeded, create commission tracking
    if (paymentIntent.status === 'succeeded') {
      // Calculate platform commission (assume 10% for paid messages)
      const platformCommission = Math.round(message.price_cents * 0.10)
      const creatorEarnings = message.price_cents - platformCommission

      // Update creator earnings (simplified - in real app, you'd have more complex logic)
      const { error: earningsError } = await supabase
        .from('creator_earnings')
        .insert({
          creator_id: message.sender_id,
          period_start: new Date().toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          gross_earnings: creatorEarnings,
          commission_amount: platformCommission,
          net_earnings: creatorEarnings,
          payout_status: 'pending'
        })
        .on('conflict', 'creator_id,period_start,period_end')
        .do('update', {
          gross_earnings: `gross_earnings + ${creatorEarnings}`,
          commission_amount: `commission_amount + ${platformCommission}`,
          net_earnings: `net_earnings + ${creatorEarnings}`
        })

      if (earningsError) {
        console.error('Error updating creator earnings:', earningsError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: payment,
        payment_intent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing paid message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})