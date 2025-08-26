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

    // Get current date
    const today = new Date().toISOString().split('T')[0]

    // Find all payout schedules that are due today
    const { data: dueSchedules, error: schedulesError } = await supabase
      .from('payout_schedules')
      .select(`
        *,
        creator:auth.users!creator_id(id, email),
        connect_account:stripe_connect_accounts!creator_id(*)
      `)
      .eq('active', true)
      .eq('auto_payout', true)
      .lte('next_payout_date', today)

    if (schedulesError) {
      throw new Error('Failed to fetch payout schedules')
    }

    if (!dueSchedules || dueSchedules.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No scheduled payouts due today', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const processedPayouts = []
    const errors = []

    for (const schedule of dueSchedules) {
      try {
        // Get pending earnings for this creator
        const { data: pendingEarnings, error: earningsError } = await supabase
          .from('creator_earnings')
          .select('*')
          .eq('creator_id', schedule.creator_id)
          .eq('payout_status', 'pending')
          .gte('net_earnings', schedule.minimum_payout_amount)

        if (earningsError) {
          errors.push(`Error fetching earnings for creator ${schedule.creator_id}: ${earningsError.message}`)
          continue
        }

        if (!pendingEarnings || pendingEarnings.length === 0) {
          console.log(`No eligible earnings for creator ${schedule.creator_id}`)
          continue
        }

        // Calculate total available payout amount
        const totalAvailable = pendingEarnings.reduce((sum, earning) => sum + earning.net_earnings, 0)

        if (totalAvailable < schedule.minimum_payout_amount) {
          console.log(`Total available (${totalAvailable}) below minimum (${schedule.minimum_payout_amount}) for creator ${schedule.creator_id}`)
          continue
        }

        // Check if creator has Connect account and it's verified
        const connectAccount = schedule.connect_account?.[0]
        if (!connectAccount || !connectAccount.payouts_enabled) {
          errors.push(`Creator ${schedule.creator_id} does not have a verified Connect account`)
          continue
        }

        // Create payout requests for each eligible earning period
        for (const earning of pendingEarnings) {
          const processingFee = Math.round(earning.net_earnings * 0.029 + 30) // 2.9% + $0.30
          const netPayoutAmount = earning.net_earnings - processingFee

          // Create payout request
          const { data: payoutRequest, error: requestError } = await supabase
            .from('payout_requests')
            .insert({
              creator_id: schedule.creator_id,
              earnings_id: earning.id,
              requested_amount: earning.net_earnings,
              request_type: 'automatic',
              status: schedule.requires_approval ? 'pending' : 'approved',
              processing_fee: processingFee,
              net_payout_amount: netPayoutAmount,
              metadata: {
                schedule_id: schedule.id,
                automated: true,
                processed_at: new Date().toISOString()
              }
            })
            .select()
            .single()

          if (requestError) {
            errors.push(`Error creating payout request for earning ${earning.id}: ${requestError.message}`)
            continue
          }

          // If no approval required, process the transfer immediately
          if (!schedule.requires_approval) {
            try {
              const transfer = await stripe.transfers.create({
                amount: netPayoutAmount,
                currency: 'usd',
                destination: connectAccount.stripe_account_id,
                description: `Automated payout for ${earning.period_start} to ${earning.period_end}`,
                metadata: {
                  platform: 'fansworld',
                  payout_request_id: payoutRequest.id,
                  earnings_id: earning.id,
                  creator_id: schedule.creator_id,
                  automated: 'true'
                }
              })

              // Update payout request with transfer details
              await supabase
                .from('payout_requests')
                .update({
                  status: 'processing',
                  stripe_transfer_id: transfer.id,
                  stripe_transfer_status: transfer.status || 'pending'
                })
                .eq('id', payoutRequest.id)

              // Update earnings record
              await supabase
                .from('creator_earnings')
                .update({
                  payout_status: 'processing',
                  stripe_transfer_id: transfer.id,
                  stripe_transfer_status: transfer.status || 'pending',
                  stripe_connect_account_id: connectAccount.stripe_account_id,
                  actual_payout_date: new Date().toISOString().split('T')[0]
                })
                .eq('id', earning.id)

              processedPayouts.push({
                creator_id: schedule.creator_id,
                payout_request_id: payoutRequest.id,
                earnings_id: earning.id,
                amount: netPayoutAmount,
                transfer_id: transfer.id,
                status: 'processing'
              })
            } catch (stripeError) {
              errors.push(`Stripe transfer failed for payout request ${payoutRequest.id}: ${stripeError.message}`)
              
              // Update payout request status to failed
              await supabase
                .from('payout_requests')
                .update({
                  status: 'failed',
                  failure_reason: stripeError.message
                })
                .eq('id', payoutRequest.id)
            }
          } else {
            // Approval required - just log the pending request
            processedPayouts.push({
              creator_id: schedule.creator_id,
              payout_request_id: payoutRequest.id,
              earnings_id: earning.id,
              amount: netPayoutAmount,
              status: 'pending_approval'
            })
          }
        }

        // Calculate next payout date
        const nextPayoutDate = calculateNextPayoutDate(
          schedule.frequency,
          schedule.day_of_week,
          schedule.day_of_month,
          new Date(today)
        )

        // Update schedule with next payout date
        await supabase
          .from('payout_schedules')
          .update({
            next_payout_date: nextPayoutDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', schedule.id)

      } catch (error) {
        errors.push(`Error processing schedule ${schedule.id}: ${error.message}`)
        continue
      }
    }

    // Send notification email about processed payouts if any
    if (processedPayouts.length > 0) {
      try {
        await supabase.functions.invoke('send-payout-notifications', {
          body: {
            type: 'scheduled_payouts_processed',
            payouts: processedPayouts,
            errors: errors
          }
        })
      } catch (notificationError) {
        console.error('Failed to send payout notifications:', notificationError)
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Scheduled payouts processed successfully',
        processed: processedPayouts.length,
        errors: errors.length,
        details: {
          processed_payouts: processedPayouts,
          errors: errors
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error processing scheduled payouts:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

function calculateNextPayoutDate(
  frequency: string,
  dayOfWeek: number | null,
  dayOfMonth: number | null,
  fromDate: Date
): string {
  const nextDate = new Date(fromDate)

  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'bi_weekly':
      nextDate.setDate(nextDate.getDate() + 14)
      break
    case 'monthly':
      if (dayOfMonth) {
        nextDate.setMonth(nextDate.getMonth() + 1)
        nextDate.setDate(dayOfMonth)
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1)
      }
      break
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3)
      if (dayOfMonth) {
        nextDate.setDate(dayOfMonth)
      }
      break
    default:
      nextDate.setMonth(nextDate.getMonth() + 1)
  }

  return nextDate.toISOString().split('T')[0]
}