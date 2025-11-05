import { Router } from 'express';
import { AttackService } from '../services/attack.service.js';
import { sendSuccessResponse, sendErrorResponse, asyncHandler } from '../utils/response.js';

const router = Router();

/**
 * GET /api/attacks
 * Get all available attacks for purchase (shop)
 */
router.get('/', asyncHandler(async (req, res) => {
  const attacks = await AttackService.getAvailableAttacks();
  sendSuccessResponse(res, { attacks }, 'Attacks fetched successfully');
}));

/**
 * GET /api/attacks/:id
 * Get a specific attack by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const attackId = parseInt(req.params.id);
  const attack = await AttackService.getAttackById(attackId);

  if (!attack) {
    return sendErrorResponse(res, 'Attack not found', 'Not Found', 404);
  }

  sendSuccessResponse(res, { attack }, 'Attack fetched successfully');
}));

/**
 * GET /api/attacks/user/wallet
 * Get user's wallet (requires authentication)
 */
router.get('/user/wallet', asyncHandler(async (req, res) => {
  const userId = req.user?.sub;

  if (!userId) {
    return sendErrorResponse(res, 'User not authenticated', 'Unauthorized', 401);
  }

  const wallet = await AttackService.getUserWallet(userId);
  sendSuccessResponse(res, { wallet }, 'Wallet fetched successfully');
}));

/**
 * GET /api/attacks/user/inventory
 * Get user's purchased attacks (inventory)
 */
router.get('/user/inventory', asyncHandler(async (req, res) => {
  const userId = req.user?.sub;

  if (!userId) {
    return sendErrorResponse(res, 'User not authenticated', 'Unauthorized', 401);
  }

  const attacks = await AttackService.getUserAttacks(userId);
  sendSuccessResponse(res, { attacks }, 'User inventory fetched successfully');
}));

/**
 * POST /api/attacks/purchase
 * Purchase an attack
 */
router.post('/purchase', asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  const { attackTypeId } = req.body;

  if (!userId) {
    return sendErrorResponse(res, 'User not authenticated', 'Unauthorized', 401);
  }

  if (!attackTypeId) {
    return sendErrorResponse(res, 'attackTypeId is required', 'Validation Error', 400);
  }

  try {
    const result = await AttackService.purchaseAttack(userId, parseInt(attackTypeId));
    sendSuccessResponse(res, result, 'Attack purchased successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to purchase attack';
    sendErrorResponse(res, message, 'Purchase Failed', 400);
  }
}));

/**
 * POST /api/attacks/use
 * Use an attack in a battle
 */
router.post('/use', asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  const { battleId, attackTypeId, targetUserId } = req.body;

  if (!userId) {
    return sendErrorResponse(res, 'User not authenticated', 'Unauthorized', 401);
  }

  if (!battleId || !attackTypeId) {
    return sendErrorResponse(res, 'battleId and attackTypeId are required', 'Validation Error', 400);
  }

  try {
    const result = await AttackService.useAttack(
      userId,
      battleId,
      parseInt(attackTypeId),
      targetUserId
    );
    sendSuccessResponse(res, result, 'Attack used successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to use attack';
    sendErrorResponse(res, message, 'Use Failed', 400);
  }
}));

/**
 * GET /api/attacks/battle/:battleId/effects
 * Get active effects in a battle
 */
router.get('/battle/:battleId/effects', asyncHandler(async (req, res) => {
  const { battleId } = req.params;

  const effects = await AttackService.getActiveBattleEffects(battleId);
  sendSuccessResponse(res, { effects }, 'Battle effects fetched successfully');
}));

export default router;
