import { prisma, dbLog } from '../config/database.js';
import { QuestionsService } from './questions.service.js';
import type { Battle, BattleResult } from '@webdevinterviews/shared';

export class BattleSchedulingService {
  
  /**
   * Get battle scheduled to auto-start (returns single battle or null since only one battle at a time)
   */
  static async getBattleToAutoStart(): Promise<Battle | null> {
    dbLog.debug('Fetching battle to auto-start');
    
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          status: 'waiting',
          scheduled_start_time: { 
            not: null,
            lte: new Date()
          }
        },
        orderBy: { scheduled_start_time: 'asc' }
      });

      if (!battle) {
        dbLog.debug('No battle to auto-start');
        return null;
      }

      dbLog.debug('Battle to auto-start fetched', { battleId: battle.id });
      return battle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error fetching battle to auto-start:', error);
      throw error;
    }
  }

  /**
   * Get battle that should auto-end (returns single battle or null since only one battle at a time)
   */
  static async getBattleToAutoEnd(): Promise<Battle | null> {
    dbLog.debug('Fetching battle to auto-end');
    
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          status: 'active',
          auto_end_time: { 
            not: null,
            lte: new Date()
          }
        },
        orderBy: { auto_end_time: 'asc' }
      });

      if (!battle) {
        dbLog.debug('No battle to auto-end');
        return null;
      }

      dbLog.debug('Battle to auto-end fetched', { battleId: battle.id });
      return battle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error fetching battle to auto-end:', error);
      throw error;
    }
  }

  /**
   * Auto-start a scheduled battle
   */
  static async autoStartBattle(battleId: string): Promise<Battle> {
    dbLog.info('Auto-starting scheduled battle', { battleId });
    
    try {
      // First get the battle to check duration
      const battle = await prisma.battle.findUnique({
        where: { 
          id: battleId,
          status: 'waiting'
        }
      });

      if (!battle) {
        dbLog.error('Scheduled battle not found');
        throw new Error('Scheduled battle not found');
      }

      const startTime = new Date();
      const autoEndTime = new Date(startTime.getTime() + ((battle.duration_minutes || 60) * 60 * 1000));

      const updatedBattle = await prisma.battle.update({
        where: { id: battleId },
        data: {
          status: 'active',
          started_at: startTime,
          auto_end_time: autoEndTime
        }
      });

      if (updatedBattle) {
        // Select a random question from the battle's question pool
        try {
          const selectedQuestion = await QuestionsService.selectBattleQuestion(updatedBattle.id);
          dbLog.info('Question selected for auto-started battle', { 
            battleId: updatedBattle.id, 
            questionTitle: selectedQuestion.title,
            questionId: selectedQuestion.id
          });
        } catch (questionError) {
          dbLog.error('Failed to select battle question for auto-start', questionError);
        }

        dbLog.info('Battle auto-started successfully', { 
          battleId: updatedBattle.id, 
          startedAt: updatedBattle.started_at,
          autoEndTime: updatedBattle.auto_end_time,
          scheduledStartTime: battle.scheduled_start_time
        });
      }

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error auto-starting battle:', error);
      throw error;
    }
  }

  /**
   * Auto-end an expired battle
   */
  static async autoEndBattle(battleId: string, finalResults: BattleResult[] = []): Promise<Battle> {
    dbLog.info('Auto-ending expired battle', { battleId, resultsCount: finalResults.length });
    
    try {
      const updatedBattle = await prisma.battle.update({
        where: { 
          id: battleId,
          status: 'active'
        },
        data: {
          status: 'completed',
          completed_at: new Date(),
          ended_by: 'timeout'
        }
      });

      if (updatedBattle && finalResults.length > 0) {
        // Create battle participation records for analytics
        try {
          const { BattleParticipationService } = await import('./battle-participation.service.js');
          await BattleParticipationService.createBattleParticipations(updatedBattle.id, finalResults);
          dbLog.info('Battle participation records created for auto-ended battle', { battleId: updatedBattle.id });
        } catch (participationError) {
          dbLog.error('Failed to create participation records for auto-ended battle', participationError);
        }
      }

      dbLog.info('Battle auto-ended successfully', { 
        battleId: updatedBattle.id, 
        completedAt: updatedBattle.completed_at,
        resultsCount: finalResults.length
      });

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error auto-ending battle:', error);
      throw error;
    }
  }

  /**
   * Update battle timing (scheduled start and duration)
   */
  static async updateBattleTiming(
    battleId: string, 
    scheduledStartTime?: string, 
    durationMinutes?: number
  ): Promise<Battle> {
    dbLog.info('Updating battle timing', { battleId, scheduledStartTime, durationMinutes });
    
    try {
      const updates: { scheduled_start_time?: string; duration_minutes?: number } = {};
      
      if (scheduledStartTime !== undefined) {
        updates.scheduled_start_time = scheduledStartTime;
      }
      
      if (durationMinutes !== undefined) {
        updates.duration_minutes = durationMinutes;
      }

      if (Object.keys(updates).length === 0) {
        throw new Error('No timing updates provided');
      }

      const updatedBattle = await prisma.battle.update({
        where: { 
          id: battleId,
          status: 'waiting'
        },
        data: updates
      });

      dbLog.info('Battle timing updated successfully', { 
        battleId: updatedBattle.id,
        scheduledStartTime: updatedBattle.scheduled_start_time,
        durationMinutes: updatedBattle.duration_minutes
      });

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error updating battle timing:', error);
      throw error;
    }
  }
}
