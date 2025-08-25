import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REDEEM-INVITE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key for invite operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, invite_code, passcode, user_id } = await req.json();

    switch (action) {
      case "validate": {
        logStep("Validating invite", { invite_code, passcode });

        const { data: invite, error } = await supabaseClient
          .from("invites")
          .select("*")
          .eq("invite_code", invite_code)
          .eq("passcode", passcode.toUpperCase())
          .eq("status", "active")
          .single();

        if (error || !invite) {
          logStep("Invalid invite", { error: error?.message });
          return new Response(JSON.stringify({
            success: false,
            error: "Invalid invite code or passcode"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        // Check if expired
        if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
          logStep("Invite expired", { expires_at: invite.expires_at });
          return new Response(JSON.stringify({
            success: false,
            error: "This invite has expired"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        // Check usage limits
        if (invite.current_uses >= invite.max_uses) {
          logStep("Invite fully used", { current_uses: invite.current_uses, max_uses: invite.max_uses });
          return new Response(JSON.stringify({
            success: false,
            error: "This invite has reached its usage limit"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        logStep("Invite validated successfully", { invite_id: invite.id });
        
        return new Response(JSON.stringify({
          success: true,
          invite: {
            id: invite.id,
            intended_for: invite.intended_for,
            description: invite.description
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "use": {
        if (!user_id) {
          throw new Error("User ID is required to mark invite as used");
        }

        logStep("Marking invite as used", { invite_code, user_id });

        // First validate the invite again
        const { data: invite, error: fetchError } = await supabaseClient
          .from("invites")
          .select("*")
          .eq("invite_code", invite_code)
          .eq("passcode", passcode.toUpperCase())
          .eq("status", "active")
          .single();

        if (fetchError || !invite) {
          throw new Error("Invalid invite");
        }

        // Update invite usage
        const updateData: any = {
          current_uses: invite.current_uses + 1,
          used_at: new Date().toISOString(),
        };

        // If single use or reached max uses, mark as used
        if (invite.max_uses === 1 || invite.current_uses + 1 >= invite.max_uses) {
          updateData.status = "used";
          updateData.used_by = user_id;
        }

        const { error: updateError } = await supabaseClient
          .from("invites")
          .update(updateData)
          .eq("id", invite.id);

        if (updateError) throw updateError;

        logStep("Invite marked as used", { invite_id: invite.id, new_usage: updateData.current_uses });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "check": {
        // Just check if invite code exists and is valid (without passcode)
        const { data: invite, error } = await supabaseClient
          .from("invites")
          .select("id, intended_for, description, status, expires_at, current_uses, max_uses")
          .eq("invite_code", invite_code)
          .eq("status", "active")
          .single();

        if (error || !invite) {
          return new Response(JSON.stringify({
            success: false,
            error: "Invalid or expired invite code"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        // Check if expired
        if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
          return new Response(JSON.stringify({
            success: false,
            error: "This invite has expired"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        return new Response(JSON.stringify({
          success: true,
          invite: {
            intended_for: invite.intended_for,
            description: invite.description,
            remaining_uses: invite.max_uses - invite.current_uses
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});