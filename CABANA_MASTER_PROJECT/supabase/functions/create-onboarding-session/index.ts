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

    const { stripe_account_id, return_url, refresh_url } = await req.json()

    // Verify the account belongs to the authenticated user
    const { data: accountData, error: accountError } = await supabase
      .from('stripe_connect_accounts')
      .select('*')
      .eq('stripe_account_id', stripe_account_id)
      .eq('user_id', user.id)
      .single()

    if (accountError || !accountData) {
      throw new Error('Account not found or access denied')
    }

    // Create onboarding session
    const accountLink = await stripe.accountLinks.create({
      account: stripe_account_id,
      refresh_url: refresh_url,
      return_url: return_url,
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({
        url: accountLink.url,
        expires_at: new Date(accountLink.expires_at * 1000).toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating onboarding session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})