import { WebSocket } from 'ws';
import { SupabaseClientService } from '../services/supabase-client.service.js';
import { logger } from '../utils/logger.js';
import type { Player, PlayerData } from '@webdevinterviews/shared';

export class WebSocketUserService {
  
  constructor(
    private connectedPlayers: Map<string, WebSocket>,
    private playerData: Map<string, PlayerData>
  ) {}

  /**
   * Get display name from user data
   */
  async getDisplayName(userId: string): Promise<string> {
    try {
      const supabase = SupabaseClientService.getAdminClient();

      // Try to get from user metadata first
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        logger.error(`Failed to get user data for ${userId}:`, userError);
      } else if (userData?.user?.user_metadata?.display_name) {
        return userData.user.user_metadata.display_name;
      }

      // If no display_name in metadata, try profile table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        logger.error(`Failed to get profile for ${userId}:`, profileError);
        return 'Anonymous';
      }

      return profile?.display_name || 'Anonymous';
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
        username: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anonymous',
        avatar: user.user_metadata?.avatar_url,
        testsPassed: 0, // Default - could be enhanced to fetch from profiles table
        joinedAt: user.created_at,
        isConnected: this.connectedPlayers.has(user.id)
      }));
    } catch (error) {
      logger.error('Failed to get all players:', error);
      throw error;
    }
  }
}