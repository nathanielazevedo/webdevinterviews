import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';

import { WebSocketAuthService } from './WebSocketAuthService.js';
import { WebSocketMessageHandler } from './WebSocketMessageHandler.js';
import { WebSocketConnectionService } from './WebSocketConnectionService.js';
import { WebSocketBroadcastService } from './WebSocketBroadcastService.js';
import { WebSocketStatusService } from './WebSocketStatusService.js';
import { WebSocketUserService } from './WebSocketUserService.js';
import { logger } from '../utils/logger.js';
import type { Player, WebSocketMessage, PlayerData } from '@webdevinterviews/shared';

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
  private userService: WebSocketUserService;
  private messageHandler: WebSocketMessageHandler;

  constructor() {
    this.connectedPlayers = new Map();
    this.playerData = new Map();
    this.statusWatchers = new Map();
    this.connectionService = new WebSocketConnectionService(this.connectedPlayers, this.playerData, this.statusWatchers);
    this.broadcastService = new WebSocketBroadcastService(this.connectedPlayers, this.playerData, this.statusWatchers);
    this.statusService = new WebSocketStatusService(this.statusWatchers);
    this.userService = new WebSocketUserService(this.connectedPlayers, this.playerData);
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
    log.info('WebSocket server initialized');
    wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
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

              // Delegate all message handling to the message handler service
              await this.messageHandler.handleMessage(message, ws, userId);

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

  // Helper function to get display name for a user - delegated to user service
  private async getDisplayName(userId: string): Promise<string> {
    return this.userService.getDisplayName(userId);
  }

  // Helper function to get all connected players - delegated to user service
  async getAllPlayers(): Promise<Player[]> {
    return this.userService.getAllPlayers();
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