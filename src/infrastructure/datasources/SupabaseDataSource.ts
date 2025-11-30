import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../../lib/security-enhanced';

export interface Database {
  // This interface would match your actual database schema
  // For now, we'll define a minimal interface
}

export class SupabaseDataSource {
  private client: SupabaseClient<Database>;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Use anon key for client-side, not service role

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Supabase configuration missing');
      throw new Error('Supabase configuration is required');
    }

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    });
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }

  // Get auth client for authentication operations
  getAuth() {
    return this.client.auth;
  }
}

// Singleton instance
let instance: SupabaseDataSource | null = null;

export const getSupabaseDataSource = (): SupabaseDataSource => {
  if (!instance) {
    instance = new SupabaseDataSource();
  }
  return instance;
};