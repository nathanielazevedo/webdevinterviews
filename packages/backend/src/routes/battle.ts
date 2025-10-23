import { Router, Request, Response } from 'express';
import { WebSocket } from 'ws';
import { BattleService } from '../services/battle.service.js';
import { QuestionsService } from '../services/questions.service.js';
import { logger } from '../utils/logger.js';
import { PlayerData } from '../types/websocket.js';
import type { Player } from '@webdevinterviews/shared';

const log = logger;
const BATTLE_ROOM_ID = 'battle_main'; // Single battle room constant

// Helper function to get next Saturday at 5pm EST
function getNextSaturday5pmEST(): string {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  
  // Find next Saturday
  const daysUntilSaturday = (6 - easternTime.getDay()) % 7; // Saturday is day 6
  const nextSaturday = new Date(easternTime);
  
  if (daysUntilSaturday === 0) {
    // Today is Saturday - check if it's before 5pm
    if (easternTime.getHours() >= 17) {
      // It's Saturday after 5pm, go to next Saturday
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }
  } else {
    // Add days to get to next Saturday
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
  }
  
  // Set time to 5:00 PM
  nextSaturday.setHours(17, 0, 0, 0);
  
  // Convert back to UTC for storage
  return nextSaturday.toISOString();
}

export function createBattleRoutes(
  connectedPlayers: Map<string, WebSocket>,
  playerData: Map<string, PlayerData>
) {
  const router = Router();

  // GET endpoint to get the current battle status
  router.get('/current', async (req: Request, res: Response) => {
    try {
      log.info(`Fetching current battle info`);
      
      let battle = await BattleService.getBattle(BATTLE_ROOM_ID);
      
      // If no battle exists OR the current battle is completed, create a new one
      if (!battle || battle.status === 'completed') {
        if (battle && battle.status === 'completed') {
          log.info(`Current battle is completed, creating new scheduled battle`);
        } else {
          log.info(`No battle found, creating new scheduled battle`);
        }
        
        const adminUserId = 'c9c22420-5e80-490f-8abf-3396c5949adf'; // System-created battle
        const nextSaturday5pm = getNextSaturday5pmEST();
        
        battle = await BattleService.createBattle(
          BATTLE_ROOM_ID, 
          adminUserId, 
          [],
          {
            scheduledStartTime: nextSaturday5pm,
            durationMinutes: 60 // 1 hour duration
          }
        );
        
        log.info(`New battle created for next Saturday 5pm EST`, {
          battleId: battle.id,
          scheduledStartTime: nextSaturday5pm
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
        questionPool
      };
      
      log.info(`Current battle info retrieved`, { battleInfo: { ...battleInfo, questionPool: `${questionPool.length} questions` } });
      
      res.json({ battle: battleInfo });
    } catch (error) {
      log.error('Error fetching current battle:', error);
      res.status(500).json({ error: 'Failed to fetch current battle info' });
    }
  });

  // GET endpoint to get battle players
  router.get('/players', (req: Request, res: Response) => {
    log.info(`Getting players for current battle`);
    
    const players: Player[] = [];
    connectedPlayers.forEach((ws, userId) => {
      const data = playerData.get(userId);
      players.push({
        userId,
        testsPassed: data?.testsPassed || 0,
        totalTests: data?.totalTests || 0,
        joinedAt: data?.joinedAt || new Date().toISOString(),
        isConnected: ws.readyState === WebSocket.OPEN
      });
    });
    
    log.info(`Found ${players.length} players in current battle`, { players });
    res.json({ players });
  });

  // GET endpoint to get battle status (legacy compatibility)
  router.get('/status', async (req: Request, res: Response) => {
    try {
      log.info(`Fetching battle status`);
      
      const battle = await BattleService.getBattle(BATTLE_ROOM_ID);
      
      if (!battle) {
        log.warn(`No battle found`);
        return res.json({ 
          battle: null, 
          message: 'No battle found',
          canJoin: true,
          status: 'no-battle'
        });
      }
      
      const connectedPlayerCount = connectedPlayers.size;
      
      const battleInfo = {
        id: battle.id,
        status: battle.status,
        startedAt: battle.started_at,
        createdAt: battle.created_at,
        adminUserId: battle.admin_user_id,
        participantCount: battle.participants?.length || 0,
        connectedPlayers: connectedPlayerCount,
        canJoin: battle.status === 'waiting' || battle.status === 'active',
        isActive: battle.status === 'active',
        isWaiting: battle.status === 'waiting',
        isCompleted: battle.status === 'completed'
      };
      
      log.info(`Battle status retrieved`, { battleInfo });
      
      res.json({ battle: battleInfo });
    } catch (error) {
      log.error('Error fetching battle status:', error);
      res.status(500).json({ error: 'Failed to fetch battle status' });
    }
  });

  return router;
}