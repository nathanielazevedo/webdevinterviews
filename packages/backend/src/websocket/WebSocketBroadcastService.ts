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
    log.debug(`Broadcasting player list to all users`);

    if (this.connectedPlayers.size === 0) {
      log.debug(`No connected players to broadcast to`);
      return;
    }

    try {
      const players = await this.getAllPlayers();
      const message = JSON.stringify({
        type: 'players-list',
        players
      });

      let sentCount = 0;
      this.connectedPlayers.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
          sentCount++;
          log.debug(`Player list sent to user: ${userId}`);
        } else {
          log.debug(`Skipped sending to user ${userId} - connection not ready (state: ${ws.readyState})`);
        }
      });

      log.info(`Player list broadcast completed`, {
        totalUsers: this.connectedPlayers.size,
        sentTo: sentCount,
        playerCount: players.length
      });
    } catch (error) {
      log.error('Error broadcasting player list:', error);
    }
  }

  /**
   * Broadcast battle status changes to watchers
   */
  async broadcastBattleStatus(statusChange?: string): Promise<void> {
    log.debug(`Broadcasting battle status`, { statusChange });
    
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
      let watchersSentCount = 0;
      this.statusWatchers.forEach((watcher, connectionId) => {
        if (watcher.ws.readyState === WebSocket.OPEN) {
          watcher.ws.send(message);
          watchersSentCount++;
          log.debug(`Battle status sent to watcher: ${connectionId}`);
        }
      });

      // Also send to all connected players
      let playersSentCount = 0;
      this.connectedPlayers.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
          playersSentCount++;
          log.debug(`Battle status sent to player: ${userId}`);
        }
      });

      log.info(`Battle status broadcast completed`, {
        statusWatchers: watchersSentCount,
        players: playersSentCount,
        statusChange,
        battleStatus: battle?.status || 'no-battle'
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
      log.warn(`Cannot send message to ${userId}: connection not available`);
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      log.debug(`Message sent to player ${userId}`, { type: (message as Record<string, unknown>).type });
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
          log.debug(`Broadcast message sent to player: ${userId}`);
        } catch (error) {
          log.error(`Error broadcasting to player ${userId}:`, error);
        }
      }
    });

    log.info(`Broadcast completed`, {
      totalPlayers: this.connectedPlayers.size,
      sentTo: sentCount,
      messageType: (message as Record<string, unknown>).type
    });

    return sentCount;
  }

  /**
   * Get all players with their display names from Supabase
   */
  private async getAllPlayers(): Promise<Player[]> {
    log.debug(`Getting all players`);
    const players: Player[] = [];

    if (this.connectedPlayers.size === 0) {
      log.debug(`No connected players`);
      return players;
    }

    const userIds = Array.from(this.connectedPlayers.keys());
    log.debug(`Connected user IDs:`, userIds);

    try {
      // Create Supabase client
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Fetch user profiles from Supabase
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, email')
        .in('id', userIds);

      if (error) {
        log.error('Error fetching user profiles:', error);
        // Fall back to using user IDs as display names
      }

      // Create user lookup map
      const userLookup = new Map();
      if (users) {
        users.forEach((user: Record<string, unknown>) => {
          userLookup.set(user.id, {
            displayName: user.display_name || user.full_name || user.email || user.id,
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

    log.debug(`Found ${players.length} connected players`);
    return players;
  }
}