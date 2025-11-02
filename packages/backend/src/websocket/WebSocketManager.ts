import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';

import { WebSocketAuthService } from './WebSocketAuthService.js';
import { WebSocketMessageHandler } from './WebSocketMessageHandler.js';
import { WebSocketBroadcastService } from './WebSocketBroadcastService.js';

import { WebSocketUserService } from './WebSocketUserService.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { logger } from '../utils/logger.js';
import type { Player, WebSocketMessage } from '@webdevinterviews/shared';

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
}