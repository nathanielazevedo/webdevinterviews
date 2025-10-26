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
import { createQuestionsRoutes } from './routes/questions.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';

dotenv.config();


// Use shared logger
const log = logger;


// Initialize questions database on startup
(async () => {
  try {
    await QuestionsService.seedQuestions();
  } catch (error) {
    log.error('Failed to initialize questions database', error);
  }
})();

// Create Express app and HTTP server
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false, // Disable compression for compatibility
  maxPayload: 1024 * 1024 // 1MB max payload
});

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

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  log.info('Health check endpoint accessed');
  res.json({ status: 'ok' });
});


// Setup route modules
app.use('/battle', authenticateToken, createBattleRoutes(wsManager.connectedPlayersMap));
app.use('/questions', optionalAuth, createQuestionsRoutes());


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  log.info(`WebSocket server started successfully on port ${PORT}`);
  
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