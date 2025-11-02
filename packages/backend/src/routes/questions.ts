import { Router } from 'express';
import { QuestionsService } from '../services/questions.service.js';
import { logger } from '../utils/logger.js';
import { sendSuccessResponse, asyncHandler } from '../utils/response.js';

const log = logger;

export function createQuestionsRoutes() {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {
    log.info('Fetching all questions');

    const questions = await QuestionsService.getAllQuestions();

    log.info('All questions retrieved successfully', { count: questions.length });

    sendSuccessResponse(res, { questions }, 'Questions fetched successfully');
  }));

  return router;
}