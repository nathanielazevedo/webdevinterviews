import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { BattleService } from './services/battle.service.js';
import { QuestionsService } from './services/questions.service.js';
import SchemaGenerator from './docs/schema-generator.js';
import { logger } from './utils/logger.js';

dotenv.config();

// Use shared logger
const log = logger;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Types for WebSocket messages
interface WebSocketMessage {
  type: string;
  roomId?: string;
  userId?: string;
  passed?: number;
  total?: number;
  scheduledStartTime?: string;
  durationMinutes?: number;
  completionTime?: number;
  roomIds?: string[];
}

interface PlayerData {
  ws: WebSocket;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
}

interface StatusWatcher {
  ws: WebSocket;
  watchedRooms: Set<string>;
}

interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests: number;
  completionTime?: number | null;
}

interface PlayerInfo {
  userId: string;
  testsPassed: number;
  totalTests: number;
  joinedAt: string;
  isConnected: boolean;
}

log.info('Server initialization started');
log.info('Environment variables loaded', {
  PORT: process.env.PORT,
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  ADMIN_USER_ID: process.env.ADMIN_USER_ID ? 'SET' : 'NOT SET'
});

// Initialize questions database on startup
(async () => {
  try {
    await QuestionsService.seedQuestions();
    log.info('Questions database initialized successfully');
  } catch (error) {
    log.error('Failed to initialize questions database', error);
  }
})();

app.use(cors());
log.info('CORS middleware enabled');

// Store rooms with their users and player data
const rooms = new Map<string, Map<string, WebSocket>>();
// Store player data: { userId: { ws, testsPassed, totalTests, joinedAt } }
const playerData = new Map<string, PlayerData>();
// Store global status watchers (users monitoring room statuses without joining)
const statusWatchers = new Map<string, StatusWatcher>(); // Map<connectionId, { ws, watchedRooms: Set<roomId> }>

// Battle timing manager
class BattleTimingManager {
  private checkInterval: NodeJS.Timeout | null = null;

  start(): void {
    // Check every 30 seconds for battles to auto-start/end
    this.checkInterval = setInterval(async () => {
      await this.checkScheduledBattles();
      await this.checkExpiredBattles();
    }, 30000);
    
    log.info('Battle timing manager started');
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      log.info('Battle timing manager stopped');
    }
  }

  private async checkScheduledBattles(): Promise<void> {
    try {
      const battlesToStart = await BattleService.getBattlesToAutoStart();
      
      for (const battle of battlesToStart) {
        log.info(`Auto-starting scheduled battle`, { 
          battleId: battle.id, 
          roomId: battle.room_id,
          scheduledTime: battle.scheduled_start_time
        });

        const startedBattle = await BattleService.autoStartBattle(battle.id);
        
        if (startedBattle) {
          // Broadcast battle started to all users in the room
          await this.broadcastBattleStarted(battle.room_id, startedBattle);
          // Update room status for watchers
          await broadcastRoomStatus(battle.room_id, 'battle-started');
        }
      }
    } catch (error) {
      log.error('Error checking scheduled battles:', error);
    }
  }

  private async checkExpiredBattles(): Promise<void> {
    try {
      const battlesToEnd = await BattleService.getBattlesToAutoEnd();
      
      for (const battle of battlesToEnd) {
        log.info(`Auto-ending expired battle`, { 
          battleId: battle.id, 
          roomId: battle.room_id,
          autoEndTime: battle.auto_end_time
        });

        // Collect final results from active players
        const finalResults = this.collectFinalResults(battle.room_id);
        const endedBattle = await BattleService.autoEndBattle(battle.id, finalResults);
        
        if (endedBattle) {
          // Broadcast battle ended to all users in the room
          await this.broadcastBattleEnded(battle.room_id, endedBattle, finalResults);
          // Update room status for watchers
          await broadcastRoomStatus(battle.room_id, 'battle-completed');
        }
      }
    } catch (error) {
      log.error('Error checking expired battles:', error);
    }
  }

  private collectFinalResults(roomId: string): BattleResult[] {
    const room = rooms.get(roomId);
    if (!room) return [];

    const results: BattleResult[] = [];
    room.forEach((ws, userId) => {
      const data = playerData.get(userId);
      if (data) {
        results.push({
          userId,
          testsPassed: data.testsPassed,
          totalTests: data.totalTests,
          completionTime: null // No completion time for auto-ended battles
        });
      }
    });

    // Sort by tests passed (descending) for placement
    results.sort((a, b) => b.testsPassed - a.testsPassed);
    
    return results;
  }

  private async broadcastBattleStarted(roomId: string, battle: any): Promise<void> {
    const room = rooms.get(roomId);
    if (room) {
      const message = {
        type: 'battle-started',
        battleId: battle.id,
        startedAt: battle.started_at,
        autoEndTime: battle.auto_end_time,
        durationMinutes: battle.duration_minutes,
        startedBy: 'scheduled'
      };
      
      room.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
      
      log.info(`Auto-start notification sent to ${room.size} users in room ${roomId}`);
    }
  }

  private async broadcastBattleEnded(roomId: string, battle: any, results: BattleResult[]): Promise<void> {
    const room = rooms.get(roomId);
    if (room) {
      const message = {
        type: 'battle-completed',
        battleId: battle.id,
        completedAt: battle.completed_at,
        endedBy: 'timeout',
        results: results.map((result, index) => ({
          ...result,
          placement: index + 1
        }))
      };
      
      room.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
      
      log.info(`Auto-end notification sent to ${room.size} users in room ${roomId}`);
    }
  }
}

