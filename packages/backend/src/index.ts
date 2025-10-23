import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { QuestionsService } from './services/questions.service.js';
import { logger } from './utils/logger.js';
import { BattleTimingManager } from './managers/BattleTimingManager.js';
import { WebSocketManager } from './websocket/WebSocketManager.js';
import { createBattleRoutes } from './routes/battle.js';
import { createUserRoutes } from './routes/user.js';
import { createApiRoutes } from './routes/api.js';

dotenv.config();

// Use shared logger
const log = logger;

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

// Create Express app and HTTP server
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize WebSocket manager
const wsManager = new WebSocketManager();
wsManager.setupWebSocketServer(wss);

// Initialize battle timing manager
const battleTimingManager = new BattleTimingManager(
  wsManager.connectedPlayersMap,
  wsManager.playerDataMap,
  wsManager.broadcastBattleStatus.bind(wsManager)
);

// Setup middleware
app.use(cors());
log.info('CORS middleware enabled');

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  log.info('Health check endpoint accessed');
  res.json({ status: 'ok' });
});

// Setup route modules
app.use('/battle', createBattleRoutes(wsManager.connectedPlayersMap, wsManager.playerDataMap));
app.use('/user', createUserRoutes());

// TODO: Setup dynamic API docs generation

// API routes (docs and schema)
app.use('/api', createApiRoutes());

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  log.info(`WebSocket server started successfully on port ${PORT}`);
  log.info('Server ready to accept connections');
  log.info('Available endpoints:', {
    healthCheck: `http://localhost:${PORT}/`,
    battleCurrent: `http://localhost:${PORT}/battle/current`,
    battlePlayers: `http://localhost:${PORT}/battle/players`,
    battleStatus: `http://localhost:${PORT}/battle/status`,
    userBattles: `http://localhost:${PORT}/user/:userId/battles`,
    userStats: `http://localhost:${PORT}/user/:userId/stats`,
    apiDocs: `http://localhost:${PORT}/api/docs`,
    apiSchema: `http://localhost:${PORT}/api/schema`,
    wsDocumentation: `http://localhost:${PORT}/api/ws-docs`
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