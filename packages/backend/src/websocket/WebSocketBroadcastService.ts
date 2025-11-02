import { WebSocket } from 'ws';
import { SupabaseClientService } from '../services/supabase-client.service.js';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import type { Player } from '@webdevinterviews/shared';
import { BattleParticipationService } from '../services/battle-participation.service.js';

const log = logger;

export class WebSocketBroadcastService {
  private connectedPlayers: Map<string, WebSocket>;

  constructor(
    connectedPlayers: Map<string, WebSocket>
  ) {
    this.connectedPlayers = connectedPlayers;
  }

  /**
   * Broadcast player list to all connected users
   */
  async broadcastPlayerList(): Promise<void> {
    if (this.connectedPlayers.size === 0) {
      return;
    }

    try {
      const players = await this.getAllPlayers();
      const message = JSON.stringify({
        type: 'players-list',
        players
      });

      this.connectedPlayers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    } catch (error) {
      log.error('Error broadcasting player list:', error);
    }
  }

  /**
   * Broadcast battle status changes to watchers
   */
  async broadcastBattleStatus(statusChange?: string): Promise<void> {
    try {
      // Get current battle status
      const battle = await BattleService.getCurrentBattle();
      const connectedPlayers = this.connectedPlayers.size;
      
      let battleStatus: Record<string, unknown>;
      if (!battle) {
        battleStatus = {
          status: 'no-battle',
          canJoin: true,
          connectedPlayers
        };
      } else {
        battleStatus = {
          status: battle.status,
          canJoin: battle.status === 'waiting' || battle.status === 'active',
          isActive: battle.status === 'active',
          isWaiting: battle.status === 'waiting',
          battleId: battle.id,
          connectedPlayers,
          scheduledStart: battle.scheduled_start_time,
          actualStart: battle.started_at,
          completedAt: battle.completed_at
        };
      }

      const message = JSON.stringify({
        type: 'battle-status',
        ...battleStatus,
        statusChange,
        timestamp: new Date().toISOString()
      });

      // Send to all connected players
      this.connectedPlayers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });

    } catch (error) {
      log.error('Error broadcasting battle status:', error);
    }
  }

  /**
   * Send message to specific player
   */
  sendToPlayer(userId: string, message: object): boolean {
    const ws = this.connectedPlayers.get(userId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      log.error(`Error sending message to player ${userId}:`, error);
      return false;
    }
  }

  /**
   * Broadcast message to all connected players
   */
  broadcastToAllPlayers(message: object): number {
    let sentCount = 0;
    const messageStr = JSON.stringify(message);

    this.connectedPlayers.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageStr);
          sentCount++;
        } catch (error) {
          log.error(`Error broadcasting to player ${userId}:`, error);
        }
      }
    });

    return sentCount;
  }

  /**
   * Get all players with their display names from Supabase
   */
  private async getAllPlayers(): Promise<Player[]> {
    const players: Player[] = [];

    if (this.connectedPlayers.size === 0) {
      return players;
    }

    const userIds = Array.from(this.connectedPlayers.keys());

    try {
      // Get Supabase client
      const supabase = SupabaseClientService.getAdminClient();

      // Fetch user profiles from Supabase Auth
      const { data: authUsers, error } = await supabase.auth.admin.listUsers();
      
      let users: Array<{ id: string; email?: string; user_metadata?: Record<string, unknown> }> = [];
      if (error) {
        log.error('Error fetching user profiles:', error);
        // Fall back to using user IDs as display names
      } else {
        // Filter to only the users we need
        users = authUsers.users.filter(user => userIds.includes(user.id));
      }

      // Create user lookup map
      const userLookup = new Map<string, { displayName: string; email?: string }>();
      if (users) {
        users.forEach(user => {
          const metadata = user.user_metadata || {};
          const displayName = metadata.display_name || metadata.full_name || user.email || user.id;
          userLookup.set(user.id, {
            displayName: String(displayName),
            email: user.email
          });
        });
      }

      // Get current battle and participation data for connected users
      const currentBattle = await BattleService.getCurrentBattle();
      let participationMap = new Map();
      
      if (currentBattle) {
        const participationData = await BattleParticipationService.getBattleParticipants(currentBattle.id) as Array<{ user_id: string; tests_passed: number; joined_at: string }>;
        participationMap = new Map(participationData.map(p => [p.user_id, p]));
      }

      // Build players array
      this.connectedPlayers.forEach((ws, userId) => {
        const userInfo = userLookup.get(userId);
        const participation = participationMap.get(userId);
        
        const player: Player = {
          userId,
          username: userInfo?.displayName || userId, // Use display name or fallback to userId
          testsPassed: participation?.tests_passed || 0,
          joinedAt: participation?.joined_at || new Date().toISOString(),
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });

    } catch (error) {
      log.error('Error in getAllPlayers:', error);
      
      // Fallback: create players with basic info
      this.connectedPlayers.forEach((ws, userId) => {
        const player: Player = {
          userId,
          username: userId, // Use userId as fallback
          testsPassed: 0, // Default when no participation data available
          joinedAt: new Date().toISOString(), // Default to now
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });
    }

    return players;
  }
}
