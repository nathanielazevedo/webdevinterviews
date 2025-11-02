import { WebSocket } from 'ws';
import type { PlayerData } from '@webdevinterviews/shared';

// Backend-specific types
interface StatusWatcher {
  ws: WebSocket;
}

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
    this.statusWatchers.set(connectionId, { ws });
  }

  /**
   * Handle player disconnection cleanup
   */
  handleDisconnection(userId: string, connectionId: string): void {
    // Remove from connected players
    this.connectedPlayers.delete(userId);

    // Remove from status watchers if exists
    this.statusWatchers.delete(connectionId);
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
      this.connectedPlayers.delete(userId);
    }
  }
}
