import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { createClient } from '@supabase/supabase-js';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import { WebSocketMessage, PlayerData, StatusWatcher, BattleResult } from '../types/websocket.js';
import type { Player } from '@webdevinterviews/shared/src/types/battle';
import { QuestionsService } from '../services/questions.service.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';

const log = logger;

// Supabase JWT verification setup
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Create Supabase client for token verification
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyWebSocketToken(token: string): Promise<{ sub: string; email?: string; [key: string]: unknown } | null> {
  try {
    // Use Supabase client to verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      log.warn('WebSocket token verification failed', error);
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
    log.info('Setting up WebSocket server');
    wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
      log.info('New WebSocket connection attempt from:', request.socket.remoteAddress);
      try {
        const url = new URL(request.url || '', 'http://localhost');
        const token = url.searchParams.get('token');

        if (!token) {
          log.warn('WebSocket connection rejected: no token provided');
          ws.close(1008, 'Authentication required');
          return;
        }

        // Verify the JWT token
        const user = await verifyWebSocketToken(token);
        if (!user) {
          log.warn('WebSocket connection rejected: invalid token');
          ws.close(1008, 'Invalid authentication token');
          return;
        }

        const userId = user.sub;
        const connectionId = Math.random().toString(36).substring(7);
        
        log.info(`WebSocket connection established for user: ${userId}, connectionId: ${connectionId}`);


        // Set up message handling with authenticated user
        ws.on('message', async (data: Buffer) => {
          log.info(`Raw message received from ${userId}, length: ${data.length}`);
          
          // Handle the message in a separate async function to catch all errors
          (async () => {
            try {
              const message: WebSocketMessage = JSON.parse(data.toString());
              log.info(`Parsed WebSocket message from ${userId}:`, { type: message.type, hasUserId: !!message.userId });

              if (message.type === 'join') {
                log.info(`User ${userId} sent join message`);
                await this.handleJoinMessage(ws, userId);
                log.info(`Join message handling completed for user: ${userId}`);
              } else if (message.type === 'end-battle') {
                await this.handleEndBattleMessage(message, ws, userId);
              } else if (message.type === 'start-battle') {
                await this.handleStartBattleMessage(message, ws, userId);
              } else if (message.type === 'test-results') {
                await this.handleTestResultsMessage(message, ws, userId);
              } else {
                log.warn(`Unknown message type from ${userId}: ${message.type}`);
              }

            } catch (error) {
              log.error(`Error processing WebSocket message from ${userId}:`, error);
              log.error(`Raw message data:`, data.toString());
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
          log.info(`WebSocket connection closed for user: ${userId}, connectionId: ${connectionId}`);
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

  private async handleJoinMessage(
    ws: WebSocket, 
    authenticatedUserId: string
  ): Promise<void> {
    const userId = authenticatedUserId;
    
    try {
      this.connectedPlayers.set(userId, ws);
      
      if (!this.playerData.has(userId)) {
        this.playerData.set(userId, {
          testsPassed: 0,
          joinedAt: new Date().toISOString()
        });
      } else {
        // Player data already exists, just log
        log.info(`Updated WebSocket connection for existing user: ${userId}`);
      }
      
      log.info(`User ${userId} successfully joined battle`);
      
      // Log with display name
      this.getDisplayName(userId).then(displayName => {
        log.info(`${displayName} joined the battle`);
      }).catch(err => {
        log.error('Error getting display name for join log:', err);
      });
      
      // Create or get battle for the main room
      try {
        log.info(`Managing battle for main room`);
        const battle = await BattleService.getBattle('');
        
        if (!battle) {
          log.info(`No current battle found, creating new battle for user ${userId}`);
          // Still broadcast player list even if no battle exists
        } else {
          log.info(`Found existing battle: ${battle.id}`);
          await BattleParticipationService.addParticipant(userId);
          
          // Send battle status to the joining user
          const battleStatus = {
            type: 'battle-status',
            status: battle.status,
            isAdmin: battle.admin_user_id == userId,
            battleId: battle.id
          };
          
          log.info(`Sending battle status to user ${userId}`, { battleStatus });
          ws.send(JSON.stringify(battleStatus));
        }
      } catch (battleError) {
        log.error('Error managing battle:', battleError);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to manage battle'
        }));
      }
      
      // Broadcast updated player list to all users (moved outside battle check)
      try {
        await this.broadcastPlayerList();
        log.info(`Player list broadcast completed for user ${userId}`);
      } catch (broadcastError) {
        log.error('Error broadcasting player list on join:', broadcastError);
      }
      
      // Broadcast battle status change to watchers (new player joined)
      try {
        await this.broadcastBattleStatus('player-joined');
        log.info(`Battle status broadcast completed for user ${userId}`);
      } catch (statusError) {
        log.error('Error broadcasting battle status on player join:', statusError);
      }
      
    } catch (error) {
      log.error(`Critical error in handleJoinMessage for user ${userId}:`, error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to join battle'
        }));
      }
      // Don't rethrow - we want to log the error but not crash the connection
    }
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
      const isAdmin = await BattleService.isAdminForBattle(userId);
      if (!isAdmin) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Only admins can end battles'
        }));
        return;
      }

      log.info(`Admin ${userId} requesting to end battle`);

      // Get current battle
      const battle = await BattleService.getCurrentBattle();
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
        completedAt: new Date().toISOString()  // Set completion time to now
      }));

      const completedBattle = await BattleService.completeBattle(currentResults, userId);

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
      const isAdmin = await BattleService.isAdminForBattle(userId);
      if (!isAdmin) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Only admins can start battles'
        }));
        return;
      }

      log.info(`Admin ${userId} requesting to start battle`);

      // Get current battle
      const battle = await BattleService.getCurrentBattle();
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
      const startedBattle = await BattleService.startBattle(userId);
      // Get selected question if it exists

      const newBattle = await BattleService.getCurrentBattle();
      let selectedQuestion = null;
      // @ts-ignore - selected_question_id exists in database but not in generated types yet
      if (newBattle.selected_question_id) {
        try {
          // @ts-ignore - selected_question_id exists in database but not in generated types yet
          selectedQuestion = await QuestionsService.getQuestionById(newBattle.selected_question_id.toString());
        } catch (error) {
          log.warn('Could not fetch selected question for battle', error);
        }
      }
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
        startedAt: startedBattle.started_at,
        selectedQuestion
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

  private async handleTestResultsMessage(
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
      const { testsPassed } = message;
      
      if (typeof testsPassed !== 'number') {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid test results format'
        }));
        return;
      }

      // Update player data in memory
      const existingData = this.playerData.get(userId) || {
        testsPassed: 0,
        joinedAt: new Date().toISOString()
      };

      this.playerData.set(userId, {
        ...existingData,
        testsPassed
      });

      // Update battle participation record in database
      try {
        await BattleParticipationService.updateParticipation(userId, testsPassed);
      } catch (dbError) {
        log.error(`Error updating battle participation for user ${userId}:`, dbError);
        // Continue with broadcasting even if DB update fails
      }

      log.info(`Updated test results for user ${userId}: ${testsPassed} tests passed`);

      // Broadcast updated player list
      await this.broadcastPlayerList();

    } catch (error) {
      log.error(`Error handling test results for user ${userId}:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to update test results'
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
      
      // Log with display name
      this.getDisplayName(userId).then(displayName => {
        log.info(`${displayName} left the battle`);
      }).catch(err => {
        log.error('Error getting display name for leave log:', err);
      });
      
      if (this.connectedPlayers.size > 0) {
        log.info(`Battle still has ${this.connectedPlayers.size} users remaining`);
        // Broadcast updated player list when someone leaves
        this.broadcastPlayerList().catch((err: Error) => 
          log.error('Error broadcasting player list on disconnect:', err)
        );
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

  // Helper function to get display name for a user
  private async getDisplayName(userId: string): Promise<string> {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error || !data?.user) {
        log.debug(`Could not fetch user data for ${userId}, using ID as fallback`);
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

  // Helper function to get all connected players
  async getAllPlayers(): Promise<Player[]> {
    log.debug(`Getting all connected players`);

    const players: Player[] = [];
    const userIds = Array.from(this.connectedPlayers.keys());

    try {
      // Fetch user profiles from Supabase auth
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      log.debug(`Fetching user data for ${userIds.length} users from Supabase auth`);

      // Get user metadata from auth.users
      const { data: users, error } = await supabase.auth.admin.listUsers();
      console.log('All users dog', users.users);
      if (error) {
        log.error('Error fetching users from auth:', error);
        // Fall back to user IDs without usernames
        this.connectedPlayers.forEach((ws, userId) => {
          if (!userId) {
            log.error('Found connected player with undefined userId, skipping');
            return;
          }
          
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
      } else {
        log.debug(`Fetched ${users.users.length} users from Supabase auth`);
        
        // Create a map of userId to user metadata for quick lookup
        const userMap = new Map<string, { displayName: string; avatar?: string; email?: string }>();
        users.users.forEach(user => {
          if (userIds.includes(user.id)) {
            const displayName = user.user_metadata?.display_name || 
                               user.user_metadata?.username || 
                               user.user_metadata?.name || 
                               user.email?.split('@')[0] || 
                               user.id;
            userMap.set(user.id, {
              displayName,
              avatar: user.user_metadata?.avatar,
              email: user.email
            });
            log.debug(`User ${user.id} -> displayName: ${displayName}, avatar: ${user.user_metadata?.avatar}`);
          }
        });

        this.connectedPlayers.forEach((ws, userId) => {
          if (!userId) {
            log.error('Found connected player with undefined userId, skipping');
            return;
          }
          
          const data = this.playerData.get(userId);
          const userInfo = userMap.get(userId);
          const player: Player = {
            userId,
            username: userInfo?.displayName || userId,
            avatar: userInfo?.avatar,
            testsPassed: data?.testsPassed || 0,
            joinedAt: data?.joinedAt || new Date().toISOString(),
            isConnected: ws.readyState === WebSocket.OPEN
          };
          players.push(player);
          log.debug(`Player data for ${userId}`, { player });
        });
      }
    } catch (error) {
      log.error('Error fetching player data:', error);
      // Fall back to basic player data without usernames
      this.connectedPlayers.forEach((ws, userId) => {
        if (!userId) {
          log.error('Found connected player with undefined userId in fallback, skipping');
          return;
        }
        
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
  }  // Helper function to broadcast player list to all users
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

  // Helper function to broadcast battle status changes to watchers
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
          isCompleted: battle.status === 'completed',
          connectedPlayers,
          startedAt: battle.started_at,
          
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