import { Router, Request, Response } from 'express';
import { QuestionsService } from '../services/questions.service.js';
import { logger } from '../utils/logger.js';

const log = logger;

export function createQuestionsRoutes() {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      log.info('Fetching all questions');

      const questions = await QuestionsService.getAllQuestions();

      log.info('All questions retrieved successfully', { count: questions.length });

      res.json({ questions });
    } catch (error) {
      log.error('Error fetching all questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  return router;
}