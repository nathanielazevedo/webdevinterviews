import { Router } from 'express';

import type { Battle, BattleParticipation } from '@prisma/client';
import { BattleService } from '../services/battle.service.js';

// Type for battle with participations
type BattleWithParticipations = Battle & {
  participations?: BattleParticipation[];
};

import { logger } from '../utils/logger.js';
import { sendSuccessResponse, asyncHandler } from '../utils/response.js';
import { validateQueryParams } from '../utils/validation.js';

const log = logger;

export function createBattleRoutes() {
  const router = Router();



  router.get('/history', 
    validateQueryParams({ limit: 'number' }),
    asyncHandler(async (req, res) => {
      log.info(`Fetching battle history`);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const battles = await BattleService.getCompletedBattles(limit);
      
      // Format the response with battle participants  
      const battleHistory = (battles as BattleWithParticipations[]).map((battle) => ({
        id: battle.id,
        status: battle.status,
        startedAt: battle.started_at,
        completedAt: battle.completed_at,
        createdAt: battle.created_at,
        durationMinutes: battle.duration_minutes,
        adminUserId: battle.admin_user_id,
        endedBy: battle.ended_by,
        participants: battle.participations?.map((participation: BattleParticipation) => ({
          userId: participation.user_id,
          testsPassed: participation.tests_passed,
          totalTests: participation.total_tests,
          completionTime: participation.completion_time,
          placement: participation.placement,
          joinedAt: participation.joined_at,
          isConnected: participation.is_connected
        })) || []
      }));
      
      sendSuccessResponse(res, { battles: battleHistory, total: battleHistory.length }, 'Battle history fetched successfully');
    }));

  return router;
}