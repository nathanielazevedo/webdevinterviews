import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Centralized Supabase client service
 * Provides singleton instances for different auth contexts
 */
class SupabaseClientService {
  private static adminClient: SupabaseClient | null = null;
  private static anonClient: SupabaseClient | null = null;

  /**
   * Get Supabase admin client (service role key)
   * Used for server-side operations that bypass RLS
   */
  static getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !serviceKey) {
        throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
      }

      this.adminClient = createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
    return this.adminClient;
  }

  /**
   * Get Supabase anonymous client (anon key)
   * Used for client-side operations with RLS
   */
  static getAnonClient(): SupabaseClient {
    if (!this.anonClient) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !anonKey) {
        throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY are required');
      }

      this.anonClient = createClient(supabaseUrl, anonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
    return this.anonClient;
  }

  /**
   * Reset clients (useful for testing or config changes)
   */
  static reset(): void {
    this.adminClient = null;
    this.anonClient = null;
  }
}

export { SupabaseClientService };