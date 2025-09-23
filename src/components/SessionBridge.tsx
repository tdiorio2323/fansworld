import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { getUser, saveUser, getScopesForRole, type Scope, type Role } from "@/lib/access";

// Initialize Supabase client with safe environment variable handling
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not configured. SessionBridge will not function.");
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function scopesForRole(role?: string): Scope[] {
  const r = (role || "").toLowerCase() as Role;
  if (r === "admin") return getScopesForRole("admin");
  if (r === "creator") return getScopesForRole("creator");
  if (r === "brand") return getScopesForRole("brand");
  if (r === "member") return getScopesForRole("member");
  return [];
}

export default function SessionBridge() {
  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not initialized. Skipping session sync.");
      return;
    }

    // Initial sync on mount
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        return;
      }

      const session = data.session;
      if (session?.user) {
        const meta: any = session.user.user_metadata || {};
        const appMeta: any = session.user.app_metadata || {};
        const scopes = scopesForRole(meta.role || appMeta.role);
        const current = getUser();

        // Check VIP status from waitlist
        checkVipStatus(session.user.email).then(vipStatus => {
          const next = {
            id: session.user.id,
            email: session.user.email || current.email,
            role: (meta.role || appMeta.role || "member") as Role,
            scopes: Array.from(new Set([...(current.scopes || []), ...scopes])),
            tier: meta.tier || appMeta.tier || current.tier,
            vipStatus: vipStatus || current.vipStatus || "none",
            metadata: {
              ...current.metadata,
              ...meta,
              lastLogin: new Date().toISOString(),
              provider: session.user.app_metadata.provider
            }
          };

          if (current.id !== next.id || JSON.stringify(current.scopes) !== JSON.stringify(next.scopes) || current.vipStatus !== next.vipStatus) {
            saveUser(next);
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const meta: any = session.user.user_metadata || {};
        const appMeta: any = session.user.app_metadata || {};
        const scopes = scopesForRole(meta.role || appMeta.role);
        const current = getUser();

        // Check VIP status from waitlist
        const vipStatus = await checkVipStatus(session.user.email);

        const next = {
          id: session.user.id,
          email: session.user.email || current.email,
          role: (meta.role || appMeta.role || "member") as Role,
          scopes: Array.from(new Set([...(current.scopes || []), ...scopes])),
          tier: meta.tier || appMeta.tier || current.tier,
          vipStatus: vipStatus || current.vipStatus || "none",
          metadata: {
            ...current.metadata,
            ...meta,
            lastLogin: new Date().toISOString(),
            provider: session.user.app_metadata.provider,
            authEvent: event
          }
        };

        if (current.id !== next.id || JSON.stringify(current.scopes) !== JSON.stringify(next.scopes) || current.vipStatus !== next.vipStatus) {
          saveUser(next);
        }
      } else {
        // User signed out
        saveUser({ id: "anon", role: "guest", scopes: [], vipStatus: "none" });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return null;
}

// Helper function to check VIP status from waitlist
async function checkVipStatus(email?: string): Promise<"none" | "waitlisted" | "invited" | "active"> {
  if (!email || !supabase) return "none";

  try {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .select("status, invite_code")
      .eq("email", email)
      .single();

    if (error || !data) return "none";

    switch (data.status) {
      case "WAITLISTED":
        return "waitlisted";
      case "INVITED":
        return "invited";
      case "APPROVED":
        return "active";
      default:
        return "none";
    }
  } catch (error) {
    console.error("Error checking VIP status:", error);
    return "none";
  }
}

export { supabase };