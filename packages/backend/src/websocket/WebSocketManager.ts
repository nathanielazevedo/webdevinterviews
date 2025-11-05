import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';

import { WebSocketAuthService } from './WebSocketAuthService.js';
import { WebSocketMessageHandler } from './WebSocketMessageHandler.js';
import { WebSocketBroadcastService } from './WebSocketBroadcastService.js';

import { WebSocketUserService } from './WebSocketUserService.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { BattleService } from '../services/battle.service.js';
import { BotPlayerService } from '../services/bot-player.service.js';
import { BOT_CONFIG } from '../utils/bot-config.js';
import { logger } from '../utils/logger.js';
import type { Player, WebSocketMessage, Battle } from '@webdevinterviews/shared';

const log = logger;


export class WebSocketManager {
  private connectedPlayers: Map<string, WebSocket>;
  private broadcastService: WebSocketBroadcastService;
  private userService: WebSocketUserService;
  private messageHandler: WebSocketMessageHandler;

  constructor() {
    this.connectedPlayers = new Map();
    this.broadcastService = new WebSocketBroadcastService(this.connectedPlayers);
    this.userService = new WebSocketUserService(this.connectedPlayers);
    this.messageHandler = new WebSocketMessageHandler(this.connectedPlayers, this.broadcastService);
  }

  // Public getters for external access
  get connectedPlayersMap() { return this.connectedPlayers; }

  // Public method for external battle status broadcasting
  broadcastBattleStatus = (statusChange?: string) => {
    return this.broadcastService.broadcastBattleStatus(statusChange);
  };

  // Public method for external player list broadcasting
  broadcastPlayerList = () => {
    return this.broadcastService.broadcastPlayerList();
  };

