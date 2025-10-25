import { prisma, dbLog } from '../config/database.js';
import { QuestionsService } from './questions.service.js';
import type { Battle, BattleParticipant } from '@webdevinterviews/shared';

// Additional backend-specific types
interface BattleCreateOptions {
  scheduledStartTime?: string;
  durationMinutes?: number;
}

interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests: number;
  completionTime?: number | null;
  placement?: number;
}

interface UserStats {
  total_battles: number;
  wins: number;
  win_rate: number;
  avg_tests_passed: number;
  total_tests_passed: number;
  best_placement: number;
  recent_battles: number;
}

export class BattleService {
  
  // Helper function to get next Saturday at 5pm EST
  static getNextSaturday5pmEST(): string {
    const now = new Date();
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Find next Saturday
    const daysUntilSaturday = (6 - easternTime.getDay()) % 7; // Saturday is day 6
    const nextSaturday = new Date(easternTime);
    
    if (daysUntilSaturday === 0) {
      // Today is Saturday - check if it's before 5pm
      if (easternTime.getHours() >= 17) {
        // It's Saturday after 5pm, go to next Saturday
        nextSaturday.setDate(nextSaturday.getDate() + 7);
      }
    } else {
      // Add days to get to next Saturday
      nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
    }
    
    // Set time to 5:00 PM
    nextSaturday.setHours(17, 0, 0, 0);
    
    // Convert back to UTC for storage
    return nextSaturday.toISOString();
  }
  // Create a new battle record in waiting state
  static async createBattle(
    roomId: string, 
    adminUserId: string, 
    participants: BattleParticipant[] = [], 
    options: BattleCreateOptions = {}
  ): Promise<Battle> {
    const { scheduledStartTime, durationMinutes = 60 } = options;
    
    
    try {
      const battleData: any = {
        status: 'waiting' as const,
        admin_user_id: adminUserId,
        participants,
        duration_minutes: durationMinutes
      };

      // Add scheduled start time if provided
      if (scheduledStartTime) {
        battleData.scheduled_start_time = new Date(scheduledStartTime);
      }

      const battle = await prisma.battle.create({
        data: battleData,
        include: {
          participations: true,
          questionPools: { include: { question: true } }
        }
      });
      
      // Create question pool for the battle (10 random questions)
      try {
        await QuestionsService.createBattleQuestionPool(battle.id);
        dbLog.info('Question pool created for battle', { battleId: battle.id });
      } catch (questionError) {
        dbLog.error('Failed to create question pool, but battle was created', questionError);
        // Don't fail the battle creation if question pool fails
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

  // Create the current battle (no room ID needed since there's only one)
  static async createCurrentBattle(
    options: BattleCreateOptions = {}
  ): Promise<Battle> {
    // Use default admin user ID if not provided
    const finalAdminUserId = 'c9c22420-5e80-490f-8abf-3396c5949adf';
    
    // Use default scheduled time (next Saturday 5pm EST) if not provided
    const { scheduledStartTime, durationMinutes = 60 } = options;
    const finalScheduledStartTime = scheduledStartTime || BattleService.getNextSaturday5pmEST();
    
    
    try {
      const battleData: any = {
        status: 'waiting' as const,
        admin_user_id: finalAdminUserId,
        duration_minutes: durationMinutes
      };

      // Add scheduled start time if provided
      if (finalScheduledStartTime) {
        battleData.scheduled_start_time = new Date(finalScheduledStartTime);
      }

      const battle = await prisma.battle.create({
        data: battleData,
        include: {
          participations: true,
          questionPools: { include: { question: true } }
        }
      });

      // Create question pool for the battle (10 random questions)
      try {
        await QuestionsService.createBattleQuestionPool(battle.id);
        dbLog.info('Question pool created for current battle', { battleId: battle.id });
      } catch (questionError) {
        dbLog.error('Failed to create question pool, but current battle was created', questionError);
        // Don't fail the battle creation if question pool fails
      }

      dbLog.info('Current battle created successfully', { 
        battleId: battle.id, 
        status: battle.status,
        scheduledStartTime: battle.scheduled_start_time,
        durationMinutes: battle.duration_minutes
      });
      return battle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error creating current battle:', error);
      throw error;
    }
  }

  // Start a battle (change from waiting to active)
  static async startBattle(adminUserId: string): Promise<Battle> {
    dbLog.info('Starting battle', { adminUserId });
    
    try {
      // First get the current battle to check duration
      const battle = await this.getCurrentBattle();
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
          questionPools: { include: { question: true } }
        }
      });

      if (updatedBattle) {
        // Select a random question from the battle's question pool
        try {
          const selectedQuestion = await QuestionsService.selectBattleQuestion(updatedBattle.id);
          dbLog.info('Question selected for battle', { 
            battleId: updatedBattle.id, 
            questionTitle: selectedQuestion.title,
            questionId: selectedQuestion.id
          });
        } catch (questionError) {
          dbLog.error('Failed to select battle question', questionError);
          // Don't fail the battle start if question selection fails
        }

        dbLog.info('Battle started successfully', { 
          battleId: updatedBattle.id, 
          startedAt: updatedBattle.started_at,
          autoEndTime: updatedBattle.auto_end_time,
          durationMinutes: updatedBattle.duration_minutes,
          status: updatedBattle.status 
        });
      } else {
        dbLog.error('No battle data returned - battle may not exist or user not authorized');
      }
      
      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error starting battle:', error);
      throw error;
    }
  }

