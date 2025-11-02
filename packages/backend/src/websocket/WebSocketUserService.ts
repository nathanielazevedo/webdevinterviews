import { WebSocket } from 'ws';
import { SupabaseClientService } from '../services/supabase-client.service.js';
import { logger } from '../utils/logger.js';
import type { Player } from '@webdevinterviews/shared';

export class WebSocketUserService {
  
  constructor(
    private connectedPlayers: Map<string, WebSocket>
  ) {}

  /**
   * Get display name from user data
   */
  async getDisplayName(userId: string): Promise<string> {
    try {
      const supabase = SupabaseClientService.getAdminClient();

      // Get from user metadata
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        logger.error(`Failed to get user data for ${userId}:`, userError);
        return 'Anonymous';
      }

      // Extract display name from metadata, email, or fallback to Anonymous
      const user = userData?.user;
      if (user?.user_metadata?.display_name) {
        return user.user_metadata.display_name;
      }
      
      if (user?.user_metadata?.full_name) {
        return user.user_metadata.full_name;
      }
      
      if (user?.email) {
        return user.email.split('@')[0];
      }

      return 'Anonymous';
    } catch (error) {
      logger.error(`Error getting display name for ${userId}:`, error);
      return 'Anonymous';
    }
  }

  /**
   * Get all players from Supabase auth with their profiles
   */
  async getAllPlayers(): Promise<Player[]> {
    try {
      const supabase = SupabaseClientService.getAdminClient();

      const { data: users, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      });

      if (error) {
        throw error;
      }

      // Transform Supabase User data to Player interface
      return (users?.users || []).map(user => ({
        userId: user.id,
        username: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar: user.user_metadata?.avatar_url,
        testsPassed: 0, // Default - comes from battle participation data
        joinedAt: user.created_at,
        isConnected: this.connectedPlayers.has(user.id)
      }));
    } catch (error) {
      logger.error('Failed to get all players:', error);
      throw error;
    }
  }
}