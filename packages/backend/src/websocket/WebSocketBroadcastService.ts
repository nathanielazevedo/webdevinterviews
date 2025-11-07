import { WebSocket } from 'ws';
import { SupabaseClientService } from '../services/supabase-client.service.js';
import { BattleService } from '../services/battle.service.js';
import { logger } from '../utils/logger.js';
import type { Player } from '@webdevinterviews/shared';
import { BattleParticipationService } from '../services/battle-participation.service.js';
import { BotPlayerService } from '../services/bot-player.service.js';

// Battle with Prisma includes - use any for flexibility with database types
interface BattleWithIncludes {
  id: string;
  status: string;
  admin_user_id?: string | null;
  started_at?: Date | null;
  completed_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  scheduled_start_time?: Date | null;
  duration_minutes?: number | null;
  auto_end_time?: Date | null;
  ended_by?: string | null;
  selected_question_id?: number | null;
  selectedQuestion?: unknown;
  questionPool?: Array<{
    question: {
      id: number;
      title: string;
      difficulty: string;
      leetcode_number?: number | null;
      tags?: string[] | null;
    };
  }>;
}

const log = logger;

export class WebSocketBroadcastService {
  private connectedPlayers: Map<string, WebSocket>;

  constructor(
    connectedPlayers: Map<string, WebSocket>
  ) {
    this.connectedPlayers = connectedPlayers;
  }

    /**
   * Broadcast current player list to all connected players
   */
  async broadcastPlayerList(): Promise<void> {
    if (this.connectedPlayers.size === 0) {
      return;
    }

    log.info(`Broadcasting player list to ${this.connectedPlayers.size} connected players`);

    try {
      const players = await this.getAllPlayers();
      log.info(`Player list contains ${players.length} total players (real + bots)`);
      
      const message = JSON.stringify({
        type: 'players-list',
        players
      });

      this.connectedPlayers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    } catch (error) {
      log.error('Error broadcasting player list:', error);
    }
  }

