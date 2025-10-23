import { Router, Request, Response } from 'express';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';

const log = logger;

export function createUserRoutes() {
  const router = Router();

  // GET endpoint to retrieve user's battle history
  router.get('/:userId/battles', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      
      log.info(`Fetching battle history for user: ${userId} (limit: ${limit})`);
      
      const battles = await BattleService.getUserBattleHistory(userId, limit);
      log.info(`Found ${battles.length} battles for user ${userId}`);
      
      res.json({ battles });
    } catch (error) {
      log.error('Error fetching user battles:', error);
      res.status(500).json({ error: 'Failed to fetch battle history' });
    }
  });

  // GET endpoint to retrieve user's battle statistics
  router.get('/:userId/stats', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      log.info(`Fetching stats for user: ${userId}`);
      
      const stats = await BattleService.getUserStats(userId);
      log.info(`Stats retrieved for user ${userId}`, { stats });
      
      res.json({ stats });
    } catch (error) {
      log.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  });

  return router;
}