import { Router, Request, Response } from 'express';
import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { QuestionsService } from '../services/questions.service.js';
import { logger } from '../utils/logger.js';

const log = logger;

export function createBattleRoutes(
  connectedPlayers: Map<string, WebSocket>
) {
  const router = Router();

  router.get('/current', async (req: Request, res: Response) => {
    try {
      log.info(`Fetching current battle info`);
      
      let battle = await BattleService.getCurrentBattle();

      if (!battle || battle.status === 'completed') {
        if (battle && battle.status === 'completed') {
          log.info(`Current battle is completed, creating new scheduled battle`);
        } else {
          log.info(`No battle found, creating new scheduled battle`);
        }
        
        battle = await BattleService.createCurrentBattle();
        
        log.info(`New battle created for next Saturday 5pm EST`, {
          battleId: battle.id,
          scheduledStartTime: battle.scheduled_start_time
        });
      }
      
      const connectedPlayerCount = connectedPlayers.size;
      
      // Get question pool for this battle
      let questionPool: unknown[] = [];
      try {
        questionPool = await QuestionsService.getBattleQuestionPool(battle.id);
      } catch (error) {
        log.warn('Could not fetch question pool for battle', error);
      }
      
      // Get selected question if it exists
      let selectedQuestion: unknown = null;
      // @ts-ignore - selected_question_id exists in database but not in generated types yet
      if (battle.selected_question_id) {
        try {
          // @ts-ignore - selected_question_id exists in database but not in generated types yet
          selectedQuestion = await QuestionsService.getQuestionById(battle.selected_question_id.toString());
        } catch (error) {
          log.warn('Could not fetch selected question for battle', error);
        }
      }
      
      const battleInfo = {
        id: battle.id,
        status: battle.status,
        startedAt: battle.started_at,
        createdAt: battle.created_at,
        scheduledStartTime: battle.scheduled_start_time,
        durationMinutes: battle.duration_minutes,
        adminUserId: battle.admin_user_id,
        participantCount: battle.participants?.length || 0,
        connectedPlayers: connectedPlayerCount,
        canJoin: battle.status === 'waiting' || battle.status === 'active',
        isActive: battle.status === 'active',
        isWaiting: battle.status === 'waiting',
        isCompleted: battle.status === 'completed',
        questionPool,
        selectedQuestion
      };
      
      res.json({ battle: battleInfo });
    } catch (error) {
      log.error('Error fetching current battle:', error);
      res.status(500).json({ error: 'Failed to fetch current battle info' });
    }
  });

  router.get('/history', async (req: Request, res: Response) => {
    try {
      log.info(`Fetching battle history`);
      
      const limit = parseInt(req.query.limit as string) || 50;
      const battles = await BattleService.getCompletedBattles(limit);
      
      // Format the response with battle participants
      const battleHistory = battles.map((battle: any) => ({
        id: battle.id,
        status: battle.status,
        startedAt: battle.started_at,
        completedAt: battle.completed_at,
        createdAt: battle.created_at,
        durationMinutes: battle.duration_minutes,
        adminUserId: battle.admin_user_id,
        endedBy: battle.ended_by,
        participants: battle.participations?.map((participation: any) => ({
          userId: participation.user_id,
          testsPassed: participation.tests_passed,
          totalTests: participation.total_tests,
          completionTime: participation.completion_time,
          placement: participation.placement,
          joinedAt: participation.joined_at,
          isConnected: participation.is_connected
        })) || []
      }));
      
      res.json({ 
        battles: battleHistory,
        total: battleHistory.length
      });
    } catch (error) {
      log.error('Error fetching battle history:', error);
      res.status(500).json({ error: 'Failed to fetch battle history' });
    }
  });

  return router;
}