  /**
   * Broadcast battle status changes to watchers
   */
  async broadcastBattleStatus(statusChange?: string): Promise<void> {
    try {
      // Get current battle status
      const battleData = await BattleService.getCurrentBattle();
      const connectedPlayers = this.connectedPlayers.size;
      
      let battleStatus: Record<string, unknown>;
      if (!battleData) {
        battleStatus = {
          status: 'no-battle',
          canJoin: true,
          connectedPlayers,
          battle: null,
          currentQuestion: null,
          questionPool: []
        };
      } else {
        // Type assertion for battle with includes
        const battle = battleData as BattleWithIncludes;

        // Get current question if battle has one
        let currentQuestion = null;
        if (battle.selected_question_id) {
          try {
            currentQuestion = await BattleService.getCurrentBattleQuestion(battle.id);
          } catch (questionError) {
            log.error(`Error getting current question for battle ${battle.id}:`, questionError);
          }
        }

        // Get question pool summary
        const questionPool = battle.questionPool?.map(qp => ({
          id: qp.question.id,
          title: qp.question.title,
          difficulty: qp.question.difficulty,
          leetcode_number: qp.question.leetcode_number,
          tags: qp.question.tags
        })) || [];

        battleStatus = {
          status: battle.status,
          canJoin: battle.status === 'waiting' || battle.status === 'active',
          isActive: battle.status === 'active',
          isWaiting: battle.status === 'waiting',
          isCompleted: battle.status === 'completed',
          battleId: battle.id,
          connectedPlayers,
          scheduledStart: battle.scheduled_start_time,
          actualStart: battle.started_at,
          completedAt: battle.completed_at,
          durationMinutes: battle.duration_minutes,
          adminUserId: battle.admin_user_id,
          battle: {
            id: battle.id,
            status: battle.status,
            started_at: battle.started_at, // Use snake_case consistently
            completed_at: battle.completed_at,
            duration_minutes: battle.duration_minutes,
            admin_user_id: battle.admin_user_id,
            scheduled_start_time: battle.scheduled_start_time,
            auto_end_time: battle.auto_end_time,
            created_at: battle.created_at,
            canJoin: battle.status === 'waiting' || battle.status === 'active',
            isActive: battle.status === 'active',
            isWaiting: battle.status === 'waiting',
            isCompleted: battle.status === 'completed'
          },
          currentQuestion,
          questionPool
        };
      }

      // Send raw battle data with question info
      const message = JSON.stringify({
        type: 'battle-status',
        battle: {
          ...(battleStatus.battle || {}),
          selectedQuestion: battleStatus.currentQuestion // Include the full selected question
        },
        currentQuestion: battleStatus.currentQuestion, // Also include at top level for backwards compatibility
        questionPool: battleStatus.questionPool,
        statusChange,
        timestamp: new Date().toISOString()
      });

      // Send to all connected players
      this.connectedPlayers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });

    } catch (error) {
      log.error('Error broadcasting battle status:', error);
    }
  }

  /**
   * Send message to specific player
   */
  sendToPlayer(userId: string, message: object): boolean {
    const ws = this.connectedPlayers.get(userId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      log.error(`Error sending message to player ${userId}:`, error);
      return false;
    }
  }

  /**
   * Broadcast message to all connected players
   */
  broadcastToAllPlayers(message: object): number {
    let sentCount = 0;
    const messageStr = JSON.stringify(message);

    this.connectedPlayers.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageStr);
          sentCount++;
        } catch (error) {
          log.error(`Error broadcasting to player ${userId}:`, error);
        }
      }
    });

    return sentCount;
  }

  /**
   * Get all players with their display names from Supabase
   */
  private async getAllPlayers(): Promise<Player[]> {
    const players: Player[] = [];

    if (this.connectedPlayers.size === 0) {
      return players;
    }

    const userIds = Array.from(this.connectedPlayers.keys());

    try {
      // Get Supabase client
      const supabase = SupabaseClientService.getAdminClient();

      // Fetch user profiles from Supabase Auth
      const { data: authUsers, error } = await supabase.auth.admin.listUsers();
      
      let users: Array<{ id: string; email?: string; user_metadata?: Record<string, unknown> }> = [];
      if (error) {
        log.error('Error fetching user profiles:', error);
        // Fall back to using user IDs as display names
      } else {
        // Filter to only the users we need
        users = authUsers.users.filter(user => userIds.includes(user.id));
      }

      // Create user lookup map
      const userLookup = new Map<string, { displayName: string; email?: string }>();
      if (users) {
        users.forEach(user => {
          const metadata = user.user_metadata || {};
          const displayName = metadata.display_name || metadata.full_name || user.email || user.id;
          userLookup.set(user.id, {
            displayName: String(displayName),
            email: user.email
          });
        });
      }

      // Get current battle and participation data for connected users
      const currentBattle = await BattleService.getCurrentBattle();
      let participationMap = new Map();
      
      if (currentBattle) {
        const participationData = await BattleParticipationService.getBattleParticipants(currentBattle.id) as Array<{ user_id: string; tests_passed: number; joined_at: string }>;
        participationMap = new Map(participationData.map(p => [p.user_id, p]));
      }

      // Build players array
      this.connectedPlayers.forEach((ws, userId) => {
        const userInfo = userLookup.get(userId);
        const participation = participationMap.get(userId);
        
        const player: Player = {
          userId,
          username: userInfo?.displayName || userId, // Use display name or fallback to userId
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`, // Generate avatar from userId
          testsPassed: participation?.tests_passed || 0,
          joinedAt: participation?.joined_at || new Date().toISOString(),
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });

      // Add bot players if there's a current battle
      if (currentBattle) {
        const botsInBattle = BotPlayerService.getBotsInBattle(currentBattle.id);
        log.info(`Found ${botsInBattle.length} bots for battle ${currentBattle.id}`);
        
        botsInBattle.forEach(bot => {
          const botInfo = BotPlayerService.getBotInfo(bot.id);
          const participation = participationMap.get(bot.id);
          
          log.info(`Adding bot to player list: ${bot.username} (${bot.id})`);
          
          const botPlayer: Player = {
            userId: bot.id,
            username: bot.username,
            avatar: bot.avatar, // Include bot avatar
            testsPassed: participation?.tests_passed || botInfo?.currentTestsPassed || 0,
            joinedAt: participation?.joined_at || new Date().toISOString(),
            isConnected: true, // Bots are always "connected"
            isBot: true // Mark as bot for frontend (optional display)
          };
          players.push(botPlayer);
        });
      }

    } catch (error) {
      log.error('Error in getAllPlayers:', error);
      
      // Fallback: create players with basic info
      this.connectedPlayers.forEach((ws, userId) => {
        const player: Player = {
          userId,
          username: userId, // Use userId as fallback
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`, // Generate avatar from userId
          testsPassed: 0, // Default when no participation data available
          joinedAt: new Date().toISOString(), // Default to now
          isConnected: ws.readyState === WebSocket.OPEN
        };
        players.push(player);
      });
    }

    return players;
  }
}