  // Update battle with results
  static async completeBattle(results: BattleResult[], endedBy: string = 'admin'): Promise<Battle> {
    dbLog.info('Completing battle', { resultsCount: results?.length, endedBy });
    
    try {
      // Get the current battle
      const battle = await this.getCurrentBattle();
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
          results,
          ended_by: endedBy
        },
        include: {
          participations: true,
          questionPools: { include: { question: true } }
        }
      });

      if (updatedBattle) {
        // Create battle participation records for analytics
        try {
          await this.createBattleParticipations(updatedBattle.id, results);
          dbLog.info('Battle participation records created', { battleId: updatedBattle.id });
        } catch (participationError) {
          dbLog.error('Failed to create participation records, but battle was completed', participationError);
          // Don't fail the battle completion if participation creation fails
        }

        dbLog.info('Battle completed successfully', { 
          battleId: updatedBattle.id, 
          completedAt: updatedBattle.completed_at,
          resultsCount: results?.length,
          endedBy: updatedBattle.ended_by
        });
      }

      return updatedBattle as unknown as Battle;
    } catch (error) {
      dbLog.error('Error completing battle:', error);
      throw error;
    }
  }

  // Create battle participation records for analytics
  static async createBattleParticipations(battleId: string, results: BattleResult[]): Promise<void> {
    dbLog.info('Creating battle participation records', { battleId, resultsCount: results.length });
    
    try {
      const participations = results.map(result => ({
        battle_id: battleId,
        user_id: result.userId,
        tests_passed: result.testsPassed,
        total_tests: result.totalTests,
        completion_time: result.completionTime,
        placement: result.placement || null
      }));

      await prisma.battleParticipation.createMany({
        data: participations
      });

      dbLog.info('Battle participation records created successfully');
    } catch (error) {
      dbLog.error('Error creating battle participation records:', error);
      throw error;
    }
  }

  // Get user's battle history
  static async getUserBattleHistory(userId: string, limit: number = 50): Promise<Battle[]> {
    dbLog.info('Fetching user battle history', { userId, limit });
    
    try {
      const battles = await prisma.battle.findMany({
        where: {
          // Note: This assumes participants is stored as JSON and contains userId
          // In a real implementation, you might want to normalize this relationship
        },
        orderBy: { created_at: 'desc' },
        take: limit
      });

      // Filter battles where user is a participant (since JSON filtering is complex)
      const userBattles = battles.filter(battle => {
        const participants = battle.participants as BattleParticipant[] || [];
        return participants.some(p => p.userId === userId);
      });

      dbLog.info('User battle history fetched successfully', { 
        userId, 
        battlesCount: userBattles?.length || 0 
      });

      return (userBattles || []) as unknown as Battle[];
    } catch (error) {
      dbLog.error('Error fetching user battle history:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<UserStats> {
    dbLog.info('Fetching user stats', { userId });
    
    try {
      // Get user's battle participations
      const participations = await prisma.battleParticipation.findMany({
        where: { user_id: userId },
        include: { battle: true }
      });

      if (participations.length === 0) {
        return {
          total_battles: 0,
          wins: 0,
          win_rate: 0,
          avg_tests_passed: 0,
          total_tests_passed: 0,
          best_placement: null,
          recent_battles: 0
        };
      }

      const totalBattles = participations.length;
      const wins = participations.filter(p => p.placement === 1).length;
      const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;
      const totalTestsPassed = participations.reduce((sum, p) => sum + p.tests_passed, 0);
      const avgTestsPassed = totalTestsPassed / totalBattles;
      const bestPlacement = Math.min(...participations.map(p => p.placement || Infinity).filter(p => p !== null));
      
      // Count recent battles (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentBattles = participations.filter(p => 
        p.battle.created_at >= thirtyDaysAgo
      ).length;

      const stats = {
        total_battles: totalBattles,
        wins,
        win_rate: winRate,
        avg_tests_passed: avgTestsPassed,
        total_tests_passed: totalTestsPassed,
        best_placement: bestPlacement === Infinity ? null : bestPlacement,
        recent_battles: recentBattles
      };

      dbLog.info('User stats fetched successfully', { userId, stats });
      return stats as UserStats;
    } catch (error) {
      dbLog.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get active battle for a room
  static async getActiveBattle(roomId: string): Promise<Battle | null> {
    dbLog.debug('Fetching active battle', { roomId });
    
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          status: 'active'
        },
        include: {
          participations: true,
          questionPools: { include: { question: true } }
        }
      });

      return battle as unknown as Battle || null;
    } catch (error) {
      dbLog.error('Error fetching active battle:', error);
      throw error;
    }
  }

  // Get any battle for a room (latest)
  static async getBattle(roomId: string): Promise<Battle | null> {
    dbLog.debug('Fetching battle', { roomId });
    
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          // Note: room_id filtering removed since we only have one battle at a time
        },
        orderBy: { created_at: 'desc' },
        include: {
          participations: true,
          questionPools: { include: { question: true } },
          selectedQuestion: true
        }
      });

      if (!battle) {
        return null;
      }

      const typedBattle = battle as unknown as Battle;

      // Auto-fix: If battle is in waiting status but has no scheduled start time, add one
      // (Only for waiting battles, not completed ones)
      if (typedBattle.status === 'waiting' && !typedBattle.scheduled_start_time) {
        dbLog.info('Found waiting battle without scheduled start time, fixing...', { 
          battleId: typedBattle.id,
          currentStatus: typedBattle.status 
        });

        const scheduledStartTime = new Date(Date.now() + 30 * 1000); // 30 seconds from now
        
        try {
          const updatedBattle = await prisma.battle.update({
            where: { id: typedBattle.id },
            data: { scheduled_start_time: scheduledStartTime },
            include: {
              participations: true,
              questionPools: { include: { question: true } },
              selectedQuestion: true
            }
          });

          dbLog.info('Successfully added scheduled start time to battle', {
            battleId: typedBattle.id,
            scheduledStartTime
          });

          return updatedBattle as unknown as Battle;
        } catch (updateError) {
          dbLog.error('Error updating battle with scheduled start time:', updateError);
          // Return original battle even if update fails
          return typedBattle;
        }
      }

      return typedBattle;
    } catch (error) {
      dbLog.error('Error fetching battle:', error);
      throw error;  
    }
  }

  // Get the current battle (active battle, since there's only one at a time)
  static async getCurrentBattle(): Promise<Battle | null> {
    dbLog.debug('Fetching current battle');
    
    try {
      const battle = await prisma.battle.findFirst({
        where: {
          status: {
            in: ['waiting', 'active']
          }
        },
        orderBy: { created_at: 'desc' },
        include: {
          participations: true,
          questionPools: {
            include: { question: true }
          }
          // selectedQuestion: true
        }
      });

      return battle as unknown as Battle || null;
    } catch (error) {
      dbLog.error('Error fetching current battle:', error);
      throw error;  
    }
  }

  // Check if user is admin for the current battle
  static async isAdminForBattle(userId: string): Promise<boolean> {
    dbLog.debug('Checking admin status for current battle', { userId });
    
    try {
      const battle = await this.getCurrentBattle();
      if (!battle) {
        dbLog.debug('No current battle found');
        return false;
      }

      const isAdmin = battle.admin_user_id === userId;
      dbLog.debug('Admin status checked', { userId, isAdmin });
      return isAdmin;
    } catch (error) {
      dbLog.error('Error checking admin status:', error);
      throw error;
    }
  }

  // Update battle participant data
  static async updateBattleParticipant(
    userId: string, 
    testsPassed: number, 
    totalTests: number
  ): Promise<void> {
    dbLog.debug('Updating battle participant', { userId, testsPassed, totalTests });
    
    try {
      // Get the current battle
      const battle = await this.getCurrentBattle();
      if (!battle) {
        throw new Error('No current battle found');
      }

      if (battle.status !== 'active') {
        throw new Error('Battle is not active');
      }

      // Update participant data
      const participants = battle.participants || [];
      const participantIndex = participants.findIndex((p: BattleParticipant) => p.userId === userId);
      
      if (participantIndex >= 0) {
        participants[participantIndex] = {
          ...participants[participantIndex],
          testsPassed,
          totalTests
        };
      } else {
        // Add new participant if not found
        participants.push({
          userId,
          joinedAt: new Date().toISOString(),
          testsPassed,
          totalTests
        });
      }

      await prisma.battle.update({
        where: { id: battle.id },
        data: { participants }
      });

    } catch (error) {
      dbLog.error('Error updating battle participant:', error);
      throw error;
    }
  }

  // Add participant to battle
  static async addParticipantToBattle(userId: string): Promise<void> {
    dbLog.debug('Adding participant to battle', { userId });
    
    try {
      // Get the current battle
      const battle = await this.getCurrentBattle();
      if (!battle) {
        throw new Error('No current battle found');
      }

      // Check if participant already exists
      const participants = battle.participants || [];
      const existingParticipant = participants.find((p: BattleParticipant) => p.userId === userId);
      
      if (existingParticipant) {
        dbLog.debug('Participant already exists in battle', { battleId: battle.id, userId });
        return;
      }

      // Add new participant
      participants.push({
        userId,
        joinedAt: new Date().toISOString(),
        testsPassed: 0,
        totalTests: 0
      });

      await prisma.battle.update({
        where: { id: battle.id },
        data: { participants }
      });

    } catch (error) {
      dbLog.error('Error adding participant to battle:', error);
      throw error;
    }
  }

  // Get battle scheduled to auto-start (returns single battle or null since only one battle at a time)
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

    // Get battle that should auto-end (returns single battle or null since only one battle at a time)
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
  }  // Auto-start a scheduled battle
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

  // Auto-end an expired battle
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
          results: finalResults,
          ended_by: 'timeout'
        }
      });

      if (updatedBattle && finalResults.length > 0) {
        // Create battle participation records for analytics
        try {
          await this.createBattleParticipations(updatedBattle.id, finalResults);
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

  // Update battle timing (scheduled start and duration)
  static async updateBattleTiming(
    battleId: string, 
    scheduledStartTime?: string, 
    durationMinutes?: number
  ): Promise<Battle> {
    dbLog.info('Updating battle timing', { battleId, scheduledStartTime, durationMinutes });
    
    try {
      const updates: any = {};
      
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

  // Get current question for a battle
  static async getCurrentBattleQuestion(battleId: string): Promise<unknown> {
    dbLog.debug('Fetching current battle question', { battleId });
    
    try {
      return await QuestionsService.getCurrentBattleQuestion(battleId);
    } catch (error) {
      dbLog.error('Error fetching current battle question:', error);
      throw error;
    }
  }

  // Get question pool for a battle
  static async getBattleQuestionPool(battleId: string): Promise<unknown[]> {
    dbLog.debug('Fetching battle question pool', { battleId });
    
    try {
      return await QuestionsService.getBattleQuestionPool(battleId);
    } catch (error) {
      dbLog.error('Error fetching battle question pool:', error);
      throw error;
    }
  }

  // Get a specific question by ID
  static async getQuestionById(questionId: string): Promise<unknown> {
    dbLog.debug('Fetching question by ID', { questionId });
    
    try {
      return await QuestionsService.getQuestionById(questionId);
    } catch (error) {
      dbLog.error('Error fetching question by ID:', error);
      throw error;
    }
  }
}