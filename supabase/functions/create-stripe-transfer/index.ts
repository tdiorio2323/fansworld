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

    // Verify the user is authenticated and is admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      throw new Error('Admin access required')
    }

    const { destination_account_id, amount, description } = await req.json()

    // Verify the destination account exists and is verified
    const { data: accountData, error: accountError } = await supabase
      .from('stripe_connect_accounts')
      .select('*')
      .eq('stripe_account_id', destination_account_id)
      .single()

    if (accountError || !accountData) {
      throw new Error('Destination account not found')
    }

    if (!accountData.payouts_enabled) {
      throw new Error('Destination account is not enabled for payouts')
    }

    // Create transfer to connected account
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: 'usd',
      destination: destination_account_id,
      description: description,
      metadata: {
        platform: 'fansworld',
        destination_user_id: accountData.user_id,
      },
    })

    // Update the creator earnings record
    const { error: updateError } = await supabase
      .from('creator_earnings')
      .update({
        stripe_transfer_id: transfer.id,
        stripe_transfer_status: 'pending',
        stripe_connect_account_id: destination_account_id,
        actual_payout_date: new Date().toISOString().split('T')[0],
        payout_status: 'processing',
      })
      .eq('creator_id', accountData.user_id)

    if (updateError) {
      console.error('Error updating creator earnings:', updateError)
    }

    return new Response(
      JSON.stringify({
        transfer_id: transfer.id,
        status: transfer.status || 'pending',
        amount: transfer.amount,
        currency: transfer.currency,
        destination: transfer.destination,
        created: transfer.created,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Stripe transfer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})