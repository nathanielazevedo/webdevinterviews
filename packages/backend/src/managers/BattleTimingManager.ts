import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import { BattleResult, PlayerData } from '../types/websocket.js';
import type { Battle } from '@webdevinterviews/shared';

const log = logger;

export class BattleTimingManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private connectedPlayers: Map<string, WebSocket>;
  private playerData: Map<string, PlayerData>;
  private broadcastBattleStatus: (event?: string) => Promise<void>;

  constructor(
    connectedPlayers: Map<string, WebSocket>,
    playerData: Map<string, PlayerData>,
    broadcastBattleStatus: (event?: string) => Promise<void>
  ) {
    this.connectedPlayers = connectedPlayers;
    this.playerData = playerData;
    this.broadcastBattleStatus = broadcastBattleStatus;
  }

  start(): void {
    // Check every 30 seconds for battles to auto-start/end
    this.checkInterval = setInterval(async () => {
      await this.checkScheduledBattles();
      await this.checkExpiredBattles();
    }, 30000);
    
    log.info('Battle timing manager started');
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      log.info('Battle timing manager stopped');
    }
  }

  private async checkScheduledBattles(): Promise<void> {
    try {
      const battlesToStart = await BattleService.getBattlesToAutoStart();
      
      for (const battle of battlesToStart) {
        log.info(`Auto-starting scheduled battle`, { 
          battleId: battle.id, 
          roomId: battle.room_id,
          scheduledTime: battle.scheduled_start_time
        });

        const startedBattle = await BattleService.autoStartBattle(battle.id);
        
        if (startedBattle) {
          // Broadcast battle started to all users
          await this.broadcastBattleStarted(startedBattle);
          // Update battle status for watchers
          await this.broadcastBattleStatus('battle-started');
        }
      }
    } catch (error) {
      log.error('Error checking scheduled battles:', error);
    }
  }

  private async checkExpiredBattles(): Promise<void> {
    try {
      const battlesToEnd = await BattleService.getBattlesToAutoEnd();
      
      for (const battle of battlesToEnd) {
        log.info(`Auto-ending expired battle`, { 
          battleId: battle.id, 
          roomId: battle.room_id,
          autoEndTime: battle.auto_end_time
        });

        // Collect final results from active players
        const finalResults = this.collectFinalResults();
        const endedBattle = await BattleService.autoEndBattle(battle.id, finalResults);
        
        if (endedBattle) {
          // Broadcast battle ended to all users
          await this.broadcastBattleEnded(endedBattle, finalResults);
          // Update battle status for watchers
          await this.broadcastBattleStatus('battle-completed');
        }
      }
    } catch (error) {
      log.error('Error checking expired battles:', error);
    }
  }

  private collectFinalResults(): BattleResult[] {
    const results: BattleResult[] = [];
    this.connectedPlayers.forEach((ws, userId) => {
      const data = this.playerData.get(userId);
      if (data) {
        results.push({
          userId,
          testsPassed: data.testsPassed,
          totalTests: data.totalTests,
          completionTime: null // No completion time for auto-ended battles
        });
      }
    });

    // Sort by tests passed (descending) for placement
    results.sort((a, b) => b.testsPassed - a.testsPassed);
    
    return results;
  }

  private async broadcastBattleStarted(battle: Battle): Promise<void> {
    const message = {
      type: 'battle-started',
      battleId: battle.id,
      startedAt: battle.started_at,
      autoEndTime: battle.auto_end_time,
      durationMinutes: battle.duration_minutes,
      startedBy: 'scheduled'
    };
    
    this.connectedPlayers.forEach((ws, _userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
    
    log.info(`Auto-start notification sent to ${this.connectedPlayers.size} connected users`);
  }

  private async broadcastBattleEnded(battle: Battle, results: BattleResult[]): Promise<void> {
    const message = {
      type: 'battle-completed',
      battleId: battle.id,
      completedAt: battle.completed_at,
      endedBy: 'timeout',
      results: results.map((result, index) => ({
        ...result,
        placement: index + 1
      }))
    };
    
    this.connectedPlayers.forEach((ws, _userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
    
    log.info(`Auto-end notification sent to ${this.connectedPlayers.size} connected users`);
  }
}