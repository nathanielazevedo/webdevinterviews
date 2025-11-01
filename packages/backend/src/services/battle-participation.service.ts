// @ts-nocheck ignore file

import { prisma, dbLog } from '../config/database.js';
import { BattleService } from './battle.service.js';

export class BattleParticipationService {

  // Update or create battle participation record
  static async updateParticipation(
    userId: string,
    testsPassed: number
  ): Promise<void> {
    dbLog.debug('Updating battle participation', { userId, testsPassed });

    try {
      // Get current battle
      const battle = await BattleService.getCurrentBattle();
      if (!battle || battle.status !== 'active') {
        dbLog.debug('No active battle found, skipping participation update');
        return;
      }

      // Get the current question to determine total tests
      let totalTests = 0;
      try {
        const currentQuestion = await BattleService.getCurrentBattleQuestion(battle.id);
        if (currentQuestion && (currentQuestion as { test_cases?: unknown[] }).test_cases) {
          totalTests = (currentQuestion as { test_cases: unknown[] }).test_cases.length;
        }
      } catch (error) {
        dbLog.warn('Could not fetch current question test count:', error);
      }

      const now = new Date();
      let placement: number | null = null;

      // If user passed all tests, calculate placement
      if (testsPassed === totalTests && totalTests > 0) {
        const completionTime = now.getTime() - (battle.started_at ? new Date(battle.started_at).getTime() : now.getTime());

        // Find placement by counting users who completed before this user
        const completedUsers = await prisma.battleParticipation.findMany({
          where: {
            battle_id: battle.id,
            completion_time: { not: null }
          },
          orderBy: { completion_time: 'asc' }
        });

        // Count users who completed faster
        let fasterCount = 0;
        for (const participant of completedUsers) {
          if (participant.completion_time! < completionTime) {
            fasterCount++;
          } else if (participant.completion_time! === completionTime && participant.user_id !== userId) {
            // Same completion time, but different user - this user comes after
            fasterCount++;
          }
        }

        placement = fasterCount + 1;
        dbLog.info(`User ${userId} completed all tests, placement: ${placement}`, {
          completionTime,
          totalTests,
          fasterCount
        });
      }

      // Upsert battle participation record
      await prisma.battleParticipation.upsert({
        where: {
          battle_id_user_id: {
            battle_id: battle.id,
            user_id: userId
          }
        },
        update: {
          tests_passed: testsPassed,
          total_tests: totalTests,
          completion_time: placement ? now.getTime() - (battle.started_at ? new Date(battle.started_at).getTime() : now.getTime()) : null,
          placement,
          is_connected: true
        },
        create: {
          battle_id: battle.id,
          user_id: userId,
          tests_passed: testsPassed,
          total_tests: totalTests,
          completion_time: placement ? now.getTime() - (battle.started_at ? new Date(battle.started_at).getTime() : now.getTime()) : null,
          placement,
          joined_at: now,
          is_connected: true
        }
      });

      dbLog.info(`Updated battle participation for user ${userId}`, {
        battleId: battle.id,
        testsPassed,
        totalTests,
        placement
      });

    } catch (error) {
      dbLog.error(`Error updating battle participation for user ${userId}:`, error);
      throw error;
    }
  }

  // Get battle participants for a specific battle
  static async getBattleParticipants(battleId: string): Promise<unknown[]> {
    dbLog.debug('Getting battle participants', { battleId });

    try {
      const participants = await prisma.battleParticipation.findMany({
        where: { battle_id: battleId },
        orderBy: [
          { placement: 'asc' },
          { completion_time: 'asc' },
          { tests_passed: 'desc' }
        ]
      });

      dbLog.debug(`Found ${participants.length} participants for battle ${battleId}`);
      return participants;
    } catch (error) {
      dbLog.error('Error fetching battle participants:', error);
      throw error;
    }
  }

  // Get user's participation history
  static async getUserParticipationHistory(userId: string, limit: number = 50): Promise<unknown[]> {
    dbLog.debug('Getting user participation history', { userId, limit });

    try {
      const participations = await prisma.battleParticipation.findMany({
        where: { user_id: userId },
        include: {
          battle: {
            select: {
              id: true,
              status: true,
              started_at: true,
              completed_at: true
            }
          }
        },
        orderBy: { joined_at: 'desc' },
        take: limit
      });

      dbLog.debug(`Found ${participations.length} participation records for user ${userId}`);
      return participations;
    } catch (error) {
      dbLog.error('Error fetching user participation history:', error);
      throw error;
    }
  }

  // Update connection status for a participant
  static async updateConnectionStatus(userId: string, battleId: string, isConnected: boolean): Promise<void> {
    dbLog.debug('Updating connection status', { userId, battleId, isConnected });

    try {
      await prisma.battleParticipation.updateMany({
        where: {
          user_id: userId,
          battle_id: battleId
        },
        data: { is_connected: isConnected }
      });

      dbLog.debug(`Updated connection status for user ${userId} in battle ${battleId}`);
    } catch (error) {
      dbLog.error('Error updating connection status:', error);
      throw error;
    }
  }

  // Get current battle participation for a user
  static async getCurrentParticipation(userId: string): Promise<unknown | null> {
    dbLog.debug('Getting current participation', { userId });

    try {
      // Get current battle first
      const battle = await BattleService.getCurrentBattle();
      if (!battle) {
        return null;
      }

      const participation = await prisma.battleParticipation.findUnique({
        where: {
          battle_id_user_id: {
            battle_id: battle.id,
            user_id: userId
          }
        }
      });

      return participation;
    } catch (error) {
      dbLog.error('Error fetching current participation:', error);
      throw error;
    }
  }

  // Add participant to battle when they join
  static async addParticipant(userId: string): Promise<void> {
    dbLog.debug('Adding participant to battle', { userId });

    try {
      // Get current battle
      const battle = await BattleService.getCurrentBattle();
      if (!battle) {
        dbLog.debug('No current battle found, cannot add participant');
        return;
      }

      const now = new Date();

      // Create battle participation record if it doesn't exist
      await prisma.battleParticipation.upsert({
        where: {
          battle_id_user_id: {
            battle_id: battle.id,
            user_id: userId
          }
        },
        update: {
          is_connected: true
        },
        create: {
          battle_id: battle.id,
          user_id: userId,
          tests_passed: 0,
          total_tests: 0,
          completion_time: null,
          placement: null,
          joined_at: now,
          is_connected: true
        }
      });

      dbLog.info(`Added participant ${userId} to battle ${battle.id}`);
    } catch (error) {
      dbLog.error(`Error adding participant ${userId} to battle:`, error);
      throw error;
    }
  }
}