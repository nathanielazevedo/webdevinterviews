import { Router } from 'express';
import { QuestionsService } from '../services/questions.service.js';
import { sendSuccessResponse, asyncHandler } from '../utils/response.js';

export function createQuestionsRoutes() {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {

    const questions = await QuestionsService.getAllQuestions();


    sendSuccessResponse(res, { questions }, 'Questions fetched successfully');
  }));

  return router;
}
