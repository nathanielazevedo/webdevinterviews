import { Router } from 'express';
import { QuestionsService } from '../services/questions.service.js';
import { BattleService } from '../services/battle.service.js';
import { sendSuccessResponse, asyncHandler } from '../utils/response.js';

export function createQuestionsRoutes() {
  const router = Router();

  router.get('/', asyncHandler(async (req, res) => {
    // Fetch all questions
    const questions = await QuestionsService.getAllQuestions();

    // Fetch the current/next battle and its question pool
    let nextBattleQuestions = null;
    try {
      const currentBattle = await BattleService.getCurrentBattle();
      if (currentBattle && currentBattle.questionPool) {
        nextBattleQuestions = currentBattle.questionPool.map(pool => pool.question);
      }
    } catch (error) {
      // Log error but don't fail the request if battle data is unavailable
      console.warn('Could not fetch next battle questions:', error);
    }

    sendSuccessResponse(res, { 
      questions, 
      nextBattleQuestions 
    }, 'Questions and battle data fetched successfully');
  }));

  return router;
}
