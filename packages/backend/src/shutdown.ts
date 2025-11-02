import { Server } from 'http';
import { BattleTimingManager } from './managers/BattleTimingManager.js';

/**
 * Setup graceful shutdown handlers
 */
export function setupGracefulShutdown(
  server: Server, 
  battleTimingManager: BattleTimingManager
): void {
  
  const shutdown = (_signal: string) => {
    
    // Stop battle timing manager
    battleTimingManager.stop();
    
    // Close HTTP server
    server.close(() => {
      process.exit(0);
    });
  };

  // Handle shutdown signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
}
