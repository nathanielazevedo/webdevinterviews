import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocket } from 'ws';

import { createBattleRoutes } from './routes/battle.js';
import { createQuestionsRoutes } from './routes/questions.js';
import { createLocationRoutes } from './routes/location.js';
import userPerformanceRoutes from './routes/user-performance.js';
import attackRoutes from './routes/attack.js';
import drillsRoutes from './routes/drills.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';



/**
 * Create and configure the Express application
 */
export function createApp(_connectedPlayersMap: Map<string, WebSocket>): express.Application {
  const app = express();

  // Setup middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/', (req: Request, res: Response) => {

    res.json({ status: 'ok' });
  });

  // Setup route modules
  app.use('/battle', authenticateToken, createBattleRoutes());
  app.use('/questions', optionalAuth, createQuestionsRoutes());
  app.use('/location', createLocationRoutes());
  app.use('/user-performance', optionalAuth, userPerformanceRoutes);
  app.use('/attacks', optionalAuth, attackRoutes);
  app.use('/drills', drillsRoutes);

  return app;
}
