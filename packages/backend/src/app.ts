import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocket } from 'ws';
import { logger } from './utils/logger.js';
import { createBattleRoutes } from './routes/battle.js';
import { createQuestionsRoutes } from './routes/questions.js';
import { createLocationRoutes } from './routes/location.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';

const log = logger;

/**
 * Create and configure the Express application
 */
export function createApp(connectedPlayersMap: Map<string, WebSocket>): express.Application {
  const app = express();

  // Setup middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/', (req: Request, res: Response) => {
    log.info('Health check endpoint accessed');
    res.json({ status: 'ok' });
  });

  // Setup route modules
  app.use('/battle', authenticateToken, createBattleRoutes(connectedPlayersMap));
  app.use('/questions', optionalAuth, createQuestionsRoutes());
  app.use('/location', createLocationRoutes());

  return app;
}