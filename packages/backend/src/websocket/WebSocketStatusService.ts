import { WebSocket } from 'ws';
import { logger } from '../utils/logger.js';

// Backend-specific types
interface StatusWatcher {
  ws: WebSocket;
}

const log = logger;

export class WebSocketStatusService {
  private statusWatchers: Map<string, StatusWatcher>;

  constructor(statusWatchers: Map<string, StatusWatcher>) {
    this.statusWatchers = statusWatchers;
  }

  /**
   * Add a status watcher connection
   */
  addStatusWatcher(connectionId: string, ws: WebSocket): void {
    log.info(`Adding status watcher: ${connectionId}`);
    this.statusWatchers.set(connectionId, { ws });
    
    // Send confirmation to the watcher
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'status-watcher-connected',
        connectionId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Remove a status watcher
   */
  removeStatusWatcher(connectionId: string): boolean {
    const existed = this.statusWatchers.has(connectionId);
    if (existed) {
      this.statusWatchers.delete(connectionId);
      log.info(`Removed status watcher ${connectionId}`);
    }
    return existed;
  }

  /**
   * Send message to all status watchers
   */
  broadcastToWatchers(message: object): number {
    let sentCount = 0;
    const messageStr = JSON.stringify(message);

    this.statusWatchers.forEach((watcher, connectionId) => {
      if (watcher.ws.readyState === WebSocket.OPEN) {
        try {
          watcher.ws.send(messageStr);
          sentCount++;
          log.debug(`Status message sent to watcher: ${connectionId}`);
        } catch (error) {
          log.error(`Error sending to status watcher ${connectionId}:`, error);
        }
      }
    });

    if (sentCount > 0) {
      log.info(`Status broadcast completed`, {
        totalWatchers: this.statusWatchers.size,
        sentTo: sentCount,
        messageType: (message as Record<string, unknown>).type
      });
    }

    return sentCount;
  }

  /**
   * Send message to specific status watcher
   */
  sendToWatcher(connectionId: string, message: object): boolean {
    const watcher = this.statusWatchers.get(connectionId);
    if (!watcher || watcher.ws.readyState !== WebSocket.OPEN) {
      log.warn(`Cannot send message to watcher ${connectionId}: connection not available`);
      return false;
    }

    try {
      watcher.ws.send(JSON.stringify(message));
      log.debug(`Message sent to watcher ${connectionId}`, { type: (message as Record<string, unknown>).type });
      return true;
    } catch (error) {
      log.error(`Error sending message to watcher ${connectionId}:`, error);
      return false;
    }
  }

  /**
   * Get status watcher statistics
   */
  getWatcherStats() {
    const activeWatchers = Array.from(this.statusWatchers.entries()).filter(
      ([_, watcher]) => watcher.ws.readyState === WebSocket.OPEN
    );

    return {
      totalWatchers: this.statusWatchers.size,
      activeWatchers: activeWatchers.length,
      connectionIds: Array.from(this.statusWatchers.keys())
    };
  }

  /**
   * Clean up stale watcher connections
   */
  cleanupStaleWatchers(): number {
    const staleWatchers: string[] = [];

    for (const [connectionId, watcher] of this.statusWatchers.entries()) {
      if (watcher.ws.readyState !== WebSocket.OPEN) {
        staleWatchers.push(connectionId);
      }
    }

    for (const connectionId of staleWatchers) {
      log.info(`Cleaning up stale status watcher: ${connectionId}`);
      this.statusWatchers.delete(connectionId);
    }

    if (staleWatchers.length > 0) {
      log.info(`Cleaned up ${staleWatchers.length} stale status watchers`);
    }

    return staleWatchers.length;
  }

  /**
   * Check if a status watcher exists and is active
   */
  isWatcherActive(connectionId: string): boolean {
    const watcher = this.statusWatchers.get(connectionId);
    return watcher ? watcher.ws.readyState === WebSocket.OPEN : false;
  }

  /**
   * Get all active watcher connection IDs
   */
  getActiveWatcherIds(): string[] {
    return Array.from(this.statusWatchers.entries())
      .filter(([_, watcher]) => watcher.ws.readyState === WebSocket.OPEN)
      .map(([connectionId, _]) => connectionId);
  }
}