import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { logger } from '../utils/logger.js';
import type { WebSocketMessage, PlayerData, BattleResult } from '@webdevinterviews/shared';

const log = logger;

export class WebSocketMessageHandler {
  
  constructor(
    private connectedPlayers: Map<string, WebSocket>,
    private playerData: Map<string, PlayerData>
  ) {}

  /**
   * Handle join message from client
   */
  async handleJoinMessage(
    ws: WebSocket,
    battleId: string,
    userId: string,
    _displayName: string,
    _message: WebSocketMessage
  ): Promise<void> {
    try {

      // Initialize player data if not exists
      if (!this.playerData.has(userId)) {
        this.playerData.set(userId, {
          testsPassed: 0,
          joinedAt: new Date().toISOString()
        });
      }

      // Add participant to current battle
      try {
        await BattleParticipationService.addParticipant(userId);
      } catch {
        // Participant might already exist, continue
      }

      // Get current battle info
      try {
        const battle = await BattleService.getCurrentBattle();
        if (!battle) {
          return;
        }

        // Battle info will be sent via the broadcast message

        // Broadcast battle status to all participants
        this.sendToBattleParticipants({
          type: 'battle-status'
        } as WebSocketMessage);

      } catch (error) {
        log.error(`Error getting battle info for user ${userId}:`, error);
      }

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'join-response',
          success: true
        }));
      }

    } catch (error) {
      log.error(`Error handling join message for user ${userId}:`, error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'join-response',
          success: false,
          error: 'Failed to join battle'
        }));
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
      log.error(`Error starting battle for user ${userId}:`, error);
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
      const results: BattleResult[] = [];
      let placement = 1;
      
      for (const [playerId, playerData] of this.playerData.entries()) {
        if (this.connectedPlayers.has(playerId)) {
          results.push({
            userId: playerId,
            testsPassed: playerData.testsPassed || 0,
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
      log.error(`Error ending battle for user ${userId}:`, error);
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
}
