import { WebSocket } from 'ws';
import type { 
  Player
} from '@webdevinterviews/shared';

// Backend-specific WebSocket types
export interface WebSocketMessage {
  type: string;
  userId?: string;
  testsPassed?: number;
  scheduledStartTime?: string;
  durationMinutes?: number;
  completionTime?: number;
}

export interface PlayerData {
  testsPassed: number;
  joinedAt: string;
}

export interface StatusWatcher {
  ws: WebSocket;
}

export interface BattleResult {
  userId: string;
  testsPassed: number;
  totalTests: number;
  completionTime?: number | null;
}

// Re-export shared Player type for convenience
export type { Player };