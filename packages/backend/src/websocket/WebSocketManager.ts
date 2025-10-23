import { WebSocket, WebSocketServer } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import { WebSocketMessage, PlayerData, StatusWatcher, BattleResult } from '../types/websocket.js';
import type { Player } from '@webdevinterviews/shared';

const log = logger;

const BATTLE_ROOM_ID = 'battle_main'; // Single battle room constant

export class WebSocketManager {
  private connectedPlayers: Map<string, WebSocket>;
  private playerData: Map<string, PlayerData>;
  private statusWatchers: Map<string, StatusWatcher>;

  constructor() {
    this.connectedPlayers = new Map();
    this.playerData = new Map();
    this.statusWatchers = new Map();
  }

  // Public getters for external access
  get connectedPlayersMap() { return this.connectedPlayers; }
  get playerDataMap() { return this.playerData; }
  get statusWatchersMap() { return this.statusWatchers; }

  setupWebSocketServer(wss: WebSocketServer): void {
    wss.on('connection', (ws: WebSocket) => {
      let userId: string | null = null;
      const connectionId = Math.random().toString(36).substring(7);
      
      log.info(`New WebSocket connection established`, { connectionId });

      ws.on('message', async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          log.debug(`Received message from ${userId || connectionId}`, {
            type: message.type,
            userId: message.userId || userId,
            messageData: message
          });

          if (message.type === 'join') {
            await this.handleJoinMessage(message, ws, connectionId, (user) => {
              userId = user;
            });
          } else if (message.type === 'end-battle') {
            await this.handleEndBattleMessage(message, ws, userId);
          } else if (message.type === 'start-battle') {
            await this.handleStartBattleMessage(message, ws, userId);
          }
          // Add more message handlers here as needed

        } catch (error) {
          log.error(`Error processing WebSocket message from ${userId || connectionId}:`, error);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format or processing error'
            }));
          }
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(userId, connectionId);
      });

      ws.on('error', (error: Error) => {
        log.error(`WebSocket error for connection ${connectionId}:`, error);
      });
    });
  }

  private async handleJoinMessage(
    message: WebSocketMessage, 
    ws: WebSocket, 
    connectionId: string,
    updateConnectionInfo: (userId: string) => void
  ): Promise<void> {
    const userId = message.userId!;

    log.info(`User attempting to join battle`, {
      userId,
      connectionId
    });

    // Add player to connected players
    this.connectedPlayers.set(userId, ws);
    
    // Initialize or update player data
    if (!this.playerData.has(userId)) {
      this.playerData.set(userId, {
        ws,
        testsPassed: 0,
        totalTests: 0,
        joinedAt: new Date().toISOString()
      });
      log.info(`New player data created for user: ${userId}`);
    } else {
      // Update WebSocket connection for existing player
      const existing = this.playerData.get(userId)!;
      existing.ws = ws;
      log.info(`Updated WebSocket connection for existing user: ${userId}`);
    }
    
    log.info(`User ${userId} successfully joined battle`);
    
    // Create or get battle for the main room
    try {
      log.info(`Managing battle for main room`);
      let battle = await BattleService.getBattle(BATTLE_ROOM_ID);
      
      if (!battle) {
        // Create new battle in waiting state when first user joins
        // Admin is the first user to join or specified admin
        const adminUserId = process.env.ADMIN_USER_ID || userId;
        log.info(`Creating new battle for main room`, {
          adminUserId,
          isDefaultAdmin: !process.env.ADMIN_USER_ID
        });
        
        battle = await BattleService.createBattle(BATTLE_ROOM_ID, adminUserId, [{ userId, joinedAt: new Date().toISOString() }]);
        log.info(`Battle created successfully`, {
          battleId: battle.id,
          status: battle.status,
          adminUserId: battle.admin_user_id
        });
      } else {
        // Add participant to existing battle
        log.info(`Adding participant to existing battle`, {
          battleId: battle.id,
          userId,
          currentStatus: battle.status
        });
        await BattleService.addParticipantToBattle(BATTLE_ROOM_ID, userId);
      }
      
      // Send battle status to the joining user
      const battleStatus = {
        type: 'battle-status',
        status: battle.status,
        isAdmin: battle.admin_user_id == userId,
        battleId: battle.id
      };
      
      log.info(`Sending battle status to user ${userId}`, { battleStatus });
      ws.send(JSON.stringify(battleStatus));
    } catch (error) {
      log.error('Error managing battle:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to manage battle'
      }));
    }
    
    // Update connection info for the parent scope
    updateConnectionInfo(userId);
    
    // Broadcast updated player list to all users
    this.broadcastPlayerList();
    
    // Broadcast battle status change to watchers (new player joined)
    this.broadcastBattleStatus('player-joined').catch((err: Error) => 
      log.error('Error broadcasting battle status on player join:', err)
    );
  }

  private async handleEndBattleMessage(
    message: WebSocketMessage,
    ws: WebSocket,
    userId: string | null
  ): Promise<void> {
    if (!userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not authenticated'
      }));
      return;
    }

    try {
      // Check if user is admin for this battle
      const isAdmin = await BattleService.isAdminForBattle(BATTLE_ROOM_ID, userId);
      if (!isAdmin) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Only admins can end battles'
        }));
        return;
      }

      log.info(`Admin ${userId} requesting to end battle`);

      // Get current battle
      const battle = await BattleService.getBattle(BATTLE_ROOM_ID);
      if (!battle) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'No active battle found'
        }));
        return;
      }

      if (battle.status !== 'active') {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Battle is not currently active'
        }));
        return;
      }

      // End the battle with current results
      const currentResults: BattleResult[] = Array.from(this.playerData.entries()).map(([playerId, data]) => ({
        userId: playerId,
        testsPassed: data.testsPassed || 0,
        totalTests: data.totalTests || 0,
        completedAt: new Date().toISOString()  // Set completion time to now
      }));

      const completedBattle = await BattleService.completeBattle(BATTLE_ROOM_ID, currentResults, userId);

      log.info(`Battle ended by admin`, {
        battleId: completedBattle.id,
        endedBy: userId,
        finalResults: currentResults
      });

      // Broadcast battle completion to all connected clients
      const completionMessage = {
        type: 'battle-completed',
        battleId: completedBattle.id,
        results: currentResults,
        endedBy: userId
      };

      for (const playerWs of this.connectedPlayers.values()) {
        if (playerWs.readyState === WebSocket.OPEN) {
          playerWs.send(JSON.stringify(completionMessage));
        }
      }

      // Broadcast updated battle status
      this.broadcastBattleStatus('battle-ended');

    } catch (error) {
      log.error(`Error ending battle by admin ${userId}:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to end battle'
      }));
    }
  }

  private async handleStartBattleMessage(
    message: WebSocketMessage,
    ws: WebSocket,
    userId: string | null
  ): Promise<void> {
    if (!userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not authenticated'
      }));
      return;
    }

    try {
      // Check if user is admin for this battle
      const isAdmin = await BattleService.isAdminForBattle(BATTLE_ROOM_ID, userId);
      if (!isAdmin) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Only admins can start battles'
        }));
        return;
      }

      log.info(`Admin ${userId} requesting to start battle`);

      // Get current battle
      const battle = await BattleService.getBattle(BATTLE_ROOM_ID);
      if (!battle) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'No battle found'
        }));
        return;
      }

      if (battle.status !== 'waiting') {
        ws.send(JSON.stringify({
          type: 'error',
          message: `Battle is not in waiting state (current: ${battle.status})`
        }));
        return;
      }

      // Start the battle
      const startedBattle = await BattleService.startBattle(BATTLE_ROOM_ID, userId);

      log.info(`Battle started by admin`, {
        battleId: startedBattle.id,
        startedBy: userId,
        startedAt: startedBattle.started_at
      });

      // Broadcast battle start to all connected clients
      const startMessage = {
        type: 'battle-started',
        battleId: startedBattle.id,
        startedBy: userId,
        startedAt: startedBattle.started_at
      };

      for (const playerWs of this.connectedPlayers.values()) {
        if (playerWs.readyState === WebSocket.OPEN) {
          playerWs.send(JSON.stringify(startMessage));
        }
      }

      // Broadcast updated battle status
      this.broadcastBattleStatus('battle-started');

    } catch (error) {
      log.error(`Error starting battle by admin ${userId}:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to start battle'
      }));
    }
  }

  private handleDisconnection(userId: string | null, connectionId: string): void {
    log.info(`WebSocket connection closed`, {
      userId: userId || 'unknown',
      connectionId
    });
    
    if (userId) {
      this.connectedPlayers.delete(userId);
      log.info(`User ${userId} removed from battle`);
      
      if (this.connectedPlayers.size > 0) {
        log.info(`Battle still has ${this.connectedPlayers.size} users remaining`);
        // Broadcast updated player list when someone leaves
        this.broadcastPlayerList();
        // Broadcast battle status change to watchers (player left)
        this.broadcastBattleStatus('player-left').catch((err: Error) => 
          log.error('Error broadcasting battle status on player leave:', err)
        );
      } else {
        log.info(`Battle is now empty - no remaining users`);
      }
    }
    
    // Clean up status watchers
    this.statusWatchers.delete(connectionId);
  }

  // Helper function to get all connected players
  getAllPlayers(): Player[] {
    log.debug(`Getting all connected players`);
    
    const players: Player[] = [];
    this.connectedPlayers.forEach((ws, userId) => {
      const data = this.playerData.get(userId);
      const player: Player = {
        userId,
        testsPassed: data?.testsPassed || 0,
        totalTests: data?.totalTests || 0,
        joinedAt: data?.joinedAt || new Date().toISOString(),
        isConnected: ws.readyState === WebSocket.OPEN
      };
      players.push(player);
      log.debug(`Player data for ${userId}`, { player });
    });
    
    log.debug(`Found ${players.length} connected players`);
    return players;
  }

  // Helper function to broadcast player list to all users
  broadcastPlayerList(): void {
    log.debug(`Broadcasting player list to all users`);
    
    if (this.connectedPlayers.size === 0) {
      log.debug(`No connected players to broadcast to`);
      return;
    }
    
    const players = this.getAllPlayers();
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
  }

  // Helper function to broadcast battle status changes to watchers
  async broadcastBattleStatus(statusChange?: string): Promise<void> {
    log.debug(`Broadcasting battle status`, { statusChange });
    
    try {
      // Get current battle status
      const battle = await BattleService.getBattle(BATTLE_ROOM_ID);
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
          isCompleted: battle.status === 'completed',
          connectedPlayers,
          participantCount: battle.participants?.length || 0,
          startedAt: battle.started_at
        };
      }
      
      // Add change information if provided
      if (statusChange) {
        battleStatus.change = statusChange;
      }
      
      const message = JSON.stringify({
        type: 'battle-status-update',
        ...battleStatus
      });
      
      // Send to all status watchers
      let sentCount = 0;
      this.statusWatchers.forEach((watcher, connectionId) => {
        if (watcher.ws.readyState === WebSocket.OPEN) {
          watcher.ws.send(message);
          sentCount++;
          log.debug(`Battle status sent to watcher: ${connectionId}`);
        }
      });
      
      log.info(`Battle status broadcast completed`, {
        sentToWatchers: sentCount,
        battleStatus
      });
      
    } catch (error) {
      log.error(`Error broadcasting battle status:`, error);
    }
  }

  // Get connected player count
  getConnectedPlayerCount(): number {
    return this.connectedPlayers.size;
  }

  // Broadcast to all connected players
  broadcastToAllPlayers(message: Record<string, unknown>): void {
    const messageStr = JSON.stringify(message);
    let sentCount = 0;
    
    this.connectedPlayers.forEach((ws, _userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
        sentCount++;
      }
    });
    
    log.info(`Message broadcasted to ${sentCount}/${this.connectedPlayers.size} players`, {
      messageType: message.type
    });
  }
}