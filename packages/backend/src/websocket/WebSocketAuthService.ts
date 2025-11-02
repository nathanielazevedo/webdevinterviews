import { SupabaseClientService } from '../services/supabase-client.service.js';
import { logger } from '../utils/logger.js';

const log = logger;

// Get singleton Supabase clients
const supabaseClient = SupabaseClientService.getAnonClient();
const supabaseAdmin = SupabaseClientService.getAdminClient();

export interface AuthenticatedUser {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

export class WebSocketAuthService {
  
  /**
   * Verify WebSocket JWT token
   */
  static async verifyToken(token: string): Promise<AuthenticatedUser | null> {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);

      if (error || !user) {
        return null;
      }
      
      return {
        sub: user.id,
        email: user.email,
        ...user.user_metadata
      };
    } catch (error) {
      log.error('Error verifying WebSocket token:', error);
      return null;
    }
  }

  /**
   * Get display name for a user
   */
  static async getDisplayName(userId: string): Promise<string> {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (error || !data?.user) {
        return userId;
      }

      const user = data.user;
      return user.user_metadata?.display_name || 
             user.user_metadata?.username || 
             user.user_metadata?.name || 
             user.email?.split('@')[0] || 
             userId;
    } catch (error) {
      log.error(`Error fetching display name for user ${userId}:`, error);
      return userId;
    }
  }

  /**
   * Get all users from Supabase (for player list)
   */
  static async getAllUsers(): Promise<{ users: unknown[] } | null> {
    try {
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
      
      if (error) {
        log.error('Error fetching users from auth:', error);
        return null;
      }

      return users;
    } catch (error) {
      log.error('Error in getAllUsers:', error);
      return null;
    }
  }
}