const battleTimingManager = new BattleTimingManager();

app.get('/', (req: Request, res: Response) => {
  log.info('Health check endpoint accessed');
  res.json({ status: 'ok' });
});

// GET endpoint to retrieve all players in a room
app.get('/room/:roomId/players', (req: Request, res: Response) => {
  const { roomId } = req.params;
  log.info(`Getting players for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  
  if (!room) {
    log.warn(`No room found for roomId: ${roomId}`);
    return res.json({ players: [] });
  }
  
  const players: PlayerInfo[] = [];
  room.forEach((ws, userId) => {
    const data = playerData.get(userId);
    players.push({
      userId,
      testsPassed: data?.testsPassed || 0,
      totalTests: data?.totalTests || 0,
      joinedAt: data?.joinedAt || new Date().toISOString(),
      isConnected: ws.readyState === WebSocket.OPEN
    });
  });
  
  log.info(`Found ${players.length} players in room ${roomId}`, { players });
  res.json({ players });
});

// GET endpoint to retrieve user's battle history
app.get('/user/:userId/battles', async (req: Request, res: Response) => {
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
app.get('/user/:userId/stats', async (req: Request, res: Response) => {
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

// GET endpoint to get the next available battle (main battle room)
app.get('/battle/next', async (req: Request, res: Response) => {
  try {
    const mainBattleRoomId = 'battle_1'; // Main battle room
    log.info(`Fetching next battle info for main room: ${mainBattleRoomId}`);
    
    let battle = await BattleService.getBattle(mainBattleRoomId);
    
    // If no battle exists, create one
    if (!battle) {
      log.info(`No battle found for main room ${mainBattleRoomId}, creating new battle`);
      const adminUserId = 'system'; // System-created battle
      battle = await BattleService.createBattle(mainBattleRoomId, adminUserId, []);
    }
    
    const room = rooms.get(mainBattleRoomId);
    const connectedPlayers = room ? room.size : 0;
    
    // Get question pool for this battle
    let questionPool: any[] = [];
    try {
      questionPool = await QuestionsService.getBattleQuestionPool(battle.id);
    } catch (error) {
      log.warn('Could not fetch question pool for battle', error);
    }
    
    const battleInfo = {
      id: battle.id,
      roomId: mainBattleRoomId,
      status: battle.status,
      startedAt: battle.started_at,
      createdAt: battle.created_at,
      scheduledStartTime: battle.scheduled_start_time,
      durationMinutes: battle.duration_minutes,
      adminUserId: battle.admin_user_id,
      participantCount: battle.participants?.length || 0,
      connectedPlayers: connectedPlayers,
      canJoin: battle.status === 'waiting' || battle.status === 'active',
      isActive: battle.status === 'active',
      isWaiting: battle.status === 'waiting',
      isCompleted: battle.status === 'completed',
      questionPool: questionPool
    };
    
    log.info(`Next battle info retrieved`, { battleInfo: { ...battleInfo, questionPool: `${questionPool.length} questions` } });
    
    res.json({ battle: battleInfo });
  } catch (error) {
    log.error('Error fetching next battle:', error);
    res.status(500).json({ error: 'Failed to fetch next battle info' });
  }
});

// GET endpoint to retrieve current battle status for a room
app.get('/room/:roomId/battle', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    log.info(`Fetching battle status for room: ${roomId}`);
    
    const battle = await BattleService.getBattle(roomId);
    
    if (!battle) {
      log.warn(`No battle found for room: ${roomId}`);
      return res.json({ 
        battle: null, 
        message: 'No battle found for this room',
        canJoin: true,
        status: 'no-battle'
      });
    }
    
    const room = rooms.get(roomId);
    const connectedPlayers = room ? room.size : 0;
    
    const battleInfo = {
      id: battle.id,
      status: battle.status,
      startedAt: battle.started_at,
      createdAt: battle.created_at,
      adminUserId: battle.admin_user_id,
      participantCount: battle.participants?.length || 0,
      connectedPlayers: connectedPlayers,
      canJoin: battle.status === 'waiting' || battle.status === 'active',
      isActive: battle.status === 'active',
      isWaiting: battle.status === 'waiting',
      isCompleted: battle.status === 'completed'
    };
    
    log.info(`Battle status retrieved for room ${roomId}`, { battleInfo });
    
    res.json({ battle: battleInfo });
  } catch (error) {
    log.error('Error fetching battle status:', error);
    res.status(500).json({ error: 'Failed to fetch battle status' });
  }
});

// GET endpoint to get status of multiple rooms at once
app.get('/rooms/status', async (req: Request, res: Response) => {
  try {
    const { roomIds } = req.query; // Expect comma-separated room IDs
    
    if (!roomIds || typeof roomIds !== 'string') {
      return res.status(400).json({ error: 'roomIds query parameter is required' });
    }
    
    const roomIdArray = roomIds.split(',').map(id => id.trim());
    log.info(`Fetching status for multiple rooms:`, { roomIds: roomIdArray });
    
    const roomStatuses: Record<string, any> = {};
    
    for (const roomId of roomIdArray) {
      try {
        const battle = await BattleService.getBattle(roomId);
        const room = rooms.get(roomId);
        const connectedPlayers = room ? room.size : 0;
        
        if (!battle) {
          roomStatuses[roomId] = {
            status: 'no-battle',
            canJoin: true,
            connectedPlayers: connectedPlayers
          };
        } else {
          roomStatuses[roomId] = {
            status: battle.status,
            canJoin: battle.status === 'waiting' || battle.status === 'active',
            isActive: battle.status === 'active',
            isWaiting: battle.status === 'waiting',
            isCompleted: battle.status === 'completed',
            connectedPlayers: connectedPlayers,
            participantCount: battle.participants?.length || 0,
            startedAt: battle.started_at
          };
        }
      } catch (error) {
        log.error(`Error fetching status for room ${roomId}:`, error);
        roomStatuses[roomId] = {
          status: 'error',
          canJoin: false,
          error: 'Failed to fetch room status'
        };
      }
    }
    
    log.info(`Room statuses retrieved:`, { roomStatuses });
    res.json({ rooms: roomStatuses });
  } catch (error) {
    log.error('Error fetching room statuses:', error);
    res.status(500).json({ error: 'Failed to fetch room statuses' });
  }
});

// Initialize schema generator
const schemaGenerator = new SchemaGenerator();

// Auto-generated OpenAPI schema endpoint
app.get('/api/schema', async (req: Request, res: Response) => {
  try {
    log.info('Generating OpenAPI schema');
    const schema = await schemaGenerator.generateSchema();
    log.info('OpenAPI schema generated successfully');
    res.json(schema);
  } catch (error) {
    log.error('Error generating schema:', error);
    res.status(500).json({ error: 'Failed to generate API schema' });
  }
});

// Swagger UI documentation endpoint  
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', async (req: Request, res: Response) => {
  try {
    const schema = await schemaGenerator.generateSchema();
    const swaggerUiHtml = swaggerUi.generateHTML(schema, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Portfolio Battle API Documentation'
    });
    res.send(swaggerUiHtml);
  } catch (error) {
    log.error('Error setting up Swagger UI:', error);
    res.status(500).json({ error: 'Failed to load API documentation' });
  }
});

// WebSocket documentation endpoint
app.get('/api/ws-docs', (req: Request, res: Response) => {
  log.info('WebSocket documentation requested');
  res.sendFile(path.join(process.cwd(), 'websocket-docs.html'));
});

wss.on('connection', (ws: WebSocket) => {
  let currentRoom: string | null = null;
  let userId: string | null = null;
  const connectionId = Math.random().toString(36).substring(7);
  
  log.info(`New WebSocket connection established`, { connectionId });

  ws.on('message', async (data: Buffer) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      log.debug(`Received message from ${userId || connectionId}`, {
        type: message.type,
        roomId: message.roomId || currentRoom,
        userId: message.userId || userId,
        messageData: message
      });

      if (message.type === 'join') {
        currentRoom = message.roomId!;
        userId = message.userId!;

        log.info(`User attempting to join room`, {
          userId,
          roomId: currentRoom,
          connectionId
        });

        if (!rooms.has(currentRoom)) {
          rooms.set(currentRoom, new Map());
          log.info(`Created new room: ${currentRoom}`);
        }

        rooms.get(currentRoom)!.set(userId, ws);
        
        // Initialize or update player data
        if (!playerData.has(userId)) {
          playerData.set(userId, {
            ws,
            testsPassed: 0,
            totalTests: 0,
            joinedAt: new Date().toISOString()
          });
          log.info(`New player data created for user: ${userId}`);
        } else {
          // Update WebSocket connection for existing player
          const existing = playerData.get(userId)!;
          existing.ws = ws;
          log.info(`Updated WebSocket connection for existing user: ${userId}`);
        }
        
        log.info(`User ${userId} successfully joined room ${currentRoom}`);
        
        // Create or get battle for this room
        try {
          log.info(`Managing battle for room: ${currentRoom}`);
          let battle = await BattleService.getBattle(currentRoom);
          
          if (!battle) {
            // Create new battle in waiting state when first user joins
            // Admin is the first user to join or specified admin
            const adminUserId = process.env.ADMIN_USER_ID || userId;
            log.info(`Creating new battle for room ${currentRoom}`, {
              adminUserId,
              isDefaultAdmin: !process.env.ADMIN_USER_ID
            });
            
            battle = await BattleService.createBattle(currentRoom, adminUserId, [{ userId, joinedAt: new Date().toISOString() }]);
            log.info(`Battle created successfully`, {
              battleId: battle.id,
              status: battle.status,
              adminUserId: battle.admin_user_id
            });
          } else {
            // Add participant to existing battle
            log.info(`Adding participant to existing battle`, {
              battleId: battle.id,
              userId,
              currentStatus: battle.status
            });
            await BattleService.addParticipantToBattle(currentRoom, userId);
          }
          
          // Send battle status to the joining user
          const battleStatus = {
            type: 'battle-status',
            status: battle.status,
            isAdmin: battle.admin_user_id === userId,
            battleId: battle.id
          };
          
          log.info(`Sending battle status to user ${userId}`, { battleStatus });
          ws.send(JSON.stringify(battleStatus));
        } catch (error) {
          log.error('Error managing battle:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to manage battle'
          }));
        }
        
        // Broadcast updated player list to all users in the room
        broadcastPlayerList(currentRoom);
        
        // Broadcast room status change to watchers (new player joined)
        broadcastRoomStatus(currentRoom, 'player-joined').catch(err => 
          log.error('Error broadcasting room status on player join:', err)
        );
      }

      // ... Continue with the rest of the WebSocket message handlers ...
      // I'll create the rest of the handlers in the next part to keep this manageable

    } catch (error) {
      log.error(`Error processing WebSocket message from ${userId || connectionId}:`, error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format or processing error'
        }));
      }
    }
  });

  ws.on('close', () => {
    log.info(`WebSocket connection closed`, {
      userId: userId || 'unknown',
      connectionId,
      roomId: currentRoom || 'none'
    });
    
    if (currentRoom && userId) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.delete(userId);
        log.info(`User ${userId} removed from room ${currentRoom}`);
        
        if (room.size === 0) {
          rooms.delete(currentRoom);
          log.info(`Room ${currentRoom} deleted - no remaining users`);
        } else {
          log.info(`Room ${currentRoom} still has ${room.size} users remaining`);
          // Broadcast updated player list when someone leaves
          broadcastPlayerList(currentRoom);
          // Broadcast room status change to watchers (player left)
          broadcastRoomStatus(currentRoom, 'player-left').catch(err => 
            log.error('Error broadcasting room status on player leave:', err)
          );
        }
      }
    }
    
    // Clean up status watchers
    statusWatchers.delete(connectionId);
  });

  ws.on('error', (error: Error) => {
    log.error(`WebSocket error for connection ${connectionId}:`, error);
  });
});

// Helper function to get all players in a room
function getRoomPlayers(roomId: string): PlayerInfo[] {
  log.debug(`Getting players for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  if (!room) {
    log.debug(`No room found for roomId: ${roomId}`);
    return [];
  }
  
  const players: PlayerInfo[] = [];
  room.forEach((ws, userId) => {
    const data = playerData.get(userId);
    const player: PlayerInfo = {
      userId,
      testsPassed: data?.testsPassed || 0,
      totalTests: data?.totalTests || 0,
      joinedAt: data?.joinedAt || new Date().toISOString(),
      isConnected: ws.readyState === WebSocket.OPEN
    };
    players.push(player);
    log.debug(`Player data for ${userId}`, { player });
  });
  
  log.debug(`Found ${players.length} players in room ${roomId}`);
  return players;
}

// Helper function to broadcast player list to all users in a room
function broadcastPlayerList(roomId: string): void {
  log.debug(`Broadcasting player list for room: ${roomId}`);
  
  const room = rooms.get(roomId);
  if (!room) {
    log.debug(`No room found for broadcast: ${roomId}`);
    return;
  }
  
  const players = getRoomPlayers(roomId);
  const message = JSON.stringify({
    type: 'players-list',
    players
  });
  
  let sentCount = 0;
  room.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      sentCount++;
      log.debug(`Player list sent to user: ${userId}`);
    } else {
      log.debug(`Skipped sending to user ${userId} - connection not ready (state: ${ws.readyState})`);
    }
  });
  
  log.info(`Player list broadcast completed for room ${roomId}`, {
    totalUsers: room.size,
    sentTo: sentCount,
    playerCount: players.length
  });
}

