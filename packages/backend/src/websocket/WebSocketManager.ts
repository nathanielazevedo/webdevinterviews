import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { createClient } from '@supabase/supabase-js';
import { BattleService } from '../services/battle.service.js';
import { QuestionsService } from '../services/questions.service.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { WebSocketAuthService } from './WebSocketAuthService.js';
import { WebSocketMessageHandler } from './WebSocketMessageHandler.js';
import { WebSocketConnectionService } from './WebSocketConnectionService.js';
import { WebSocketBroadcastService } from './WebSocketBroadcastService.js';
import { WebSocketStatusService } from './WebSocketStatusService.js';
import { logger } from '../utils/logger.js';
import type { Player, WebSocketMessage, PlayerData, BattleResult } from '@webdevinterviews/shared';

// Backend-specific types
interface StatusWatcher {
  ws: WebSocket;
}

const log = logger;



export class WebSocketManager {
  private connectedPlayers: Map<string, WebSocket>;
  private playerData: Map<string, PlayerData>;
  private statusWatchers: Map<string, StatusWatcher>;
  private connectionService: WebSocketConnectionService;
  private broadcastService: WebSocketBroadcastService;
  private statusService: WebSocketStatusService;
  private messageHandler: WebSocketMessageHandler;

  constructor() {
    this.connectedPlayers = new Map();
    this.playerData = new Map();
    this.statusWatchers = new Map();
    this.connectionService = new WebSocketConnectionService(this.connectedPlayers, this.playerData, this.statusWatchers);
    this.broadcastService = new WebSocketBroadcastService(this.connectedPlayers, this.playerData, this.statusWatchers);
    this.statusService = new WebSocketStatusService(this.statusWatchers);
    this.messageHandler = new WebSocketMessageHandler(this.connectedPlayers, this.playerData);
  }

  // Public getters for external access
  get connectedPlayersMap() { return this.connectedPlayers; }
  get playerDataMap() { return this.playerData; }
  get statusWatchersMap() { return this.statusWatchers; }

  // Public method for external battle status broadcasting
  broadcastBattleStatus = (statusChange?: string) => {
    return this.broadcastService.broadcastBattleStatus(statusChange);
  };

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
        const user = await WebSocketAuthService.verifyToken(token);
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
      // Use connection service to handle player connection
      this.connectionService.addPlayerConnection(userId, ws);
      
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
        await this.broadcastService.broadcastPlayerList();
        log.info(`Player list broadcast completed for user ${userId}`);
      } catch (broadcastError) {
        log.error('Error broadcasting player list on join:', broadcastError);
      }
      
      // Broadcast battle status change to watchers (new player joined)
      try {
        await this.broadcastService.broadcastBattleStatus('player-joined');
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
      this.broadcastService.broadcastBattleStatus('battle-ended');

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
          log.warn('Could not fetch selected question for battle', { error: String(error) });
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
      this.broadcastService.broadcastBattleStatus('battle-started');

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

      // Update player data using connection service
      this.connectionService.updatePlayerTestResults(userId, testsPassed);

      // Update battle participation record in database
      try {
        await BattleParticipationService.updateParticipation(userId, testsPassed);
      } catch (dbError) {
        log.error(`Error updating battle participation for user ${userId}:`, dbError);
        // Continue with broadcasting even if DB update fails
      }

      log.info(`Updated test results for user ${userId}: ${testsPassed} tests passed`);

      // Broadcast updated player list
      await this.broadcastService.broadcastPlayerList();

    } catch (error) {
      log.error(`Error handling test results for user ${userId}:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to update test results'
      }));
    }
  }

  private handleDisconnection(userId: string | null, connectionId: string): void {
    if (userId) {
      // Use connection service to handle disconnection
      this.connectionService.handleDisconnection(userId, connectionId);
      
      // Log with display name
      this.getDisplayName(userId).then(displayName => {
        log.info(`${displayName} left the battle`);
      }).catch(err => {
        log.error('Error getting display name for leave log:', err);
      });
      
      if (this.connectedPlayers.size > 0) {
        log.info(`Battle still has ${this.connectedPlayers.size} users remaining`);
        // Broadcast updated player list when someone leaves
        this.broadcastService.broadcastPlayerList().catch((err: Error) => 
          log.error('Error broadcasting player list on disconnect:', err)
        );
        // Broadcast battle status change to watchers (player left)
        this.broadcastService.broadcastBattleStatus('player-left').catch((err: Error) => 
          log.error('Error broadcasting battle status on player leave:', err)
        );
      } else {
        log.info(`Battle is now empty - no remaining users`);
      }
    } else {
      // Just handle status watcher disconnection
      this.statusService.removeStatusWatcher(connectionId);
    }
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
      log.debug('Retrieved users from Supabase auth', { userCount: users?.users?.length });
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