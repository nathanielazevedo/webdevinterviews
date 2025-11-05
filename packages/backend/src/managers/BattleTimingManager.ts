import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import type { BattleResult } from '@webdevinterviews/shared';
import type { Battle } from '@webdevinterviews/shared';

const log = logger;

export class BattleTimingManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private countdownInterval: NodeJS.Timeout | null = null;
  private playerUpdateInterval: NodeJS.Timeout | null = null;
  private connectedPlayers: Map<string, WebSocket>;
  private broadcastBattleStatus: (event?: string) => Promise<void>;
  private broadcastPlayerList: () => Promise<void>;

  constructor(
    connectedPlayers: Map<string, WebSocket>,
    broadcastBattleStatus: (event?: string) => Promise<void>,
    broadcastPlayerList: () => Promise<void>
  ) {
    this.connectedPlayers = connectedPlayers;
    this.broadcastBattleStatus = broadcastBattleStatus;
    this.broadcastPlayerList = broadcastPlayerList;
  }

  start(): void {
    // Check every 5 seconds for battles to auto-start/end (more frequent for on-demand battles)
    this.checkInterval = setInterval(async () => {
      await this.checkScheduledBattles();
      await this.checkExpiredBattles();
    }, 5000);
    
    // Broadcast countdown every 10 seconds for waiting battles
    this.countdownInterval = setInterval(async () => {
      await this.broadcastWaitingBattleCountdown();
    }, 10000);
    
    // Broadcast player updates every 3 seconds during active battles (for bot progress)
    this.playerUpdateInterval = setInterval(async () => {
      await this.broadcastActiveBattlePlayerUpdates();
    }, 3000);
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.playerUpdateInterval) {
      clearInterval(this.playerUpdateInterval);
      this.playerUpdateInterval = null;
    }
  }

  private async checkScheduledBattles(): Promise<void> {
    try {
      const battleToStart = await BattleService.getBattleToAutoStart();
      
      if (battleToStart) {
        const startedBattle = await BattleService.autoStartBattle(battleToStart.id);
        
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
      const battleToEnd = await BattleService.getBattleToAutoEnd();
      
      if (battleToEnd) {
        // Collect final results from active players
        const finalResults = await this.collectFinalResults();
        const endedBattle = await BattleService.autoEndBattle(battleToEnd.id, finalResults);
        
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

  private async collectFinalResults(): Promise<BattleResult[]> {
    const results: BattleResult[] = [];
    
    try {
      // Get current battle and participants from database
      const currentBattle = await BattleService.getCurrentBattle();
      if (!currentBattle) {
        return results;
      }

      // Import BattleParticipationService
      const { BattleParticipationService } = await import('../services/battle-participation.service.js');
      const participationData = await BattleParticipationService.getBattleParticipants(currentBattle.id) as Array<{ user_id: string; tests_passed: number }>;
      
      // Build results from connected participants
      for (const participant of participationData) {
        if (this.connectedPlayers.has(participant.user_id)) {
          results.push({
            userId: participant.user_id,
            testsPassed: participant.tests_passed,
            completionTime: null // No completion time for auto-ended battles
          });
        }
      }
    } catch (error) {
      log.error('Error collecting final results:', error);
    }

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
    
  }

  private async broadcastWaitingBattleCountdown(): Promise<void> {
    try {
      const currentBattle = await BattleService.getCurrentBattle();
      
      if (!currentBattle || currentBattle.status !== 'waiting' || !currentBattle.auto_start_time) {
        return; // No waiting battle with countdown
      }

      const timeUntilStart = new Date(currentBattle.auto_start_time).getTime() - Date.now();
      
      // Stop broadcasting if time is up (will be handled by auto-start)
      if (timeUntilStart <= 0) {
        return;
      }

      const message = {
        type: 'battle-countdown',
        battleId: currentBattle.id,
        autoStartTime: currentBattle.auto_start_time,
        secondsUntilStart: Math.ceil(timeUntilStart / 1000),
        status: currentBattle.status
      };

      this.connectedPlayers.forEach((ws, _userId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });

      log.info(`Broadcast countdown: ${Math.ceil(timeUntilStart / 1000)}s until battle starts`);
    } catch (error) {
      log.error('Error broadcasting waiting battle countdown:', error);
    }
  }

  /**
   * Broadcast player list updates during active battles (for bot progress and real player updates)
   */
  private async broadcastActiveBattlePlayerUpdates(): Promise<void> {
    try {
      const currentBattle = await BattleService.getCurrentBattle();
      
      // Only broadcast during active battles
      if (!currentBattle || currentBattle.status !== 'active') {
        return;
      }

      // Broadcast player list with updated test progress
      await this.broadcastPlayerList();
      
    } catch (error) {
      log.error('Error broadcasting active battle player updates:', error);
    }
  }
}
