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

    const { user_id, account_data } = await req.json()

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    if (user.id !== user_id) {
      throw new Error('User ID mismatch')
    }

    // Create Stripe Connect account
    const accountParams: any = {
      type: 'express',
      country: account_data.country,
      email: account_data.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: account_data.business_type || 'individual',
      metadata: {
        user_id: user_id,
        platform: 'fansworld',
      },
    }

    // Add individual information if provided
    if (account_data.individual) {
      accountParams.individual = {}
      
      if (account_data.individual.first_name) {
        accountParams.individual.first_name = account_data.individual.first_name
      }
      
      if (account_data.individual.last_name) {
        accountParams.individual.last_name = account_data.individual.last_name
      }
      
      if (account_data.individual.email) {
        accountParams.individual.email = account_data.individual.email
      }
      
      if (account_data.individual.phone) {
        accountParams.individual.phone = account_data.individual.phone
      }
      
      if (account_data.individual.dob) {
        accountParams.individual.dob = account_data.individual.dob
      }
      
      if (account_data.individual.ssn_last_4) {
        accountParams.individual.ssn_last_4 = account_data.individual.ssn_last_4
      }
      
      if (account_data.individual.address) {
        accountParams.individual.address = account_data.individual.address
      }
    }

    // Add business profile if provided
    if (account_data.business_profile) {
      accountParams.business_profile = account_data.business_profile
    }

    const account = await stripe.accounts.create(accountParams)

    return new Response(
      JSON.stringify({
        stripe_account_id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        verification_status: account.requirements?.currently_due?.length === 0 ? 'verified' : 'pending',
        requirements: account.requirements,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})