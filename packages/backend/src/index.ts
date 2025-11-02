import { WebSocket } from 'ws';
import { createApp } from './app.js';
import { createServerWithWebSocket } from './server.js';
import { initializeDatabase } from './startup.js';
import { setupGracefulShutdown } from './shutdown.js';
import { logger } from './utils/logger.js';

const log = logger;

const main = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Create connected players map
    const connectedPlayersMap = new Map<string, WebSocket>();
    
    // Create app with connected players
    const app = createApp(connectedPlayersMap);
    
    // Create server components
    const { server, battleTimingManager } = createServerWithWebSocket(app);
    
    // Setup graceful shutdown
    setupGracefulShutdown(server, battleTimingManager);
    
    // Start the server
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      log.info(`Server running on port ${port}`);
    });
    
    // Start battle timing manager
    battleTimingManager.start();
    
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
main().catch(error => {
  log.error('Startup failed:', error);
  process.exit(1);
});