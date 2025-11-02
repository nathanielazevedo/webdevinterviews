import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { logger } from '../utils/logger.js';
import type { WebSocketMessage, BattleResult } from '@webdevinterviews/shared';
import type { WebSocketBroadcastService } from './WebSocketBroadcastService.js';

const log = logger;

export class WebSocketMessageHandler {
  
  constructor(
    private connectedPlayers: Map<string, WebSocket>,
    private broadcastService?: WebSocketBroadcastService // Optional for now to avoid breaking existing code
  ) {}



  /**
   * Handle join message from client
   */
  async handleJoinMessage(
    ws: WebSocket,
    userId: string,
    _message: WebSocketMessage
  ): Promise<void> {
    try {

      // Add participant to current battle
      try {
        await BattleParticipationService.addParticipant(userId);
      } catch {
        // Participant might already exist, continue
      }

      // Get current battle info and question - create battle if none exists
      try {
        let battleData = await BattleService.getCurrentBattle();
        
        // If no battle exists, create one (similar to old /current endpoint behavior)
        if (!battleData) {
          try {
            battleData = await BattleService.createCurrentBattle();
          } catch (createError) {
            log.error(`Failed to create battle for user ${userId}:`, createError);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'join-response',
                success: false,
                error: 'Failed to create battle'
              }));
            }
            return;
          }
        }
        
        if (ws.readyState === WebSocket.OPEN) {
          log.info(`Preparing join-response for user: ${userId}`);

          const joinResponse = {
            type: 'join-response',
            success: true,
            battle: battleData
          };
          
          // Send battle data directly - it already includes question info via Prisma includes
          ws.send(JSON.stringify(joinResponse));

        } else {
          log.warn(`WebSocket not open for user ${userId}, readyState: ${ws.readyState}`);
        }

        // Broadcast battle status to all participants
        this.sendToBattleParticipants({
          type: 'battle-status'
        } as WebSocketMessage);

        // Send current players list to the joining user and broadcast to all
        await this.sendPlayersListToUser(ws, userId);

      } catch (error) {
        log.error(`Failed to get battle information for user ${userId}:`, error);
        if (ws.readyState === WebSocket.OPEN) {
          const errorResponse = {
            type: 'join-response',
            success: false,
            error: 'Failed to get battle information'
          };
          log.info(`Sending error join-response to user ${userId}:`, JSON.stringify(errorResponse));
          ws.send(JSON.stringify(errorResponse));
        } else {
          log.warn(`Cannot send error response to user ${userId}, WebSocket not open`);
        }
      }

    } catch (error) {
      log.error(`Failed to handle join message for user ${userId}:`, error);
      if (ws.readyState === WebSocket.OPEN) {
        const errorResponse = {
          type: 'join-response',
          success: false,
          error: 'Failed to join battle'
        };
        log.info(`Sending final error join-response to user ${userId}:`, JSON.stringify(errorResponse));
        ws.send(JSON.stringify(errorResponse));
      } else {
        log.warn(`Cannot send final error response to user ${userId}, WebSocket not open`);
      }
    }
  }

  /**
   * Handle start battle message
   */
  async handleStartBattleMessage(
    ws: WebSocket,
    userId: string,
    _message: WebSocketMessage
  ): Promise<void> {
    try {
      if (!userId) {
        return;
      }


      // Check if user is admin for current battle
      const isAdmin = await BattleService.isAdminForBattle(userId);
      if (!isAdmin) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'start-battle-response',
            success: false,
            error: 'Only battle admin can start the battle'
          }));
        }
        return;
      }

      // Start the battle
      await BattleService.startBattle(userId);
      
      // Broadcast battle start to all participants
      this.sendToBattleParticipants({
        type: 'battle-started'
      } as WebSocketMessage);


    } catch (error) {
      log.error('Failed to start battle:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'start-battle-response',
          success: false,
          error: 'Failed to start battle'
        }));
      }
    }
  }

  /**
   * Handle end battle message
   */
  async handleEndBattleMessage(
    ws: WebSocket,
    userId: string,
    _message: WebSocketMessage
  ): Promise<void> {
    try {
      if (!userId) {
        return;
      }


      // Check if user is admin for current battle
      const isAdmin = await BattleService.isAdminForBattle(userId);
      if (!isAdmin) {
        return;
      }

      // Get current battle
      const battle = await BattleService.getCurrentBattle();
      if (!battle) {
        return;
      }

      if (battle.status !== 'active') {
        return;
      }

      // Collect results from connected players
      // Get current battle and participants from database
      const currentBattle = await BattleService.getCurrentBattle();
      if (!currentBattle) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'No current battle found'
        }));
        return;
      }

      const participationData = await BattleParticipationService.getBattleParticipants(currentBattle.id) as Array<{ user_id: string; tests_passed: number }>;
      
      const results: BattleResult[] = [];
      let placement = 1;
      
      // Build results from connected participants
      for (const participant of participationData) {
        if (this.connectedPlayers.has(participant.user_id)) {
          results.push({
            userId: participant.user_id,
            testsPassed: participant.tests_passed || 0,
            completionTime: 0, // Will be calculated elsewhere
            placement
          });
          placement++;
        }
      }

      // Complete the battle
      await BattleService.completeBattle(results, userId);

      // Broadcast battle end to all participants
      for (const playerWs of this.connectedPlayers.values()) {
        if (playerWs.readyState === WebSocket.OPEN) {
          playerWs.send(JSON.stringify({
            type: 'battle-ended',
            endedBy: userId,
            results
          }));
        }
      }


    } catch (error) {
      log.error('Failed to end battle:', error);
    }
  }

  /**
   * Send current players list to a specific user and broadcast to all
   */
  private async sendPlayersListToUser(ws: WebSocket, userId: string): Promise<void> {
    try {
      if (this.broadcastService) {
        // Broadcast updated players list to all connected users
        await this.broadcastService.broadcastPlayerList();
        log.info(`Broadcasted updated players list after user ${userId} joined`);
      } else {
        log.warn('BroadcastService not available, cannot send players list');
      }
    } catch (error) {
      log.error(`Failed to broadcast players list after user ${userId} joined:`, error);
    }
  }

  /**
   * Send message to all battle participants
   */
  private sendToBattleParticipants(message: WebSocketMessage): void {
    for (const playerWs of this.connectedPlayers.values()) {
      if (playerWs.readyState === WebSocket.OPEN) {
        playerWs.send(JSON.stringify(message));
      }
    }
  }

  /**
   * Central message router - delegates to specific handlers based on message type
   */
  async handleMessage(message: WebSocketMessage, ws: WebSocket, userId: string): Promise<void> {
    try {
      log.info(`Processing message type: ${message.type} for user: ${userId}`);
      
      if (message.type === 'join') {
        await this.handleJoinMessage(ws, userId, message);
      } else if (message.type === 'end-battle') {
        await this.handleEndBattleMessage(ws, userId, message);
      } else if (message.type === 'start-battle') {
        await this.handleStartBattleMessage(ws, userId, message);
      } else if (message.type === 'test-results') {
        await this.handleTestResultsMessage(message, ws, userId);
      } else {
        log.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      log.error(`Error handling ${message.type} message:`, error);
      throw error;
    }
  }

  /**
   * Handle test results submission from client
   */
  async handleTestResultsMessage(message: WebSocketMessage, ws: WebSocket, userId: string): Promise<void> {
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

      // Update battle participation record in database
      try {
        await BattleParticipationService.updateParticipation(userId, testsPassed);
      } catch (dbError) {
        log.error('Failed to update battle participation:', dbError);
        // Continue with broadcasting even if DB update fails
      }

      // TODO: Need to implement broadcasting player list - requires broadcast service injection

    } catch (error) {
      log.error('Failed to handle test results:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to update test results'
      }));
    }
  }
}
