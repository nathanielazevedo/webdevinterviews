import { prisma, dbLog } from '../config/database.js';
import { QuestionsService } from './questions.service.js';
import { BattleQueryService } from './battle-query.service.js';
import { BattleParticipationService } from './battle-participation.service.js';
import type { Battle, BattleResult } from '@webdevinterviews/shared';
import type { BattleCreateOptions } from '../types/battle.service.types.js';
import { 
  BATTLE_CONFIG, 
  DEFAULT_ADMIN_USER_ID, 
  TIME_CONSTANTS 
} from '../utils/constants.js';

export class BattleCoreService {
  
  /**
   * Helper function to get next Saturday at 5pm EST
   * @deprecated No longer used for on-demand battles, but kept for special scheduled events
   */
  static getNextSaturday5pmEST(): string {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Find next Saturday
    const daysUntilSaturday = (TIME_CONSTANTS.SATURDAY_DAY_INDEX - easternTime.getDay()) % TIME_CONSTANTS.DAYS_IN_WEEK;
    const nextSaturday = new Date(easternTime);
    
    if (daysUntilSaturday === 0) {
      // Today is Saturday - check if it's before 5pm
      if (easternTime.getHours() >= TIME_CONSTANTS.BATTLE_START_HOUR) {
        // It's Saturday after 5pm, go to next Saturday
        nextSaturday.setDate(nextSaturday.getDate() + TIME_CONSTANTS.DAYS_IN_WEEK);
      }
    } else {
      // Add days to get to next Saturday
      nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
    }
    
    // Set time to 5:00 PM
    nextSaturday.setHours(TIME_CONSTANTS.BATTLE_START_HOUR, 0, 0, 0);
    
    // Convert back to UTC for storage
    return nextSaturday.toISOString();
  }

  /**
   * Create a new battle record in waiting state
   */
  static async createBattle(
    roomId: string, 
    adminUserId: string, 
    options: BattleCreateOptions = {}
  ): Promise<Battle> {
    const { scheduledStartTime, durationMinutes = BATTLE_CONFIG.DEFAULT_DURATION_MINUTES } = options;
    
    try {
      const battleData = {
        status: 'waiting' as const,
        admin_user_id: adminUserId,
        duration_minutes: durationMinutes,
        ...(scheduledStartTime && { scheduled_start_time: new Date(scheduledStartTime) })
      };

      const battle = await prisma.battle.create({
        data: battleData,
        include: {
          participations: true,
          questionPool: { include: { question: true } }
        }
      });
      
      // Create question pool for the battle
      try {
        await QuestionsService.createBattleQuestionPool(battle.id);
        dbLog.info('Question pool created for battle', { battleId: battle.id });
      } catch (questionError) {
        dbLog.error('Failed to create question pool, but battle was created', questionError);
      }

      dbLog.info('Battle created successfully', { 
        battleId: battle.id, 
        status: battle.status,
        scheduledStartTime: battle.scheduled_start_time,
        durationMinutes: battle.duration_minutes
      });
      
      return battle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error creating battle:', error);
      throw error;
    }
  }

  /**
   * Create the current battle (no room ID needed since there's only one)
   * For on-demand battles: auto_start_time is set when first player joins
   */
  static async createCurrentBattle(
    options: BattleCreateOptions = {}
  ): Promise<Battle> {
    const finalAdminUserId = DEFAULT_ADMIN_USER_ID;
    const { durationMinutes = BATTLE_CONFIG.DEFAULT_DURATION_MINUTES } = options;
    
    try {
      const battleData = {
        status: 'waiting' as const,
        admin_user_id: finalAdminUserId,
        duration_minutes: durationMinutes
        // No scheduled_start_time or auto_start_time yet - set when first player joins
      };

      const battle = await prisma.battle.create({
        data: battleData,
        include: {
          participations: true,
          questionPool: { include: { question: true } }
        }
      });

      // Create question pool for the battle
      try {
        await QuestionsService.createBattleQuestionPool(battle.id);
        dbLog.info('Question pool created for current battle', { battleId: battle.id });
        
        // Select question immediately for on-demand battles (so players can see it during countdown)
        const selectedQuestion = await QuestionsService.selectBattleQuestion(battle.id);
        dbLog.info('Question selected for waiting battle', { 
          battleId: battle.id, 
          questionTitle: selectedQuestion.title,
          questionId: selectedQuestion.id
        });
      } catch (questionError) {
        dbLog.error('Failed to create question pool or select question, but current battle was created', questionError);
      }

      // Fetch the updated battle with the selected question
      const battleWithQuestion = await prisma.battle.findUnique({
        where: { id: battle.id },
        include: {
          participations: true,
          questionPool: { include: { question: true } },
          selectedQuestion: true
        }
      });

      dbLog.info('Current battle created successfully (on-demand mode)', { 
        battleId: battle.id, 
        status: battle.status,
        durationMinutes: battle.duration_minutes,
        selectedQuestionId: battleWithQuestion?.selected_question_id
      });
      
      return (battleWithQuestion || battle) as unknown as Battle;
    } catch (error) {
      dbLog.error('Error creating current battle:', error);
      throw error;
    }
  }

