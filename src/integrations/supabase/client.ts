import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = (typeof window !== "undefined" && (window as any).process?.env?.VITE_SUPABASE_URL) || 
  process.env.VITE_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "";

export const SUPABASE_PUBLISHABLE_KEY = (typeof window !== "undefined" && (window as any).process?.env?.VITE_SUPABASE_ANON_KEY) || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "";

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY ? 
  createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : 
  null;
