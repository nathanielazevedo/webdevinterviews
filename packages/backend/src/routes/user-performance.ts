import { Router } from 'express';
import { UserPerformanceService } from '../services/user-performance.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response';

const router = Router();

/**
 * POST /api/user-performance/record-attempt
 * Record a user's attempt on a question
 */
router.post('/record-attempt', async (req, res) => {
  try {
    const { questionId, userId, completionTimeMs, isSuccessful } = req.body;

    if (!questionId || !userId || typeof isSuccessful !== 'boolean') {
      return sendErrorResponse(res, 'Missing required fields: questionId, userId, isSuccessful', 'Validation Error', 400);
    }

    const performance = await UserPerformanceService.recordQuestionAttempt({
      questionId: parseInt(questionId),
      userId,
      completionTimeMs: completionTimeMs ? parseInt(completionTimeMs) : undefined,
      isSuccessful,
    });

    sendSuccessResponse(res, performance);
  } catch (error) {
    console.error('Error recording question attempt:', error);
    sendErrorResponse(res, error, 'Failed to record question attempt');
  }
});

/**
 * GET /api/user-performance/:userId/question/:questionId
 * Get user's performance for a specific question
 */
router.get('/:userId/question/:questionId', async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    const performance = await UserPerformanceService.getUserQuestionPerformance(
      userId,
      parseInt(questionId)
    );

    sendSuccessResponse(res, performance);
  } catch (error) {
    console.error('Error getting user question performance:', error);
    sendErrorResponse(res, error, 'Failed to get user question performance');
  }
});

/**
 * GET /api/user-performance/:userId/overall
 * Get user's performance across all questions
 */
router.get('/:userId/overall', async (req, res) => {
  try {
    const { userId } = req.params;

    const performances = await UserPerformanceService.getUserOverallPerformance(userId);

    sendSuccessResponse(res, performances);
  } catch (error) {
    console.error('Error getting user overall performance:', error);
    sendErrorResponse(res, error, 'Failed to get user overall performance');
  }
});

/**
 * GET /api/user-performance/leaderboard/question/:questionId
 * Get leaderboard for a specific question
 */
router.get('/leaderboard/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const leaderboard = await UserPerformanceService.getQuestionLeaderboard(
      parseInt(questionId),
      limit
    );

    sendSuccessResponse(res, leaderboard);
  } catch (error) {
    console.error('Error getting question leaderboard:', error);
    sendErrorResponse(res, error, 'Failed to get question leaderboard');
  }
});

/**
 * POST /api/user-performance/:userId/best-times
 * Get user's best times for multiple questions
 */
router.post('/:userId/best-times', async (req, res) => {
  try {
    const { userId } = req.params;
    const { questionIds } = req.body;

    if (!questionIds || !Array.isArray(questionIds)) {
      return sendErrorResponse(res, 'questionIds must be an array', 'Validation Error', 400);
    }

    const bestTimes = await UserPerformanceService.getUserBestTimes(
      userId,
      questionIds.map(id => parseInt(id))
    );

    sendSuccessResponse(res, bestTimes);
  } catch (error) {
    console.error('Error getting user best times:', error);
    sendErrorResponse(res, error, 'Failed to get user best times');
  }
});

export default router;