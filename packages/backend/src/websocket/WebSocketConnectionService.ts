import { WebSocket } from 'ws';
import { logger } from '../utils/logger.js';
import type { PlayerData } from '@webdevinterviews/shared';

// Backend-specific types
interface StatusWatcher {
  ws: WebSocket;
}

const log = logger;

export class WebSocketConnectionService {
  private connectedPlayers: Map<string, WebSocket>;
  private playerData: Map<string, PlayerData>;
  private statusWatchers: Map<string, StatusWatcher>;

  constructor(
    connectedPlayers: Map<string, WebSocket>,
    playerData: Map<string, PlayerData>,
    statusWatchers: Map<string, StatusWatcher>
  ) {
    this.connectedPlayers = connectedPlayers;
    this.playerData = playerData;
    this.statusWatchers = statusWatchers;
  }

  /**
   * Add a player connection
   */
  addPlayerConnection(userId: string, ws: WebSocket): void {
    log.info(`Adding player connection for user: ${userId}`);
    this.connectedPlayers.set(userId, ws);
    
    if (!this.playerData.has(userId)) {
      this.playerData.set(userId, {
        testsPassed: 0,
        joinedAt: new Date().toISOString()
      });
    } else {
      // Update existing player data with fresh timestamp
      const existingData = this.playerData.get(userId)!;
      this.playerData.set(userId, {
        ...existingData,
        joinedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Add a status watcher connection
   */
  addStatusWatcher(connectionId: string, ws: WebSocket): void {
    log.info(`Adding status watcher: ${connectionId}`);
    this.statusWatchers.set(connectionId, { ws });
  }

  /**
   * Handle player disconnection cleanup
   */
  handleDisconnection(userId: string, connectionId: string): void {
    log.info(`WebSocket connection closed`, {
      userId,
      connectionId,
      connectedPlayersCount: this.connectedPlayers.size,
      statusWatchersCount: this.statusWatchers.size
    });

    // Remove from connected players
    const wasConnected = this.connectedPlayers.has(userId);
    if (wasConnected) {
      this.connectedPlayers.delete(userId);
      log.info(`Removed player ${userId} from connected players`);
    }

    // Remove from status watchers if exists
    if (this.statusWatchers.has(connectionId)) {
      this.statusWatchers.delete(connectionId);
      log.info(`Removed status watcher ${connectionId}`);
    }

    log.info(`After cleanup - Connected players: ${this.connectedPlayers.size}, Status watchers: ${this.statusWatchers.size}`);
  }

  /**
   * Check if a player is connected
   */
  isPlayerConnected(userId: string): boolean {
    return this.connectedPlayers.has(userId);
  }

  /**
   * Get player WebSocket connection
   */
  getPlayerConnection(userId: string): WebSocket | undefined {
    return this.connectedPlayers.get(userId);
  }

  /**
   * Get all connected player IDs
   */
  getConnectedPlayerIds(): string[] {
    return Array.from(this.connectedPlayers.keys());
  }

  /**
   * Get player data
   */
  getPlayerData(userId: string): PlayerData | undefined {
    return this.playerData.get(userId);
  }

  /**
   * Update player test results
   */
  updatePlayerTestResults(userId: string, testsPassed: number): void {
    const existingData = this.playerData.get(userId);
    if (existingData) {
      this.playerData.set(userId, {
        ...existingData,
        testsPassed
      });
      log.info(`Updated test results for ${userId}: ${testsPassed} tests passed`);
    } else {
      log.warn(`Cannot update test results for ${userId}: player data not found`);
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats() {
    return {
      connectedPlayers: this.connectedPlayers.size,
      statusWatchers: this.statusWatchers.size,
      playerData: this.playerData.size
    };
  }

  /**
   * Clean up stale connections
   */
  cleanupStaleConnections(): void {
    const staleConnections: string[] = [];

    for (const [userId, ws] of this.connectedPlayers.entries()) {
      if (ws.readyState !== WebSocket.OPEN) {
        staleConnections.push(userId);
      }
    }

    for (const userId of staleConnections) {
      log.info(`Cleaning up stale connection for user: ${userId}`);
      this.connectedPlayers.delete(userId);
    }

    if (staleConnections.length > 0) {
      log.info(`Cleaned up ${staleConnections.length} stale connections`);
    }
  }
}