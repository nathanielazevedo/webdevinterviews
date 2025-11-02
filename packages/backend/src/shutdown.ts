import { Server } from 'http';
import { BattleTimingManager } from './managers/BattleTimingManager.js';
import { logger } from './utils/logger.js';

const log = logger;

/**
 * Setup graceful shutdown handlers
 */
export function setupGracefulShutdown(
  server: Server, 
  battleTimingManager: BattleTimingManager
): void {
  
  const shutdown = (signal: string) => {
    log.info(`Received ${signal}, shutting down gracefully...`);
    
    // Stop battle timing manager
    battleTimingManager.stop();
    
    // Close HTTP server
    server.close(() => {
      log.info('Server closed');
      process.exit(0);
    });
  };

  // Handle shutdown signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  log.info('Graceful shutdown handlers registered');
}