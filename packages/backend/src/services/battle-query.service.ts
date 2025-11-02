import { prisma, dbLog } from '../config/database.js';
import type { Battle } from '@webdevinterviews/shared';

export class BattleQueryService {
  
  /**
   * Get the current battle (active or waiting battle, since there's only one at a time)
   */
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
        }
      });

      return battle as unknown as Battle || null;
    } catch (error) {
      dbLog.error('Error fetching current battle:', error);
      throw error;  
    }
  }

  /**
   * Get active battle for a room
   */
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

  /**
   * Get any battle for a room (latest)
   */
  static async getBattle(roomId: string): Promise<Battle | null> {
    dbLog.debug('Fetching battle', { roomId });
    
    try {
      const battle = await prisma.battle.findFirst({
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
          return typedBattle;
        }
      }

      return typedBattle;
    } catch (error) {
      dbLog.error('Error fetching battle:', error);
      throw error;  
    }
  }

  /**
   * Check if user is admin for the current battle
   */
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

  /**
   * Get all completed battles with their participants
   */
  static async getCompletedBattles(limit: number = 50): Promise<unknown[]> {
    dbLog.debug('Fetching completed battles', { limit });

    try {
      const battles = await prisma.battle.findMany({
        where: {
          status: 'completed'
        },
        include: {
          participations: {
            orderBy: [
              { placement: 'asc' },
              { completion_time: 'asc' },
              { tests_passed: 'desc' }
            ]
          }
        },
        orderBy: { completed_at: 'desc' },
        take: limit
      });

      dbLog.debug(`Found ${battles.length} completed battles`);
      return battles;
    } catch (error) {
      dbLog.error('Error fetching completed battles:', error);
      throw error;
    }
  }
}