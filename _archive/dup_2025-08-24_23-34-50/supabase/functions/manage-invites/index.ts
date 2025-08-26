import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MANAGE-INVITES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role, is_admin")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && !profile.is_admin)) {
      throw new Error("Unauthorized: Admin access required");
    }

    logStep("Admin verified", { userId: user.id, role: profile.role });

    const { action, ...payload } = await req.json();

    switch (action) {
      case "create": {
        const { intended_for, description, expires_in_days, max_uses } = payload;
        
        // Generate unique codes
        let invite_code, passcode;
        let attempts = 0;
        do {
          const { data: inviteCodeData } = await supabaseClient.rpc('generate_invite_code');
          invite_code = inviteCodeData;
          const { data: passcodeData } = await supabaseClient.rpc('generate_passcode');
          passcode = passcodeData;
          attempts++;
        } while (attempts < 5); // Prevent infinite loop

        const expires_at = expires_in_days 
          ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString()
          : null;

        const { data: invite, error } = await supabaseClient
          .from("invites")
          .insert({
            invite_code,
            passcode,
            created_by: user.id,
            intended_for,
            description,
            expires_at,
            max_uses: max_uses || 1,
          })
          .select()
          .single();

        if (error) throw error;

        logStep("Invite created", { inviteCode: invite_code });
        
        return new Response(JSON.stringify({
          success: true,
          invite: {
            ...invite,
            invite_url: `${req.headers.get("origin")}/invite/${invite_code}`
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "list": {
        const { data: invites, error } = await supabaseClient
          .from("invites")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, invites }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "update": {
        const { invite_id, status, description } = payload;
        
        const { data: invite, error } = await supabaseClient
          .from("invites")
          .update({ status, description })
          .eq("id", invite_id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, invite }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "delete": {
        const { invite_id } = payload;
        
        const { error } = await supabaseClient
          .from("invites")
          .delete()
          .eq("id", invite_id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
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