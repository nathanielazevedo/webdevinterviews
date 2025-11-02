import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketManager } from './websocket/WebSocketManager.js';
import { BattleTimingManager } from './managers/BattleTimingManager.js';
import { logger } from './utils/logger.js';
import type { Application } from 'express';

const log = logger;

export interface ServerComponents {
  server: Server;
  wsManager: WebSocketManager;
  battleTimingManager: BattleTimingManager;
}

/**
 * Create HTTP server with WebSocket support and initialize managers
 */
export function createServerWithWebSocket(app: Application): ServerComponents {
  // Create HTTP server
  const server = createServer(app);
  
  // Create WebSocket server
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

  log.info('Server and WebSocket components initialized');

  return {
    server,
    wsManager,
    battleTimingManager
  };
}