// Helper function to broadcast room status changes to watchers
async function broadcastRoomStatus(roomId: string, statusChange: string | null = null): Promise<void> {
  log.debug(`Broadcasting room status for room: ${roomId}`, { statusChange });
  
  try {
    // Get current battle status
    const battle = await BattleService.getBattle(roomId);
    const room = rooms.get(roomId);
    const connectedPlayers = room ? room.size : 0;
    
    let roomStatus: any;
    if (!battle) {
      roomStatus = {
        status: 'no-battle',
        canJoin: true,
        connectedPlayers: connectedPlayers
      };
    } else {
      roomStatus = {
        status: battle.status,
        canJoin: battle.status === 'waiting' || battle.status === 'active',
        isActive: battle.status === 'active',
        isWaiting: battle.status === 'waiting',
        isCompleted: battle.status === 'completed',
        connectedPlayers: connectedPlayers,
        participantCount: battle.participants?.length || 0,
        startedAt: battle.started_at
      };
    }
    
    // Add change information if provided
    if (statusChange) {
      roomStatus.change = statusChange;
    }
    
    const message = JSON.stringify({
      type: 'room-status-update',
      roomId: roomId,
      ...roomStatus
    });
    
    // Send to all watchers monitoring this room
    let sentCount = 0;
    statusWatchers.forEach((watcher, connectionId) => {
      if (watcher.watchedRooms.has(roomId) && watcher.ws.readyState === WebSocket.OPEN) {
        watcher.ws.send(message);
        sentCount++;
        log.debug(`Room status sent to watcher: ${connectionId}`);
      }
    });
    
    log.info(`Room status broadcast completed for room ${roomId}`, {
      sentToWatchers: sentCount,
      roomStatus
    });
    
  } catch (error) {
    log.error(`Error broadcasting room status for ${roomId}:`, error);
  }
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  log.info(`WebSocket server started successfully on port ${PORT}`);
  log.info('Server ready to accept connections');
  log.info('Available endpoints:', {
    healthCheck: `http://localhost:${PORT}/`,
    roomPlayers: `http://localhost:${PORT}/room/:roomId/players`,
    roomBattle: `http://localhost:${PORT}/room/:roomId/battle`,
    userBattles: `http://localhost:${PORT}/user/:userId/battles`,
    userStats: `http://localhost:${PORT}/user/:userId/stats`
  });
  
  // Start the battle timing manager
  battleTimingManager.start();
});

// Graceful shutdown
process.on('SIGINT', () => {
  log.info('Received SIGINT, shutting down gracefully...');
  battleTimingManager.stop();
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  log.info('Received SIGTERM, shutting down gracefully...');
  battleTimingManager.stop();
  server.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});