  /**
   * Set auto-start time for a battle (called when first player joins)
   * Battle will auto-start 1 minute after this is set
   */
  static async setAutoStartTime(battleId: string, delayMinutes: number = 1): Promise<Battle> {
    dbLog.info('Setting auto-start time for battle', { battleId, delayMinutes });
    
    try {
      const autoStartTime = new Date(Date.now() + delayMinutes * 60 * 1000);
      
      const updatedBattle = await prisma.battle.update({
        where: { 
          id: battleId,
          status: 'waiting',
          auto_start_time: null // Only set if not already set
        },
        data: {
          auto_start_time: autoStartTime
        },
        include: {
          participations: true,
          questionPool: { include: { question: true } }
        }
      });

      dbLog.info('Auto-start time set successfully', { 
        battleId: updatedBattle.id,
        autoStartTime: updatedBattle.auto_start_time
      });

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error setting auto-start time:', error);
      throw error;
    }
  }

  /**
   * Start a battle (change from waiting to active)
   */
  static async startBattle(adminUserId: string): Promise<Battle> {
    dbLog.info('Starting battle', { adminUserId });
    
    try {
      // First get the current battle to check duration
      const battle = await BattleQueryService.getCurrentBattle();
      if (!battle) {
        throw new Error('No current battle found');
      }

      if (battle.status !== 'waiting') {
        throw new Error(`Battle is not in waiting state (current: ${battle.status})`);
      }

      if (battle.admin_user_id !== adminUserId) {
        throw new Error('User not authorized to start battle');
      }

      const startTime = new Date();
      const autoEndTime = new Date(startTime.getTime() + ((battle.duration_minutes || 60) * 60 * 1000));

      const updatedBattle = await prisma.battle.update({
        where: { id: battle.id },
        data: {
          status: 'active',
          started_at: startTime,
          auto_end_time: autoEndTime
        },
        include: {
          participations: true,
          questionPool: { include: { question: true } }
        }
      });

      if (updatedBattle) {
        // Select a random question from the battle's question pool (only if not already selected)
        if (!battle.selected_question_id) {
          try {
            const selectedQuestion = await QuestionsService.selectBattleQuestion(updatedBattle.id);
            dbLog.info('Question selected for battle', { 
              battleId: updatedBattle.id, 
              questionTitle: selectedQuestion.title,
              questionId: selectedQuestion.id
            });
          } catch (questionError) {
            dbLog.error('Failed to select battle question', questionError);
          }
        } else {
          dbLog.info('Question already selected for battle, skipping selection', { 
            battleId: updatedBattle.id,
            selectedQuestionId: battle.selected_question_id
          });
        }

        dbLog.info('Battle started successfully', { 
          battleId: updatedBattle.id, 
          startedAt: updatedBattle.started_at,
          autoEndTime: updatedBattle.auto_end_time,
          durationMinutes: updatedBattle.duration_minutes,
          status: updatedBattle.status 
        });
      }
      
      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error starting battle:', error);
      throw error;
    }
  }

  /**
   * Complete a battle with results
   */
  static async completeBattle(results: BattleResult[], endedBy: string = 'admin'): Promise<Battle> {
    dbLog.info('Completing battle', { resultsCount: results?.length, endedBy });
    
    try {
      // Get the current battle
      const battle = await BattleQueryService.getCurrentBattle();
      if (!battle) {
        throw new Error('No current battle found');
      }

      if (battle.status !== 'active') {
        throw new Error(`Battle is not active (current: ${battle.status})`);
      }

      const updatedBattle = await prisma.battle.update({
        where: { id: battle.id },
        data: {
          status: 'completed',
          completed_at: new Date(),
          ended_by: endedBy
        },
        include: {
          participations: true,
          questionPool: { include: { question: true } }
        }
      });

      if (updatedBattle && results?.length > 0) {
        // Create battle participation records for analytics
        try {
          await BattleParticipationService.createBattleParticipations(updatedBattle.id, results);
          dbLog.info('Battle participation records created', { battleId: updatedBattle.id });
        } catch (participationError) {
          dbLog.error('Failed to create participation records, but battle was completed', participationError);
        }
      }

      dbLog.info('Battle completed successfully', { 
        battleId: updatedBattle.id, 
        completedAt: updatedBattle.completed_at,
        resultsCount: results?.length,
        endedBy: updatedBattle.ended_by
      });

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error completing battle:', error);
      throw error;
    }
  }
}
