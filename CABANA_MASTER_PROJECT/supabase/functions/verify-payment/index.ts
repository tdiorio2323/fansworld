import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    logStep("Session retrieved", { sessionId: session_id, status: session.payment_status });

    if (session.payment_status === "paid") {
      if (session.mode === "subscription") {
        // Handle subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const { creator_id, subscriber_id } = session.metadata || {};
        
        if (creator_id && subscriber_id) {
          // Update or create subscription record
          await supabaseClient.from("subscriptions").upsert({
            creator_id,
            subscriber_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
            amount: subscription.items.data[0].price.unit_amount,
            currency: subscription.items.data[0].price.currency,
            status: "active",
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          }, { onConflict: "stripe_subscription_id" });

          // Update creator earnings
          await supabaseClient.rpc("update_creator_earnings", {
            creator_id,
            amount: subscription.items.data[0].price.unit_amount || 0,
            earning_type: "subscription"
          });

          logStep("Subscription updated", { subscriptionId: subscription.id });
        }
      } else {
        // Handle one-time payment (tip)
        const { creator_id, tipper_id, type } = session.metadata || {};
        
        if (creator_id && tipper_id) {
          // Update transaction status
          await supabaseClient
            .from("transactions")
            .update({ 
              status: "completed",
              stripe_payment_intent_id: session.payment_intent as string
            })
            .eq("stripe_session_id", session_id);

          // Update creator earnings
          await supabaseClient.rpc("update_creator_earnings", {
            creator_id,
            amount: session.amount_total || 0,
            earning_type: type === "tip" ? "tip" : "ppv"
          });

          logStep("Payment completed", { sessionId: session_id, type });
        }
      }
    }

    return new Response(JSON.stringify({ 
      status: session.payment_status,
      mode: session.mode 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});