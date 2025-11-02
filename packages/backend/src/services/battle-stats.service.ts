import { prisma, dbLog } from '../config/database.js';
import type { Battle } from '@webdevinterviews/shared';
import type { UserStats } from '../types/battle.service.types.js';
import { TIME_CONSTANTS } from '../utils/constants.js';

export class BattleStatsService {
  
  /**
   * Get user's battle history
   */
  static async getUserBattleHistory(userId: string, limit: number = 50): Promise<Battle[]> {
    dbLog.info('Fetching user battle history', { userId, limit });
    
    try {
      // Get battles where user participated using the BattleParticipation table
      const userBattles = await prisma.battle.findMany({
        where: {
          participations: {
            some: {
              user_id: userId
            }
          }
        },
        orderBy: { created_at: 'desc' },
        take: limit
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

  /**
   * Get user statistics
   */
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
          best_placement: undefined,
          recent_battles: 0
        };
      }

      const totalBattles = participations.length;
      const wins = participations.filter(p => p.placement === 1).length;
      const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;
      const totalTestsPassed = participations.reduce((sum, p) => sum + p.tests_passed, 0);
      const avgTestsPassed = totalTestsPassed / totalBattles;
      const validPlacements = participations.map(p => p.placement).filter(p => p !== null) as number[];
      const bestPlacement = validPlacements.length > 0 ? Math.min(...validPlacements) : undefined;
      
      // Count recent battles (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - TIME_CONSTANTS.RECENT_BATTLES_DAYS);
      const recentBattles = participations.filter(p => 
        p.battle.created_at >= thirtyDaysAgo
      ).length;

      const stats = {
        total_battles: totalBattles,
        wins,
        win_rate: winRate,
        avg_tests_passed: avgTestsPassed,
        total_tests_passed: totalTestsPassed,
        best_placement: bestPlacement,
        recent_battles: recentBattles
      };

      dbLog.info('User stats fetched successfully', { userId, stats });
      return stats as UserStats;
    } catch (error) {
      dbLog.error('Error fetching user stats:', error);
      throw error;
    }
  }
}