  setupWebSocketServer(wss: WebSocketServer): void {
    wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
      log.info('New WebSocket connection attempt received');
      try {
        const url = new URL(request.url || '', 'http://localhost');
        const token = url.searchParams.get('token');

        if (!token) {
          log.warn('WebSocket connection rejected - no token provided');
          ws.close(1008, 'Authentication required');
          return;
        }

        // Verify the JWT token
        log.info('Verifying WebSocket authentication token...');
        const user = await WebSocketAuthService.verifyToken(token);
        if (!user) {
          log.warn('WebSocket connection rejected - invalid token');
          ws.close(1008, 'Invalid authentication token');
          return;
        }
        log.info(`WebSocket authentication successful for user: ${user.sub}`);

        const userId = user.sub;
        const connectionId = Math.random().toString(36).substring(7);

        log.info(`WebSocket connection established for user: ${userId} (connectionId: ${connectionId})`);

        // Add player connection
        this.connectedPlayers.set(userId, ws);
        log.info(`Added user ${userId} to connected players map. Total connections: ${this.connectedPlayers.size}`);
        
        // Add player to current battle participation if they're not already in it
        try {
          await BattleParticipationService.addParticipant(userId);
          log.info(`Successfully added participant ${userId} to battle via WebSocket connection`);
        } catch {
          // Participant may already exist, which is fine
          log.info(`Player ${userId} may already be in battle participation`);
        }

        // Handle on-demand battle logic (after adding to participation)
        try {
          await this.handleOnDemandBattleJoin(userId);
        } catch (battleError) {
          log.error(`Error handling on-demand battle join for ${userId}:`, battleError);
        }
        
        // Broadcast initial state to newly connected player and all players
        try {
          await this.broadcastService.broadcastPlayerList();
          await this.broadcastBattleStatus('player-joined');
          log.info(`Broadcasted initial state for user ${userId}`);
        } catch (broadcastError) {
          log.error(`Error broadcasting initial state for ${userId}:`, broadcastError);
        }


        // Set up message handling with authenticated user
        ws.on('message', async (data: Buffer) => {
          // Handle the message in a separate async function to catch all errors
          (async () => {
            try {
              log.info(`WebSocketManager: Raw message received from ${userId}:`, data.toString());
              const message: WebSocketMessage = JSON.parse(data.toString());
              log.info(`WebSocketManager: Parsed message for ${userId}:`, JSON.stringify(message));

              // Delegate all message handling to the message handler service
              await this.messageHandler.handleMessage(message, ws, userId);

            } catch (error) {
              log.error(`Error processing WebSocket message from ${userId}:`, error);
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'error',
                  message: 'Internal server error processing message'
                }));
              }
            }
          })().catch((unhandledError) => {
            log.error(`Unhandled error in message handler for ${userId}:`, unhandledError);
            // Don't close the connection for unhandled errors
          });
        });

        ws.on('close', () => {
          this.handleDisconnection(userId, connectionId);
        });

        ws.on('error', (error: Error) => {
          log.error(`WebSocket error for user ${userId}:`, error);
        });

      } catch (error) {
        log.error('Error establishing WebSocket connection:', error);
        ws.close(1011, 'Internal server error');
      }
    });
  }

  private handleDisconnection(userId: string | null, _connectionId: string): void {
    if (userId) {
      // Remove from connected players
      this.connectedPlayers.delete(userId);
      
      if (this.connectedPlayers.size > 0) {
        // Broadcast updated player list when someone leaves
        this.broadcastService.broadcastPlayerList().catch((err: Error) => 
          log.error('Error broadcasting player list on disconnect:', err)
        );
        // Broadcast battle status change (player left)
        this.broadcastBattleStatus('player-left').catch((err: Error) => 
          log.error('Error broadcasting battle status on player leave:', err)
        );
      }
    }
  }

  // Helper function to get all connected players - delegated to user service
  async getAllPlayers(): Promise<Player[]> {
    return this.userService.getAllPlayers();
  }


  // Get connected player count
  getConnectedPlayerCount(): number {
    return this.connectedPlayers.size;
  }

  // Broadcast to all connected players - delegate to broadcast service
  broadcastToAllPlayers(message: Record<string, unknown>): number {
    return this.broadcastService.broadcastToAllPlayers(message);
  }

  /**
   * Handle on-demand battle join logic
   * 1. Check if there's a waiting battle
   * 2. If yes and no auto_start_time set, set it for 1 minute from now
   * 3. If no waiting battle, create one and set auto_start_time
   * 4. Broadcast countdown to all players
   * 5. Remove bots if we're at capacity and need room for real players
   */
  private async handleOnDemandBattleJoin(userId: string): Promise<void> {
    try {
      // Get current battle (could be waiting or active)
      const currentBattle = await BattleService.getCurrentBattle();
      
      // If there's an active battle, just join it
      if (currentBattle?.status === 'active') {
        log.info(`User ${userId} joining active battle ${currentBattle.id}`);
        return;
      }
      
      // If there's a waiting battle with auto_start_time already set, just join
      if (currentBattle?.status === 'waiting' && currentBattle.auto_start_time) {
        log.info(`User ${userId} joining waiting battle ${currentBattle.id} (starts at ${currentBattle.auto_start_time})`);
        
        // Check if we need to remove bots to make room for this real player
        await this.makeRoomForRealPlayer(currentBattle.id);
        
        await this.broadcastBattleCountdown(currentBattle);
        return;
      }
      
      // If there's a waiting battle without auto_start_time, this is the first player - set timer
      if (currentBattle?.status === 'waiting' && !currentBattle.auto_start_time) {
        log.info(`User ${userId} is first player - setting auto-start timer for battle ${currentBattle.id}`);
        const updatedBattle = await BattleService.setAutoStartTime(currentBattle.id, 1); // 1 minute
        await this.broadcastBattleCountdown(updatedBattle);
        
        // Schedule bot spawning after a delay (to feel more natural)
        this.scheduleBotsForBattle(updatedBattle.id);
        
        return;
      }
      
      // No waiting battle exists - create one (without auto_start_time yet)
      if (!currentBattle) {
        log.info(`No battle exists - creating new on-demand battle for first player ${userId}`);
        const newBattle = await BattleService.createCurrentBattle();
        
        // Set auto-start time since this is the first player
        const battleWithTimer = await BattleService.setAutoStartTime(newBattle.id, 1); // 1 minute
        log.info(`Created battle ${battleWithTimer.id} with auto-start at ${battleWithTimer.auto_start_time}`);
        
        await this.broadcastBattleCountdown(battleWithTimer);
        
        // Schedule bot spawning after a delay (to feel more natural)
        this.scheduleBotsForBattle(battleWithTimer.id);
        
        return;
      }
      
    } catch (error) {
      log.error('Error in handleOnDemandBattleJoin:', error);
      throw error;
    }
  }

  /**
   * Broadcast battle countdown to all connected players
   */
  private async broadcastBattleCountdown(battle: Battle): Promise<void> {
    if (!battle.auto_start_time) {
      return;
    }

    const timeUntilStart = new Date(battle.auto_start_time).getTime() - Date.now();
    const message = {
      type: 'battle-countdown',
      battleId: battle.id,
      autoStartTime: battle.auto_start_time,
      secondsUntilStart: Math.ceil(timeUntilStart / 1000),
      status: battle.status
    };

    this.broadcastToAllPlayers(message);
    log.info(`Broadcast battle countdown: ${Math.ceil(timeUntilStart / 1000)} seconds until start`);
  }

  /**
   * Schedule bots to join battle after a delay (feels more natural than instant join)
   */
  private scheduleBotsForBattle(battleId: string): void {
    log.info(`Scheduling bots to spawn for battle ${battleId} in ${BOT_CONFIG.SPAWN_BOTS_AFTER_COUNTDOWN_STARTS} seconds`);
    
    setTimeout(async () => {
      log.info(`Bot spawn timer fired for battle ${battleId}`);
      
      try {
        // Get current battle to check status
        const battle = await BattleService.getCurrentBattle();
        if (!battle || battle.id !== battleId || battle.status !== 'waiting') {
          log.info(`Battle ${battleId} is no longer waiting, skipping bot spawn`);
          return;
        }

        // Count real players (non-bot connected players)
        const realPlayerCount = this.connectedPlayers.size;
        
        // Get current total players (including any bots already added)
        const participants = await BattleService.getBattleParticipants(battleId);
        const currentTotalPlayers = participants.length;
        
        // Check if we should spawn bots
        if (!BotPlayerService.shouldSpawnBots(realPlayerCount, currentTotalPlayers)) {
          log.info(`Battle ${battleId} has ${realPlayerCount} real players and ${currentTotalPlayers} total, no bots needed`);
          return;
        }

        // Get the selected question to know how many tests
        const totalTests = battle.selectedQuestion?.test_cases?.length || 10;
        
        // Spawn bots
        log.info(`Spawning bots for battle ${battleId} (${realPlayerCount} real players, ${totalTests} tests)`);
        const spawnedBots = await BotPlayerService.spawnBotsForBattle(battleId, realPlayerCount, totalTests);
        log.info(`Successfully spawned ${spawnedBots.length} bots for battle ${battleId}`);
        
        // Broadcast updated player list to show bots joined
        log.info(`Broadcasting player list after bot spawn for battle ${battleId}`);
        await this.broadcastService.broadcastPlayerList();
        await this.broadcastBattleStatus('bots-joined');
        
      } catch (error) {
        log.error(`Error spawning bots for battle ${battleId}:`, error);
      }
    }, BOT_CONFIG.SPAWN_BOTS_AFTER_COUNTDOWN_STARTS * 1000);
  }

  /**
   * Make room for a real player by removing bots if at capacity
   */
  private async makeRoomForRealPlayer(battleId: string): Promise<void> {
    try {
      const participants = await BattleService.getBattleParticipants(battleId);
      const MAX_PLAYERS = BOT_CONFIG.TARGET_TOTAL_PLAYERS;
      
      // If we're at or over capacity, remove a bot to make room
      if (participants.length >= MAX_PLAYERS) {
        const botCount = BotPlayerService.getBotCount(battleId);
        if (botCount > 0) {
          log.info(`Battle ${battleId} at capacity (${participants.length}/${MAX_PLAYERS}), removing 1 bot to make room for real player`);
          await BotPlayerService.removeBotsFromBattle(battleId, 1);
          
          // Broadcast updated player list
          await this.broadcastService.broadcastPlayerList();
        }
      }
    } catch (error) {
      log.error(`Error making room for real player in battle ${battleId}:`, error);
    }
  }
}