import { WebSocket } from 'ws';
import { createClient } from '@supabase/supabase-js';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import type { Player, PlayerData } from '@webdevinterviews/shared';

// Backend-specific types
interface StatusWatcher {
  ws: WebSocket;
}

const log = logger;

export class WebSocketBroadcastService {
  private connectedPlayers: Map<string, WebSocket>;
  private playerData: Map<string, PlayerData>;
  private statusWatchers: Map<string, StatusWatcher>;

  constructor(
    connectedPlayers: Map<string, WebSocket>,
    playerData: Map<string, PlayerData>,
    statusWatchers: Map<string, StatusWatcher>
  ) {
    this.connectedPlayers = connectedPlayers;
    this.playerData = playerData;
    this.statusWatchers = statusWatchers;
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

      // Send to all status watchers
      this.statusWatchers.forEach((watcher) => {
        if (watcher.ws.readyState === WebSocket.OPEN) {
          watcher.ws.send(message);
        }
      });

      // Also send to all connected players
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
      // Create Supabase client
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

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

      // Build players array
      this.connectedPlayers.forEach((ws, userId) => {
        const data = this.playerData.get(userId);
        const userInfo = userLookup.get(userId);
        
        const player: Player = {
          userId,
          username: userInfo?.displayName || userId, // Use display name or fallback to userId
          testsPassed: data?.testsPassed || 0,
          joinedAt: data?.joinedAt || new Date().toISOString(),
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });

    } catch (error) {
      log.error('Error in getAllPlayers:', error);
      
      // Fallback: create players with basic info
      this.connectedPlayers.forEach((ws, userId) => {
        const data = this.playerData.get(userId);
        const player: Player = {
          userId,
          username: userId, // Use userId as fallback
          testsPassed: data?.testsPassed || 0,
          joinedAt: data?.joinedAt || new Date().toISOString(),
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });
    }

    return players;
  }
}
